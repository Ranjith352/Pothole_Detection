from pathlib import Path
import datetime
import cv2
import numpy as np
import pandas as pd
import matplotlib.pyplot as plt
import plotly.express as px
import plotly.graph_objects as go
from fpdf import FPDF
from PIL import Image
import streamlit as st
import tensorflow as tf
from tensorflow.keras.models import load_model
from ultralytics import YOLO

# ==========================================
# Paths & Config
# ==========================================
BASE_DIR = Path(__file__).resolve().parent
KERAS_MODEL_PATH = BASE_DIR / "pothole_classifier.keras"
H5_MODEL_PATH = BASE_DIR / "pothole_classifier.h5"
YOLO_PATH = BASE_DIR / "yolov8n.pt"
GIF_PATH = BASE_DIR / "popcorn-truck.gif"

# ==========================================
# Cached Model Loading
# ==========================================
@st.cache_resource
def load_cnn_model():
    """
    Loads the CNN model for pothole detection, preferring the modern
    pothole_classifier.keras format with graceful fallback to weight reconstruction
    from pothole_classifier.h5.
    """
    if KERAS_MODEL_PATH.exists():
        try:
            model = load_model(str(KERAS_MODEL_PATH), compile=False)
            return model
        except Exception as e:
            st.warning(f"Warning loading 'pothole_classifier.keras': {e}. Attempting fallback to H5 weight reconstruction...")

    if H5_MODEL_PATH.exists():
        try:
            from tensorflow.keras.models import Sequential
            from tensorflow.keras.layers import Input, Conv2D, MaxPooling2D, Flatten, Dense
            
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
            model.load_weights(str(H5_MODEL_PATH))
            try:
                model.save(str(KERAS_MODEL_PATH))
            except Exception:
                pass
            return model
        except Exception as e:
            st.error(f"Error loading H5 weights: {e}")
            return None

    st.error("CNN model file not found. Ensure 'pothole_classifier.keras' or 'pothole_classifier.h5' exists in the project directory.")
    return None

@st.cache_resource
def load_yolo_model():
    if not YOLO_PATH.exists():
        st.warning(f"YOLO model file '{YOLO_PATH.name}' not found at {YOLO_PATH}.")
        return None
    try:
        return YOLO(str(YOLO_PATH))
    except Exception as e:
        st.error(f"Error loading YOLO model: {e}")
        return None

cnn_model = load_cnn_model()
yolo_model = load_yolo_model()

# Initialize history storage
if "detection_history" not in st.session_state:
    st.session_state.detection_history = []

# ==========================================
# Helper Functions
# ==========================================
def process_image(image):
    """
    Preprocess input image to match CNN training pipeline:
    1. Convert BGR to RGB if needed
    2. Resize to 224x224
    3. Normalize pixel values to [0, 1]
    """
    if len(image.shape) == 3 and image.shape[2] == 3:
        image_rgb = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)
    else:
        image_rgb = image
    image_resized = cv2.resize(image_rgb, (224, 224)) / 255.0
    image_resized = np.expand_dims(image_resized, axis=0)
    return image_resized

def detect_potholes(image):
    """
    Run YOLO object detection on image if available.
    Returns annotated image and detection results.
    """
    if yolo_model is None:
        return image, None
    try:
        results = yolo_model(image)
        annotated_image = results[0].plot()
        return annotated_image, results
    except Exception as e:
        st.warning(f"YOLO detection error: {e}")
        return image, None

def generate_pdf():
    try:
        pdf = FPDF()
        pdf.set_auto_page_break(auto=True, margin=15)
        pdf.add_page()
        pdf.set_font("Arial", "B", 16)
        pdf.cell(200, 10, "Pothole Detection Report", ln=True, align='C')
        pdf.ln(10)
        
        pdf.set_font("Arial", size=12)
        for idx, entry in enumerate(st.session_state.detection_history):
            pdf.cell(0, 10, f"Detection {idx + 1}", ln=True)
            pdf.cell(0, 10, f"Date: {entry['timestamp']}", ln=True)
            pdf.cell(0, 10, f"Classification: {entry['label']}", ln=True)
            pdf.ln(5)
        
        pdf_file = BASE_DIR / "pothole_report.pdf"
        pdf.output(str(pdf_file))
        return pdf_file
    except Exception as e:
        st.error(f"Failed to generate PDF report: {e}")
        return None

def lidar_3d_visualization(image):
    try:
        if len(image.shape) == 3:
            gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
        else:
            gray = image
        height, width = gray.shape
        x, y = np.meshgrid(np.linspace(0, width, width), np.linspace(0, height, height))
        z = gray

        fig = go.Figure(data=[go.Surface(z=z, x=x, y=y, colorscale='Viridis')])
        fig.update_layout(title='LiDAR-style 3D Visualization of Pothole Image', autosize=False,
                          width=700, height=500,
                          margin=dict(l=65, r=50, b=65, t=90))
        st.plotly_chart(fig)
    except Exception as e:
        st.warning(f"Could not render 3D LiDAR visualization: {e}")

