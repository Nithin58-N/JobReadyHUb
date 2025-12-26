const express = require('express');
const router = express.Router();
const { startInterview, submitInterview } = require('../controllers/interviewController');
const { protect } = require('../middleware/authMiddleware');

router.post('/start', protect, startInterview);
router.post('/submit', protect, submitInterview);

module.exports = router;
