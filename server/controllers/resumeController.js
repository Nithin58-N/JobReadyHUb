const Resume = require('../models/Resume');
const User = require('../models/User');
const Skill = require('../models/Skill');
const ScoreHistory = require('../models/ScoreHistory');
const pdf = require('pdf-parse');
const fs = require('fs');

// Helper to calculate job readiness score
const updateJobReadiness = async (userId) => {
    // Logic: (Resume + Interview + Skills) / 3
    // Fetch latest scores
    const resume = await Resume.findOne({ userId }).sort({ createdAt: -1 });
    const interviews = await require('../models/Interview').find({ userId });

    // Average interview score
    let interviewScore = 0;
    if (interviews.length > 0) {
        interviewScore = interviews.reduce((acc, curr) => acc + curr.interviewScore, 0) / interviews.length;
    }

    const skills = await Skill.find({ userId });
    let skillScore = 0;
    const totalSkills = skills.length;
    const completedSkills = skills.filter(s => s.status === 'Completed').length;
    if (totalSkills > 0) skillScore = (completedSkills / totalSkills) * 100;

    const navResumeScore = resume ? resume.resumeScore : 0;

    // Weighted Average? Or simple average as requested: (Resume + Interview + Skill) / 3
    // Wait, if no interview taken, should it be 0? Yes.

    const finalScore = Math.round((navResumeScore + interviewScore + skillScore) / 3);

    const user = await User.findById(userId);
    user.jobReadinessScore = finalScore;
    await user.save();

    // Add history
    await ScoreHistory.create({
        userId,
        score: finalScore
    });

    return finalScore;
};

// @desc    Upload and Analyze Resume
// @route   POST /api/resume/upload
// @access  Private
const uploadResume = async (req, res) => {
    if (!req.file) {
        return res.status(400).json({ message: 'Please upload a PDF file' });
    }

    try {
        const dataBuffer = fs.readFileSync(req.file.path);
        const data = await pdf(dataBuffer);
        const text = data.text;

        // Basic Analysis Logic
        const user = await User.findById(req.user.id);
        const goal = user.careerGoal || 'General';

        // Mock Analysis based on keywords
        let keywords = [];
        if (goal === 'Software Engineer') keywords = ['javascript', 'react', 'node', 'algorithms', 'structure', 'sql'];
        else if (goal === 'Data Analyst') keywords = ['python', 'sql', 'tableau', 'excel', 'statistics'];
        else if (goal === 'Cybersecurity') keywords = ['network', 'security', 'firewall', 'encryption', 'linux'];
        else if (goal === 'Web Developer') keywords = ['html', 'css', 'javascript', 'responsive', 'api'];
        else keywords = ['communication', 'teamwork', 'problem solving'];

        const lowerText = text.toLowerCase();
        let matchCount = 0;
        const missing = [];
        const strengths = [];

        keywords.forEach(k => {
            if (lowerText.includes(k)) {
                matchCount++;
                strengths.push(`Found skill: ${k}`);
            } else {
                missing.push(k);
            }
        });

        // Add some formatting checks
        if (text.length > 500) strengths.push("Good length");
        else missing.push("Resume is too short");

        // Calculate Resume Score
        let score = Math.min(100, Math.round((matchCount / keywords.length) * 100));
        // Bonus for length
        if (text.length > 1000) score = Math.min(100, score + 10);
        if (score === 0) score = 10; // Minimum score

        // Save Analysis
        const resume = await Resume.create({
            userId: req.user.id,
            extractedText: text, // In production, maybe don't store full text if huge
            resumeScore: score,
            strengths,
            weaknesses: missing.length > 0 ? missing.map(m => `Missing: ${m}`) : ['None'],
            missingSkills: missing
        });

        // Add missing skills to Skills DB if not present
        for (const skillName of missing) {
            const exists = await Skill.findOne({ userId: req.user.id, skillName });
            if (!exists) {
                await Skill.create({
                    userId: req.user.id,
                    skillName,
                    source: 'Resume Analysis'
                });
            }
        }

        // Trigger Score Update
        await updateJobReadiness(req.user.id);

        // Cleanup uploaded file
        fs.unlinkSync(req.file.path);

        res.status(201).json(resume);

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Resume processing failed' });
    }
};

// @desc    Get Resume Analysis
// @route   GET /api/resume/analysis
// @access  Private
const getResumeAnalysis = async (req, res) => {
    const resume = await Resume.findOne({ userId: req.user.id }).sort({ createdAt: -1 });
    if (resume) {
        res.json(resume);
    } else {
        res.status(404).json({ message: 'No resume found' });
    }
};

// Export updateJobReadiness for other controllers if needed
module.exports = {
    uploadResume,
    getResumeAnalysis,
    updateJobReadiness
};
