# Plano de Desenvolvimento — MentorGraduação

## Stack

- **Backend:** FastAPI + SQLAlchemy + JWT + banco relacional (SQLite dev / PostgreSQL prod)
- **Frontend:** React (SPA)
- **Infra:** migrations via Alembic

## Modelo de Dados

| Entidade | Atributos principais |
|---|---|
| `User` | id, nome, email, senha_hash, curso_id |
| `Course` | id, nome, instituicao |
| `Subject` | id, course_id, nome, codigo, ementa, bibliografia, resumo, periodo_recomendado |
| `Prerequisite` | id, subject_id, prerequisite_subject_id |
| `FlowchartItem` | id, user_id, subject_id, semester_index, status (planned / completed) |
| `Review` | id, user_id, subject_id, nota, resenha, comprovante_url, created_at |

## Estrutura de diretórios proposta

```
MentorGraduacao/
├── backend/
│   ├── app/
│   │   ├── main.py
│   │   ├── config.py
│   │   ├── database.py
│   │   ├── models/
│   │   ├── schemas/
│   │   ├── routers/
│   │   └── services/
│   ├── alembic/
│   ├── seeds/
│   ├── requirements.txt
│   └── Dockerfile
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   └── App.tsx
│   ├── package.json
│   └── Dockerfile
├── README.md
├── userStories.md
└── plan.md
```

## Sprints

### Sprint 1 — Setup + Autenticação + Cadastro de Curso (US1 — parte 1)
*Estimativa: 1 sprint*

**Backend:**
- Setup FastAPI + SQLAlchemy + Alembic
- Model `User` + `Course`
- Endpoints: `POST /auth/register`, `POST /auth/login` (JWT), `GET/POST /courses`
- Seeds para curso padrão

**Frontend:**
- Setup React + roteamento (react-router)
- Tela de login/registro
- Tela de cadastro de curso
- Header com usuário logado

**BD:** migração inicial + seeds

---

### Sprint 2 — Estrutura Curricular e Disciplinas (US1 — parte 2)
*Estimativa: 1 sprint*

**Backend:**
- Models `Subject` + `Prerequisite`
- CRUD de Subject (admin)
- `GET /subjects` (com filtro), `GET /subjects/{id}` (ementa, bibliografia, resumo)
- Seeds com disciplinas e pré-requisitos de exemplo

**Frontend:**
- Tela de listar disciplinas do curso
- Tela de detalhe da disciplina
- Barra de pesquisa por nome/código
- Admin: formulário de cadastro de disciplina

---

### Sprint 3 — Fluxograma Pessoal (US2)
*Estimativa: 1 sprint*

**Backend:**
- Model `FlowchartItem`
- Endpoints: `GET/POST/PUT/DELETE /flowchart`
- Validação: não adicionar disciplina sem pré-requisitos cumpridos
- `GET /flowchart/suggestions` (retorna disciplinas disponíveis)

**Frontend:**
- Grid visual semestres × disciplinas
- Adicionar/remover disciplinas de semestres
- Validação visual de pré-requisitos (bloqueio + mensagem)
- Botão "Sugestões" com modal de disciplinas liberadas
- Marcar disciplina como cursada

---

### Sprint 4 — Avaliações (US3)
*Estimativa: ½ sprint*

**Backend:**
- Model `Review`
- `POST /subjects/{id}/reviews` (só se completed, uma por usuário)
- `GET /subjects/{id}/reviews`
- Upload de comprovante (arquivo local / S3)

**Frontend:**
- Tela de avaliar disciplina (nota + resenha + upload)
- Tela pública de avaliações por disciplina
- Restrição visual: apenas uma avaliação por disciplina

## Regras de negócio

1. **Pré-requisito:** só adiciona disciplina ao fluxograma se todos os pré-requisitos estiverem marcados como `completed`
2. **Sugestões:** disciplinas cujos pré-requisitos foram cumpridos e que ainda não estão no fluxograma
3. **Avaliação:** apenas uma por disciplina por usuário; apenas se a disciplina estiver como `completed`
4. **Admin:** cadastro de cursos e disciplinas (definir se qualquer usuário ou papel específico)
