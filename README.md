# MentorGraduação

Software para planejar o fluxo da sua graduação. Com base no fluxo ideal do curso e nos pré-requisitos, o sistema sugere as disciplinas mais vantajosas de cursar a cada semestre, além de fornecer informações de ementa, bibliografia e avaliações de disciplinas.

Projeto acadêmico da disciplina de Engenharia de Software (UFRN).

## Componentes

- Maria Helena Fernandes Leocádio
- Rodrigo de Menezes Souza
- Thaís Karolyne Militão De Lima
- Williane Ferreira Cardoso

## Stack

- **Backend:** FastAPI + SQLAlchemy + Alembic + JWT + SQLite (dev)
- **Frontend:** React + TypeScript + Vite + React Router

## Funcionalidades implementadas

### Sprint 1 — Autenticação e Cadastro de Curso
- Registro e login de usuários (JWT)
- Cadastro e listagem de cursos
- Rota protegida `/auth/me` para dados do usuário logado

### Sprint 2 — Estrutura Curricular
- Cadastro e listagem de disciplinas vinculadas a um curso
- Detalhe da disciplina (ementa, bibliografia, resumo)
- Pesquisa por nome ou código
- Definição de pré-requisitos entre disciplinas

### Sprint 3 — Fluxograma Pessoal
- Grade visual de semestres com disciplinas planejadas
- Adicionar/remover disciplinas do fluxograma
- Validação de pré-requisitos (impede adicionar sem cumprir)
- Marcar disciplina como cursada
- Sugestão automática de disciplinas disponíveis com base nos pré-requisitos cumpridos
- Mover disciplinas entre semestres

### Sprint 4 — Avaliações
- Avaliar disciplina cursada (nota 0–10 + resenha + upload de comprovante)
- Restrição: apenas uma avaliação por disciplina por usuário
- Restrição: só avalia quem completou a disciplina
- Lista pública de avaliações por disciplina

## Estrutura do projeto

```
MentorGraduacao/
├── backend/
│   ├── app/
│   │   ├── main.py              # FastAPI app entrypoint
│   │   ├── config.py            # Configurações (DB, JWT)
│   │   ├── database.py          # SQLAlchemy engine + session
│   │   ├── models/              # Modelos: User, Course, Subject, Prerequisite, FlowchartItem, Review
│   │   ├── schemas/             # Schemas Pydantic
│   │   ├── routers/             # Endpoints: auth, courses, subjects, flowchart, reviews
│   │   └── services/            # Lógica de autenticação (bcrypt, JWT)
│   ├── alembic/                 # Migrations
│   ├── seeds/seed.py            # Dados de exemplo
│   ├── uploads/                 # Comprovantes de avaliação
│   └── requirements.txt
├── frontend/
│   ├── src/
│   │   ├── components/          # Header
│   │   ├── pages/               # Home, Login, Courses, Subjects, SubjectDetail, SubjectCreate, Flowchart
│   │   └── services/            # API client + serviços (auth, course, subject, flowchart, review)
│   ├── package.json
│   └── vite.config.ts           # Proxy /api → backend
├── AGENTS.md                    # Instruções para agentes OpenCode
├── plan.md                      # Plano de sprints
└── userStories.md               # Requisitos funcionais
```

## Como rodar

### Backend

#### Linux

```bash
cd backend
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
alembic upgrade head
python seeds/seed.py
uvicorn app.main:app --reload
```

#### Windows

```bash
cd backend
python3 -m venv .venv
.\.venv\Scripts\Activate.ps1
pip install -r requirements.txt
alembic upgrade head
python seeds/seed.py
uvicorn app.main:app --reload
```

Servidor em `http://localhost:8000`. Docs interativas em `http://localhost:8000/docs`.

### Frontend

```bash
cd frontend
npm install
npm run dev
```

Servidor em `http://localhost:5173`. Rotas `/api/*` são proxyadas para o backend.

### Dados de exemplo

O script `backend/seeds/seed.py` cria:
- Curso: Ciência da Computação (UFRN)
- Admin: admin@test.com / 123456
- 13 disciplinas com 8 pré-requisitos

## Rotas da API

| Método | Rota | Auth | Descrição |
|---|---|---|---|
| POST | `/auth/register` | — | Registrar usuário |
| POST | `/auth/login` | — | Login (retorna JWT) |
| GET | `/auth/me` | Bearer | Dados do usuário logado |
| GET | `/courses/` | — | Listar cursos |
| POST | `/courses/` | — | Criar curso |
| GET | `/subjects/` | — | Listar disciplinas (filtro: ?search=, ?course_id=) |
| GET | `/subjects/{id}` | — | Detalhe da disciplina |
| POST | `/subjects/` | — | Criar disciplina |
| GET | `/flowchart/` | Bearer | Listar fluxograma do usuário |
| POST | `/flowchart/` | Bearer | Adicionar disciplina ao fluxograma |
| PUT | `/flowchart/{id}` | Bearer | Alterar semestre/status |
| DELETE | `/flowchart/{id}` | Bearer | Remover do fluxograma |
| GET | `/flowchart/suggestions` | Bearer | Sugestões de disciplinas |
| GET | `/subjects/{id}/reviews` | — | Listar avaliações |
| POST | `/subjects/{id}/reviews` | Bearer | Avaliar disciplina |
| GET | `/health` | — | Health check |

## Licença

MIT
