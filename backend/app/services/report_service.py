import datetime
from pathlib import Path
from fpdf import FPDF
from sqlalchemy.orm import Session
from app.database.models import DetectionDB
from app.config.settings import settings

def generate_pdf_report(db: Session) -> Path:
    settings.REPORT_DIR.mkdir(parents=True, exist_ok=True)
    timestamp = datetime.datetime.now().strftime("%Y%m%d_%H%M%S")
    report_filename = f"pothole_report_{timestamp}.pdf"
    report_file = settings.REPORT_DIR / report_filename

    detections = db.query(DetectionDB).order_by(DetectionDB.timestamp.desc()).all()

    pdf = FPDF()
    pdf.set_auto_page_break(auto=True, margin=15)
    pdf.add_page()

    # Header
    pdf.set_font("Helvetica", "B", 18)
    pdf.cell(0, 10, "Pothole Detection Summary Report", ln=True, align="C")
    pdf.set_font("Helvetica", "I", 10)
    pdf.cell(0, 8, f"Generated on: {datetime.datetime.now().strftime('%Y-%m-%d %H:%M:%S')}", ln=True, align="C")
    pdf.ln(10)

    # Overview Stats
    total = len(detections)
    potholes = sum(1 for d in detections if d.classification == "Pothole Detected")
    normal = total - potholes

    pdf.set_font("Helvetica", "B", 12)
    pdf.cell(0, 8, "Summary Statistics:", ln=True)
    pdf.set_font("Helvetica", size=10)
    pdf.cell(0, 6, f"Total Analyzed Images: {total}", ln=True)
    pdf.cell(0, 6, f"Potholes Detected: {potholes}", ln=True)
    pdf.cell(0, 6, f"Normal / Clear Road: {normal}", ln=True)
    pdf.ln(10)

    # Table Header
    pdf.set_font("Helvetica", "B", 10)
    pdf.set_fill_color(230, 230, 230)
    pdf.cell(20, 8, "ID", border=1, fill=True)
    pdf.cell(45, 8, "Date/Time", border=1, fill=True)
    pdf.cell(45, 8, "Classification", border=1, fill=True)
    pdf.cell(35, 8, "Confidence", border=1, fill=True)
    pdf.cell(45, 8, "Objects Detected", border=1, fill=True)
    pdf.ln()

    # Table Data
    pdf.set_font("Helvetica", size=9)
    for d in detections:
        pdf.cell(20, 8, str(d.id), border=1)
        pdf.cell(45, 8, d.timestamp.strftime("%Y-%m-%d %H:%M"), border=1)
        pdf.cell(45, 8, str(d.classification), border=1)
        pdf.cell(35, 8, f"{d.confidence * 100:.1f}%", border=1)
        pdf.cell(45, 8, str(d.yolo_detection_count), border=1)
        pdf.ln()

    pdf.output(str(report_file))
    return report_file
