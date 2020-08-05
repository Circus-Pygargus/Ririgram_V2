const jwt = require('jsonwebtoken');

const User = require('../models/user');


const auth = async (req, res, next) => {
    try {
        // Get token from request
        /* here replace() will remove the 'Bearer ' placed in front of the token
            If 'Bearer ' isn't found, it will throw an error that will be caught by the catch */
        const token = req.header('Authorization').replace('Bearer ', '');
        // here I use as second argument the secret word used in /models/user.js to build the token
        const decoded = jwt.verify(token, 'thisismysecretwordfortoken');
        // find the user with the correct _id and check if given token exists in user.tokens
        const user = await User.findOne({ _id: decoded._id, 'tokens.token': token });

        if (!user) {
            throw new Error();
        }

        // add token to req so we can delete it easily if user is logging out
        req.token = token;
        // add the found user in the request
        req.user = user;

        // Everything is fine, call the async function given in the route
        next();
    } catch (e) {
        res.status(401).send('Erreur: Vous devez d\'abord vous identifier.');
    }
}

module.exports = auth;