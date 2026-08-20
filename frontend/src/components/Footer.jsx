import React from 'react';

export default function Footer() {
  return (
    <footer 
      style={{
        backgroundColor: '#FFFFFF',
        borderTop: '1px solid #E2E8F0',
        padding: '24px 32px',
        color: '#64748B',
        fontSize: '0.85rem'
      }}
    >
      <div style={{ maxWidth: '1400px', margin: '0 auto', display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '16px' }}>
        <div>
          <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#0F172A' }}>Pothole Detection System</h4>
          <span style={{ fontSize: '0.8rem', color: '#64748B' }}>AI-Powered Road Damage Detection Platform</span>
        </div>

        <div style={{ textAlign: 'center' }}>
          <span style={{ fontWeight: 600, color: '#475569' }}>Technology Stack:</span>
          <p style={{ fontSize: '0.8rem', color: '#94A3B8', marginTop: '2px' }}>
            React • FastAPI • TensorFlow • YOLO • PostgreSQL
          </p>
        </div>

        <div style={{ textAlign: 'right' }}>
          <span style={{ fontWeight: 600, color: '#475569' }}>Engineering Team:</span>
          <p style={{ fontSize: '0.8rem', color: '#94A3B8', marginTop: '2px' }}>
            Shiva Palaksha SG • Sibiyenthal K • Ranjith LK
          </p>
        </div>
      </div>
    </footer>
  );
}
