let downloadButton = document.querySelector('.download');
let uploadButton = document.querySelector('.upload');

//This will download the json file of the sheet
downloadButton.addEventListener("click", (e) => {
    let jsonData = [sheetData, graphMatrix];
    let file = new Blog([jsonData], {type: "application/json"});

    let a = document.createElement("a");
    a.href = URL.createObjectURL(file);
    a.download = "SheetData.json";
    a.click();
})


uploadButton.addEventListener("click", (e) => {
    //Open file explorer
    let input = document.createElement("input");
    input.setAttribute("type", "file");
    input.click();

    input.addEventListener("change", (e) => {
        let fr = new FileReader();
        let files = input.files;
        let fileObj = files[0]; 

        fr.readAsText(fileObj);
        fr.addEventListener("load", (e) => {
            let readSheetData = JSON.parse(fr.result);

            //Basic sheet with default data is formed
            addSheetButton.click();

            //Relate the sheet data with the graph components 
            sheetData = readSheetData[0];
            graphMatrix = readSheetData[1];
            collectedSheets[collectedSheets.length - 1] = sheetData;
            collectedGraph[collectedGraph.length - 1] = graphMatrix;
            
            handleSheetProperties();
        })
    })
})