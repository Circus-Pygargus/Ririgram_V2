const gameCrossButton = document.querySelector('#game-cross');
const crossBtns = document.querySelectorAll('.game-cross-btn');
const gameAnswerButtons = document.querySelector('#game-answer-buttons');
const answerBtns = document.querySelectorAll('.answer-btn');
// let rowsNb, colsNb, maxRowHelpers, maxColHelpers;


const gameManager = (rowsNb, colsNb, rowsHelpers, maxRowHelpers, colsHelpers, maxColHelpers, isUserLogged, gridSolution = '', clicksNbForPerfectGame = 0) => {
    // rowsNb = rowsNb; colsNb = colsNb; maxRowHelpers = maxRowHelpers; maxColHelpers = maxColHelpers;
    // answer given by the mouse left button
    let leftBtnCurChoice = 'yes';

    // User Number of clicks on tiles
    let tilesCliksNb = 0;
    
    // user is using the cross while playing
    let isUsingCross = false;
    // while using cross, need to know if a color choice btn is being clicked
    let isClickingChoiceBtn = false;
    
    // user is removing his choice color on several tiles
    let isRemovingChoice = false;
    // same but using the cross
    let isRemovingChoiceUsingCross = false;

    // used to know which tile is selected with game cross 
    let selectedRow = 0;
    let lastSelectedRow = 0;
    let selectedCol = 0;
    let lastSelectedCol = 0;
    
let isAnwserBtnActive = false;
    
    // When screeen size change
    const watchWindowSize = () => {
        window.addEventListener('resize', windowsEventResize);
    };

    function windowsEventResize () {
        setCssGridSize(rowsNb, colsNb, maxRowHelpers, maxColHelpers);
    }

    
    // User is playing without the cross
    const watchGameButtons = () => {
        

        // if (!isUsingCross) {

            // gameCrossButton.classList.add('not-in-use');

            // gameCrossButton.addEventListener('click', () => {
            //     isUsingCross = true;
            //     watchCrossButtons();
            // });
    
        answerBtns.forEach((answerBtn) => {
        
            answerBtn.addEventListener('click', answerBtnsEventClick);


            answerBtn.addEventListener('touchstart', answerBtnsEventTouchstart);
            answerBtn.addEventListener('touchend', answerBtnsEventTouchend);
        });
        // }  
    };

    const selectChoiceBtn = (btn) => {
        // Show we've chosen a color for next tile
        answerBtns.forEach((elem) => {
            elem.classList.remove('current-choice');
        });
        btn.classList.add('current-choice');

        // associate this anwser to mouse left button
        leftBtnCurChoice = btn.dataset.response;
    };

    function answerBtnsEventClick () {            
        event.preventDefault(); // needed ???
        // answerBtn.addEventListener('mousemove', (event) => {
            if (!isUsingCross) {
                selectChoiceBtn(event.target);
            }
    }
    function answerBtnsEventTouchstart (event) {            
        event.preventDefault();
        // document.querySelector('h1').style.color = 'yellow';
        if (!isUsingCross) {
            selectChoiceBtn(event.target);
        }

        if (isUsingCross) {
            event.target.classList.add('current-choice');
            isAnwserBtnActive = true;
            if (isAnwserBtnActive) {
                console.log('oups')
                isClickingChoiceBtn = true;
                leftBtnCurChoice = event.target.dataset.response;
                let tile = document.querySelector(`.tile[data-rowid="${lastSelectedRow}"][data-colid="${lastSelectedCol}"]`);
                
        
            // if (tile.dataset.solution === leftBtnCurChoice) {   
                if (tile.dataset.solution === leftBtnCurChoice) {
                    isRemovingChoiceUsingCross = true;
                }

                tileSolutionChangeUsingCross(tile);
                // tile.dataset.solution = event.target.dataset.response;
                // tilesCliksNb++;
                // checkCompleteGrid();
            }
        }
    }
    function answerBtnsEventTouchend (event) {        
        event.preventDefault();
        if (isUsingCross) {
            console.log('touch end')
            // document.querySelector('h1').style.color = 'red';
            isAnwserBtnActive = false;
            event.target.classList.remove('current-choice');
            isClickingChoiceBtn = false;
            isRemovingChoiceUsingCross = false;
        }
    }


    // let sameMoveTilesCounter = 0;
    
    let crossLine, crossDirection;

    // User is playing with the cross and color choice btns
    const watchCrossButtons = () => {


        crossBtns.forEach((crossBtn) => {
            // crossBtn.addEventListener('click', (event) => {
            crossBtn.addEventListener('touchstart', crossBtnsEventTouchstart);

            crossBtn.addEventListener('touchend', crossBtnsEventTouchend);
        });

    };

    const selectNextTile = () => {
        switch (crossLine) {
            case 'col': 
                if (crossDirection === 'backward') {
                    (selectedRow === 0) ? selectedRow = rowsNb - 1:  selectedRow--;
                }
                else {
                    (selectedRow === rowsNb -1) ? selectedRow = 0 : selectedRow++;
                }
                break;
            case 'row':
                if (crossDirection === 'backward') {
                    (selectedCol === 0) ? selectedCol = colsNb - 1 : selectedCol--;
                }
                else {
                    (selectedCol === colsNb -1) ? selectedCol = 0: selectedCol++;
                }
        }

        // remove selected and enlighted classes
        document.querySelector(`.tile[data-rowid="${lastSelectedRow}"][data-colid="${lastSelectedCol}"]`).classList.remove('selected');
        document.querySelector(`.col-head-div[data-colid="${lastSelectedCol}"]`).classList.remove('enlighted');
        document.querySelector(`.row-head-div[data-rowid="${lastSelectedRow}"]`).classList.remove('enlighted');
        // add selected and enlighted classes
        const tile = document.querySelector(`.tile[data-rowid="${selectedRow}"][data-colid="${selectedCol}"]`);
        tile.classList.add('selected');
        document.querySelector(`.col-head-div[data-colid="${selectedCol}"]`).classList.add('enlighted');
        document.querySelector(`.row-head-div[data-rowid="${selectedRow}"]`).classList.add('enlighted');

        lastSelectedRow = selectedRow;
        lastSelectedCol = selectedCol;

        // add user choice if one game answer button is being clicked
        if (isClickingChoiceBtn) {
            // sameMoveTilesCounter++;
            // if (crossLine === 'col' && sameMoveTilesCounter >= colsNb) return;
            // if (crossLine === 'row' && sameMoveTilesCounter >= rowsNb) return;


            tileSolutionChangeUsingCross(tile)
            
            // document.querySelector(`.tile[data-rowid="${selectedRow}"][data-colid="${selectedCol}"]`).dataset.solution = leftBtnCurChoice; // !! redondance ;)
            // tilesCliksNb++;
            // checkCompleteGrid();
        }
    };
    function crossBtnsEventTouchstart (event) {        
        event.preventDefault();
        if (!isUsingCross) {
            isUsingCross = true;
            gameCrossButton.classList.remove('not-in-use');

            answerBtns.forEach((answerBtn) => {
                answerBtn.classList.remove('current-choice');
            });
            // select the first tile of the grid and enlight it
            document.querySelector('.tile[data-rowid="0"][data-colid="0"').classList.add('selected');
            // Enlight corresponding headers
            document.querySelector('.col-head-div[data-colid="0"').classList.add('enlighted');
            document.querySelector('.row-head-div[data-rowid="0"').classList.add('enlighted');
            selectedRow = 0;
            lastSelectedRow = 0;
            selectedCol = 0;
            lastSelectedCol = 0;
            return;
        }

        // let sameMoveTilesCounter = 0;

        // because event target is strangely the child of the button  (btn : <g>   and eventTarget: <polygon>)
        let crossBtn = event.target.parentNode;
        console.log(crossBtn)
        
        switch (crossBtn.id) {
            case 'game-cross-top':
                crossLine = 'col';
                crossDirection = 'backward';
                break;
            case 'game-cross-bottom':
                crossLine = 'col';
                crossDirection = 'forward';
                break;
            case 'game-cross-left':
                crossLine = 'row';
                crossDirection = 'backward';
                break;
            case 'game-cross-right':
                crossLine = 'row';
                crossDirection = 'forward';
                break;
        }

        selectNextTile();
        crossAction = setInterval(selectNextTile, 500);
    }

    function crossBtnsEventTouchend (event) {        
        event.preventDefault();
        // sameMoveTilesCounter = 0;
        clearInterval(crossAction);
    }


    // player is changing tile solution while using game cross
    const tileSolutionChangeUsingCross = (tile) => {

                
                        // tile.dataset.solution = event.target.dataset.response;
                        // leftBtnCurChoice = event.target.dataset.response;
                        // isClickingChoiceBtn = true;
                        // tilesCliksNb++;
                        // checkCompleteGrid();
                // document.querySelector(`.tile[data-rowid="${selectedRow}"][data-colid="${selectedCol}"]`).dataset.solution = leftBtnCurChoice; // !! redondance ;)

        if (tile.dataset.solution !== leftBtnCurChoice && isRemovingChoiceUsingCross) return;

        if (tile.dataset.solution === leftBtnCurChoice && !isRemovingChoiceUsingCross) return;
        
        if (tile.dataset.solution === leftBtnCurChoice && isRemovingChoiceUsingCross) {
            tile.dataset.solution = 'default';
        }
        else {

            tile.dataset.solution = leftBtnCurChoice;
            
            if (leftBtnCurChoice !== 'no' && leftBtnCurChoice !== 'maybe-no') {
                tilesCliksNb++;
            }
    
        }

        // Check if user found grid solution (only if user is not logged)
        if (!isUserLogged) {
            checkCompleteGrid();
        }

        // ?? isCrossClicking ???
    };
    
    
    
    // When user plays directly on the grid
    const watchGridActions = () => {
        // const tiles = document.querySelectorAll('.tile');
        let isClicking = false;
    
        tiles.forEach((tile) => {
    
            tile.addEventListener('mousedown', (event) => {
                // User wants to play with his mouse or finger
                if (isUsingCross) {
                    setTouchGameplay();
                    return;
                }
                // We need to know which button is used
                window.btnClicked = event.which;
                tileClicked(event.target, isClicking);
                isClicking = true;
            });
    

            tile.addEventListener('mouseenter', (event) => {
                if (isUsingCross) return;

                // tile choice is changing
                if (isClicking) {
                    tileClicked(event.target, isClicking);
                }

                // get tile rowId an colId
                const colId = event.target.dataset.colid;
                const rowId = event.target.dataset.rowid;

                // enlight the tile
                tile.classList.add('selected');

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

            // remove the enlight
            tile.addEventListener('mouseout', (event) => {
                const colId = event.target.dataset.colid;
                const rowId = event.target.dataset.rowid;

                event.target.classList.remove('selected');

                colHeaders.forEach((colHeader) => {
                    if (colHeader.dataset.colid === colId) {
                        colHeader.classList.remove('enlighted');
                    }
                });
                rowHeaders.forEach((rowHeader) => {
                    if (rowHeader.dataset.rowid === rowId) {
                        rowHeader.classList.remove('enlighted');
                    } 
                });
            })

            // Ceci empèchera le défilement de la fenêtre sur les écrans tactiles si le doigt de l'utilisateur glisse sur les cases de la grille
            tile.addEventListener('touchmove', (event) => {
                event.preventDefault();
            });
        });
    
        // user has just stop clicking
        window.addEventListener('mouseup', () => {
            window.btnClicked = undefined;
            isClicking = false;
            isRemovingChoice = false;
        });
    };


    function setTouchGameplay () {        
        gameCrossButton.classList.add('not-in-use');
        isUsingCross = false;
        document.querySelector(`.tile[data-rowid="${lastSelectedRow}"][data-colid="${lastSelectedCol}"]`).classList.remove('selected');
        document.querySelector(`.col-head-div[data-colid="${lastSelectedCol}"]`).classList.remove('enlighted');
        document.querySelector(`.row-head-div[data-rowid="${lastSelectedRow}"]`).classList.remove('enlighted');
        document.querySelector('#answer-yes').classList.add('current-choice');
        leftBtnCurChoice = 'yes';
    }
    
    
    // A tile has been choosen (mouse down or mouse enter while clicking)
    const tileClicked = (tile, isClicking) => {
        // const tile = event.target;
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

        // user is actually adding color to several tiles
        // as he's comming on one tile of same color
        // do nothing
        if (isClicking && !isRemovingChoice && tile.dataset.solution === currentChoice) return;

        if (isRemovingChoice && tile.dataset.solution !== currentChoice) return;
        // user is removing his choice on several tiles
        if (isRemovingChoice && tile.dataset.solution === currentChoice) {
            tile.dataset.solution = 'default';
            // tilesCliksNb++;
        }
        // user wants to remove current choice
        else if (tile.dataset.solution === currentChoice) {
            // if (isClicking) {
                tile.dataset.solution = 'default';
                // tilesCliksNb++;
                isRemovingChoice = true;
            // }
        }
        // user wants to change tile solution
        else {
            /* We don't increment the number of tiles clicked if player wants to tag a tile with 'no' or 'maybe-no'
            but we will if his had already taged this tile with 'no' or 'maybe-no' */
            if (currentChoice !== 'no' && currentChoice !== 'maybe-no') {
                tilesCliksNb++;
            }
            // commented because no more clicks counted if no or maybe-no chosen
            // else if (tile.dataset.solution !== 'default' && (currentChoice === 'no' || currentChoice === 'maybe-no')) {
            //     tilesCliksNb++;
            // }

            tile.dataset.solution = currentChoice;
        }

        // Check if user found grid solution (only if user is not logged)
        if (!isUserLogged) {
            checkCompleteGrid();
        }
    };


    // check if user found grid solution (only is user is not logged)
    const checkCompleteGrid = () => {
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
            removeGameEventListerners();
            setTouchGameplay();
            victory(isUserLogged, tilesCliksNb, clicksNbForPerfectGame);
        }
    };

    function removeGameEventListerners () {        
        window.removeEventListener('resize', windowsEventResize);
        console.log('window resize event removed');

        answerBtns.forEach((answerBtn) => {        
            answerBtn.removeEventListener('click', answerBtnsEventClick);
            answerBtn.removeEventListener('touchstart', answerBtnsEventTouchstart);
            answerBtn.removeEventListener('touchend', answerBtnsEventTouchend);
            console.log('answer buttons events removed');
        });
        
        crossBtns.forEach((crossBtn) => {
            crossBtn.removeEventListener('touchstart', crossBtnsEventTouchstart);
            crossBtn.removeEventListener('touchend', crossBtnsEventTouchstart);
            console.log('cross buttons events removed');
        });
        console.log('Event listeners should be removed.')
        document.querySelector('h1').innerHTML += '1';
    }


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

    gameCrossButton.classList.remove('d-none');
    gameAnswerButtons.classList.remove('d-none');

    // react when user push a game button
    watchGameButtons();
    watchCrossButtons();

    // react when user directly act on a tile
    watchGridActions();

    // watch any window rezising
    watchWindowSize(rowsNb, colsNb, maxRowHelpers, maxColHelpers);
};