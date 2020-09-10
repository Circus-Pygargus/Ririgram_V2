const victoryDiv = document.querySelector('#victory');
const clicksNbSpan = document.querySelector('#clicks-nb-done');
const tooManyClicks = document.querySelector('#too-many-clicks');
const clicksMinSpan = document.querySelector('#clicks-nb-min');
const specialCongrats = document.querySelector('#special-congrats');
const youShouldRegister = document.querySelector('#you-should-register');

const victoryCloseBtn = document.querySelector('#victory-close');
const victoryPlayAnother = document.querySelector('#victory-play-another');
const victoryChooseGridBtn = document.querySelector('#victory-choose-grid');

// User just won a grid
const victory = (isUserLogged, tilesCliksNb, clicksNbForPerfectGame, isBrandNewGrid=false, userBestBeaten=false,  gridTime=0, IsGridBestTime=false) => {

    
    document.querySelector('#main-title').classList.remove('in-game');

    cleanVictoryDiv();

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
        victoryChooseGridBtn.classList.add('d-none');
        trashCanBtn.classList.remove('d-none'); 
    
    }
    else {
        console.log('partie gagnée !!');
        (tilesCliksNb > 1) ? clicksNbSpan.innerHTML = tilesCliksNb + ' coups' : clicksNbSpan.innerHTML = tilesCliksNb + ' coup';

        if (tilesCliksNb === clicksNbForPerfectGame) {
            specialCongrats.classList.remove('d-none');
        }
        else {
            (tilesCliksNb > 1) ? clicksMinSpan.innerHTML = clicksNbForPerfectGame + ' coups' : clicksMinSpan.innerHTML = clicksNbForPerfectGame + ' coup';
            tooManyClicks.classList.remove('d-none');
        }
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
    navContainer.classList.remove('hidden');
    victoryDiv.classList.add('d-none');
});


const cleanVictoryDiv = () => {
    tooManyClicks.classList.add('d-none');
    specialCongrats.classList.add('d-none');
    youShouldRegister.classList.add('d-none');
};