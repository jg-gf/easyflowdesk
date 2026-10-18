# Easyflowdesk

Crie uma aplicação web moderna chamada "FlowDesk" voltada para gestão de equipes de engenharia em ambiente corporativo. 

A interface deve ser limpa, profissional e responsiva, utilizando Tailwind CSS, cores neutras (cinza escuro, azul corporativo e toques de verde/amarelo para alertas) e ícones da biblioteca lucide-react.

Nesta primeira versão, utilize dados simulados (mock data) na memória para representar uma divisão de 5 engenheiros:

- Membros: Carlos Silva, Mariana Souza, Roberto Dias, Amanda Lima e Fernando Costa.

- Cada membro possui de 3 a 5 tarefas com: Código OS (ex: OS-2024-089), Cliente, Descrição da Atividade, Prazo e Status atual (Em Andamento, Concluído, Dúvida ou Aguardando Aprovação).

A tela inicial deve conter:

1. Topo: Título "FlowDesk - Gestão de Divisão de Engenharia" e indicação de data atual.

2. Painel de KPIs do Mês (Cards no topo):

   - Total de Tarefas Ativas

   - Tarefas Vencendo nesta Semana

   - Alertas de Dúvidas Pendentes (destaque em amarelo)

   - Tarefas Prontas para Aprovação (destaque em azul/verde)

3. Visão Geral da Equipe: Uma grade de cartões mostrando os 5 membros, a quantidade de tarefas de cada um e uma barra visual de progresso.

4. Tabela/Lista Principal de Tarefas com filtro rápido para ver as tarefas de todos ou selecionar um membro específico.

This project was built with [Lovable](https://lovable.dev).

**Live app**: https://easyflowdesk.lovable.app

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/432fa7ea-0802-4d0d-82b4-be8cdf790b5a).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
