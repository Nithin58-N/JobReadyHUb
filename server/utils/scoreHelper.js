const Resume = require('../models/Resume');
const Interview = require('../models/Interview');
const Skill = require('../models/Skill');
const ScoreHistory = require('../models/ScoreHistory');
const User = require('../models/User');

const updateJobReadiness = async (userId) => {
    const resume = await Resume.findOne({ userId }).sort({ createdAt: -1 });
    const interviews = await Interview.find({ userId });

    let interviewScore = 0;
    if (interviews.length > 0) {
        interviewScore = interviews.reduce((acc, curr) => acc + curr.interviewScore, 0) / interviews.length;
    }

    const skills = await Skill.find({ userId });
    let skillScore = 0;
    const totalSkills = skills.length;
    const completedSkills = skills.filter(s => s.status === 'Completed').length;

    // If no skills suggested yet, treat as neutral or 0? 
    // Requirement says: (Resume + Interview + Skill) / 3
    // We should handle if denominator is 0? 
    // If no skills exist, maybe skillScore is 0. 
    if (totalSkills > 0) skillScore = (completedSkills / totalSkills) * 100;

    const navResumeScore = resume ? resume.resumeScore : 0;

    const finalScore = Math.round((navResumeScore + interviewScore + skillScore) / 3);

    const user = await User.findById(userId);
    if (user) {
        user.jobReadinessScore = finalScore;
        await user.save();

        await ScoreHistory.create({
            userId,
            score: finalScore
        });
    }

    return finalScore;
};

module.exports = { updateJobReadiness };
