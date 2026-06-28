import { FormEvent, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { subjectService } from "../services/subject";
import { Course, courseService } from "../services/course";

interface SubjectOption {
  id: number;
  nome: string;
  codigo: string;
}

export function SubjectCreate() {
  const navigate = useNavigate();
  const [nome, setNome] = useState("");
  const [codigo, setCodigo] = useState("");
  const [ementa, setEmenta] = useState("");
  const [bibliografia, setBibliografia] = useState("");
  const [resumo, setResumo] = useState("");
  const [periodo, setPeriodo] = useState("");
  const [cursoId, setCursoId] = useState("");
  const [courses, setCourses] = useState<Course[]>([]);
  
  const [filteredSubjects, setFilteredSubjects] = useState<SubjectOption[]>([]);
  const [prerequisitosIds, setPrerequisitosIds] = useState<number[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  
  const [erro, setErro] = useState("");

  useEffect(() => {
    courseService.list().then(setCourses).catch(console.error);
  }, []);

  useEffect(() => {
    if (!cursoId) {
      setFilteredSubjects([]);
      setPrerequisitosIds([]);
      setSearchTerm("");
      return;
    }

    setPrerequisitosIds([]);
    setSearchTerm("");

    subjectService.list({ course_id: Number(cursoId) })
      .then((response) => {
        setFilteredSubjects(response); 
      })
      .catch(console.error);
  }, [cursoId]);

  const togglePrerequisito = (id: number) => {
    setPrerequisitosIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const subjectsToShow = filteredSubjects.filter((sub) =>
    sub.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
    sub.codigo.toLowerCase().includes(searchTerm.toLowerCase())
  );

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    try {
      setErro("");

      const subject = await subjectService.create({
        course_ids: [Number(cursoId)],
        nome,
        codigo,
        ementa: ementa || undefined,
        bibliografia: bibliografia || undefined,
        resumo: resumo || undefined,
        periodo_recomendado: periodo ? Number(periodo) : undefined,
        prerequisite_ids: prerequisitosIds, 
      });

      navigate(`/subjects/${subject.id}`);
    } catch (err: any) {
      setErro(err.message);
    }
  }

  return (
    <div style={styles.container}>
      <header style={styles.formHeader}>
        <h2 style={styles.title}>Nova Disciplina</h2>
        <p style={styles.subtitle}>Preencha os dados abaixo para cadastrar a matéria na grade curricular.</p>
      </header>
      
      {erro && (
        <div style={styles.errorBadge}>
          <div>{erro}</div>
        </div>
      )}

      <form onSubmit={handleSubmit} style={styles.form}>
        
        {/* CURSO */}
        <div style={styles.formGroup}>
          <label style={styles.label}>Curso de Vínculo *</label>
          <select
            value={cursoId}
            onChange={(e) => setCursoId(e.target.value)}
            required
            style={styles.input}
          >
            <option value="">Selecione o curso correspondente</option>
            {courses.map((c) => (
              <option key={c.id} value={c.id}>
                {c.nome}
              </option>
            ))}
          </select>
        </div>

        <div style={styles.gridTwoColumns}>
          <div style={styles.formGroup}>
            <label style={styles.label}>Nome da Disciplina *</label>
            <input
              placeholder="Ex: Estrutura de Dados"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              required
              style={styles.input}
            />
          </div>
          
          <div style={styles.formGroup}>
            <label style={styles.label}>Código *</label>
            <input
              placeholder="Ex: IMD0014"
              value={codigo}
              onChange={(e) => setCodigo(e.target.value)}
              required
              style={styles.input}
            />
          </div>
        </div>
        
        <div style={styles.formGroup}>
          <label style={styles.label}>Período Recomendado</label>
          <input
            placeholder="Ex: 3"
            type="number"
            value={periodo}
            onChange={(e) => setPeriodo(e.target.value)}
            style={styles.input}
          />
        </div>

        <div style={styles.prereqSection}>
          <label style={styles.label}>Pré-requisitos</label>
          
          {cursoId && (
            <div style={styles.searchContainer}>
              <input
                type="text"
                placeholder="Filtrar por nome ou código..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={styles.searchInput}
              />
            </div>
          )}
          
          {!cursoId ? (
            <div style={styles.placeholderBox}>
              Selecione um curso acima para listar as disciplinas disponíveis.
            </div>
          ) : filteredSubjects.length === 0 ? (
            <div style={styles.placeholderBox}>
              Nenhuma disciplina cadastrada neste curso ainda.
            </div>
          ) : subjectsToShow.length === 0 ? (
            <div style={styles.placeholderBox}>
              Nenhuma disciplina corresponde à busca.
            </div>
          ) : (
            <div style={styles.tagsContainer}>
              {subjectsToShow.map((sub) => {
                const isSelected = prerequisitosIds.includes(sub.id);
                return (
                  <button
                    type="button" 
                    key={sub.id}
                    onClick={() => togglePrerequisito(sub.id)}
                    style={{
                      ...styles.badgeButton,
                      backgroundColor: isSelected ? "#ebf8ff" : "#f7fafc",
                      borderColor: isSelected ? "#1a73e8" : "#e2e8f0",
                      color: isSelected ? "#2b6cb0" : "#4a5568",
                    }}
                  >
                    <span style={{
                      ...styles.codeInline,
                      color: isSelected ? "#1a73e8" : "#718096"
                    }}>
                      {sub.codigo}
                    </span>
                    {sub.nome}
                    {isSelected && <span style={styles.checkMark}>✓</span>}
                  </button>
                );
              })}
            </div>
          )}
        </div>

        <div style={styles.gridTwoColumns}>
          <div style={styles.formGroup}>
            <label style={styles.label}>Ementa</label>
            <textarea
              placeholder="Descreva a ementa da disciplina..."
              value={ementa}
              onChange={(e) => setEmenta(e.target.value)}
              rows={4}
              style={styles.textarea}
            />
          </div>
          
          <div style={styles.formGroup}>
            <label style={styles.label}>Resumo</label>
            <textarea
              placeholder="Breve resumo dos tópicos..."
              value={resumo}
              onChange={(e) => setResumo(e.target.value)}
              rows={4}
              style={styles.textarea}
            />
          </div>
        </div>

        <div style={styles.formGroup}>
          <label style={styles.label}>Bibliografia</label>
          <textarea
            placeholder="Principais livros e referências..."
            value={bibliografia}
            onChange={(e) => setBibliografia(e.target.value)}
            rows={3}
            style={styles.textarea}
          />
        </div>
        
        <div style={styles.actionsContainer}>
          <button 
            type="button" 
            onClick={() => navigate(-1)} 
            style={styles.cancelButton}
          >
            Cancelar
          </button>
          <button type="submit" style={styles.button}>
            Cadastrar Disciplina
          </button>
        </div>
      </form>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  container: { 
    maxWidth: 750, 
    margin: "3rem auto", 
    padding: "2.5rem", 
    backgroundColor: "#ffffff", 
    borderRadius: "16px", 
    boxShadow: "0 10px 25px -5px rgba(0,0,0,0.05), 0 8px 10px -6px rgba(0,0,0,0.05)",
    fontFamily: "'Segoe UI', system-ui, sans-serif"
  },
  formHeader: {
    marginBottom: "2rem",
    borderBottom: "1px solid #e2e8f0",
    paddingBottom: "1.2rem"
  },
  title: { 
    fontSize: "1.6rem", 
    fontWeight: 700, 
    margin: 0,
    fontFamily: "'Segoe UI', sans-serif",
    background: "#1a73e8", 
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    letterSpacing: "-0.02em"
  },
  subtitle: {
    fontSize: "0.95rem",
    color: "#718096",
    marginTop: "0.35rem",
    marginBottom: 0
  },
  form: { 
    display: "flex", 
    flexDirection: "column", 
    gap: "1.5rem" 
  },
  formGroup: {
    display: "flex",
    flexDirection: "column",
    gap: "0.5rem"
  },
  gridTwoColumns: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
    gap: "1.5rem"
  },
  label: { 
    fontSize: "0.875rem", 
    fontWeight: 600, 
    color: "#4a5568",
  },
  input: {
    padding: "0.75rem 1rem",
    border: "1px solid #cbd5e0",
    borderRadius: "10px",
    fontSize: "0.95rem",
    color: "#2d3748",
    outline: "none",
    backgroundColor: "#f7fafc",
    transition: "all 0.2s ease",
  },
  prereqSection: {
    display: "flex", 
    flexDirection: "column", 
    gap: "0.75rem",
    backgroundColor: "#f7fafc",
    padding: "1.25rem",
    borderRadius: "12px",
    border: "1px solid #edf2f7"
  },
  searchContainer: {
    position: "relative",
    display: "flex",
    alignItems: "center"
  },
  searchIcon: {
    position: "absolute",
    left: "12px",
    fontSize: "0.9rem",
    color: "#a0aec0",
    pointerEvents: "none"
  },
  searchInput: {
    width: "100%",
    padding: "0.65rem 1rem 0.65rem 2.25rem",
    border: "1px solid #cbd5e0",
    borderRadius: "8px",
    fontSize: "0.9rem",
    outline: "none",
    backgroundColor: "#ffffff",
    transition: "all 0.2s",
  },
  textarea: {
    padding: "0.75rem 1rem",
    border: "1px solid #cbd5e0",
    borderRadius: "10px",
    fontSize: "0.95rem",
    color: "#2d3748",
    fontFamily: "inherit",
    resize: "vertical",
    outline: "none",
    backgroundColor: "#f7fafc",
    transition: "all 0.2s ease",
  },
  actionsContainer: {
    display: "flex",
    justifyContent: "flex-end",
    gap: "1rem",
    marginTop: "1.5rem",
    borderTop: "1px solid #e2e8f0",
    paddingTop: "1.5rem"
  },
  cancelButton: {
    padding: "0.5rem 1.25rem",
    background: "transparent",
    color: "#718096",
    border: "1px solid #cbd5e0",
    borderRadius: "25px",
    cursor: "pointer",
    fontSize: "0.85rem",
    fontWeight: 600,
    transition: "all 0.2s",
  },
  button: {
    background: "#1a73e8",
    color: "#ffffff",
    border: "none",
    fontSize: "0.85rem",
    padding: "0.5rem 1.5rem",
    borderRadius: 25,
    cursor: "pointer",
    fontWeight: 600,
    boxShadow: "0 4px 6px -1px rgba(49, 130, 206, 0.2)",
    transition: "all 0.2s ease",
  },
  errorBadge: {
    backgroundColor: "#fff5f5",
    color: "#c53030",
    padding: "1rem",
    borderRadius: "10px",
    fontSize: "0.9rem",
    border: "1px solid #fed7d7",
    display: "flex",
    alignItems: "center",
    gap: "0.75rem"
  },
  placeholderBox: {
    padding: "1.5rem",
    textAlign: "center",
    color: "#718096",
    backgroundColor: "#ffffff",
    borderRadius: "8px",
    fontSize: "0.9rem",
    border: "1px dashed #e2e8f0"
  },
  tagsContainer: {
    display: "flex",
    flexWrap: "wrap",
    gap: "8px",
    maxHeight: "200px",
    overflowY: "auto",
    padding: "0.5rem",
    backgroundColor: "#ffffff",
    borderRadius: "8px",
    border: "1px solid #e2e8f0"
  },
  badgeButton: {
    display: "inline-flex",
    alignItems: "center",
    gap: "6px",
    padding: "5px 12px",
    border: "1px solid",
    borderRadius: "9999px",
    cursor: "pointer",
    userSelect: "none",
    fontSize: "0.85rem",
    transition: "all 0.15s ease",
    outline: "none",
  },
  codeInline: {
    fontWeight: 700,
    fontSize: "0.8rem",
  },
  checkMark: {
    marginLeft: "2px",
    fontWeight: "bold"
  }
};