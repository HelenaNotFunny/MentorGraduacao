"""Popula o banco com dados iniciais de exemplo."""

import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent.parent))

from app.database import SessionLocal
from app.models.course import Course
from app.models.course_subjects import CourseSubjects
from app.models.subject import Subject, Prerequisite
from app.models.user import User
from app.services.auth import hash_senha


def seed():
    db = SessionLocal()

    # =====================
    # CURSOS
    # =====================

    curso_cc = db.query(Course).filter(
        Course.nome == "Ciência da Computação"
    ).first()

    if not curso_cc:
        curso_cc = Course(
            nome="Ciência da Computação",
            instituicao="UFRN"
        )
        db.add(curso_cc)
        db.commit()
        db.refresh(curso_cc)

        print(
            f"Curso criado: "
            f"{curso_cc.nome} (id={curso_cc.id})"
        )

    curso_ec = db.query(Course).filter(
        Course.nome == "Engenharia da Computação"
    ).first()

    if not curso_ec:
        curso_ec = Course(
            nome="Engenharia da Computação",
            instituicao="UFRN"
        )
        db.add(curso_ec)
        db.commit()
        db.refresh(curso_ec)

        print(
            f"Curso criado: "
            f"{curso_ec.nome} (id={curso_ec.id})"
        )

    # =====================
    # USUÁRIO ADMIN
    # =====================

    admin = db.query(User).filter(
        User.email == "admin@test.com"
    ).first()

    if not admin:
        admin = User(
            nome="Admin",
            email="admin@test.com",
            senha_hash=hash_senha("123456"),
            curso_id=curso_cc.id,
        )
        db.add(admin)
        db.commit()

        print(
            "Usuário admin criado "
            "(admin@test.com / 123456)"
        )

    # =====================
    # EVITA DUPLICAÇÃO
    # =====================

    if db.query(Subject).count() > 0:
        print("Disciplinas já existem, pulando.")
        db.close()
        return

    # =====================
    # DISCIPLINAS DE CC
    # =====================

    disciplinas_data = [
        {"nome": "Introdução à Computação", "codigo": "IMD0001", "periodo": 1},
        {"nome": "Programação I", "codigo": "IMD0002", "periodo": 1},
        {"nome": "Matemática Discreta", "codigo": "IMD0003", "periodo": 1},
        {"nome": "Cálculo I", "codigo": "IMD0004", "periodo": 1},
        {"nome": "Álgebra Linear", "codigo": "IMD0005", "periodo": 1},
        {"nome": "Programação II", "codigo": "IMD0006", "periodo": 2},
        {"nome": "Estruturas de Dados", "codigo": "IMD0007", "periodo": 2},
        {"nome": "Cálculo II", "codigo": "IMD0008", "periodo": 2},
        {"nome": "Lógica para Computação", "codigo": "IMD0009", "periodo": 2},
        {"nome": "Banco de Dados", "codigo": "IMD0010", "periodo": 3},
        {"nome": "Engenharia de Software", "codigo": "IMD0011", "periodo": 3},
        {"nome": "Redes de Computadores", "codigo": "IMD0012", "periodo": 4},
        {"nome": "Inteligência Artificial", "codigo": "IMD0013", "periodo": 4},
    ]

    # =====================
    # DISCIPLINAS DE EC
    # =====================

    disciplinas_ec = [
        {"nome": "Circuitos Elétricos", "codigo": "EC0001", "periodo": 3},
        {"nome": "Eletrônica Digital", "codigo": "EC0002", "periodo": 4},
        {"nome": "Arquitetura de Computadores", "codigo": "EC0003", "periodo": 5},
        {"nome": "Sistemas Embarcados", "codigo": "EC0004", "periodo": 6},
    ]

    disciplinas = {}

    # =====================
    # CRIA TODAS AS DISCIPLINAS
    # =====================

    for d in disciplinas_data + disciplinas_ec:

        subject = Subject(
            nome=d["nome"],
            codigo=d["codigo"],
            periodo_recomendado=d["periodo"],
            ementa=f"Ementa da disciplina {d['nome']}.",
            bibliografia=f"Bibliografia básica da disciplina {d['nome']}.",
            resumo=f"Resumo dos principais tópicos de {d['nome']}.",
        )

        db.add(subject)
        db.flush()

        disciplinas[d["codigo"]] = subject

        print(
            f"Disciplina criada: "
            f"{subject.codigo} - {subject.nome}"
        )

    # =====================
    # RELAÇÃO CC -> DISCIPLINAS
    # =====================

    for subject in disciplinas.values():
        if subject.codigo.startswith("IMD"):
            db.add(
                CourseSubjects(
                    course_id=curso_cc.id,
                    subject_id=subject.id,
                )
            )

    # =====================
    # RELAÇÃO EC -> DISCIPLINAS
    # =====================

    compartilhadas_ec = [
        "IMD0001",
        "IMD0002",
        "IMD0004",
        "IMD0005",
        "IMD0006",
        "IMD0007",
        "IMD0008",
    ]

    for codigo in compartilhadas_ec:
        db.add(
            CourseSubjects(
                course_id=curso_ec.id,
                subject_id=disciplinas[codigo].id,
            )
        )

    for codigo in [
        "EC0001",
        "EC0002",
        "EC0003",
        "EC0004",
    ]:
        db.add(
            CourseSubjects(
                course_id=curso_ec.id,
                subject_id=disciplinas[codigo].id,
            )
        )

    # =====================
    # PRÉ-REQUISITOS CC
    # =====================

    prerequisitos_cc = [
        ("IMD0006", "IMD0002"),
        ("IMD0007", "IMD0006"),
        ("IMD0008", "IMD0004"),
        ("IMD0010", "IMD0007"),
        ("IMD0011", "IMD0006"),
        ("IMD0012", "IMD0007"),
        ("IMD0013", "IMD0007"),
        ("IMD0013", "IMD0009"),
    ]

    for cod, prereq_cod in prerequisitos_cc:
        db.add(
            Prerequisite(
                subject_id=disciplinas[cod].id,
                prerequisite_subject_id=disciplinas[prereq_cod].id,
            )
        )

    # =====================
    # PRÉ-REQUISITOS EC
    # =====================

    prerequisitos_ec = [
        ("EC0002", "EC0001"),
        ("EC0003", "EC0002"),
        ("EC0003", "IMD0007"),
        ("EC0004", "EC0003"),
    ]

    for cod, prereq_cod in prerequisitos_ec:
        db.add(
            Prerequisite(
                subject_id=disciplinas[cod].id,
                prerequisite_subject_id=disciplinas[prereq_cod].id,
            )
        )

    db.commit()

    print(
        f"{len(disciplinas_data) + len(disciplinas_ec)} disciplinas "
        f"e {len(prerequisitos_cc) + len(prerequisitos_ec)} "
        f"pré-requisitos criados."
    )

    db.close()


if __name__ == "__main__":
    seed()