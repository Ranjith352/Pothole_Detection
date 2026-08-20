import os
import uuid
import datetime
import cv2
import numpy as np
from PIL import Image
import io
from app.config.settings import settings

def decode_image_bytes(file_bytes: bytes) -> np.ndarray:
    """Decodes raw byte array into OpenCV BGR image matrix."""
    nparr = np.frombuffer(file_bytes, np.uint8)
    image = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
    if image is None:
        raise ValueError("Failed to decode uploaded image. File may be corrupt or invalid format.")
    return image

def preprocess_image_for_cnn(image_bgr: np.ndarray) -> np.ndarray:
    """
    Preprocess input image to match CNN training pipeline:
    1. Convert BGR to RGB
    2. Resize to (224, 224)
    3. Normalize pixel values to [0.0, 1.0]
    4. Expand batch dimension -> (1, 224, 224, 3)
    """
    if len(image_bgr.shape) == 3 and image_bgr.shape[2] == 3:
        image_rgb = cv2.cvtColor(image_bgr, cv2.COLOR_BGR2RGB)
    else:
        image_rgb = image_bgr
    
    image_resized = cv2.resize(image_rgb, (224, 224)) / 255.0
    image_batch = np.expand_dims(image_resized, axis=0)
    return image_batch

def save_image_file(image_bgr: np.ndarray, prefix: str = "img") -> tuple[str, str]:
    """
    Saves OpenCV BGR image into UPLOAD_DIR.
    Returns (absolute_file_path, relative_url_path).
    """
    settings.UPLOAD_DIR.mkdir(parents=True, exist_ok=True)
    timestamp = datetime.datetime.now().strftime("%Y%m%d_%H%M%S")
    unique_id = uuid.uuid4().hex[:8]
    filename = f"{prefix}_{timestamp}_{unique_id}.jpg"
    
    file_path = settings.UPLOAD_DIR / filename
    cv2.imwrite(str(file_path), image_bgr)
    
    relative_url = f"/uploads/{filename}"
    return str(file_path), relative_url

def generate_3d_surface_data(image_bgr: np.ndarray, grid_size: int = 60) -> dict:
    """
    Generates a 3D LiDAR-style surface grid from image grayscale intensity values.
    Returns x, y, z mesh grid matrices suitable for Plotly 3D Surface plots.
    """
    if len(image_bgr.shape) == 3:
        gray = cv2.cvtColor(image_bgr, cv2.COLOR_BGR2GRAY)
    else:
        gray = image_bgr

    # Resize to manageable grid size for responsive web rendering
    h, w = gray.shape
    aspect_ratio = w / h
    grid_w = int(grid_size * aspect_ratio)
    grid_h = grid_size

    resized_gray = cv2.resize(gray, (grid_w, grid_h), interpolation=cv2.INTER_AREA)

    x = np.linspace(0, grid_w - 1, grid_w).tolist()
    y = np.linspace(0, grid_h - 1, grid_h).tolist()
    z = resized_gray.tolist()

    return {
        "x": x,
        "y": y,
        "z": z,
        "width": grid_w,
        "height": grid_h
    }
