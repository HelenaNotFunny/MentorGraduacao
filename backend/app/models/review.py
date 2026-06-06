from datetime import datetime

from sqlalchemy import DateTime, ForeignKey, Numeric, String, Text, text
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database import Base


class Review(Base):
    __tablename__ = "Review"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    user_id: Mapped[int] = mapped_column(ForeignKey("User.id"), nullable=False)
    subject_id: Mapped[int] = mapped_column(ForeignKey("Subject.id"), nullable=False)
    nota: Mapped[float] = mapped_column(Numeric(3, 1), nullable=False)
    resenha: Mapped[str] = mapped_column(Text, nullable=True)
    comprovante_url: Mapped[str] = mapped_column(String(500), nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime, nullable=False, server_default=text("CURRENT_TIMESTAMP"))

    user = relationship("User")
    subject = relationship("Subject")
