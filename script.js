let units = []; // Array to store units from JSON
let selectedUnit;
let attempts = 0;
let guessHistory = [];
const maxAttempts = 5;

// Fetch units from the JSON file
fetch('units.json')
    .then(response => response.json())
    .then(data => {
        units = data;
        resetUnit(); // Initialize
    })
    .catch(error => {
        console.error("Error fetching the units:", error);
    });

    function checkGuess() {
        const guessInput = document.getElementById('guessInput').value.trim();
        const feedback = document.getElementById('feedback');
        const hintsContainer = document.getElementById('hint'); // Container for current guess hints
    
        if (guessInput === "") {
            feedback.textContent = "Please enter a unit name.";
            feedback.style.color = "orange";
            return;
        }
    
        attempts++;
    
        const guessedUnit = units.find(game => game.name.toLowerCase() === guessInput.toLowerCase());
    
        // Clear previous hints
        hintsContainer.innerHTML = "";
    
        if (guessedUnit) {
            let guessHints = [];
    
            if (guessedUnit.name.toLowerCase() === selectedUnit.name.toLowerCase()) {
                feedback.textContent = "🎉 Correct! You guessed the unit!";
                feedback.style.color = "green";
                hintsContainer.innerHTML = ""; // Clear hints if correct
                guessHints.push("(You guessed the correct unit!)");
            } else {
                feedback.textContent = "❌ Wrong guess. Try again!";
                feedback.style.color = "red";
    
                // Add type and price hints to guessHints array
                guessHints.push(provideTypeHint(guessedUnit.type));
                guessHints.push(providePriceHint(guessedUnit.price));
            }
    
            // Store guess and hints in the guessHistory array
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

// Function to provide type-based hints and update DOM
function provideTypeHint(guessedType) {
    const selectedType = selectedUnit.type;
    const hintsContainer = document.getElementById('hint');

    let hintText = "";
    let hintClass = "";

    // Determine type hint
    if (guessedType === selectedType) {
        hintText = "✅ Unit Type is correct.";
        hintClass = "correct-type";
    } else {
        hintText = "❌ Unit Type is incorrect.";
        hintClass = "incorrect-type";
    }

    // Update the DOM (this is for the current guess)
    const hintItem = document.createElement('div');
    hintItem.className = `hint-item ${hintClass}`;
    hintItem.textContent = hintText;
    hintsContainer.appendChild(hintItem);

    return hintText; // Return the hint text for history
}

// Function to provide price-based hints and update DOM
function providePriceHint(guessedPrice) {
    const selectedPrice = selectedUnit.price;
    const hintsContainer = document.getElementById('hint');

    let hintText = "";
    let hintClass = "";

    // Determine price hint
    if (guessedPrice === selectedPrice) {
        hintText = "✅ Price is correct.";
        hintClass = "correct-price";
    } else if (guessedPrice > selectedPrice) {
        hintText = "❌ Price is too high.";
        hintClass = "over-price";
    } else {
        hintText = "❌ Price is too low.";
        hintClass = "under-price";
    }

    // Update the DOM (this is also for the current guess)
    const hintItem = document.createElement('div');
    hintItem.className = `hint-item ${hintClass}`;
    hintItem.textContent = hintText;
    hintsContainer.appendChild(hintItem);

    return hintText; // Return the hint text for history
}

{
    // Create and append the hint
    const hintItem = document.createElement('div');
    hintItem.className = `hint-item ${hintClass}`;
    hintItem.textContent = hintText;
    hintsContainer.appendChild(hintItem);
}

function updateGuessHistory() {
    const guessHistoryContainer = document.getElementById('guess-history');
    guessHistoryContainer.innerHTML = ""; // Clear current history

    guessHistory.forEach(item => {
        // Create a new list item for each guess
        const guessItem = document.createElement('li');
        guessItem.className = "guess-item";

        // Add guess as text
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


// Function to reset the game (Currently not working)
function resetUnit() {
    selectedUnit = units[Math.floor(Math.random() * units.length)];
    attempts = 0;
    document.getElementById('feedback').textContent = "";
    document.getElementById('hint').innerHTML = ""; // Clear hints
    document.getElementById('guessInput').value = "";
    document.getElementById('attempts').textContent = `Attempts: ${attempts}`;
}
