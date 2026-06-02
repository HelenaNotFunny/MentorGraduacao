from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.course_subjects import CourseSubjects
from app.models.flowchart import FlowchartItem
from app.models.subject import Prerequisite, Subject
from app.models.user import User
from app.schemas.flowchart import FlowchartItemCreate, FlowchartItemOut, FlowchartItemUpdate
from app.schemas.subject import SubjectOut
from app.services.auth import decodificar_token

router = APIRouter(prefix="/flowchart", tags=["flowchart"])
security = HTTPBearer()


def _get_user(credentials: HTTPAuthorizationCredentials, db: Session) -> User:
    user_id = decodificar_token(credentials.credentials)
    if user_id is None:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Token inválido")
    user = db.query(User).filter(User.id == user_id).first()
    if user is None:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Usuário não encontrado")
    return user


def _to_out(item: FlowchartItem) -> FlowchartItemOut:
    return FlowchartItemOut(
        id=item.id,
        subject_id=item.subject_id,
        subject_nome=item.subject.nome,
        subject_codigo=item.subject.codigo,
        semester_index=item.semester_index,
        status=item.status,
    )


@router.get("/", response_model=list[FlowchartItemOut])
def list_flowchart(
    credentials: HTTPAuthorizationCredentials = Depends(security),
    db: Session = Depends(get_db),
):
    user = _get_user(credentials, db)
    items = db.query(FlowchartItem).filter(FlowchartItem.user_id == user.id).all()
    return [_to_out(i) for i in items]


@router.post("/", response_model=FlowchartItemOut, status_code=status.HTTP_201_CREATED)
def add_to_flowchart(
    body: FlowchartItemCreate,
    credentials: HTTPAuthorizationCredentials = Depends(security),
    db: Session = Depends(get_db),
):
    user = _get_user(credentials, db)

    subject = db.query(Subject).filter(Subject.id == body.subject_id).first()
    if not subject:
        raise HTTPException(status_code=404, detail="Disciplina não encontrada")

    existing = db.query(FlowchartItem).filter(
        FlowchartItem.user_id == user.id,
        FlowchartItem.subject_id == body.subject_id,
    ).first()
    if existing:
        raise HTTPException(status_code=409, detail="Disciplina já está no fluxograma")

    prereqs = db.query(Prerequisite).filter(Prerequisite.subject_id == subject.id).all()
    if prereqs:
        completed_ids = {
            i.subject_id
            for i in db.query(FlowchartItem).filter(
                FlowchartItem.user_id == user.id,
                FlowchartItem.status == "completed",
            ).all()
        }
        for p in prereqs:
            if p.prerequisite_subject_id not in completed_ids:
                prereq_subject = db.query(Subject).filter(Subject.id == p.prerequisite_subject_id).first()
                raise HTTPException(
                    status_code=400,
                    detail=f"Pré-requisito não cumprido: {prereq_subject.nome if prereq_subject else f'id {p.prerequisite_subject_id}'}",
                )

    item = FlowchartItem(
        user_id=user.id,
        subject_id=body.subject_id,
        semester_index=body.semester_index,
        status="planned",
    )
    db.add(item)
    db.commit()
    db.refresh(item)
    return _to_out(item)


@router.put("/{item_id}", response_model=FlowchartItemOut)
def update_flowchart_item(
    item_id: int,
    body: FlowchartItemUpdate,
    credentials: HTTPAuthorizationCredentials = Depends(security),
    db: Session = Depends(get_db),
):
    user = _get_user(credentials, db)
    item = db.query(FlowchartItem).filter(
        FlowchartItem.id == item_id,
        FlowchartItem.user_id == user.id,
    ).first()
    if not item:
        raise HTTPException(status_code=404, detail="Item não encontrado")

    if body.semester_index is not None:
        item.semester_index = body.semester_index
    if body.status is not None:
        item.status = body.status

    db.commit()
    db.refresh(item)
    return _to_out(item)


@router.delete("/{item_id}", status_code=status.HTTP_204_NO_CONTENT)
def remove_from_flowchart(
    item_id: int,
    credentials: HTTPAuthorizationCredentials = Depends(security),
    db: Session = Depends(get_db),
):
    user = _get_user(credentials, db)
    item = db.query(FlowchartItem).filter(
        FlowchartItem.id == item_id,
        FlowchartItem.user_id == user.id,
    ).first()
    if not item:
        raise HTTPException(status_code=404, detail="Item não encontrado")
    db.delete(item)
    db.commit()


@router.get("/suggestions", response_model=list[SubjectOut])
def suggestions(
    credentials: HTTPAuthorizationCredentials = Depends(security),
    db: Session = Depends(get_db),
):
    user = _get_user(credentials, db)

    completed_ids = {
        i.subject_id
        for i in db.query(FlowchartItem).filter(
            FlowchartItem.user_id == user.id,
            FlowchartItem.status == "completed",
        ).all()
    }

    planned_ids = {
        i.subject_id
        for i in db.query(FlowchartItem).filter(
            FlowchartItem.user_id == user.id,
        ).all()
    }

    all_subjects = (
        db.query(Subject)
        .join(CourseSubjects)
        .filter(CourseSubjects.course_id == user.curso_id)
        .all()
    )
    available = []
    for s in all_subjects:
        if s.id in planned_ids:
            continue
        prereqs = db.query(Prerequisite).filter(Prerequisite.subject_id == s.id).all()
        if not prereqs:
            available.append(s)
        elif all(p.prerequisite_subject_id in completed_ids for p in prereqs):
            available.append(s)

    return available
