import datetime
import logging
from sqlalchemy.orm import Session

from app.models.cnn_model import get_cnn_model
from app.models.yolo_model import get_yolo_model
from app.services.image_service import (
    decode_image_bytes,
    preprocess_image_for_cnn,
    save_image_file
)
from app.database.models import DetectionDB

logger = logging.getLogger(__name__)

def process_detection(file_bytes: bytes, filename: str, db: Session) -> dict:
    """
    Main detection pipeline:
    1. Decode uploaded file bytes
    2. Preprocess for CNN
    3. Perform CNN Pothole Classification
    4. Perform YOLO Object Detection (generating annotated image & bbox list)
    5. Save original & annotated images to disk
    6. Persist record into Database
    7. Return clean structured dictionary
    """
    image_bgr = decode_image_bytes(file_bytes)

    # 1. CNN Inference
    cnn = get_cnn_model()
    cnn_input = preprocess_image_for_cnn(image_bgr)
    cnn_res = cnn.predict(cnn_input)

    # 2. YOLO Inference
    yolo = get_yolo_model()
    annotated_bgr, yolo_detections = yolo.detect(image_bgr)

    # 3. Save files
    orig_path, orig_url = save_image_file(image_bgr, prefix="orig")
    annotated_path, annotated_url = save_image_file(annotated_bgr, prefix="yolo")

    # 4. Save DB Record
    db_record = DetectionDB(
        timestamp=datetime.datetime.utcnow(),
        filename=filename,
        classification=cnn_res["label"],
        confidence=cnn_res["confidence"],
        yolo_detection_count=len(yolo_detections),
        image_path=orig_url,
        annotated_image_path=annotated_url,
        yolo_details_json=yolo_detections
    )
    db.add(db_record)
    db.commit()
    db.refresh(db_record)

    return {
        "id": db_record.id,
        "success": True,
        "classification": {
            "label": cnn_res["label"],
            "confidence": cnn_res["confidence"]
        },
        "yolo": {
            "available": yolo._model is not None,
            "detections": yolo_detections
        },
        "image_url": orig_url,
        "annotated_image_url": annotated_url,
        "timestamp": db_record.timestamp.strftime("%Y-%m-%d %H:%M:%S")
    }
