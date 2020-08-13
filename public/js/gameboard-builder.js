/**
 * Build the gameboard
 */

const mainContent = document.querySelector('#main-content');


const buildGameBoardContent = (rowsNb, colsNb, rowsHelpers, colsHelpers) => {

    // first clean space for gameboard
    mainContent.innerHTML = '';

    // build gameboard div
    const gameboardDiv = document.createElement('div');
    gameboardDiv.setAttribute('id', 'gameboard');

    // let's build a gameboard
    // loop through rows
    for (let row = 0; row <= rowsNb; row++) {
        // build a row
        const rowDiv = document.createElement('div');

        if (row !== 0) {
            rowDiv.classList.add('row-div');
        }
        // first row is for columns helpers
        else {
            rowDiv.classList.add('head-div');
        }

        // loop through columns
        for (let col = 0; col <= colsNb; col++) {
            // build a tile for this row and this columns
            const tileDiv = document.createElement('div');

            if (col !== 0) {
                // it's a grid tile
                if (row !== 0) {
                    tileDiv.classList.add('tile');
                    tileDiv.dataset.rowid = row -1;
                    tileDiv.dataset.colid = col -1;
                    tileDiv.dataset.solution = "no";
                }
                // it's a col head tile
                else {
                    tileDiv.classList.add('col-head-div');
                    tileDiv.dataset.colid = col -1;
                    // add helpers
                    for (let i = 0, max = colsHelpers[col - 1].length; i < max; i++) {
                        const helperDiv = document.createElement('div');
                        helperDiv.classList.add('helper');
                        helperDiv.textContent = colsHelpers[col - 1][i];
                        tileDiv.appendChild(helperDiv);
                    }
                }
            }
            else {
                // it's a row head tile
                if (row !== 0) {
                    tileDiv.classList.add('row-head-div');
                    tileDiv.dataset.rowid = row -1;
                    // add helpers
                    for (let i = 0, max = rowsHelpers[row -1].length; i < max; i++) {
                        const helperDiv = document.createElement('div');
                        helperDiv.classList.add('helper');
                        helperDiv.textContent = rowsHelpers[row - 1][i];
                        tileDiv.appendChild(helperDiv);
                    }
                }                
                // empty zone
                else {
                    tileDiv.classList.add('free-place-div', 'espace', 'vide');
                }
            }
            rowDiv.appendChild(tileDiv);
        }
        gameboardDiv.appendChild(rowDiv);
    }
    mainContent.appendChild(gameboardDiv);
};