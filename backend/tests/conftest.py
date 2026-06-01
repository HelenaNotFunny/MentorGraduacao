import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.pool import StaticPool
from sqlalchemy.orm import sessionmaker

SQLALCHEMY_DATABASE_URL = "sqlite:///:memory:"
engine = create_engine(
    SQLALCHEMY_DATABASE_URL,
    connect_args={"check_same_thread": False},
    poolclass=StaticPool, 
)
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

from app.database import Base, get_db

from app.models.user import User  
from app.models.course import Course  
from app.models.course_subjects import CourseSubjects
from app.models.subject import Subject, Prerequisite
from app.models.review import Review  
from app.models.flowchart import FlowchartItem  

@pytest.fixture(name="session", scope="function")
def session_fixture():
    Base.metadata.create_all(bind=engine)
    
    db = TestingSessionLocal()
    try:
        yield db
    finally:
        db.close()
        Base.metadata.drop_all(bind=engine)

@pytest.fixture(name="client", scope="function")
def client_fixture(session):
    from app.main import app

    def override_get_db():
        try:
            yield session
        finally:
            pass

    app.dependency_overrides[get_db] = override_get_db
    
    with TestClient(app) as test_client:
        yield test_client
        
    app.dependency_overrides.clear()

@pytest.fixture
def auth_headers(session):
    from app.models.course import Course
    from app.services.auth import criar_token

    curso = Course(nome="Engenharia", instituicao="UFRN")
    session.add(curso)
    session.flush()

    user = User(nome="Fulano", email="fulano@email.com", senha_hash="123456", curso_id=curso.id)
    session.add(user)
    session.commit()
    
    token = criar_token(user.id)
    return {"Authorization": f"Bearer {token}", "user_id": user.id}
