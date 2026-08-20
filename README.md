# Pothole Detection & AI Road Diagnostics Platform

An enterprise-grade Deep Learning web platform for detecting road hazards and potholes using a **React frontend** and **FastAPI backend** architecture with **PostgreSQL database persistence**, **CNN binary classification**, **Ultralytics YOLOv8 object detection**, and **3D LiDAR-style surface mesh rendering**.

---

## Architecture Overview

```
React Frontend (Vite, React Router, Lucide Icons, Recharts, Plotly.js)
       │
       ▼ REST API / HTTP
FastAPI Backend (Port 8000)
       ├── CNN Binary Classifier (pothole_classifier.keras / .h5)
       ├── Ultralytics YOLOv8 (yolov8n.pt road scene object bounding)
       ├── OpenCV & NumPy 3D Surface Matrix Generator
       ├── FPDF2 PDF Report Generator
       └── SQLAlchemy ORM -> PostgreSQL (with automatic SQLite fallback)
```

---

## Directory Structure

```
Pothole_Detection/
├── backend/
│   ├── app/
│   │   ├── config/settings.py
│   │   ├── database/ (database.py, models.py, schemas.py)
│   │   ├── models/ (cnn_model.py, yolo_model.py)
│   │   ├── services/ (detection_service.py, image_service.py, statistics_service.py, report_service.py)
│   │   ├── routers/ (detection.py, history.py, statistics.py, reports.py, feedback.py, complaint.py)
│   │   └── main.py
│   ├── requirements.txt
│   └── .env
│
├── frontend/
│   ├── src/
│   │   ├── components/ (Layout, Sidebar, Navbar, StatCard, ImageUploader, CameraCapture, DetectionResult, LiDarVisualization, DetectionHistoryTable, LoadingSpinner)
│   │   ├── pages/ (Home, Detection, History, Statistics, Reports, Complaint, Feedback, About)
│   │   ├── services/api.js
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── package.json
│   ├── vite.config.js
│   └── .env
│
├── legacy/ (Contains original main.py Streamlit script for reference)
├── uploads/ (Processed detection image artifacts)
├── generated_reports/ (Generated PDF report downloads)
├── pothole_classifier.keras (Centralized trained CNN model)
├── pothole_classifier.h5 (Model fallback weights)
└── yolov8n.pt (YOLO object detection model)
```

---

## Running the Application

### 1. Backend Service (FastAPI)
```bash
# Navigate to backend directory
cd backend

# Install Python dependencies
pip install -r requirements.txt

# Start FastAPI server
uvicorn app.main:app --reload --port 8000
```
- **API Base URL**: `http://localhost:8000`
- **Interactive Swagger Docs**: `http://localhost:8000/docs`
- **ReDoc API Documentation**: `http://localhost:8000/redoc`

### 2. Frontend Application (React + Vite)
```bash
# Navigate to frontend directory
cd frontend

# Install Node dependencies
npm install

# Start Vite development server
npm run dev
```
- **Frontend App URL**: `http://localhost:5173`

---

## Key Features & Pages

1. **Home**: Dashboard hero banner, quick action links, feature highlights.
2. **Pothole Detection**: Drag & drop image upload or browser webcam stream capture. CNN classification, confidence score, YOLO scene bounding, and LiDAR 3D surface plot.
3. **Detection History**: Paginated log of historical road scans with search filter, date range, and full image view modal.
4. **Statistics & Insights**: Aggregated scan counts, pothole percentage, average confidence, distribution pie chart, confidence bar chart, and activity trend timeline (Recharts).
5. **Report Generation**: Instant PDF report compilation with FPDF2 and download link.
6. **Complaint Report**: Guidance on reporting hazardous potholes with official link to Tamil Nadu Road Safety Authority (TNRSA).
7. **Feedback & Improvement**: Submission form for False Positives, False Negatives, and General Suggestions stored in database.
8. **About & Team**: Overview of CNN & YOLO architectures, project details, and development team cards (**Shiva Palaksha SG**, **Sibiyenthal K**, **Ranjith LK**).

---

## API Endpoints

- `GET /api/health`: Health status check
- `POST /api/detection/predict`: Multipart image upload for CNN & YOLO detection
- `POST /api/detection/3d`: Returns 3D surface grid matrix for Plotly rendering
- `GET /api/history`: Searchable paginated detection history logs
- `GET /api/statistics`: Aggregated metrics and histogram buckets
- `GET /api/reports/generate`: Generates and downloads summary PDF report
- `POST /api/feedback`: Submit model/system feedback
- `GET /api/complaint/info`: Official road hazard complaint instructions & links
