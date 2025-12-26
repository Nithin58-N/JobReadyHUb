const express = require('express');
const router = express.Router();
const { getCurrentScore, getScoreHistory } = require('../controllers/scoreController');
const { protect } = require('../middleware/authMiddleware');

router.get('/current', protect, getCurrentScore);
router.get('/history', protect, getScoreHistory);

module.exports = router;
