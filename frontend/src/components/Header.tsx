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
        Mentor Graduação
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
    background: "#1a73e8",
    color: "#fff",
  },
  title: { cursor: "pointer", margin: 0, fontSize: "1.25rem" },
  userArea: { display: "flex", alignItems: "center", gap: "0.75rem" },
  button: {
    background: "#fff",
    color: "#1a73e8",
    border: "none",
    padding: "0.35rem 0.75rem",
    borderRadius: 4,
    cursor: "pointer",
    fontWeight: 600,
  },
};
