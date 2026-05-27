from sqlalchemy import ForeignKey, Integer, String, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database import Base


class Subject(Base):
    __tablename__ = "subjects"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    course_id: Mapped[int] = mapped_column(ForeignKey("courses.id"), nullable=False)
    nome: Mapped[str] = mapped_column(String(200), nullable=False)
    codigo: Mapped[str] = mapped_column(String(20), nullable=False)
    ementa: Mapped[str] = mapped_column(Text, nullable=True)
    bibliografia: Mapped[str] = mapped_column(Text, nullable=True)
    resumo: Mapped[str] = mapped_column(Text, nullable=True)
    periodo_recomendado: Mapped[int] = mapped_column(Integer, nullable=True)

    course = relationship("Course", back_populates="subjects")
    prerequisitos = relationship(
        "Prerequisite",
        foreign_keys="Prerequisite.subject_id",
        back_populates="subject",
        cascade="all, delete-orphan",
    )


class Prerequisite(Base):
    __tablename__ = "prerequisites"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    subject_id: Mapped[int] = mapped_column(ForeignKey("subjects.id"), nullable=False)
    prerequisite_subject_id: Mapped[int] = mapped_column(ForeignKey("subjects.id"), nullable=False)

    subject = relationship("Subject", foreign_keys=[subject_id], back_populates="prerequisitos")
    prerequisite_subject = relationship("Subject", foreign_keys=[prerequisite_subject_id])
