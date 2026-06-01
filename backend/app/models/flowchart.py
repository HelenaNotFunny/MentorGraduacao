from sqlalchemy import Enum, ForeignKey, Integer, UniqueConstraint
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database import Base


class FlowchartItem(Base):
    __tablename__ = "FlowchartItem"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    user_id: Mapped[int] = mapped_column(ForeignKey("User.id"), nullable=False)
    subject_id: Mapped[int] = mapped_column(ForeignKey("Subject.id"), nullable=False)
    semester_index: Mapped[int] = mapped_column(Integer, nullable=False)
    status: Mapped[str] = mapped_column(Enum("planned", "completed"), default="planned", nullable=False)

    __table_args__ = (
        UniqueConstraint("user_id", "subject_id", name="uq_user_subject"),
    )

    user = relationship("User")
    subject = relationship("Subject")
