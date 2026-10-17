export type Status = "Em Andamento" | "Concluído" | "Dúvida" | "Aguardando Aprovação";
export interface Task { os: string; cliente: string; descricao: string; prazo: string; status: Status; membro: string }
export interface Member { id: string; nome: string; cargo: string }

export const members: Member[] = [
  { id: "carlos", nome: "Carlos Silva", cargo: "Engenheiro Mecânico Sênior" },
  { id: "mariana", nome: "Mariana Souza", cargo: "Engenheira Elétrica" },
  { id: "roberto", nome: "Roberto Dias", cargo: "Engenheiro Civil" },
  { id: "amanda", nome: "Amanda Lima", cargo: "Engenheira de Processos" },
  { id: "fernando", nome: "Fernando Costa", cargo: "Engenheiro de Automação" },
];

function d(offset: number) {
  const x = new Date(); x.setHours(0, 0, 0, 0); x.setDate(x.getDate() + offset);
  return x.toISOString().slice(0, 10);
}

export const tasks: Task[] = [
  { os: "OS-2024-089", cliente: "Petrobras", descricao: "Revisão de projeto de tubulação", prazo: d(2), status: "Em Andamento", membro: "carlos" },
  { os: "OS-2024-091", cliente: "Vale", descricao: "Cálculo estrutural de suporte", prazo: d(5), status: "Dúvida", membro: "carlos" },
  { os: "OS-2024-094", cliente: "Braskem", descricao: "Memorial descritivo de bombas", prazo: d(-3), status: "Concluído", membro: "carlos" },
  { os: "OS-2024-097", cliente: "Gerdau", descricao: "Especificação de redutores", prazo: d(12), status: "Aguardando Aprovação", membro: "carlos" },
  { os: "OS-2024-090", cliente: "Eletrobras", descricao: "Diagrama unifilar subestação", prazo: d(1), status: "Aguardando Aprovação", membro: "mariana" },
  { os: "OS-2024-095", cliente: "CPFL", descricao: "Estudo de seletividade", prazo: d(4), status: "Em Andamento", membro: "mariana" },
  { os: "OS-2024-099", cliente: "Siemens", descricao: "Dimensionamento de cabos", prazo: d(9), status: "Em Andamento", membro: "mariana" },
  { os: "OS-2024-101", cliente: "WEG", descricao: "Lista de materiais elétricos", prazo: d(-1), status: "Concluído", membro: "mariana" },
  { os: "OS-2024-092", cliente: "Odebrecht", descricao: "Projeto de fundação", prazo: d(3), status: "Dúvida", membro: "roberto" },
  { os: "OS-2024-096", cliente: "Andrade Gutierrez", descricao: "Levantamento topográfico", prazo: d(15), status: "Em Andamento", membro: "roberto" },
  { os: "OS-2024-102", cliente: "Camargo Corrêa", descricao: "Laudo de inspeção predial", prazo: d(-5), status: "Concluído", membro: "roberto" },
  { os: "OS-2024-093", cliente: "Ambev", descricao: "Fluxograma de processo (P&ID)", prazo: d(6), status: "Aguardando Aprovação", membro: "amanda" },
  { os: "OS-2024-098", cliente: "Nestlé", descricao: "Balanço de massa da linha 3", prazo: d(2), status: "Em Andamento", membro: "amanda" },
  { os: "OS-2024-103", cliente: "Unilever", descricao: "Análise HAZOP", prazo: d(10), status: "Dúvida", membro: "amanda" },
  { os: "OS-2024-105", cliente: "BRF", descricao: "Otimização de CIP", prazo: d(-2), status: "Concluído", membro: "amanda" },
  { os: "OS-2024-106", cliente: "Suzano", descricao: "Ajuste de malha de controle", prazo: d(20), status: "Em Andamento", membro: "amanda" },
  { os: "OS-2024-100", cliente: "Embraer", descricao: "Programação de CLP", prazo: d(3), status: "Em Andamento", membro: "fernando" },
  { os: "OS-2024-104", cliente: "Bosch", descricao: "Telas supervisórias SCADA", prazo: d(7), status: "Aguardando Aprovação", membro: "fernando" },
  { os: "OS-2024-107", cliente: "ABB", descricao: "Integração de rede Profinet", prazo: d(0), status: "Dúvida", membro: "fernando" },
];
