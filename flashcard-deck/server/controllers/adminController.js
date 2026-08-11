const jwt = require('jsonwebtoken');
const Admin = require('../models/Admin');
const Flashcard = require('../models/Flashcard');
const Notification = require('../models/Notification');

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const admin = await Admin.findOne({ email });
    if (admin && (await admin.matchPassword(password))) {
      res.json({
        _id: admin._id,
        email: admin.email,
        role: admin.role,
        token: generateToken(admin._id)
      });
    } else {
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getDashboardStats = async (req, res) => {
  try {
    const totalCards = await Flashcard.countDocuments();
    const pendingCards = await Flashcard.countDocuments({ status: 'pending' });
    const acceptedCards = await Flashcard.countDocuments({ status: 'accepted' });
    const declinedCards = await Flashcard.countDocuments({ status: 'declined' });
    
    const ratingResult = await Flashcard.aggregate([
      { $match: { adminRating: { $gt: 0 } } },
      { $group: { _id: null, avgRating: { $avg: '$adminRating' } } }
    ]);
    
    const averageRating = ratingResult.length > 0 
      ? Math.round(ratingResult[0].avgRating * 10) / 10 
      : 0;

    res.json({ totalCards, pendingCards, acceptedCards, declinedCards, averageRating });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getAllCards = async (req, res) => {
  try {
    const { status, category, search } = req.query;
    let query = {};

    if (status) query.status = status;
    if (category) query.category = category;
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { question: { $regex: search, $options: 'i' } }
      ];
    }

    const cards = await Flashcard.find(query)
      .populate('userId', 'name email')
      .sort({ submittedAt: -1 });

    res.json(cards);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getCardDetails = async (req, res) => {
  try {
    const card = await Flashcard.findById(req.params.id)
      .populate('userId', 'name email');

    if (!card) {
      return res.status(404).json({ message: 'Card not found' });
    }

    res.json(card);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.reviewCard = async (req, res) => {
  try {
    const { status, adminRating, adminFeedback } = req.body;

    const card = await Flashcard.findById(req.params.id);
    if (!card) {
      return res.status(404).json({ message: 'Card not found' });
    }

    card.status = status;
    card.adminRating = adminRating || 0;
    card.adminFeedback = adminFeedback || '';
    card.reviewedAt = Date.now();

    await card.save();

    // Create notification for the user
    const notificationMessage = status === 'accepted'
      ? `Your card "${card.title}" has been accepted! Rating: ${adminRating}/5 stars.`
      : `Your card "${card.title}" has been declined. Feedback: ${adminFeedback || 'No feedback provided.'}`;

    await Notification.create({
      userId: card.userId,
      cardId: card._id,
      message: notificationMessage,
      type: status,
      isRead: false
    });

    res.json({ message: `Card ${status} successfully`, card });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
