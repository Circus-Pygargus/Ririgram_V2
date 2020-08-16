const gameManager = (rowsNb, colsNb, rowsHelpers, maxRowHelpers, colsHelpers, maxColHelpers, isUserLogged, gridSolution = '', clicksNbForPerfectGame = 0) => {

    const gameAnswerButtons = document.querySelector('#game-answer-buttons');

    // Compute and set some css variables
    setCssGridSize(rowsNb, colsNb, maxRowHelpers, maxColHelpers);

    // Build grid html
    buildGameBoardContent(rowsNb, colsNb, rowsHelpers, colsHelpers);

    gameAnswerButtons.classList.remove('d-none');

    // react when user push a game button
    watchGameButtons();

    // watch any window rezising
    watchWindowSize(rowsNb, colsNb, maxRowHelpers, maxColHelpers);
};



// When screeen size change
const watchWindowSize = (rowsNb, colsNb, maxRowHelpers, maxColHelpers) => {
    window.addEventListener('resize', () => {
        setCssGridSize(rowsNb, colsNb, maxRowHelpers, maxColHelpers);
    });
};



// User is playing
const watchGameButtons = () => {
    const answerBtns = document.querySelectorAll('.answer-btn');

    console.log(answerBtns)

    answerBtns.forEach((answerBtn) => {

        answerBtn.addEventListener('click', (event) => {

            answerBtns.forEach((elem) => {
                elem.classList.remove('current-choice');
            });
    
            event.target.classList.add('current-choice');
        });
    });    
};