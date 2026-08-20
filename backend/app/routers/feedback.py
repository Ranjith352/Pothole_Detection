import datetime
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.database.database import get_db
from app.database.models import FeedbackDB
from app.database.schemas import FeedbackCreate, FeedbackResponse

router = APIRouter(prefix="/feedback", tags=["Feedback"])

@router.post("", response_model=FeedbackResponse, status_code=status.HTTP_201_CREATED)
def submit_feedback(
    payload: FeedbackCreate,
    db: Session = Depends(get_db)
):
    if not payload.message.strip():
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Feedback message cannot be empty."
        )

    fb = FeedbackDB(
        timestamp=datetime.datetime.utcnow(),
        message=payload.message.strip(),
        feedback_type=payload.feedback_type or "general",
        rating=payload.rating or 5
    )
    db.add(fb)
    db.commit()
    db.refresh(fb)

    return FeedbackResponse(
        id=fb.id,
        timestamp=fb.timestamp.strftime("%Y-%m-%d %H:%M:%S"),
        message=fb.message,
        feedback_type=fb.feedback_type,
        rating=fb.rating
    )

@router.get("", response_model=list[FeedbackResponse])
def list_feedback(db: Session = Depends(get_db)):
    items = db.query(FeedbackDB).order_by(FeedbackDB.timestamp.desc()).all()
    return [
        FeedbackResponse(
            id=item.id,
            timestamp=item.timestamp.strftime("%Y-%m-%d %H:%M:%S"),
            message=item.message,
            feedback_type=item.feedback_type,
            rating=item.rating
        ) for item in items
    ]
