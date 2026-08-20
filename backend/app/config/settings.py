import os
import json
from pathlib import Path
from pydantic_settings import BaseSettings

BASE_DIR = Path(__file__).resolve().parent.parent.parent
ROOT_DIR = BASE_DIR.parent

class Settings(BaseSettings):
    PROJECT_NAME: str = "Pothole Detection API"
    VERSION: str = "1.0.0"
    API_V1_STR: str = "/api"

    DATABASE_URL: str = os.getenv(
        "DATABASE_URL",
        "postgresql+psycopg2://pothole_user:ranjupriya@localhost:5432/pothole_detection"
    )

    # Point directly to centralized models in project root by default
    CNN_MODEL_PATH: Path = ROOT_DIR / "pothole_classifier.keras"
    H5_MODEL_PATH: Path = ROOT_DIR / "pothole_classifier.h5"
    YOLO_MODEL_PATH: Path = ROOT_DIR / "yolov8n.pt"

    UPLOAD_DIR: Path = ROOT_DIR / "uploads"
    REPORT_DIR: Path = ROOT_DIR / "generated_reports"

    CORS_ORIGINS: list[str] = [
        "http://localhost:5173",
        "http://localhost:3000",
        "http://127.0.0.1:5173",
        "http://127.0.0.1:3000"
    ]

    class Config:
        env_file = ".env"
        extra = "ignore"

settings = Settings()
