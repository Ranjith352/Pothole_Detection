import React from 'react';

export default function StatCard({ title, value, subtitle, icon: Icon, color = '#2563EB' }) {
  return (
    <div className="ui-card" style={{ padding: '20px', display: 'flex', alignItems: 'center', gap: '16px' }}>
      <div style={{
        width: '48px',
        height: '48px',
        borderRadius: '10px',
        backgroundColor: `${color}12`,
        border: `1px solid ${color}30`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: color,
        flexShrink: 0
      }}>
        {Icon && <Icon size={24} />}
      </div>
      <div style={{ flex: 1 }}>
        <span style={{ fontSize: '0.82rem', color: '#64748B', fontWeight: 500, display: 'block' }}>{title}</span>
        <h3 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#0F172A', lineHeight: 1.2, margin: '2px 0 0 0' }}>{value}</h3>
        {subtitle && <p style={{ fontSize: '0.75rem', color: '#94A3B8', marginTop: '2px' }}>{subtitle}</p>}
      </div>
    </div>
  );
}
