const express = require('express');
            
const hbs = require('hbs');

const path = require('path');

const Feedback = require('../models/feedback');

const auth = require('../middleware/auth');

const router = new express.Router();

const partialsPath = path.join(__dirname, '../../templates/partials');

const nl2br = require('../utils/nl2br');


// user wants to send a feedback
router.post('/feedback/new', auth, async (req, res) => {
    try {
        const { type, device, browser } = req.body;
        // replace any /r/n by <br>
        const message = nl2br(req.body.message, false);
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
        res.status(500).send({ error: 'Quelque chose s\'est mal déroulé pendant l\'enregistrement du message !' });
    }
});


// user wants to see feedbacks
router.post('/feedback/list', auth, async (req, res) => {
    try {
        const user = req.user;
        const messages = await Feedback.find({});
        
        for (let i = 0, max = messages.length; i < max; i++) {
            messages[i] = messages[i].changeTimeFormat();
        }

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
        res.status(500).send({ error: 'Quelque chose s\'est mal déroulé pendant l\'affichage des messages !' });
    }
});


// Admin wants to give an answer to a user feedback
router.post('/feedback/answer', auth, async (req, res) => {
    try {
        const user = req.user;

        if (user.role !== 'admin') return res.send({ error: 'Seul un admin peu envoyer une réponse !' });
        
        const feedback = await Feedback.findById(req.body.feedbackId);

        if (feedback.answer) return res.send({ error: 'Une réponse à déjà été donnée !' });
        
        feedback.answer = req.body.message;
        feedback.answerOwner = req.user.name;

        await feedback.save();
        
        const messages = await Feedback.find({});
        
        for (let i = 0, max = messages.length; i < max; i++) {
            messages[i] = messages[i].changeTimeFormat();
        }

        res.render(`${partialsPath}/messages`, { user, messages }, (err, html) => {
            if (err) {
                return res.send({
                    error: 'Une erreur est survenue pendant le rendu des messages.'
                });
            }
            res.send({ html });
        });

    } catch (e) {
        console.log(e);
        res.status(500).send({ error: 'Un problème a eu lieu pendant l\'enregistrement du message' });
    }
});

module.exports = router;