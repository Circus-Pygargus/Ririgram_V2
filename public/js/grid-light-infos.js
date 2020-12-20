const gridLightInfosBtn = document.querySelector('#grid-light-infos-btn');
const gridLightInfosDiv = document.querySelector('#grid-light-infos-div');

gridLightInfosBtn.addEventListener('click', () => {
    gridLightInfosDiv.classList.toggle('d-none');
});

gridLightInfosDiv.addEventListener('click', () => {
    gridLightInfosDiv.classList.add('d-none');
});

const gridLightInfos = (gridNbTimesPlayed, gridNbTimesFinished, gridNbPlayersFinished, gridNbPlayersTrashed) => {
    if (gridNbTimesPlayed !== null && gridNbTimesFinished !== null) {
        // fill infos content
        gridLightInfosDiv.innerHTML = '';
        const pPlayed = document.createElement('p');
        pPlayed.innerHTML = 'Grille jouée ' + gridNbTimesPlayed + ' fois.';
        const pFinished = document.createElement('p');
        pFinished.innerHTML = 'Grille finie ' + gridNbTimesFinished + ' fois';
        const pBy = document.createElement('p');
        pBy.innerHTML = ' par ' + gridNbPlayersFinished;
        pBy.innerHTML += gridNbPlayersFinished > 1 ? ' joueurs.' : ' joueur.';
        const pTrashed = document.createElement('p');
        pTrashed.innerHTML = 'Grille rejetée par ' + gridNbPlayersTrashed + ' joueurs';
        pTrashed.innerHTML += gridNbPlayersTrashed > 1 ? ' joueurs.' : ' joueur.';
        gridLightInfosDiv.append(pPlayed);
        gridLightInfosDiv.append(pFinished);
        gridLightInfosDiv.append(pBy);
        gridLightInfosDiv.append(pTrashed);
        // change icon color according to difficulty
        const difficulty = gridNbTimesFinished / gridNbTimesPlayed;
        console.log('diff', difficulty);
        gridLightInfosBtn.classList.remove('red', 'orange', 'yellow', 'green', 'blue');
        if (gridNbTimesPlayed === 0) ;
        else if (difficulty <= 0.1) gridLightInfosBtn.classList.add('red');
        else if (difficulty > 0.1 && difficulty <= 0.4) gridLightInfosBtn.classList.add('orange');
        else if (difficulty > 0.4 && difficulty <= 0.6) gridLightInfosBtn.classList.add('yellow');
        else if (difficulty > 0.6 && difficulty <= 0.9) gridLightInfosBtn.classList.add('green');
        else if (difficulty > 0.9) gridLightInfosBtn.classList.add('blue');
    }
};