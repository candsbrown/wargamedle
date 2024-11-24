let units = []; // Array to store units from JSON
let selectedUnit; //stores selected unit (this is the unit you're trying to guess!)

// Fetch units from the JSON file
fetch('/assets/unitData.json') //wargamedle is basically root directory
    .then(response => {
        return response.json();
    })
    .then(data => {
        units = data;
        resetUnit(); // Initialize the game once the data is loaded
    })
    .catch(error => {
        console.error("Error fetching the units:", error);
    });

//called on submission, both by pressing enter and 
function submit() {
    const inputElement = document.getElementById('guessInput');
    const suggestionsContainer = document.getElementById('suggestions-container');

    if (inputElement.value.trim() !== "" && suggestionsContainer.children.length !== 0) { //get first autocomplete
        inputElement.value = suggestionsContainer.children[0].innerHTML;
        suggestionsContainer.innerHTML = ""; //clear other suggestions
    }
    else if (inputElement.value.trim() !== "") { //submit what's in the box
        console.log("submitted: " + inputElement.value);
        if (checkSubmission(inputElement.value.trim())) document.getElementById('guessInput').value = ""; //clear the input field
    }
}

//checks submission, finds unit
function checkSubmission(guess) {
    //get guessed unit based on name
    const guessedUnit = units.find(unit => unit.name.toLowerCase() === guess.toLowerCase());

    if (guess === "" || !guessedUnit) { //if unit not found...
        console.log("checkGuess false");
        return false;
    }

    compareGuess(guessedUnit);
    return true;
}

//makes guess comparisons
function compareGuess(guessedUnit) {
    const feedbackLine = document.getElementById("feedback");

    if (selectedUnit.id === guessedUnit.id) {
        console.log("Winner!"); //do winning stuff
        feedbackLine.textContent = "Congratulations!"
    } else {
        feedbackLine.textContent = "Not quite!"
    }
    
    //country, tab, year, cost, armor, stealth
    selectedUnitFrontalArmor = selectedUnit.armor.split("|")[0];
    guessedUnitFrontalArmor = guessedUnit.armor.split("|")[0];

    //makes comparison: true/false for boolean hints, -1,0,1 for higher/lower hints
    const comparison = [
        selectedUnit.country === guessedUnit.country,
        selectedUnit.tab === guessedUnit.tab,
        (selectedUnit.year < guessedUnit.year) ? -1 : ((selectedUnit.year > guessedUnit.year) ? 1 : 0),
        (selectedUnit.cost < guessedUnit.cost) ? -1 : ((selectedUnit.cost > guessedUnit.cost) ? 1 : 0),
        (selectedUnitFrontalArmor < guessedUnitFrontalArmor) ? -1 : ((selectedUnitFrontalArmor > guessedUnitFrontalArmor) ? 1 : 0),
        selectedUnit.stealth === guessedUnit.stealth
    ];

    console.log(comparison);
    updateGuessTable(guessedUnit.name, comparison);
}

//updates table with guess and comparison data
function updateGuessTable(name, comparison) {
    const guessTable = document.getElementById("guess-table");
    const row = guessTable.insertRow(-1);

    const nameCell = row.insertCell(0);
    const nameText = document.createElement("p");
    nameText.textContent = name;
    nameCell.appendChild(nameText);

    for (let i = 0; i < comparison.length; i++) {
        let hint;
        if (comparison[i] === false) {
            hint = "🟥";
        }
        else if (comparison[i] === true || comparison[i] === 0) {
            hint = "🟩";
        }
        else if (comparison[i] < 0) {
            hint = "⬇️";
        }
        else {//if (comparison[i] > 0)
            hint = "⬆️";
        }

        const hintCell = row.insertCell(i+1);
        hintCell.className = "hint";
        const hintText = document.createElement("p");
        hintText.textContent = hint;
        hintCell.appendChild(hintText);
    }
}

