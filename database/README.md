# Database — MentorGraduação

Banco MySQL gerenciado via Docker Compose. O schema e os dados de exemplo são carregados automaticamente na primeira inicialização.

## Como rodar

```bash
cd database
docker compose up -d
```

O MySQL ficará disponível em `localhost:3306` com as credenciais:

| Variável | Valor (default) |
|---|---|
| Host | `localhost` |
| Porta | `3306` |
| Database | `MentorGraducao` |
| Usuário app | `mentor` |
| Senha app | `mentor123` (ou `MYSQL_PASSWORD` no `.env`) |
| Root password | `rootpass` (ou `MYSQL_ROOT_PASSWORD` no `.env`) |

> Para conectar o backend, configure `DATABASE_URL` no `backend/.env`:
> `DATABASE_URL=mysql+mysqlconnector://mentor:mentor123@localhost:3306/MentorGraducao`

## Arquivos

| Arquivo | Função |
|---|---|
| `docker-compose.yml` | Define o serviço MySQL 8.0 com volume persistente |
| `schema_mentor_graduacao.sql` | Cria o banco e todas as tabelas (executado automaticamente na primeira inicialização) |
| `dados.sql` | Insere dados de exemplo (executado após o schema) |

O Docker monta esses `.sql` em `/docker-entrypoint-initdb.d/` — o MySQL executa em ordem alfabética.

## Schema

### Entidades

```mermaid
erDiagram
    Course ||--o{ User : possui
    Course ||--o{ CourseSubjects : contem
    Subject ||--o{ CourseSubjects : pertence
    Subject ||--o{ Prerequisite : "é pré-requisito de"
    Prerequisite ||--|| Subject : "requer"
    User ||--o{ FlowchartItem : planeja
    Subject ||--o{ FlowchartItem : "está no"
    User ||--o{ Review : avalia
    Subject ||--o{ Review : "é avaliada"
```

### Tabelas

**Course** — Cursos cadastrados no sistema.

| Coluna | Tipo | Descrição |
|---|---|---|
| id | INT (PK) | Identificador único |
| nome | VARCHAR(255) | Nome do curso |
| instituicao | VARCHAR(255) | Instituição de ensino |

**User** — Usuários da plataforma.

| Coluna | Tipo | Descrição |
|---|---|---|
| id | INT (PK) | Identificador único |
| nome | VARCHAR(255) | Nome do usuário |
| email | VARCHAR(255) (UNIQUE) | Email de login |
| senha_hash | VARCHAR(255) | Hash bcrypt da senha |
| curso_id | INT (FK → Course) | Curso do usuário (NOT NULL) |
| created_at | DATETIME | Data de criação |

**Subject** — Disciplinas da grade curricular.

| Coluna | Tipo | Descrição |
|---|---|---|
| id | INT (PK) | Identificador único |
| nome | VARCHAR(255) | Nome da disciplina |
| codigo | VARCHAR(50) | Código (ex: IMD0001) |
| ementa | TEXT | Ementa da disciplina |
| bibliografia | TEXT | Bibliografia recomendada |
| resumo | TEXT | Resumo dos tópicos |
| periodo_recomendado | INT | Período sugerido (1 a N) |

**CourseSubjects** — Associação entre curso e disciplina (join table).

| Coluna | Tipo | Descrição |
|---|---|---|
| id | INT (PK) | Identificador único |
| course_id | INT (FK → Course) | Curso |
| subject_id | INT (FK → Subject) | Disciplina |
| | UNIQUE(course_id, subject_id) | Garante que não haja duplicatas |

**Prerequisite** — Pré-requisitos entre disciplinas.

| Coluna | Tipo | Descrição |
|---|---|---|
| id | INT (PK) | Identificador único |
| subject_id | INT (FK → Subject) | Disciplina que depende |
| prerequisite_subject_id | INT (FK → Subject) | Disciplina pré-requisito |
| | UNIQUE(subject_id, prerequisite_subject_id) | Garante pares únicos |

**FlowchartItem** — Disciplina no fluxograma pessoal do usuário.

| Coluna | Tipo | Descrição |
|---|---|---|
| id | INT (PK) | Identificador único |
| user_id | INT (FK → User) | Usuário dono do fluxograma |
| subject_id | INT (FK → Subject) | Disciplina adicionada |
| semester_index | INT | Semestre no fluxograma (1, 2, 3...) |
| status | ENUM('planned', 'completed') | Planejada ou cursada |
| | UNIQUE(user_id, subject_id) | Uma entrada por disciplina por usuário |

**Review** — Avaliação de disciplina cursada.

| Coluna | Tipo | Descrição |
|---|---|---|
| id | INT (PK) | Identificador único |
| user_id | INT (FK → User) | Autor da avaliação |
| subject_id | INT (FK → Subject) | Disciplina avaliada |
| nota | DECIMAL(3,1) | Nota de 0.0 a 10.0 |
| resenha | TEXT | Resenha/texto da avaliação |
| comprovante_url | VARCHAR(500) | URL do comprovante de conclusão |
| created_at | TIMESTAMP | Data da avaliação |

## Dados de exemplo

O `dados.sql` insere:

- 2 cursos: Ciência da Computação e Engenharia de Software
- 2 usuários: Admin (admin@test.com) e Maria (maria@test.com) — **senhas hash são placeholders**, usar o seed do backend para criar usuários com hash válido
- 13 disciplinas distribuídas em 4 períodos
- 8 relações de pré-requisito entre disciplinas
- Todas as disciplinas associadas ao curso de Ciência da Computação via `CourseSubjects`

## Alternativa via backend seed

O backend oferece um seed programático que cria dados equivalentes:

```bash
cd backend
python seeds/seed.py
```

O seed cria um admin com senha hash válida (`admin@test.com` / `123456`), o que o `dados.sql` não faz (os hashes no SQL são placeholders).
