const mongoose = require('mongoose');

const interviewSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    type: {
        type: String,
        enum: ['HR', 'Technical'],
        required: true,
    },
    questions: [{
        questionText: String,
        userAnswer: String,
        feedback: String,
        score: Number // Per question score if needed
    }],
    interviewScore: {
        type: Number,
        required: true,
    },
    overallFeedback: {
        type: String,
    }
}, {
    timestamps: true,
});

module.exports = mongoose.model('Interview', interviewSchema);
