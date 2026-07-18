import os
import cv2
import numpy as np
import tensorflow as tf
from sklearn.model_selection import train_test_split
from tensorflow.keras.models import Sequential
from tensorflow.keras.layers import Conv2D, MaxPooling2D, Flatten, Dense, Dropout
from tensorflow.keras.callbacks import EarlyStopping

# -----------------------------
# Configuration
# -----------------------------
DATASET_PATH = "dataset"
IMG_SIZE = 224
EPOCHS = 20
BATCH_SIZE = 32

# -----------------------------
# Load Images using OpenCV
# -----------------------------
images = []
labels = []

classes = {
    "Normal": 0,
    "Pothole": 1
}

print("Loading dataset...")

for class_name, label in classes.items():

    folder = os.path.join(DATASET_PATH, class_name)

    if not os.path.exists(folder):
        print(f"Folder not found: {folder}")
        continue

    for file in os.listdir(folder):

        path = os.path.join(folder, file)

        img = cv2.imread(path)

        if img is None:
            continue

        img = cv2.resize(img, (IMG_SIZE, IMG_SIZE))

        # Convert BGR → RGB
        img = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)

        # Normalize
        img = img / 255.0

        images.append(img)
        labels.append(label)

images = np.array(images, dtype=np.float32)
labels = np.array(labels)

print("Total Images :", len(images))

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

print("Training Images :", len(X_train))
print("Testing Images :", len(X_test))

# -----------------------------
# CNN Model
# -----------------------------
model = Sequential([

    Conv2D(32, (3,3), activation='relu', input_shape=(224,224,3)),
    MaxPooling2D(2,2),

    Conv2D(64, (3,3), activation='relu'),
    MaxPooling2D(2,2),

    Conv2D(128, (3,3), activation='relu'),
    MaxPooling2D(2,2),

    Conv2D(256, (3,3), activation='relu'),
    MaxPooling2D(2,2),

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

model.summary()

# -----------------------------
# Early Stopping
# -----------------------------
early_stop = EarlyStopping(
    monitor="val_loss",
    patience=5,
    restore_best_weights=True
)

# -----------------------------
# Train
# -----------------------------
history = model.fit(

    X_train,
    y_train,

    validation_data=(X_test, y_test),

    epochs=EPOCHS,

    batch_size=BATCH_SIZE,

    callbacks=[early_stop]

)

# -----------------------------
# Evaluate
# -----------------------------
loss, accuracy = model.evaluate(X_test, y_test)

print("\nTest Accuracy :", accuracy)
print("Test Loss :", loss)

# -----------------------------
# Save Model
# -----------------------------
model.save("pothole_classifier.h5")

print("\nModel saved as pothole_classifier.h5")