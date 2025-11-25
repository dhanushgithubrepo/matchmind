const express = require('express')
const { sendContactEmail } = require('../controllers/contactController')

const router = express.Router()

// @route POST /api/contact/send
// @desc Send contact email to a profile owner
// @access Public
router.post('/send', sendContactEmail)

module.exports = router
