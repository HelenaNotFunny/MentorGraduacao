from sqlalchemy import String
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.database import Base


class Course(Base):
    __tablename__ = "Course"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    nome: Mapped[str] = mapped_column(String(200), nullable=False)
    instituicao: Mapped[str] = mapped_column(String(200), nullable=False)

    users = relationship("User", back_populates="curso")
    course_subjects = relationship("CourseSubjects", back_populates="course", cascade="all, delete-orphan")
