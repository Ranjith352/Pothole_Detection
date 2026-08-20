import React, { useState, useEffect } from 'react';
import { ExternalLink, AlertTriangle, ShieldAlert } from 'lucide-react';
import { getComplaintInfo } from '../services/api';

export default function Complaint() {
  const [complaintData, setComplaintData] = useState(null);

  useEffect(() => {
    const fetchInfo = async () => {
      try {
        const res = await getComplaintInfo();
        setComplaintData(res);
      } catch (err) {
        console.error('Failed to load complaint portal info:', err);
      }
    };
    fetchInfo();
  }, []);

  const officialUrl = complaintData?.official_link || "https://www.tnrsa.tn.gov.in/tnscrb/?utm_source=chatgpt.com";

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', maxWidth: '900px' }}>
      <div>
        <h1 style={{ fontSize: '1.6rem', fontWeight: 700, color: '#0F172A', marginBottom: '4px' }}>
          Report a Road Issue
        </h1>
        <p style={{ color: '#64748B', fontSize: '0.9rem' }}>
          Detected pothole information can help users identify severe road issues that may require official reporting.
        </p>
      </div>

      <div className="ui-card" style={{ padding: '32px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '20px' }}>
          <div style={{
            width: '52px',
            height: '52px',
            borderRadius: '12px',
            backgroundColor: '#FEE2E2',
            color: '#EF4444',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0
          }}>
            <ShieldAlert size={28} />
          </div>
          <div>
            <h2 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#0F172A' }}>
              Tamil Nadu Road Safety Authority (TNRSA)
            </h2>
            <span style={{ fontSize: '0.82rem', color: '#64748B' }}>State Road Incident & Complaint Cell</span>
          </div>
        </div>

        <p style={{ fontSize: '0.92rem', color: '#475569', lineHeight: 1.6, marginBottom: '24px' }}>
          If you discover severe road damage or hazardous potholes using this AI detection system, you can officially submit a complaint report to municipal road safety authorities.
        </p>

        {complaintData?.instructions && (
          <div style={{
            padding: '20px',
            backgroundColor: '#F8FAFC',
            borderRadius: '8px',
            border: '1px solid #E2E8F0',
            marginBottom: '28px'
          }}>
            <h4 style={{ fontSize: '0.9rem', fontWeight: 700, color: '#0F172A', marginBottom: '10px' }}>
              Official Complaint Reporting Guidelines:
            </h4>
            <ul style={{ paddingLeft: '20px', color: '#475569', fontSize: '0.88rem', lineHeight: 1.6 }}>
              {complaintData.instructions.map((inst, idx) => (
                <li key={idx}>{inst}</li>
              ))}
            </ul>
          </div>
        )}

        <a 
          href={officialUrl} 
          target="_blank" 
          rel="noopener noreferrer" 
          style={{ textDecoration: 'none' }}
        >
          <button className="btn-primary" style={{ padding: '12px 24px', backgroundColor: '#EF4444' }}>
            <ExternalLink size={18} />
            <span>Official Complaint Portal</span>
          </button>
        </a>
      </div>
    </div>
  );
}
