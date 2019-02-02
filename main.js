//Setting reusable variables for Challenger names and guesses
var randomNum;
var min = 1;
var max = 100;
var chalName1 = document.getElementById('chal-1-name');
var chalGuess1 = document.getElementById('chal-1-guess');
var chalName2 = document.getElementById('chal-2-name');
var chalGuess2 = document.getElementById('chal-2-guess');
var guessInputs = [chalName1, chalGuess1, chalName2, chalGuess2];

// Function to set range
var updateBtn = document.getElementById('update-btn');

updateBtn.addEventListener('click', setRange);

function setRange(e) {
  e.preventDefault();
  min = document.getElementById('min-range').value;
  max = document.getElementById('max-range').value;

  // Sets range text to entries
  document.querySelector('.min-range-txt').innerText = min;
  document.querySelector('.max-range-txt').innerText = max;

  setRandom(min, max);

  resetBtn.disabled = false;
}

// Generate random number within the range
function setRandom(min,max) {
    randomNum = Math.floor(Math.random()*(max-min+1)+min);
  }


// Function to submit & record player info and guesses
var guessBtn = document.getElementById('guess-btn');

guessBtn.addEventListener('click', submitGuess);

function submitGuess(e) {
  e.preventDefault();

  // Assigning variables for text to update
  var chal1NameText = document.querySelector('.chal-1-name-display');
  var chal2NameText = document.querySelector('.chal-2-name-display');
  var chal1GuessText = document.querySelector('.chal-1-guess-display');
  var chal2GuessText = document.querySelector('.chal-2-guess-display');
  var chal1HighLowText = document.querySelector('.chal-1-high-low');
  var chal2HighLowText = document.querySelector('.chal-2-high-low');

  chal1GuessText.innerText = chalGuess1.value;
  chal2GuessText.innerText = chalGuess2.value;
  chal1NameText.innerText = chalName1.value;
  chal2NameText.innerText = chalName2.value;
  
  highOrLow(chalGuess1.value, chal1HighLowText);
  highOrLow(chalGuess2.value, chal2HighLowText);

  clearFields(e);

  resetBtn.disabled = false;

}

// State whether guesses are too high or low
function highOrLow(guess, text) {
  if (guess > randomNum) {
    text.innerText = "that's too high";
  } else if (guess < randomNum) {
    text.innerText = "that's too low";
  } else if (guess === randomNum) {
    alert('BOOM!');
    // !!!!!!Do all this shit of creating a card with winner details
  }
}

// One button that resets the game and generates a new random number
var resetBtn = document.getElementById('reset-btn');

// Reset button disabled by default
resetBtn.disabled = true;

// Clear the inputs for challenger names and guesses
var clearBtn = document.getElementById('clear-btn');

clearBtn.addEventListener('click', clearFields);

clearBtn.disabled = true;


// Listens for whether user enters text into guess form
for (var i = 0; i < guessInputs.length; i++){
  guessInputs[i].addEventListener('input', function() {
    // if (guessInputs.forEach(input) = "") {}
  // !!!ADD if statement that checks if ALL fields are empty, then clear.  if not, dont disable.
  clearBtn.disabled = false;
  });
}

function clearFields(e) {
    e.preventDefault();
    for (var i = 0; i < guessInputs.length; i++){
      console.log(guessInputs);
      guessInputs[i].value = "";
    }

    clearBtn.disabled = true;
}


// Add cards to output
var cardTemplate = document.querySelector('.output');

// Function to display the card
function displayCard () {
  document.body.appendChild(cardTemplate.content.cloneNode(true));
};

displayCard();
displayCard();
displayCard();



