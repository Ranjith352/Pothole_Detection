import React, { useState, useEffect } from 'react';
import { MessageSquarePlus, Send, CheckCircle2, Star } from 'lucide-react';
import { submitFeedback, getFeedbackList } from '../services/api';

export default function Feedback() {
  const [message, setMessage] = useState('');
  const [feedbackType, setFeedbackType] = useState('general');
  const [rating, setRating] = useState(5);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState(null);
  const [feedbackList, setFeedbackList] = useState([]);

  const loadFeedback = async () => {
    try {
      const data = await getFeedbackList();
      setFeedbackList(data);
    } catch (err) {
      console.error('Failed to load feedback list:', err);
    }
  };

  useEffect(() => {
    loadFeedback();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!message.trim()) return;

    setSubmitting(true);
    setError(null);
    try {
      await submitFeedback({
        message: message.trim(),
        feedback_type: feedbackType,
        rating: rating
      });
      setSubmitted(true);
      setMessage('');
      loadFeedback();
      setTimeout(() => setSubmitted(false), 4000);
    } catch (err) {
      setError('Failed to submit feedback. Please verify backend service connection.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', maxWidth: '900px' }}>
      <div>
        <h1 style={{ fontSize: '1.6rem', fontWeight: 700, color: '#0F172A', marginBottom: '4px' }}>
          Feedback & Improvement
        </h1>
        <p style={{ color: '#64748B', fontSize: '0.9rem' }}>
          Help us improve the accuracy and usability of the pothole detection system.
        </p>
      </div>

      <div className="ui-card" style={{ padding: '32px' }}>
        <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#0F172A', marginBottom: '20px' }}>
          Submit System Feedback
        </h3>

        {submitted && (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            padding: '12px 16px',
            backgroundColor: '#D1FAE5',
            border: '1px solid rgba(16, 185, 129, 0.3)',
            borderRadius: '8px',
            color: '#065F46',
            marginBottom: '20px',
            fontSize: '0.9rem'
          }}>
            <CheckCircle2 size={18} />
            <span>Thank you for your feedback! Your submission has been saved to the database.</span>
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', color: '#475569', marginBottom: '6px', fontWeight: 600 }}>
              Feedback Category
            </label>
            <select
              className="ui-input"
              value={feedbackType}
              onChange={(e) => setFeedbackType(e.target.value)}
            >
              <option value="general">General Suggestion</option>
              <option value="false_positive">False Positive (Model detected pothole on normal road)</option>
              <option value="false_negative">False Negative (Model missed a real pothole)</option>
            </select>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', color: '#475569', marginBottom: '6px', fontWeight: 600 }}>
              System Satisfaction Rating
            </label>
            <div style={{ display: 'flex', gap: '6px' }}>
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  style={{
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    color: star <= rating ? '#F59E0B' : '#CBD5E1',
                    padding: '2px'
                  }}
                >
                  <Star size={24} fill={star <= rating ? '#F59E0B' : 'transparent'} />
                </button>
              ))}
            </div>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', color: '#475569', marginBottom: '6px', fontWeight: 600 }}>
              Feedback Message
            </label>
            <textarea
              className="ui-input"
              rows={4}
              placeholder="Provide feedback about false positives/negatives or suggestions for improvement..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              required
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <button className="btn-primary" type="submit" disabled={submitting || !message.trim()}>
              <Send size={16} />
              <span>{submitting ? 'Submitting...' : 'Submit Feedback'}</span>
            </button>
          </div>
        </form>
      </div>

      {/* Submitted Feedback History Log */}
      {feedbackList.length > 0 && (
        <div className="ui-card" style={{ padding: '24px' }}>
          <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#0F172A', marginBottom: '16px' }}>
            Recent Feedback Log
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {feedbackList.slice(0, 5).map((item) => (
              <div 
                key={item.id} 
                style={{
                  padding: '14px',
                  backgroundColor: '#F8FAFC',
                  borderRadius: '8px',
                  border: '1px solid #E2E8F0'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px', fontSize: '0.78rem', color: '#64748B' }}>
                  <span className="badge badge-info">{item.feedback_type}</span>
                  <span>{item.timestamp}</span>
                </div>
                <p style={{ fontSize: '0.88rem', color: '#0F172A' }}>{item.message}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
