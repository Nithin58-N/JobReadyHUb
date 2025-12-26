const express = require('express');
const router = express.Router();
const { getMe, updateCareerGoal } = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');

router.get('/profile', protect, getMe);
router.put('/career-goal', protect, updateCareerGoal);

module.exports = router;
