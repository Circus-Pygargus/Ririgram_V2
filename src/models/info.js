const mongoose = require('mongoose');

const infoSchema = new mongoose.Schema({
    version: {
        type: String,
        required: true
    },
    title: {
        type: String,
        required: true
    },
    message: {
        type: String,
        required: true
    }
}, {
    timestamps: true
});

const Info = mongoose.model('Info', infoSchema);

module.exports = Info;