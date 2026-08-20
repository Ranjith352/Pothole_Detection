import datetime
from sqlalchemy import Column, Integer, String, Float, DateTime, Text, JSON
from app.database.database import Base

class DetectionDB(Base):
    __tablename__ = "detections"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    timestamp = Column(DateTime, default=datetime.datetime.utcnow, index=True)
    filename = Column(String(255), nullable=False)
    classification = Column(String(50), nullable=False)  # "Pothole Detected" or "No Pothole"
    confidence = Column(Float, nullable=False)
    yolo_detection_count = Column(Integer, default=0)
    image_path = Column(String(500), nullable=False)
    annotated_image_path = Column(String(500), nullable=True)
    yolo_details_json = Column(JSON, nullable=True)

class FeedbackDB(Base):
    __tablename__ = "feedback"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    timestamp = Column(DateTime, default=datetime.datetime.utcnow, index=True)
    message = Column(Text, nullable=False)
    feedback_type = Column(String(50), default="general")  # "false_positive", "false_negative", "general"
    rating = Column(Integer, default=5)
