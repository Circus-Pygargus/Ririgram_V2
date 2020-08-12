// Compute the grid solution
const computeGridSolution = (tilesNb) => {
    let gridSolution = '';
    let clicksNbForPerfectGame = 0;

    for (let i = 0, len = tilesNb; i < len; i++) {
        // default value is 0 for each tiles
        let tileResult = 0;
        // will randomly give 0 or 1
        const tileBoolean = Math.floor(Math.random() * Math.floor(2));

        // if previous result is 1 then react
        if (tileBoolean) {
            clicksNbForPerfectGame++;
            tileResult = 1;
        }

        // add this tile solution to the grid
        gridSolution += tileResult;
    }

    return {gridSolution, clicksNbForPerfectGame};
}

module.exports = computeGridSolution;