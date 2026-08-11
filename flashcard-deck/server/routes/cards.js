const express = require('express');
const router = express.Router();
const { 
  createCard, 
  getMyCards, 
  getCardById, 
  updateCard, 
  deleteCard,
  getCardStats
} = require('../controllers/cardController');
const { protect } = require('../middleware/auth');

router.use(protect);

router.post('/', createCard);
router.get('/my', getMyCards);
router.get('/stats', getCardStats);
router.get('/:id', getCardById);
router.put('/:id', updateCard);
router.delete('/:id', deleteCard);

module.exports = router;
