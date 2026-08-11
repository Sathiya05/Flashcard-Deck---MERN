import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getMyCards, getCardStats, deleteCard } from '../services/api';
import { toast } from 'react-toastify';

const UserDashboard = () => {
  const [cards, setCards] = useState([]);
  const [stats, setStats] = useState({ total: 0, pending: 0, accepted: 0, declined: 0 });
  const [loading, setLoading] = useState(true);
  const [showPreview, setShowPreview] = useState(null);
  const [selfTestCard, setSelfTestCard] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [cardsRes, statsRes] = await Promise.all([
        getMyCards(),
        getCardStats()
      ]);
      setCards(cardsRes.data);
      setStats(statsRes.data);
    } catch (error) {
      toast.error('Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this card?')) {
      try {
        await deleteCard(id);
        toast.success('Card deleted successfully');
        fetchData();
      } catch (error) {
        toast.error('Failed to delete card');
      }
    }
  };

  const handleSelfTest = (card) => {
    setSelfTestCard(card);
  };

  const shuffleCards = () => {
    const shuffled = [...cards].sort(() => Math.random() - 0.5);
    setCards(shuffled);
    toast.success('Cards shuffled!');
  };

  if (loading) return <div className="loading">Loading dashboard...</div>;

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1>My Dashboard</h1>
        <div className="dashboard-actions">
          <button className="btn btn-secondary" onClick={shuffleCards}>
            Shuffle Deck
          </button>
          <Link to="/cards/create" className="btn btn-primary">
            Create New Card
          </Link>
        </div>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <h3>Total Cards</h3>
          <div className="value">{stats.total}</div>
        </div>
        <div className="stat-card pending">
          <h3>Pending</h3>
          <div className="value">{stats.pending}</div>
        </div>
        <div className="stat-card accepted">
          <h3>Accepted</h3>
          <div className="value">{stats.accepted}</div>
        </div>
        <div className="stat-card declined">
          <h3>Declined</h3>
          <div className="value">{stats.declined}</div>
        </div>
      </div>

      <div className="cards-section">
        <h2>My Cards</h2>
        {cards.length === 0 ? (
          <div className="empty-state">
            <h3>No cards yet</h3>
            <p>Create your first flashcard to get started!</p>
            <Link to="/cards/create" className="btn btn-primary" style={{ width: 'auto', display: 'inline-block' }}>
              Create Card
            </Link>
          </div>
        ) : (
          <div className="cards-grid">
            {cards.map(card => (
              <div key={card._id} className="card-item">
                <h3>{card.title}</h3>
                <div className="card-meta">
                  <span className={`badge badge-${card.status}`}>{card.status}</span>
                  <span className="badge badge-category">{card.category}</span>
                  <span className={`badge badge-${card.difficulty.toLowerCase()}`}>{card.difficulty}</span>
                </div>
                <p style={{ color: '#666', fontSize: '0.9rem', marginBottom: '10px' }}>
                  {card.question.substring(0, 80)}...
                </p>
                {card.adminRating > 0 && (
                  <div className="rating-display">
                    {'★'.repeat(card.adminRating)}{'☆'.repeat(5 - card.adminRating)}
                    <span style={{ marginLeft: '5px', color: '#666' }}>{card.adminRating}/5</span>
                  </div>
                )}
                {card.status === 'pending' && (
                  <div className="card-actions">
                    <Link to={`/cards/${card._id}/edit`} className="btn btn-outline">
                      Edit
                    </Link>
                    <button className="btn btn-danger" onClick={() => handleDelete(card._id)}>
                      Delete
                    </button>
                  </div>
                )}
                {card.status === 'accepted' && (
                  <div className="card-actions">
                    <button className="btn btn-success" onClick={() => handleSelfTest(card)}>
                      Self Test
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Self Test Modal */}
      {selfTestCard && (
        <div className="self-test-overlay" onClick={() => setSelfTestCard(null)}>
          <div className="self-test-card" onClick={e => e.stopPropagation()}>
            <h3>{selfTestCard.title}</h3>
            <div className="flashcard-container">
              <FlashcardPreview card={selfTestCard} />
            </div>
            <button className="btn btn-secondary" onClick={() => setSelfTestCard(null)}>
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

const FlashcardPreview = ({ card }) => {
  const [isFlipped, setIsFlipped] = useState(false);

  return (
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
  );
};

export default UserDashboard;
