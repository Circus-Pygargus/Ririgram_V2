const mongoose = require('mongoose');

const startTimeSchema = new mongoose.Schema({
    time: {
        type: Date,
        required: true
    },
    grid: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Grid'
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    }
}, {
    timestamps: true
});

const StartTime = mongoose.model('StartTime', startTimeSchema);

module.exports = StartTime;