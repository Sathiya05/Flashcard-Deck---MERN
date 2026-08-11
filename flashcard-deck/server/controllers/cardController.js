const Flashcard = require('../models/Flashcard');

exports.createCard = async (req, res) => {
  try {
    const { title, category, question, answer, difficulty, tags, animationType } = req.body;

    const card = await Flashcard.create({
      userId: req.user._id,
      title,
      category,
      question,
      answer,
      difficulty,
      tags: tags || [],
      animationType: animationType || 'flip',
      status: 'pending'
    });

    res.status(201).json(card);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getMyCards = async (req, res) => {
  try {
    const cards = await Flashcard.find({ userId: req.user._id })
      .sort({ createdAt: -1 });
    res.json(cards);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getCardById = async (req, res) => {
  try {
    const card = await Flashcard.findOne({ 
      _id: req.params.id, 
      userId: req.user._id 
    });
    
    if (!card) {
      return res.status(404).json({ message: 'Card not found' });
    }
    res.json(card);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateCard = async (req, res) => {
  try {
    const card = await Flashcard.findOne({ 
      _id: req.params.id, 
      userId: req.user._id 
    });

    if (!card) {
      return res.status(404).json({ message: 'Card not found' });
    }

    if (card.status !== 'pending') {
      return res.status(400).json({ message: 'Cannot edit reviewed cards' });
    }

    const updatedCard = await Flashcard.findByIdAndUpdate(
      req.params.id,
      { ...req.body },
      { new: true, runValidators: true }
    );

    res.json(updatedCard);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.deleteCard = async (req, res) => {
  try {
    const card = await Flashcard.findOne({ 
      _id: req.params.id, 
      userId: req.user._id 
    });

    if (!card) {
      return res.status(404).json({ message: 'Card not found' });
    }

    await Flashcard.findByIdAndDelete(req.params.id);
    res.json({ message: 'Card deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getCardStats = async (req, res) => {
  try {
    const total = await Flashcard.countDocuments({ userId: req.user._id });
    const pending = await Flashcard.countDocuments({ userId: req.user._id, status: 'pending' });
    const accepted = await Flashcard.countDocuments({ userId: req.user._id, status: 'accepted' });
    const declined = await Flashcard.countDocuments({ userId: req.user._id, status: 'declined' });

    res.json({ total, pending, accepted, declined });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
