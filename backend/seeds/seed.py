"""Popula o banco com dados iniciais de exemplo."""

import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent.parent))

from app.database import SessionLocal
from app.models.course import Course
from app.models.subject import Prerequisite, Subject
from app.models.user import User
from app.services.auth import hash_senha


def seed():
    db = SessionLocal()

    # Curso
    curso = db.query(Course).first()
    if not curso:
        curso = Course(nome="Ciência da Computação", instituicao="UFRN")
        db.add(curso)
        db.commit()
        db.refresh(curso)
        print(f"Curso criado: {curso.nome} (id={curso.id})")
    else:
        print(f"Curso já existe: {curso.nome} (id={curso.id})")

    # Usuário admin
    if db.query(User).count() == 0:
        admin = User(
            nome="Admin",
            email="admin@test.com",
            senha_hash=hash_senha("123456"),
            curso_id=curso.id,
        )
        db.add(admin)
        db.commit()
        print("Usuário admin criado (admin@test.com / 123456)")
    else:
        print("Usuários já existem, pulando.")

    # Disciplinas
    if db.query(Subject).count() > 0:
        print("Disciplinas já existem, pulando.")
        db.close()
        return

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

    disciplinas = {}
    for d in disciplinas_data:
        subject = Subject(
            course_id=curso.id,
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
        print(f"  Disciplina: {subject.codigo} - {subject.nome}")

    # Pré-requisitos
    prerequisitos = [
        ("IMD0006", "IMD0002"),  # Prog II precisa de Prog I
        ("IMD0007", "IMD0006"),  # Estrutura de Dados precisa de Prog II
        ("IMD0008", "IMD0004"),  # Cálculo II precisa de Cálculo I
        ("IMD0010", "IMD0007"),  # BD precisa de Estrutura de Dados
        ("IMD0011", "IMD0006"),  # ES precisa de Prog II
        ("IMD0012", "IMD0007"),  # Redes precisa de Estrutura de Dados
        ("IMD0013", "IMD0007"),  # IA precisa de Estrutura de Dados
        ("IMD0013", "IMD0009"),  # IA precisa de Lógica
    ]

    for cod, prereq_cod in prerequisitos:
        pre = Prerequisite(
            subject_id=disciplinas[cod].id,
            prerequisite_subject_id=disciplinas[prereq_cod].id,
        )
        db.add(pre)

    db.commit()
    print(f"{len(disciplinas_data)} disciplinas e {len(prerequisitos)} pré-requisitos criados.")
    db.close()


if __name__ == "__main__":
    seed()
