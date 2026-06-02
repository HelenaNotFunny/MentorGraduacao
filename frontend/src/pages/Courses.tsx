// import { FormEvent, useEffect, useState } from "react";
// import { Course, courseService } from "../services/course";

// export function Courses() {
//   const [courses, setCourses] = useState<Course[]>([]);
//   const [nome, setNome] = useState("");
//   const [instituicao, setInstituicao] = useState("");

//   useEffect(() => {
//     courseService.list().then(setCourses).catch(console.error);
//   }, []);

//   async function handleCreate(e: FormEvent) {
//     e.preventDefault();
//     const course = await courseService.create({ nome, instituicao });
//     setCourses((prev) => [...prev, course]);
//     setNome("");
//     setInstituicao("");
//   }

//   return (
//     <div style={styles.container}>
//       <h2>Cursos</h2>

//       <form onSubmit={handleCreate} style={styles.form}>
//         <input
//           placeholder="Nome do curso"
//           value={nome}
//           onChange={(e) => setNome(e.target.value)}
//           required
//           style={styles.input}
//         />
//         <input
//           placeholder="Instituição"
//           value={instituicao}
//           onChange={(e) => setInstituicao(e.target.value)}
//           required
//           style={styles.input}
//         />
//         <button type="submit" style={styles.button}>
//           Cadastrar Curso
//         </button>
//       </form>

//       <ul style={styles.list}>
//         {courses.map((c) => (
//           <li key={c.id} style={styles.listItem}>
//             <strong>{c.nome}</strong> — {c.instituicao}
//           </li>
//         ))}
//       </ul>
//     </div>
//   );
// }

// const styles: Record<string, React.CSSProperties> = {
//   container: { maxWidth: 600, margin: "2rem auto", padding: "0 1rem" },
//   form: { display: "flex", gap: "0.5rem", marginBottom: "1.5rem" },
//   input: {
//     flex: 1,
//     padding: "0.5rem",
//     border: "1px solid #ccc",
//     borderRadius: 4,
//     fontSize: "1rem",
//   },
//   button: {
//     padding: "0.5rem 1rem",
//     background: "#1a73e8",
//     color: "#fff",
//     border: "none",
//     borderRadius: 4,
//     cursor: "pointer",
//     fontWeight: 600,
//   },
//   list: { listStyle: "none", padding: 0 },
//   listItem: { padding: "0.5rem 0", borderBottom: "1px solid #eee" },
// };


import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search, BookMarked, Info } from "lucide-react";

import { Course, courseService } from "../services/course";

export function Courses() {
  const navigate = useNavigate();
  const [courses, setCourses] = useState<Course[]>([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    courseService.list().then(setCourses).catch(console.error);
  }, []);

  const filteredCourses = courses.filter((course) =>
    course.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
    course.instituicao.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <h2 style={styles.title}>Cursos Disponíveis</h2>
        <p style={styles.subtitle}>
          Pesquise o seu curso para visualizar e planejar a grade curricular.
        </p>
      </header>

      {/*barra de pesquisa */}
      <div style={styles.searchSection}>
        <div style={styles.searchWrapper}>
          <Search style={styles.searchIcon} size={20} />
          <input
            type="text"
            placeholder="Buscar por nome do curso ou instituição..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={styles.searchInput}
          />
        </div>
      </div>

      {/*lista de cursos */}
      <div style={styles.courseList}>
        {filteredCourses.length > 0 ? (
          filteredCourses.map((course) => (
            <div
              key={course.id}
              style={styles.courseCard}
              onClick={() => navigate(`/flowchart/${course.id}`)}
            >
              <div style={styles.cardHeader}>
                <BookMarked size={24} color="#1a73e8" />
                <h3 style={styles.courseName}>{course.nome}</h3>
              </div>
              <span style={styles.courseInst}>{course.instituicao}</span>
            </div>
          ))
        ) : (
          <div style={styles.emptyState}>
            <Info size={32} color="#a0aec0" style={{ marginBottom: "1rem" }} />
            <p>Nenhum curso encontrado com "{searchTerm}".</p>
          </div>
        )}
      </div>

      {/* solicitação de cursos */}
      <div style={styles.requestSection}>
        <p style={styles.requestText}>Seu curso ainda não está na plataforma?</p>
        <button
          style={styles.requestButton}
          onClick={() => alert("A ser implementado")}
        >
          Solicitar Adição de Grade
        </button>
      </div>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  container: {
    maxWidth: "800px",
    margin: "2rem auto",
    padding: "0 1rem",
    fontFamily: "'Roboto Mono', monospace",
  },
  header: {
    marginBottom: "2rem",
  },
  title: {
    fontSize: "2rem",
    color: "#1a202c",
    marginBottom: "0.5rem",
    marginTop: 0,
  },
  subtitle: {
    fontSize: "1rem",
    color: "#718096",
    margin: 0,
  },
  searchSection: {
    marginBottom: "2.5rem",
  },
  searchWrapper: {
    position: "relative",
    display: "flex",
    alignItems: "center",
  },
  searchIcon: {
    position: "absolute",
    left: "1rem",
    color: "#a0aec0",
  },
  searchInput: {
    width: "100%",
    padding: "1rem 1rem 1rem 3rem",
    fontSize: "1rem",
    border: "1px solid #ccc",
    borderRadius: "8px",
    outline: "none",
    boxShadow: "0 2px 4px rgba(0,0,0,0.02)",
    fontFamily: "'Roboto Mono', monospace",
  },
  courseList: {
    display: "flex",
    flexDirection: "column",
    gap: "1rem",
    marginBottom: "3rem",
  },
  courseCard: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#ffffff",
    padding: "1.5rem",
    borderRadius: "8px",
    border: "1px solid #eee",
    cursor: "pointer",
    transition: "all 0.2s ease",
    boxShadow: "0 2px 4px rgba(0,0,0,0.02)",
  },
  cardHeader: {
    display: "flex",
    alignItems: "center",
    gap: "1rem",
  },
  courseName: {
    fontSize: "1.1rem",
    color: "#2d3748",
    margin: 0,
    fontWeight: 600,
  },
  courseInst: {
    backgroundColor: "#e8f0fe",
    color: "#1a73e8",
    padding: "0.25rem 0.75rem",
    borderRadius: "999px",
    fontSize: "0.85rem",
    fontWeight: 600,
  },
  emptyState: {
    textAlign: "center",
    padding: "3rem",
    color: "#718096",
  },
  requestSection: {
    textAlign: "center",
    padding: "2rem",
    backgroundColor: "#f8f9fa",
    borderRadius: "8px",
    border: "1px dashed #ccc",
  },
  requestText: {
    color: "#4a5568",
    marginBottom: "1rem",
    marginTop: 0,
  },
  requestButton: {
    backgroundColor: "transparent",
    color: "#1a73e8",
    border: "2px solid #1a73e8",
    padding: "0.5rem 1.5rem",
    borderRadius: "6px",
    fontWeight: 600,
    cursor: "pointer",
    fontFamily: "'Roboto Mono', monospace",
    transition: "all 0.2s",
  },
};
