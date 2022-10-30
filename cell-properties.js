let sheetData = [];
let collectedSheets = []; // This shall have all the sheets in sheet container
/* logic: Each sheet has a grid with 26 columns labeled A to Z and 100 rows labeled 1 to 100
100 rows, each with 26 cells, and each cell has varying properties like boldness, 
color, italics, etc.
*/ 

{
    let addSheetButton = document.querySelector('.sheet-add-icon');
    addSheetButton.click();
}
// for (let i = 0; i < rows; i++) {
//     let gridRow = []; //100 rows 
//     for (let j = 0; j < cols; j++) {
//         let cellProperty = {
//             //default cell properties
//             bold: false,
//             italic: false,
//             underlined: false,
//             alignment: "left",
//             fontFamily: "Monospace",
//             fontSize: "14",
//             fontColor: "#000000",
//             BGcolor: "#000000",
//             value: "",
//             formula: "",
//             children: [],
//         }
//         gridRow.push(cellProperty); 
//     }
//     sheetData.push(gridRow);
// }


let activeColorProperty = "#FFB6C1";
let inactiveColorProperty = "#ecf0f1"; 
//Select the cell properties
let bold = document.querySelector('.bold');
let italic = document.querySelector('.italic');
let underlined = document.querySelector('.underlined');
let fontSize = document.querySelector('.font-size-prop');
let fontFamily = document.querySelector('.font-family-prop');
let fontColor = document.querySelector('.font-color');
let fillColor = document.querySelector('.fill-color');
let align = document.querySelectorAll('.align'); // give you a nodelist

let leftAlignment = align[0];
let centerAlignment = align[1];
let rightAlignment = align[2];


// Will be using two way binding for Data and UI change below
// With selecting, now need event listeners when a click happens in cell property container elements
bold.addEventListener("click", (e) => {
    let address = addressBar.value; 
    let [cell, cellProperty] = getCellAndCellProp(address);

    //Handle Modification, click make bold opposite boolean value of what it was before 
    cellProperty.bold = !cellProperty.bold; 
    //Handle UI change
    cell.style.fontWeight = cellProperty.bold ? "bold" : "normal"; 
    bold.style.backgroundColor = cellProperty.bold ? activeColorProperty : inactiveColorProperty;
})

italic.addEventListener("click", (e) => {
    let address = addressBar.value; 
    let [cell, cellProperty] = getCellAndCellProp(address);

    //Handle Modification, click make bold opposite boolean value of what it was before 
    cellProperty.italic = !cellProperty.italic; 
    //Handle UI change
    cell.style.fontStyle = cellProperty.italic ? "italic" : "normal"; 
    italic.style.backgroundColor = cellProperty.italic ? activeColorProperty : inactiveColorProperty;
})

underlined.addEventListener("click", (e) => {
    let address = addressBar.value; 
    let [cell, cellProperty] = getCellAndCellProp(address);

    //Handle Modification, click make bold opposite boolean value of what it was before 
    cellProperty.underlined = !cellProperty.underlined; 
    //Handle UI change
    cell.style.textDecoration = cellProperty.underlined ? "underline" : "none"; 
    underlined.style.backgroundColor = cellProperty.underlined ? activeColorProperty : inactiveColorProperty;
})

fontSize.addEventListener("change", (e) => {
    let address = addressBar.value; 
    let [cell, cellProperty] = getCellAndCellProp(address);

    cellProperty.fontSize = fontSize.value;
    cell.style.fontSize = cellProperty.fontSize + "px";
    fontSize.value = cellProperty.fontSize;

})

fontFamily.addEventListener("change", (e) => {
    let address = addressBar.value; 
    let [cell, cellProperty] = getCellAndCellProp(address);

    cellProperty.fontFamily = fontFamily.value;
    cell.style.fontFamily = cellProperty.fontFamily;
    fontFamily.value = cellProperty.fontFamily;

})

fontColor.addEventListener("change", (e) => {
    let address = addressBar.value; 
    let [cell, cellProperty] = getCellAndCellProp(address);

    cellProperty.fontColor = fontColor.value;
    cell.style.color = cellProperty.fontColor;
    fontColor.value = cellProperty.fontColor;

})

fillColor.addEventListener("change", (e) => {
    let address = addressBar.value; 
    let [cell, cellProperty] = getCellAndCellProp(address);

    cellProperty.fillColor = fillColor.value;
    cell.style.backgroundColor = cellProperty.fillColor;
    fillColor.value = cellProperty.fillColor;

})

