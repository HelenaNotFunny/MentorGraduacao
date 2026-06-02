from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.course_subjects import CourseSubjects
from app.models.subject import Prerequisite, Subject
from app.schemas.subject import SubjectCreate, SubjectOut
from app.models.coursesubject import CourseSubject

router = APIRouter(prefix="/subjects", tags=["subjects"])


@router.get("/", response_model=list[SubjectOut])
def list_subjects(
    search: str | None = Query(None),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    query = (
        db.query(Subject)
        .join(CourseSubject)
        .filter(
            CourseSubject.course_id == current_user.curso_id
        )
    )

    if search:
        query = query.filter(
            or_(
                Subject.nome.ilike(f"%{search}%"),
                Subject.codigo.ilike(f"%{search}%")
            )
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
    nome=body.nome,
    codigo=body.codigo,
    ementa=body.ementa,
    bibliografia=body.bibliografia,
    resumo=body.resumo,
    periodo_recomendado=body.periodo_recomendado
    )

    db.add(subject)
    db.flush()
    for course_id in body.course_ids:
        db.add(
            CourseSubject(
                course_id=course_id,
                subject_id=subject.id
            )
        )
    db.commit()
    db.refresh(subject)
    return subject


@router.get("/{subject_id}/prerequisites", response_model=list[SubjectOut])
def list_subject_prerequisites(subject_id: int, db: Session = Depends(get_db)):
    subject_exists = db.query(Subject).filter(Subject.id == subject_id).first()
    if not subject_exists:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, 
            detail="Disciplina principal não encontrada"
        )

    prerequisites = (
        db.query(Subject)
        .join(Prerequisite, Subject.id == Prerequisite.prerequisite_subject_id)
        .filter(Prerequisite.subject_id == subject_id)
        .all()
    )
    
    return prerequisites
