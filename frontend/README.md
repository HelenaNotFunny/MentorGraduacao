# MentorGraduação — Frontend

## Stack

React 18 + TypeScript + Vite + React Router

## Rodar

```bash
npm install
npm run dev
```

Servidor em `http://localhost:5173`. Requisições `/api/*` são proxyadas para `http://localhost:8000`.

## Build

```bash
npm run build
```

Gera o bundle em `dist/`.

## Estrutura

```
src/
├── components/   # Componentes reutilizáveis (Header)
├── pages/        # Páginas (Home, Login, Courses)
└── services/     # API client + serviços (auth, course)
```
