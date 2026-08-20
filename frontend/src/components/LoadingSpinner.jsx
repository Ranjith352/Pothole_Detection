import React from 'react';
import { Loader2 } from 'lucide-react';

export default function LoadingSpinner({ text = 'Analyzing image with Deep Learning model...' }) {
  return (
    <div style={{
      padding: '40px',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '16px'
    }}>
      <Loader2 size={40} style={{ color: '#3B82F6' }} className="animate-spin" />
      <p style={{ color: '#94A3B8', fontSize: '0.95rem', fontWeight: 500 }}>{text}</p>
    </div>
  );
}
