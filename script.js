var numOne = 0;
var numTwo = 0;
var operatorActive = "";
var lastOperator = ""; // Store the last valid operator
var lastCharGlobal = "";

const buttons = document.querySelectorAll(".buttons");
const previousDisplay = document.getElementById("previousDisplay");
const display = document.getElementById("currentDisplay");
previousDisplay.textContent = "";

display.textContent = 0;

let displayNum = "0"; // Initialize displayNum as a string to concatenate numbers correctly
let lastOperatorButton = null; // To keep track of the last clicked operator button

buttons.forEach(button => button.addEventListener("click", (e) => {
    const clickedNum = e.target.getAttribute("data-number");

    if (clickedNum !== null) { // If it's a number button
        if (displayNum === "0") {
            displayNum = clickedNum; // Replace the initial 0
            display.textContent = displayNum;
        } else {
            displayNum += clickedNum;
            display.textContent = displayNum; // Update display
        }
        // Update previousDisplay with displayNum
        previousDisplay.textContent += String(clickedNum);
    } else { // If it's an operator or other special buttons
        switchOperations(e);
    }
}));
function switchOperations(e) {
    operatorActive = e.target.getAttribute("data-operator");

    if (lastOperatorButton) {
        lastOperatorButton.style.color = "white"; // Reset the color
        lastOperatorButton.style.backgroundColor = "orange"; // Reset the background color
    }

    switch (operatorActive) {
        case "clear":
            displayNum = "0";
            display.textContent = displayNum;
            previousDisplay.textContent = "";
            numOne = 0;
            numTwo = 0;
            operatorActive = "";
            lastOperator = "";
            break;
        case "changeSign":
            if (displayNum !== "0") { //can't have negative 0 lol
                let prevText = previousDisplay.textContent;
                let lastChar = prevText.slice(prevText.length-1); //gets the lastChar of previousDisplay, can be a digit or operator.

                if (!isNaN(parseFloat(lastChar)) && prevText.lastIndexOf(' ') !== -1) { //Checks if lastChar is a valid number when casted as a character.
                    prevText = prevText.slice(0, prevText.lastIndexOf(' ')); //Cuts off displayNum and whitespace before it.
                    displayNum = (parseFloat(displayNum) * -1).toString(); //Converting number sign
                    display.textContent = displayNum;
                    previousDisplay.textContent = prevText + " " + displayNum; //Putting it all together
                } else { //This is for displays without any operators. Like 8, 1.5, -19.
                    displayNum = (parseFloat(displayNum) * -1).toString();
                    display.textContent = displayNum;
                    previousDisplay.textContent = displayNum;
                }
            }
            break;
        case "percent":
            if (displayNum !== "0") { //can't have negative 0 lol
                let prevText = previousDisplay.textContent;
                let lastChar = prevText.slice(prevText.length-1); //gets the lastChar of previousDisplay, can be a digit or operator.

                if (!isNaN(parseFloat(lastChar)) && prevText.lastIndexOf(' ') !== -1) { //Checks if lastChar is a valid number when casted as a character.
                    prevText = prevText.slice(0, prevText.lastIndexOf(' ')); //Slices up to the space so its like 89 +.
                    displayNum = parseFloat(displayNum) * 0.01; //Converts number decimal from percent
                    display.textContent = displayNum; 
                    previousDisplay.textContent = prevText + " " + displayNum; 
                } else {//This is for displays without any operators. Like 8, 1.5, -19.
                    displayNum = parseFloat(displayNum) * 0.01;
                    display.textContent = displayNum;
                    previousDisplay.textContent = displayNum;
                }
            }
            break;
        case "add":
        case "subtract":
        case "multiply":
        case "divide":
            handleOperatorClick(e, operatorActive);
        
            break;
        case "calculate":
            if (lastOperatorButton) {
                lastOperatorButton.style.color = "white"; // Reset the color
                lastOperatorButton.style.backgroundColor = "orange"; // Reset the background color
            }
            if(lastOperator !== "" && lastOperator && displayNum !== "0" && displayNum !== ""){
                numTwo = parseFloat(displayNum);
                displayNum = operate(lastOperator, numOne, numTwo).toString();
                display.textContent = parseFloat(displayNum);
                previousDisplay.textContent += " = " + displayNum; 
                numOne = parseFloat(displayNum); // To allow continued operations
                operatorActive = "";
                lastOperator = "";
            }
            
            break;
    }
}

function handleOperatorClick(e, op) {
    let prevText = previousDisplay.textContent;
    
    console.log(prevText);
    console.log(lastCharGlobal);
    
    if (lastOperator !== "" && lastOperator !== "=" ){
        // If there was a previous operator and it's not "= or any operator", perform the calculation
        numTwo = parseFloat(displayNum);
        displayNum = operate(lastOperator, numOne, numTwo).toString();
        display.textContent = parseFloat(displayNum);
        previousDisplay.textContent += " = " + displayNum + " " + e.target.textContent;
    } else {
        // Otherwise, it's a new calculation, update the previousDisplay with the current number
        previousDisplay.textContent += " " + e.target.textContent;
    }

    // Highlight the clicked operator
    e.target.style.color = "orange";
    e.target.style.backgroundColor = "white";
    lastOperatorButton = e.target;
    
    // Store the current number and operator for the next calculation
    numOne = parseFloat(display.textContent);
    displayNum = "0"; //must be 0 for other if condiitons to work. 
    operatorActive = op;
    lastOperator = op; // Update lastOperator with the current operator
    

   
}

function updateText(){
    display.textContent = displayNum;

}

const operations = {
    add(a, b) {
        return a + b;
    },
    subtract(a, b) {
        return a - b;
    },
    multiply(a, b) {
        return a * b;
    },
    divide(a, b) {
        if (b === 0) {
            return "Error: Division by zero!";
        }
        return a / b;
    },
};

const operate = function (operatorActive, a, b) {
    if (operatorActive in operations) {
        return operations[operatorActive](a, b);
    } else {
        return "Operator invalid";
    }
};
