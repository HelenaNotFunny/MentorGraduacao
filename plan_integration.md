# Plano de Integração — MySQL via Docker

Migrar o banco de SQLite (dev) para MySQL rodando em Docker, usando `schema_mentor_graduacao.sql` e `dados.sql` como fonte da verdade para o schema.

---

## Fase 1 — Diretório `database/` + Docker Compose

### 1.1 Criar `database/` na raiz do repositório

```
MentorGraduacao/
├── database/
│   ├── docker-compose.yml
│   ├── schema_mentor_graduacao.sql
│   └── dados.sql
├── backend/
├── frontend/
└── ...
```

### 1.2 Mover `schema_mentor_graduacao.sql` e `dados.sql` para `database/`

Arquivos atualmente na raiz são movidos para `database/`.

### 1.3 Corrigir `schema_mentor_graduacao.sql`

- `Review.nota`: `DECIMAL(2,1)` → `DECIMAL(3,1)` (suporta nota 0–10)

### 1.4 Criar `database/docker-compose.yml`

```yaml
services:
  mysql:
    image: mysql:8.0
    container_name: mentor-mysql
    restart: unless-stopped
    ports:
      - "3306:3306"
    environment:
      MYSQL_ROOT_PASSWORD: ${MYSQL_ROOT_PASSWORD:-rootpass}
      MYSQL_DATABASE: MentorGraducao
      MYSQL_USER: mentor
      MYSQL_PASSWORD: ${MYSQL_PASSWORD:-mentor123}
    volumes:
      - mentor_mysql_data:/var/lib/mysql
      - ./schema_mentor_graduacao.sql:/docker-entrypoint-initdb.d/01-schema.sql
      - ./dados.sql:/docker-entrypoint-initdb.d/02-dados.sql

volumes:
  mentor_mysql_data:
```

---

## Fase 2 — .env + Config

### 2.1 Criar `backend/.env.example`

```
DATABASE_URL=mysql+mysqlconnector://mentor:mentor123@localhost:3306/MentorGraducao
SECRET_KEY=change-me-in-production
```

### 2.2 Criar `backend/.env` (gitignorado)

Cópia do `.env.example` com valores reais.

### 2.3 Atualizar `backend/app/config.py`

Manter `pydantic-settings BaseSettings`. Default de `database_url` muda para apontar ao Docker MySQL (ou ler de `.env`). Nenhuma mudança estrutural necessária — o `env_file = ".env"` já está configurado.

---

## Fase 3 — Refatorar Models (SQL como verdade)

### 3.1 `backend/app/models/course.py`

- `__tablename__` = `"Course"` (era `"courses"`)
- Remover `subjects` relationship (agora via `CourseSubjects`)
- Adicionar `course_subjects` relationship para a tabela associativa

### 3.2 `backend/app/models/user.py`

- `__tablename__` = `"User"` (era `"users"`)
- `curso_id`: `nullable=False` (era `nullable=True`)

### 3.3 Criar `backend/app/models/course_subjects.py`

Nova model:
- `__tablename__` = `"CourseSubjects"`
- Colunas: `id` (PK), `course_id` (FK → `Course.id`), `subject_id` (FK → `Subject.id`)
- `__table_args__`: `UniqueConstraint("course_id", "subject_id")`
- Relationships para `Course` e `Subject`

### 3.4 `backend/app/models/subject.py`

- `__tablename__` = `"Subject"` (era `"subjects"`)
- Remover `course_id` + FK
- Remover `course` relationship
- Adicionar `course_subjects` relationship (backref da associativa)

### 3.5 `backend/app/models/prerequisite.py`

Renomear de dentro de `subject.py` para inline em `subject.py`:
- `__tablename__` = `"Prerequisite"` (era `"prerequisites"`)
- `__table_args__`: `UniqueConstraint("subject_id", "prerequisite_subject_id")`

### 3.6 `backend/app/models/flowchart.py`

- `__tablename__` = `"FlowchartItem"` (era `"flowchart_items"`)
- `status`: usar `sqlalchemy.Enum("planned", "completed")` para espelhar o `.sql`
- `__table_args__`: `UniqueConstraint("user_id", "subject_id")`

### 3.7 `backend/app/models/review.py`

- `__tablename__` = `"Review"` (era `"reviews"`)
- `nota`: `DECIMAL(3,1)` via `sqlalchemy.Numeric(3, 1)` (era `Float`)
- `created_at`: usar `server_default=text("CURRENT_TIMESTAMP")` em vez de default Python

---

## Fase 4 — Atualizar Schemas Pydantic

