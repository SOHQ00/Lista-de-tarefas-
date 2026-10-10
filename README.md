# TaskFlow • Lista de Tarefas Moderna com Supabase Auth

Um aplicativo web moderno, intuitivo e completo para gerenciamento de tarefas pessoais e profissionais, construído com **React 18**, **Vite**, **Tailwind CSS** e integrado ao **Supabase** para autenticação segura, perfis de usuário, Row Level Security (RLS) e sincronização em tempo real na nuvem.

---

## 🚀 Funcionalidades Principais

- **Autenticação Segura com Supabase Auth:**
  - **Login:** Autenticação com e-mail e senha com JWT e persistência de sessão.
  - **Criação de Conta (Sign Up):** Registro de novos usuários com nome completo, e-mail e senha.
  - **Recuperação de Senha (Forgot Password):** Envio de link seguro por e-mail para redefinição de senha e formulário dedicado de nova senha.
  - **Atalho Rápido de Demonstração:** Botão de 1 clique para preencher as credenciais do usuário padrão (*Sophia Amaral*).
- **Múltiplos Usuários e Isolamento de Tarefas:**
  - Cada usuário cadastrado possui seu **próprio perfil** na tabela `public.profiles`.
  - As tarefas na tabela `public.tasks` são vinculadas ao `user_id` do usuário logado.
  - **Row Level Security (RLS)** ativo no PostgreSQL: Usuários só conseguem visualizar, criar, alterar e excluir suas próprias tarefas.
  - Menu e modal de perfil com métricas individuais, edição de nome de exibição e opção de redefinição de senha.
- **CRUD Completo de Tarefas:**
  - Criação rápida com título, descrição, categoria, prioridade e data de vencimento.
  - Edição de tarefas existentes com formulário modal interativo.
  - Exclusão segura com diálogo de confirmação.
  - Conclusão rápida com checkbox animado, efeito de riscado e celebração visual com confetes.
- **Sincronização em Tempo Real (Supabase Cloud):**
  - Persistência direta no banco de dados PostgreSQL via Supabase.
  - Atualizações otimistas na interface (0ms de latência percebida).
  - Sincronização em tempo real (*Realtime Channels*) filtrada por usuário.
  - Fallback automático e seguro com cache no `localStorage` isolado por `userId` em caso de instabilidade.
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

## 👤 Usuário de Demonstração Cadastrado

Para testar a aplicação imediatamente, você pode utilizar a conta já configurada:

- **E-mail:** `sophiaamaralsv@gmail.com`
- **Senha:** `123456`

*(A tela de login já possui um botão "Preencher" que insere essas credenciais automaticamente).*

---

## 🛠️ Tecnologias Utilizadas

- **Frontend:** [React 18](https://react.dev/)
- **Build Tool:** [Vite 5](https://vitejs.dev/)
- **Backend & Autenticação:** [Supabase](https://supabase.com/) (`@supabase/supabase-js`)
- **Estilização:** [Tailwind CSS 3](https://tailwindcss.com/)
- **Ícones:** [Lucide React](https://lucide.dev/)
- **Micro-interações:** [Canvas Confetti](https://www.npmjs.com/package/canvas-confetti)
- **Tipografia:** Google Fonts (*Plus Jakarta Sans* & *Inter*)

---

## 📦 Estrutura do Projeto

```text
├── src/
│   ├── components/
│   │   ├── Auth/
│   │   │   └── AuthView.jsx      # Telas de Login, Cadastro e Recuperação de Senha
│   │   ├── AnalyticsView.jsx     # Dashboard de métricas e produtividade
│   │   ├── CalendarView.jsx      # Visão em grade de calendário mensal
│   │   ├── CategoryBadge.jsx     # Tag de identificação de categoria
│   │   ├── ConfirmModal.jsx      # Modal de confirmação para ações críticas
│   │   ├── Navbar.jsx            # Barra de navegação com perfil do usuário e status Supabase
│   │   ├── PriorityBadge.jsx     # Tag de identificação de prioridade
│   │   ├── ProfileModal.jsx      # Modal de gerenciamento do perfil do usuário
│   │   ├── TaskFilters.jsx       # Barra de pesquisa e filtros
│   │   ├── TaskItem.jsx          # Componente individual de tarefa
│   │   ├── TaskList.jsx          # Lista de tarefas e estados vazios
│   │   └── TaskModal.jsx         # Modal de criação e edição de tarefas
│   ├── constants/
│   │   ├── categories.js         # Configurações de cores e badges de categorias
│   │   └── priorities.js         # Configurações de prioridades
│   ├── context/
│   │   └── AuthContext.jsx       # Contexto e hook useAuth para sessão e perfil
│   ├── hooks/
│   │   └── useTasks.js           # Hook customizado de tarefas isoladas por usuário
│   ├── services/
│   │   ├── authService.js        # Métodos de autenticação, perfil e recuperação
│   │   ├── storageService.js     # Fallback e cache local isolado por usuário
│   │   ├── supabaseClient.js     # Inicialização do cliente Supabase
│   │   └── taskService.js        # Operações de CRUD e Realtime com o Supabase
│   ├── App.jsx                   # Componente raiz da aplicação
│   ├── index.css                 # Estilos globais e tokens de design
│   └── main.jsx                  # Ponto de entrada React com AuthProvider
├── .env                          # Variáveis de conexão com o Supabase
├── .env.example                  # Modelo de variáveis de ambiente
├── index.html                    # Documento HTML principal
├── package.json                  # Dependências e scripts do projeto
├── tailwind.config.js            # Configuração do Tailwind CSS
└── vite.config.js                # Configuração do Vite
```

---

## 💻 Como Rodar o Projeto

1. **Instale as dependências:**
   ```bash
   npm install
   ```

2. **Inicie o servidor de desenvolvimento:**
   ```bash
   npm run dev
   ```
   Acesse a aplicação em `http://localhost:3000/`.

3. **Gerar build de produção:**
   ```bash
   npm run build
   ```

---

## 📄 Licença

Este projeto está sob a licença MIT.
