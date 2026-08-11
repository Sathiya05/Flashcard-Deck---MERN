import React, { useState, useEffect } from 'react';
import { getNotifications, markAsRead, markAllAsRead } from '../services/api';
import { toast } from 'react-toastify';

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      const res = await getNotifications();
      setNotifications(res.data);
    } catch (error) {
      toast.error('Failed to load notifications');
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAsRead = async (id) => {
    try {
      await markAsRead(id);
      setNotifications(notifications.map(n => 
        n._id === id ? { ...n, isRead: true } : n
      ));
    } catch (error) {
      toast.error('Failed to mark as read');
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await markAllAsRead();
      setNotifications(notifications.map(n => ({ ...n, isRead: true })));
      toast.success('All notifications marked as read');
    } catch (error) {
      toast.error('Failed to mark all as read');
    }
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'accepted':
        return '✓';
      case 'declined':
        return '✗';
      case 'rated':
        return '★';
      default:
        return '•';
    }
  };

  if (loading) return <div className="loading">Loading notifications...</div>;

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1>Notifications</h1>
        {notifications.some(n => !n.isRead) && (
          <button className="btn btn-outline" onClick={handleMarkAllAsRead} style={{ width: 'auto' }}>
            Mark All as Read
          </button>
        )}
      </div>

      <div className="cards-section">
        {notifications.length === 0 ? (
          <div className="empty-state">
            <h3>No notifications yet</h3>
            <p>You'll receive notifications when admin reviews your cards.</p>
          </div>
        ) : (
          <div className="notifications-list">
            {notifications.map(notification => (
              <div 
                key={notification._id} 
                className={`notification-item ${!notification.isRead ? 'unread' : ''}`}
                onClick={() => !notification.isRead && handleMarkAsRead(notification._id)}
              >
                <div className={`notification-icon ${notification.type}`}>
                  {getNotificationIcon(notification.type)}
                </div>
                <div className="notification-content">
                  <h3>
                    {notification.cardId?.title || 'Card'}
                    {notification.cardId?.category && ` (${notification.cardId.category})`}
                  </h3>
                  <p>{notification.message}</p>
                  <span className="time">
                    {new Date(notification.createdAt).toLocaleString()}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Notifications;
