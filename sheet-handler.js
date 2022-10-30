let addSheetButton = document.querySelector('.sheet-add-icon');
let sheetsFolderContainer = document.querySelector('.sheets-folder-container');
addSheetButton.addEventListener("click", (e) => {
    let sheet = document.createElement('div');
    
    sheet.setAttribute("class", "sheet-folder");

    let allSheetFolders = document.querySelectorAll(".sheet-folder");
    sheet.setAttribute("id", allSheetFolders.length);

    sheet.innerHTML = `
        <div class="sheet-content"> Sheet ${allSheetFolders.length + 1} </div>
    `;

    sheetsFolderContainer.appendChild(sheet);
    sheet.scrollIntoView();
    // Storage function calls
    createSheet();
    createGraphMatrix();
    sheetActive(sheet);
    handleSheetRemoval(sheet);
    sheet.click();
})

function handleSheetRemoval(sheet) {
    sheet.addEventListener("mousedown", (e) => {
        // right click, dont remove sheet
        if (e.button !== 2) {
            return;
        }
        //left click, remove sheet
        let allSheetFolders = document.querySelectorAll(".sheet-folder");
        if (allSheetFolders.length === 1) {
            alert("You need to have more than one sheet to delete");
            return;
        }

        let response = confirm("Your sheet will be removed permanently. Action cannot be undone. Proceed?")
        if (response === false) {
            return;
        }
        let sheetIndex = Number(sheet.getAttribute("id"));
        collectedSheets.splice(sheetIndex, 1);
        collectedGraph.splice(sheetIndex, 1);
        handleSheetRenaming(sheet);
        // Once deleting a sheet, bring the first sheet to active as default
        sheetData = collectedSheets[0];
        graphMatrix = collectedGraph[0];
        handleSheetProperties();
    })
}

function handleSheetRenaming(sheet) {
    sheet.remove();
    let allSheetFolders = document.querySelectorAll('.sheet-folder');
    for (let i = 0; i < allSheetFolders.length; i++) {
        allSheetFolders[i].setAttribute("id", i);
        let sheetsFolderContent = allSheetFolders[i].querySelector('.sheet-content');
        sheetsFolderContent.innerText = `Sheet ${i+1}`;
        allSheetFolders[i].backgroundColor = "transparent";
    }

    allSheetFolders[0].style.backgroundColor = "pink";
}

function handleSheets(sheetIndex) {
    sheetData = collectedSheets[sheetIndex];
    graphMatrix = collectedGraph[sheetIndex];
}

function handleSheetProperties() {
    for(let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
            let cell = document.querySelector(`.cell[rowID="${i}"][colID="${j}"]`);
            cell.click();
        }
    }

    let firstCell = document.querySelectorAll('.cell');
    firstCell[0].click();
}

function handleSheetUI(sheet) {
    let allSheetFolders = document.querySelectorAll(".sheet-folder");
    for (let i =0; i < allSheetFolders.length; i++) {
        allSheetFolders[i].style.backgroundColor = "transparent";
    }
    sheet.style.backgroundColor = "pink";
}

function sheetActive(sheet) {
    sheet.addEventListener('click', (e) => {
        let sheetIndex= Number(sheet.getAttribute("id"));
        handleSheets(sheetIndex);
        handleSheetProperties();
        handleSheetUI(sheet);
    })
}
function createSheet() {
    let sheetData = [];
    for (let i = 0; i < rows; i++) {
        let gridRow = []; //100 rows 
        for (let j = 0; j < cols; j++) {
            let cellProperty = {
                //default cell properties
                bold: false,
                italic: false,
                underlined: false,
                alignment: "left",
                fontFamily: "Monospace",
                fontSize: "14",
                fontColor: "#000000",
                BGcolor: "#000000",
                value: "",
                formula: "",
                children: [],
            }
            gridRow.push(cellProperty); 
        }
        sheetData.push(gridRow);
    }
    collectedSheets.push(sheetData);
}

function createGraphMatrix() {
    let graphMatrix = [];

    for (let i = 0; i < rows; i++) {
    let row = [];
    for (let j = 0; j < cols; j++) {
        // Using an array as there can be multiple children that refers to parent.value
        row.push([]); 
    }
    graphMatrix.push(row);
}
    collectedGraph.push(graphMatrix);
}