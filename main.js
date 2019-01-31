//Setting reusable variables for Challenger names and guesses
var randomNum;
var chalName1 = document.getElementById('chal-1-name');
var chalGuess1 = document.getElementById('chal-1-guess');
var chalName2 = document.getElementById('chal-2-name');
var chalGuess2 = document.getElementById('chal-2-guess');

// Function to set range
var updateBtn = document.getElementById('update-btn');

updateBtn.addEventListener('click', setRange);

function setRange(e) {
  e.preventDefault();
  var min = document.getElementById('min-range').value;
  var max = document.getElementById('max-range').value;

  // Sets range text to entries
  document.querySelector('.range-text').innerText = "The current range is " + min + " to " + max;

  setRandom(min, max);
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

  // Resetting the names to the value on-click
  chalGuess1 = chalGuess1.value;
  chalGuess2 = chalGuess2.value;
  chalName1 = chalName1.value;
  chalName2 = chalName2.value;

  // Assigning variables for text to update
  var chal1NameText = document.querySelector('.chal-1-name-display');
  var chal2NameText = document.querySelector('.chal-2-name-display');
  var chal1GuessText = document.querySelector('.chal-1-guess-display');
  var chal2GuessText = document.querySelector('.chal-2-guess-display');
  var chal1HighLowText = document.querySelector('.chal-1-high-low');
  var chal2HighLowText = document.querySelector('.chal-2-high-low');

  chal1GuessText.innerText = chalGuess1;
  chal2GuessText.innerText = chalGuess2;
  chal1NameText.innerText = chalName1;
  chal2NameText.innerText = chalName2;


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
  
  highOrLow(chalGuess1, chal1HighLowText);
  highOrLow(chalGuess2, chal2HighLowText);

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
var guessForm = document.querySelector('.guess-form');

guessForm.addEventListener('input', function() {
  clearBtn.disabled = false;
});

function clearFields(e) {
    e.preventDefault();
    chalName1.value = "";
    chalGuess1.value = "";
    chalName2.value = "";
    chalGuess2.value = "";
    clearBtn.disabled = true;
}