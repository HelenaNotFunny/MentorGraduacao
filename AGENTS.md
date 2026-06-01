# MentorGraduação

Projeto acadêmico de Engenharia de Software (UFRN). Planejamento de fluxo de graduação.

## Stack

- **Backend:** FastAPI + SQLAlchemy + Alembic + JWT + MySQL (Docker)
- **Frontend:** React 18 + TypeScript + Vite + React Router 6

## Comandos

```bash
# Docker MySQL (workdir: database/)
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
- Schema das tabelas definido em `database/schema_mentor_graduacao.sql`

## Dados

### Grades curriculares reais da UFRN

`data/` contém `cursos_ufrn.json` com 81 disciplinas, 61 pré-requisitos e 4 cursos baseados nas grades oficiais do SIGAA/UFRN:

| Curso | Códigos | Disciplinas |
|---|---|---|
| Ciências e Tecnologia | ECT | 22 (1º ciclo) |
| Engenharia de Computação | ECT + DIM + DCA | 45 (2º ciclo) |
| Engenharia Mecatrônica | ECT + DCA + MEC | 36 (2º ciclo) |
| Tecnologia da Informação (BTI) | IMD + DIM | 36 |

`data/import_data.py` lê o JSON e popula o banco via SQLAlchemy (idempotente):
```bash
cd data
python import_data.py          # usa o .venv do backend
```

> **Atenção:** `data/` está no `.gitignore` — o JSON e o script não sobem para o GitHub.

### Docker Hub

A imagem MySQL populada está publicada em `dpdck972/mentor-mysql:latest`. O `database/docker-compose.yml` já a referência em vez de `mysql:8.0`.
Em outra máquina, `docker compose up -d` já vem com todos os dados.

### Seed original

`backend/seeds/seed.py` cria: curso "Ciência da Computação", admin (`admin@test.com` / `123456`), 13 disciplinas com 8 pré-requisitos.

## Convenções

- Commits em português; `main` recebe merges de `dev` via PR
- Sprint 4 implementada (auth + cursos + disciplinas + fluxograma + avaliações)
- `userStories.md`, `plan.md` e `plan_integration.md` na raiz

## Nuances

- `npm run build` executa `tsc` (strict mode) antes do vite build — `noUnusedLocals` e `noUnusedParameters` ativos
- `config.py` lê de `.env` (obrigatório) ou usa default para Docker MySQL (`database/docker-compose.yml`)
- `seeds/seed.py` manipula `sys.path` para importar `app.*` — executar de dentro de `backend/`
- Rota extra não documentada no README: `GET /subjects/{id}/prerequisites` (retorna lista de disciplinas pré-requisito)
- Docker MySQL usa init scripts em `database/schema_mentor_graduacao.sql` e `database/dados.sql`
- `requirements.txt` usa intervalos flexíveis (`>=`) — sem versões fixas
- `data/import_data.py` manipula `sys.path` igual ao seed — executar de dentro de `data/`
- Disciplinas podem pertencer a múltiplos cursos via `CourseSubjects` (ex: ECT compartilhadas entre engenharias)

## Schema do banco

Tabelas (nomes em singular): `Course`, `User`, `Subject`, `CourseSubjects`, `Prerequisite`, `FlowchartItem`, `Review`.
`Review.nota` usa `DECIMAL(3,1)` (0.0 a 10.0).
`FlowchartItem.status` usa `ENUM('planned', 'completed')`.
