import { FormEvent, useState } from "react";
import { useNavigate } from "react-router-dom";
import { subjectService } from "../services/subject";

export function SubjectCreate() {
  const navigate = useNavigate();
  const [nome, setNome] = useState("");
  const [codigo, setCodigo] = useState("");
  const [ementa, setEmenta] = useState("");
  const [bibliografia, setBibliografia] = useState("");
  const [resumo, setResumo] = useState("");
  const [periodo, setPeriodo] = useState("");

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const subject = await subjectService.create({
      course_id: 1,
      nome,
      codigo,
      ementa: ementa || undefined,
      bibliografia: bibliografia || undefined,
      resumo: resumo || undefined,
      periodo_recomendado: periodo ? Number(periodo) : undefined,
    });
    navigate(`/subjects/${subject.id}`);
  }

  return (
    <div style={styles.container}>
      <h2>Nova Disciplina</h2>
      <form onSubmit={handleSubmit} style={styles.form}>
        <input
          placeholder="Nome"
          value={nome}
          onChange={(e) => setNome(e.target.value)}
          required
          style={styles.input}
        />
        <input
          placeholder="Código (ex.: IMD0014)"
          value={codigo}
          onChange={(e) => setCodigo(e.target.value)}
          required
          style={styles.input}
        />
        <input
          placeholder="Período recomendado"
          type="number"
          value={periodo}
          onChange={(e) => setPeriodo(e.target.value)}
          style={styles.input}
        />
        <textarea
          placeholder="Ementa"
          value={ementa}
          onChange={(e) => setEmenta(e.target.value)}
          rows={3}
          style={styles.textarea}
        />
        <textarea
          placeholder="Bibliografia"
          value={bibliografia}
          onChange={(e) => setBibliografia(e.target.value)}
          rows={3}
          style={styles.textarea}
        />
        <textarea
          placeholder="Resumo"
          value={resumo}
          onChange={(e) => setResumo(e.target.value)}
          rows={3}
          style={styles.textarea}
        />
        <button type="submit" style={styles.button}>
          Cadastrar Disciplina
        </button>
      </form>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  container: { maxWidth: 600, margin: "2rem auto", padding: "0 1rem" },
  form: { display: "flex", flexDirection: "column", gap: "0.75rem" },
  input: {
    padding: "0.5rem",
    border: "1px solid #ccc",
    borderRadius: 4,
    fontSize: "1rem",
  },
  textarea: {
    padding: "0.5rem",
    border: "1px solid #ccc",
    borderRadius: 4,
    fontSize: "1rem",
    fontFamily: "inherit",
    resize: "vertical",
  },
  button: {
    padding: "0.5rem",
    background: "#1a73e8",
    color: "#fff",
    border: "none",
    borderRadius: 4,
    cursor: "pointer",
    fontSize: "1rem",
    fontWeight: 600,
  },
};
