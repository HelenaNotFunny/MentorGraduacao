from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.subject import Prerequisite, Subject
from app.schemas.subject import SubjectCreate, SubjectOut
from app.models.coursesubjects import CourseSubjects

from app.models.user import User
from app.services.auth import get_current_user
from app.services.auth import get_admin_user

router = APIRouter(prefix="/subjects", tags=["subjects"])


@router.get("/", response_model=list[SubjectOut])
def list_subjects(
    search: str | None = Query(None),
    course_id: int | None = Query(None),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    query = db.query(Subject)

    try:
        get_admin_user(current_user=current_user)
        if course_id:
            query = (
                query.join(CourseSubjects, Subject.id == CourseSubjects.subject_id)
                .filter(CourseSubjects.course_id == course_id)
            )
    except HTTPException:

        query = (
            db.query(Subject)
            .join(
                CourseSubjects,
                Subject.id == CourseSubjects.subject_id
            )
            .filter(
                CourseSubjects.course_id == current_user.curso_id
            )
        )

    if search:
        query = query.filter(
            Subject.nome.ilike(f"%{search}%")
            | Subject.codigo.ilike(f"%{search}%")
        )

    return query.all()

@router.get("/{subject_id}", response_model=SubjectOut)
def get_subject(subject_id: int, db: Session = Depends(get_db)):
    subject = db.query(Subject).filter(Subject.id == subject_id).first()
    if not subject:
        raise HTTPException(status_code=404, detail="Disciplina não encontrada")
    return subject


@router.post("/", response_model=SubjectOut, status_code=status.HTTP_201_CREATED)
def create_subject(
    body: SubjectCreate, 
    db: Session = Depends(get_db), 
    current_user: User = Depends(get_admin_user)
):
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
            CourseSubjects(
                course_id=course_id,
                subject_id=subject.id
            )
        )

    if body.prerequisite_ids:
        for prereq_id in body.prerequisite_ids:
            db.add(
                Prerequisite(
                    subject_id=subject.id,
                    prerequisite_subject_id=prereq_id
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
