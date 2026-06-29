from pydantic import BaseModel,computed_field


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

    @computed_field
    @property
    def is_admin(self) -> bool:
        return self.email == "admin@test.com"
