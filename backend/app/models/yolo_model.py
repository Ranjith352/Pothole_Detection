import logging
import numpy as np
from ultralytics import YOLO
from app.config.settings import settings

logger = logging.getLogger(__name__)

class YOLOModelSingleton:
    _instance = None
    _model = None

    def __new__(cls):
        if cls._instance is None:
            cls._instance = super(YOLOModelSingleton, cls).__new__(cls)
            cls._instance._load_model()
        return cls._instance

    def _load_model(self):
        yolo_path = settings.YOLO_MODEL_PATH
        if yolo_path.exists():
            try:
                logger.info(f"Loading YOLO model from {yolo_path}...")
                self._model = YOLO(str(yolo_path))
                logger.info("Successfully loaded YOLO model!")
                return
            except Exception as e:
                logger.error(f"Error loading YOLO model from {yolo_path}: {e}")

        logger.warning("YOLO model not found or failed to load.")
        self._model = None

    def detect(self, image: np.ndarray):
        """
        Runs YOLO object detection.
        Returns:
            annotated_image (np.ndarray): Image with plotted bounding boxes
            detections_list (list): Structured bounding box dicts
        """
        if self._model is None:
            return image, []

        try:
            results = self._model(image, verbose=False)
            if not results:
                return image, []

            res = results[0]
            annotated_image = res.plot()

            detections_list = []
            boxes = res.boxes
            if boxes is not None:
                for box in boxes:
                    cls_id = int(box.cls[0].item())
                    cls_name = self._model.names.get(cls_id, f"class_{cls_id}")
                    conf = float(box.conf[0].item())
                    xyxy = box.xyxy[0].tolist()  # [x1, y1, x2, y2]

                    detections_list.append({
                        "class_name": cls_name,
                        "confidence": round(conf, 4),
                        "bbox": {
                            "x1": round(xyxy[0], 2),
                            "y1": round(xyxy[1], 2),
                            "x2": round(xyxy[2], 2),
                            "y2": round(xyxy[3], 2)
                        }
                    })

            return annotated_image, detections_list
        except Exception as e:
            logger.error(f"YOLO inference error: {e}")
            return image, []

def get_yolo_model():
    return YOLOModelSingleton()
