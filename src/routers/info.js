const express = require('express');

const path =require('path');

const moment = require('moment');

const Info = require('../models/info');

const auth = require('../middleware/auth');
const { query } = require('express');

const router = new express.Router();

const partialsPath = path.join(__dirname, '../../templates/partials');

const nl2br = require('../utils/nl2br');

// List all infos doesn't exist, as all title infos are sent to user at connexion


// Admin wants to record a new info
router.post('/infos/new', auth, async (req, res) => {
    try {
        const { version, title } = req.body;
        // replace any /r/n written by textarea by some <br>
        const message = nl2br(req.body.message, false)
        const info = new Info({ version, title, message });
        await info.save();
        // get infos in reverse updated time order
        Info.find({}, null, {sort: {updatedAt: -1}}, (err, infos) => {
            if (err) return res.send({error: 'il y a un problème ici !'});
            // remove message of each info found
            for (let i = 0, max = infos.length; i < max; i++) {
                let infoObject = infos[i].toObject();
                delete infoObject.message;
                infos[i] = new Info(infoObject);
            }
            res.render(`${partialsPath}/infos`, { infos }, (err, html) => {
                if (err) {
                    return res.send({
                        error: 'Une erreur est survenue pendant le rendu des infos'
                    });
                }

                res.status(201).send({ html });
            });
        });
        
    } catch(e) {
        console.log(e);
        res.status(500).send({ error: e.message });
    }
});


// user wants to see an info message
router.post('/infos/one', auth, async (req, res) => {
    try {
        const infoId = req.body.infoId;
        if (!infoId) return res.status(401).send({error: 'Impossible d\'afficher un message sans son identifiant ! Merci d\'envoyer un message à ce sujet.'});
        const message = await Info.GetOneInfoMessage(infoId);
        res.send({ message });
    }
    catch(e) {
        console.log(e);
        res.status(500).send({ error: e.message });
    }
});


// Admin wants to change an info
router.post('/infos/update/one', auth, async (req, res) => {
    return res.send('Cette fonctionnalité a été désactivée !!');
    const isAdmin = req.user.role === 'admin' ? true : false;
    if (!isAdmin) return res.status(401).send({ error: 'Seul un admin peut effectuer cette opération !' });

    try {
        const { _id, version, title, message } = req.body;

        const info = await Info.findById({ _id });
        info.version = version;
        info.title = title;
        info.message = await nl2br(message, false);
        await info.save();
        // get infos in reverse updated time order
        Info.find({}, null, {sort: {updatedAt: -1}}, (err, infos) => {
            if (err) return res.send({error: 'il y a un problème ici !'});
            // remove message of each info found
            for (let i = 0, max = infos.length; i < max; i++) {
                let infoObject = infos[i].toObject();
                delete infoObject.message;
                infos[i] = new Info(infoObject);
            }
            res.render(`${partialsPath}/infos`, { isAdmin, infos }, (err, html) => {
                if (err) {
                    return res.send({
                        error: 'Une erreur est survenue pendant le rendu des infos'
                    });
                }

                res.status(201).send({ html });
            });
        });
    } 
    catch(e) {
        console.log(e);
        res.status(500).send(e.error);
    }
});





module.exports = router;