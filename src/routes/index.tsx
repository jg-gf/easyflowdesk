import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Activity, CalendarClock, HelpCircle, CheckCircle2, LayoutDashboard, Users, ListTodo, Bell, Check } from "lucide-react";
import { members, tasks, type Status } from "@/lib/mock-data";

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
  const [taskList, setTaskList] = useState(tasks);
  const [filtro, setFiltro] = useState("todos");
  const today = new Date(); today.setHours(0, 0, 0, 0);
  const week = new Date(today); week.setDate(today.getDate() + 7);
  const ativas = taskList.filter((t) => t.status !== "Concluído");
  const vencendo = ativas.filter((t) => { const p = new Date(t.prazo + "T00:00:00"); return p >= today && p <= week; });
  const duvidas = taskList.filter((t) => t.status === "Dúvida");
  const aprov = taskList.filter((t) => t.status === "Aguardando Aprovação");
  const lista = filtro === "todos" ? taskList : taskList.filter((t) => t.membro === filtro);
  const nome = (id: string) => members.find((m) => m.id === id)?.nome ?? id;
  const setStatus = (os: string, status: Status) =>
    setTaskList((prev) => prev.map((t) => (t.os === os ? { ...t, status } : t)));

  const kpis = [
    { label: "Tarefas Ativas", value: ativas.length, icon: Activity, cls: "border-border", ic: "text-primary bg-primary/10" },
    { label: "Vencendo nesta Semana", value: vencendo.length, icon: CalendarClock, cls: "border-border", ic: "text-foreground bg-muted" },
    { label: "Dúvidas Pendentes", value: duvidas.length, icon: HelpCircle, cls: "border-warning bg-warning/10", ic: "text-warning-foreground bg-warning/30" },
    { label: "Prontas para Aprovação", value: aprov.length, icon: CheckCircle2, cls: "border-success bg-success/10", ic: "text-success bg-success/15" },
  ];

  return (
    <div className="min-h-screen bg-background">
      <header className="bg-sidebar text-sidebar-foreground">
        <div className="mx-auto flex max-w-7xl flex-col gap-2 px-4 py-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-sidebar-primary p-2"><LayoutDashboard className="h-5 w-5 text-sidebar-primary-foreground" /></div>
            <h1 className="text-lg font-semibold sm:text-xl">FlowDesk - Gestão de Divisão de Engenharia</h1>
          </div>
          <p className="text-sm capitalize opacity-75">{new Date().toLocaleDateString("pt-BR", { weekday: "long", day: "2-digit", month: "long", year: "numeric" })}</p>
        </div>
      </header>

      <main className="mx-auto max-w-7xl space-y-8 px-4 py-8">
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
            {members.map((m) => {
              const mt = taskList.filter((t) => t.membro === m.id);
              const done = mt.filter((t) => t.status === "Concluído").length;
              const pct = Math.round((done / mt.length) * 100);
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
              {[{ id: "todos", nome: "Todos" }, ...members].map((m) => (
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
