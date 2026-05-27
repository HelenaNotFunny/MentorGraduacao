from pydantic import BaseModel


class PrerequisiteOut(BaseModel):
    id: int
    prerequisite_subject_id: int

    model_config = {"from_attributes": True}


class SubjectCreate(BaseModel):
    course_id: int
    nome: str
    codigo: str
    ementa: str | None = None
    bibliografia: str | None = None
    resumo: str | None = None
    periodo_recomendado: int | None = None


class SubjectOut(BaseModel):
    id: int
    course_id: int
    nome: str
    codigo: str
    ementa: str | None = None
    bibliografia: str | None = None
    resumo: str | None = None
    periodo_recomendado: int | None = None
    prerequisitos: list[PrerequisiteOut] = []

    model_config = {"from_attributes": True}
