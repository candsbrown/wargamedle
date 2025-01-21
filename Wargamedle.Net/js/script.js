let units; // store units from JSON
let targetUnit = null; //stores target unit (this is the unit you're trying to guess!)
let selectedUnit = null; //stores unit currently selected

class Unit {
    constructor(jsonUnit) {
        this.id = jsonUnit.id;
        this.name = jsonUnit.name;
        this.icon_filename = jsonUnit.icon_filename;
        this.trueHintIcon = "🟩"; //these are emojis, need to change to images or maybe css classes later?
        this.falseHintIcon = "🟥"; //these are emojis, need to change to images or maybe css classes later?

        this.game_attributes = {
            "nation": jsonUnit.nation,
            "speed" : jsonUnit.speed,
            "frontal armor" : jsonUnit.armor,
            "strength" : jsonUnit.strength,
            "stealth" : jsonUnit.stealth,
            "year" : jsonUnit.year,
            "tab" : jsonUnit.tab,
            "price" : jsonUnit.price,
            "cards" : jsonUnit.cards,
            "prototype" : jsonUnit.is_prototype
        }
    }

    compareTo(other) {
        return this.id === other.id;
    }

    makeComparisonReport(other) {
        var res = [];
        for (let attribute in this.game_attributes)
            res.push((this.game_attributes[attribute] === other.game_attributes[attribute] ? this.trueHintIcon : this.falseHintIcon) + this.game_attributes[attribute]);
        return res;
    }

    getIconURL() {
        return `url(/assets/icons/${this.icon_filename.toLowerCase()})`;
    }

    getFlagURL() {
        return `url(/assets/flags/${this.game_attributes["nation"].toLowerCase()}_flag.png)`;
    }

    toString() {
        return `Unit[${this.id}(${this.name})]`;
    }
}

function categoryFormat(str) {
    return str.toUpperCase().replaceAll("_", " ");
}

function makeTableEntry(entryList, className = null, backgroundImageUrl = null, pos = 1) {
    const guessTable = document.getElementById("guess-table");
    const row = guessTable.insertRow(pos);

    for (var i in entryList) {
        const hintCell = row.insertCell(-1);
        hintCell.className = className;

        if (i === '0' && backgroundImageUrl != null) {
            hintCell.style.backgroundImage = backgroundImageUrl;
            hintCell.style.backgroundColor = "#555555";
            hintCell.style.fontSize = '1em';
        }

        const hintText = document.createElement("p");
        hintText.textContent = entryList[i];
        hintCell.appendChild(hintText);
    }
}

// Fetch units from the JSON file
fetch('/assets/unitData.json')
    .then(response => {
        return response.json();
    })
    .then(data => {
        units = data.map(item => new Unit(item));
        resetGame(); // Initialize the game once the data is loaded
    })
    .catch(error => {
        console.error("Error fetching the units:", error);
    });

//called on submission, both by pressing enter and 
function submit() {
    if (selectedUnit !== null) {
        let report = selectedUnit.makeComparisonReport(targetUnit);
        makeTableEntry([selectedUnit.name, ...report], 'hint', selectedUnit.getIconURL());

        if (selectedUnit.compareTo(targetUnit)) {
            document.getElementById("game-header").innerHTML = "Congratulations!";
            document.getElementById("game-subheader").innerHTML = "The unit was:";

            document.getElementById('button-submit').style.display = "none";
            document.getElementById('guessInput').style.display = "none";
        }
        else {
            document.getElementById('guess-icon-container').style.backgroundImage = null;
            document.getElementById('guess-container').textContent = "";
        }
    }
}

// Auto-complete (rework later to only appear after 3 or more characters)
function inputShowSuggestions() {
    const input = document.getElementById('guessInput').value.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
    const suggestionsContainer = document.getElementById('suggestions-container');
    
    // Clear previous suggestion
    suggestionsContainer.innerHTML = null;
    if (input === "") {
        return; // Don't show suggestions if input is empty
    }

    // Filter units based on input
    const filteredUnits = units.filter(unit => unit.name.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().includes(input));

    // Show suggestions
    filteredUnits.forEach(unit => {
        const suggestionItem = document.createElement('div');
        suggestionItem.className = 'suggestion-item';
        suggestionItem.style.backgroundImage = unit.getFlagURL()

        const suggestionText = document.createElement('p');
        suggestionText.className = 'suggestion-text';
        suggestionText.textContent = unit.name;


        suggestionItem.appendChild(suggestionText);

        // Fill field on click
        suggestionItem.onclick = function() {
            selectedUnit = unit;
            console.log(`selected ${selectedUnit.id}: ${selectedUnit.name}`);
            document.getElementById('guess-container').textContent = selectedUnit.name;
            document.getElementById('guessInput').value = '';
            document.getElementById('guess-icon-container').style.backgroundImage = selectedUnit.getIconURL();
            suggestionsContainer.innerHTML = ''; // Clear suggestions after selection
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
function resetGame() {
    // Select a new random unit
    targetUnit = units[Math.floor(Math.random() * units.length)];
    console.log("Target unit: " + targetUnit);
    
    //reset table & add categories
    let game_attributes = [""];
    for (let attribute in targetUnit.game_attributes) game_attributes.push(categoryFormat(attribute));
    makeTableEntry(game_attributes, 'category-headers', null, 0);
    
    //reset feedbacks
    document.getElementById("game-header").innerHTML = "Guess the Unit!";
    document.getElementById("game-subheader").innerHTML = "";
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
