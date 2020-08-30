const mongoose = require('mongoose');
// const User = require('./user');

const regex = /^#[a-fA-F0-9]{6}/;


const optionsSchema = new mongoose.Schema({
    colors: {
        colorHeadBackground: {
            type: String,
            required: [true, 'Il manque la couleur du background des indications.'],
            trim: true,
            validate: {
                validator: (value) => { return !regex.test(value); }
            }
        },
        colorHeadFont: {
            type: String,
            required: [true, 'Il manque la couleur des indications.'],
            trim: true,
            validate: {
                validator: (value) => { return !regex.test(value); }
            }
        },
        colorAnswerOrigin: {
            type: String,
            required: [true, 'Il manque la couleur des cases lorsque pas de réponse.'],
            trim: true,
            validate: {
                validator: (value) => { return !regex.test(value); }
            }
        },
        colorAnswerNo: {
            type: String,
            required: [true, 'Il manque la couleur des cases lorsque réponse \'Non\'.'],
            trim: true,
            validate: {
                validator: (value) => { return !regex.test(value); }
            }
        },
        colorAnswerYes: {
            type: String,
            required: [true, 'Il manque la couleur des cases lorsque réponse \'Oui\'.'],
            trim: true,
            validate: {
                validator: (value) => { return !regex.test(value); }
            }
        },
        colorAnswerMaybeNo: {
            type: String,
            required: [true, 'Il manque la couleur des cases lorsque réponse \'Peut-être Non\'.'],
            trim: true,
            validate: {
                validator: (value) => { return !regex.test(value); }
            }
        },
        colorAnswerMaybeYes: {
            type: String,
            required: [true, 'Il manque la couleur des cases lorsque réponse \'Peut-être Oui\'.'],
            trim: true,
            validate: {
                validator: (value) => { return !regex.test(value); }
            }
        },
    },
    Owner: {
        type: mongoose.Schema.Types.ObjectId,
        require: true,
        ref: 'User'
    }
});


const Options = mongoose.model('Options', optionsSchema);


module.exports = Options;