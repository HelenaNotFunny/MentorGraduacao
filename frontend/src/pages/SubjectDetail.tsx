import { FormEvent, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Review, reviewService } from "../services/review";
import { auth } from "../services/auth";
import { Subject, subjectService } from "../services/subject";

export function SubjectDetail() {
  const { id } = useParams();
  const [subject, setSubject] = useState<Subject | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [prereqNames, setPrereqNames] = useState<string[]>([]);
  const [nota, setNota] = useState("");
  const [resenha, setResenha] = useState("");
  const [comprovante, setComprovante] = useState<File | null>(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    if (!id) return;
    subjectService.getById(Number(id)).then(async (s) => {
      setSubject(s);
      if (s.prerequisitos.length > 0) {
        const names = await Promise.all(
          s.prerequisitos.map((p) =>
            subjectService.getById(p.prerequisite_subject_id).then((ps) => ps.nome)
          )
        );
        setPrereqNames(names);
      }
    });
    reviewService.list(Number(id)).then(setReviews).catch(console.error);
  }, [id]);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");
    setSuccess("");
    try {
      const review = await reviewService.create(
        Number(id),
        { nota: Number(nota), resenha: resenha || undefined },
        comprovante ?? undefined,
      );
      setReviews((prev) => [review, ...prev]);
      setNota("");
      setResenha("");
      setComprovante(null);
      setSuccess("Avaliação enviada!");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro inesperado");
    }
  }

  if (!subject) return <p>Carregando...</p>;

  const myReview = reviews.find((r) => r.user_id === auth.getUserId());

  return (
    <div style={styles.container}>
      <h2>
        {subject.codigo} — {subject.nome}
      </h2>
      <p>
        <strong>Período recomendado:</strong>{" "}
        {subject.periodo_recomendado ?? "Não informado"}
      </p>

      {prereqNames.length > 0 && (
        <div>
          <strong>Pré-requisitos:</strong>
          <ul>
            {prereqNames.map((n, i) => (
              <li key={i}>{n}</li>
            ))}
          </ul>
        </div>
      )}

      {subject.ementa && (
        <div style={styles.section}>
          <strong>Ementa</strong>
          <p>{subject.ementa}</p>
        </div>
      )}

      {subject.bibliografia && (
        <div style={styles.section}>
          <strong>Bibliografia</strong>
          <p>{subject.bibliografia}</p>
        </div>
      )}

      {subject.resumo && (
        <div style={styles.section}>
          <strong>Resumo</strong>
          <p>{subject.resumo}</p>
        </div>
      )}

      <hr style={styles.divider} />

      <div style={styles.section}>
        <h3>Avaliações</h3>

        {auth.isAuthenticated() && !myReview && (
          <form onSubmit={handleSubmit} style={styles.form} encType="multipart/form-data">
            <h4>Avaliar disciplina</h4>
            {error && <p style={styles.error}>{error}</p>}
            {success && <p style={styles.success}>{success}</p>}
            <div style={styles.field}>
              <label>Nota (0–10):</label>
              <input
                type="number"
                min={0}
                max={10}
                step={0.5}
                value={nota}
                onChange={(e) => setNota(e.target.value)}
                required
                style={styles.input}
              />
            </div>
            <div style={styles.field}>
              <label>Resenha:</label>
              <textarea
                value={resenha}
                onChange={(e) => setResenha(e.target.value)}
                rows={3}
                style={styles.textarea}
              />
            </div>
            <div style={styles.field}>
              <label>Comprovante (opcional):</label>
              <input
                type="file"
                onChange={(e) => setComprovante(e.target.files?.[0] ?? null)}
                style={styles.input}
              />
            </div>
            <button type="submit" style={styles.button}>
              Enviar Avaliação
            </button>
          </form>
        )}

        {myReview && (
          <p style={{ color: "#666", fontStyle: "italic" }}>
            Você já avaliou esta disciplina.
          </p>
        )}

        {reviews.length === 0 ? (
          <p>Nenhuma avaliação ainda.</p>
        ) : (
          <div style={styles.reviewList}>
            {reviews.map((r) => (
              <div key={r.id} style={styles.reviewCard}>
                <div style={styles.reviewHeader}>
                  <strong>{r.autor_nome}</strong>
                  <span style={styles.nota}>Nota: {r.nota}</span>
                </div>
                {r.resenha && <p style={styles.resenha}>{r.resenha}</p>}
                {r.comprovante_url && (
                  <a
                    href={r.comprovante_url}
                    target="_blank"
                    rel="noreferrer"
                    style={styles.link}
                  >
                    Ver comprovante
                  </a>
                )}
                <p style={styles.date}>
                  {new Date(r.created_at).toLocaleDateString("pt-BR")}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  container: { maxWidth: 700, margin: "2rem auto", padding: "0 1rem" },
  section: { marginTop: "1rem" },
  divider: { margin: "1.5rem 0", border: "none", borderTop: "1px solid #eee" },
  form: {
    background: "#f9f9f9",
    padding: "1rem",
    borderRadius: 8,
    marginBottom: "1.5rem",
  },
  field: { display: "flex", flexDirection: "column", gap: "0.25rem", marginBottom: "0.75rem" },
  input: {
    padding: "0.4rem",
    border: "1px solid #ccc",
    borderRadius: 4,
    fontSize: "0.9rem",
  },
  textarea: {
    padding: "0.4rem",
    border: "1px solid #ccc",
    borderRadius: 4,
    fontSize: "0.9rem",
    fontFamily: "inherit",
    resize: "vertical",
  },
  button: {
    padding: "0.5rem 1rem",
    background: "#1a73e8",
    color: "#fff",
    border: "none",
    borderRadius: 4,
    cursor: "pointer",
    fontWeight: 600,
  },
  error: { color: "#d32f2f", margin: 0, fontSize: "0.875rem" },
  success: { color: "#388e3c", margin: 0, fontSize: "0.875rem" },
  reviewList: { display: "flex", flexDirection: "column", gap: "0.75rem" },
  reviewCard: {
    border: "1px solid #ddd",
    borderRadius: 6,
    padding: "0.75rem",
    background: "#fff",
  },
  reviewHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  nota: { fontWeight: 600, color: "#1a73e8" },
  resenha: { margin: "0.5rem 0", fontSize: "0.9rem" },
  link: { color: "#1a73e8", fontSize: "0.85rem" },
  date: { margin: "0.25rem 0 0", fontSize: "0.8rem", color: "#888" },
};
