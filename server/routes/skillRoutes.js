const express = require('express');
const router = express.Router();
const { getSkills, completeSkill } = require('../controllers/skillController');
const { protect } = require('../middleware/authMiddleware');

router.get('/recommendations', protect, getSkills);
router.post('/complete', protect, completeSkill);

module.exports = router;
