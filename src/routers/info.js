const express = require('express');

const path =require('path');

const Info = require('../models/info');

const auth = require('../middleware/auth');
const { query } = require('express');

const router = new express.Router();

const partialsPath = path.join(__dirname, '../../templates/partials');


// Admin wants to record a new info
router.post('/infos/new', auth, async (req, res) => {
    try {
        const { version, title, message } = req.body;
        const info = new Info({ version, title, message });
        await info.save();
        // get infos in reverse updated time order
        Info.find({}, null, {sort: {updatedAt: -1}}, function(err, infos){
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


module.exports = router;