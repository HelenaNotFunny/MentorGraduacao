import { useNavigate } from "react-router-dom";
import React from "react";
import {GraduationCap, BookOpen, Network } from "lucide-react";

export function Home() {
  const navigate = useNavigate();

  return (
    <div style={styles.container}>
      
      <header style={styles.header}>
        <h2 style={styles.title}>Bem-vindo ao Mentor de Graduação</h2>
        <p style={styles.subtitle}>Planeje o fluxo da sua graduação de forma simples e organizada.</p>
      </header>

      <div style={styles.actions}>
        
        {/* Card 1: Gerenciar Cursos */}
        <button style={styles.card} onClick={() => navigate("/courses")}>
          <div style={styles.icon}><GraduationCap size={48} color="#3182ce" strokeWidth={1.5} />
          </div>
          <h3 style={styles.cardTitle}>Gerenciar Cursos</h3>
          <p style={styles.cardText}>Adicione ou edite a grade curricular do seu curso.</p>
        </button>

        {/* Card 2: Ver Disciplinas */}
        <button style={styles.card} onClick={() => navigate("/subjects")}>
          <div style={styles.icon}><BookOpen size={48} color="#3182ce" strokeWidth={1.5} /></div>
          <h3 style={styles.cardTitle}>Ver Disciplinas</h3>
          <p style={styles.cardText}>Explore as matérias, ementas e pré-requisitos.</p>
        </button>

        {/* Card 3: Meu Fluxograma */}
        <button style={styles.card} onClick={() => navigate("/flowchart")}>
          <div style={styles.icon}><Network size={48} color="#3182ce" strokeWidth={1.5} /></div>
          <h3 style={styles.cardTitle}>Meu Fluxograma</h3>
          <p style={styles.cardText}>Visualize sua trajetória e planeje os próximos semestres.</p>
        </button>

      </div>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  container: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    minHeight: "80vh", 
    textAlign: "center",
    fontFamily: "'Roboto Mono, 'Segoe UI', Roboto",
    backgroundColor: "#f8f9fa", 
    padding: "2rem",
  },
  header: {
    marginBottom: "3rem",
  },
  title: {
    fontSize: "2.5rem",
    color: "#1a202c",
    marginBottom: "0.5rem",
    fontWeight: 700,
  },
  subtitle: {
    fontSize: "1.1rem",
    color: "#718096",
  },
  actions: {
    display: "flex",
    gap: "1.5rem",
    justifyContent: "center",
    flexWrap: "wrap", 
    maxWidth: "900px",
  },
  card: {
    backgroundColor: "#ffffff",
    border: "1px solid #e2e8f0",
    borderRadius: "12px",
    padding: "2rem 1.5rem",
    cursor: "pointer",
    width: "260px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.02)",
    transition: "transform 0.2s ease, box-shadow 0.2s ease",
  },
  icon: {
    fontSize: "2.5rem",
    marginBottom: "1rem",
  },
  cardTitle: {
    fontSize: "1.25rem",
    color: "#2d3748",
    marginBottom: "0.5rem",
    fontWeight: 600,
  },
  cardText: {
    fontSize: "0.95rem",
    color: "#a0aec0",
    lineHeight: 1.4,
    margin: 0,
  },
};
