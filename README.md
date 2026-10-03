# TaskFlow • Lista de Tarefas Moderna

Um aplicativo web moderno, intuitivo e completo para gerenciamento de tarefas pessoais e profissionais, construído com **React 18**, **Vite**, **Tailwind CSS** e integrado ao **Supabase** para persistência e sincronização em tempo real na nuvem.

---

## 🚀 Funcionalidades Principais

- **CRUD Completo de Tarefas:**
  - Criação rápida com título, descrição, categoria, prioridade e data de vencimento.
  - Edição de tarefas existentes com formulário modal interativo.
  - Exclusão segura com diálogo de confirmação.
  - Conclusão rápida com checkbox animado, efeito de riscado e celebração visual com confetes.
- **Sincronização em Tempo Real (Supabase Cloud):**
  - Persistência direta no banco de dados PostgreSQL via Supabase.
  - Atualizações otimistas na interface (0ms de latência percebida).
  - Sincronização em tempo real (*Realtime Channels*) entre abas e dispositivos.
  - Fallback automático e seguro com cache no `localStorage` em caso de perda de conexão.
- **Organização e Produtividade:**
  - **Categorização Visual:** *Trabalho*, *Pessoal*, *Estudos*, *Saúde* e *Finanças* com cores e badges distintos.
  - **Níveis de Prioridade:** *Alta*, *Média* e *Baixa* com destaque visual.
  - **Controle de Prazos:** Identificação automática de tarefas atrasadas e vencendo hoje.
- **Filtros Avançados e Busca:**
  - Filtros rápidos por status (*Todas*, *Pendentes* e *Concluídas*).
  - Busca textual em tempo real por título ou descrição.
  - Filtragem combinada por categoria e nível de prioridade.
- **Visualizações Múltiplas:**
  - 📌 **Minhas Tarefas:** Visão em lista com ações rápidas e ordenação inteligente.
  - 📊 **Dashboard de Análises:** Gráficos de distribuição por categoria, volume por prioridade e métricas de taxa de conclusão.
  - 📅 **Calendário Interativo:** Grade mensal para visualização e agendamento de tarefas por data.

---

## 🛠️ Tecnologias Utilizadas

- **Frontend:** [React 18](https://react.dev/)
- **Build Tool:** [Vite 5](https://vitejs.dev/)
- **Backend & Database:** [Supabase](https://supabase.com/) (`@supabase/supabase-js`)
- **Estilização:** [Tailwind CSS 3](https://tailwindcss.com/)
- **Ícones:** [Lucide React](https://lucide.dev/)
- **Micro-interações:** [Canvas Confetti](https://www.npmjs.com/package/canvas-confetti)
- **Tipografia:** Google Fonts (*Plus Jakarta Sans* & *Inter*)

---

## 📦 Estrutura do Projeto

```text
├── src/
│   ├── components/
│   │   ├── AnalyticsView.jsx     # Dashboard de métricas e produtividade
│   │   ├── CalendarView.jsx      # Visão em grade de calendário mensal
│   │   ├── CategoryBadge.jsx     # Tag de identificação de categoria
│   │   ├── ConfirmModal.jsx      # Modal de confirmação para ações críticas
│   │   ├── Navbar.jsx            # Barra de navegação com status do Supabase
│   │   ├── PriorityBadge.jsx     # Tag de identificação de prioridade
│   │   ├── TaskFilters.jsx       # Barra de pesquisa e filtros
│   │   ├── TaskItem.jsx          # Componente individual de tarefa
│   │   ├── TaskList.jsx          # Lista de tarefas e estados vazios
│   │   └── TaskModal.jsx         # Modal de criação e edição de tarefas
│   ├── constants/
│   │   ├── categories.js         # Configurações de cores e badges de categorias
│   │   └── priorities.js         # Configurações de prioridades
│   ├── hooks/
│   │   └── useTasks.js           # Hook customizado de estado, filtros e sincronização
│   ├── services/
│   │   ├── storageService.js     # Fallback e cache local (LocalStorage)
│   │   ├── supabaseClient.js     # Inicialização do cliente Supabase
│   │   └── taskService.js        # Operações de CRUD e Realtime com o Supabase
│   ├── App.jsx                   # Componente raiz da aplicação
│   ├── index.css                 # Estilos globais e tokens de design
│   └── main.jsx                  # Ponto de entrada React
├── .env.example                  # Modelo de variáveis de ambiente
├── .gitignore                    # Regras de arquivos ignorados no Git
├── index.html                    # Documento HTML principal
├── package.json                  # Dependências e scripts do projeto
├── tailwind.config.js            # Configuração do Tailwind CSS
└── vite.config.js                # Configuração do Vite
```

---

## ⚙️ Pré-requisitos

- **Node.js** (versão 18.0.0 ou superior)
- **NPM** (versão 9.0.0 ou superior)

---

## 💻 Instalação e Execução

1. **Clone o repositório:**
   ```bash
   git clone https://github.com/SOHQ00/lista-tarefas.git
   cd lista-tarefas
   ```

2. **Instale as dependências:**
   ```bash
   npm install
   ```

3. **Configure as variáveis de ambiente:**
   Crie um arquivo `.env` na raiz do projeto com base no [.env.example](file:///.env.example):
   ```bash
   cp .env.example .env
   ```
   Preencha com as credenciais do seu projeto Supabase:
   ```env
   VITE_SUPABASE_URL=https://seu-projeto.supabase.co
   VITE_SUPABASE_ANON_KEY=sua-anon-key-aqui
   ```

4. **Inicie o servidor de desenvolvimento:**
   ```bash
   npm run dev
   ```
   Acesse a aplicação em `http://localhost:3000/`.

5. **Gerar build de produção:**
   ```bash
   npm run build
   ```

6. **Visualizar build de produção localmente:**
   ```bash
   npm run preview
   ```

---

## 📄 Licença

Este projeto está sob a licença MIT.
