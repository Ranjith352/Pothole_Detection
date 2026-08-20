import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import StatCard from '../components/StatCard';
import LoadingSpinner from '../components/LoadingSpinner';
import { getStatistics } from '../services/api';
import { 
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, 
  PieChart, Pie, Cell, LineChart, Line, Legend 
} from 'recharts';
import { Image, ShieldAlert, ShieldCheck, Percent, Award, Scan } from 'lucide-react';

export default function Statistics() {
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await getStatistics();
        setStats(res);
      } catch (err) {
        console.error('Failed to fetch statistics:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) return <LoadingSpinner text="Calculating system analytics..." />;
  if (!stats) return <div style={{ color: '#64748B' }}>Failed to load statistics.</div>;

  if (stats.total_images === 0) {
    return (
      <div className="ui-card" style={{ padding: '64px 32px', textAlign: 'center', maxWidth: '600px', margin: '40px auto' }}>
        <BarChart3 size={48} style={{ color: '#94A3B8', margin: '0 auto 16px auto' }} />
        <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#0F172A', marginBottom: '8px' }}>
          Complete a detection to generate analytics.
        </h2>
        <p style={{ fontSize: '0.88rem', color: '#64748B', marginBottom: '24px' }}>
          Once you analyze road images, statistical distribution charts and accuracy metrics will appear here automatically.
        </p>
        <button className="btn-primary" onClick={() => navigate('/detection')} style={{ margin: '0 auto' }}>
          <Scan size={18} />
          <span>Start Detection</span>
        </button>
      </div>
    );
  }

  const pieData = [
    { name: 'Potholes Detected', value: stats.potholes_detected, color: '#EF4444' },
    { name: 'No Pothole', value: stats.no_pothole, color: '#10B981' }
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
      <div>
        <h1 style={{ fontSize: '1.6rem', fontWeight: 700, color: '#0F172A', marginBottom: '4px' }}>
          Statistics & Analytics Dashboard
        </h1>
        <p style={{ color: '#64748B', fontSize: '0.9rem' }}>
          Real-time aggregated metrics, detection rates, confidence histograms, and historical trends.
        </p>
      </div>

      {/* Top KPI Cards Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
        <StatCard
          title="Total Scans"
          value={stats.total_images}
          subtitle="Analyzed road images"
          icon={Image}
          color="#2563EB"
        />
        <StatCard
          title="Potholes Detected"
          value={stats.potholes_detected}
          subtitle="Confirmed road hazards"
          icon={ShieldAlert}
          color="#EF4444"
        />
        <StatCard
          title="No Pothole"
          value={stats.no_pothole}
          subtitle="Clear road condition"
          icon={ShieldCheck}
          color="#10B981"
        />
        <StatCard
          title="Detection Rate"
          value={`${stats.pothole_percentage}%`}
          subtitle="Pothole presence ratio"
          icon={Percent}
          color="#F59E0B"
        />
        <StatCard
          title="Average Confidence"
          value={`${(stats.average_confidence * 100).toFixed(1)}%`}
          subtitle="AI prediction score"
          icon={Award}
          color="#8B5CF6"
        />
      </div>

      {/* Charts Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(420px, 1fr))', gap: '24px' }}>
        
        {/* Pie Chart */}
        <div className="ui-card" style={{ padding: '24px' }}>
          <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#0F172A', marginBottom: '16px' }}>
            Pothole vs Clear Road Distribution
          </h3>
          <div style={{ width: '100%', height: '280px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={65}
                  outerRadius={95}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ backgroundColor: '#FFFFFF', borderColor: '#E2E8F0', color: '#0F172A', borderRadius: '8px' }} 
                />
                <Legend wrapperStyle={{ color: '#475569', fontSize: '0.85rem' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Confidence Distribution Bar Chart */}
        <div className="ui-card" style={{ padding: '24px' }}>
          <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#0F172A', marginBottom: '16px' }}>
            Confidence Level Distribution
          </h3>
          <div style={{ width: '100%', height: '280px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stats.confidence_distribution}>
                <XAxis dataKey="range" stroke="#64748B" fontSize={12} />
                <YAxis stroke="#64748B" fontSize={12} />
                <Tooltip contentStyle={{ backgroundColor: '#FFFFFF', borderColor: '#E2E8F0', color: '#0F172A', borderRadius: '8px' }} />
                <Bar dataKey="count" fill="#2563EB" radius={[4, 4, 0, 0]} name="Scans" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>

      {/* Detection Trend Over Time Line Chart */}
      {stats.trend && stats.trend.length > 0 && (
        <div className="ui-card" style={{ padding: '24px' }}>
          <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#0F172A', marginBottom: '16px' }}>
            Daily Detection Activity Trend
          </h3>
          <div style={{ width: '100%', height: '300px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={stats.trend}>
                <XAxis dataKey="date" stroke="#64748B" fontSize={12} />
                <YAxis stroke="#64748B" fontSize={12} />
                <Tooltip contentStyle={{ backgroundColor: '#FFFFFF', borderColor: '#E2E8F0', color: '#0F172A', borderRadius: '8px' }} />
                <Legend wrapperStyle={{ color: '#475569', fontSize: '0.85rem' }} />
                <Line type="monotone" dataKey="potholes" stroke="#EF4444" strokeWidth={2.5} name="Potholes" />
                <Line type="monotone" dataKey="normal" stroke="#10B981" strokeWidth={2.5} name="Clear Road" />
                <Line type="monotone" dataKey="total" stroke="#2563EB" strokeWidth={2} strokeDasharray="4 4" name="Total Scans" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}
    </div>
  );
}
