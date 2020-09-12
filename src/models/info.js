const mongoose = require('mongoose');

const infoSchema = new mongoose.Schema({
    version: {
        type: String,
        required: [true, 'Il manque la version !']
    },
    title: {
        type: String,
        required: [true, 'Il manque le titre !']
    },
    message: {
        type: String,
        required: [true, 'Il manque le message !']
    }
}, {
    timestamps: true
});

const Info = mongoose.model('Info', infoSchema);

module.exports = Info;