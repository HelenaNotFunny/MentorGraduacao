from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.course import Course
from app.schemas.course import CourseCreate, CourseOut

router = APIRouter(prefix="/courses", tags=["courses"])


@router.get("/", response_model=list[CourseOut])
def list_courses(db: Session = Depends(get_db)):
    return db.query(Course).all()


@router.post("/", response_model=CourseOut, status_code=status.HTTP_201_CREATED)
def create_course(body: CourseCreate, db: Session = Depends(get_db)):
    course = Course(nome=body.nome, instituicao=body.instituicao)
    db.add(course)
    db.commit()
    db.refresh(course)
    return course
