const express = require('express');
const authRoutes = require('./authRoutes');
const profileRoutes = require('./profileRoutes');
const contactRoutes = require('./contactRoutes');

const router = express.Router();

// Mount routes
router.use('/auth', authRoutes);
router.use('/profiles', profileRoutes);
router.use('/contact', contactRoutes);

// Health check route
router.get('/health', (req, res) => {
  res.json({ 
    success: true, 
    message: 'API is running',
    timestamp: new Date().toISOString()
  });
});

module.exports = router;
