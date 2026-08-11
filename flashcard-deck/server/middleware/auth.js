const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Admin = require('../models/Admin');

const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      
      // Check if user or admin
      let user = await User.findById(decoded.id).select('-password');
      if (user) {
        req.user = user;
        req.userType = 'user';
        return next();
      }

      let admin = await Admin.findById(decoded.id).select('-password');
      if (admin) {
        req.user = admin;
        req.userType = 'admin';
        return next();
      }

      res.status(401).json({ message: 'Not authorized, user not found' });
    } catch (error) {
      res.status(401).json({ message: 'Not authorized, token failed' });
    }
  }

  if (!token) {
    res.status(401).json({ message: 'Not authorized, no token' });
  }
};

const adminOnly = (req, res, next) => {
  if (req.userType !== 'admin') {
    return res.status(403).json({ message: 'Admin access only' });
  }
  next();
};

module.exports = { protect, adminOnly };
