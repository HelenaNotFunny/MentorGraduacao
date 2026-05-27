from pydantic import BaseModel


class FlowchartItemCreate(BaseModel):
    subject_id: int
    semester_index: int


class FlowchartItemUpdate(BaseModel):
    semester_index: int | None = None
    status: str | None = None


class FlowchartItemOut(BaseModel):
    id: int
    subject_id: int
    subject_nome: str
    subject_codigo: str
    semester_index: int
    status: str

    model_config = {"from_attributes": True}
