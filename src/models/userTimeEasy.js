const mongoose = require('mongoose');

const usertimeEasy = new mongoose.Schema({
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

usertimeEasy.virtual('grids', {
    ref: 'Grid',
    localField: 'bestTime',
    foreignField: 'bestTimeEasy'
});

const UsertimeEsay = mongoose.model('UserTimeEasy', usertimeEasy);

module.exports = UserTimeEsay;