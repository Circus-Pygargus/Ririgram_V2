const gridHistoricBackwardBtn = document.querySelector('#grid-historic-backward');
const gridHistoricForwardBtn = document.querySelector('#grid-historic-forward');

var gridHistoric = [];
let gridHistoricIndex = -1;

// Player changed a tile 
const gridHistoricAddOne = (rowPos, colPos, oldData, newData) => {  
    // +1 as array element corresponding to 2nd argument isn't kept
    if (gridHistoricIndex !== gridHistoric.length -1) gridHistoric = gridHistoric.slice(0, gridHistoricIndex + 1); 

    gridHistoric.push({ rowPos, colPos, oldData, newData });

    if (gridHistoricIndex === -1) {
        gridHistoricBackwardBtn.classList.remove('d-none');
    }

    gridHistoricIndex++;
};

// Auto-fill added some 'no' tiles
const gridHistoricAddMany = (changedTiles) => {
    gridHistoric.push(changedTiles);

    if (gridHistoricIndex === -1) gridHistoricBackwardBtn.classList.remove('d-none');
    gridHistoricIndex++;
}


gridHistoricBackwardBtn.addEventListener('click', () => {
    const historicWanted = gridHistoric[gridHistoricIndex];
    if (Array.isArray(historicWanted)) {
        historicWanted.forEach((tile) => {
            document.querySelector(`div.tile[data-rowid="${tile.rowPos}"][data-colid="${tile.colPos}"]`).dataset.solution = 'default';
        })
    }
    else {
        document.querySelector(`div.tile[data-rowid="${historicWanted.rowPos}"][data-colid="${historicWanted.colPos}"]`).dataset.solution = historicWanted.oldData;
    }
    gridHistoricIndex--;
    if (gridHistoricIndex === -1) gridHistoricBackwardBtn.classList.add('d-none');
});