import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getDashboardStats, getAllCards } from '../services/api';
import { toast } from 'react-toastify';

const AdminDashboard = () => {
  const [stats, setStats] = useState({ totalCards: 0, pendingCards: 0, acceptedCards: 0, declinedCards: 0, averageRating: 0 });
  const [cards, setCards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ status: '', category: '', search: '' });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [statsRes, cardsRes] = await Promise.all([
        getDashboardStats(),
        getAllCards()
      ]);
      setStats(statsRes.data);
      setCards(cardsRes.data);
    } catch (error) {
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = async (newFilters) => {
    setFilters(newFilters);
    try {
      const params = {};
      if (newFilters.status) params.status = newFilters.status;
      if (newFilters.category) params.category = newFilters.category;
      if (newFilters.search) params.search = newFilters.search;
      
      const res = await getAllCards(params);
      setCards(res.data);
    } catch (error) {
      toast.error('Failed to filter cards');
    }
  };

  if (loading) return <div className="loading">Loading admin dashboard...</div>;

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1>Admin Dashboard</h1>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <h3>Total Cards</h3>
          <div className="value">{stats.totalCards}</div>
        </div>
        <div className="stat-card pending">
          <h3>Pending Review</h3>
          <div className="value">{stats.pendingCards}</div>
        </div>
        <div className="stat-card accepted">
          <h3>Accepted</h3>
          <div className="value">{stats.acceptedCards}</div>
        </div>
        <div className="stat-card declined">
          <h3>Declined</h3>
          <div className="value">{stats.declinedCards}</div>
        </div>
        <div className="stat-card rating">
          <h3>Average Rating</h3>
          <div className="value">{stats.averageRating}</div>
        </div>
      </div>

      <div className="cards-section">
        <h2>All Submitted Cards</h2>
        
        <div className="admin-filters">
          <select 
            value={filters.status} 
            onChange={(e) => handleFilterChange({ ...filters, status: e.target.value })}
          >
            <option value="">All Status</option>
            <option value="pending">Pending</option>
            <option value="accepted">Accepted</option>
            <option value="declined">Declined</option>
          </select>

          <select 
            value={filters.category} 
            onChange={(e) => handleFilterChange({ ...filters, category: e.target.value })}
          >
            <option value="">All Categories</option>
            <option value="JavaScript">JavaScript</option>
            <option value="Python">Python</option>
            <option value="React">React</option>
            <option value="Node.js">Node.js</option>
            <option value="CSS">CSS</option>
            <option value="HTML">HTML</option>
            <option value="Database">Database</option>
            <option value="DevOps">DevOps</option>
            <option value="Other">Other</option>
          </select>

          <input
            type="text"
            placeholder="Search cards..."
            value={filters.search}
            onChange={(e) => handleFilterChange({ ...filters, search: e.target.value })}
          />
        </div>

        {cards.length === 0 ? (
          <div className="empty-state">
            <h3>No cards found</h3>
            <p>No cards match your current filters.</p>
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
                <p style={{ color: '#666', fontSize: '0.9rem', marginBottom: '5px' }}>
                  <strong>Submitted by:</strong> {card.userId?.name || 'Unknown'} ({card.userId?.email || 'N/A'})
                </p>
                <p style={{ color: '#666', fontSize: '0.9rem', marginBottom: '10px' }}>
                  {card.question.substring(0, 100)}...
                </p>
                {card.adminRating > 0 && (
                  <div className="rating-display">
                    {'★'.repeat(card.adminRating)}{'☆'.repeat(5 - card.adminRating)}
                    <span style={{ marginLeft: '5px', color: '#666' }}>{card.adminRating}/5</span>
                  </div>
                )}
                <div className="card-actions">
                  <Link to={`/admin/cards/${card._id}`} className="btn btn-primary">
                    Review Card
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
