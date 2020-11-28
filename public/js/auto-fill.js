const autoFill = (rowId, colId) => {

    // Get row and col helpers for this tile
    const rowHelpers = rowsHelpers[rowId];
    const colHelpers = colsHelpers[colId];
    
    // Get all tiles for this row
    rowTiles = document.querySelectorAll(`div.tile[data-rowid="${rowId}"]`);    
    // Get all tiles for this col
    colTiles = document.querySelectorAll(`div.tile[data-colid="${colId}"]`);

    const userRowSolution = [];
    const userColSolution = [];

    // used to store changed tiles and send them all to grid historic
    let changedTiles = [];
    
    // Let's check row tiles
    // will be increased if tile is selected
    let selectedRowTilesNb = 0;
    let selectedColTilesNb = 0;
    
    // We need user result for this row
    rowTiles.forEach(rowTile => {
        if (rowTile.dataset.solution !== 'yes' && selectedRowTilesNb !== 0) {
            userRowSolution.push(selectedRowTilesNb);
            selectedRowTilesNb = 0;
        }
        else if (rowTile.dataset.solution === 'yes')  selectedRowTilesNb++;

        // here only == comparison because dataset.colid is a string and colsNb is an integer
        if (rowTile.dataset.colid == (colsNb -1) && selectedRowTilesNb !== 0) {
            userRowSolution.push(selectedRowTilesNb);
        }
    });

    // we need to Json and stringify arrays to compare them
    if (JSON.stringify(userRowSolution) === JSON.stringify(rowHelpers)) {
        rowTiles.forEach(rowTile => {
            if (rowTile.dataset.solution === 'default') {
                rowTile.dataset.solution = 'no';
                // store tile position for grid historic
                changedTiles.push({rowPos: rowTile.dataset.rowid, colPos: rowTile.dataset.colid});
            }
        })
    }

    
    // Let's check col tiles
    
    // We need user result for this row
    colTiles.forEach(colTile => {
        if (colTile.dataset.solution !== 'yes' && selectedColTilesNb !== 0) {
            userColSolution.push(selectedColTilesNb);
            selectedColTilesNb = 0;
        }
        else if (colTile.dataset.solution === 'yes')  selectedColTilesNb++;

        // here only == comparison because dataset.colid is a string and colsNb is an integer
        if (colTile.dataset.rowid == (rowsNb -1) && selectedColTilesNb !== 0) {
            userColSolution.push(selectedColTilesNb);
        }
    });

    // we need to Json and stringify arrays to compare them
    if (JSON.stringify(userColSolution) === JSON.stringify(colHelpers)) {
        colTiles.forEach(colTile => {
            if (colTile.dataset.solution === 'default') {
                colTile.dataset.solution = 'no';
                // store tile position for grid historic
                changedTiles.push({rowPos: colTile.dataset.rowid, colPos: colTile.dataset.colid});
            }
        })
    }

    // store changed tiles into grid historic
    if (changedTiles.length) gridHistoricAddMany(changedTiles);
}