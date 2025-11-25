const express = require('express');
const passport = require('passport');
const authController = require('../controllers/authController');
const { isAuthenticated, verifyToken } = require('../middleware/auth');

const router = express.Router();

// @route   GET /api/auth/google
// @desc    Initiate Google OAuth
// @access  Public
router.get(
  '/google',
  passport.authenticate('google', { scope: ['profile', 'email'] })
);

// @route   GET /api/auth/google/callback
// @desc    Google OAuth callback
// @access  Public
router.get(
  '/google/callback',
  passport.authenticate('google', { 
    failureRedirect: `${process.env.CLIENT_URL}/auth/error`,
    session: true
  }),
  authController.googleCallback
);

// @route   GET /api/auth/current-user
// @desc    Get current authenticated user
// @access  Private
router.get('/current-user', isAuthenticated, authController.getCurrentUser);

// @route   POST /api/auth/logout
// @desc    Logout user
// @access  Private
router.post('/logout', authController.logout);

// @route   POST /api/auth/verify
// @desc    Verify JWT token
// @access  Public
router.post('/verify', authController.verifyToken);

// @route   GET /api/auth/protected
// @desc    Test protected route with JWT
// @access  Private (JWT)
router.get('/protected', verifyToken, (req, res) => {
  res.json({
    success: true,
    message: 'Access granted to protected route',
    user: req.user
  });
});

module.exports = router;
