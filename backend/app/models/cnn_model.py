import logging
import numpy as np
import tensorflow as tf
from tensorflow.keras.models import load_model, Sequential
from tensorflow.keras.layers import Input, Conv2D, MaxPooling2D, Flatten, Dense
from app.config.settings import settings

logger = logging.getLogger(__name__)

class CNNModelSingleton:
    _instance = None
    _model = None

    def __new__(cls):
        if cls._instance is None:
            cls._instance = super(CNNModelSingleton, cls).__new__(cls)
            cls._instance._load_model()
        return cls._instance

    def _load_model(self):
        keras_path = settings.CNN_MODEL_PATH
        h5_path = settings.H5_MODEL_PATH

        if keras_path.exists():
            try:
                logger.info(f"Loading CNN model from {keras_path}...")
                self._model = load_model(str(keras_path), compile=False)
                logger.info("Successfully loaded pothole_classifier.keras!")
                return
            except Exception as e:
                logger.warning(f"Error loading '{keras_path.name}': {e}. Attempting H5 weight fallback...")

        if h5_path.exists():
            try:
                logger.info(f"Reconstructing CNN model architecture and loading weights from {h5_path}...")
                model = Sequential([
                    Input(shape=(224, 224, 3)),
                    Conv2D(32, (3, 3), activation="relu", name="conv2d"),
                    MaxPooling2D((2, 2), strides=(2, 2), name="max_pooling2d"),
                    Conv2D(32, (3, 3), activation="relu", name="conv2d_1"),
                    MaxPooling2D((2, 2), strides=(2, 2), name="max_pooling2d_1"),
                    Flatten(name="flatten"),
                    Dense(128, activation="relu", name="dense"),
                    Dense(1, activation="sigmoid", name="dense_1")
                ])
                model.load_weights(str(h5_path))
                self._model = model
                logger.info("Successfully loaded H5 weights into CNN model!")
                # Attempt to save .keras for future fast loading
                try:
                    model.save(str(keras_path))
                except Exception:
                    pass
                return
            except Exception as e:
                logger.error(f"Failed to load H5 model weights: {e}")

        logger.error("CNN model file not found or could not be loaded!")
        self._model = None

    def predict(self, processed_image: np.ndarray) -> dict:
        if self._model is None:
            raise RuntimeError("CNN Model is not loaded.")
        
        raw_pred = self._model.predict(processed_image, verbose=0)
        score = float(np.squeeze(raw_pred))

        if score >= 0.5:
            label = "Pothole Detected"
            confidence = score
        else:
            label = "No Pothole"
            confidence = 1.0 - score

        return {
            "label": label,
            "confidence": round(confidence, 4),
            "raw_score": round(score, 4)
        }

def get_cnn_model():
    return CNNModelSingleton()
