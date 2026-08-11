const mongoose = require('mongoose');

const flashcardSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  title: {
    type: String,
    required: [true, 'Title is required'],
    trim: true,
    maxlength: 100
  },
  category: {
    type: String,
    required: [true, 'Category is required'],
    trim: true,
    enum: ['JavaScript', 'Python', 'React', 'Node.js', 'CSS', 'HTML', 'Database', 'DevOps', 'Other']
  },
  question: {
    type: String,
    required: [true, 'Question is required'],
    maxlength: 500
  },
  answer: {
    type: String,
    required: [true, 'Answer is required'],
    maxlength: 1000
  },
  difficulty: {
    type: String,
    required: [true, 'Difficulty is required'],
    enum: ['Easy', 'Medium', 'Hard']
  },
  tags: [{
    type: String,
    trim: true
  }],
  animationType: {
    type: String,
    enum: ['flip', 'slide', 'zoom', 'fade'],
    default: 'flip'
  },
  status: {
    type: String,
    enum: ['pending', 'accepted', 'declined'],
    default: 'pending'
  },
  adminRating: {
    type: Number,
    min: 0,
    max: 5,
    default: 0
  },
  adminFeedback: {
    type: String,
    maxlength: 500,
    default: ''
  },
  submittedAt: {
    type: Date,
    default: Date.now
  },
  reviewedAt: {
    type: Date
  }
});

flashcardSchema.index({ userId: 1, status: 1 });
flashcardSchema.index({ status: 1 });

module.exports = mongoose.model('Flashcard', flashcardSchema);
