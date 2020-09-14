const mongoose = require('mongoose');


const refusedGridSchema = new mongoose.Schema({
    gridId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Grid'
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    easy: {
        type: Boolean,
        required: true
    },
    easyStatus: {
        type: String,
        validate: {
            validator: (value) => {
                const regex = /once|confirmed|definitive|forever/i;
                return regex.test(value);
            },
            message: 'Le status enregistré pour le mode facile de cette grille n\'est pas répertorié.'
        },
        trim: true
    },
    easyUpdatedAt: {
        // here I don't tell mongoose it's a date as I don't know how to prevent it to fill it automaticaly
        type: String,
        trim: true
    },
    hard: {
        type: Boolean,
        required: true
    },
    hardStatus: {
        type: String,
        validate: {
            validator: (value) => {
                const regex = /once|confirmed|definitive|forever/i;
                return regex.test(value);
            },
            message: 'Le status enregistré pour le mode difficile de cette grille n\'est pas répertorié.'
        },
        trim: true
    },
    hardUpdatedAt: {
        // here I don't tell mongoose it's a date as I don't know how to prevent it to fill it automaticaly
        type: String,
        trim: true
    }
}, {
    timestamps: true
});


const RefusedGrid = mongoose.model('RefusedGrid', refusedGridSchema);

module.exports = RefusedGrid;