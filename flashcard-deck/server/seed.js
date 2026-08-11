const mongoose = require('mongoose');
const dotenv = require('dotenv');
const seedData = require('./seedData');

dotenv.config();

const seed = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/flashcard-deck');
    console.log('Connected to MongoDB');
    await seedData();
    process.exit(0);
  } catch (error) {
    console.error('Error seeding data:', error.message);
    process.exit(1);
  }
};

seed();
