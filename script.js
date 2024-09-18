// List of units with their descriptors
const units = [
    { name: 'AH-64D Longbow', type: "Helo", price: 150},
    { name: 'ATGM Milan F1', type: "Inf", price: 10},
    { name: 'ATGM Milan F2', type: "Inf", price: 20},
    { name: 'FOB', type: "Log", price: 75},
    { name: 'SAS', type: "Inf", price: 30},
    // Add more units as needed
];

// Pick a random unit from the list
let selectedUnit = units[Math.floor(Math.random() * units.length)];
let attempts = 0;
let guessHistory = []; // Store guesses and associated hints
const maxAttempts = 5; // Define maximum attempts for hints

// Function to check the user's guess
function checkGuess() {
    const guessInput = document.getElementById('guessInput').value.trim();
    const feedback = document.getElementById('feedback');
    const hintsContainer = document.getElementById('hint');

    if (guessInput === "") {
        feedback.textContent = "Please enter a unit name.";
        feedback.style.color = "orange";
        return;
    }

    attempts++;

    // Find the guessed unit in the unit list
    const guessedUnit = units.find(unit => unit.name.toLowerCase() === guessInput.toLowerCase());

    // Clear previous hints
    hintsContainer.innerHTML = "";

    if (guessedUnit) {
        let guessHints = [];

        if (guessedUnit.name.toLowerCase() === selectedUnit.name.toLowerCase()) {
            feedback.textContent = "🎉 Correct! You guessed the unit!";
            feedback.style.color = "green";
            hintsContainer.innerHTML = ""; // Clear hints if correct
            guessHints.push("Correct Guess!");
        } else {
            feedback.textContent = "❌ Wrong guess. Try again!";
            feedback.style.color = "red";

            // Store both type and price hints in an array
            guessHints.push(provideTypeHint(guessedUnit.type));
            guessHints.push(providePriceHint(guessedUnit.price));
        }

        // Store the guess and hints in the guessHistory array
        guessHistory.push({
            guess: guessInput,
            hints: guessHints
        });

        // Update the guess history UI
        updateGuessHistory();
    } else {
        feedback.textContent = "❓ Unit not found in the list. Please try another unit.";
        feedback.style.color = "orange";
    }

    // Clear the input field
    document.getElementById('guessInput').value = "";
}

// Function to provide type-based hints
function provideTypeHint(guessedType) {
    const selectedType = selectedUnit.type;
    const hintsContainer = document.getElementById('hint');

    let hintText = "";
    let hintClass = "";

    if (guessedType === selectedType) {
        hintText = "Hint: Your guess is in the same unit type!";
        hintClass = "correct-type";
    } else {
        hintText = "Hint: Your guess is not the same unit type.";
        hintClass = "incorrect-type";
    }

    // Create and append the hint
    const hintItem = document.createElement('div');
    hintItem.className = `hint-item ${hintClass}`;
    hintItem.textContent = hintText;
    hintsContainer.appendChild(hintItem);
}

// Function to provide price-based hints
function providePriceHint(guessedPrice) {
    const selectedPrice = selectedUnit.price;
    const hintsContainer = document.getElementById('hint');

    let hintText = "";
    let hintClass = "";

    if (guessedPrice === selectedPrice) {
        hintText = "Hint: Your guess is the same price!";
        hintClass = "correct-price";
    } else if (guessedPrice > selectedPrice) {
        hintText = "Hint: Your guess is more expensive.";
        hintClass = "over-price";
    } else {
        hintText = "Hint: Your guess is less expensive.";
        hintClass = "under-price";
    }

    // Create and append the hint
    const hintItem = document.createElement('div');
    hintItem.className = `hint-item ${hintClass}`;
    hintItem.textContent = hintText;
    hintsContainer.appendChild(hintItem);
}

function updateGuessHistory() {
    const guessHistoryContainer = document.getElementById('guess-history');
    guessHistoryContainer.innerHTML = ""; // Clear the current history

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
            hintText.textContent = hint;
            guessItem.appendChild(hintText);
        });

        // Append the guess item to the history container
        guessHistoryContainer.appendChild(guessItem);
    });
}

// Function to reset the game
function resetUnit() {
    selectedUnit = units[Math.floor(Math.random() * units.length)];
    attempts = 0;
    document.getElementById('feedback').textContent = "";
    document.getElementById('hint').innerHTML = ""; // Clear hints
    document.getElementById('guessInput').value = "";
    document.getElementById('attempts').textContent = `Attempts: ${attempts}`;
}