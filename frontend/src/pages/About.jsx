import React from 'react';
import { Users, Cpu, Server, Code2, Database, CheckCircle2 } from 'lucide-react';

const teamMembers = [
  { name: 'Shiva Palaksha SG', role: 'Project Team Member', initial: 'S' },
  { name: 'Sibiyenthal K', role: 'Project Team Member', initial: 'S' },
  { name: 'Ranjith LK', role: 'Project Team Member', initial: 'R' },
];

export default function About() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '32px', maxWidth: '1000px' }}>
      <div>
        <h1 style={{ fontSize: '1.6rem', fontWeight: 700, color: '#0F172A', marginBottom: '4px' }}>
          About & Engineering Team
        </h1>
        <p style={{ color: '#64748B', fontSize: '0.9rem' }}>
          Technical overview of the Pothole Detection System architecture and project contributors.
        </p>
      </div>

      {/* About Section */}
      <div className="ui-card" style={{ padding: '28px' }}>
        <h2 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#0F172A', marginBottom: '12px' }}>
          About the Project
        </h2>
        <p style={{ fontSize: '0.92rem', color: '#475569', lineHeight: 1.6, marginBottom: '16px' }}>
          The Pothole Detection System is a computer vision platform built using Deep Learning models to identify and evaluate road surface degradation from images.
        </p>
        <p style={{ fontSize: '0.92rem', color: '#475569', lineHeight: 1.6 }}>
          By processing input road photos, the system executes binary classification using a custom trained Convolutional Neural Network (CNN) and performs road scene object detection using YOLOv8.
        </p>
      </div>

      {/* Objectives Section */}
      <div className="ui-card" style={{ padding: '28px' }}>
        <h2 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#0F172A', marginBottom: '16px' }}>
          Project Objectives
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '16px' }}>
          <div style={{ padding: '16px', backgroundColor: '#F8FAFC', borderRadius: '8px', border: '1px solid #E2E8F0' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#2563EB', fontWeight: 700, fontSize: '0.9rem', marginBottom: '4px' }}>
              <CheckCircle2 size={16} />
              <span>Automated Pothole Classification</span>
            </div>
            <p style={{ fontSize: '0.82rem', color: '#64748B' }}>Deliver rapid binary detection of potholes using a 224x224 CNN model.</p>
          </div>

          <div style={{ padding: '16px', backgroundColor: '#F8FAFC', borderRadius: '8px', border: '1px solid #E2E8F0' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#10B981', fontWeight: 700, fontSize: '0.9rem', marginBottom: '4px' }}>
              <CheckCircle2 size={16} />
              <span>Scene Object Context</span>
            </div>
            <p style={{ fontSize: '0.82rem', color: '#64748B' }}>Identify road scene objects with bounding boxes using Ultralytics YOLOv8.</p>
          </div>

          <div style={{ padding: '16px', backgroundColor: '#F8FAFC', borderRadius: '8px', border: '1px solid #E2E8F0' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#8B5CF6', fontWeight: 700, fontSize: '0.9rem', marginBottom: '4px' }}>
              <CheckCircle2 size={16} />
              <span>3D Surface Visualization</span>
            </div>
            <p style={{ fontSize: '0.82rem', color: '#64748B' }}>Render grayscale depth mesh plots to analyze road surface geometry.</p>
          </div>
        </div>
      </div>

      {/* AI Models Specification Section */}
      <div className="ui-card" style={{ padding: '28px' }}>
        <h2 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#0F172A', marginBottom: '16px' }}>
          AI Models Architecture
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
          
          <div style={{ padding: '16px', backgroundColor: '#F8FAFC', borderRadius: '8px', border: '1px solid #E2E8F0' }}>
            <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#0F172A', marginBottom: '8px' }}>CNN Binary Classifier</h4>
            <p style={{ fontSize: '0.82rem', color: '#64748B', lineHeight: 1.5, marginBottom: '12px' }}>
              Sequential Conv2D network trained for binary classification of road pothole presence.
            </p>
            <ul style={{ fontSize: '0.82rem', color: '#475569', paddingLeft: '18px', lineHeight: 1.6 }}>
              <li>Input Shape: 224 x 224 x 3</li>
              <li>Output Activation: Sigmoid</li>
              <li>Decision Threshold: Score &ge; 0.5</li>
            </ul>
          </div>

          <div style={{ padding: '16px', backgroundColor: '#F8FAFC', borderRadius: '8px', border: '1px solid #E2E8F0' }}>
            <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#0F172A', marginBottom: '8px' }}>YOLOv8 Object Detection</h4>
            <p style={{ fontSize: '0.82rem', color: '#64748B', lineHeight: 1.5, marginBottom: '12px' }}>
              Ultralytics YOLOv8 nano model for secondary object bounding in road scenes.
            </p>
            <ul style={{ fontSize: '0.82rem', color: '#475569', paddingLeft: '18px', lineHeight: 1.6 }}>
              <li>Model: YOLOv8 Nano</li>
              <li>Target Classes: COCO (80 Classes)</li>
              <li>Output: Bounding Box Coordinates</li>
            </ul>
          </div>

        </div>
      </div>

      {/* Team Section */}
      <div>
        <h2 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#0F172A', marginBottom: '16px' }}>
          Project Team Members
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '20px' }}>
          {teamMembers.map((member, idx) => (
            <div key={idx} className="ui-card" style={{ padding: '24px', textAlign: 'center' }}>
              <div style={{
                width: '56px',
                height: '56px',
                borderRadius: '50%',
                backgroundColor: '#EFF6FF',
                border: '1px solid #BFDBFE',
                color: '#2563EB',
                fontSize: '1.3rem',
                fontWeight: 700,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 12px auto'
              }}>
                {member.initial}
              </div>
              <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#0F172A', marginBottom: '4px' }}>
                {member.name}
              </h3>
              <p style={{ fontSize: '0.82rem', color: '#64748B', fontWeight: 500 }}>
                {member.role}
              </p>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
