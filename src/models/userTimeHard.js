const mongoose = require('mongoose');

const userTimeHard = new mongoose.Schema({
    bestTime: {
        type: Number,
        required: true
    },
    lastTime: {
        type: Number,
        required: true
    },
    userClicksNb: {
        type: Number,
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
    },
    vote: {
        type: String,
        trim: true
    }
},{
    timestamps: true
});

userTimeHard.virtual('grids', {
    ref: 'Grids',
    localField: 'bestTime',
    foreignField: 'bestTimeHard'
});

const UserTimeHard = mongoose.model('UserTimeHard', userTimeHard);

module.exports = UserTimeHard;