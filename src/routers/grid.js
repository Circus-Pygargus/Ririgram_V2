const express = require('express');

const moment = require('moment');
require("moment-duration-format");

const Grid = require('../models/grid');
const UserTimeHard = require('../models/userTimeHard');
const StartTime = require('../models/startTime');
const RefusedGrid = require('../models/refusedGrid');

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
        res.status(500).send({error: 'Quelque chose s\'est mal déroulé pendant la création de la grille.'});
    }
});


// User is loggued and asked to play a new game
router.post('/grid/new', auth, async (req, res) => {

    try {
        const {rowsNb, colsNb} = req.body;
        const user = req.user;
        await forceSquareGrid(rowsNb, colsNb);
        
        let foundedGrid = await findUnplayedGrid(rowsNb, colsNb, user._id);

        if (foundedGrid) {
            console.log('grille non jouée trouvée !');
            foundedGrid.hardNbTimesPlayed++;
            await foundedGrid.save();
            console.log(foundedGrid.hardNbTimesPlayed)
            const { rowsNb, colsNb, rowsHelpers, maxRowHelpers, colsHelpers, maxColHelpers, clicksNbForPerfectGame } = foundedGrid;
            const gridId = foundedGrid._id;
            let startTime = await StartTime.findOne({grid: gridId, owner: user._id});
            user.playedGrids++;
            await user.save();
            if (!startTime) {
                startTime = new StartTime({time: Date.now(), grid: gridId, owner: user._id})
            }
            else {
                startTime.time = Date.now();
            }

            await startTime.save();
            res.send({rowsNb, colsNb, rowsHelpers, maxRowHelpers, colsHelpers, maxColHelpers, clicksNbForPerfectGame, gridId });

        } 
        else {
            console.log('pas de grilles non jouées en BDD!');

            const { gridSolution, clicksNbForPerfectGame } = await computeGridSolution(rowsNb * colsNb);
            // Get rows and cols helpers
            const { rowsHelpers, maxRowHelpers, colsHelpers, maxColHelpers } = await computeHelpers(colsNb, gridSolution);
            let grid = new Grid({rowsNb, colsNb, gridSolution, clicksNbForPerfectGame, rowsHelpers, maxRowHelpers, colsHelpers, maxColHelpers, creator: user._id, easyNbTimesPlayed: 0, easyNbTimesFinished: 0, hardNbTimesPlayed: 1, hardNbTimesFinished: 0 });
            grid = await grid.save();
            const gridId = grid._id;
            user.playedGrids++;
            await user.save();
            let startTime = await StartTime.findOne({ grid: gridId, onwer: user._id });
            if (startTime) {
                startTime.time = Date.now();
            }
            else {
                startTime = new StartTime({time: Date.now(), grid: gridId, owner: user._id});
            }
        // let startTime = await StartTime.findOne({grid: gridId, owner: user._id});

        // if (!startTime) {
        //     startTime = new StartTime({time: Date.now(), grid: gridId, owner: user._id})
        // }
        // else {
        //     startTime.time = Date.now();
        // }
            await startTime.save();
            res.send({rowsNb, colsNb, rowsHelpers, maxRowHelpers, colsHelpers, maxColHelpers, clicksNbForPerfectGame, gridId });
        }

    } catch (e) {
        console.log(e);
        res.status(500).send({ error: 'Un problème est survenu pendant la création de la grille.' });
    }
});

// understand unplayed as never recorded as finished ;)
const findUnplayedGrid = async (rowsNb, colsNb, userId) => {
    console.log('searching a recorded grid')
    let hasFoundGrid = false;
    let gridsFound = await Grid.find({ rowsNb, colsNb });

    // !! juste pour tester !! ça retourne indéfiniment la première grille
    // return gridsFound[0];

    for (let i = 0, max = gridsFound.length; i < max; i++) {
        const userTimeHard = await UserTimeHard.findOne({ owner: userId, grid: gridsFound[i]._id});
        if (userTimeHard) continue;
        else {
            // check if user already played this but refused it at least once
            const refusedGrid = await RefusedGrid.findOne({ gridId:gridsFound[i]._id, userId, hard: true });
            if (refusedGrid) continue;
            else return gridsFound[i];
        }
    }
    if (!hasFoundGrid) return null;
};


const forceSquareGrid = (rowsNb, colsNb) => {
    if (rowsNb !== colsNb) throw new Error('Les nombre de lignes et de colonnes doivent être identiques !');
}


