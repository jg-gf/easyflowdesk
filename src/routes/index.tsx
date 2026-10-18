import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState, type ChangeEvent } from "react";
import { Activity, CalendarClock, HelpCircle, CheckCircle2, LayoutDashboard, Users, ListTodo, Bell, Check, Upload, RotateCcw, Loader2, FileSpreadsheet } from "lucide-react";
import { members, tasks, type Status } from "@/lib/mock-data";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";
import { STORAGE_KEY, restoreState, updateStatus, getKpis, importSpreadsheet, type DeskState } from "@/lib/flowdesk-data";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "FlowDesk - Gestão de Divisão de Engenharia" },
      { name: "description", content: "Painel de gestão de tarefas e equipe da divisão de engenharia." },
      { property: "og:title", content: "FlowDesk - Gestão de Divisão de Engenharia" },
      { property: "og:description", content: "Painel de gestão de tarefas e equipe da divisão de engenharia." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Index,
});

const statusStyle: Record<Status, string> = {
  "Em Andamento": "bg-primary/10 text-primary border-primary/30",
  "Concluído": "bg-success/15 text-success border-success/30",
  "Dúvida": "bg-warning/20 text-warning-foreground border-warning/50",
  "Aguardando Aprovação": "bg-info/15 text-info border-info/30",
};

const fmt = (s: string) => new Date(s + "T00:00:00").toLocaleDateString("pt-BR");

