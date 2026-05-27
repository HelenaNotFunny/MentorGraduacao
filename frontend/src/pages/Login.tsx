import { FormEvent, useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth } from "../services/auth";

interface LoginProps {
  onLogin: () => void;
}

export function Login({ onLogin }: LoginProps) {
  const navigate = useNavigate();
  const [isRegister, setIsRegister] = useState(false);
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [error, setError] = useState("");

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");

    try {
      if (isRegister) {
        await auth.register({ nome, email, senha });
      }
      const { access_token } = await auth.login({ email, senha });
      localStorage.setItem("token", access_token);
      onLogin();
      navigate("/");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro inesperado");
    }
  }

  return (
    <div style={styles.container}>
      <form onSubmit={handleSubmit} style={styles.form}>
        <h2>{isRegister ? "Criar conta" : "Entrar"}</h2>

        {error && <p style={styles.error}>{error}</p>}

        {isRegister && (
          <input
            placeholder="Nome"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            required
            style={styles.input}
          />
        )}

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          style={styles.input}
        />

        <input
          type="password"
          placeholder="Senha"
          value={senha}
          onChange={(e) => setSenha(e.target.value)}
          required
          minLength={6}
          style={styles.input}
        />

        <button type="submit" style={styles.button}>
          {isRegister ? "Cadastrar" : "Entrar"}
        </button>

        <p style={styles.toggle}>
          {isRegister ? "Já tem conta?" : "Não tem conta?"}{" "}
          <button
            type="button"
            onClick={() => setIsRegister(!isRegister)}
            style={styles.link}
          >
            {isRegister ? "Entrar" : "Cadastre-se"}
          </button>
        </p>
      </form>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  container: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    minHeight: "calc(100vh - 60px)",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "0.75rem",
    width: 320,
    padding: "2rem",
    borderRadius: 8,
    boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
  },
  input: {
    padding: "0.5rem",
    border: "1px solid #ccc",
    borderRadius: 4,
    fontSize: "1rem",
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
  error: { color: "#d32f2f", margin: 0, fontSize: "0.875rem" },
  toggle: { textAlign: "center", fontSize: "0.875rem", margin: 0 },
  link: {
    background: "none",
    border: "none",
    color: "#1a73e8",
    cursor: "pointer",
    textDecoration: "underline",
    fontSize: "0.875rem",
  },
};
