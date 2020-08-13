const root = document.documentElement;

// Set the grid size according to screen size
const setCssGridSize = (rowsNb, colsNb, maxRowHelpers, maxColHelpers) => {
    // set css variables
    root.style.setProperty('--nb-rows', rowsNb);
    root.style.setProperty('--nb-cols', colsNb);
    root.style.setProperty('--max-row-helpers', maxRowHelpers);
    root.style.setProperty('--max-col-helpers', maxColHelpers);

    const gameboardDiv = document.querySelector('#main-content');
    const gameboardPos = gameboardDiv.offsetTop;

    const spaceX =  window.innerWidth;
    const spaceY = window.innerHeight - gameboardPos;

    const gameboardWidth = (spaceX < spaceY ? (0.95 * spaceX) + 'px' : (0.95 * spaceY) + 'px');

    root.style.setProperty('--gameboard-width', gameboardWidth);
};