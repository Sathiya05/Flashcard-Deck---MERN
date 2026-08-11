import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getUnreadCount } from '../services/api';

const Navbar = () => {
  const { user, admin, isAuthenticated, isAdmin, logout } = useAuth();
  const navigate = useNavigate();
  const [unreadCount, setUnreadCount] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    if (isAuthenticated && !isAdmin) {
      getUnreadCount()
        .then(res => setUnreadCount(res.data.count))
        .catch(() => {});
    }
  }, [isAuthenticated, isAdmin]);

  const handleLogout = () => {
    setMenuOpen(false);
    logout();
    navigate('/login');
  };

  const closeMenu = () => setMenuOpen(false);

  return (
    <nav className="navbar">
      <Link to={isAdmin ? '/admin/dashboard' : '/dashboard'} className="navbar-brand" onClick={closeMenu}>
        Flashcard Deck
      </Link>

      <button
        className={`menu-toggle ${menuOpen ? 'active' : ''}`}
        onClick={() => setMenuOpen(!menuOpen)}
        aria-label="Toggle navigation menu"
        aria-expanded={menuOpen}
      >
        <span></span>
        <span></span>
        <span></span>
      </button>

      <div className={`navbar-links ${menuOpen ? 'open' : ''}`}>
        {isAuthenticated ? (
          <>
            {isAdmin ? (
              <>
                <Link to="/admin/dashboard" onClick={closeMenu}>Dashboard</Link>
                <span className="nav-welcome">Welcome, Admin</span>
                <button onClick={handleLogout}>Logout</button>
              </>
            ) : (
              <>
                <Link to="/dashboard" onClick={closeMenu}>Dashboard</Link>
                <Link to="/cards/create" onClick={closeMenu}>Create Card</Link>
                <Link to="/notifications" className="notification-badge" onClick={closeMenu}>
                  Notifications
                  {unreadCount > 0 && <span className="badge">{unreadCount}</span>}
                </Link>
                <span className="nav-welcome">Welcome, {user?.name}</span>
                <button onClick={handleLogout}>Logout</button>
              </>
            )}
          </>
        ) : (
          <>
            <Link to="/login" onClick={closeMenu}>Login</Link>
            <Link to="/register" onClick={closeMenu}>Register</Link>
            <Link to="/admin/login" onClick={closeMenu}>Admin</Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
