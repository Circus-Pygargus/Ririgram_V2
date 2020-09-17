// for both logged an not logged users
const victoryDiv = document.querySelector('#victory');
const victoryCloseBtn = document.querySelector('#victory-close');
const victoryPlayAnother = document.querySelector('#victory-play-another');

// only for unlogged players
const congrats = document.querySelector('#congrats');
const clicksNbSpan = document.querySelector('#clicks-nb-done');
const specialCongrats = document.querySelector('#special-congrats');
const tooManyClicks = document.querySelector('#too-many-clicks');
const clicksMinSpan = document.querySelector('#clicks-nb-min');
const youShouldRegister = document.querySelector('#you-should-register');

// only for logged players
const playerClicksNb = document.querySelector('#player-clicks-nb');
const perfectGame = document.querySelector('#perfect-game');
const clicksNbMini = document.querySelector('#clicks-nb-mini');
const chrono = document.querySelector('#chrono');
const personalBestDiv = document.querySelector('#personal-best-div');
const personalBestSpan = document.querySelector('#personal-best-span');
const personalBestCheck = document.querySelector('#personal-best-check');
const worldRecord = document.querySelector('#world-record');
const worldRecordCheck = document.querySelector('#world-record-check');
const worldRecordUnbeaten = document.querySelector('#world-record-unbeaten');
const wrTime = document.querySelector('#wr-time');
const wrOwner = document.querySelector('#wr-owner');
const playerPositionDiv = document.querySelector('#player-position-div');
const playerPositionSpan = document.querySelector('#player-position-span');
const timesNb = document.querySelector('#times-nb');
const nbTimesPlayed = document.querySelector('#nb-times-played');
const nbTimesFinished = document.querySelector('#nb-times-finished');

const victoryChooseGridBtn = document.querySelector('#victory-choose-grid');
console.log(playerClicksNb)

