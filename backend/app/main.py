import logging
from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

from app.config.settings import settings
from app.database.database import init_db
from app.models.cnn_model import get_cnn_model
from app.models.yolo_model import get_yolo_model

from app.routers import (
    detection,
    history,
    statistics,
    reports,
    feedback,
    complaint
)

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(name)s: %(message)s"
)
logger = logging.getLogger("main")

@asynccontextmanager
async def lifespan(app: FastAPI):
    logger.info("Initializing Pothole Detection API Services...")
    # Initialize Database Tables
    init_db()

    # Pre-warm AI Models singleton instances
    try:
        get_cnn_model()
        get_yolo_model()
    except Exception as e:
        logger.error(f"Error pre-warming AI models: {e}")

    # Ensure Uploads and Reports Directories exist
    settings.UPLOAD_DIR.mkdir(parents=True, exist_ok=True)
    settings.REPORT_DIR.mkdir(parents=True, exist_ok=True)

    yield

    logger.info("Shutting down Pothole Detection API Services.")

app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    lifespan=lifespan,
    docs_url="/docs",
    redoc_url="/redoc"
)

# CORS Configuration for local development & production
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Static File Mounting for Image Uploads & Assets
app.mount("/uploads", StaticFiles(directory=str(settings.UPLOAD_DIR)), name="uploads")
# Also mount assets if needed
if settings.REPORT_DIR.exists():
    app.mount("/reports", StaticFiles(directory=str(settings.REPORT_DIR)), name="reports")

# Mount Routers under /api
app.include_router(detection.router, prefix=settings.API_V1_STR)
app.include_router(history.router, prefix=settings.API_V1_STR)
app.include_router(statistics.router, prefix=settings.API_V1_STR)
app.include_router(reports.router, prefix=settings.API_V1_STR)
app.include_router(feedback.router, prefix=settings.API_V1_STR)
app.include_router(complaint.router, prefix=settings.API_V1_STR)

@app.get("/api/health", tags=["Health"])
def health_check():
    return {
        "status": "ok",
        "service": "Pothole Detection API",
        "version": settings.VERSION
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True)
