import os
import sys
import cv2
import numpy as np
import tensorflow as tf
from sklearn.model_selection import train_test_split
from tensorflow.keras.models import Sequential
from tensorflow.keras.layers import Conv2D, MaxPooling2D, Flatten, Dense, Dropout, Input
from tensorflow.keras.callbacks import EarlyStopping

# -----------------------------
# Configuration & Project Paths
# -----------------------------
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DATASET_PATH = os.path.join(BASE_DIR, "dataset")
MODEL_PATH = os.path.join(BASE_DIR, "pothole_classifier.h5")

IMG_SIZE = 224
EPOCHS = 20
BATCH_SIZE = 32

print("=" * 60)
print("POTHOLE DETECTION MODEL TRAINING")
print("=" * 60)
print(f"Project Directory : {BASE_DIR}")
print(f"Dataset Path      : {DATASET_PATH}")
print(f"Model Save Path   : {MODEL_PATH}")

# -----------------------------
# Verify Dataset Directory
# -----------------------------
if not os.path.exists(DATASET_PATH):
    print(f"\nERROR: Dataset folder not found at '{DATASET_PATH}'!")
    print("Please ensure the dataset is placed inside 'dataset/normal' and 'dataset/potholes'.")
    sys.exit(1)

# Map target class names to subfolder candidates (case-insensitive fallback)
class_candidates = {
    "normal": ["normal", "Normal", "NORMAL"],
    "potholes": ["potholes", "Pothole", "pothole", "POTHOLES", "POTHOLE"]
}

resolved_folders = {}
for target_class, candidates in class_candidates.items():
    found = None
    for cand in candidates:
        candidate_path = os.path.join(DATASET_PATH, cand)
        if os.path.isdir(candidate_path):
            found = candidate_path
            break
    if found:
        resolved_folders[target_class] = found
    else:
        print(f"ERROR: Subfolder for '{target_class}' not found in {DATASET_PATH}!")
        sys.exit(1)

# Class Mapping: normal = 0, potholes = 1
classes = {
    "normal": 0,
    "potholes": 1
}

# -----------------------------
# Load Images using OpenCV
# -----------------------------
images = []
labels = []

print("\nLoading dataset images...")

for class_name, label in classes.items():
    folder = resolved_folders[class_name]
    valid_extensions = (".jpg", ".jpeg", ".png", ".bmp", ".webp")
    files = [f for f in os.listdir(folder) if f.lower().endswith(valid_extensions)]
    print(f" -> Found {len(files)} images in '{os.path.basename(folder)}' (Label: {label})")
    
    for file in files:
        path = os.path.join(folder, file)
        img = cv2.imread(path)
        
        if img is None:
            continue
        
        # Resize to 224x224
        img = cv2.resize(img, (IMG_SIZE, IMG_SIZE))
        # Convert BGR → RGB
        img = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)
        # Normalize pixel values to [0, 1]
        img = img / 255.0
        
        images.append(img)
        labels.append(label)

images = np.array(images, dtype=np.float32)
labels = np.array(labels, dtype=np.int32)

print("\nTotal valid images loaded:", len(images))

if len(images) == 0:
    print("ERROR: No valid images found in dataset directory! Training aborted.")
    sys.exit(1)

# -----------------------------
# Train-Test Split
# -----------------------------
X_train, X_test, y_train, y_test = train_test_split(
    images,
    labels,
    test_size=0.2,
    random_state=42,
    stratify=labels
)

print(f"Training Images           : {len(X_train)}")
print(f"Testing Images            : {len(X_test)}")

# -----------------------------
# Build CNN Model
# -----------------------------
model = Sequential([
    Input(shape=(224, 224, 3)),

    Conv2D(32, (3, 3), activation='relu'),
    MaxPooling2D(2, 2),

    Conv2D(64, (3, 3), activation='relu'),
    MaxPooling2D(2, 2),

    Conv2D(128, (3, 3), activation='relu'),
    MaxPooling2D(2, 2),

    Conv2D(256, (3, 3), activation='relu'),
    MaxPooling2D(2, 2),

    Flatten(),

    Dense(512, activation='relu'),
    Dropout(0.5),

    Dense(128, activation='relu'),

    Dense(1, activation='sigmoid')
])

model.compile(
    optimizer="adam",
    loss="binary_crossentropy",
    metrics=["accuracy"]
)

print("\nCNN Model Architecture:")
model.summary()

# -----------------------------
# Early Stopping Callback
# -----------------------------
early_stop = EarlyStopping(
    monitor="val_loss",
    patience=5,
    restore_best_weights=True
)

# -----------------------------
# Train Model
# -----------------------------
print("\nStarting CNN Model Training...")
history = model.fit(
    X_train,
    y_train,
    validation_data=(X_test, y_test),
    epochs=EPOCHS,
    batch_size=BATCH_SIZE,
    callbacks=[early_stop]
)

# -----------------------------
# Evaluate Model
# -----------------------------
loss, accuracy = model.evaluate(X_test, y_test, verbose=0)
print(f"\nFinal Test Loss     : {loss:.4f}")
print(f"Final Test Accuracy : {accuracy * 100:.2f}%")

# -----------------------------
# Save Model
# -----------------------------
print(f"\nSaving model to: {MODEL_PATH}...")
model.save(MODEL_PATH)

if os.path.exists(MODEL_PATH):
    file_size_mb = os.path.getsize(MODEL_PATH) / (1024 * 1024)
    print("=" * 60)
    print("SUCCESS: Model saved successfully!")
    print(f"Model file path : {MODEL_PATH}")
    print(f"Model file size : {file_size_mb:.2f} MB")
    print("=" * 60)
else:
    print("\nERROR: Failed to verify saved model file!")
    sys.exit(1)