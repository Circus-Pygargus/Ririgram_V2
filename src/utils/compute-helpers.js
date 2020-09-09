const buildHelpers = (colsNb, gridSolution) => {

    // get rows and cols helpers
    const {rowsHelpers, maxRowHelpers} = buildRowsHelpers(colsNb, gridSolution);
    const {colsHelpers, maxColHelpers} = buildColsHelpers(colsNb, gridSolution);

    return { rowsHelpers, maxRowHelpers, colsHelpers, maxColHelpers };
};



// will be uesd to have a correct array sorting    
const compareNbs = (a, b) => {
    return a - b;
};



const buildRowsHelpers = (colsNb, gridSolution) => {
    const rowsHelpers = [];
    rowsHelpers[0] = [];
    let helper = 0;
    // used to know for wich row we're adding helpers
    let rowNb = -1;

    for (let i = 0, len = gridSolution.length; i < len; i++) {
        // new row
        if ((i) % colsNb === 0) {
            if (helper !== 0) {
                rowsHelpers[rowNb].push(helper);
                helper = 0;
            }
            rowNb++;

            rowsHelpers[rowNb] = [];
        }
        
        // this helper is good, store it
        if (gridSolution[i] === '0') {
            if (helper !== 0) {
                rowsHelpers[rowNb].push(helper);
                helper = 0;
            }
        }
        // increase helper
        else {
            helper++;
        }

        // last tile of the grid
        if (i === len - 1) {
            if (helper !== 0) {
                rowsHelpers[rowNb].push(helper);
            }
        }
    }
    
    // let's find the maximum number of helpers found for 1 row
    let maxRowHelpers = 0;
    const helpersNb = [];
    
    for (let i = 0, len = rowsHelpers.length; i < len; i++) {
        helpersNb[i] = 0;
        
        for (let j = 0, max = rowsHelpers[i].length; j < max; j++) {
            helpersNb[i] = helpersNb[i] + 1;
        }
    }
    helpersNb.sort(compareNbs).reverse();
    maxRowHelpers = helpersNb[0];

    return {rowsHelpers, maxRowHelpers};
};



const buildColsHelpers = (colsNb, gridSolution) => {
    const colsHelpers = [];
    // used to compute each helper, is an array so we can build each columns in the same loop
    const helpers = [];

    for (let i = 0, max = colsNb; i < max; i++) {
        colsHelpers[i] = [];
        // default value for each helper
        helpers[i] = 0;
    }

    for (let i = 0, max = gridSolution.length; i < max; i++) {
        const colNb = i % colsNb;
        // this helper is good, store it
        if (gridSolution[i] === '0') {
            if (helpers[colNb] !== 0) {
                colsHelpers[colNb].push(helpers[colNb]);
                helpers[colNb] = 0;
            }
        }
        else {
            helpers[colNb]++;

            // last row
            if (i >= (gridSolution.length - colsNb)) {
                colsHelpers[colNb].push(helpers[colNb]);
            }
        }
    }

    // let's find the maximum number of helpers found for 1 col
    let maxColHelpers = 0;
    const helpersNb = [];
    for (let i = 0, len = colsHelpers.length; i < len; i++) {
        helpersNb[i] = 0;
        for (let j = 0, max = colsHelpers[i].length; j < max; j++) {
            helpersNb[i] = helpersNb[i] + 1;
        }
    }
    helpersNb.sort(compareNbs).reverse();
    maxColHelpers = helpersNb[0];
    
    return {colsHelpers, maxColHelpers};
};

module.exports = buildHelpers;