const express = require('express');

const Grid = require('../models/grid');
const UserTimeHard = require('../models/userTimeHard');
const StartTime = require('../models/startTime');

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
        console.log(rowsNb, colsNb)
        await forceSquareGrid(rowsNb, colsNb);
        let gridsFound = await Grid.find({ rowsNb, colsNb });
        console.log('gridsFound');
        console.log(gridsFound);

        gridsFound = await gridsFound.filter( async (gridFound) => {
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
            console.log('grille non jouée trouvée !');
            const { rowsNb, colsNb, rowsHelpers, maxRowHelpers, colsHelpers, maxColHelpers, clicksNbForPerfectGame } = gridsFound[0];
            let startTime = await StartTime.findOne({grid: gridsFound[0]._id, owner: req.user._id});
            if (!startTime) {
                startTime = new StartTime({time: Date.now(), grid: gridsFound[0]._id, owner: req.user._id})
            }
            else {
                startTime.time = Date.now();
            }

            await startTime.save();
            res.send({rowsNb, colsNb, rowsHelpers, maxRowHelpers, colsHelpers, maxColHelpers, clicksNbForPerfectGame});

        } 
        else {
            console.log('pas de grilles non jouées en BDD!');
            const { gridSolution, clicksNbForPerfectGame } = await computeGridSolution(rowsNb * colsNb);
            console.log(gridSolution)
            // Get rows and cols helpers
            const { rowsHelpers, maxRowHelpers, colsHelpers, maxColHelpers } = await computeHelpers(colsNb, gridSolution);
            console.log(maxColHelpers)
            let grid = new Grid({rowsNb, colsNb, gridSolution, clicksNbForPerfectGame, rowsHelpers, maxRowHelpers, colsHelpers, maxColHelpers, creator: req.user._id});
            grid = await grid.save();
            const startTime = new StartTime({time: Date.now(), grid: grid._id, owner: req.user._id});
            await startTime.save();
            res.send({rowsNb, colsNb, rowsHelpers, maxRowHelpers, colsHelpers, maxColHelpers, clicksNbForPerfectGame});
        }

    } catch (e) {
        console.log(e);
        res.status(500).send('Un problème est survenu pendant la création de la grille.');
    }
});


const forceSquareGrid = (rowsNb, colsNb) => {
    if (rowsNb !== colsNb) throw new Error('Les nombre de lignes et de colonnes doivent être identiques !');
}


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
