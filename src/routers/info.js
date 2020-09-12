const express = require('express');

const Info = require('../models/info');

const auth = require('../middleware/auth');

const router = new express.Router();


// Admin wants to record a new info
router.post('/infos/new', auth, async (req, res) => {
    try {
        const { version, title, message } = req.body;
        const info = new Info({ version, title, message });
        await info.save();
        res.status(201).send({ info });
    } catch(e) {
        console.log(e);
        res.status(500).send({ error: e.message });
    }
});


module.exports = router;