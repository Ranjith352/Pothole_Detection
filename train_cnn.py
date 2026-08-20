import os
import sys
import numpy as np
import tensorflow as tf
from tensorflow.keras.preprocessing.image import ImageDataGenerator
from tensorflow.keras.preprocessing import image
import cv2
import matplotlib.pyplot as plt

from pathlib import Path

# ============================================================
# 1. PROJECT PATHS
# ============================================================

BASE_DIR = Path(__file__).resolve().parent
DATASET_DIR = BASE_DIR / "dataset"
MODEL_PATH = BASE_DIR / "pothole_classifier.h5"


# Expected dataset structure:
#
# Pothole_Detection/
# ├── dataset/
# │   ├── potholes/
# │   └── normal/

# ============================================================
# 2. CHECK DATASET
# ============================================================

pothole_dir = DATASET_DIR / "potholes"
normal_dir = DATASET_DIR / "normal"

if not pothole_dir.exists() or not normal_dir.exists():
    print(f"Error: Dataset directories not found in '{DATASET_DIR}'.")
    sys.exit(1)

print("=" * 60)
print("POTHOLE DETECTION CNN TRAINING (IMAGE GENERATOR)")
print("=" * 60)

print("\nDataset directory:", DATASET_DIR)
print("Pothole images   :", len(list(pothole_dir.iterdir())))
print("Normal images    :", len(list(normal_dir.iterdir())))


# ============================================================
# 3. DATA PREPROCESSING & AUGMENTATION
# ============================================================

train_datagen = ImageDataGenerator(
    rescale=1.0 / 255,
    shear_range=0.2,
    zoom_range=0.2,
    horizontal_flip=True,
    validation_split=0.2
)

training_set = train_datagen.flow_from_directory(
    DATASET_DIR,
    target_size=(224, 224),
    batch_size=32,
    class_mode="binary",
    subset="training",
    shuffle=True
)

validation_generator = train_datagen.flow_from_directory(
    DATASET_DIR,
    target_size=(224, 224),
    batch_size=32,
    class_mode="binary",
    subset="validation",
    shuffle=False
)

print("\nClass indices:", training_set.class_indices)

# ============================================================
# 4. CREATE CNN MODEL
# ============================================================

cnn = tf.keras.models.Sequential([
    tf.keras.layers.Input(shape=(224, 224, 3)),
    tf.keras.layers.Conv2D(filters=32, kernel_size=3, activation="relu"),
    tf.keras.layers.MaxPool2D(pool_size=2, strides=2),
    tf.keras.layers.Conv2D(filters=32, kernel_size=3, activation="relu"),
    tf.keras.layers.MaxPool2D(pool_size=2, strides=2),
    tf.keras.layers.Flatten(),
    tf.keras.layers.Dense(units=128, activation="relu"),
    tf.keras.layers.Dense(units=1, activation="sigmoid")
])

cnn.compile(
    optimizer="adam",
    loss="binary_crossentropy",
    metrics=["accuracy"]
)

print("\nCNN Model Architecture:")
cnn.summary()

# ============================================================
# 5. TRAIN MODEL
# ============================================================

print("\nSTARTING CNN TRAINING...")
history = cnn.fit(
    x=training_set,
    validation_data=validation_generator,
    epochs=25
)

# ============================================================
# 6. SAVE TRAINED MODEL
# ============================================================

print(f"\nSaving trained model to: {MODEL_PATH}")
cnn.save(str(MODEL_PATH))

if MODEL_PATH.exists():
    file_size = MODEL_PATH.stat().st_size / (1024 * 1024)
    print(f"Model saved successfully! Size: {file_size:.2f} MB")