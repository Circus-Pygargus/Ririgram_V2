const express = require('express');

const path = require('path');

const Feedback = require('../models/feedback');

const auth = require('../middleware/auth');

const router = new express.Router();

const partialsPath = path.join(__dirname, '../../templates/partials');


// user wants to send a feedback
router.post('/feedback/new', auth, async (req, res) => {
    try {
        const { type, device, browser, message } = req.body;
        const userName = req.user.name;
        const feedback = new Feedback({ type, device, browser, message, owner: userName});
        await feedback.save();

        const messages = await Feedback.find({});

        res.render(`${partialsPath}/messages`, { userName, messages }, (err, html) => {
            if (err) {
                return res.send({
                    error: 'Une erreur est survenue pendant le rendu des messages.'
                });
            }
            res.status(201).send({ html });
        });
        console.log(feedback)
    } catch(e) {
        console.log(e);
        res.status(500).send('Quelque chose s\'est mal déroulé pendant l\'enregistrement du message !');
    }
});

module.exports = router;
