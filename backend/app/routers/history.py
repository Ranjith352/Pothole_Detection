from typing import Optional
from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from app.database.database import get_db
from app.database.models import DetectionDB
from app.database.schemas import HistoryResponse, DetectionHistoryItem

router = APIRouter(prefix="/history", tags=["History"])

@router.get("", response_model=HistoryResponse)
def get_history(
    limit: int = Query(50, ge=1, le=500),
    offset: int = Query(0, ge=0),
    search: Optional[str] = Query(None),
    classification: Optional[str] = Query(None),
    db: Session = Depends(get_db)
):
    query = db.query(DetectionDB)

    if classification:
        query = query.filter(DetectionDB.classification == classification)
    if search:
        query = query.filter(
            (DetectionDB.filename.ilike(f"%{search}%")) | 
            (DetectionDB.classification.ilike(f"%{search}%"))
        )

    total = query.count()
    items = query.order_by(DetectionDB.timestamp.desc()).offset(offset).limit(limit).all()

    formatted_items = []
    for item in items:
        formatted_items.append(
            DetectionHistoryItem(
                id=item.id,
                timestamp=item.timestamp.strftime("%Y-%m-%d %H:%M:%S"),
                filename=item.filename,
                classification=item.classification,
                confidence=round(item.confidence, 4),
                yolo_detection_count=item.yolo_detection_count or 0,
                image_url=item.image_path,
                annotated_image_url=item.annotated_image_path
            )
        )

    return HistoryResponse(total=total, items=formatted_items)
