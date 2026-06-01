from sqlalchemy import ForeignKey, Integer, String, Text, UniqueConstraint
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database import Base


class Subject(Base):
    __tablename__ = "Subject"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    nome: Mapped[str] = mapped_column(String(200), nullable=False)
    codigo: Mapped[str] = mapped_column(String(50), nullable=False)
    ementa: Mapped[str] = mapped_column(Text, nullable=True)
    bibliografia: Mapped[str] = mapped_column(Text, nullable=True)
    resumo: Mapped[str] = mapped_column(Text, nullable=True)
    periodo_recomendado: Mapped[int] = mapped_column(Integer, nullable=True)

    course_subjects = relationship("CourseSubjects", back_populates="subject", cascade="all, delete-orphan")
    prerequisitos = relationship(
        "Prerequisite",
        foreign_keys="Prerequisite.subject_id",
        back_populates="subject",
        cascade="all, delete-orphan",
    )


class Prerequisite(Base):
    __tablename__ = "Prerequisite"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    subject_id: Mapped[int] = mapped_column(ForeignKey("Subject.id"), nullable=False)
    prerequisite_subject_id: Mapped[int] = mapped_column(ForeignKey("Subject.id"), nullable=False)

    __table_args__ = (
        UniqueConstraint("subject_id", "prerequisite_subject_id", name="uq_prerequisite"),
    )

    subject = relationship("Subject", foreign_keys=[subject_id], back_populates="prerequisitos")
    prerequisite_subject = relationship("Subject", foreign_keys=[prerequisite_subject_id])
