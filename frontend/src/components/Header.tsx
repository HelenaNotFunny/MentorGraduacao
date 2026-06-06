import { useNavigate } from "react-router-dom";
import { auth } from "../services/auth";

interface HeaderProps {
  user: { nome: string; email: string } | null;
  onLogout: () => void;
}

export function Header({ user, onLogout }: HeaderProps) {
  const navigate = useNavigate();

  return (
    <header style={styles.header}>
      <h1 style={styles.title} onClick={() => navigate("/")}>
        Mentor de Graduação
      </h1>
      {user ? (
        <div style={styles.userArea}>
          <span>{user.nome}</span>
          <button style={styles.button} onClick={() => { auth.logout(); onLogout(); navigate("/"); }}>
            Sair
          </button>
        </div>
      ) : (
        <div>
          <button style={styles.button} onClick={() => navigate("/login")}>
            Entrar
          </button>
        </div>
      )}
    </header>
  );
}

const styles: Record<string, React.CSSProperties> = {
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "0.75rem 1.5rem",
    background: "#ffffff",
    borderBottom: "1px solid #e2e8f0",
    fontFamily: "'Segoe UI'",
    color: "#1a202c",
  },
  title: { 
    margin: 0, 
    cursor: "pointer",
    fontFamily: "Segoe UI",
    fontSize: "1.35rem",
    fontWeight: 700, 
    background: "#3182ce", 
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent", 
  },
  userArea: { display: "flex", alignItems: "center", gap: "0.75rem" },
  button: {
    background: "#3182ce",
    color: "#ffffff",
    border: "none",
    fontSize: "0.85rem",
    padding: "0.35rem 0.75rem",
    borderRadius: 25,
    cursor: "pointer",
    fontWeight: 600,
  },
};
