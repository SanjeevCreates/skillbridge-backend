import jwt from 'jsonwebtoken';
import User from '../models/userModel.js';

// Protect routes
export const protect = async (req, res, next) => {
  let token;

  // Read token from cookie
  if (req.cookies && req.cookies.token) {
    token = req.cookies.token;
  }
  // Read token from Auth Header
  else if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  // Make sure token exists
  if (!token) {
    return res.status(401).json({ success: false, message: 'Not authorized to access this route' });
  }

  try {
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'super_secure_skillbridge_ai_secret_key_9912');

    // Get user from token
    req.user = await User.findById(decoded.id);
    if (!req.user) {
      return res.status(401).json({ success: false, message: 'User not found with this token' });
    }

    next();
  } catch (error) {
    return res.status(401).json({ success: false, message: 'Token verification failed' });
  }
};

// Grant access to specific roles
export const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `User role ${req.user ? req.user.role : 'anonymous'} is not authorized to access this route`,
      });
    }
    next();
  };
};
