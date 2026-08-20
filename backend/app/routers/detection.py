from fastapi import APIRouter, UploadFile, File, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.database.database import get_db
from app.database.schemas import DetectionResponse, Surface3DResponse
from app.services.detection_service import process_detection
from app.services.image_service import decode_image_bytes, generate_3d_surface_data

router = APIRouter(prefix="/detection", tags=["Detection"])

ALLOWED_CONTENT_TYPES = {"image/jpeg", "image/png", "image/jpg", "image/webp"}
MAX_FILE_SIZE = 15 * 1024 * 1024  # 15MB

@router.post("/predict", response_model=DetectionResponse)
async def predict_image(
    file: UploadFile = File(...),
    db: Session = Depends(get_db)
):
    if file.content_type not in ALLOWED_CONTENT_TYPES:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Unsupported file type '{file.content_type}'. Please upload JPG, PNG, or WEBP."
        )

    file_bytes = await file.read()
    if len(file_bytes) > MAX_FILE_SIZE:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="File size exceeds maximum limit of 15MB."
        )

    try:
        result = process_detection(file_bytes, file.filename or "uploaded_image.jpg", db)
        return result
    except ValueError as ve:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(ve))
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error performing detection inference: {str(e)}"
        )

@router.post("/3d", response_model=Surface3DResponse)
async def get_3d_surface(file: UploadFile = File(...)):
    if file.content_type not in ALLOWED_CONTENT_TYPES:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Unsupported file format for 3D surface plot."
        )
    file_bytes = await file.read()
    try:
        image_bgr = decode_image_bytes(file_bytes)
        surface_data = generate_3d_surface_data(image_bgr, grid_size=60)
        return surface_data
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to generate 3D surface matrix: {str(e)}"
        )
