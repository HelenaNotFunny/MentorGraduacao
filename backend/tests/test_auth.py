from fastapi import status
from app.models.user import User
from app.services.auth import hash_senha, criar_token

def test_register_sucesso(client):
    payload = {
        "nome": "admin",
        "email": "admin@email.com",
        "senha": "senhaadmin123",
        "curso_id": 1
    }
    response = client.post("/auth/register", json=payload)
    
    assert response.status_code == status.HTTP_201_CREATED
    data = response.json()
    assert data["email"] == "admin@email.com"
    assert "id" in data
    assert "senha" not in data 

def test_register_email_duplicado(client, session):
    usuario_existente = User(nome="ciclano", email="silva@email.com", senha_hash="...", curso_id=1)
    session.add(usuario_existente)
    session.commit()

    payload = {
        "nome": "Fulano",
        "email": "silva@email.com",
        "senha": "senhaforte123",
        "curso_id": 1
    }
    response = client.post("/auth/register", json=payload)
    
    assert response.status_code == status.HTTP_409_CONFLICT
    assert response.json()["detail"] == "Email já cadastrado"


def test_login_sucesso(client, session):
    senha_sem_hash = "123456"
    user = User(nome="Fulano", email="fulano@email.com", senha_hash=hash_senha(senha_sem_hash), curso_id=1)
    session.add(user)
    session.commit()

    payload = {"email": "fulano@email.com", "senha": senha_sem_hash}
    response = client.post("/auth/login", json=payload)

    assert response.status_code == status.HTTP_200_OK
    assert "access_token" in response.json()

def test_login_credenciais_invalidas(client, session):
    payload = {"email": "user_sem_cadastro@email.com", "senha": "123456"}
    response = client.post("/auth/login", json=payload)

    assert response.status_code == status.HTTP_401_UNAUTHORIZED
    assert response.json()["detail"] == "Credenciais inválidas"