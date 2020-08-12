const express = require('express');

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

        res.send({ gridSolution, clicksNbForPerfectGame, rowsNb, colsNb, rowsHelpers, maxRowHelpers, colsHelpers, maxColHelpers });
    }
    catch (e) {
        console.log(e)
        res.status(500).send('Quelque chose s\'est mal déroulé pendant la création de la grille.');
    }
});


module.exports = router;