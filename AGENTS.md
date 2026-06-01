# MentorGraduação

Projeto acadêmico de Engenharia de Software (UFRN). Planejamento de fluxo de graduação.

## Stack

- **Backend:** FastAPI + SQLAlchemy + Alembic + JWT + MySQL (Docker)
- **Frontend:** React 18 + TypeScript + Vite + React Router 6

## Comandos

```bash
# Docker MySQL (workdir: Database/)
docker compose up -d

# Backend (workdir: backend/)
alembic upgrade head                     # migrations
python seeds/seed.py                      # dados de exemplo
uvicorn app.main:app --reload             # servidor dev :8000
python -m pytest                          # testes (SQLite in-memory)

# Frontend (workdir: frontend/)
npm run dev                               # servidor dev :5173 (proxy /api → :8000)
npm run build                             # tsc && vite build (typecheck + bundle)
```

## Arquitetura

| Camada backend | `app/*` |
|---|---|
| ORM models | `models/` (SQLAlchemy) |
| Schemas | `schemas/` (Pydantic) |
| Endpoints | `routers/` (FastAPI APIRouter) |
| Auth logic | `services/auth.py` (`criar_token`, `decodificar_token`, `hash_senha`) |

- JWT armazenado em `localStorage["token"]` no frontend
- Vite roteia `/api/*` → backend (rewrite: `/api` removido)
- Uploads de comprovantes salvos em `backend/uploads/`
- `db` session injetada via `get_db()` (FastAPI dependency)
- Schema das tabelas definido em `Database/schema_mentor_graduacao.sql`

## Dados de exemplo

`backend/seeds/seed.py` cria: curso "Ciência da Computação", admin (`admin@test.com` / `123456`), 13 disciplinas com 8 pré-requisitos.
`Database/dados.sql` também pode ser usado como init do Docker MySQL.

## Convenções

- Commits em português; `main` recebe merges de `dev` via PR
- Sprint 4 implementada (auth + cursos + disciplinas + fluxograma + avaliações)
- `userStories.md`, `plan.md` e `plan_integration.md` na raiz

## Nuances

- `npm run build` executa `tsc` (strict mode) antes do vite build — `noUnusedLocals` e `noUnusedParameters` ativos
- `config.py` lê de `.env` (obrigatório) ou usa default para Docker MySQL (`Database/docker-compose.yml`)
- `seeds/seed.py` manipula `sys.path` para importar `app.*` — executar de dentro de `backend/`
- Rota extra não documentada no README: `GET /subjects/{id}/prerequisites` (retorna lista de disciplinas pré-requisito)
- Docker MySQL usa init scripts em `Database/schema_mentor_graduacao.sql` e `Database/dados.sql`
- `requirements.txt` usa intervalos flexíveis (`>=`) — sem versões fixas

## Schema do banco

Tabelas (nomes em singular): `Course`, `User`, `Subject`, `CourseSubjects`, `Prerequisite`, `FlowchartItem`, `Review`.
`Review.nota` usa `DECIMAL(3,1)` (0.0 a 10.0).
`FlowchartItem.status` usa `ENUM('planned', 'completed')`.