//for alignment, you can toggle between left, center, and right 
align.forEach((element) => {
    element.addEventListener("click", (e) => {
        let address = addressBar.value; 
        let [cell, cellProperty] = getCellAndCellProp(address);

        let alignVal = e.target.classList[2];
        cellProperty.alignment = alignVal;
        cell.style.textAlign = cellProperty.alignment;

        //UI change for which alignment is active 
        switch(alignVal) {
            case "left":
                leftAlignment.style.backgroundColor = activeColorProperty;
                centerAlignment.style.backgroundColor = inactiveColorProperty;
                rightAlignment.style.backgroundColor = inactiveColorProperty;
                break;
            case "center":
                leftAlignment.style.backgroundColor = inactiveColorProperty;
                centerAlignment.style.backgroundColor = activeColorProperty;
                rightAlignment.style.backgroundColor = inactiveColorProperty;
                break;
            case "right":
                leftAlignment.style.backgroundColor = inactiveColorProperty;
                centerAlignment.style.backgroundColor = inactiveColorProperty;
                rightAlignment.style.backgroundColor = activeColorProperty;
                break;

        }
    
    })
})

let allCells = document.querySelectorAll(".cell");
for (let i = 0; i < allCells.length; i++) {
    addListeverToAddCellProperties(allCells[i]);
}

//if you have pre existing properties selected and want to click on another cell and start fresh with default values of a cell, 
// this event listener does just that!
function addListeverToAddCellProperties(cell) {

    cell.addEventListener("click", (e) => {
        let address = addressBar.value;
        let [rowID, colID] = decodeCellFromAddress(address);
        let cellProperty = sheetData[rowID][colID];


        cell.style.fontWeight = cellProperty.bold ? "bold" : "normal"; 
        cell.style.fontStyle = cellProperty.italic ? "italic" : "normal"; 
        cell.style.textDecoration = cellProperty.underlined ? "underline" : "none"; 
        cell.style.fontSize = cellProperty.fontSize + "px";
        cell.style.fontFamily = cellProperty.fontFamily;
        cell.style.color = cellProperty.fontColor;
        cell.style.backgroundColor = cellProperty.fillColor === "#000000" ? "transparent" : cellProperty.fillColor;
        cell.style.textAlign = cellProperty.alignment;

        switch(cellProperty.alignment) {
            case "left":
                leftAlignment.style.backgroundColor = activeColorProperty;
                centerAlignment.style.backgroundColor = inactiveColorProperty;
                rightAlignment.style.backgroundColor = inactiveColorProperty;
                break;
            case "center":
                leftAlignment.style.backgroundColor = inactiveColorProperty;
                centerAlignment.style.backgroundColor = activeColorProperty;
                rightAlignment.style.backgroundColor = inactiveColorProperty;
                break;
            case "right":
                leftAlignment.style.backgroundColor = inactiveColorProperty;
                centerAlignment.style.backgroundColor = inactiveColorProperty;
                rightAlignment.style.backgroundColor = activeColorProperty;
                break;

        }

        //Applying the properties now 
        bold.style.backgroundColor = cellProperty.bold ? activeColorProperty : inactiveColorProperty;
        italic.style.backgroundColor = cellProperty.italic ? activeColorProperty : inactiveColorProperty;
        underlined.style.backgroundColor = cellProperty.underlined ? activeColorProperty : inactiveColorProperty;
        fontColor.value = cellProperty.fontColor;
        fillColor.value = cellProperty.fillColor;
        fontSize.value = cellProperty.fontSize;
        fontFamily.value = cellProperty.fontFamily;

        let formulaBar = document.querySelector('.formula-bar');
        formulaBar.value = cellProperty.formula;
        cell.innerText = cellProperty.value; 
    })

}

function getCellAndCellProp(address) {
    let [rowID, colID] = decodeCellFromAddress(address);
    // We want to access the cell and the storage object 
    let cell = document.querySelector(`.cell[rowID="${rowID}"][colID="${colID}"]`);
    let cellProperty = sheetData[rowID][colID];
    return [cell, cellProperty];

}

function decodeCellFromAddress(address) {
    // Logic: From the encoding in Address bar, we will now decode them into 
    // number values that match the storage matrix indices, which is sheetData
    let rowID = Number(address.slice(1) - 1);
    let colID = Number(address.charCodeAt(0) - 65);
    return [rowID, colID];
}
