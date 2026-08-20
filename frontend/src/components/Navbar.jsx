import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Menu, Activity, ShieldCheck } from 'lucide-react';
import { checkHealth } from '../services/api';

const routeTitles = {
  '/': { title: 'Dashboard & Overview', desc: 'AI-Powered Road Damage Detection Platform' },
  '/detection': { title: 'Pothole Detection Workspace', desc: 'Real-time CNN classification and YOLO object scene detection' },
  '/history': { title: 'Detection History Log', desc: 'Searchable historical scans and analysis database' },
  '/statistics': { title: 'Statistics & Analytics', desc: 'Aggregated detection metrics and visual trend insights' },
  '/reports': { title: 'Report Generation', desc: 'Generate downloadable PDF road inspection summary reports' },
  '/complaint': { title: 'Report Road Issue', desc: 'Official government road safety complaint portal link & guidance' },
  '/feedback': { title: 'Feedback & Improvement', desc: 'Model evaluation log and user feedback submission' },
  '/about': { title: 'About & Engineering Team', desc: 'Deep learning system architecture and project team' },
};

export default function Navbar({ sidebarOpen, setSidebarOpen }) {
  const location = useLocation();
  const [apiOnline, setApiOnline] = useState(false);

  const routeInfo = routeTitles[location.pathname] || {
    title: 'Pothole Detection System',
    desc: 'AI-Powered Road Damage Detection'
  };

  useEffect(() => {
    const verifyApi = async () => {
      try {
        const res = await checkHealth();
        if (res && res.status === 'ok') {
          setApiOnline(true);
        } else {
          setApiOnline(false);
        }
      } catch {
        setApiOnline(false);
      }
    };
    verifyApi();
    const interval = setInterval(verifyApi, 20000);
    return () => clearInterval(interval);
  }, []);

  return (
    <header 
      style={{
        height: '64px',
        position: 'fixed',
        top: 0,
        right: 0,
        left: sidebarOpen ? '260px' : '80px',
        zIndex: 40,
        backgroundColor: '#FFFFFF',
        borderBottom: '1px solid #E2E8F0',
        transition: 'left 0.3s ease',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 24px'
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        <button 
          onClick={() => setSidebarOpen(!sidebarOpen)}
          style={{
            background: 'none',
            border: 'none',
            color: '#475569',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            padding: '6px',
            borderRadius: '6px'
          }}
          title="Toggle Navigation"
        >
          <Menu size={20} />
        </button>

        <div>
          <h2 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#0F172A', lineHeight: 1.2 }}>
            {routeInfo.title}
          </h2>
          <span style={{ fontSize: '0.78rem', color: '#64748B', display: 'block' }}>
            {routeInfo.desc}
          </span>
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          padding: '4px 12px',
          borderRadius: '9999px',
          backgroundColor: apiOnline ? '#D1FAE5' : '#FEE2E2',
          border: `1px solid ${apiOnline ? 'rgba(16, 185, 129, 0.3)' : 'rgba(239, 68, 68, 0.3)'}`,
          fontSize: '0.8rem',
          fontWeight: 600,
          color: apiOnline ? '#065F46' : '#991B1B'
        }}>
          <Activity size={13} className={apiOnline ? 'animate-pulse' : ''} />
          <span>{apiOnline ? 'AI Service Online' : 'Backend Offline'}</span>
        </div>
      </div>
    </header>
  );
}
