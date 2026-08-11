const express = require('express');
const router = express.Router();
const { 
  login, 
  getDashboardStats, 
  getAllCards, 
  getCardDetails, 
  reviewCard 
} = require('../controllers/adminController');
const { protect, adminOnly } = require('../middleware/auth');

router.post('/login', login);
router.get('/dashboard', protect, adminOnly, getDashboardStats);
router.get('/cards', protect, adminOnly, getAllCards);
router.get('/cards/:id', protect, adminOnly, getCardDetails);
router.put('/cards/:id/review', protect, adminOnly, reviewCard);

module.exports = router;
