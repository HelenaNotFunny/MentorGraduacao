import { api } from "./api";
import { Subject } from "./subject";

export interface FlowchartItem {
  id: number;
  subject_id: number;
  subject_nome: string;
  subject_codigo: string;
  semester_index: number;
  status: string;
}

export const flowchartService = {
  list: () => api.get<FlowchartItem[]>("/flowchart/"),

  add: (data: { subject_id: number; semester_index: number }) =>
    api.post<FlowchartItem>("/flowchart/", data),

  update: (id: number, data: { semester_index?: number; status?: string }) =>
    api.put<FlowchartItem>(`/flowchart/${id}`, data),

  remove: (id: number) =>
    api.delete<void>(`/flowchart/${id}`),

  suggestions: () => api.get<Subject[]>("/flowchart/suggestions"),
};
