import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { 
  Home, 
  Scan, 
  History, 
  BarChart3, 
  FileText, 
  AlertTriangle, 
  MessageSquarePlus, 
  Info,
  ShieldCheck,
  Activity
} from 'lucide-react';
import { checkHealth } from '../services/api';

const navGroups = [
  {
    title: 'HOME',
    items: [
      { name: 'Dashboard', path: '/', icon: Home }
    ]
  },
  {
    title: 'DETECTION',
    items: [
      { name: 'Pothole Detection', path: '/detection', icon: Scan }
    ]
  },
  {
    title: 'ANALYTICS',
    items: [
      { name: 'Detection History', path: '/history', icon: History },
      { name: 'Statistics & Insights', path: '/statistics', icon: BarChart3 }
    ]
  },
  {
    title: 'REPORTS',
    items: [
      { name: 'Report Generation', path: '/reports', icon: FileText },
      { name: 'Complaint Report', path: '/complaint', icon: AlertTriangle }
    ]
  },
  {
    title: 'OTHER',
    items: [
      { name: 'Feedback & Improvement', path: '/feedback', icon: MessageSquarePlus },
      { name: 'About & Team', path: '/about', icon: Info }
    ]
  }
];

export default function Sidebar({ isOpen, setIsOpen }) {
  const [apiOnline, setApiOnline] = useState(false);

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
    <aside 
      style={{
        width: isOpen ? '260px' : '80px',
        height: '100vh',
        position: 'fixed',
        left: 0,
        top: 0,
        zIndex: 50,
        backgroundColor: '#0F172A',
        color: '#F8FAFC',
        transition: 'width 0.3s ease',
        display: 'flex',
        flexDirection: 'column',
        padding: '20px 14px'
      }}
    >
      {/* Brand Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', paddingBottom: '20px', borderBottom: '1px solid rgba(255, 255, 255, 0.1)' }}>
        <div style={{ 
          width: '38px', 
          height: '38px', 
          borderRadius: '8px', 
          backgroundColor: '#2563EB', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          color: 'white',
          flexShrink: 0
        }}>
          <ShieldCheck size={22} />
        </div>
        {isOpen && (
          <div>
            <h1 style={{ fontSize: '0.98rem', fontWeight: 700, color: '#F8FAFC', lineHeight: 1.2 }}>Pothole Detection</h1>
            <span style={{ fontSize: '0.72rem', color: '#94A3B8', fontWeight: 500, letterSpacing: '0.03em' }}>AI Road Safety</span>
          </div>
        )}
      </div>

      {/* Navigation Links Grouped */}
      <nav style={{ marginTop: '16px', display: 'flex', flexDirection: 'column', gap: '16px', flex: 1, overflowY: 'auto' }}>
        {navGroups.map((group, idx) => (
          <div key={idx}>
            {isOpen && (
              <span style={{ fontSize: '0.68rem', fontWeight: 700, color: '#64748B', letterSpacing: '0.08em', padding: '0 8px 6px 8px', display: 'block' }}>
                {group.title}
              </span>
            )}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              {group.items.map((item) => {
                const Icon = item.icon;
                return (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    style={({ isActive }) => ({
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                      padding: '10px 12px',
                      borderRadius: '6px',
                      color: isActive ? '#FFFFFF' : '#94A3B8',
                      backgroundColor: isActive ? '#2563EB' : 'transparent',
                      textDecoration: 'none',
                      fontWeight: isActive ? 600 : 400,
                      fontSize: '0.88rem',
                      transition: 'all 0.15s ease'
                    })}
                  >
                    <Icon size={18} style={{ flexShrink: 0 }} />
                    {isOpen && <span>{item.name}</span>}
                  </NavLink>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* System Status Footbar */}
      {isOpen && (
        <div style={{ 
          padding: '12px', 
          backgroundColor: 'rgba(30, 41, 59, 0.6)', 
          borderRadius: '8px', 
          fontSize: '0.78rem',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          color: apiOnline ? '#10B981' : '#EF4444'
        }}>
          <Activity size={14} className={apiOnline ? 'animate-pulse' : ''} />
          <span style={{ fontWeight: 500 }}>
            {apiOnline ? 'AI Service Online (8000)' : 'Backend Offline'}
          </span>
        </div>
      )}
    </aside>
  );
}
