from sqlalchemy import ForeignKey, UniqueConstraint
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database import Base


class CourseSubjects(Base):
    __tablename__ = "CourseSubjects"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    course_id: Mapped[int] = mapped_column(ForeignKey("Course.id"),nullable=False)
    subject_id: Mapped[int] = mapped_column(ForeignKey("Subject.id"), nullable=False)
    __table_args__ = (
        UniqueConstraint(
            "course_id",
            "subject_id",
            name="uq_course_subject"
        ),
    )

    course = relationship(
        "Course",
        back_populates="course_subjects"
    )

    subject = relationship(
        "Subject",
        back_populates="course_subjects"
    )