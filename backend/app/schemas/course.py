from pydantic import BaseModel


class CourseCreate(BaseModel):
    nome: str
    instituicao: str


class CourseOut(BaseModel):
    id: int
    nome: str
    instituicao: str

    model_config = {"from_attributes": True}
