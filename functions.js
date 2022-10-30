
for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
        let cell = document.querySelector(`.cell[rowID="${i}"][colID="${j}"]`);
        cell.addEventListener("blur", (e) => {
            let address = addressBar.value; 
            let [cell, cellProperty] = getCellAndCellProp(address);
            let typedData = cell.innerText; 

            if (typedData === cellProperty.value) {
                return;
            }
            cellProperty.value = typedData; 
            //Modifying data remove the parent child relation, empty the formula, update the child with new value from user
            // in address bar
            removeChildFromParent(cellProperty.formula);
            cellProperty.formula = "";
            updateChildrenCell(address);
        })
    }
}
// logic: First, we select the formula bar and once we input a normal 
// or dependency expression and press enter, you want to evaluate what 
// you input, which can be taken care of by the js eval function 
let formulaBar = document.querySelector('.formula-bar');
formulaBar.addEventListener("keydown", async (e) => {
    if (e.key == "Enter" && formulaBar.value) {  
        
        let address = addressBar.value;
        
        let [cell, cellProperty] = getCellAndCellProp(address)
        
        //If there is a change in the formula from what was stored, you need to break the parent child 
        // relationship 
        if (formulaBar.value !== cellProperty.formula) {
            removeChildFromParent(cellProperty.formula);
        }

        addChildtoGraph(formulaBar.value, address);
        // After adding child to graph, it's best to check if graph is cyclic or not
        // and then evaluate
        //First see if graph is cyclic
        let cycleResponse = isGraphCyclic(graphMatrix);
        if (cycleResponse) {
            //If cycleResponse is an object and not null, give user the option to trace the path
            let response = confirm("Your formula is cyclic. Would you like to trace the cyclic path?");
            while (response === true) {
                // keep on tracking color of the cycle detected
                // Now, call function that deals with color tracking and keep js confirm alert up
                await isGraphCyclicTracePath(graphMatrix, cycleResponse);
                response = confirm("Your formula is cyclic. Would you like to trace your path?");

            }
            removeChildFromGraph(formulaBar.value, address);
            return;
        }

        let evaluatedVal = evaluateFormula(formulaBar.value);
        
        setCellUIAndCellProp(evaluatedVal, formulaBar.value, address);
        addChildToParent(formulaBar.value);
        updateChildrenCell(address);
    }
    
})

function addChildtoGraph(formula, childAddress) {
    //decode child
    let [childRowId, childColID] = decodeCellFromAddress(childAddress);
    let encodedFormula = formula.split(" ");
    for (let i = 0; i < encodedFormula.length; i++) {
        let asciiVal = encodedFormula[i].charCodeAt(0);
        if (asciiVal >= 65 && asciiVal <= 90) {
            //decode the parents, keep in mind that the parents are all those that you type in
            // formula bar as a user
           let [parentRowId, parentColId] = decodeCellFromAddress(encodedFormula[i]);
           graphMatrix[parentRowId][parentColId].push([childRowId, childColID]);
        }
    }

}

function removeChildFromGraph(formula, childAddress) {
    let [childRowId, childColID] = decodeCellFromAddress(childAddress);
    let encodedFormula = formula.split(" ");
    for (let i = 0; i < encodedFormula.length; i++) {
        let asciiVal = encodedFormula[i].charCodeAt(0);
        if (asciiVal >= 65 && asciiVal <= 90) {
           let [parentRowId, parentColId] = decodeCellFromAddress(encodedFormula[i]);
           graphMatrix[parentRowId][parentColId].pop();
        }
    }

}
function updateChildrenCell(parentAddress) {
    let [parentCell, parentCellProperty] = getCellAndCellProp(parentAddress);
    let children = parentCellProperty.children;

    for (let i = 0; i < children.length; i++) {
        let childAddress = children[i];
        let [childCell, childCellProp] = getCellAndCellProp(childAddress);
        let childFormula = childCellProp.formula;

        let evaluatedVal = evaluateFormula(childFormula);
        setCellUIAndCellProp(evaluatedVal, childFormula, childAddress);
        updateChildrenCell(childAddress);
    }
}
//if you have a dependent expression where the cell it depends on depends on other
// cell values, good to store the children values that depend on that cell
function addChildToParent(formula) {
    let childAddress = addressBar.value;
    let encodedFormula = formula.split(" ");
    for (let i = 0; i < encodedFormula.length; i++) {
        let asciiVal = encodedFormula[i].charCodeAt(0);
        if (asciiVal >= 65 && asciiVal <= 90) {
            let [parentCell, parentCellProperty] = getCellAndCellProp(encodedFormula[i]);
            parentCellProperty.children.push(childAddress);
        }
    }
}
// if a cell happens to no longer depend on the parent, remove from children list
function removeChildFromParent(formula) {
    let childAddress = addressBar.value;
    let encodedFormula = formula.split(" ");
    for (let i = 0; i < encodedFormula.length; i++) {
        let asciiVal = encodedFormula[i].charCodeAt(0);
        if (asciiVal >= 65 && asciiVal <= 90) {
            let [parentCell, parentCellProperty] = getCellAndCellProp(encodedFormula[i]);
            let indexRemove = parentCellProperty.children.indexOf(childAddress);
            parentCellProperty.children.splice(indexRemove, 1);
        }
    }
}
function evaluateFormula(formula) {
    let encodedFormula = formula.split(" ");
    for (let i = 0; i < encodedFormula.length; i++) {
        let asciiVal = encodedFormula[i].charCodeAt(0);
        if (asciiVal >= 65 && asciiVal <= 90) {
            // logic: get the cell and cell properties held and replace the
            // encoded cell (A1 lets say) with the value it holds (A1.value)
            let [cell, cellProperty] = getCellAndCellProp(encodedFormula[i]);
            encodedFormula[i] = cellProperty.value; 
        } 
    }
    let decodedFormula = encodedFormula.join(" ");

    return eval(decodedFormula);
}

// This is for updating the cell property in the model to store in cell value
function setCellUIAndCellProp(evaluatedVal, formula, address) {
    let [cell, cellProperty] = getCellAndCellProp(address);
    //Two way binding here, first update UI
    cell.innerText = evaluatedVal;
    // Update cell 
    cellProperty.value = evaluatedVal;
    cellProperty.formula = formula; 

}