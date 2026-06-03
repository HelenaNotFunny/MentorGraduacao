from datetime import datetime

from pydantic import BaseModel


class ReviewOut(BaseModel):
    id: int
    user_id: int
    subject_id: int
    nota: float
    resenha: str | None = None
    comprovante_url: str | None = None
    created_at: datetime
    autor_nome: str

    model_config = {"from_attributes": True}
