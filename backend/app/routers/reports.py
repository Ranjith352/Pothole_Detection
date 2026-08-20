from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.responses import FileResponse
from sqlalchemy.orm import Session
from app.database.database import get_db
from app.services.report_service import generate_pdf_report

router = APIRouter(prefix="/reports", tags=["Reports"])

@router.get("/generate")
def download_pdf_report(db: Session = Depends(get_db)):
    try:
        report_file_path = generate_pdf_report(db)
        if not report_file_path.exists():
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="PDF report file generation failed."
            )
        return FileResponse(
            path=str(report_file_path),
            filename=report_file_path.name,
            media_type="application/pdf"
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to generate report: {str(e)}"
        )
