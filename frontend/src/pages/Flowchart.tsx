import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FlowchartItem, flowchartService } from "../services/flowchart";
import { Subject } from "../services/subject";
import { auth } from "../services/auth";

export function Flowchart() {
  const navigate = useNavigate();
  const [items, setItems] = useState<FlowchartItem[]>([]);
  const [suggestions, setSuggestions] = useState<Subject[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedSemester, setSelectedSemester] = useState(1);
  const [loading, setLoading] = useState(true);

  const load = useCallback(() => {
    setLoading(true);
    flowchartService
      .list()
      .then(setItems)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const loadSuggestions = useCallback(() => {
    flowchartService.suggestions().then(setSuggestions).catch(console.error);
  }, []);

  useEffect(() => {
    if (!auth.isAuthenticated()) {
      navigate("/login");
      return;
    }
    load();
    loadSuggestions();
  }, [load, loadSuggestions, navigate]);

  const maxSemester = Math.max(10, ...items.map((i) => i.semester_index));

  async function handleAdd(subjectId: number) {
    try {
      await flowchartService.add({ subject_id: subjectId, semester_index: selectedSemester });
      setShowModal(false);
      load();
      loadSuggestions();
    } catch (err) {
      alert(err instanceof Error ? err.message : "Erro");
    }
  }

  async function handleToggleStatus(item: FlowchartItem) {
    const newStatus = item.status === "completed" ? "planned" : "completed";
    await flowchartService.update(item.id, { status: newStatus });
    load();
    loadSuggestions();
  }

  async function handleRemove(itemId: number) {
    await flowchartService.remove(itemId);
    load();
    loadSuggestions();
  }

  async function handleMoveSubject(item: FlowchartItem, direction: -1 | 1) {
    const newIndex = item.semester_index + direction;
    if (newIndex < 1) return;
    await flowchartService.update(item.id, { semester_index: newIndex });
    load();
  }

  const itemsBySemester: Record<number, FlowchartItem[]> = {};
  for (const item of items) {
    if (!itemsBySemester[item.semester_index]) itemsBySemester[item.semester_index] = [];
    itemsBySemester[item.semester_index].push(item);
  }

  if (loading) return <p style={styles.loading}>Carregando...</p>;

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h2>Meu Fluxograma</h2>
        <button
          style={styles.button}
          onClick={() => setShowModal(true)}
        >
          Sugestões ({suggestions.length})
        </button>
      </div>

      <div style={styles.grid}>
        {Array.from({ length: maxSemester }, (_, i) => i + 1).map((sem) => (
          <div key={sem} style={styles.semester}>
            <h3 style={styles.semesterTitle}>{sem}º Período</h3>
            <div style={styles.cards}>
              {(itemsBySemester[sem] ?? []).map((item) => (
                <div
                  key={item.id}
                  style={{
                    ...styles.card,
                    opacity: item.status === "completed" ? 0.6 : 1,
                    borderLeft: `4px solid ${item.status === "completed" ? "#4caf50" : "#1a73e8"}`,
                  }}
                >
                  <div style={styles.cardHeader}>
                    <strong>{item.subject_codigo}</strong>
                    <button
                      style={styles.smallBtn}
                      onClick={() => handleRemove(item.id)}
                      title="Remover"
                    >
                      ✕
                    </button>
                  </div>
                  <p style={styles.cardName}>{item.subject_nome}</p>
                  <div style={styles.cardActions}>
                    <label style={styles.checkboxLabel}>
                      <input
                        type="checkbox"
                        checked={item.status === "completed"}
                        onChange={() => handleToggleStatus(item)}
                      />{" "}
                      Cursada
                    </label>
                    <div>
                      <button
                        style={styles.arrowBtn}
                        disabled={item.semester_index <= 1}
                        onClick={() => handleMoveSubject(item, -1)}
                      >
                        ◀
                      </button>
                      <button
                        style={styles.arrowBtn}
                        onClick={() => handleMoveSubject(item, 1)}
                      >
                        ▶
                      </button>
                    </div>
                  </div>
                </div>
              ))}
              <button
                style={styles.addBtn}
                onClick={() => {
                  setSelectedSemester(sem);
                  setShowModal(true);
                }}
              >
                + Adicionar
              </button>
            </div>
          </div>
        ))}
      </div>

      {showModal && (
        <div style={styles.overlay} onClick={() => setShowModal(false)}>
          <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
            <h3>Disciplinas Disponíveis</h3>
            <p style={{ fontSize: "0.875rem", color: "#666" }}>
              Adicionando ao <strong>{selectedSemester}º período</strong>
            </p>
            {suggestions.length === 0 ? (
              <p>Nenhuma disciplina disponível no momento.</p>
            ) : (
              <ul style={styles.suggestionList}>
                {suggestions.map((s) => (
                  <li key={s.id} style={styles.suggestionItem}>
                    <div>
                      <strong>{s.codigo}</strong> — {s.nome}
                      {s.periodo_recomendado && (
                        <span style={{ color: "#888", fontSize: "0.8rem" }}>
                          {" "}
                          (período recomendado: {s.periodo_recomendado}º)
                        </span>
                      )}
                    </div>
                    <button style={styles.addSmBtn} onClick={() => handleAdd(s.id)}>
                      Adicionar
                    </button>
                  </li>
                ))}
              </ul>
            )}
            <button style={styles.closeBtn} onClick={() => setShowModal(false)}>
              Fechar
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  container: { maxWidth: 1200, margin: "2rem auto", padding: "0 1rem" },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "1.5rem",
  },
  loading: { textAlign: "center", marginTop: "2rem" },
  grid: { display: "flex", gap: "1rem", overflowX: "auto", paddingBottom: "1rem" },
  semester: {
    minWidth: 220,
    flexShrink: 0,
    background: "#f5f5f5",
    borderRadius: 8,
    padding: "0.75rem",
  },
  semesterTitle: { margin: "0 0 0.75rem", fontSize: "1rem", textAlign: "center" },
  cards: { display: "flex", flexDirection: "column", gap: "0.5rem" },
  card: {
    background: "#fff",
    borderRadius: 6,
    padding: "0.5rem",
    boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
    transition: "opacity 0.2s",
  },
  cardHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    fontSize: "0.8rem",
  },
  cardName: { margin: "0.25rem 0", fontSize: "0.9rem" },
  cardActions: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    fontSize: "0.8rem",
  },
  checkboxLabel: { display: "flex", alignItems: "center", gap: "0.25rem", cursor: "pointer" },
  arrowBtn: {
    background: "none",
    border: "1px solid #ccc",
    borderRadius: 3,
    cursor: "pointer",
    padding: "0.1rem 0.35rem",
    fontSize: "0.7rem",
    marginLeft: "0.2rem",
  },
  smallBtn: {
    background: "none",
    border: "none",
    cursor: "pointer",
    color: "#d32f2f",
    fontWeight: "bold",
    fontSize: "0.9rem",
  },
  addBtn: {
    padding: "0.4rem",
    background: "#e3f2fd",
    border: "1px dashed #1a73e8",
    borderRadius: 4,
    cursor: "pointer",
    color: "#1a73e8",
    fontSize: "0.85rem",
    fontWeight: 600,
  },
  overlay: {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: "rgba(0,0,0,0.4)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1000,
  },
  modal: {
    background: "#fff",
    borderRadius: 8,
    padding: "1.5rem",
    maxWidth: 500,
    width: "90%",
    maxHeight: "80vh",
    overflowY: "auto",
  },
  suggestionList: { listStyle: "none", padding: 0 },
  suggestionItem: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "0.5rem 0",
    borderBottom: "1px solid #eee",
    fontSize: "0.9rem",
  },
  addSmBtn: {
    padding: "0.3rem 0.6rem",
    background: "#1a73e8",
    color: "#fff",
    border: "none",
    borderRadius: 4,
    cursor: "pointer",
    fontSize: "0.8rem",
    whiteSpace: "nowrap",
  },
  closeBtn: {
    marginTop: "1rem",
    padding: "0.4rem 1rem",
    background: "#eee",
    border: "none",
    borderRadius: 4,
    cursor: "pointer",
    width: "100%",
  },
};
