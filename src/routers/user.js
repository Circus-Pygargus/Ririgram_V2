
const path = require('path');

const express = require('express');

const User = require('../models/user');
const Options = require('../models/options');

const auth = require('../middleware/auth');

const defaultColors = require('../../defalut_values/colors');

const router = new express.Router();


const partialsPath = path.join(__dirname, '../../templates/partials');


// Create a new user
router.post('/users', async (req, res) => {
    const user = new User(req.body);

    try {
        // first try to save user (will check before saving)
        await user.save();
        // no caught error, generate a token and save user again
        const token = await user.generateAuthToken();

        res.render(`${partialsPath}/navLogged`, (err, html) => {
            if (err) {
                return res.send({
                    error: 'Une erreur est survenue pendant le rendu de la barre de navigation'
                })
            }

            res.status(201).send({ user, token, html });
        });

    } catch (e) {
        res.status(400).send(e);
        console.log(e);
    }
});


// User login
router.post('/users/login', async (req, res) => {
    try {
        // get user and give him a token
        const user = await User.findByCredentials(req.body.email, req.body.password);
        const token = await user.generateAuthToken();

        // get user options
        let options = await Options.findOne({ owner: user._id});
        if (!options) {
            options = defaultColors;
        }
console.log(user)
        res.render(`${partialsPath}/navLogged`, (err, html) => {
            if (err) {
                return res.send({
                    error: 'Une erreur est survenue pendant le rendu de la barre de navigation.'
                })
            }
            
            res.send({ user, token, options, html });
        })

    } catch (e) {
        res.status(400).send(e);
        console.log(e);
    }
});


// User Logout from one device
router.post('/users/logout', auth, async (req, res) => {
    try {
        // Here we keep all token not equal to the req.token
        req.user.tokens = req.user.tokens.filter((token) => {
            return token.token !== req.token;
        });

        await req.user.save();        

        res.render(`${partialsPath}/navNotLogged`, (err, html) => {
            if (err) {
                return res.send({
                    error: 'Une erreur est survenue pendant le rendu de la barre de navigation.'
                })
            }
            
            res.send({ html });
        })

    } catch (e) {
        res.status(500).send(e);
        console.log(e);
    }
});


// User Logout from all devices
router.post('/users/logoutall', auth, async (req, res) => {
    try {
        req.user.tokens.splice(0, req.user.tokens.length);

        await req.user.save();      

        res.render(`${partialsPath}/navNotLogged`, (err, html) => {
            if (err) {
                return res.send({
                    error: 'Une erreur est survenue pendant le rendu de la barre de navigation.'
                })
            }
            
            res.send({ html });
        })

    } catch (e) {
        res.statsu(500).send(e);
    }
});


// Users List
router.get('/users/list', async (req, res) => {
    try {
        const users = await User.find({});

        res.send(users);

    } catch (e) {
        res.send(500).send();
    }
});


module.exports = router;