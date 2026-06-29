from pydantic import BaseModel


class PrerequisiteOut(BaseModel):
    id: int
    prerequisite_subject_id: int

    model_config = {"from_attributes": True}


class SubjectCreate(BaseModel):
    nome: str
    codigo: str
    ementa: str | None = None
    bibliografia: str | None = None
    resumo: str | None = None
    periodo_recomendado: int | None = None

    course_ids: list[int]
    prerequisite_ids: list[int] = []

class CourseRef(BaseModel):
    id: int
    nome: str

    model_config = {"from_attributes": True}

class SubjectOut(BaseModel):
    id: int
    nome: str
    codigo: str
    ementa: str | None = None
    bibliografia: str | None = None
    resumo: str | None = None
    periodo_recomendado: int | None = None

    prerequisitos: list[PrerequisiteOut] = []

    courses: list[CourseRef] = []

    model_config = {"from_attributes": True}