# ==========================================
# Streamlit UI Navigation
# ==========================================
st.sidebar.title("Navigation")
pages = [
    "Home",
    "Pothole Detection",
    "Detection History",
    "Statistics & Insights",
    "Report Generation",
    "Complaint Report",
    "Feedback & Improvement",
    "About & Team"
]
page = st.sidebar.radio("Go to", pages)

if page == "Home":
    st.title("Pothole Detection System")
    st.write("This system detects potholes using deep learning models. Upload an image or use the webcam to get started.")
    if GIF_PATH.exists():
        st.image(str(GIF_PATH), caption="How pothole detection works", use_container_width=True)
    else:
        st.info("Demo GIF asset not found in project directory.")

elif page == "Pothole Detection":
    st.title("Pothole Detection")
    
    if cnn_model is None:
        st.error("CNN model could not be loaded. Please ensure pothole_classifier.keras or pothole_classifier.h5 is available and valid.")
    else:
        option = st.radio("Choose input method:", ("Upload Image", "Use Webcam"))
        
        if option == "Upload Image":
            uploaded_file = st.file_uploader("Upload an image", type=["jpg", "png", "jpeg", "webp"])
            if uploaded_file is not None:
                try:
                    file_bytes = np.asarray(bytearray(uploaded_file.read()), dtype=np.uint8)
                    image = cv2.imdecode(file_bytes, 1)
                    
                    if image is None:
                        st.error("Failed to decode the uploaded image. Please try another file.")
                    else:
                        detected_image, results = detect_potholes(image)
                        processed_img = process_image(image)
                        
                        prediction = cnn_model.predict(processed_img)
                        score = float(np.squeeze(prediction))
                        label = "Pothole Detected" if score >= 0.5 else "No Pothole"
                        
                        st.image(detected_image, channels="BGR", caption="Processed Image / Detection Result")
                        st.write(f"**Classification Result:** {label} (Confidence score: {score:.4f})")
                        
                        st.session_state.detection_history.append({
                            "timestamp": datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
                            "label": label
                        })
                        lidar_3d_visualization(image)
                except Exception as e:
                    st.error(f"An error occurred during image processing: {e}")

        elif option == "Use Webcam":
            img_file_buffer = st.camera_input("Capture Image")
            if img_file_buffer is not None:
                try:
                    pil_image = Image.open(img_file_buffer)
                    image = np.array(pil_image)
                    # Convert RGB to BGR for OpenCV consistency
                    if len(image.shape) == 3 and image.shape[2] == 3:
                        image_bgr = cv2.cvtColor(image, cv2.COLOR_RGB2BGR)
                    else:
                        image_bgr = image
                        
                    detected_image, results = detect_potholes(image_bgr)
                    processed_img = process_image(image_bgr)
                    
                    prediction = cnn_model.predict(processed_img)
                    score = float(np.squeeze(prediction))
                    label = "Pothole Detected" if score >= 0.5 else "No Pothole"
                    
                    st.image(detected_image, channels="BGR", caption="Captured Image / Detection Result")
                    st.write(f"**Classification Result:** {label} (Confidence score: {score:.4f})")
                    
                    st.session_state.detection_history.append({
                        "timestamp": datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
                        "label": label
                    })
                    lidar_3d_visualization(image_bgr)
                except Exception as e:
                    st.error(f"An error occurred during webcam processing: {e}")

elif page == "Detection History":
    st.title("Detection History")
    if st.session_state.detection_history:
        df = pd.DataFrame(st.session_state.detection_history)
        st.table(df)
    else:
        st.write("No detection history available.")

elif page == "Statistics & Insights":
    st.title("Statistics & Insights")
    if st.session_state.detection_history:
        df = pd.DataFrame(st.session_state.detection_history)
        total_images = len(df)
        pothole_detected = df[df['label'] == "Pothole Detected"].shape[0]
        pothole_percentage = (pothole_detected / total_images) * 100 if total_images else 0
        st.write(f"Total images analyzed: {total_images}")
        st.write(f"Potholes detected: {pothole_detected} ({pothole_percentage:.2f}%)")
        fig = px.pie(df, names='label', title='Pothole Detection Distribution')
        st.plotly_chart(fig)
    else:
        st.write("No data available.")

elif page == "Report Generation":
    st.title("Generate Report")
    if st.session_state.detection_history:
        pdf_file = generate_pdf()
        if pdf_file and pdf_file.exists():
            with open(pdf_file, "rb") as file:
                st.download_button("Download Report", file, file_name=pdf_file.name)
    else:
        st.write("No data available to generate a report.")

elif page == "Complaint Report":
    st.title("File a Complaint")
    st.write("If you wish to file a complaint regarding potholes, click the button below.")
    if st.button("File Complaint"):
        st.markdown("[Click here to file a complaint](https://www.tnrsa.tn.gov.in/tnscrb/?utm_source=chatgpt.com)", unsafe_allow_html=True)

elif page == "Feedback & Improvement":
    st.title("Feedback & Improvement")
    feedback = st.text_area("Provide feedback about false positives/negatives or suggestions for improvement:")
    if st.button("Submit Feedback"):
        st.write("Thank you for your feedback!")

elif page == "About & Team":
    st.title("About & Team")
    st.write("This project was developed to detect potholes using deep learning techniques.")
    st.write("Team Members: Shiva Palaksha SG, Sibiyenthal K, Ranjith LK")
