from fastapi import APIRouter
from app.database.schemas import ComplaintInfoResponse

router = APIRouter(prefix="/complaint", tags=["Complaint"])

OFFICIAL_COMPLAINT_URL = "https://www.tnrsa.tn.gov.in/tnscrb/?utm_source=chatgpt.com"

@router.get("/info", response_model=ComplaintInfoResponse)
def get_complaint_info():
    return ComplaintInfoResponse(
        title="Road Hazard & Pothole Complaint Portal",
        description="If you discover severe road damage or hazardous potholes, you can officially log a complaint with municipal authorities.",
        official_link=OFFICIAL_COMPLAINT_URL,
        instructions=[
            "Note the exact GPS location or landmark of the road damage.",
            "Upload clear photos of the pothole captured during detection.",
            "Access the official authority portal link to complete your formal report submission."
        ]
    )
