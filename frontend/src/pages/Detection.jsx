import React, { useState } from 'react';
import ImageUploader from '../components/ImageUploader';
import CameraCapture from '../components/CameraCapture';
import DetectionResult from '../components/DetectionResult';
import LiDarVisualization from '../components/LiDarVisualization';
import LoadingSpinner from '../components/LoadingSpinner';
import { predictImage } from '../services/api';
import { Upload, Camera, Play, AlertCircle } from 'lucide-react';

export default function Detection() {
  const [activeTab, setActiveTab] = useState('upload'); // 'upload' or 'camera'
  const [selectedFile, setSelectedFile] = useState(null);
  const [detectionResult, setDetectionResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSelectFile = (file) => {
    setSelectedFile(file);
    setDetectionResult(null);
    setError(null);
  };

  const handleClear = () => {
    setSelectedFile(null);
    setDetectionResult(null);
    setError(null);
  };

  const handleAnalyze = async () => {
    if (!selectedFile) return;
    setLoading(true);
    setError(null);
    try {
      const res = await predictImage(selectedFile);
      setDetectionResult(res);
    } catch (err) {
      setError(err.response?.data?.detail || 'Image analysis failed. Please verify API backend connection.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div>
        <h1 style={{ fontSize: '1.6rem', fontWeight: 700, color: '#0F172A', marginBottom: '4px' }}>
          Pothole Detection Workspace
        </h1>
        <p style={{ color: '#64748B', fontSize: '0.9rem' }}>
          Provide a road image file or use your browser camera to perform deep learning CNN classification and YOLO scene bounding.
        </p>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '12px' }}>
        <button
          className={activeTab === 'upload' ? 'btn-primary' : 'btn-secondary'}
          onClick={() => { setActiveTab('upload'); handleClear(); }}
        >
          <Upload size={18} />
          <span>Upload Image File</span>
        </button>
        <button
          className={activeTab === 'camera' ? 'btn-primary' : 'btn-secondary'}
          onClick={() => { setActiveTab('camera'); handleClear(); }}
        >
          <Camera size={18} />
          <span>Use Browser Camera</span>
        </button>
      </div>

      {/* Input Section */}
      <div style={{ width: '100%' }}>
        {activeTab === 'upload' ? (
          <ImageUploader
            onSelectImage={handleSelectFile}
            selectedFile={selectedFile}
            onClear={handleClear}
            isLoading={loading}
          />
        ) : (
          <CameraCapture
            onCapture={handleSelectFile}
            onClear={handleClear}
            isLoading={loading}
          />
        )}
      </div>

      {/* Action Button */}
      {selectedFile && !detectionResult && !loading && (
        <div style={{ display: 'flex', justifyContent: 'center', marginTop: '8px' }}>
          <button className="btn-primary" onClick={handleAnalyze} style={{ padding: '12px 32px', fontSize: '1rem' }}>
            <Play size={18} />
            <span>Analyze Image</span>
          </button>
        </div>
      )}

      {/* Loading State */}
      {loading && <LoadingSpinner text="Analyzing image... Running AI inference..." />}

      {/* Error state */}
      {error && (
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          padding: '14px 18px',
          backgroundColor: '#FEE2E2',
          border: '1px solid rgba(239, 68, 68, 0.3)',
          borderRadius: '8px',
          color: '#991B1B',
          fontSize: '0.9rem'
        }}>
          <AlertCircle size={18} />
          <span>{error}</span>
        </div>
      )}

      {/* Detection Results */}
      {detectionResult && <DetectionResult result={detectionResult} />}

      {/* 3D LiDAR Visualization */}
      {selectedFile && detectionResult && <LiDarVisualization imageFile={selectedFile} />}
    </div>
  );
}
