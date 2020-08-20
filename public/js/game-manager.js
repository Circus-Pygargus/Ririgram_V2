
const gameAnswerButtons = document.querySelector('#game-answer-buttons');


const gameManager = (rowsNb, colsNb, rowsHelpers, maxRowHelpers, colsHelpers, maxColHelpers, isUserLogged, gridSolution = '', clicksNbForPerfectGame = 0) => {

    // answer given by the mouse left button
    let leftBtnCurChoice = 'yes';

    // User Number of clicks on tiles
    let tilesCliksNb = 0;    
    
    // When screeen size change
    const watchWindowSize = (rowsNb, colsNb, maxRowHelpers, maxColHelpers) => {
        window.addEventListener('resize', () => {
            setCssGridSize(rowsNb, colsNb, maxRowHelpers, maxColHelpers);
        });
    };

    
    // User is playing
    const watchGameButtons = () => {
        const answerBtns = document.querySelectorAll('.answer-btn');
    
        answerBtns.forEach((answerBtn) => {
    
            answerBtn.addEventListener('click', (event) => {
    
                // Show we've chosen a color for next tile
                answerBtns.forEach((elem) => {
                    elem.classList.remove('current-choice');
                });
                event.target.classList.add('current-choice');

                // associate this anwser to mouse left button
                leftBtnCurChoice = event.target.dataset.response;
            });
        });    
    };
    
    
    
    // When user plays directly on the grid
    const watchGridActions = () => {
        // const tiles = document.querySelectorAll('.tile');
        let isClicking = false;
    
        tiles.forEach((tile) => {

            tile.addEventListener('mouseover', (event) => {
                // clean previously enlighted headers
                colHeaders.forEach((colHeader) => {
                    colHeader.classList.remove('enlighted');
                });
                rowHeaders.forEach((rowHeader) => {
                    rowHeader.classList.remove('enlighted');
                });

                // get tile rowId an colId
                const colId = event.target.dataset.colid;
                const rowId = event.target.dataset.rowid;

                // Enlight corresponding headers
                colHeaders.forEach((colHeader) => {
                    if (colHeader.dataset.colid === colId) {
                        colHeader.classList.add('enlighted');
                    }
                });
                rowHeaders.forEach((rowHeader) => {
                    if (rowHeader.dataset.rowid === rowId) {
                        rowHeader.classList.add('enlighted');
                    } 
                });
            });
    
            tile.addEventListener('mousedown', (event) => {
                // We need to know which button is used
                window.btnClicked = event.which;
                isClicking = true;
                tileClicked(event);
            });
    
            tile.addEventListener('mouseenter', (event) => {
                if (isClicking) {
                    tileClicked(event);
                }
            });

            // Ceci empèchera le défilement de la fenêtre sur les écrans tactiles si le doigt de l'utilisateur glisse sur les cases de la grille
            tile.addEventListener('touchmove', (event) => {
                event.preventDefault();
            });
        });
    
        window.addEventListener('mouseup', () => {
            window.btnClicked = undefined;
            isClicking = false;
        });
    };
    
    
    
    // A tile has been choosen (mouse down or mouse enter while clicking)
    const tileClicked = (event) => {
        const tile = event.target;
        const mouseBtnUsed = window.btnClicked;
        let currentChoice = 'yes';    // always bby default ;)

        switch (mouseBtnUsed) {
            // mouse right button
            case 3: 
                currentChoice = 'no';
                break;
            // mouse middle button
            case 2:
                // remove default page scroll on mouse middle btn
                event.preventDefault();
                currentChoice = 'maybe-yes';
                break;
            // should be mouse left button
            default:
                currentChoice = leftBtnCurChoice;
        }

        // user wants to remove current choice
        if (tile.dataset.solution === currentChoice) {
            // if (isClicking) {
                tile.dataset.solution = 'default';
                tilesCliksNb++;
            // }
        }
        // user wants to change tile solution
        else {
            /* We don't increment the number of tiles clicked if player wants to tag a tile with 'no' or 'maybe-no'
            but we will if his had already taged this tile with 'no' or 'maybe-no' */
            if (currentChoice !== 'no' && currentChoice !== 'maybe-no') {
                tilesCliksNb++;
            }
            else if (tile.dataset.solution !== 'default' && (currentChoice === 'no' || currentChoice === 'maybe-no')) {
                tilesCliksNb++;
            }

            tile.dataset.solution = currentChoice;
        }

        // Check if user found grid solution (only if user is not logged)
        if (!isUserLogged) {
            checkcompleteGrid();
        }
    };


    // check if user found grid solution (only is user is not logged)
    const checkcompleteGrid = () => {
        let userSolution = '';

        tiles.forEach((tile) => {
            switch (tile.dataset.solution) {
                case 'no':
                    userSolution += '0';
                    break;
                case 'maybe-no':
                    userSolution += '0';
                    break;
                case 'maybe-yes':
                    userSolution += '1';
                    break;
                case 'yes':
                    userSolution += '1';
                    break;
                // tile solution is 'default' ( tile never clicked or default value given by user)
                default:
                    userSolution += '0';
            }
        });

        if (userSolution === gridSolution) {
            victory(isUserLogged, tilesCliksNb, clicksNbForPerfectGame);
        }
    };


    /* Everything is declared, let's go */

    // Compute and set some css variables
    setCssGridSize(rowsNb, colsNb, maxRowHelpers, maxColHelpers);

    // Build grid html
    buildGameBoardContent(rowsNb, colsNb, rowsHelpers, colsHelpers);

    // maybe user asked to play another grid from victory div
    document.querySelector('#victory').classList.add('d-none');

    // get all tiles
    const tiles = document.querySelectorAll('.tile');
    // get grid headers
    const colHeaders = document.querySelectorAll('.col-head-div');
    const rowHeaders = document.querySelectorAll('.row-head-div');

    gameAnswerButtons.classList.remove('d-none');

    // react when user push a game button
    watchGameButtons();

    // react when user directly act on a tile
    watchGridActions();

    // watch any window rezising
    watchWindowSize(rowsNb, colsNb, maxRowHelpers, maxColHelpers);
};