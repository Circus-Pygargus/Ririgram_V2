// npm modules
const mongoose = require('mongoose');


const gridSchema = new mongoose.Schema({
    rowsNb: {
        type: Number,
        required: true,
        min: 4,
        max: 30,
    },
    colsNb: {
        type: Number,
        required: true,
        min: 4,
        max: 30
    },
    gridSolution: {
        type: String,
        required: true,
        trim: true
    },
    clicksNbForPerfectGame: {
        type: Number,
        required: true
    },
    rowsHelpers: {
        type: Array,
        required: true,
    },
    maxRowHelpers: {
        type: Number,
        required: true
    },
    colsHelpers: {        
        type: Array,
        required: true
    },
    maxColHelpers: {
        type: Number,
        required: true
    },
    creator: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    bestTimeEasy: {
        type: Number,
        ref: 'UserTimeEasy'
    }, // ref UserTimeEasy.besTime
    easyNbTimesPlayed: {
        type: Number,
        required: true
    },
    easyNbTimesFinished: {
        type: Number
    },
    bestTimeHard: {
        type: Number,
        ref: 'UserTimeHard'
    }, // ref UserTimeEasy.besTime
    hardNbTimesPlayed: {
        type: Number,
        required: true
    },
    hardNbTimesFinished: {
        type: Number
    },
    nbVotesWorst: {
        type: Number
    },
    nbVotesBad: {
        type: Number
    },
    nbVoteNeutral: {
        type: Number
    },
    nbVoteGood: {
        type: Number
    },
    nbVoteBest: {
        type: Number
    },
    nbTotalVotes: {
        type: Number
    }
},{
    timestamps: true
});

gridSchema.virtual('userTimeEasys', {
    ref: 'UserTimeEasy',
    localField: '_id',
    foreignField: 'grid'
});

gridSchema.virtual('userTimeHards', {
    ref: 'UserTimeHard',
    localField: '_id',
    foreignField: 'grid'
});

gridSchema.virtual('startTimes', {
    ref: 'StartTime',
    localField: '_id',
    foreignField: 'grid'
});

gridSchema.virtual('refusedGrid', {
    ref: 'RefusedGrid',
    localField: '_id',
    foreignField: 'gridId'
});


const Grid = mongoose.model('Grid', gridSchema);

module.exports = Grid;