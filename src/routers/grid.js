const express = require('express');

const Grid = require('../models/grid');
const UserTimeHard = require('../models/userTimeHard');

const auth = require('../middleware/auth');
const computeGridSolution = require('../utils/compute-grid-solution');
const computeHelpers = require('../utils/compute-helpers');

const router = new express.Router();


// User is not logged and wants to test the game
router.post('/grid/test-game', async (req, res) => {
    try {
        // Compute a 4 rows 4 columns grid for the user
        const rowsNb = 4,
            colsNb = 4;
        const { gridSolution, clicksNbForPerfectGame } = await computeGridSolution(rowsNb * colsNb);
        // Get rows and cols helpers
        const { rowsHelpers, maxRowHelpers, colsHelpers, maxColHelpers } = await computeHelpers(colsNb, gridSolution);
        res.status(201).send({ gridSolution, clicksNbForPerfectGame, rowsNb, colsNb, rowsHelpers, maxRowHelpers, colsHelpers, maxColHelpers });
    }
    catch (e) {
        console.log(e)
        res.status(500).send('Quelque chose s\'est mal déroulé pendant la création de la grille.');
    }
});


// User is loggued and asked to play a new game
router.post('/grid/new', auth, async (req, res) => {
    try {
        const {rowsNb, colsNb} = req.body;
        const gridsFound = await Grid.find({ rowsNb, colsNb });
        console.log('gridsFound');
        console.log(gridsFound);

        let isnewGridFound = false;

        gridsFound = gridsFound.filter((gridFound) => {
            console.log('gridFound');
            console.log(gridFound);
            const userTimeHard = await UserTimeHard.findOne({ owner: req.user._id, grid: gridFound._id});
            console.log('userTimeHard')
            console.log(userTimeHard)
            if (!userTimeHard) return true;
            else return false;
        });
        // at least one grid not played by this user found in DB
        if (gridsFound.length > 0) {
            // enregistrer quelque part le chrono de départ !!
        } 

    } catch (e) {
        console.log(e);
        res.status(500).send('Un problème est survenu pendant la création de la grille.');
    }
});


module.exports = router;

/*
router(grid, auth, (req, res) => {
    si auth ok
    recherche de grille en bdd non jouée par le joueur (ne pas oublier la difficulté)
    si !grille -> création complète de grille
        enregistrement grille en bdd
        envoi de la grille
    si grille -> envoi de la grille
})
*/
