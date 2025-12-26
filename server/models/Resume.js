const mongoose = require('mongoose');

const resumeSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    extractedText: {
        type: String,
        required: true,
    },
    resumeScore: {
        type: Number,
        required: true,
    },
    strengths: [{
        type: String,
    }],
    weaknesses: [{
        type: String,
    }],
    missingSkills: [{
        type: String,
    }]
}, {
    timestamps: true,
});

module.exports = mongoose.model('Resume', resumeSchema);
