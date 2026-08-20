from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database.database import get_db
from app.database.schemas import StatisticsResponse
from app.services.statistics_service import get_statistics_data

router = APIRouter(prefix="/statistics", tags=["Statistics"])

@router.get("", response_model=StatisticsResponse)
def get_statistics(db: Session = Depends(get_db)):
    return get_statistics_data(db)
