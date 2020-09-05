// npm modules
const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// const Grid = require('./grid');


const userSchema = new mongoose.Schema({
    name: {
        type: String,
        unique: true,
        required: [true, 'Le pseudo est obligatoire !'],
        minlength: [3, 'Ce pseudo est trop court.'],
        trim: true
    },
    email: {
        type: String,
        unique: true,
        required: [true, 'L\'email est obligatoire !'],
        lowercase: true,
        trim: true,
        validate(value) {
            if (!validator.isEmail(value)) {
                throw new Error('Cette adresse email est invalide !');
            }
        }
    },
    password: {
        type: String,
        required: [true, 'Le mot de passe est obligatoire !'],
        trim: true,
        minlength: [7, 'Ce mot de passe est trop petit !'],
        validate: {
            validator: (value) => {
                const regex = /password/i;
                return !regex.test(value.toLowerCase());
            },
            message: 'Vous ne pouvez pas utiliser \'password\' dans le mot de passe !'
        }
    },
    // c
    role: {
        type: String,
        validate: {
            validator: (value) => {
                const regex = /admin/i;
                return regex.test(value);
            },
            message: 'Le rôle devrait être \'admin\' !'
        }
    },
    visits: {
        type: Number
    },
    playedGrids: {
        type: Number
    },
    finishedGrids: {
        type: Number
    },
    tokens: [{
        token: {
            type: String,
            required: true
        }
    }]
},{
    timestamps: true
});

// Here nothing will be stored, we're just giving the relationship between User and Grid to mongoose
userSchema.virtual('grids', {
    ref: 'Grid',
    localField: '_id',
    foreignField: 'creator'
    // Here we have to understand that Grid.creator is related to user id (they are the same) 
});

userSchema.virtual('userTimeEasys', {
    ref: 'UserTimeEasy',
    localField: '_id',
    foreignField: 'owner'
});

userSchema.virtual('userTimeHards', {
    ref: 'UserTimeHard',
    localField: '_id',
    foreignField: 'owner'
});

userSchema.virtual('startTimes', {
    ref: 'StartTime',
    localField: '_id',
    foreignField: 'owner'
});

userSchema.virtual('feedbacks', {
    ref: 'Feedback',
    localField: 'name',
    foreignField: 'owner'
});

userSchema.virtual('feedbacks', {
    ref: 'Feedback',
    localField: 'name',
    foreignField: 'answerOwner'
});



// take off the infos we don't want to sendback to user
// automaticaly called before sending to client =)
// here I use function(){} instead of ()=>{} because I need to use 'this'
userSchema.methods.toJSON = function () {
    const user = this;
    const userObject = user.toObject();

    delete userObject.password;
    delete userObject.tokens;

    return userObject;
};


// Generate an authentification token
userSchema.methods.generateAuthToken = async function () {
    const user = this;
    // build the token
    const token = jwt.sign({ _id: user._id.toString() }, 'thisismysecretwordfortoken');
    // store token in db
    user.tokens = user.tokens.concat({ token });
    await user.save();

    return token;
}


// Identification of a user
userSchema.statics.findByCredentials = async (email, password) => {
    // first find the user with the given email
    const user = await User.findOne({ email });

    // if not found, we throw an error, it will be caught by the try catch when calling this function
    if (!user) {
        // we give a few infos as possible
        throw new Error('Impossible de se logguer ! Le pseudo et/ou le mot de passe est invalide.');
    }

    // check password
    const isMatch = await bcrypt.compare(password, user.password);

    // invalid password
    if (!isMatch) {
        throw new Error('Impossible de se logguer ! Le pseudo et/ou le mot de passe est invalide.');
    }

    return user;
}


// Hash the plain text password before saving it
userSchema.pre('save', async function (next) {
    const user = this;

    // can be removed once very first player is registred
    // change Circus with Admin nickname
    if (user.name === 'Circus') user.role = 'admin';

    // asking if new password is the same as recorded password, so we'll know if it's already hashed, then hash it if it's not
    if (user.isModified('password')) {
        user.password = await bcrypt.hash(user.password, 10);
    }

    // we need to call the function next() provided by mongoose, so mongoose know that we have done all what we had to do
    next();
})


// Search for a unique property error
userSchema.post('save', (error, doc, next) => {
    if (error.code === 11000) {
        /* error message is something like : MongoError: E11000 duplicate key error collection: ririgram.users index: email_1 dup key: { email: "test@test.fr" }
        so here we get the incriminated property */
        const property = error.message.split('{ ').pop().split(':')[0];
        switch (property) {
            case 'name': {
                next(new Error('Ce pseudo existe déjà !'));
                break;
            }
            case 'email': {
                next(new Error('Cet email est déjà enregistré !'));
                break;
            }
        }
    }
    next()
})

const User = mongoose.model('User', userSchema);

module.exports = User;