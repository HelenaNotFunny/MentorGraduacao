from pydantic import BaseModel


class UserRegister(BaseModel):
    nome: str
    email: str
    senha: str
    curso_id: int


class UserLogin(BaseModel):
    email: str
    senha: str


class TokenOut(BaseModel):
    access_token: str
    token_type: str = "bearer"


class UserOut(BaseModel):
    id: int
    nome: str
    email: str
    curso_id: int

    model_config = {"from_attributes": True}
