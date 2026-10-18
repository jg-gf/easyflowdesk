import { z } from "zod";
import type { Member, Task, Status } from "./mock-data";

export const STORAGE_KEY = "flowdesk.month.v1";

const dateSchema = z.string().regex(/^\d{4}-\d{2}-\d{2}$/).refine((value) => {
  const date = new Date(`${value}T00:00:00Z`);
  return !Number.isNaN(date.getTime()) && date.toISOString().slice(0, 10) === value;
});
const stateSchema = z.object({
  members: z.array(z.object({ id: z.string(), nome: z.string(), cargo: z.string() })),
  tasks: z.array(z.object({ os: z.string(), cliente: z.string(), descricao: z.string(), prazo: dateSchema,
    status: z.enum(["Em Andamento", "Concluído", "Dúvida", "Aguardando Aprovação"]), membro: z.string() })),
  source: z.string().nullable(),
});
export interface DeskState { members: Member[]; tasks: Task[]; source: string | null }

export function restoreState(raw: string): DeskState {
  const state = stateSchema.parse(JSON.parse(raw));
  const ids = new Set(state.members.map((m) => m.id));
  if (ids.size !== state.members.length || new Set(state.tasks.map((t) => t.os)).size !== state.tasks.length ||
    state.tasks.some((t) => !ids.has(t.membro))) throw new Error("Dados salvos inválidos.");
  return state;
}

export function updateStatus(tasks: Task[], os: string, status: Status): Task[] {
  return tasks.map((task) => task.os === os ? { ...task, status } : task);
}

export function getKpis(tasks: Task[], now: Date) {
  const today = new Date(now); today.setHours(0, 0, 0, 0);
  const week = new Date(today); week.setDate(today.getDate() + 7);
  const active = tasks.filter((t) => t.status !== "Concluído");
  return {
    active: active.length,
    due: active.filter((t) => { const date = new Date(`${t.prazo}T00:00:00`); return date >= today && date <= week; }).length,
    doubts: tasks.filter((t) => t.status === "Dúvida").length,
    approval: tasks.filter((t) => t.status === "Aguardando Aprovação").length,
  };
}

const OS_PATTERN = /\b\d{2,4}-\d{3}-\d{4}-\d{3}\b/;

export function extractOs(text: string): { os: string | null; descricao: string } {
  const match = text.match(OS_PATTERN);
  if (!match) return { os: null, descricao: text };
  const descricao = text
    .replace(OS_PATTERN, " ")
    .replace(/[\s]*[[\](){}:;,.-]+[\s]*/g, " ")
    .replace(/\s{2,}/g, " ")
    .trim();
  return { os: match[0], descricao };
}

export async function importSpreadsheet(buffer: ArrayBuffer, filename: string): Promise<DeskState> {
  const XLSX = await import("xlsx");
  let workbook: ReturnType<typeof XLSX.read>;
  try { workbook = XLSX.read(buffer, { type: "array" }); }
  catch { throw new Error("Não foi possível ler a planilha. Selecione um arquivo .xlsx válido."); }
  const members: Member[] = [];
  const tasks: Task[] = [];
  const normalize = (value: unknown) => String(value ?? "").trim().normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
  const date1904 = Boolean(workbook.Workbook?.WBProps?.date1904);

  function parseDate(value: unknown): string | null {
    let result: string;
    if (typeof value === "number") {
      const parts = XLSX.SSF.parse_date_code(value, { date1904 });
      if (!parts) return null;
      result = `${String(parts.y).padStart(4, "0")}-${String(parts.m).padStart(2, "0")}-${String(parts.d).padStart(2, "0")}`;
    } else if (value instanceof Date && !Number.isNaN(value.getTime())) {
      result = `${value.getFullYear()}-${String(value.getMonth() + 1).padStart(2, "0")}-${String(value.getDate()).padStart(2, "0")}`;
    } else {
      const text = String(value ?? "").trim();
      const br = text.match(/^(\d{1,2})[\/-](\d{1,2})[\/-](\d{4})$/);
      result = br?.[1] && br[2] && br[3] ? `${br[3]}-${br[2].padStart(2, "0")}-${br[1].padStart(2, "0")}` : text;
    }
    return dateSchema.safeParse(result).success ? result : null;
  }

  for (const [index, name] of workbook.SheetNames.entries()) {
    const member = { id: `sheet-${index + 1}`, nome: name, cargo: "Engenharia" };
    members.push(member);
    const sheet = workbook.Sheets[name];
    if (!sheet) continue;
    const rows = XLSX.utils.sheet_to_json<unknown[]>(sheet, { header: 1, defval: "", blankrows: true, range: 0 });
    if (rows.every((row) => row.every((cell) => String(cell ?? "").trim() === ""))) continue;
    const headerIndex = rows.findIndex((row) => row.some((cell) => normalize(cell) === "descricao") && row.some((cell) => normalize(cell) === "prazo"));
    const header = rows[headerIndex];
    if (!header) throw new Error(`A aba “${name}” precisa das colunas Descrição e Prazo.`);
    const descriptionIndex = header.findIndex((cell) => normalize(cell) === "descricao");
    const dueIndex = header.findIndex((cell) => normalize(cell) === "prazo");
    const osIndex = header.findIndex((cell) => normalize(cell) === "os");
    for (let rowIndex = headerIndex + 1; rowIndex < rows.length; rowIndex++) {
      const row = rows[rowIndex];
      if (!row || row.every((cell) => String(cell ?? "").trim() === "")) continue;
      const description = String(row[descriptionIndex] ?? "").trim();
      if (!description) throw new Error(`Aba “${name}”, linha ${rowIndex + 1}: preencha a Descrição.`);
      const due = parseDate(row[dueIndex]);
      if (!due) throw new Error(`Aba “${name}”, linha ${rowIndex + 1}: Prazo inválido. Use uma data do Excel ou DD/MM/AAAA.`);
      const osColumn = osIndex >= 0 ? String(row[osIndex] ?? "").trim() : "";
      const extracted = extractOs(description);
      const os = osColumn || extracted.os || `IMP-${index + 1}-${rowIndex + 1}`;
      tasks.push({ os, cliente: "—", descricao: osColumn ? description : extracted.descricao, prazo: due, status: "Em Andamento", membro: member.id });
    }
  }
  if (!tasks.length) throw new Error("A planilha não contém tarefas. Os dados atuais foram mantidos.");
  return { members, tasks, source: filename };
}