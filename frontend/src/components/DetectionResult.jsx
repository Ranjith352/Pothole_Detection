import React, { useState } from 'react';
import { AlertTriangle, CheckCircle2, Cpu, Box, Clock, Layers } from 'lucide-react';
import { getFullImageUrl } from '../services/api';

export default function DetectionResult({ result }) {
  const [showAnnotated, setShowAnnotated] = useState(true);

  if (!result) return null;

  const { classification, yolo, image_url, annotated_image_url, timestamp } = result;
  const isPothole = classification.label === 'Pothole Detected';
  const confidencePct = (classification.confidence * 100).toFixed(1);

  const displayImage = (showAnnotated && annotated_image_url) 
    ? getFullImageUrl(annotated_image_url)
    : getFullImageUrl(image_url);

  return (
    <div className="ui-card" style={{ padding: '24px', width: '100%', marginTop: '24px' }}>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <div>
          <span style={{ fontSize: '0.78rem', color: '#64748B', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Model Inference Decision
          </span>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginTop: '6px' }}>
            <span className={isPothole ? 'badge badge-danger' : 'badge badge-success'} style={{ fontSize: '1rem', padding: '6px 14px' }}>
              {isPothole ? <AlertTriangle size={18} /> : <CheckCircle2 size={18} />}
              {classification.label}
            </span>
            <span style={{ fontSize: '1.05rem', fontWeight: 700, color: '#0F172A' }}>
              Confidence: {confidencePct}%
            </span>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '16px', fontSize: '0.82rem', color: '#64748B' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Cpu size={15} style={{ color: '#2563EB' }} />
            <span>Model: <strong>CNN Classifier</strong></span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Clock size={15} />
            <span>{timestamp}</span>
          </div>
        </div>
      </div>

      {/* Confidence Bar */}
      <div style={{ marginBottom: '24px', backgroundColor: '#F8FAFC', padding: '12px 16px', borderRadius: '8px', border: '1px solid #E2E8F0' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', color: '#475569', fontWeight: 500, marginBottom: '6px' }}>
          <span>Confidence Score</span>
          <span>{confidencePct}%</span>
        </div>
        <div style={{ height: '8px', backgroundColor: '#E2E8F0', borderRadius: '4px', overflow: 'hidden' }}>
          <div 
            style={{ 
              height: '100%', 
              width: `${confidencePct}%`, 
              backgroundColor: isPothole ? '#EF4444' : '#10B981',
              borderRadius: '4px',
              transition: 'width 0.6s ease'
            }} 
          />
        </div>
      </div>

      {/* Image Preview with Toggle */}
      <div style={{ marginBottom: '24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
          <span style={{ fontSize: '0.9rem', fontWeight: 600, color: '#0F172A' }}>
            Visual Detection Output
          </span>
          {annotated_image_url && (
            <button
              className="btn-secondary"
              onClick={() => setShowAnnotated(!showAnnotated)}
              style={{ fontSize: '0.8rem', padding: '4px 10px' }}
            >
              <Layers size={14} />
              <span>{showAnnotated ? 'View Original Image' : 'View YOLO Bounding Boxes'}</span>
            </button>
          )}
        </div>

        <div style={{
          borderRadius: '8px',
          overflow: 'hidden',
          backgroundColor: '#0F172A',
          maxHeight: '450px',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          border: '1px solid #E2E8F0'
        }}>
          <img 
            src={displayImage} 
            alt="Detection Result" 
            style={{ maxWidth: '100%', maxHeight: '450px', objectFit: 'contain' }}
          />
        </div>
      </div>

      {/* YOLO Object Detections Panel */}
      <div style={{ 
        padding: '16px', 
        backgroundColor: '#F8FAFC', 
        borderRadius: '8px', 
        border: '1px solid #E2E8F0' 
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
          <Box size={18} style={{ color: '#06B6D4' }} />
          <h4 style={{ fontSize: '0.9rem', fontWeight: 600, color: '#0F172A' }}>
            YOLOv8 Road Scene Objects ({yolo.detections ? yolo.detections.length : 0} detected)
          </h4>
        </div>

        {yolo.detections && yolo.detections.length > 0 ? (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
            {yolo.detections.map((det, idx) => (
              <span 
                key={idx} 
                style={{
                  backgroundColor: '#FFFFFF',
                  border: '1px solid #CBD5E1',
                  color: '#0F172A',
                  padding: '4px 10px',
                  borderRadius: '6px',
                  fontSize: '0.8rem',
                  fontWeight: 500
                }}
              >
                {det.class_name} ({(det.confidence * 100).toFixed(0)}%)
              </span>
            ))}
          </div>
        ) : (
          <p style={{ fontSize: '0.82rem', color: '#64748B' }}>
            No generic road scene objects detected by YOLOv8 in this image frame.
          </p>
        )}
      </div>
    </div>
  );
}
