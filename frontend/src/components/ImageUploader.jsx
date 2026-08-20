import React, { useState, useRef } from 'react';
import { UploadCloud, Image as ImageIcon, X, AlertCircle } from 'lucide-react';

export default function ImageUploader({ onSelectImage, selectedFile, onClear, isLoading }) {
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState(null);
  const fileInputRef = useRef(null);

  const handleFileChange = (file) => {
    setError(null);
    if (!file) return;

    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      setError('Invalid file format. Please upload a JPG, JPEG, PNG, or WEBP image.');
      return;
    }

    if (file.size > 15 * 1024 * 1024) {
      setError('File size exceeds maximum limit of 15MB.');
      return;
    }

    onSelectImage(file);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileChange(e.dataTransfer.files[0]);
    }
  };

  const previewUrl = selectedFile ? URL.createObjectURL(selectedFile) : null;

  return (
    <div style={{ width: '100%' }}>
      {error && (
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          padding: '12px 16px',
          backgroundColor: '#FEE2E2',
          border: '1px solid rgba(239, 68, 68, 0.3)',
          borderRadius: '8px',
          color: '#991B1B',
          marginBottom: '16px',
          fontSize: '0.88rem'
        }}>
          <AlertCircle size={18} />
          <span>{error}</span>
        </div>
      )}

      {!selectedFile ? (
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          style={{
            border: `2px dashed ${isDragging ? '#2563EB' : '#CBD5E1'}`,
            borderRadius: '12px',
            padding: '48px 24px',
            textAlign: 'center',
            backgroundColor: isDragging ? '#EFF6FF' : '#FFFFFF',
            cursor: 'pointer',
            transition: 'all 0.2s ease'
          }}
        >
          <input
            type="file"
            ref={fileInputRef}
            onChange={(e) => e.target.files && handleFileChange(e.target.files[0])}
            accept="image/jpeg,image/png,image/jpg,image/webp"
            style={{ display: 'none' }}
          />
          <div style={{
            width: '56px',
            height: '56px',
            borderRadius: '50%',
            backgroundColor: '#EFF6FF',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 16px auto',
            color: '#2563EB'
          }}>
            <UploadCloud size={28} />
          </div>
          <h3 style={{ fontSize: '1.05rem', fontWeight: 600, color: '#0F172A', marginBottom: '4px' }}>
            Click or drag & drop road image here
          </h3>
          <p style={{ fontSize: '0.82rem', color: '#64748B' }}>
            Supports JPG, JPEG, PNG, WEBP (Max 15MB)
          </p>
        </div>
      ) : (
        <div className="ui-card" style={{ padding: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <ImageIcon size={20} style={{ color: '#2563EB' }} />
              <div>
                <h4 style={{ fontSize: '0.92rem', fontWeight: 600, color: '#0F172A' }}>{selectedFile.name}</h4>
                <span style={{ fontSize: '0.78rem', color: '#64748B' }}>
                  {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB
                </span>
              </div>
            </div>
            {!isLoading && (
              <button
                onClick={onClear}
                className="btn-secondary"
                style={{ padding: '6px 12px', fontSize: '0.82rem', color: '#EF4444' }}
              >
                <X size={14} />
                <span>Remove</span>
              </button>
            )}
          </div>

          <div style={{
            maxHeight: '360px',
            overflow: 'hidden',
            borderRadius: '8px',
            backgroundColor: '#0F172A',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center'
          }}>
            <img
              src={previewUrl}
              alt="Preview"
              style={{ maxWidth: '100%', maxHeight: '360px', objectFit: 'contain' }}
            />
          </div>
        </div>
      )}
    </div>
  );
}
