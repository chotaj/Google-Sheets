//Implementation: Storage, Relation, then Impl
// Storage is a 2D matrix
let collectedGraph = [];
let graphMatrix = [];

// for (let i = 0; i < rows; i++) {
//     let row = [];
//     for (let j = 0; j < cols; j++) {
//         // Using an array as there can be multiple children that refers to parent.value
//         row.push([]); 
//     }
//     graphMatrix.push(row);
// }

function isGraphCyclic(graphMatrix) {
    // As this is a directed graph, a fast slow traversal not gonna work.
    // We need visited and dfsvisited arrays to keep track
    // The visited and dfsvisited array will be an 2d adjacency matrix 
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

    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
            if (visited[i][j] === false) {
                let response = dfsCycleDetection(graphMatrix, i, j, visited, dfsVisited);
                if (response === true) {
                return [i, j];
                }
            }
            
        }
    }

    return null; 


}

// Algorithm Notes 
// Start with visited true and dfsVisited is true as you go down the cells
// as you backtrack, switch dfsVisited to false
// Also note that in iteration, is visited is true for a node, no need to traverse through that path and
// its adjacent nodes
// If visited and dfs is both true once searching in process, cycle found
// Returns boolean - true is cyclic
function dfsCycleDetection(graphMatrix, r, c, visited, dfsVisited) {
    visited[r][c] = true;
    dfsVisited[r][c] = true;


    for (let children = 0; children < graphMatrix[r][c].length; children++) {
        // Better terminology: Children is basically the neighbors of the cells aka the nodes
        // The adjacent nodes are the children, choose out row and col id and traverse through that
        let [childRowId, childColID] = graphMatrix[r][c][children];
        if (visited[childRowId][childColID] === false) {
            let result = dfsCycleDetection(graphMatrix, childRowId, childColID, visited, dfsVisited);
            if (result === true) {
                return true;
            }
        } else if (visited[childRowId][childColID] === true && dfsVisited[childRowId][childColID] === true) {
            return true;
        }

    }

    dfsVisited[r][c] = false;
    return false;
}