// User is logged and has just finished a grid
router.post('/grid/check', auth, async (req, res) => {
    try {
        const user = req.user;
        console.log('Vérif de grille')
        const receivedTime = Date.now();
        let isExactGrid = false;
        const { gridId, userSolution, tilesClicked } = req.body;
        const grid = await Grid.findById(gridId);
        if (!grid) throw new Error(`La grille demandée pour vérification par ${user.name} n\'existe pas !`);
        if (userSolution === grid.gridSolution) isExactGrid = true;
        if (!isExactGrid) {
            res.send({ userWins: false, message: 'Cette solution n\'est pas la bonne.' });
        }
        else {
            if (tilesClicked < grid.clicksNbForPerfectGame) throw new Error(`Le joueur ${user.name} a fini la grille avec un nombre coups trop petit !`);
            const startTime = await StartTime.findOne({ grid: gridId, owner: user._id });
            if (!startTime) throw new Error(`Le temps de départ pour la grille ${gridId} et le joueur ${user.name} n'existe pas !`);            

            let isUserFirstTimeFinish = false;
            let userBestBeaten = false;
            let gridBestTime = '';
            let IsGridBestTime = false;
            let worldRecordOwner = '';
            let isBrandNewGrid = false;

            const gridTime = receivedTime - startTime.time;
            // give last time for the moment
            let userBestTime = moment.duration(gridTime).format("H:m's''S");
            // first time a player finishes this grid
            if (!grid.bestTimeHard) {
                isBrandNewGrid = true;
                grid.bestTimeHard = gridTime;
                IsGridBestTime = true;
                gridBestTime = moment.duration(gridTime).format("H:m's''S");
            }
            // it's a world record
            else if (gridTime < grid.bestTimeHard) {
                grid.bestTimeHard = gridTime;
                IsGridBestTime = true;
                gridBestTime = moment.duration(gridTime).format("H:m's''S");
                worldRecordOwner = user.name;
            }
            // it's not a wr
            else {
                // get wr
                gridBestTime = moment.duration(grid.bestTimeHard).format("H:m's''S");
            
                // find world record owner
                const bestUserTimeHard = await UserTimeHard.findOne({grid: gridId, bestTime: grid.bestTimeHard});
                await bestUserTimeHard.populate('owner').execPopulate();
                worldRecordOwner = bestUserTimeHard.owner.name;
            }
            const userGridTime = moment.duration(gridTime).format("H:m's''S");
            grid.hardNbTimesFinished++;
            await grid.save();

            // get the nb of times played/finished (all players)
            const gridNbTimesPlayed = grid.hardNbTimesPlayed;
            const gridNbTimesFinished = grid.hardNbTimesFinished;

            // remove this grid as refused gird
            const refusedGrid = await RefusedGrid.findOne({ gridId, userId: user._id, hard: true });
            if (refusedGrid && refusedGrid.easy === false) {
                const refusedGridId = refusedGrid._id
                await refusedGrid.findByIdAndDelete({ refusedGridId });
            }
            else if (refusedGrid) {
                refusedGrid.hard = false;
                await refusedGrid.save();
            }
            
            let recordedResults = await UserTimeHard.findOne({ grid: gridId, owner: user._id });
            if (!recordedResults) {
                console.log('recorded result not found')
                isUserFirstTimeFinish = true;
                recordedResults = new UserTimeHard({ bestTime: gridTime, lastTime: gridTime, userClicksNb: tilesClicked, grid: gridId, owner: user._id });
            }
            else {
                if (gridTime < recordedResults.bestTime) {
                    recordedResults.bestTime = gridTime;
                    recordedResults.userClicksNb = tilesClicked;
                    userBestBeaten = true;
                }
                else  userBestTime = moment.duration(recordedResults.bestTime).format("H:m's''S");

                recordedResults.lastTime = gridTime;
                recordedResults.grid = gridId;
                recordedResults.owner = user._id;
            }
            await recordedResults.save();
            await StartTime.findByIdAndDelete(startTime._id);
            user.finishedGrids++;
            await user.save();
            

            // get the player ranking
            const allTimesHard = await UserTimeHard.find({ grid: gridId }).sort('bestTime');
            const nbplayers = allTimesHard.length;
            let playerPos = 0;
            for (let i = 0; i < nbplayers; i++) {
                console.log(allTimesHard[i].owner)
                if (allTimesHard[i].owner.toString() === user._id.toString()) {
                    playerPos = i + 1;
                    console.log('cooool')
                    break;
                }
            }
            const userRanking = `${playerPos}/${nbplayers}`;
            // console.log(allTimesHard)
            console.log(gridTime)
            console.log(user._id)


            res.send({ userWins: true, isBrandNewGrid, isUserFirstTimeFinish, clicksNbForPerfectGame: grid.clicksNbForPerfectGame, userBestTime, userBestBeaten, userGridTime, IsGridBestTime, gridBestTime, worldRecordOwner, userRanking, gridNbTimesPlayed, gridNbTimesFinished });
        }
    } catch (e) {
        console.log(e);
        res.status(500).send({ error: 'Un problème est survenu pendant la vérification de la grille.' });
    }
});

// User is logged and do think the grid he's playing is too hard
router.post('/grid/trashcan', auth, async (req, res) => {
    try {
        const userId = req.user._id;
        const { gridId } = req.body;
        let refusedGrid =   await RefusedGrid.findOne({ gridId, userId });
        if (refusedGrid) {
            refusedGrid.hardStatus === 'once' ? refusedGrid.hardStatus = 'confirmed'
                : refusedGrid.hardStatus === 'confirmed' ? refusedGrid.hardStatus = 'definitive'
                : refusedGrid.hardStatus === 'definitive' ? refusedGrid.hardStatus = 'forever'
                : refusedGrid.hardStatus === 'forever';
        }
        else {
            refusedGrid = new RefusedGrid({gridId, userId, easy: false, hard: true, hardStatus: 'once', hardUpdatedAt: Date.now()});
        }

        await refusedGrid.save();

        await StartTime.findOneAndDelete({ grid: gridId, onwer: userId });

        res.send({message: 'Vous ne verrez plus cette grille.'});

    } catch(e) {
        console.log(e);
        res.status(500).send({ error: 'Quelque chose s\'est mal déroulé pendant l\'exclusion de cette grille.' });
    }
});

// User is logged and wants all infos about a grid (can be called from grid list or from Victory window)
// router.post('/grid/infos/one', auth, async (req, res) => {
//     try {
//         const { gridId } = req.body;
//         const user = req.user;
//         const grid = await Grid.findById(gridId);
//         if (!grid) throw new Error(`La grille demandée pour infos par ${user.name} n\'existe pas !`);
//         // const grid = await grid.get
//         console.log(grid);
//     } catch (e) {
//         console.log(e);
//     }
// });


module.exports = router;