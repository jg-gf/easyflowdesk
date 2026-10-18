import { describe, expect, it } from "vitest";
import * as XLSX from "xlsx";
import { importSpreadsheet, getKpis, restoreState, updateStatus, extractOs } from "@/lib/flowdesk-data";

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
  it("extracts the OS code from the description and cleans residual punctuation", async () => {
    const state = await importSpreadsheet(file({ Ana: [["Descrição", "Prazo"], ["21-018-2026-001: Revisão estrutural", "18/10/2026"], ["[132-019-2026-001] Inspeção de campo", "19/10/2026"], ["Projeto 1221-005-2026-001 final", "20/10/2026"]] }), "a.xlsx");
    expect(state.tasks.map((t) => t.os)).toEqual(["21-018-2026-001", "132-019-2026-001", "1221-005-2026-001"]);
    expect(state.tasks.map((t) => t.descricao)).toEqual(["Revisão estrutural", "Inspeção de campo", "Projeto final"]);
  });
  it("prefers an explicit OS column over the description text", async () => {
    const state = await importSpreadsheet(file({ Ana: [["OS", "Descrição", "Prazo"], ["21-018-2026-001", "Revisão 132-019-2026-001", "18/10/2026"]] }), "a.xlsx");
    expect(state.tasks[0]?.os).toBe("21-018-2026-001");
    expect(state.tasks[0]?.descricao).toBe("Revisão 132-019-2026-001");
  });
  it("keeps the automatic fallback code when no OS pattern exists", async () => {
    expect(extractOs("Projeto sem código")).toEqual({ os: null, descricao: "Projeto sem código" });
    const state = await importSpreadsheet(file({ Ana: [["Descrição", "Prazo"], ["Projeto sem código", "18/10/2026"]] }), "a.xlsx");
    expect(state.tasks[0]?.os).toBe("IMP-1-2");
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
  it("finishes or returns a task waiting for approval", async () => {
    const state = await importSpreadsheet(file({ Ana: [["Descrição", "Prazo"], ["A", "18/10/2026"], ["B", "30/10/2026"]] }), "a.xlsx");
    const now = new Date("2026-10-17T12:00:00");
    const [first, second] = state.tasks;
    if (!first || !second) throw new Error("Expected two imported tasks");
    const pending = updateStatus(updateStatus(state.tasks, first.os, "Aguardando Aprovação"), second.os, "Aguardando Aprovação");
    expect(getKpis(pending, now)).toEqual({ active: 2, due: 1, doubts: 0, approval: 2 });
    const finished = updateStatus(pending, first.os, "Concluído");
    expect(getKpis(finished, now)).toEqual({ active: 1, due: 0, doubts: 0, approval: 1 });
    expect(getKpis(updateStatus(finished, second.os, "Em Andamento"), now)).toEqual({ active: 1, due: 0, doubts: 0, approval: 0 });
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