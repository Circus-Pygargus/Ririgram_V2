const express = require('express');

const User = require('../models/user');

const auth = require('../middleware/auth');
const { __esModule } = require('validator/lib/isAlpha');

const router = new express.Router();


// Create a new user
router.post('/users', async (req, res) => {
    const user = new User(req.body);

    try {
        // first try to save user (will check before saving)
        await user.save();
        // no caught error, generate a token and save user again
        const token = await user.generateAuthToken();

        res.status(201).send({ user, token });
    } catch (e) {
        res.status(400).send(e);
        console.log(e);
    }
});

module.exports = router;