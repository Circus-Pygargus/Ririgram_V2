const gameManager = (rowsNb, colsNb, rowsHelpers, maxRowHelpers, colsHelpers, maxColHelpers, isUserLogged, gridSolution = '', clicksNbForPerfectGame = 0) => {

    // Compute and set some css variables
    setCssGridSize(rowsNb, colsNb, maxRowHelpers, maxColHelpers);

    // Build grid html
    buildGameBoardContent(rowsNb, colsNb, rowsHelpers, colsHelpers);

    // watch any window rezising
    watchWindowSize(rowsNb, colsNb, maxRowHelpers, maxColHelpers);
};



const watchWindowSize = (rowsNb, colsNb, maxRowHelpers, maxColHelpers) => {
    window.addEventListener('resize', () => {
        setCssGridSize(rowsNb, colsNb, maxRowHelpers, maxColHelpers);
    });
};

