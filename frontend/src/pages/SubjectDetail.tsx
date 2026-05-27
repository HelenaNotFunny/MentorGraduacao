import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Subject, subjectService } from "../services/subject";

export function SubjectDetail() {
  const { id } = useParams();
  const [subject, setSubject] = useState<Subject | null>(null);
  const [prereqNames, setPrereqNames] = useState<string[]>([]);

  useEffect(() => {
    if (!id) return;
    subjectService.getById(Number(id)).then(async (s) => {
      setSubject(s);
      if (s.prerequisitos.length > 0) {
        const names = await Promise.all(
          s.prerequisitos.map((p) =>
            subjectService.getById(p.prerequisite_subject_id).then((ps) => ps.nome)
          )
        );
        setPrereqNames(names);
      }
    });
  }, [id]);

  if (!subject) return <p>Carregando...</p>;

  return (
    <div style={styles.container}>
      <h2>
        {subject.codigo} — {subject.nome}
      </h2>
      <p>
        <strong>Período recomendado:</strong>{" "}
        {subject.periodo_recomendado ?? "Não informado"}
      </p>

      {prereqNames.length > 0 && (
        <div>
          <strong>Pré-requisitos:</strong>
          <ul>
            {prereqNames.map((n, i) => (
              <li key={i}>{n}</li>
            ))}
          </ul>
        </div>
      )}

      {subject.ementa && (
        <div style={styles.section}>
          <strong>Ementa</strong>
          <p>{subject.ementa}</p>
        </div>
      )}

      {subject.bibliografia && (
        <div style={styles.section}>
          <strong>Bibliografia</strong>
          <p>{subject.bibliografia}</p>
        </div>
      )}

      {subject.resumo && (
        <div style={styles.section}>
          <strong>Resumo</strong>
          <p>{subject.resumo}</p>
        </div>
      )}
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  container: { maxWidth: 700, margin: "2rem auto", padding: "0 1rem" },
  section: { marginTop: "1rem" },
};
