import axios from 'axios';

const API = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json'
  }
});

API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth
export const registerUser = (data) => API.post('/auth/register', data);
export const loginUser = (data) => API.post('/auth/login', data);
export const loginAdmin = (data) => API.post('/admin/login', data);
export const getMe = () => API.get('/auth/me');

// Cards
export const createCard = (data) => API.post('/cards', data);
export const getMyCards = () => API.get('/cards/my');
export const getCardById = (id) => API.get(`/cards/${id}`);
export const updateCard = (id, data) => API.put(`/cards/${id}`, data);
export const deleteCard = (id) => API.delete(`/cards/${id}`);
export const getCardStats = () => API.get('/cards/stats');

// Admin
export const getDashboardStats = () => API.get('/admin/dashboard');
export const getAllCards = (params) => API.get('/admin/cards', { params });
export const getCardDetails = (id) => API.get(`/admin/cards/${id}`);
export const reviewCard = (id, data) => API.put(`/admin/cards/${id}/review`, data);

// Notifications
export const getNotifications = () => API.get('/notifications');
export const getUnreadCount = () => API.get('/notifications/unread-count');
export const markAsRead = (id) => API.put(`/notifications/${id}/read`);
export const markAllAsRead = () => API.put('/notifications/read-all');

export default API;