// User just won a grid
const victory = (isUserLogged, tilesCliksNb, clicksNbForPerfectGame, isBrandNewGrid, isUserFirstTimeFinish,  userBestTime, userBestBeaten,  userGridTime, IsGridBestTime, gridBestTime, worldRecordOwner, userRanking, gridNbTimesPlayed, gridNbTimesFinished) => {

    
    document.querySelector('#main-title').classList.remove('in-game');

    cleanVictoryDiv(isUserLogged);

    if (!isUserLogged) {
        console.log('partie gagnée !');

        (tilesCliksNb > 1) ? clicksNbSpan.innerHTML = tilesCliksNb + ' coups' : clicksNbSpan.innerHTML = tilesCliksNb + ' coup';

        if (tilesCliksNb === clicksNbForPerfectGame) {
            specialCongrats.classList.remove('d-none');
        }
        else {
            (tilesCliksNb > 1) ? clicksMinSpan.innerHTML = clicksNbForPerfectGame + ' coups' : clicksMinSpan.innerHTML = clicksNbForPerfectGame + ' coup';
            tooManyClicks.classList.remove('d-none');
        }

        // As user is not logged, display this
        youShouldRegister.classList.remove('d-none');
        // and hide that
        trashCanBtn.classList.remove('d-none'); 
    
    }
    // user is logged
    else {
        console.log('partie gagnée !!');
        // (tilesCliksNb > 1) ? clicksNbSpan.innerHTML = tilesCliksNb + ' coups' : clicksNbSpan.innerHTML = tilesCliksNb + ' coup';

        // if (tilesCliksNb === clicksNbForPerfectGame) {
        //     specialCongrats.classList.remove('d-none');
        // }
        // else {
        //     (tilesCliksNb > 1) ? clicksMinSpan.innerHTML = clicksNbForPerfectGame + ' coups' : clicksMinSpan.innerHTML = clicksNbForPerfectGame + ' coup';
        //     tooManyClicks.classList.remove('d-none');
        // }
        // clicks nb
        playerClicksNb.innerHTML = `Nombre de coups : ${tilesCliksNb}`;
        if (tilesCliksNb === clicksNbForPerfectGame) {
            perfectGame.classList.remove('d-none');
        }
        else {
            clicksNbMini.innerHTML = `Réalisable en ${clicksNbForPerfectGame} coups `;
            clicksNbMini.classList.remove('d-none');
        }
        // user grid time
        chrono.innerHTML = `Ton chrono : ${userGridTime}`;
        // not user best grid time
        if (!userBestBeaten && !isUserFirstTimeFinish) {
            personalBestSpan.innerHTML = userBestTime;
            personalBestSpan.classList.remove('d-none');
            personalBestCheck.classList.add('d-none');
            // stop pushing it up (because no more check svg inside)
            personalBestDiv.classList.remove('checked');
            personalBestDiv.classList.remove('d-none');
        }
        // user best grid time
        else if (userBestBeaten) {
            personalBestSpan.classList.add('d-none');
            personalBestCheck.classList.remove('d-none');
            // will push up the div (because of the check svg inside it)
            personalBestDiv.classList.add('checked');
            personalBestDiv.classList.remove('d-none');
        }

        // it's a world record
        if (IsGridBestTime && !isBrandNewGrid) {
            worldRecordCheck.classList.remove('d-none');
            worldRecord.classList.add('checked');
            worldRecordUnbeaten.classList.add('d-none');
            worldRecord.classList.remove('d-none');
        }
        // it's not a world record and another user has already finished this grid
        else if (!isBrandNewGrid) {
            wrTime.innerHTML = gridBestTime;
            wrOwner.innerHTML = worldRecordOwner;
            worldRecordCheck.classList.add('d-none');
            worldRecordUnbeaten.classList.remove('d-none');
            worldRecord.classList.remove('checked');
            worldRecord.classList.remove('d-none');
        }

        // first player finishing this grid
        if (!isBrandNewGrid) {
            // player ranking
            playerPositionSpan.innerHTML = userRanking;
            playerPositionDiv.classList.remove('d-none');
        }

        // nb times played/finihed by all players
        nbTimesPlayed.innerHTML = gridNbTimesPlayed;
        nbTimesFinished.innerHTML = gridNbTimesFinished;
        timesNb.classList.remove('d-none');
    }

    victoryDiv.classList.remove('d-none');
};



victoryPlayAnother.addEventListener('click', (event) => {
    if (!isUserLogged) {
        testGame();
    }
    else {
        newGrid(rowsNb, colsNb);
    }
});

victoryCloseBtn.addEventListener('click', (event) => {
    
    mainContent.innerHTML = '';
    gameZone.classList.add('d-none');
    trashCanBtn.classList.add('d-none');
    navContainer.classList.remove('hidden');
    victoryDiv.classList.add('d-none');
});


const cleanVictoryDiv = (isUserLogged) => {
    // for both logged or not logged users
    // (from not logged)
    specialCongrats.classList.add('d-none');
    tooManyClicks.classList.add('d-none');
    youShouldRegister.classList.add('d-none');
    // from logged
    perfectGame.classList.add('d-none');
    clicksNbMini.classList.add('d-none');
    personalBestDiv.classList.add('d-none');
    worldRecord.classList.add('d-none');
    playerPositionDiv.classList.add('d-none');

    // user not logged
    if (!isUserLogged) {
        // show these
        congrats.classList.remove('d-none');
        // hide (not logged)
        // hide (logged user)
        playerClicksNb.classList.add('d-none');
        chrono.classList.add('d-none');
        timesNb.classList.add('d-none');
        victoryChooseGridBtn.classList.add('d-none');
    }
    // user is logged
    else {
        // show
        playerClicksNb.classList.remove('d-none');
        chrono.classList.remove('d-none');
        timesNb.classList.remove('d-none');
        victoryChooseGridBtn.classList.remove('d-none');
        // hide (user not logged)
        congrats.classList.add('d-none');
    }
};