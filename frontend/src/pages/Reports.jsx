import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FileText, Download, Loader2, Scan } from 'lucide-react';
import { downloadReportUrl, getStatistics } from '../services/api';

export default function Reports() {
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [loadingStats, setLoadingStats] = useState(true);
  const [downloading, setDownloading] = useState(false);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await getStatistics();
        setStats(res);
      } catch (err) {
        console.error('Failed to load report page statistics:', err);
      } finally {
        setLoadingStats(false);
      }
    };
    fetchStats();
  }, []);

  const handleDownload = () => {
    setDownloading(true);
    window.open(downloadReportUrl, '_blank');
    setTimeout(() => setDownloading(false), 2000);
  };

  if (loadingStats) return <div style={{ color: '#64748B' }}>Loading report status...</div>;

  if (stats && stats.total_images === 0) {
    return (
      <div className="ui-card" style={{ padding: '64px 32px', textAlign: 'center', maxWidth: '600px', margin: '40px auto' }}>
        <FileText size={48} style={{ color: '#94A3B8', margin: '0 auto 16px auto' }} />
        <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#0F172A', marginBottom: '8px' }}>
          No detection records available for a report.
        </h2>
        <p style={{ fontSize: '0.88rem', color: '#64748B', marginBottom: '24px' }}>
          Analyze at least one road image before generating a summary PDF report.
        </p>
        <button className="btn-primary" onClick={() => navigate('/detection')} style={{ margin: '0 auto' }}>
          <Scan size={18} />
          <span>Start Detection Workspace</span>
        </button>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', maxWidth: '900px' }}>
      <div>
        <h1 style={{ fontSize: '1.6rem', fontWeight: 700, color: '#0F172A', marginBottom: '4px' }}>
          Detection Reports
        </h1>
        <p style={{ color: '#64748B', fontSize: '0.9rem' }}>
          Generate a PDF summary of recorded pothole detection results.
        </p>
      </div>

      <div className="ui-card" style={{ padding: '36px', textAlign: 'center' }}>
        <div style={{
          width: '64px',
          height: '64px',
          borderRadius: '16px',
          backgroundColor: '#EFF6FF',
          color: '#2563EB',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 20px auto'
        }}>
          <FileText size={32} />
        </div>

        <h2 style={{ fontSize: '1.3rem', fontWeight: 700, color: '#0F172A', marginBottom: '12px' }}>
          Pothole Detection Summary PDF Report
        </h2>
        <p style={{ fontSize: '0.9rem', color: '#64748B', maxWidth: '580px', margin: '0 auto 28px auto', lineHeight: 1.6 }}>
          Downloads an official PDF document containing recorded detection IDs, timestamps, classification decisions, confidence metrics, and YOLO road scene object counts.
        </p>

        {/* Summary Metrics Badge Grid */}
        {stats && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '12px', maxWidth: '650px', margin: '0 auto 32px auto', fontSize: '0.85rem' }}>
            <div style={{ backgroundColor: '#F8FAFC', padding: '12px', borderRadius: '8px', border: '1px solid #E2E8F0' }}>
              <span style={{ color: '#64748B', display: 'block' }}>Total Detections</span>
              <strong style={{ color: '#0F172A', fontSize: '1.1rem' }}>{stats.total_images}</strong>
            </div>
            <div style={{ backgroundColor: '#F8FAFC', padding: '12px', borderRadius: '8px', border: '1px solid #E2E8F0' }}>
              <span style={{ color: '#64748B', display: 'block' }}>Potholes Detected</span>
              <strong style={{ color: '#EF4444', fontSize: '1.1rem' }}>{stats.potholes_detected}</strong>
            </div>
            <div style={{ backgroundColor: '#F8FAFC', padding: '12px', borderRadius: '8px', border: '1px solid #E2E8F0' }}>
              <span style={{ color: '#64748B', display: 'block' }}>No Potholes</span>
              <strong style={{ color: '#10B981', fontSize: '1.1rem' }}>{stats.no_pothole}</strong>
            </div>
            <div style={{ backgroundColor: '#F8FAFC', padding: '12px', borderRadius: '8px', border: '1px solid #E2E8F0' }}>
              <span style={{ color: '#64748B', display: 'block' }}>Avg Confidence</span>
              <strong style={{ color: '#2563EB', fontSize: '1.1rem' }}>{(stats.average_confidence * 100).toFixed(1)}%</strong>
            </div>
          </div>
        )}

        <div style={{ display: 'flex', justifyContent: 'center', gap: '16px' }}>
          <button className="btn-primary" onClick={handleDownload} disabled={downloading} style={{ padding: '12px 28px', fontSize: '0.95rem' }}>
            {downloading ? <Loader2 size={18} className="animate-spin" /> : <Download size={18} />}
            <span>{downloading ? 'Preparing PDF Report...' : 'Generate PDF Report'}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
