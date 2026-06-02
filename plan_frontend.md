# Plano de Atualizações do Frontend

## 1. Cadastro com seleção de curso

**Problema:** `Login.tsx` não envia `curso_id` no registro, mas o backend
(`UserRegister.curso_id: int`) exige.

**O que fazer:**
- Buscar lista de cursos de `GET /courses/` via `courseService.list()`
- Adicionar `<select>` no formulário de registro com os cursos carregados
- Passar `curso_id` no `auth.register()`

**Arquivos:** `src/pages/Login.tsx`

---

## 2. Cursos carregados da API (remover dados demo)

**Problema:** `Courses.tsx` usa dados hardcoded e `courseService.list()` está
comentado.

**O que fazer:**
- Descomentar `courseService.list().then(setCourses)` e remover
  `cursosDemonstracao`

**Arquivos:** `src/pages/Courses.tsx`

---

## 3. Rota do fluxograma com `courseId`

**Problema:** `Courses.tsx` navega para `/flowchart/${course.id}` mas
`App.tsx` registra só `/flowchart`.

**O que fazer:**
- Criar rota `/flowchart/:courseId` em `App.tsx`
- `Flowchart.tsx` deve extrair o `courseId` via `useParams()` e filtrar dados
  por curso
- Manter compatibilidade com rota `/flowchart` (sem courseId)

**Arquivos:** `src/App.tsx`, `src/pages/Flowchart.tsx`

---

## 4. Seleção de curso em SubjectCreate

**Problema:** `SubjectCreate.tsx` hardcodes `course_id: 1`.

**O que fazer:**
- Adicionar `<select>` de cursos (igual ao cadastro)
- Usar o curso selecionado em vez de `1`

**Arquivos:** `src/pages/SubjectCreate.tsx`

---

## 5. Feedback visual pós-registro

- Após registro bem-sucedido, exibir mensagem de confirmação antes do redirect
- Evita silêncio entre registro e login automático

**Arquivos:** `src/pages/Login.tsx`

---

## 6. (Opcional) Guardião de rotas autenticadas

- `Flowchart.tsx` já faz o check manualmente
- Criar componente `ProtectedRoute` genérico para reúso

**Arquivos:** `src/components/ProtectedRoute.tsx`, `src/App.tsx`

---

## Dependências

```
1 (registro)       ← independente (mas precisa da API de cursos)
2 (cursos API)     ← independente, pré-requisito para 1 e 4
3 (rota fluxo)     ← depende de 2
4 (subject curso)  ← depende de 2
5 (feedback)       ← depende de 1
6 (guard)          ← independente
```
