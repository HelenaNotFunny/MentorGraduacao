import { api } from "./api";

export interface Prerequisite {
  id: number;
  prerequisite_subject_id: number;
}

export interface Subject {
  id: number;
  course_id: number;
  nome: string;
  codigo: string;
  ementa: string | null;
  bibliografia: string | null;
  resumo: string | null;
  periodo_recomendado: number | null;
  prerequisitos: Prerequisite[];
}

export const subjectService = {
  list: (params?: { course_id?: number; search?: string }) => {
    const query = new URLSearchParams();
    if (params?.course_id) query.set("course_id", String(params.course_id));
    if (params?.search) query.set("search", params.search);
    const qs = query.toString();
    return api.get<Subject[]>(`/subjects/${qs ? `?${qs}` : ""}`);
  },

  getById: (id: number) => api.get<Subject>(`/subjects/${id}`),

  create: (data: {
    course_id: number;
    nome: string;
    codigo: string;
    ementa?: string;
    bibliografia?: string;
    resumo?: string;
    periodo_recomendado?: number;
  }) => api.post<Subject>("/subjects/", data),
};
