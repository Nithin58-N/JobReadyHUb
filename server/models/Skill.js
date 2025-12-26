const mongoose = require('mongoose');

const skillSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    skillName: {
        type: String,
        required: true,
    },
    status: {
        type: String,
        enum: ['Not Started', 'Completed'],
        default: 'Not Started',
    },
    source: {
        type: String, // 'Resume Gap', 'Goal Recommendation', etc.
        default: 'Goal Recommendation'
    }
}, {
    timestamps: true,
});

module.exports = mongoose.model('Skill', skillSchema);
