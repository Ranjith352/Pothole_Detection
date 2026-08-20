import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Scan, 
  BarChart3, 
  ShieldCheck, 
  ShieldAlert, 
  Clock, 
  Database, 
  Maximize2, 
  Layers, 
  Cpu, 
  Code2, 
  Server, 
  ArrowRight,
  CheckCircle2
} from 'lucide-react';
import { getStatistics } from '../services/api';

export default function Home() {
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await getStatistics();
        setStats(res);
      } catch (err) {
        console.error('Failed to load home page statistics:', err);
      }
    };
    fetchStats();
  }, []);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '48px' }}>
      
      {/* 1. HERO SECTION */}
      <div className="ui-card" style={{
        padding: '48px 40px',
        backgroundColor: '#FFFFFF',
        position: 'relative',
        overflow: 'hidden',
        borderLeft: '4px solid #2563EB'
      }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '36px', alignItems: 'center' }}>
          
          {/* Left Text */}
          <div>
            <div className="badge badge-info" style={{ marginBottom: '16px' }}>
              <Cpu size={14} />
              <span>AI Road Safety Platform</span>
            </div>

            <h1 style={{ fontSize: '2.4rem', fontWeight: 800, color: '#0F172A', lineHeight: 1.15, marginBottom: '16px' }}>
              Pothole Detection System
            </h1>

            <h2 style={{ fontSize: '1.15rem', fontWeight: 600, color: '#2563EB', marginBottom: '12px' }}>
              AI-powered road damage detection using deep learning and computer vision.
            </h2>

            <p style={{ fontSize: '0.95rem', color: '#64748B', lineHeight: 1.6, marginBottom: '28px' }}>
              Upload a road image or capture one using your camera to identify potential potholes, analyze detection confidence, and visualize results.
            </p>

            <div style={{ display: 'flex', gap: '14px', flexWrap: 'wrap' }}>
              <button className="btn-primary" onClick={() => navigate('/detection')} style={{ padding: '12px 24px' }}>
                <Scan size={18} />
                <span>Start Detection</span>
              </button>
              <button className="btn-secondary" onClick={() => navigate('/statistics')} style={{ padding: '12px 24px' }}>
                <BarChart3 size={18} />
                <span>Explore Analytics</span>
              </button>
            </div>
          </div>

          {/* Right Visual Element (AI Detection Illustrative Visual) */}
          <div style={{
            backgroundColor: '#0F172A',
            borderRadius: '12px',
            padding: '16px',
            boxShadow: '0 12px 30px rgba(0,0,0,0.15)',
            border: '1px solid #1E293B',
            position: 'relative'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px', padding: '0 4px' }}>
              <span style={{ fontSize: '0.78rem', color: '#94A3B8', fontWeight: 600 }}>AI Vision Stream Inspection</span>
              <span className="badge badge-danger" style={{ fontSize: '0.72rem' }}>Pothole Detected</span>
            </div>

            {/* Illustrative Detection Frame */}
            <div style={{
              position: 'relative',
              borderRadius: '8px',
              overflow: 'hidden',
              height: '240px',
              backgroundColor: '#1E293B',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <img 
                src="/Potholes.webp" 
                alt="Road Pothole Sample" 
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />

              {/* Bounding Box Bounding Frame Overlay */}
              <div style={{
                position: 'absolute',
                top: '30%',
                left: '25%',
                width: '45%',
                height: '40%',
                border: '2px dashed #EF4444',
                backgroundColor: 'rgba(239, 68, 68, 0.15)',
                borderRadius: '6px',
                display: 'flex',
                alignItems: 'flex-start',
                justifyContent: 'flex-start',
                padding: '4px 8px'
              }}>
                <span style={{ backgroundColor: '#EF4444', color: 'white', fontSize: '0.7rem', fontWeight: 700, borderRadius: '4px', padding: '2px 6px' }}>
                  Pothole: 94.2%
                </span>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '12px', fontSize: '0.78rem', color: '#94A3B8' }}>
              <span>Model: CNN Classifier</span>
              <span>Input: 224x224 RGB</span>
            </div>
          </div>

        </div>
      </div>

      {/* 2. ABOUT THE PROJECT SECTION */}
      <div>
        <h2 style={{ fontSize: '1.35rem', fontWeight: 700, color: '#0F172A', marginBottom: '12px' }}>
          About the Project
        </h2>
        <div className="ui-card" style={{ padding: '28px' }}>
          <p style={{ fontSize: '0.95rem', color: '#475569', lineHeight: 1.7, marginBottom: '16px' }}>
            The <strong>Pothole Detection System</strong> is a deep learning-based computer vision application designed to assist in identifying potholes from road images.
          </p>
          <p style={{ fontSize: '0.95rem', color: '#475569', lineHeight: 1.7, marginBottom: '16px' }}>
            The system processes an uploaded or captured image and uses trained machine learning/deep learning models to determine whether pothole damage is present.
          </p>
          <p style={{ fontSize: '0.95rem', color: '#475569', lineHeight: 1.7 }}>
            The objective is to support faster road-condition assessment and provide a foundation for automated road maintenance monitoring.
          </p>
        </div>
      </div>

      {/* 3. WHY POTHOLE DETECTION MATTERS */}
      <div>
        <h2 style={{ fontSize: '1.35rem', fontWeight: 700, color: '#0F172A', marginBottom: '16px' }}>
          Why Pothole Detection?
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '20px' }}>
          
          <div className="ui-card" style={{ padding: '24px' }}>
            <div style={{ width: '42px', height: '42px', borderRadius: '8px', backgroundColor: '#FEE2E2', color: '#EF4444', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px' }}>
              <ShieldAlert size={22} />
            </div>
            <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#0F172A', marginBottom: '8px' }}>
              Road Safety
            </h3>
            <p style={{ fontSize: '0.88rem', color: '#64748B', lineHeight: 1.5 }}>
              Potholes can create severe hazards for drivers, cyclists, and pedestrians.
            </p>
          </div>

          <div className="ui-card" style={{ padding: '24px' }}>
            <div style={{ width: '42px', height: '42px', borderRadius: '8px', backgroundColor: '#EFF6FF', color: '#2563EB', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px' }}>
              <Clock size={22} />
            </div>
            <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#0F172A', marginBottom: '8px' }}>
              Faster Inspection
            </h3>
            <p style={{ fontSize: '0.88rem', color: '#64748B', lineHeight: 1.5 }}>
              Automated image analysis can reduce the effort required for manual road inspection.
            </p>
          </div>

          <div className="ui-card" style={{ padding: '24px' }}>
            <div style={{ width: '42px', height: '42px', borderRadius: '8px', backgroundColor: '#FEF3C7', color: '#F59E0B', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px' }}>
              <Database size={22} />
            </div>
            <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#0F172A', marginBottom: '8px' }}>
              Data-Driven Maintenance
            </h3>
            <p style={{ fontSize: '0.88rem', color: '#64748B', lineHeight: 1.5 }}>
              Detection results can help organize road-condition information for further analysis.
            </p>
          </div>

          <div className="ui-card" style={{ padding: '24px' }}>
            <div style={{ width: '42px', height: '42px', borderRadius: '8px', backgroundColor: '#D1FAE5', color: '#10B981', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px' }}>
              <Maximize2 size={22} />
            </div>
            <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#0F172A', marginBottom: '8px' }}>
              Scalable Monitoring
            </h3>
            <p style={{ fontSize: '0.88rem', color: '#64748B', lineHeight: 1.5 }}>
              Computer vision can provide a foundation for monitoring road conditions across larger areas.
            </p>
          </div>

        </div>
      </div>

      {/* 4. HOW THE SYSTEM WORKS */}
      <div>
        <h2 style={{ fontSize: '1.35rem', fontWeight: 700, color: '#0F172A', marginBottom: '16px' }}>
          How It Works
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px' }}>
          
          <div className="ui-card" style={{ padding: '20px', borderTop: '3px solid #2563EB' }}>
            <span style={{ fontSize: '0.78rem', fontWeight: 700, color: '#2563EB' }}>STEP 01</span>
            <h4 style={{ fontSize: '0.98rem', fontWeight: 700, color: '#0F172A', margin: '4px 0 8px 0' }}>Upload or Capture</h4>
            <p style={{ fontSize: '0.82rem', color: '#64748B', lineHeight: 1.5 }}>Provide a road image using upload or camera capture.</p>
          </div>

          <div className="ui-card" style={{ padding: '20px', borderTop: '3px solid #2563EB' }}>
            <span style={{ fontSize: '0.78rem', fontWeight: 700, color: '#2563EB' }}>STEP 02</span>
            <h4 style={{ fontSize: '0.98rem', fontWeight: 700, color: '#0F172A', margin: '4px 0 8px 0' }}>Image Preprocessing</h4>
            <p style={{ fontSize: '0.82rem', color: '#64748B', lineHeight: 1.5 }}>The image is resized and preprocessed according to trained model requirements.</p>
          </div>

          <div className="ui-card" style={{ padding: '20px', borderTop: '3px solid #2563EB' }}>
            <span style={{ fontSize: '0.78rem', fontWeight: 700, color: '#2563EB' }}>STEP 03</span>
            <h4 style={{ fontSize: '0.98rem', fontWeight: 700, color: '#0F172A', margin: '4px 0 8px 0' }}>AI Analysis</h4>
            <p style={{ fontSize: '0.82rem', color: '#64748B', lineHeight: 1.5 }}>The backend performs deep learning inference using available CNN/YOLO models.</p>
          </div>

          <div className="ui-card" style={{ padding: '20px', borderTop: '3px solid #2563EB' }}>
            <span style={{ fontSize: '0.78rem', fontWeight: 700, color: '#2563EB' }}>STEP 04</span>
            <h4 style={{ fontSize: '0.98rem', fontWeight: 700, color: '#0F172A', margin: '4px 0 8px 0' }}>Results & Output</h4>
            <p style={{ fontSize: '0.82rem', color: '#64748B', lineHeight: 1.5 }}>The system presents the classification, confidence, detections, and visual results.</p>
          </div>

        </div>
      </div>

      {/* 5. TECHNOLOGY STACK SECTION */}
      <div>
        <h2 style={{ fontSize: '1.35rem', fontWeight: 700, color: '#0F172A', marginBottom: '16px' }}>
          Technology Stack
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '20px' }}>
          
          <div className="ui-card" style={{ padding: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#2563EB', fontWeight: 700, marginBottom: '12px' }}>
              <Code2 size={20} />
              <span>Frontend</span>
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
              <span className="badge badge-info">React</span>
              <span className="badge badge-info">Vite</span>
              <span className="badge badge-info">Axios</span>
              <span className="badge badge-info">Recharts</span>
              <span className="badge badge-info">Plotly.js</span>
            </div>
          </div>

          <div className="ui-card" style={{ padding: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#10B981', fontWeight: 700, marginBottom: '12px' }}>
              <Server size={20} />
              <span>Backend</span>
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
              <span className="badge badge-success">FastAPI</span>
              <span className="badge badge-success">Python</span>
              <span className="badge badge-success">REST API</span>
              <span className="badge badge-success">Uvicorn</span>
            </div>
          </div>

          <div className="ui-card" style={{ padding: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#8B5CF6', fontWeight: 700, marginBottom: '12px' }}>
              <Cpu size={20} />
              <span>AI / Computer Vision</span>
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
              <span className="badge" style={{ backgroundColor: '#F3E8FF', color: '#8B5CF6' }}>TensorFlow</span>
              <span className="badge" style={{ backgroundColor: '#F3E8FF', color: '#8B5CF6' }}>Keras</span>
              <span className="badge" style={{ backgroundColor: '#F3E8FF', color: '#8B5CF6' }}>Ultralytics YOLO</span>
              <span className="badge" style={{ backgroundColor: '#F3E8FF', color: '#8B5CF6' }}>OpenCV</span>
            </div>
          </div>

          <div className="ui-card" style={{ padding: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#F59E0B', fontWeight: 700, marginBottom: '12px' }}>
              <Database size={20} />
              <span>Database</span>
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
              <span className="badge badge-warning">PostgreSQL</span>
              <span className="badge badge-warning">SQLAlchemy</span>
            </div>
          </div>

        </div>
      </div>

      {/* 6. AI MODELS SPECIFICATIONS */}
      <div>
        <h2 style={{ fontSize: '1.35rem', fontWeight: 700, color: '#0F172A', marginBottom: '16px' }}>
          AI Models Specifications
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px' }}>
          
          <div className="ui-card" style={{ padding: '24px' }}>
            <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#0F172A', marginBottom: '12px' }}>
              CNN Classifier (Pothole Classification)
            </h3>
            <p style={{ fontSize: '0.88rem', color: '#64748B', lineHeight: 1.5, marginBottom: '16px' }}>
              Custom trained Convolutional Neural Network used for binary pothole presence decision.
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', fontSize: '0.85rem' }}>
              <div style={{ backgroundColor: '#F8FAFC', padding: '10px', borderRadius: '6px' }}>
                <span style={{ color: '#64748B', display: 'block' }}>Model Type</span>
                <strong style={{ color: '#0F172A' }}>Sequential CNN</strong>
              </div>
              <div style={{ backgroundColor: '#F8FAFC', padding: '10px', borderRadius: '6px' }}>
                <span style={{ color: '#64748B', display: 'block' }}>Input Size</span>
                <strong style={{ color: '#0F172A' }}>224 x 224 x 3</strong>
              </div>
              <div style={{ backgroundColor: '#F8FAFC', padding: '10px', borderRadius: '6px' }}>
                <span style={{ color: '#64748B', display: 'block' }}>Classification</span>
                <strong style={{ color: '#0F172A' }}>Binary (Sigmoid)</strong>
              </div>
              <div style={{ backgroundColor: '#F8FAFC', padding: '10px', borderRadius: '6px' }}>
                <span style={{ color: '#64748B', display: 'block' }}>Decision Threshold</span>
                <strong style={{ color: '#0F172A' }}>Score &ge; 0.5</strong>
              </div>
            </div>
          </div>

          <div className="ui-card" style={{ padding: '24px' }}>
            <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#0F172A', marginBottom: '12px' }}>
              YOLOv8 Object Detection (Road Scene Objects)
            </h3>
            <p style={{ fontSize: '0.88rem', color: '#64748B', lineHeight: 1.5, marginBottom: '16px' }}>
              Pretrained COCO YOLOv8 model used for identifying secondary entities in the road scene frame.
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', fontSize: '0.85rem' }}>
              <div style={{ backgroundColor: '#F8FAFC', padding: '10px', borderRadius: '6px' }}>
                <span style={{ color: '#64748B', display: 'block' }}>Model Type</span>
                <strong style={{ color: '#0F172A' }}>YOLOv8 Nano</strong>
              </div>
              <div style={{ backgroundColor: '#F8FAFC', padding: '10px', borderRadius: '6px' }}>
                <span style={{ color: '#64748B', display: 'block' }}>Target Classes</span>
                <strong style={{ color: '#0F172A' }}>COCO Objects (80)</strong>
              </div>
              <div style={{ backgroundColor: '#F8FAFC', padding: '10px', borderRadius: '6px' }}>
                <span style={{ color: '#64748B', display: 'block' }}>Task</span>
                <strong style={{ color: '#0F172A' }}>Bounding Box Detection</strong>
              </div>
              <div style={{ backgroundColor: '#F8FAFC', padding: '10px', borderRadius: '6px' }}>
                <span style={{ color: '#64748B', display: 'block' }}>Role</span>
                <strong style={{ color: '#0F172A' }}>Scene Context Extraction</strong>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* 7. DYNAMIC CALL TO ACTION & SYSTEM METRICS */}
      <div className="ui-card" style={{
        padding: '36px',
        backgroundColor: '#0F172A',
        color: '#F8FAFC',
        textAlign: 'center'
      }}>
        <h2 style={{ fontSize: '1.6rem', fontWeight: 800, marginBottom: '10px' }}>
          Ready to analyze a road image?
        </h2>
        <p style={{ fontSize: '0.95rem', color: '#94A3B8', maxWidth: '600px', margin: '0 auto 24px auto', lineHeight: 1.6 }}>
          Run AI model inference on your road surface photo to classify pothole damage, extract confidence metrics, and visualize LiDAR-style surface depth plots.
        </p>

        {stats && (
          <div style={{ display: 'flex', justifyContent: 'center', gap: '32px', marginBottom: '28px', fontSize: '0.9rem', color: '#CBD5E1' }}>
            <div><strong style={{ color: '#FFFFFF', fontSize: '1.2rem' }}>{stats.total_images}</strong> Total Scans</div>
            <div><strong style={{ color: '#EF4444', fontSize: '1.2rem' }}>{stats.potholes_detected}</strong> Potholes</div>
            <div><strong style={{ color: '#10B981', fontSize: '1.2rem' }}>{stats.no_pothole}</strong> Clear Roads</div>
          </div>
        )}

        <button className="btn-primary" onClick={() => navigate('/detection')} style={{ padding: '14px 32px', fontSize: '1rem', margin: '0 auto' }}>
          <Scan size={20} />
          <span>Start Detection Workspace</span>
        </button>
      </div>

    </div>
  );
}
