from fastapi import status
from app.models.course import Course

def test_listar_cursos_vazio(client):
    response = client.get("/courses/")
    
    assert response.status_code == status.HTTP_200_OK
    assert response.json() == [] 

def test_listar_cursos_com_dados(client, session):
    """Garante que os cursos cadastrados no banco são retornados corretamente."""
    curso_1 = Course(nome="Engenharia da computação",instituicao='UFRN')
    curso_2 = Course(nome="CeT", instituicao='UFRN')
    
    session.add_all([curso_1, curso_2])
    session.commit()

    response = client.get("/courses/")
    
    assert response.status_code == status.HTTP_200_OK
    
    dados = response.json()
    assert len(dados) == 2  
    # Valida se os dados retornados batem com o que foi inserido
    assert dados[0]["nome"] == "Engenharia da computação"
    assert dados[1]["nome"] == "CeT"