import { api } from "./api";

export interface Review {
  id: number;
  user_id: number;
  subject_id: number;
  nota: number;
  resenha: string | null;
  comprovante_url: string | null;
  created_at: string;
  autor_nome: string;
}

export const reviewService = {
  list: (subjectId: number) =>
    api.get<Review[]>(`/subjects/${subjectId}/reviews`),

  create: (
    subjectId: number,
    data: { nota: number; resenha?: string },
    comprovante?: File,
  ) => {
    const formData = new FormData();
    formData.append("nota", String(data.nota));
    if (data.resenha) formData.append("resenha", data.resenha);
    if (comprovante) formData.append("comprovante", comprovante);

    const token = localStorage.getItem("token");
    return fetch(`/api/subjects/${subjectId}/reviews`, {
      method: "POST",
      headers: token ? { Authorization: `Bearer ${token}` } : {},
      body: formData,
    }).then(async (res) => {
      if (!res.ok) {
        const body = await res.json().catch(() => ({ detail: res.statusText }));
        throw new Error(body.detail ?? "Erro inesperado");
      }
      return res.json() as Promise<Review>;
    });
  },
};
