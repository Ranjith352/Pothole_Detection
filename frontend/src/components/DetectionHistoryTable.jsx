import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Eye, AlertTriangle, CheckCircle2, Calendar, Filter, Scan } from 'lucide-react';
import { getFullImageUrl } from '../services/api';

export default function DetectionHistoryTable({ 
  items, 
  total, 
  onSearch, 
  onFilterChange, 
  page, 
  setPage, 
  pageSize = 10 
}) {
  const navigate = useNavigate();
  const [selectedImage, setSelectedImage] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterClass, setFilterClass] = useState('');

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    onSearch(searchTerm);
  };

  const handleFilterSelect = (val) => {
    setFilterClass(val);
    onFilterChange(val);
  };

  const totalPages = Math.ceil(total / pageSize) || 1;

  return (
    <div className="ui-card" style={{ padding: '24px', width: '100%' }}>
      {/* Search and Filters */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <form onSubmit={handleSearchSubmit} style={{ display: 'flex', gap: '8px', flex: 1, minWidth: '260px' }}>
          <div style={{ position: 'relative', flex: 1 }}>
            <Search size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94A3B8' }} />
            <input
              type="text"
              className="ui-input"
              placeholder="Search filename or label..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ paddingLeft: '38px' }}
            />
          </div>
          <button type="submit" className="btn-secondary">
            Search
          </button>
        </form>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <Filter size={18} style={{ color: '#64748B' }} />
          <select
            className="ui-input"
            value={filterClass}
            onChange={(e) => handleFilterSelect(e.target.value)}
            style={{ width: '180px' }}
          >
            <option value="">All Classifications</option>
            <option value="Pothole Detected">Pothole Detected</option>
            <option value="No Pothole">No Pothole</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.88rem' }}>
          <thead>
            <tr style={{ borderBottom: '2px solid #E2E8F0', color: '#475569', fontWeight: 600 }}>
              <th style={{ padding: '12px 16px' }}>ID</th>
              <th style={{ padding: '12px 16px' }}>Image</th>
              <th style={{ padding: '12px 16px' }}>Date & Time</th>
              <th style={{ padding: '12px 16px' }}>Classification</th>
              <th style={{ padding: '12px 16px' }}>Confidence</th>
              <th style={{ padding: '12px 16px' }}>YOLO Detections</th>
              <th style={{ padding: '12px 16px', textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {items && items.length > 0 ? (
              items.map((item) => {
                const isPothole = item.classification === 'Pothole Detected';
                const imgUrl = getFullImageUrl(item.annotated_image_url || item.image_url);
                return (
                  <tr 
                    key={item.id}
                    style={{ 
                      borderBottom: '1px solid #E2E8F0',
                      transition: 'background 0.15s'
                    }}
                  >
                    <td style={{ padding: '14px 16px', color: '#64748B', fontWeight: 600 }}>#{item.id}</td>
                    <td style={{ padding: '14px 16px' }}>
                      <img 
                        src={imgUrl} 
                        alt="Thumbnail" 
                        style={{ width: '48px', height: '48px', objectFit: 'cover', borderRadius: '6px', border: '1px solid #E2E8F0' }}
                      />
                    </td>
                    <td style={{ padding: '14px 16px', color: '#0F172A' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <Calendar size={14} style={{ color: '#64748B' }} />
                        <span>{item.timestamp}</span>
                      </div>
                    </td>
                    <td style={{ padding: '14px 16px' }}>
                      <span className={isPothole ? 'badge badge-danger' : 'badge badge-success'}>
                        {isPothole ? <AlertTriangle size={14} /> : <CheckCircle2 size={14} />}
                        {item.classification}
                      </span>
                    </td>
                    <td style={{ padding: '14px 16px', fontWeight: 700, color: '#0F172A' }}>
                      {(item.confidence * 100).toFixed(1)}%
                    </td>
                    <td style={{ padding: '14px 16px', color: '#0284C7', fontWeight: 500 }}>
                      {item.yolo_detection_count} detected
                    </td>
                    <td style={{ padding: '14px 16px', textAlign: 'right' }}>
                      <button
                        className="btn-secondary"
                        style={{ padding: '6px 12px', fontSize: '0.8rem' }}
                        onClick={() => setSelectedImage(item)}
                      >
                        <Eye size={14} />
                        <span>View</span>
                      </button>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan="7" style={{ padding: '48px 16px', textAlign: 'center' }}>
                  <div style={{ maxWidth: '400px', margin: '0 auto' }}>
                    <p style={{ fontSize: '1rem', fontWeight: 600, color: '#0F172A', marginBottom: '6px' }}>
                      No detection records yet.
                    </p>
                    <p style={{ fontSize: '0.85rem', color: '#64748B', marginBottom: '20px' }}>
                      Analyze your first road image to populate historical records.
                    </p>
                    <button className="btn-primary" onClick={() => navigate('/detection')}>
                      <Scan size={16} />
                      <span>Start Your First Detection</span>
                    </button>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      {total > 0 && (
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '20px', fontSize: '0.85rem', color: '#64748B' }}>
          <span>Showing {items.length} of {total} records</span>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button
              className="btn-secondary"
              style={{ padding: '6px 12px' }}
              disabled={page <= 1}
              onClick={() => setPage(page - 1)}
            >
              Previous
            </button>
            <span style={{ display: 'flex', alignItems: 'center', padding: '0 8px', color: '#0F172A', fontWeight: 600 }}>
              Page {page} of {totalPages}
            </span>
            <button
              className="btn-secondary"
              style={{ padding: '6px 12px' }}
              disabled={page >= totalPages}
              onClick={() => setPage(page + 1)}
            >
              Next
            </button>
          </div>
        </div>
      )}

      {/* Detail Modal */}
      {selectedImage && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(15, 23, 42, 0.6)',
          backdropFilter: 'blur(4px)',
          zIndex: 100,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '20px'
        }}>
          <div className="ui-card" style={{ maxWidth: '650px', width: '100%', padding: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#0F172A' }}>
                Detection Record #{selectedImage.id}
              </h3>
              <button 
                onClick={() => setSelectedImage(null)} 
                style={{ background: 'none', border: 'none', color: '#64748B', cursor: 'pointer', fontSize: '1.2rem', padding: '4px' }}
              >
                ✕
              </button>
            </div>
            
            <div style={{ borderRadius: '8px', overflow: 'hidden', backgroundColor: '#0F172A', marginBottom: '16px' }}>
              <img 
                src={getFullImageUrl(selectedImage.annotated_image_url || selectedImage.image_url)} 
                alt="Detail" 
                style={{ width: '100%', maxHeight: '400px', objectFit: 'contain' }}
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', fontSize: '0.88rem', color: '#475569' }}>
              <div><strong>Date:</strong> {selectedImage.timestamp}</div>
              <div><strong>Label:</strong> {selectedImage.classification}</div>
              <div><strong>Confidence:</strong> {(selectedImage.confidence * 100).toFixed(1)}%</div>
              <div><strong>YOLO Detections:</strong> {selectedImage.yolo_detection_count}</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
