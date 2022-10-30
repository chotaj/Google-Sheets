let rows = 100;
let cols = 26; // 26 alphabets 

let addressColumnContainer = document.querySelector('.address-column-container');
let addressRowContainer = document.querySelector('.address-row-container');
let cellContainer = document.querySelector('.cells');
let addressBar = document.querySelector('.address-bar');

for (let i = 0; i < rows; i++) {
    let addressColumn = document.createElement("div");
    addressColumn.setAttribute("class", "address-column");
    addressColumn.innerText = i + 1; 
    addressColumnContainer.appendChild(addressColumn);

}

for (let i = 0; i < cols; i++) {
    let addressRow = document.createElement("div");
    addressRow.setAttribute("class", "address-row");
    addressRow.innerText = String.fromCharCode(65 + i); 
    addressRowContainer.appendChild(addressRow);

}

//creation of cells
for (let i = 0; i < rows; i++) {
    let rowContainer = document.createElement('div');
    rowContainer.setAttribute("class", "row-container");
    for (let j = 0; j < cols; j++) {
        let cell = document.createElement('div');
        cell.setAttribute("class", "cell");
        cell.setAttribute("contenteditable", "true");
        //will use for cell + storage identification 
        cell.setAttribute("rowID", i);
        cell.setAttribute("colID", j);
        cell.setAttribute("spellCheck", "false")
        rowContainer.appendChild(cell);
        addressBarCell(cell, i , j);
    }
    cellContainer.appendChild(rowContainer);
}

function addressBarCell(cell, i , j) {
    cell.addEventListener('click', (e) => {
        let rowID = i + 1; 
        let colID = String.fromCharCode(65 + j);
        addressBar.value =`${colID}${rowID}`
    })
}
