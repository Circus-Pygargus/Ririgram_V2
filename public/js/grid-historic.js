const gridHistoricBackwardBtn = document.querySelector('#grid-historic-backward');
const gridHistoricForwardBtn = document.querySelector('#grid-historic-forward');

var gridHistoric = [];
let gridHistoricIndex = -1;

// Player changed a tile 
const gridHistoricAddOne = (rowPos, colPos, oldData, newData) => {  
    // +1 as array element corresponding to 2nd argument isn't kept
    if (gridHistoricIndex !== gridHistoric.length -1) {
        gridHistoric = gridHistoric.slice(0, gridHistoricIndex + 1);
        gridHistoricForwardBtn.classList.add('d-none');
    }

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
};

// updates grid according to historic button pushed
const gridHistoricBtnPushed = (direction) => {
    const historicWanted = direction === 'backward' ? gridHistoric[gridHistoricIndex] : gridHistoric[gridHistoricIndex + 1];
    if (Array.isArray(historicWanted)) {
        historicWanted.forEach((tile) => {
            document.querySelector(`div.tile[data-rowid="${tile.rowPos}"][data-colid="${tile.colPos}"]`).dataset.solution = direction === 'backward' ? 'default' : 'no';
        })
    }
    else {
        document.querySelector(`div.tile[data-rowid="${historicWanted.rowPos}"][data-colid="${historicWanted.colPos}"]`).dataset.solution = direction === 'backward' ? historicWanted.oldData : historicWanted.newData;
    }

    if (direction === 'backward') {
        gridHistoricIndex--;
        
        if (gridHistoricIndex === -1) gridHistoricBackwardBtn.classList.add('d-none');
        if (gridHistoricIndex === gridHistoric.length - 2) gridHistoricForwardBtn.classList.remove('d-none');
    }
    else {
        gridHistoricIndex++;
        if (gridHistoricIndex === 0) gridHistoricBackwardBtn.classList.remove('d-none');
        if (gridHistoricIndex === gridHistoric.length - 1) gridHistoricForwardBtn.classList.add('d-none');
    }
};


// send direction backward to historic action manager
gridHistoricBackwardBtn.addEventListener('click', (e) => { gridHistoricBtnPushed(e.target.id.split('-')[2])});

// send direction forward to historic action manager
gridHistoricForwardBtn.addEventListener('click', (e) => { gridHistoricBtnPushed(e.target.id.split('-')[2])});