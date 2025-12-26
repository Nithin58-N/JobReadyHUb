const Interview = require('../models/Interview');
const User = require('../models/User');
const { updateJobReadiness } = require('../utils/scoreHelper');

// Mock Questions Database
const questionsDB = {
    'Software Engineer': [
        'Explain the difference between REST and GraphQL.',
        'What is the event loop in JavaScript?',
        'How do you handle state management in React?',
        'Explain ACID properties in databases.',
        'What is Big O notation?'
    ],
    'Data Analyst': [
        'What is the difference between inner join and outer join?',
        'How do you handle missing data in a dataset?',
        'Explain p-value in statistics.',
        'What is a pivot table?',
        'How do you visualize data distributions?'
    ],
    'Cybersecurity': [
        'What is a DDoS attack?',
        'Explain the concept of public key cryptography.',
        'What is SQL injection and how to prevent it?',
        'Explain the OSI model.',
        'What is a firewall?'
    ],
    'Web Developer': [
        'What is the box model in CSS?',
        'Explain semantic HTML.',
        'What are Promises in JavaScript?',
        'How does HTTPS work?',
        'What is responsive design?'
    ],
    'Default': [
        'Tell me about a challenging project you worked on.',
        'What are your strengths and weaknesses?',
        'Where do you see yourself in 5 years?'
    ]
};

// @desc    Start Mock Interview (Get Questions)
// @route   POST /api/interview/start
// @access  Private
const startInterview = async (req, res) => {
    const { type } = req.body; // HR or Technical
    const user = await User.findById(req.user.id);
    const goal = user.careerGoal;

    let questionsList = [];
    if (type === 'HR') {
        questionsList = questionsDB['Default'].slice(0, 3);
    } else {
        const pool = questionsDB[goal] || questionsDB['Default'];
        // Pick random 3
        questionsList = pool.sort(() => 0.5 - Math.random()).slice(0, 3);
    }

    // Format for frontend
    const formattedQuestions = questionsList.map(q => ({
        questionText: q,
        userAnswer: '',
        feedback: '',
        score: 0
    }));

    // We don't save yet, we send to frontend to answer. 
    // Or we could create a pending interview. 
    // For MVP flow, frontend sends back answers. 
    res.json({ questions: formattedQuestions });
};

// @desc    Submit Interview Answers
// @route   POST /api/interview/submit
// @access  Private
const submitInterview = async (req, res) => {
    const { type, answers } = req.body; // answers: [{ questionText, userAnswer }]

    if (!answers || !Array.isArray(answers)) {
        return res.status(400).json({ message: 'Invalid answers format' });
    }

    let totalScore = 0;
    const evaluatedAnswers = answers.map(a => {
        // Simple mock evaluation logic
        // 1. Length check
        // 2. Keyword check check (simulated)
        let qScore = 0;
        let feedback = "Answer is too short.";

        if (a.userAnswer.length > 50) {
            qScore += 40;
            feedback = "Good length. ";
        }
        if (a.userAnswer.length > 100) {
            qScore += 20;
            feedback += "Detailed answer. ";
        }

        // Random "AI" variance
        qScore += Math.floor(Math.random() * 30);

        if (qScore > 100) qScore = 100;

        totalScore += qScore;

        return {
            ...a,
            score: qScore,
            feedback: feedback + "Keep practicing relevant terminology."
        };
    });

    const interviewScore = Math.round(totalScore / answers.length);

    const interview = await Interview.create({
        userId: req.user.id,
        type,
        questions: evaluatedAnswers,
        interviewScore,
        overallFeedback: interviewScore > 70 ? "Great job! You are ready." : "Needs improvement in technical depth."
    });

    await updateJobReadiness(req.user.id);

    res.status(201).json(interview);
};

module.exports = {
    startInterview,
    submitInterview
};
