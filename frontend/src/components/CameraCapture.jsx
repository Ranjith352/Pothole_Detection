import React, { useState, useRef, useEffect } from 'react';
import { Camera, RefreshCw, CheckCircle2, AlertTriangle, StopCircle } from 'lucide-react';

export default function CameraCapture({ onCapture, onClear, isLoading }) {
  const [streamActive, setStreamActive] = useState(false);
  const [capturedFile, setCapturedFile] = useState(null);
  const [capturedPreview, setCapturedPreview] = useState(null);
  const [error, setError] = useState(null);

  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const mediaStreamRef = useRef(null);

  const startCamera = async () => {
    setError(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: { ideal: 1280 }, height: { ideal: 720 }, facingMode: 'environment' }
      });
      mediaStreamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      setStreamActive(true);
    } catch (err) {
      setError('Could not access camera. Please allow camera permissions in your browser.');
    }
  };

  const stopCamera = () => {
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach(track => track.stop());
      mediaStreamRef.current = null;
    }
    setStreamActive(false);
  };

  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []);

  const captureFrame = () => {
    if (!videoRef.current || !canvasRef.current) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    canvas.width = video.videoWidth || 640;
    canvas.height = video.videoHeight || 480;

    const ctx = canvas.getContext('2d');
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    canvas.toBlob((blob) => {
      if (blob) {
        const file = new File([blob], `webcam_capture_${Date.now()}.jpg`, { type: 'image/jpeg' });
        setCapturedFile(file);
        setCapturedPreview(URL.createObjectURL(blob));
        onCapture(file);
        stopCamera();
      }
    }, 'image/jpeg', 0.95);
  };

  const retakePhoto = () => {
    setCapturedFile(null);
    setCapturedPreview(null);
    onClear();
    startCamera();
  };

  return (
    <div className="glass-panel" style={{ padding: '24px', width: '100%' }}>
      {error && (
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          padding: '12px',
          backgroundColor: 'rgba(244, 63, 94, 0.1)',
          border: '1px solid rgba(244, 63, 94, 0.3)',
          borderRadius: '8px',
          color: '#F43F5E',
          marginBottom: '16px'
        }}>
          <AlertTriangle size={18} />
          <span>{error}</span>
        </div>
      )}

      <canvas ref={canvasRef} style={{ display: 'none' }} />

      {!capturedPreview ? (
        <div style={{ textAlign: 'center' }}>
          {!streamActive ? (
            <div style={{ padding: '40px 20px' }}>
              <div style={{
                width: '64px',
                height: '64px',
                borderRadius: '50%',
                backgroundColor: 'rgba(59, 130, 246, 0.1)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 16px auto',
                color: '#3B82F6'
              }}>
                <Camera size={32} />
              </div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 600, color: '#F8FAFC', marginBottom: '8px' }}>
                Use Device Camera
              </h3>
              <p style={{ fontSize: '0.85rem', color: '#94A3B8', marginBottom: '20px' }}>
                Capture live road photos directly from your browser
              </p>
              <button className="glass-button" onClick={startCamera}>
                <Camera size={18} />
                <span>Start Camera Feed</span>
              </button>
            </div>
          ) : (
            <div>
              <div style={{
                position: 'relative',
                borderRadius: '12px',
                overflow: 'hidden',
                backgroundColor: '#000',
                maxHeight: '400px',
                display: 'flex',
                justifyContent: 'center'
              }}>
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted
                  style={{ width: '100%', maxHeight: '400px', objectFit: 'contain' }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'center', gap: '16px', marginTop: '16px' }}>
                <button className="glass-button" onClick={captureFrame} disabled={isLoading}>
                  <CheckCircle2 size={18} />
                  <span>Capture Photo</span>
                </button>
                <button className="glass-button glass-button-secondary" onClick={stopCamera}>
                  <StopCircle size={18} />
                  <span>Stop Feed</span>
                </button>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div>
          <div style={{
            borderRadius: '12px',
            overflow: 'hidden',
            backgroundColor: '#000',
            maxHeight: '400px',
            display: 'flex',
            justifyContent: 'center',
            marginBottom: '16px'
          }}>
            <img src={capturedPreview} alt="Captured frame" style={{ maxWidth: '100%', maxHeight: '400px', objectFit: 'contain' }} />
          </div>

          <div style={{ display: 'flex', justifyContent: 'center', gap: '16px' }}>
            {!isLoading && (
              <button className="glass-button glass-button-secondary" onClick={retakePhoto}>
                <RefreshCw size={18} />
                <span>Retake Photo</span>
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
