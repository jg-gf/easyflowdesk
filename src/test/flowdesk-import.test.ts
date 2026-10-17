import { describe, expect, it } from "vitest";
import * as XLSX from "xlsx";
import { importSpreadsheet, getKpis, restoreState, updateStatus } from "@/lib/flowdesk-data";

function file(sheets: Record<string, unknown[][]>, date1904 = false): ArrayBuffer {
  const workbook = XLSX.utils.book_new();
  workbook.Workbook = { WBProps: { date1904 } };
  for (const [name, rows] of Object.entries(sheets)) XLSX.utils.book_append_sheet(workbook, XLSX.utils.aoa_to_sheet(rows), name);
  return XLSX.write(workbook, { type: "array", bookType: "xlsx" });
}

describe("FlowDesk Excel import", () => {
  it("uses every worksheet name as a member and imports Descrição and Prazo only", async () => {
    const state = await importSpreadsheet(file({ "Carlos Silva": [["Descrição", "Prazo"], ["Projeto real", "18/10/2026"]], "Joana Reis": [["Prazo", "Descrição"], ["2026-10-20", "Inspeção"]], "Equipe vazia": [] }), "outubro.xlsx");
    expect(state.members.map((m) => m.nome)).toEqual(["Carlos Silva", "Joana Reis", "Equipe vazia"]);
    expect(state.tasks.map((t) => [t.descricao, t.prazo, t.status, t.membro])).toEqual([["Projeto real", "2026-10-18", "Em Andamento", "sheet-1"], ["Inspeção", "2026-10-20", "Em Andamento", "sheet-2"]]);
    expect(state.tasks).toHaveLength(2);
    expect(state.source).toBe("outubro.xlsx");
  });
  it("reads native Excel dates and the 1904 date system", async () => {
    const regular = await importSpreadsheet(file({ Ana: [["Descrição", "Prazo"], ["A", 46313]] }), "a.xlsx");
    const legacy = await importSpreadsheet(file({ Ana: [["Descrição", "Prazo"], ["A", 44851]] }, true), "b.xlsx");
    expect(regular.tasks[0]?.prazo).toBe("2026-10-18");
    expect(legacy.tasks[0]?.prazo).toBe("2026-10-18");
  });
  it("rejects invalid dates with sheet and row context", async () => {
    await expect(importSpreadsheet(file({ Ana: [["Descrição", "Prazo"], ["A", "31/02/2026"]] }), "a.xlsx")).rejects.toThrow("linha 2: Prazo inválido");
  });
  it("requires Descrição and Prazo in nonempty sheets", async () => {
    await expect(importSpreadsheet(file({ Ana: [["Atividade", "Prazo"], ["A", "18/10/2026"]] }), "a.xlsx")).rejects.toThrow("colunas Descrição e Prazo");
  });
  it("does not replace data with an empty import", async () => {
    await expect(importSpreadsheet(file({ Ana: [["Descrição", "Prazo"]] }), "a.xlsx")).rejects.toThrow("não contém tarefas");
  });
  it("recalculates KPIs from imported tasks and status changes", async () => {
    const state = await importSpreadsheet(file({ Ana: [["Descrição", "Prazo"], ["A", "18/10/2026"], ["B", "30/10/2026"]] }), "a.xlsx");
    const now = new Date("2026-10-17T12:00:00");
    expect(getKpis(state.tasks, now)).toEqual({ active: 2, due: 1, doubts: 0, approval: 0 });
    const [first, second] = state.tasks;
    if (!first || !second) throw new Error("Expected two imported tasks");
    const doubt = updateStatus(state.tasks, first.os, "Dúvida");
    expect(getKpis(doubt, now).doubts).toBe(1);
    const resolved = updateStatus(doubt, first.os, "Em Andamento");
    expect(getKpis(resolved, now).doubts).toBe(0);
    expect(getKpis(updateStatus(resolved, second.os, "Aguardando Aprovação"), now).approval).toBe(1);
  });
  it("restores imported members, tasks, and help markings from saved JSON", async () => {
    const state = await importSpreadsheet(file({ Ana: [["Descrição", "Prazo"], ["A", "18/10/2026"]] }), "a.xlsx");
    const first = state.tasks[0];
    if (!first) throw new Error("Expected an imported task");
    state.tasks = updateStatus(state.tasks, first.os, "Dúvida");
    localStorage.setItem("flowdesk-test", JSON.stringify(state));
    expect(restoreState(localStorage.getItem("flowdesk-test") ?? "")).toEqual(state);
    localStorage.removeItem("flowdesk-test");
  });
});