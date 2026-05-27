# MentorGraduação

Projeto acadêmico de Engenharia de Software (UFRN). Planejamento de fluxo de graduação.

## Idioma

Tudo em português: docs, commits, issues, branches, código (nomes de variáveis e funções).

## Stack

- **Backend:** FastAPI + SQLAlchemy + Alembic + JWT + SQLite (dev)
- **Frontend:** React + TypeScript + Vite + React Router

## Projeto

- `userStories.md` — requisitos funcionais com prioridades.
- `plan.md` — plano de sprints.
- `backend/` — FastAPI.
- `frontend/` — React SPA.

## Comandos

### Backend

```bash
cd backend
alembic upgrade head            # aplicar migrations
python seeds/seed.py             # dados de exemplo
uvicorn app.main:app --reload    # servidor dev (porta 8000)
```

### Frontend

```bash
cd frontend
npm install                     # primeira vez
npm run dev                     # servidor dev (porta 5173, proxy /api → 8000)
npm run build                   # produção em dist/
```

## Rotas da API

| Método | Rota | Auth |
|---|---|---|
| POST | `/auth/register` | — |
| POST | `/auth/login` | — |
| GET | `/auth/me` | Bearer |
| GET | `/courses/` | — |
| POST | `/courses/` | — |
| GET | `/subjects/` | — |
| GET | `/subjects/{id}` | — |
| POST | `/subjects/` | — |
| GET | `/flowchart/` | Bearer |
| POST | `/flowchart/` | Bearer |
| PUT | `/flowchart/{id}` | Bearer |
| DELETE | `/flowchart/{id}` | Bearer |
| GET | `/flowchart/suggestions` | Bearer |
| GET | `/subjects/{id}/reviews` | — |
| POST | `/subjects/{id}/reviews` | Bearer |
| GET | `/health` | — |

## Estrutura atual

Sprint 4 implementada (autenticação + cadastro de curso + estrutura curricular + fluxograma + avaliações).

## Convenções

- Commits em português.
- `main` recebe merges de `dev` via PR.
- Modelos SQLAlchemy em `app/models/`, schemas Pydantic em `app/schemas/`, endpoints em `app/routers/`.
