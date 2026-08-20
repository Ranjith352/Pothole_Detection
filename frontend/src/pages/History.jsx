import React, { useState, useEffect } from 'react';
import DetectionHistoryTable from '../components/DetectionHistoryTable';
import LoadingSpinner from '../components/LoadingSpinner';
import { getHistory } from '../services/api';

export default function History() {
  const [items, setItems] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [classification, setClassification] = useState('');
  const pageSize = 10;

  const fetchHistoryData = async () => {
    setLoading(true);
    try {
      const offset = (page - 1) * pageSize;
      const res = await getHistory({
        limit: pageSize,
        offset,
        search: search || undefined,
        classification: classification || undefined
      });
      setItems(res.items);
      setTotal(res.total);
    } catch (err) {
      console.error('Failed to fetch history data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistoryData();
  }, [page, search, classification]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div>
        <h1 style={{ fontSize: '1.6rem', fontWeight: 700, color: '#0F172A', marginBottom: '4px' }}>
          Detection History Database
        </h1>
        <p style={{ color: '#64748B', fontSize: '0.9rem' }}>
          Searchable paginated database of historical road scans, model confidence scores, and bounding box counts.
        </p>
      </div>

      {loading && items.length === 0 ? (
        <LoadingSpinner text="Fetching history records from database..." />
      ) : (
        <DetectionHistoryTable
          items={items}
          total={total}
          page={page}
          setPage={setPage}
          pageSize={pageSize}
          onSearch={(query) => { setSearch(query); setPage(1); }}
          onFilterChange={(cls) => { setClassification(cls); setPage(1); }}
        />
      )}
    </div>
  );
}
