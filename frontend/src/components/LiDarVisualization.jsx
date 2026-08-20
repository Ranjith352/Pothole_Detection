import React, { useState, useEffect } from 'react';
import Plot from 'react-plotly.js';
import { Layers, Loader2 } from 'lucide-react';
import { get3DSurfaceData } from '../services/api';

export default function LiDarVisualization({ imageFile }) {
  const [surfaceData, setSurfaceData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!imageFile) return;

    const fetch3D = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await get3DSurfaceData(imageFile);
        setSurfaceData(data);
      } catch (err) {
        setError('Failed to calculate 3D LiDAR-style surface plot.');
      } finally {
        setLoading(false);
      }
    };

    fetch3D();
  }, [imageFile]);

  if (!imageFile) return null;

  return (
    <div className="ui-card" style={{ padding: '24px', width: '100%', marginTop: '24px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
        <Layers size={20} style={{ color: '#8B5CF6' }} />
        <h3 style={{ fontSize: '1.05rem', fontWeight: 600, color: '#0F172A' }}>
          LiDAR-style 3D Visualization
        </h3>
      </div>
      <p style={{ fontSize: '0.82rem', color: '#64748B', marginBottom: '20px' }}>
        Reconstructs simulated 3D surface geometry from grayscale image pixel intensity grid (Viridis Colormap).
      </p>

      {loading && (
        <div style={{ padding: '40px', textAlign: 'center', color: '#64748B' }}>
          <Loader2 size={32} className="animate-spin" style={{ color: '#2563EB', margin: '0 auto 12px auto' }} />
          <span style={{ fontSize: '0.88rem' }}>Generating 3D surface mesh plot...</span>
        </div>
      )}

      {error && (
        <div style={{ color: '#EF4444', fontSize: '0.88rem', padding: '14px', backgroundColor: '#FEE2E2', borderRadius: '8px' }}>
          {error}
        </div>
      )}

      {surfaceData && !loading && (
        <div style={{ width: '100%', overflowX: 'auto' }}>
          <Plot
            data={[
              {
                z: surfaceData.z,
                x: surfaceData.x,
                y: surfaceData.y,
                type: 'surface',
                colorscale: 'Viridis',
                contours: {
                  z: { show: true, usecolormap: true, highlightcolor: '#2563eb', project: { z: true } }
                }
              }
            ]}
            layout={{
              title: { text: 'Grayscale Surface Depth Mapping', font: { color: '#0F172A', size: 14 } },
              autosize: true,
              paper_bgcolor: '#FFFFFF',
              plot_bgcolor: '#FFFFFF',
              margin: { l: 20, r: 20, b: 20, t: 40 },
              scene: {
                xaxis: { title: 'X Grid', color: '#475569' },
                yaxis: { title: 'Y Grid', color: '#475569' },
                zaxis: { title: 'Intensity', color: '#475569' }
              }
            }}
            useResizeHandler={true}
            style={{ width: '100%', height: '460px' }}
            config={{ responsive: true, displayModeBar: true }}
          />
        </div>
      )}
    </div>
  );
}
