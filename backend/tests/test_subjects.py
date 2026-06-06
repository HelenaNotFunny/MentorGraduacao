from fastapi import status
from app.models.subject import Subject, Prerequisite
from app.models.course import Course
from app.models.coursesubjects import CourseSubjects
from app.models.user import User
from app.services.auth import hash_senha


def test_listar_disciplinas_vazio(client, session):
    # cria curso
    curso = Course(
        nome="Engenharia",
        instituicao="UFRN"
    )
    session.add(curso)
    session.commit()

    # cria usuário
    user = User(
        nome="Teste",
        email="teste@test.com",
        senha_hash=hash_senha("123456"),
        curso_id=curso.id
    )
    session.add(user)
    session.commit()

    # login
    response = client.post(
        "/auth/login",
        json={
            "email": "teste@test.com",
            "senha": "123456"
        }
    )

    token = response.json()["access_token"]

    # consulta disciplinas
    response = client.get(
        "/subjects/",
        headers={
            "Authorization": f"Bearer {token}"
        }
    )

    assert response.status_code == status.HTTP_200_OK
    assert response.json() == []


def test_listar_disciplinas_com_filtros(client, session):

    # Cursos
    curso_1 = Course(nome="Engenharia da Computação", instituicao="UFRN")
    curso_2 = Course(nome="CeT", instituicao="UFRN")

    session.add_all([curso_1, curso_2])
    session.commit()

    # Usuário associado ao curso_1
    usuario = User(
        nome="Teste",
        email="teste@test.com",
        senha_hash=hash_senha("123456"),
        curso_id=curso_1.id,
    )

    session.add(usuario)
    session.commit()

    # Disciplinas
    sub_calculo = Subject(
        nome="Cálculo I",
        codigo="ECT123"
    )

    sub_algebra = Subject(
        nome="Álgebra Linear",
        codigo="ECT456"
    )

    sub_poo = Subject(
        nome="Programação Orientada a Objetos",
        codigo="DCA123"
    )

    session.add_all([
        sub_calculo,
        sub_algebra,
        sub_poo
    ])

    session.flush()

    # Relacionamentos curso-disciplina
    session.add_all([
        CourseSubjects(
            course_id=curso_2.id,
            subject_id=sub_calculo.id
        ),
        CourseSubjects(
            course_id=curso_1.id,
            subject_id=sub_algebra.id
        ),
        CourseSubjects(
            course_id=curso_1.id,
            subject_id=sub_poo.id
        ),
    ])

    session.commit()

    # Login
    login_response = client.post(
        "/auth/login",
        json={
            "email": "teste@test.com",
            "senha": "123456"
        }
    )

    token = login_response.json()["access_token"]

    headers = {
        "Authorization": f"Bearer {token}"
    }

    # Deve retornar apenas as disciplinas do curso do usuário
    response = client.get(
        "/subjects/",
        headers=headers
    )

    assert response.status_code == status.HTTP_200_OK
    dados = response.json()
    assert len(dados) == 2
    assert any(
        d["codigo"] == "ECT456"
        for d in dados
    )
    assert any(
        d["codigo"] == "DCA123"
        for d in dados
    )

    # Busca por nome
    response = client.get(
        "/subjects/",
        params={"search": "Álgebra"},
        headers=headers
    )

    assert response.status_code == status.HTTP_200_OK
    dados_busca_nome = response.json()
    assert len(dados_busca_nome) == 1
    assert (
        dados_busca_nome[0]["nome"]
        == "Álgebra Linear"
    )

    # Busca por código
    response = client.get(
        "/subjects/",
        params={"search": "DCA123"},
        headers=headers
    )

    assert response.status_code == status.HTTP_200_OK
    dados_busca_cod = response.json()
    assert len(dados_busca_cod) == 1
    assert (
        dados_busca_cod[0]["nome"]
        == "Programação Orientada a Objetos"
    )

    # Disciplina de outro curso não deve aparecer
    response = client.get(
        "/subjects/",
        params={"search": "Cálculo"},
        headers=headers
    )

    assert response.status_code == status.HTTP_200_OK
    assert len(response.json()) == 0


def test_listar_pre_requisitos_sucesso(client, session):
    curso = Course(nome="ceT", instituicao="UFRN")
    session.add(curso)
    session.commit()

    sub_calculo1 = Subject(nome="Cálculo I", codigo="ECT123")
    sub_calculo2 = Subject(nome="Cálculo II", codigo="ECT456")
    session.add_all([sub_calculo1, sub_calculo2])
    session.commit()

    vinculo = Prerequisite(
        subject_id=sub_calculo2.id, 
        prerequisite_subject_id=sub_calculo1.id
    )
    session.add(vinculo)
    session.commit()

    response = client.get(f"/subjects/{sub_calculo2.id}/prerequisites")
    
    assert response.status_code == status.HTTP_200_OK
    dados = response.json()
    assert len(dados) == 1
    assert dados[0]["id"] == sub_calculo1.id
    assert dados[0]["nome"] == "Cálculo I"
    assert dados[0]["codigo"] == "ECT123"

def test_listar_pre_requisitos_404(client):
    response = client.get("/subjects/9999/prerequisites")
    assert response.status_code == status.HTTP_404_NOT_FOUND
    assert response.json()["detail"] == "Disciplina principal não encontrada"
