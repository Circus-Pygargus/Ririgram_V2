const express = require('express');
            
                        const hbs = require('hbs');

const path = require('path');

const Feedback = require('../models/feedback');

const auth = require('../middleware/auth');

const router = new express.Router();

const partialsPath = path.join(__dirname, '../../templates/partials');

                hbs.registerHelper('ifEquals', function(arg1, arg2, options) {
                    return (arg1 == arg2) ? options.fn(this) : options.inverse(this);
                });


// user wants to send a feedback
router.post('/feedback/new', auth, async (req, res) => {
    try {
        const { type, device, browser, message } = req.body;
        const user = req.user;
        const feedback = new Feedback({ type, device, browser, message, owner: user.name});
        await feedback.save();

        const messages = await Feedback.find({});

        res.render(`${partialsPath}/messages`, { user, messages }, (err, html) => {
            if (err) {
                return res.send({
                    error: 'Une erreur est survenue pendant le rendu des messages.'
                });
            }
            res.status(201).send({ html });
        });
    } catch(e) {
        console.log(e);
        res.status(500).send('Quelque chose s\'est mal déroulé pendant l\'enregistrement du message !');
    }
});


// user wants to see feedbacks
router.post('/feedback/list', auth, async (req, res) => {
    try {
        const user = req.user;
        const messages = await Feedback.find({});
        res.render(`${partialsPath}/messages`, { user, messages }, (err, html) => {
            if (err) {
                return res.send({
                    error: 'Une erreur est survenue pendant le rendu des messages.'
                });
            }
            res.send({ html });
        });
    } catch(e) {
        console.log(e);
        res.status(500).send('Quelque chose s\'est mal déroulé pendant l\'affichage des messages !');
    }
});

module.exports = router;