### 4.1 `backend/app/schemas/subject.py`

- `SubjectOut`: remover `course_id`
- `SubjectCreate`: remover `course_id`

### 4.2 `backend/app/schemas/course.py`

- Opcionalmente adicionar campo `subjects: list[SubjectOut]` (via CourseSubjects)

### 4.3 Demais schemas

- `FlowchartItemOut`: sem mudanças
- `ReviewOut`: verificar se `nota` ainda é `float` ou muda para `Decimal`

---

## Fase 5 — Atualizar Routers

### 5.1 `backend/app/routers/subjects.py`

- `GET /subjects/?course_id=X`: consulta via join com `CourseSubjects`
- `POST /subjects/`: criar Subject + criar CourseSubjects entry
- `GET /subjects/{id}/prerequisites`: sem mudanças

### 5.2 `backend/app/routers/courses.py`

- `GET /courses/`: sem mudanças estruturais
- `POST /courses/`: sem mudanças

### 5.3 `backend/app/routers/flowchart.py`

- `GET /flowchart/suggestions`: ajustar filtro `Subject.course_id == user.curso_id` para join via `CourseSubjects`

### 5.4 `backend/app/routers/reviews.py`

- Sem mudanças

---

## Fase 6 — Resetar Migrations Alembic

### 6.1 Limpar migrations antigas

- Deletar `backend/alembic/versions/*.py` (4 arquivos)
- Deletar `backend/mentor_graduacao.db` (SQLite dev)

### 6.2 Gerar nova migration inicial

```bash
cd backend
alembic revision --autogenerate -m "initial_schema_from_sql_files"
alembic upgrade head
```

A nova migration criará todas as tabelas no schema definido pelos models.

---

## Fase 7 — Atualizar Seeds

### 7.1 `backend/seeds/seed.py`

- Remover `course_id` da criação de `Subject`
- Adicionar inserção em `CourseSubjects`:
  ```python
  cs = CourseSubjects(course_id=curso.id, subject_id=subject.id)
  db.add(cs)
  ```

---

## Fase 8 — Atualizar Testes

### 8.1 `backend/tests/conftest.py`

- **Corrigir bug**: `from app.utils.auth import create_access_token` → `from app.services.auth import criar_token`
- `token = create_access_token(data={"sub": user.email})` → `token = criar_token(user.id)`
- Importar nova model `CourseSubjects`

### 8.2 `backend/tests/test_subjects.py`

- Ajustar criação de Subject: sem `course_id`, adicionar `CourseSubjects` entries
- Ajustar testes de filtro `course_id` para usar a associativa

### 8.3 `backend/tests/test_auth.py`

- `curso_id` agora é NOT NULL — garantir que fixtures de `User` tenham `curso_id`

### 8.4 `backend/tests/test_courses.py`

- Sem mudanças esperadas

---

## Fase 9 — Corrigir Bugs Conhecidos

### 9.1 `backend/requirements.txt`

- Re-escrever em UTF-8 (atualmente UTF-16)

### 9.2 `.gitignore`

- Corrigir linha `*.pycgit status` para duas linhas:
  ```
  *.pyc
  ```

---

## Fase 10 — Atualizar `AGENTS.md`

Adicionar:
- `docker compose up -d` na raiz do diretório `database/` para subir MySQL
- Nota sobre `.env` obrigatório
- Remover bugs corrigidos da lista
- Adicionar nota sobre `DECIMAL(3,1)` para nota

---

## Ordem de execução sugerida

```
 1. database/ + mover .sql + corrigir DECIMAL
 2. docker-compose.yml
 3. .env.example + .env
 4. Refatorar models (Course, User, Subject, CourseSubjects, Prerequisite, FlowchartItem, Review)
 5. Atualizar schemas
 6. Atualizar routers
 7. Resetar Alembic migrations
 8. Atualizar seeds
 9. Atualizar testes + corrigir conftest bug
10. Corrigir requirements.txt encoding
11. Corrigir .gitignore
12. Atualizar AGENTS.md
```

---

## Riscos e observações

- **Mudança de nome de tabelas**: plural → singular quebra qualquer query SQL raw. O app só usa SQLAlchemy ORM, então é seguro.
- **`curso_id` NOT NULL**: usuários existentes sem curso vão quebrar. O seed sempre cria usuário com `curso_id`, então em dev é ok.
- **`created_at` com `server_default`**: difere do comportamento anterior (default Python).
- **`CourseSubjects`**: adiciona complexidade nas queries de listagem de disciplinas por curso. Antes era `filter(Subject.course_id == X)`, agora requer join.
