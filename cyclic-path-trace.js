// This is for delay for cell coloring
function colorPromise() {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve();
        }, 1000);
    })
}

async function isGraphCyclicTracePath(graphMatrix, cycleResponse) {
    let [r, c] = cycleResponse;
    let visited = [];
    let dfsVisited = [];

    for (let i = 0; i < rows; i++) {
        let visitedRow = [];
        let dfsVisitedRow = [];
        for (let j = 0; j < cols; j++) {

            visitedRow.push(false);
            dfsVisitedRow.push(false);
        }
        visited.push(visitedRow);
        dfsVisited.push(dfsVisitedRow);

    }

    // for (let i = 0; i < rows; i++) {
    //     for (let j = 0; j < cols; j++) {
    //         if (visited[i][j] === false) {
    //             let response = dfsCycleDetection(graphMatrix, i, j, visited, dfsVisited);
    //             if (response === true) {
    //             return true;
    //             }
    //         }
            
    //     }
    // }

    let response = await dfsCycleDetectionTracePath(graphMatrix, r, c, visited, dfsVisited);

    if (response === true) {
        return Promise.resolve(true);
    }

    return Promise.resolve(false); 


}

// This function will color cells
async function dfsCycleDetectionTracePath(graphMatrix, r, c, visited, dfsVisited) {
    visited[r][c] = true;
    dfsVisited[r][c] = true;

    let cell = document.querySelector(`.cell[rowId="${r}"][colId="${c}"]`);
    cell.style.backgroundColor = "lightblue"; 
    await colorPromise();

    for (let children = 0; children < graphMatrix[r][c].length; children++) {
        let [childRowId, childColID] = graphMatrix[r][c][children];
        if (visited[childRowId][childColID] === false) {
            let result = await dfsCycleDetectionTracePath(graphMatrix, childRowId, childColID, visited, dfsVisited);
            if (result === true) {
                cell.style.backgroundColor = "transparent";
                await colorPromise();
                return Promise.resolve(true);
            }
        } else if (visited[childRowId][childColID] === true && dfsVisited[childRowId][childColID] === true) {
            let cyclicCell = document.querySelector(`.cell[rowId="${childRowId}"][colId="${childColID}"]`);
            cyclicCell.style.backgroundColor = "lightsalmon";
            await colorPromise();
            cyclicCell.style.backgroundColor = "transparent";
            
            cell.style.backgroundColor = "transparent";
            await colorPromise();
            return Promise.resolve(true);
        }

    }

    dfsVisited[r][c] = false;
    return Promise.resolve(false);
}