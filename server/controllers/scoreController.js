const ScoreHistory = require('../models/ScoreHistory');
const User = require('../models/User');

// @desc    Get Current Score
// @route   GET /api/score/current
// @access  Private
const getCurrentScore = async (req, res) => {
    const user = await User.findById(req.user.id);
    res.json({ score: user.jobReadinessScore });
};

// @desc    Get Score History
// @route   GET /api/score/history
// @access  Private
const getScoreHistory = async (req, res) => {
    const history = await ScoreHistory.find({ userId: req.user.id }).sort({ date: 1 });
    res.json(history);
};

module.exports = {
    getCurrentScore,
    getScoreHistory
};
