import { api } from "./api";

export interface User {
  id: number;
  nome: string;
  email: string;
  curso_id: number | null;
  is_admin: boolean;
}

export interface Token {
  access_token: string;
  token_type: string;
}

function decodificarToken(token: string): { sub: string } | null {
  try {
    return JSON.parse(atob(token.split(".")[1]));
  } catch {
    return null;
  }
}

export const auth = {
  register: (data: { nome: string; email: string; senha: string; curso_id?: number }) =>
    api.post<User>("/auth/register", data),

  login: (data: { email: string; senha: string }) =>
    api.post<Token>("/auth/login", data),

  me: () => api.get<User>("/auth/me"),

  logout: () => localStorage.removeItem("token"),

  getToken: () => localStorage.getItem("token"),

  isAuthenticated: () => !!localStorage.getItem("token"),

  getUserId: (): number | null => {
    const token = localStorage.getItem("token");
    if (!token) return null;
    const payload = decodificarToken(token);
    return payload ? Number(payload.sub) : null;
  },
};
