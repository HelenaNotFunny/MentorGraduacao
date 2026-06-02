from fastapi import status
from app.models.subject import Subject, Prerequisite
from app.models.course import Course
from app.models.course_subjects import CourseSubjects


def test_listar_disciplinas_vazio(client):
    response = client.get("/subjects/")
    assert response.status_code == status.HTTP_200_OK
    assert response.json() == []

def test_listar_disciplinas_com_filtros(client, session):
    curso_1 = Course(nome="Engenharia da computação", instituicao='UFRN')
    curso_2 = Course(nome="CeT", instituicao='UFRN')
    session.add_all([curso_1, curso_2])
    session.commit() 

    sub_calculo = Subject(nome="Cálculo I", codigo="ECT123")
    sub_algebr = Subject(nome="Álgebra Linear", codigo="ECT456")
    sub_poo = Subject(nome="Programação Orientada a Objetos", codigo="DCA123")
    session.add_all([sub_calculo, sub_algebr, sub_poo])
    session.flush()

    session.add_all([
        CourseSubjects(course_id=curso_2.id, subject_id=sub_calculo.id),
        CourseSubjects(course_id=curso_1.id, subject_id=sub_algebr.id),
        CourseSubjects(course_id=curso_1.id, subject_id=sub_poo.id),
    ])
    session.commit()

    response = client.get("/subjects/")
    assert response.status_code == status.HTTP_200_OK
    assert len(response.json()) == 3

    response = client.get("/subjects/", params={"course_id": curso_1.id})
    assert response.status_code == status.HTTP_200_OK
    dados_curso = response.json()
    assert len(dados_curso) == 2
    assert any(d["codigo"] == "ECT456" for d in dados_curso)
    assert any(d["codigo"] == "DCA123" for d in dados_curso)

    response = client.get("/subjects/", params={"search": "Cálculo"})
    assert response.status_code == status.HTTP_200_OK
    dados_busca_nome = response.json()
    assert len(dados_busca_nome) == 1
    assert dados_busca_nome[0]["nome"] == "Cálculo I"

    response = client.get("/subjects/", params={"search": "DCA123"})
    assert response.status_code == status.HTTP_200_OK
    dados_busca_cod = response.json()
    assert len(dados_busca_cod) == 1
    assert dados_busca_cod[0]["nome"] == "Programação Orientada a Objetos"


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