function Index() {
  const [desk, setDesk] = useState<DeskState>({ members, tasks, source: null });
  const [ready, setReady] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [storageError, setStorageError] = useState("");
  const fileInput = useRef<HTMLInputElement>(null);
  const [filtro, setFiltro] = useState("todos");
  const taskList = desk.tasks;
  const team = desk.members;
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setDesk(restoreState(raw));
    } catch {
      setStorageError("Não foi possível recuperar os dados salvos neste navegador.");
    }
    setReady(true);
  }, []);
  useEffect(() => {
    if (!ready) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(desk));
      setStorageError("");
    } catch {
      setStorageError("O navegador não permitiu salvar os dados. As alterações podem se perder ao atualizar a página.");
    }
  }, [desk, ready]);

  async function loadFile(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;
    setError("");
    if (!file.name.toLowerCase().endsWith(".xlsx")) {
      setError("Selecione um arquivo Excel com extensão .xlsx.");
      return;
    }
    setLoading(true);
    try {
      const imported = await importSpreadsheet(await file.arrayBuffer(), file.name);
      setDesk(imported);
      setFiltro("todos");
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Não foi possível importar a planilha. Os dados atuais foram mantidos.");
    } finally { setLoading(false); }
  }
  function resetExamples() {
    if (!window.confirm("Voltar para dados de exemplo? As tarefas atuais e suas marcações serão substituídas.")) return;
    setDesk({ members, tasks, source: null });
    setFiltro("todos");
    setError("");
  }
  const today = new Date(); today.setHours(0, 0, 0, 0);
  const counts = getKpis(taskList, today);
  const lista = filtro === "todos" ? taskList : taskList.filter((t) => t.membro === filtro);
  const nome = (id: string) => team.find((m) => m.id === id)?.nome ?? id;
  const setStatus = (os: string, status: Status) =>
    setDesk((prev) => ({ ...prev, tasks: updateStatus(prev.tasks, os, status) }));

  const kpis = [
    { label: "Tarefas Ativas", value: counts.active, icon: Activity, cls: "border-border", ic: "text-primary bg-primary/10" },
    { label: "Vencendo nesta Semana", value: counts.due, icon: CalendarClock, cls: "border-border", ic: "text-foreground bg-muted" },
    { label: "Dúvidas Pendentes", value: counts.doubts, icon: HelpCircle, cls: "border-warning bg-warning/10", ic: "text-warning-foreground bg-warning/30" },
    { label: "Prontas para Aprovação", value: counts.approval, icon: CheckCircle2, cls: "border-success bg-success/10", ic: "text-success bg-success/15" },
  ];

  return (
    <div className="min-h-screen bg-background">
      <header className="bg-sidebar text-sidebar-foreground">
        <div className="mx-auto flex max-w-7xl flex-col gap-2 px-4 py-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-sidebar-primary p-2"><LayoutDashboard className="h-5 w-5 text-sidebar-primary-foreground" /></div>
            <h1 className="text-lg font-semibold sm:text-xl">FlowDesk - Gestão de Divisão de Engenharia</h1>
          </div>
          <div className="flex items-center justify-between gap-3 sm:justify-end">
            <p className="text-sm capitalize opacity-75">{new Date().toLocaleDateString("pt-BR", { weekday: "long", day: "2-digit", month: "long", year: "numeric" })}</p>
            <ThemeToggle />
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl space-y-8 px-4 py-8">
        <section className="border-b border-border pb-6" aria-label="Planilha do mês">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex min-w-0 items-center gap-3">
              <FileSpreadsheet className="h-6 w-6 shrink-0 text-primary" />
              <div className="min-w-0">
                <h2 className="font-semibold text-foreground">Planilha do Mês</h2>
                <p className="break-all text-sm text-muted-foreground" role="status">{desk.source ?? "Dados de exemplo"}</p>
              </div>
            </div>
            <div className="flex flex-col gap-2 sm:items-end">
              <input ref={fileInput} type="file" accept=".xlsx,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" className="hidden" aria-label="Carregar Planilha do Mês (.xlsx)" onChange={loadFile} disabled={!ready || loading} />
              <Button className="h-auto min-h-9 whitespace-normal text-left" onClick={() => fileInput.current?.click()} disabled={!ready || loading}>
                {loading ? <Loader2 className="animate-spin" /> : <Upload />}
                {loading ? "Carregando planilha…" : "Carregar Planilha do Mês (.xlsx)"}
              </Button>
              <Button size="sm" variant="ghost" className="h-auto whitespace-normal text-muted-foreground" onClick={resetExamples} disabled={!ready || loading}>
                <RotateCcw />Voltar para dados de exemplo
              </Button>
            </div>
          </div>
          {error && <p role="alert" className="mt-3 text-sm text-destructive">{error}</p>}
          {storageError && <p role="alert" className="mt-3 text-sm text-warning-foreground">{storageError}</p>}
        </section>
        <section>
          <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-muted-foreground">KPIs do Mês</h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {kpis.map((k) => (
              <div key={k.label} className={`flex items-center gap-4 rounded-xl border bg-card p-5 shadow-sm ${k.cls}`}>
                <div className={`rounded-lg p-3 ${k.ic}`}><k.icon className="h-6 w-6" /></div>
                <div><p className="text-3xl font-bold text-foreground">{k.value}</p><p className="text-sm text-muted-foreground">{k.label}</p></div>
              </div>
            ))}
          </div>
        </section>

        <section>
          <h2 className="mb-3 flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-muted-foreground"><Users className="h-4 w-4" />Visão Geral da Equipe</h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
            {team.map((m) => {
              const mt = taskList.filter((t) => t.membro === m.id);
              const done = mt.filter((t) => t.status === "Concluído").length;
              const pct = mt.length ? Math.round((done / mt.length) * 100) : 0;
              const initials = m.nome.split(" ").map((p) => p[0]).join("");
              return (
                <button key={m.id} onClick={() => setFiltro(m.id)}
                  className={`rounded-xl border bg-card p-4 text-left shadow-sm transition hover:border-primary ${filtro === m.id ? "border-primary ring-2 ring-primary/20" : ""}`}>
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-sm font-semibold text-primary-foreground">{initials}</div>
                    <div className="min-w-0"><p className="truncate font-medium text-foreground">{m.nome}</p><p className="truncate text-xs text-muted-foreground">{m.cargo}</p></div>
                  </div>
                  <p className="mt-3 text-sm text-muted-foreground">{mt.length} tarefas · {done} concluídas</p>
                  <div className="mt-2 h-2 overflow-hidden rounded-full bg-muted"><div className="h-full rounded-full bg-success" style={{ width: `${pct}%` }} /></div>
                  <p className="mt-1 text-right text-xs text-muted-foreground">{pct}%</p>
                </button>
              );
            })}
          </div>
        </section>

        <section className="rounded-xl border bg-card shadow-sm">
          <div className="flex flex-col gap-3 border-b p-4 sm:flex-row sm:items-center sm:justify-between">
            <h2 className="flex items-center gap-2 font-semibold text-foreground"><ListTodo className="h-5 w-5 text-primary" />Tarefas ({lista.length})</h2>
            <div className="flex flex-wrap gap-2">
              {[{ id: "todos", nome: "Todos" }, ...team].map((m) => (
                <button key={m.id} onClick={() => setFiltro(m.id)}
                  className={`rounded-full border px-3 py-1 text-xs font-medium transition ${filtro === m.id ? "border-primary bg-primary text-primary-foreground" : "bg-background text-muted-foreground hover:bg-muted"}`}>
                  {m.id === "todos" ? "Todos" : m.nome.split(" ")[0]}
                </button>
              ))}
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-muted/50 text-left text-xs uppercase text-muted-foreground">
                <tr><th className="px-4 py-3">Código OS</th><th className="px-4 py-3">Cliente</th><th className="px-4 py-3">Atividade</th><th className="px-4 py-3">Responsável</th><th className="px-4 py-3">Prazo</th><th className="px-4 py-3">Status</th><th className="px-4 py-3 text-right">Ações</th></tr>
              </thead>
              <tbody>
                {lista.length === 0 && <tr><td colSpan={7} className="px-4 py-8 text-center text-muted-foreground">Nenhuma tarefa para este membro.</td></tr>}
                {lista.map((t) => {
                  const late = t.status !== "Concluído" && new Date(t.prazo + "T00:00:00") < today;
                  return (
                    <tr key={t.os} className="border-t hover:bg-muted/30">
                      <td className="px-4 py-3 font-mono text-xs font-semibold text-foreground">{t.os}</td>
                      <td className="px-4 py-3 text-foreground">{t.cliente}</td>
                      <td className="px-4 py-3 text-muted-foreground">{t.descricao}</td>
                      <td className="px-4 py-3 text-foreground">{nome(t.membro)}</td>
                      <td className={`px-4 py-3 whitespace-nowrap ${late ? "font-semibold text-destructive" : "text-foreground"}`}>{fmt(t.prazo)}</td>
                      <td className="px-4 py-3"><span className={`whitespace-nowrap rounded-full border px-2.5 py-0.5 text-xs font-medium ${statusStyle[t.status]}`}>{t.status}</span></td>
                      <td className="px-4 py-3 text-right whitespace-nowrap">
                        {t.status === "Dúvida" ? (
                          <button onClick={() => setStatus(t.os, "Em Andamento")}
                            className="inline-flex items-center gap-1.5 rounded-md border border-success/40 bg-success/15 px-2.5 py-1.5 text-xs font-medium text-success transition hover:bg-success/25">
                            <Check className="h-3.5 w-3.5" />Dúvida Resolvida
                          </button>
                        ) : t.status === "Em Andamento" ? (
                          <div className="flex justify-end gap-2">
                            <button onClick={() => setStatus(t.os, "Dúvida")}
                              className="inline-flex items-center gap-1.5 rounded-md border border-warning/40 bg-warning/15 px-2.5 py-1.5 text-xs font-medium text-warning-foreground transition hover:bg-warning/25">
                              <Bell className="h-3.5 w-3.5" />Pedir Ajuda
                            </button>
                            <button onClick={() => setStatus(t.os, "Aguardando Aprovação")}
                              className="inline-flex items-center gap-1.5 rounded-md border border-success/40 bg-success/15 px-2.5 py-1.5 text-xs font-medium text-success transition hover:bg-success/25">
                              <Check className="h-3.5 w-3.5" />Pronto para Aprovação
                            </button>
                          </div>
                        ) : t.status === "Aguardando Aprovação" ? (
                          <div className="flex justify-end gap-2">
                            <button onClick={() => setStatus(t.os, "Em Andamento")}
                              className="inline-flex items-center gap-1.5 rounded-md border border-warning/40 bg-warning/15 px-2.5 py-1.5 text-xs font-medium text-warning-foreground transition hover:bg-warning/25">
                              <RotateCcw className="h-3.5 w-3.5" />Revisar
                            </button>
                            <button onClick={() => setStatus(t.os, "Concluído")}
                              className="inline-flex items-center gap-1.5 rounded-md border border-success/40 bg-success/15 px-2.5 py-1.5 text-xs font-medium text-success transition hover:bg-success/25">
                              <CheckCircle2 className="h-3.5 w-3.5" />Concluir
                            </button>
                          </div>
                        ) : (
                          <span className="text-xs text-muted-foreground">—</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </section>
      </main>
    </div>
  );
}