//add test to table
function test() {
    console.log("test2");
    const table = document.getElementById("guess-table");

    const row = table.insertRow(-1);

    for (let i = 0; i < 7; i++) {
        const cell = row.insertCell(i);
        const paragraph = document.createElement("p");

        paragraph.textContent = (i === 0) ? "New!":String(i);
        cell.appendChild(paragraph);
    }
}

function updateGuessSummary() {
    const summaryType = document.getElementById('summary-type');
    const summaryPrice = document.getElementById('summary-price');
    const summaryNation = document.getElementById('summary-nation');
    const summaryFAV = document.getElementById('summary-fav');

    // Update each element if it was correct
    if (correctGuesses.type) {
        summaryType.textContent = `Type: ${correctGuesses.type}`;
        summaryType.classList.add("correct-summary");
    }
    if (correctGuesses.price) {
        summaryPrice.textContent = `Price: ${correctGuesses.price}`;
        summaryPrice.classList.add("correct-summary");
    }
    if (correctGuesses.nation) {
        summaryNation.textContent = `Nation: ${correctGuesses.nation}`;
        summaryNation.classList.add("correct-summary");
    }
    if (correctGuesses.fav !== null && correctGuesses.fav !== undefined) {
        summaryFAV.textContent = `FAV: ${correctGuesses.fav}`;
        summaryFAV.classList.add("correct-summary");
    }
}

function updateGuessHistory() {
    const guessHistoryContainer = document.getElementById('guess-history');
    guessHistoryContainer.innerHTML = ""; // Clear current history

    guessHistory.forEach(item => {
        // Create a new list item for each guess
        const guessItem = document.createElement('li');
        guessItem.className = "guess-item";

        // Add the guess text
        const guessText = document.createElement('div');
        guessText.className = "guess-text";
        guessText.textContent = `Guess: ${item.guess}`;
        guessItem.appendChild(guessText);

        // Add the associated hints
        item.hints.forEach(hint => {
            const hintText = document.createElement('div');
            hintText.className = "hint-text";
            hintText.textContent = hint;  // Correctly shows hint text now
            guessItem.appendChild(hintText);
        });

        // Append the guess item to the history container
        guessHistoryContainer.appendChild(guessItem);
    });
}

// Auto-complete (rework later to only appear after 3 or more characters)
function inputShowSuggestions() {
    const input = document.getElementById('guessInput').value.toLowerCase();
    const suggestionsContainer = document.getElementById('suggestions-container');
    
    // Clear previous suggestion
    suggestionsContainer.innerHTML = null;
    if (input === "") {
        return; // Don't show suggestions if input is empty
    }

    // Filter units based on input
    const filteredUnits = units.filter(unit => unit.name.toLowerCase().startsWith(input));

    // Show suggestions
    filteredUnits.forEach(unit => {
        const suggestionItem = document.createElement('div');
        suggestionItem.className = 'suggestion-item';
        suggestionItem.textContent = unit.name;

        // Fill field on click
        suggestionItem.onclick = function() {
            document.getElementById('guessInput').value = unit.name;
            suggestionsContainer.innerHTML = ""; // Clear suggestions after selection
        };

        suggestionsContainer.appendChild(suggestionItem);
    });
}

// Remove auto-complete dropdown
document.addEventListener('click', function(event) {
    if (!event.target.matches('#guessInput')) {
        document.getElementById('suggestions-container').innerHTML = "";
    }
});

// Reset
function resetUnit() {
    // Select a new random unit
    selectedUnit = units[Math.floor(Math.random() * units.length)];
    console.log("Selected unit: " + selectedUnit.name);
}


// Debounce auto-complete
function debounce(func, delay) {
    let debounceTimer;
    return function() {
        const context = this;
        const args = arguments;
        clearTimeout(debounceTimer);
        debounceTimer = setTimeout(() => func.apply(context, args), delay);
    }
}

document.getElementById('guessInput').addEventListener('input', debounce(inputShowSuggestions, 0));
