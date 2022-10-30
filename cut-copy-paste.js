let ctrlKey;

document.addEventListener("keydown", (e) => {
    ctrlKey = e.ctrlKey;
})

document.addEventListener("keyup", (e) => {
    ctrlKey = e.ctrlKey;
})

for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
        let cell = document.querySelector(`.cell[rowID="${i}"][colID="${j}"]`);
        handleSelectedCells(cell);
    }
}
let copyButton = document.querySelector('.copy');
let cutButton = document.querySelector('.cut');
let pasteButton = document.querySelector('.paste');

let rangeStorage = [];
function handleSelectedCells(cell) {
    cell.addEventListener("click", (e) => {
    // Select the cells in a range 
        if (!ctrlKey) return;
        if (rangeStorage.length >= 2) {
            defaultCellsUI(); 
            rangeStorage = [];
        }

        cell.style.border = "3px solid pink"

        let rowID = Number(cell.getAttribute("rowID"));
        let colID = Number(cell.getAttribute("colID"));

        rangeStorage.push([rowID, colID]);


    })
    
}

function defaultCellsUI() {
    for (let i = 0; i < rangeStorage.length; i++) {
        let cell = document.querySelector(`.cell[rowID="${rangeStorage[i][0]}"][colID="${rangeStorage[i][1]}"]`);
        cell.style.border = "0.5px solid rgb(208, 207, 207)";
    }
}

let copiedData = [];
copyButton.addEventListener('click', (e) => {
    if (rangeStorage.length < 2) return;
    copiedData = [];
    let startRow = rangeStorage[0][0];
    let startCol = rangeStorage[0][1];
    let endRow = rangeStorage[1][0];
    let endCol = rangeStorage[1][1];

    for (let i = startRow; i <= endRow; i++) {
        let copyRow = [];
        for (let j = startCol; j <= endCol; j++) {
            let cellProperty = sheetData[i][j];
            copyRow.push(cellProperty);
        }
        copiedData.push(copyRow);
    }
    defaultCellsUI();
})

cutButton.addEventListener('click', (e) => {

    if (rangeStorage.length < 2) {
        return;
    }
    let startRow = rangeStorage[0][0];
    let startCol = rangeStorage[0][1];
    let endRow = rangeStorage[1][0];
    let endCol = rangeStorage[1][1];

    for (let i = startRow; i <= endRow; i++) {
        for (let j = startCol; j <= endCol; j++) {
            let cell = document.querySelector(`.cell[rowID="${i}"][colID="${j}"]`);

            let cellProperty = sheetData[i][j];
            cellProperty.value = "";
            cellProperty.bold = false;
            cellProperty.italic = false;
            cellProperty.underlined = false;
            cellProperty.alignment = "left";
            cellProperty.fontFamily = "monospace";
            cellProperty.fontSize = 14;
            cellProperty.fontColor = "#000000";
            cellProperty.BGcolor = "#000000";
            cell.click();
        }

    }

    defaultCellsUI();

})

pasteButton.addEventListener('click', (e) => {

    if (rangeStorage.length < 2) {
        return;
    }
    let rowDifference = Math.abs(rangeStorage[0][0] - rangeStorage[1][0]);
    let colDifference = Math.abs(rangeStorage[0][1] - rangeStorage[1][1]);
    let address = addressBar.value;
    let [startRow, startCol] = decodeCellFromAddress(address);

    // r is the copy data row 
    // c is the copy data column
    for (let i = startRow, r = 0; i <= startRow + rowDifference; i++, r++) {
        for (let j = startCol, c = 0; j <= startCol + colDifference; j++, c++) {
            let cell = document.querySelector(`.cell[rowID="${i}"][colID="${j}"]`);
            if (!cell) continue;
            let data = copiedData[r][c];
            let cellProperty = sheetData[i][j];
            cellProperty.value = data.value;
            cellProperty.bold = data.bold;
            cellProperty.italic = data.italic;
            cellProperty.underlined = data.underlined;
            cellProperty.alignment = data.alignment;
            cellProperty.fontFamily = data.fontFamily;
            cellProperty.fontSize = data.fontSize;
            cellProperty.fontColor = data.fontColor;
            cellProperty.BGcolor = data.BGcolor;
            // No need to keep children and formula array as that will be generated again anyway

            cell.click();


        }
    }

})