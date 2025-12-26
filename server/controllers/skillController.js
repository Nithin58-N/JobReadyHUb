const Skill = require('../models/Skill');
const { updateJobReadiness } = require('../utils/scoreHelper');

// @desc    Get Skill Recommendations
// @route   GET /api/skills/recommendations
// @access  Private
const getSkills = async (req, res) => {
    const skills = await Skill.find({ userId: req.user.id });
    res.json(skills);
};

// @desc    Complete a skill
// @route   POST /api/skills/complete
// @access  Private
const completeSkill = async (req, res) => {
    const { skillId } = req.body;

    const skill = await Skill.findOne({ _id: skillId, userId: req.user.id });

    if (skill) {
        skill.status = 'Completed';
        await skill.save();

        await updateJobReadiness(req.user.id);

        res.json(skill);
    } else {
        res.status(404).json({ message: 'Skill not found' });
    }
};

module.exports = {
    getSkills,
    completeSkill
};
