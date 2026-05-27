# MentorGraduação — Backend

## Stack

FastAPI + SQLAlchemy + JWT + SQLite (dev)

## Dependências

```bash
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
```

## Rodar

```bash
alembic upgrade head
uvicorn app.main:app --reload
```

Servidor em `http://localhost:8000`. Docs interativas em `http://localhost:8000/docs`.

## Endpoints

| Método | Rota | Descrição |
|---|---|---|
| GET | `/health` | Health check |
| POST | `/courses/` | Criar curso |
| GET | `/courses/` | Listar cursos |
| POST | `/auth/register` | Registrar usuário |
| POST | `/auth/login` | Login (retorna JWT) |
| GET | `/auth/me` | Dados do usuário logado |

## Seeds

```bash
python seeds/seed.py
```

## Migrations

```bash
alembic revision --autogenerate -m "descrição"
alembic upgrade head
```
