// npm modules
const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
// const { __esModule } = require('validator/lib/isAlpha');  //  ?????


const userSchema = new mongoose.Schema({
    name: {
        type: String,
        unique: [true, 'Ce pseudo existe déjà.'],
        required: [true, 'Le pseudo est obligatoire !'],
        minlength: [3, 'Ce pseudo est trop court.'],
        trim: true
    },
    email: {
        type: String,
        unique: [true, 'Cet email existe déjà.'],
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
    tokens: [{
        token: {
            type: String,
            require: true
        }
    }]
},{
    timestamps: true
});


// take off the infos we don't want to sendback to user
// automaticaly called before sending to client =)
// here I use function(){} instead of ()=>{} because I need to use 'this'
userSchema.methods.toJSON = function () {
    const user = this
    const userObject = user.toObject()

    delete userObject.password
    delete userObject.tokens

    return userObject
}


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

    // asking if new password is the same as recorded password, so we'll know if it's already hashed, then hash it if it's not
    if (user.isModified('password')) {
        user.password = await bcrypt.hash(user.password, 10);
    }

    // we need to call the function next() provided by mongoose, so mongoose know that we have done all what we had to do
    next();
})

const User = mongoose.model('User', userSchema);

module.exports = User;