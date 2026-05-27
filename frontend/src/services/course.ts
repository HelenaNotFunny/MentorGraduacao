import { api } from "./api";

export interface Course {
  id: number;
  nome: string;
  instituicao: string;
}

export const courseService = {
  list: () => api.get<Course[]>("/courses/"),
  create: (data: { nome: string; instituicao: string }) =>
    api.post<Course>("/courses/", data),
};
