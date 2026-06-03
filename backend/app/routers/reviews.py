import os
import uuid
from datetime import datetime, timezone

from fastapi import APIRouter, Depends, File, Form, HTTPException, UploadFile, status
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.flowchart import FlowchartItem
from app.models.review import Review
from app.models.subject import Subject
from app.models.user import User
from app.schemas.review import ReviewOut
from app.services.auth import decodificar_token

router = APIRouter(tags=["reviews"])
security = HTTPBearer()

UPLOAD_DIR = "uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)


def _get_user(credentials: HTTPAuthorizationCredentials, db: Session) -> User:
    user_id = decodificar_token(credentials.credentials)
    if user_id is None:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Token inválido")
    user = db.query(User).filter(User.id == user_id).first()
    if user is None:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Usuário não encontrado")
    return user


@router.get("/subjects/{subject_id}/reviews", response_model=list[ReviewOut])
def list_reviews(subject_id: int, db: Session = Depends(get_db)):
    reviews = (
        db.query(Review)
        .filter(Review.subject_id == subject_id)
        .order_by(Review.created_at.desc())
        .all()
    )
    result = []
    for r in reviews:
        result.append(ReviewOut(
            id=r.id,
            user_id=r.user_id,
            subject_id=r.subject_id,
            nota=r.nota,
            resenha=r.resenha,
            comprovante_url=r.comprovante_url,
            created_at=r.created_at,
            autor_nome=r.user.nome,
        ))
    return result


@router.post("/subjects/{subject_id}/reviews", response_model=ReviewOut, status_code=status.HTTP_201_CREATED)
def create_review(
    subject_id: int,
    nota: float = Form(...),
    resenha: str | None = Form(None),
    comprovante: UploadFile | None = File(None),
    credentials: HTTPAuthorizationCredentials = Depends(security),
    db: Session = Depends(get_db),
):
    user = _get_user(credentials, db)

    subject = db.query(Subject).filter(Subject.id == subject_id).first()
    if not subject:
        raise HTTPException(status_code=404, detail="Disciplina não encontrada")

    completed = db.query(FlowchartItem).filter(
        FlowchartItem.user_id == user.id,
        FlowchartItem.subject_id == subject_id,
        FlowchartItem.status == "completed",
    ).first()
    if not completed:
        raise HTTPException(status_code=400, detail="Você precisa ter cursado esta disciplina para avaliá-la")

    existing = db.query(Review).filter(
        Review.user_id == user.id,
        Review.subject_id == subject_id,
    ).first()
    if existing:
        raise HTTPException(status_code=409, detail="Você já avaliou esta disciplina")

    if nota < 0 or nota > 10:
        raise HTTPException(status_code=400, detail="A nota deve ser entre 0 e 10")

    comprovante_url = None
    if comprovante and comprovante.filename:
        ext = os.path.splitext(comprovante.filename)[1] or ".bin"
        filename = f"{uuid.uuid4()}{ext}"
        filepath = os.path.join(UPLOAD_DIR, filename)
        content = comprovante.file.read()
        with open(filepath, "wb") as f:
            f.write(content)
        comprovante_url = f"/{UPLOAD_DIR}/{filename}"

    review = Review(
        user_id=user.id,
        subject_id=subject_id,
        nota=nota,
        resenha=resenha,
        comprovante_url=comprovante_url,
        created_at=datetime.now(timezone.utc),
    )
    db.add(review)
    db.commit()
    db.refresh(review)

    return ReviewOut(
        id=review.id,
        user_id=review.user_id,
        subject_id=review.subject_id,
        nota=review.nota,
        resenha=review.resenha,
        comprovante_url=review.comprovante_url,
        created_at=review.created_at,
        autor_nome=user.nome,
    )
