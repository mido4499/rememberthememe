let i;
let numImages = 12;
let select1;
let select2;
let clickCount = 0;

async function delay(ms){
    //return new Promise(resolve => setTimeout(resolve, ms));
    function executor(fulfill){
        setTimeout(fulfill, ms)
    }
    let myPromise = new Promise(executor);
    return myPromise;
}

//Passed as a callback function to handle the clicking of the cells:
async function handleClick(event){
    const cell = event.target.parentNode;  // This stores the <td> element clicked in a variable
    clickCount ++;  // Keeping track of a click counter
    if (clickCount === 1){  // ie. this is the first image to be selected
        cell.style.transform = "rotateY(180deg)";
        select1 = cell;  // Copies the current cell to another variable
        select1.dataset.clicked = "true";
    }else{  //This is the second image to be selected
        select2 = cell;  // Copies the second cell to another variable
        if (select2.dataset.clicked === "false"){  // Makes sure the user is not selecting the same image twice
            select2.dataset.clicked = "true";
            select2.style.transform = "rotateY(180deg)";
            restAreDeaf(cells, select1, select2);  // Stop event listening in the rest of the cells to prevent spamming clicks
            await delay(1000);  // To show the user if they're identical or not
            if (!isIdentical(select1, select2)){
                select1.style.transform = "rotateY(360deg)";  // Hides the images again
                select2.style.transform = "rotateY(360deg)"; 
            }
            makeListen(cells, select1, select2);  // Activates event Listening again

            clickCount = 0;                       // Resets everything again to prepare for the next click
            select1.dataset.clicked = "false";
            select2.dataset.clicked = "false";
        }
    }
}

// Logic to determine whether the selected images are identical
function isIdentical(cell1, cell2){
    src1 = cell1.children[0].children[0].src.slice(-8);
    src2 = cell2.children[0].children[0].src.slice(-8);
    if (src1 === src2){
        return true;
    }else{
        return false;
    }
}

function restAreDeaf(cells, cell1, cell2){
for ( i = 0; i < cells.length; i++){
    if ((cells[i].id !== cell1.id) && (cells[i].id !== cell2.id)){
        console.log(`IDs are ${cells[i].id} and ${cell1.id} and ${cell2.id}`);
        cells[i].removeEventListener("click", handleClick);
    }
}
}

function makeListen(cells){
cells.forEach((cell) =>{
    cell.addEventListener("click", handleClick);
});
}

//Main Code:
//  Creating an array of image elements, using the images in the file, then shuffling it:
const images = [];
let thisImageNum;
for (i = 1; i <= numImages; i ++){
    let thisImage = document.createElement("img");
    thisImage.style.objectFit = "cover";
    thisImage.style.width = "100%";
    thisImage.style.height = "100%";
    if (i <= numImages/2){
        thisImage.src = "img" + i + ".jpg";
        images.push(thisImage);
    }else{
        thisImageNum = i-numImages/2;
        thisImage.src = "img" + thisImageNum + ".jpg";
        images.push(thisImage);
    }
}

images.sort(() => Math.random() - 0.5);

//  Adding the images as childs in the table cells
const fronts = document.querySelectorAll(".front");
for (i = 0; i < fronts.length; i++){
    fronts[i].appendChild(images[i]); 
}

//  Event listener for clicking the cells
const cells = document.querySelectorAll(".cell");

// Showing the images one time once the webpage is loaded to give the user the chance to look at them
cells.forEach(async (cell) => {
    cell.style.transform = "rotateY(180deg)";
    await delay(1000);
    cell.style.transform = "rotateY(0deg)";
})

cells.forEach((cell) =>{
    cell.addEventListener("click", handleClick);
});