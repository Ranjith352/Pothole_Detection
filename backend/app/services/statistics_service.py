import datetime
from sqlalchemy.orm import Session
from sqlalchemy import func
from app.database.models import DetectionDB

def get_statistics_data(db: Session) -> dict:
    total_images = db.query(DetectionDB).count()
    if total_images == 0:
        return {
            "total_images": 0,
            "potholes_detected": 0,
            "no_pothole": 0,
            "pothole_percentage": 0.0,
            "average_confidence": 0.0,
            "confidence_distribution": [],
            "trend": []
        }

    potholes_detected = db.query(DetectionDB).filter(DetectionDB.classification == "Pothole Detected").count()
    no_pothole = db.query(DetectionDB).filter(DetectionDB.classification == "No Pothole").count()

    pothole_percentage = round((potholes_detected / total_images) * 100, 2)
    
    avg_conf_res = db.query(func.avg(DetectionDB.confidence)).scalar()
    average_confidence = round(float(avg_conf_res), 4) if avg_conf_res else 0.0

    # Confidence distribution histogram buckets
    buckets = [
        {"range": "0.50 - 0.60", "count": 0},
        {"range": "0.60 - 0.70", "count": 0},
        {"range": "0.70 - 0.80", "count": 0},
        {"range": "0.80 - 0.90", "count": 0},
        {"range": "0.90 - 1.00", "count": 0},
    ]
    all_records = db.query(DetectionDB).all()
    for rec in all_records:
        conf = rec.confidence
        if 0.5 <= conf < 0.6:
            buckets[0]["count"] += 1
        elif 0.6 <= conf < 0.7:
            buckets[1]["count"] += 1
        elif 0.7 <= conf < 0.8:
            buckets[2]["count"] += 1
        elif 0.8 <= conf < 0.9:
            buckets[3]["count"] += 1
        elif 0.9 <= conf <= 1.0:
            buckets[4]["count"] += 1

    # Daily trend aggregations
    daily_counts = {}
    for rec in all_records:
        day_str = rec.timestamp.strftime("%Y-%m-%d")
        if day_str not in daily_counts:
            daily_counts[day_str] = {"date": day_str, "potholes": 0, "normal": 0, "total": 0}
        
        daily_counts[day_str]["total"] += 1
        if rec.classification == "Pothole Detected":
            daily_counts[day_str]["potholes"] += 1
        else:
            daily_counts[day_str]["normal"] += 1

    trend_list = [v for k, v in sorted(daily_counts.items())]

    return {
        "total_images": total_images,
        "potholes_detected": potholes_detected,
        "no_pothole": no_pothole,
        "pothole_percentage": pothole_percentage,
        "average_confidence": average_confidence,
        "confidence_distribution": buckets,
        "trend": trend_list
    }
