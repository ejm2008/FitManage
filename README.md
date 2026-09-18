# FitManage - Sistema de Gestão de Academia (Full Stack)

Aplicação Full Stack desenvolvida em **React 19 + TypeScript + Vite + Tailwind CSS** (Frontend) e **Node.js + Express + TypeScript** (Backend), com banco de dados mockado persistente, documentação interativa **Swagger UI (OpenAPI 3.0)** e controle de acesso baseado em papéis (**RBAC: Admin vs Dev**).

---

## 🌟 Estrutura do Projeto

```
FitManage/
├── server/                     # Backend API REST (Node.js + Express + TS)
│   ├── src/
│   │   ├── config/swagger.ts   # Especificação OpenAPI 3.0
│   │   ├── controllers/        # Controladores HTTP (auth, students, workouts, diets, admin)
│   │   ├── routes/             # Rotas REST (/api/...)
│   │   ├── services/           # Banco de dados mockado em memória e arquivo JSON
│   │   ├── types/              # Tipagens da API
│   │   └── server.ts           # Servidor Express na porta 3001 com proteção ao Swagger
│   ├── package.json
│   └── tsconfig.json
│
├── src/                        # Frontend Web (React 19 + Vite + Tailwind v4)
│   ├── components/             # Componentes da interface (Navbar, Login, Dashboard, etc.)
│   ├── services/               # Consumo assíncrono da API REST (/api)
│   ├── types/                  # Modelos TypeScript do frontend
│   └── App.tsx                 # Roteamento e estados principais
│
├── package.json                # Scripts para inicialização simultânea (concurrently)
└── vite.config.ts              # Proxy reverso /api -> http://localhost:3001
```

---

## 👥 Papéis e Acesso (Roles)

| Papel | Usuário | Senha | Acesso ao Swagger na Tela | Descrição |
| --- | --- | --- | :---: | --- |
| **👑 Administrador (`admin`)** | `admin` | `123456` | ❌ Não exibido | Acesso completo à gestão de alunos, criação de treinos, dietas e backups. O botão do Swagger fica oculto. |
| **💻 Desenvolvedor (`dev`)** | `dev` | `123456` | ✅ **Exibido** | Acesso completo ao sistema e **botão Swagger API liberado** na barra de navegação e rodapé. |

> [!NOTE]
> A rota backend `/api-docs` possui um middleware de segurança que valida o cookie de sessão: apenas usuários autenticados com o papel `dev` têm acesso ao Swagger UI. Se um `admin` tentar acessar a URL diretamente, recebe tela amigável de **403 Acesso Restrito**.

---

## 📑 Swagger UI (Documentação Interativa da API)

- **URL**: `http://localhost:3001/api-docs`
- **Funcionalidades**:
  - Teste interativo de requisições diretamente pela interface (*Try it out*).
  - Documentação detalhada dos schemas de Alunos, Treinos, Dietas e Autenticação.

---

## 🚀 Como Executar o Projeto

```bash
# Executar Frontend (5173) e Backend (3001) simultaneamente:
npm run dev

# Ou executar de forma independente:
npm run dev:server   # Inicia apenas a API na porta 3001
npm run dev:client   # Inicia apenas o Frontend na porta 5173

# Compilar todo o projeto (Backend + Frontend):
npm run build
```
