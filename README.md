# 🚧 AI-Based Pothole Detection System

## 📌 Project Overview

The **AI-Based Pothole Detection System** is a deep learning application developed to automatically detect potholes from road images. The system combines a **Convolutional Neural Network (CNN)** for binary pothole classification and **YOLOv8** for object detection to identify potholes accurately.

The application is built using **Streamlit**, providing an interactive interface where users can upload road images or capture images using a webcam for real-time pothole detection. The system also includes LiDAR-style 3D visualization, detection history, statistical analysis, and PDF report generation.

---

# 🎯 Objectives

- Detect potholes automatically from road images.
- Classify images as pothole or non-pothole using CNN.
- Localize potholes using YOLOv8 object detection.
- Provide a user-friendly web interface.
- Generate analytical reports and visualization for road monitoring.

---

# 🛠 Technologies Used

- Python
- OpenCV
- TensorFlow / Keras (CNN)
- YOLOv8 (Ultralytics)
- Streamlit
- NumPy
- Pandas
- Plotly
- Matplotlib
- Pillow (PIL)
- FPDF

---

# ✨ Features

- Upload road images for pothole detection
- Webcam-based live image capture
- CNN-based pothole classification
- YOLOv8 object detection
- LiDAR-style 3D visualization
- Detection history tracking
- Statistics and insights dashboard
- PDF report generation
- Feedback and complaint reporting interface

---

# 📂 Dataset

The project is trained using a pothole image dataset containing two classes:

- **Pothole**
- **Normal Road**

Images are resized to **224 × 224 pixels** and normalized before being passed to the CNN model.

---

# 🧠 Deep Learning Models

### CNN (TensorFlow/Keras)

The CNN model performs binary image classification:

- Pothole
- No Pothole

The trained model is stored as:

```
pothole_classifier.h5
```

---

### YOLOv8

YOLOv8 is used for object detection and localization of potholes within the uploaded image.

Model file:

```
yolov8n.pt
```

---

# 📊 System Workflow

1. User uploads an image or captures one using a webcam.
2. OpenCV preprocesses the image.
3. CNN classifies the image as pothole or non-pothole.
4. YOLOv8 detects and localizes potholes.
5. Results are displayed in the Streamlit interface.
6. Detection history is stored.
7. Statistical insights and LiDAR-style visualization are generated.
8. PDF reports can be downloaded.

---

# 📥 Installation

## Clone the Repository

```bash
git clone https://github.com/your-username/AI-Based-Pothole-Detection-System.git
cd AI-Based-Pothole-Detection-System
```

---

## Install Required Libraries

```bash
pip install streamlit
pip install tensorflow
pip install ultralytics
pip install opencv-python
pip install numpy
pip install pandas
pip install matplotlib
pip install plotly
pip install pillow
pip install fpdf
```

Or install all packages together:

```bash
pip install streamlit tensorflow ultralytics opencv-python numpy pandas matplotlib plotly pillow fpdf
```

---

# 📁 Project Structure

```
AI-Based-Pothole-Detection-System/
│
├── main.py
├── pothole_classifier.h5
├── yolov8n.pt
├── popcorn-truck.gif
├── README.md
├── requirements.txt
└── assets/
```

---

# ▶ Running the Application

Run the Streamlit application using:

```bash
streamlit run main.py
```

The application will automatically open in your default web browser.

---

# 📈 Output

The application provides:

- Pothole classification result
- Object detection output
- Detection history
- Statistical dashboard
- LiDAR-style 3D visualization
- Downloadable PDF reports

---

# 🚀 Future Enhancements

- GPS-based pothole location tracking
- Real-time video processing
- Mobile application integration
- Cloud deployment
- Automatic road maintenance alerts
- Multi-class road damage detection (cracks, patches, potholes)

---

# 🎓 Applications

- Smart City Infrastructure
- Road Condition Monitoring
- Municipal Road Maintenance
- Autonomous Vehicles
- Transportation Departments
- Highway Inspection Systems

---


# 📄 License

This project is developed for educational and research purposes.
