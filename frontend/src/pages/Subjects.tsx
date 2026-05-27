import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Subject, subjectService } from "../services/subject";
import { auth } from "../services/auth";

export function Subjects() {
  const navigate = useNavigate();
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    subjectService
      .list({ search: search || undefined })
      .then(setSubjects)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [search]);

  const isAdmin = auth.isAuthenticated();

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h2>Disciplinas</h2>
        {isAdmin && (
          <button style={styles.button} onClick={() => navigate("/subjects/new")}>
            Nova Disciplina
          </button>
        )}
      </div>

      <input
        placeholder="Pesquisar por nome ou código..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        style={styles.search}
      />

      {loading ? (
        <p>Carregando...</p>
      ) : subjects.length === 0 ? (
        <p>Nenhuma disciplina encontrada.</p>
      ) : (
        <table style={styles.table}>
          <thead>
            <tr>
              <th>Código</th>
              <th>Nome</th>
              <th>Período</th>
            </tr>
          </thead>
          <tbody>
            {subjects.map((s) => (
              <tr
                key={s.id}
                style={styles.row}
                onClick={() => navigate(`/subjects/${s.id}`)}
              >
                <td>{s.codigo}</td>
                <td>{s.nome}</td>
                <td>{s.periodo_recomendado ?? "—"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  container: { maxWidth: 700, margin: "2rem auto", padding: "0 1rem" },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  search: {
    width: "100%",
    padding: "0.5rem",
    border: "1px solid #ccc",
    borderRadius: 4,
    fontSize: "1rem",
    marginBottom: "1rem",
    boxSizing: "border-box",
  },
  table: { width: "100%", borderCollapse: "collapse" },
  row: { cursor: "pointer", borderBottom: "1px solid #eee" },
  button: {
    padding: "0.5rem 1rem",
    background: "#1a73e8",
    color: "#fff",
    border: "none",
    borderRadius: 4,
    cursor: "pointer",
    fontWeight: 600,
  },
};
