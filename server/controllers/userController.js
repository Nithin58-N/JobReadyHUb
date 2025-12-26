const User = require('../models/User');

// @desc    Get user data
// @route   GET /api/user/profile
// @access  Private
const getMe = async (req, res) => {
    const user = await User.findById(req.user.id);

    res.status(200).json({
        id: user.id,
        name: user.name,
        email: user.email,
        careerGoal: user.careerGoal,
        jobReadinessScore: user.jobReadinessScore
    });
};

// @desc    Update career goal
// @route   PUT /api/user/career-goal
// @access  Private
const updateCareerGoal = async (req, res) => {
    const user = await User.findById(req.user.id);

    if (user) {
        user.careerGoal = req.body.careerGoal || user.careerGoal;

        // Logic to reset or re-seed skills could go here if goal changes

        const updatedUser = await user.save();
        res.json({
            id: updatedUser.id,
            name: updatedUser.name,
            email: updatedUser.email,
            careerGoal: updatedUser.careerGoal,
            jobReadinessScore: updatedUser.jobReadinessScore
        });
    } else {
        res.status(404).json({ message: 'User not found' });
    }
};

module.exports = {
    getMe,
    updateCareerGoal,
};
