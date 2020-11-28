var gridHistoric = [];

// Player changed a tile 
const gridHistoricAddOne = (rowPos, colPos, oldData, newData, arrayPos=-1) => {
    // this should never happend
    if (arrayPos < -1) return;
    // just add a new tile change
    else if (arrayPos === -1) {
        gridHistoric.push({ rowPos, colPos, oldData, newData });
    }
};