const jwt = require('jsonwebtoken');

// Generate JWT token
const generateToken = (user) => {
  return jwt.sign(
    {
      id: user._id,
      email: user.email,
      name: user.name
    },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  );
};

// Google OAuth callback handler
exports.googleCallback = (req, res) => {
  try {
    // Generate JWT token
    const token = generateToken(req.user);

    // Send token and user data to frontend
    res.redirect(`${process.env.CLIENT_URL}/auth/success?token=${token}&email=${req.user.email}&name=${encodeURIComponent(req.user.name)}`);
  } catch (error) {
    console.error('Error in Google callback:', error);
    res.redirect(`${process.env.CLIENT_URL}/auth/error`);
  }
};

// Get current user
exports.getCurrentUser = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'Not authenticated' });
    }

    res.json({
      success: true,
      user: {
        id: req.user._id,
        email: req.user.email,
        name: req.user.name,
        picture: req.user.picture
      }
    });
  } catch (error) {
    console.error('Error getting current user:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Logout
exports.logout = (req, res) => {
  req.logout((err) => {
    if (err) {
      return res.status(500).json({ message: 'Error logging out' });
    }
    req.session.destroy();
    res.json({ success: true, message: 'Logged out successfully' });
  });
};

// Verify JWT token
exports.verifyToken = (req, res) => {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ success: false, message: 'No token provided' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    res.json({ success: true, user: decoded });
  } catch (error) {
    res.status(401).json({ success: false, message: 'Invalid token' });
  }
};
