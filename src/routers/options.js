const express = require('express');

const Options = require('../models/options');

const auth = require('../middleware/auth');


const router = new express.Router();


// Options List
router.get('/options', auth, (req, res) => {
        res.render('options', {
            options: req.options
        });
        res.send(e);
});


module.exports = router;