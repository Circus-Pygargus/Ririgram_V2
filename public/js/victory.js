const victoryDiv = document.querySelector('#victory');
const clicksNbSpan = document.querySelector('#clicks-nb-done');
const tooManyClicks = document.querySelector('#too-many-clicks');
const clicksMinSpan = document.querySelector('#clicks-nb-min');
const specialCongrats = document.querySelector('#special-congrats');

// User just won a grid
const victory = (isUserLogged, tilesCliksNb, clicksNbForPerfectGame) => {

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
        document.querySelector('#you-should-register').classList.remove('d-none');
    
    }

    victoryDiv.classList.remove('d-none');
};