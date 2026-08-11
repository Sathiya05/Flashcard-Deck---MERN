const Admin = require('./models/Admin');
const User = require('./models/User');

const seedData = async () => {
  const adminExists = await Admin.findOne({ email: 'admin@flashcard.com' });

  if (adminExists) {
    console.log('Admin already exists');
  } else {
    await Admin.create({
      email: 'admin@flashcard.com',
      password: 'admin123'
    });
    console.log('Admin seeded successfully: admin@flashcard.com');
  }

  const userExists = await User.findOne({ email: 'user@flashcard.com' });

  if (userExists) {
    console.log('User already exists');
  } else {
    await User.create({
      name: 'Demo User',
      email: 'user@flashcard.com',
      password: 'user123'
    });
    console.log('User seeded successfully: user@flashcard.com');
  }
};

module.exports = seedData;
