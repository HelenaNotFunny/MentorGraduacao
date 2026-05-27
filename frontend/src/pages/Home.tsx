import { useNavigate } from "react-router-dom";

export function Home() {
  const navigate = useNavigate();

  return (
    <div style={styles.container}>
      <h2>Bem-vindo ao Mentor Graduação</h2>
      <p>Planeje o fluxo da sua graduação.</p>
      <div style={styles.actions}>
        <button style={styles.button} onClick={() => navigate("/courses")}>
          Gerenciar Cursos
        </button>
        <button style={styles.button} onClick={() => navigate("/subjects")}>
          Ver Disciplinas
        </button>
      </div>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  container: {
    textAlign: "center",
    marginTop: "4rem",
  },
  actions: { marginTop: "1.5rem", display: "flex", gap: "1rem", justifyContent: "center" },
  button: {
    padding: "0.5rem 1.25rem",
    background: "#1a73e8",
    color: "#fff",
    border: "none",
    borderRadius: 4,
    cursor: "pointer",
    fontSize: "1rem",
    fontWeight: 600,
  },
};
