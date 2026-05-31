from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.subject import Prerequisite, Subject
from app.schemas.subject import SubjectCreate, SubjectOut

router = APIRouter(prefix="/subjects", tags=["subjects"])


@router.get("/", response_model=list[SubjectOut])
def list_subjects(
    course_id: int | None = Query(None),
    search: str | None = Query(None),
    db: Session = Depends(get_db),
):
    query = db.query(Subject)
    if course_id:
        query = query.filter(Subject.course_id == course_id)
    if search:
        query = query.filter(
            Subject.nome.ilike(f"%{search}%") | Subject.codigo.ilike(f"%{search}%")
        )
    return query.all()


@router.get("/{subject_id}", response_model=SubjectOut)
def get_subject(subject_id: int, db: Session = Depends(get_db)):
    subject = db.query(Subject).filter(Subject.id == subject_id).first()
    if not subject:
        raise HTTPException(status_code=404, detail="Disciplina não encontrada")
    return subject


@router.post("/", response_model=SubjectOut, status_code=status.HTTP_201_CREATED)
def create_subject(body: SubjectCreate, db: Session = Depends(get_db)):
    subject = Subject(
        course_id=body.course_id,
        nome=body.nome,
        codigo=body.codigo,
        ementa=body.ementa,
        bibliografia=body.bibliografia,
        resumo=body.resumo,
        periodo_recomendado=body.periodo_recomendado,
    )
    db.add(subject)
    db.commit()
    db.refresh(subject)
    return subject
