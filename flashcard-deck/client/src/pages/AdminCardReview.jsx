import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getCardDetails, reviewCard } from '../services/api';
import { toast } from 'react-toastify';

const AdminCardReview = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [card, setCard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [rating, setRating] = useState(0);
  const [feedback, setFeedback] = useState('');
  const [isFlipped, setIsFlipped] = useState(false);

  useEffect(() => {
    fetchCard();
  }, [id]);

  const fetchCard = async () => {
    try {
      const res = await getCardDetails(id);
      setCard(res.data);
      setRating(res.data.adminRating || 0);
      setFeedback(res.data.adminFeedback || '');
    } catch (error) {
      toast.error('Failed to load card details');
      navigate('/admin/dashboard');
    } finally {
      setLoading(false);
    }
  };

  const handleReview = async (status) => {
    if (status === 'accepted' && rating === 0) {
      toast.error('Please provide a rating before accepting');
      return;
    }

    setSaving(true);
    try {
      await reviewCard(id, { status, adminRating: rating, adminFeedback: feedback });
      toast.success(`Card ${status} successfully!`);
      navigate('/admin/dashboard');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to review card');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="loading">Loading card details...</div>;
  if (!card) return null;

  return (
    <div className="review-container">
      <div className="review-card">
        <div className="review-header">
          <div className="review-user">
            <h2>{card.title}</h2>
            <p>Submitted by: {card.userId?.name || 'Unknown'}</p>
            <p>Email: {card.userId?.email || 'N/A'}</p>
          </div>
          <div className="card-meta" style={{ textAlign: 'right' }}>
            <span className={`badge badge-${card.status}`}>{card.status}</span>
            <span className="badge badge-category">{card.category}</span>
            <span className={`badge badge-${card.difficulty.toLowerCase()}`}>{card.difficulty}</span>
          </div>
        </div>

        <div className="review-section">
          <h4>Question</h4>
          <p>{card.question}</p>
        </div>

        <div className="review-section">
          <h4>Answer</h4>
          <p>{card.answer}</p>
        </div>

        {card.tags && card.tags.length > 0 && (
          <div className="review-section">
            <h4>Tags</h4>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              {card.tags.map(tag => (
                <span key={tag} className="tag">{tag}</span>
              ))}
            </div>
          </div>
        )}

        <div className="review-section">
          <h4>Submitted</h4>
          <p>{new Date(card.submittedAt).toLocaleString()}</p>
        </div>

        {card.status !== 'pending' && (
          <div className="review-section">
            <h4>Previous Review</h4>
            <p><strong>Status:</strong> {card.status}</p>
            {card.adminRating > 0 && (
              <div className="rating-display" style={{ marginTop: '10px' }}>
                {'★'.repeat(card.adminRating)}{'☆'.repeat(5 - card.adminRating)}
                <span style={{ marginLeft: '5px' }}>{card.adminRating}/5</span>
              </div>
            )}
            {card.adminFeedback && (
              <p style={{ marginTop: '10px' }}><strong>Feedback:</strong> {card.adminFeedback}</p>
            )}
          </div>
        )}

        <div className="review-section">
          <h4>Card Preview</h4>
          <div className="flashcard-container" onClick={() => setIsFlipped(!isFlipped)}>
            <div className={`flashcard ${isFlipped ? 'flipped' : ''}`}>
              <div className="flashcard-face flashcard-front">
                <h3>{card.title}</h3>
                <p>{card.question}</p>
                <span className="flashcard-hint">Click to flip</span>
              </div>
              <div className="flashcard-face flashcard-back">
                <h3>Answer</h3>
                <p>{card.answer}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="rating-section">
          <h4>Rating</h4>
          <div className="stars">
            {[1, 2, 3, 4, 5].map(star => (
              <span
                key={star}
                className={`star ${star <= rating ? 'active' : ''}`}
                onClick={() => setRating(star)}
              >
                {star <= rating ? '★' : '☆'}
              </span>
            ))}
          </div>
        </div>

        <div className="form-group">
          <label>Feedback Comments</label>
          <textarea
            className="feedback-input"
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
            placeholder="Add feedback for the user..."
            rows={4}
          />
        </div>

        <div className="review-actions">
          <button 
            className="btn btn-success" 
            onClick={() => handleReview('accepted')}
            disabled={saving || card.status === 'accepted'}
          >
            {saving ? 'Processing...' : 'Accept Card'}
          </button>
          <button 
            className="btn btn-danger" 
            onClick={() => handleReview('declined')}
            disabled={saving || card.status === 'declined'}
          >
            {saving ? 'Processing...' : 'Decline Card'}
          </button>
          <button 
            className="btn btn-secondary" 
            onClick={() => navigate('/admin/dashboard')}
            disabled={saving}
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminCardReview;
