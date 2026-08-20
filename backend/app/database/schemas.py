from datetime import datetime
from typing import List, Optional, Any
from pydantic import BaseModel

class YOLOBox(BaseModel):
    x1: float
    y1: float
    x2: float
    y2: float

class YOLODetectionItem(BaseModel):
    class_name: str
    confidence: float
    bbox: YOLOBox

class YOLOResults(BaseModel):
    available: bool
    detections: List[YOLODetectionItem] = []

class ClassificationResult(BaseModel):
    label: str
    confidence: float

class DetectionResponse(BaseModel):
    id: Optional[int] = None
    success: bool
    classification: ClassificationResult
    yolo: YOLOResults
    image_url: str
    annotated_image_url: Optional[str] = None
    timestamp: str

class DetectionHistoryItem(BaseModel):
    id: int
    timestamp: str
    filename: str
    classification: str
    confidence: float
    yolo_detection_count: int
    image_url: str
    annotated_image_url: Optional[str] = None

    class Config:
        from_attributes = True

class HistoryResponse(BaseModel):
    total: int
    items: List[DetectionHistoryItem]

class StatisticsResponse(BaseModel):
    total_images: int
    potholes_detected: int
    no_pothole: int
    pothole_percentage: float
    average_confidence: float
    confidence_distribution: List[dict]
    trend: List[dict]

class FeedbackCreate(BaseModel):
    message: str
    feedback_type: Optional[str] = "general"
    rating: Optional[int] = 5

class FeedbackResponse(BaseModel):
    id: int
    timestamp: str
    message: str
    feedback_type: str
    rating: int

class ComplaintInfoResponse(BaseModel):
    title: str
    description: str
    official_link: str
    instructions: List[str]

class Surface3DResponse(BaseModel):
    x: List[float]
    y: List[float]
    z: List[List[float]]
    width: int
    height: int
