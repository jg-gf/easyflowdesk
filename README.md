# EasyFlowDesk
> *Da planilha ao painel de comando em segundos.*

[![Status do Projeto](https://img.shields.io/badge/Status-MVP%20Conclu%C3%ADdo-brightgreen)](https://lovable.dev)
[![Plataforma](https://img.shields.io/badge/Deploy-Lovable%20Web-blue)](https://lovable.dev)



## 🔗 Endereço da Aplicação Publicada

👉 **[Acesse a aplicação em produção aqui](https://easyflowdesk.lovable.app/)** 

<img src="./screenshot (1).png" alt="EasyFlowDesk - modo claro" width="80%" /> 

<img src="./screenshot (2).png" alt="EasyFlowDesk - modo escuro" width="80%" />



## 1. A Dor Escolhida e Por Que Ela Vale um Negócio

### O Contexto Operacional
Em departamentos de engenharia e operações técnicas de empresas tradicionais, a gestão de demandas e Ordens de Serviço (OS) frequentemente ocorre por meio de planilhas Excel compartilhadas em rede local. Essa realidade é intensificada por **rígidas políticas de segurança de rede e firewall**, que bloqueiam o acesso a ferramentas SaaS de mercado como Monday.com, Trello ou Asana.

### Os Problemas Críticos
1. **Concorrência e Bloqueio de Arquivo:** O Excel em rede só permite que um usuário edite por vez, gerando filas e retrabalho constante.
2. **Dados Desestruturados e "Visão Cega":** Cada membro da equipe possui uma aba própria, com tarefas inseridas como texto livre, sem padronização de códigos de OS, prazos ou status. O encarregado precisa abrir aba por aba para entender a situação do mês.
3. **Resistência Cultural à Mudança:** A equipe rejeita novos sistemas burocráticos ou com curva longa de aprendizado. Querem agilidade e zero esforço cognitivo.

### Por que vale um negócio? (Proposta de Valor)
O **EasyFlowDesk** adota a filosofia **"Spreadsheet-to-Workflow"**: não luta contra o hábito da planilha, mas a transforma em um sistema ágil. O encarregado sobe o mesmo Excel de sempre e, em 2 segundos, a aplicação gera um painel visual autoexplicativo, empoderando o gestor com a visão do mês e o executor com canais rápidos de comunicação.



## 2. Tamanho de Mercado e Business Model Canvas

### 2.1 Tamanho de Mercado (TAM, SAM, SOM)
A estratégia do EasyFlowDesk nasce como **Intraempreendedorismo** com potencial de escala para **SaaS B2B**:

* **SOM (Serviceable Obtainable Market - Piloto Inicial):**
  * **10 divisões** da organização interna (~50 engenheiros/técnicos e encarregados).
  * Foco em validar adoção com custo de aquisição zero e resolver uma dor diária imediata.
* **SAM (Serviceable Addressable Market - Mercado Endereçável):**
  * Departamentos de engenharia e operações de empresas em setores regulados com redes restritas no Brasil (indústria pesada, construção civil, concessionárias de infraestrutura, óleo & gás, setor público).
* **TAM (Total Addressable Market - Mercado Total Potencial):**
  * O mercado global de soluções para equipes dependentes de planilhas (*Workflow Management* e *Spreadsheet-to-App*), onde bilhões de dólares são desperdiçados em horas de retrabalho com planilhas manuais.



### 2.2 Business Model Canvas (BMC)

| Bloco | Descrição Estratégica |
| :--- | :--- |
| **Proposta de Valor** | Transformar planilhas legadas de engenharia em painéis visuais de comando em segundos, com barreira zero de adoção, canal rápido de comunicação ("pedir ajuda"/"aprovação") e total conformidade com redes restritas. |
| **Segmentos de Clientes** | • **Fase 1 (Interno):** Encarregados de divisão e engenheiros executores.<br>• **Fase 2 (SaaS B2B):** Gestores de engenharia e projetos técnicos em empresas com políticas restritivas de TI. |
| **Canais** | • **Fase 1:** Acesso corporativo facilitado e apresentação em reuniões de departamento.<br>• **Fase 2:** Venda consultiva B2B e marketing de conteúdo focado na dor da migração de planilhas. |
| **Relacionamento** | Interface autoexplicativa (self-service), suporte próximo durante o piloto para refinamento contínuo. |
| **Fontes de Receita / ROI** | • **Fase 1 (Interno):** ROI medido em horas de retrabalho economizadas e cumprimento de prazos de OS.<br>• **Fase 2 (Externo):** Assinatura SaaS por divisão/equipe ou licença on-premises. |
| **Recursos Principais** | Código front-end em React/Tailwind gerado via Lovable, parser inteligente de Excel (`xlsx`) processado localmente no navegador e repositório GitHub. |
| **Atividades Principais** | Desenvolvimento e polimento da interface, ajuste contínuo do leitor de planilhas e coleta de feedbacks na divisão piloto. |
| **Parcerias Principais** | Encarregado da divisão piloto (patrocinador do teste) e equipe de TI corporativa. |
| **Estrutura de Custos** | Custo de infraestrutura no MVP = **R$ 0,00** (hospedagem no Lovable/GitHub Pages, sem custos de servidores externos no piloto). |



## 3. Tese que o MVP Testa e o que Ficou Manual de Propósito

### 3.1 A Tese Central do MVP
> *"Acreditamos que, ao transformar uma planilha Excel compartilhada e fragmentada em um painel visual autoexplicativo — com importação instantânea e canais mínimos de interação para o executor ('Pedir Ajuda' e 'Pronto para Aprovação') —, reduziremos o tempo de acompanhamento do encarregado e eliminaremos a resistência do time em redes corporativas restritas, **mesmo sem autenticação de usuários ou sincronização em tempo real**."*

### 3.2 Hipóteses Validadas no MVP
1. **Hipótese de Valor (Gestão):** O encarregado reduz em mais de 50% o tempo para rastrear prazos e gargalos ao visualizar os KPIs do mês em um único painel.
2. **Hipótese de Adoção (Executores):** O time adota a ferramenta porque o **"Botão de Comissário"** (Pedir Ajuda) e o aviso de **"Pronto para Aprovação"** agilizam a comunicação sem a burocracia de reuniões ou mensagens soltas.
3. **Hipótese de Viabilidade Técnica:** A aplicação opera de forma leve no navegador sem depender de infraestrutura pesada de TI.

### 3.3 O que Ficou Manual de Propósito (e Por Quê)
* **Sem Autenticação/Logins:** Evita atrito de cadastro e semanas de homologação com Active Directory da empresa. O usuário apenas seleciona sua visão.
* **Carga Inicial Local (Sem Banco em Tempo Real):** Elimina a necessidade de bancos de dados em nuvem pública (que poderiam ser barrados por firewalls).
* **Exportação Contínua como Backlog:** O foco inicial é o *consumo e acompanhamento*; se for necessário reportar externamente, a planilha original permanece como arquivo de segurança.
* **Tratamento de Dados no Navegador:** Leitura direta via JavaScript (`SheetJS`), economizando tokens de API e mantendo os dados confidenciais restritos à máquina local do usuário.



## 4. Engenharia de Prompts (Mega Prompt e Refinamentos)

O desenvolvimento no **Lovable** foi conduzido de forma estratégica para caber nos limites do plano gratuito diário, seguindo três etapas iterativas apresentadas abaixo. Os prompts foram refinados a partir da aplicação "DIO Agent", apresentada durante o bootcamp, utilizada no Google Antigravity. Abaixo, os prompts utilizados:

### 4.1 Prompt 1: Fundação Visual e Estrutura da Divisão (Dia 1)
```text
Crie uma aplicação web moderna chamada "FlowDesk" voltada para gestão de equipes de engenharia em rede restrita, usando React, Tailwind CSS e ícones da lucide-react.

A tela principal deve conter:
1. Topo: Título "FlowDesk - Gestão de Divisão" com a data atual.
2. 4 Cards de KPIs no topo (que atualizam automaticamente ao clicar nas tarefas):
   - Total de Tarefas Ativas
   - Vencendo na Semana
   - Alertas de Dúvidas Pendentes (destaque em amarelo)
   - Prontas para Aprovação (destaque em verde)
3. Filtro por Membro da Equipe: Botões no topo para filtrar a visão de todos ou de 5 pessoas simuladas (Carlos, Mariana, Roberto, Amanda, Fernando).
4. Lista de Tarefas (crie 3 tarefas de exemplo para cada um com Código OS, Descrição, Prazo e Status).
5. Ações Rápidas em cada tarefa:
   - Botão "Pedir Ajuda / Dúvida" (com ícone de campainha/alerta): ao clicar, a tarefa ganha borda amarela e o contador de dúvidas nos KPIs aumenta.
   - Botão "Pronto para Aprovação" (com ícone de check): ao clicar, o status muda para "Aguardando Aprovação" e o contador correspondente nos KPIs aumenta.
```

### 4.2 Prompt de Correção / Refinamento Interativo
* **Motivo:** O Lovable gerou a coluna de status como uma etiqueta estática de leitura, sem os botões clicáveis para o executor.
```text
Ficou excelente visualmente! Agora precisamos adicionar a interação dos colaboradores na tabela de tarefas:

1. Adicione uma nova coluna chamada "AÇÕES" à direita da coluna "Status".
2. Em cada linha da tabela, coloque dois botões de ação rápida clicáveis:
   - Botão "Pedir Ajuda" (com ícone de campainha/alerta, botão suave com tom amarelo): ao clicar, altera o status dessa tarefa para "Dúvida" e atualiza o contador do KPI do topo.
   - Botão "Pronto para Aprovação" (com ícone de check, botão suave com tom verde): ao clicar, altera o status para "Aguardando Aprovação" e atualiza o KPI correspondente.
3. Se a tarefa já estiver com o status "Dúvida", exiba no lugar o botão "Dúvida Resolvida" para que ela volte ao status "Em Andamento".
```

### 4.3 Prompt 2: Ingestão de Planilha Real (.xlsx) e Persistência
```text
Adicione a funcionalidade de importar planilhas Excel (.xlsx) reais para o FlowDesk:

1. Utilize a biblioteca xlsx (SheetJS) para processar o arquivo 100% no navegador (client-side), sem envio para servidores externos.
2. Adicione no topo uma área clara para "Carregar Planilha do Mês (.xlsx)".
3. Regra de importação:
   - Cada aba da planilha deve ser lida como o nome de um membro da equipe.
   - Dentro de cada aba, leia as colunas de "Descrição" e "Prazo".
4. Ao carregar a planilha, substitua os dados de exemplo pelas tarefas reais do arquivo e recalcule os KPIs.
5. Salve o estado no localStorage do navegador para que os dados e marcações de dúvidas não sumam ao atualizar (F5) a página. Adicione um botão pequeno de "Voltar para dados de exemplo".
```



## 5. Tecnologias Utilizadas

* **Front-end:** React, Vite, Tailwind CSS
* **Ícones:** Lucide React
* **Processamento de Planilhas:** SheetJS (`xlsx`) no cliente
* **Persistência de Dados:** Web Storage API (`localStorage`)
* **Geração e Prototipação com IA:** Lovable
* **Hospedagem & Versionamento:** GitHub & Lovable Web

---

*Projeto desenvolvido como parte do módulo **MeuNegócio.AI: Construindo um Produto Digital com Agentes de IA e Lovable** (Santander / DIO).*
