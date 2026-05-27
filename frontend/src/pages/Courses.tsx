import { FormEvent, useEffect, useState } from "react";
import { Course, courseService } from "../services/course";

export function Courses() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [nome, setNome] = useState("");
  const [instituicao, setInstituicao] = useState("");

  useEffect(() => {
    courseService.list().then(setCourses).catch(console.error);
  }, []);

  async function handleCreate(e: FormEvent) {
    e.preventDefault();
    const course = await courseService.create({ nome, instituicao });
    setCourses((prev) => [...prev, course]);
    setNome("");
    setInstituicao("");
  }

  return (
    <div style={styles.container}>
      <h2>Cursos</h2>

      <form onSubmit={handleCreate} style={styles.form}>
        <input
          placeholder="Nome do curso"
          value={nome}
          onChange={(e) => setNome(e.target.value)}
          required
          style={styles.input}
        />
        <input
          placeholder="Instituição"
          value={instituicao}
          onChange={(e) => setInstituicao(e.target.value)}
          required
          style={styles.input}
        />
        <button type="submit" style={styles.button}>
          Cadastrar Curso
        </button>
      </form>

      <ul style={styles.list}>
        {courses.map((c) => (
          <li key={c.id} style={styles.listItem}>
            <strong>{c.nome}</strong> — {c.instituicao}
          </li>
        ))}
      </ul>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  container: { maxWidth: 600, margin: "2rem auto", padding: "0 1rem" },
  form: { display: "flex", gap: "0.5rem", marginBottom: "1.5rem" },
  input: {
    flex: 1,
    padding: "0.5rem",
    border: "1px solid #ccc",
    borderRadius: 4,
    fontSize: "1rem",
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
  list: { listStyle: "none", padding: 0 },
  listItem: { padding: "0.5rem 0", borderBottom: "1px solid #eee" },
};
