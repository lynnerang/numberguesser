//Setting variables for range and random number
var randomNum;
var minEl = document.getElementById('min-range');
var maxEl = document.getElementById('max-range');
minEl.value = 1;
maxEl.value = 100;
var minInt = 1;
var maxInt = 100;
var guessCount = 1;  //To log the first time before checkWinner fn is run that adds to it
var startTime;
var minutes;

//Setting reusable variables for Challenger names and guesses from inputs
var chal1NameEl = document.getElementById('chal-1-name');
var chal1GuessEl = document.getElementById('chal-1-guess');
var chal2NameEl = document.getElementById('chal-2-name');
var chal2GuessEl = document.getElementById('chal-2-guess');
var chal1GuessInt;
var chal2GuessInt;

// Setting variables for text to update
var chal1NameText = document.querySelector('.chal-1-name-display');
var chal2NameText = document.querySelector('.chal-2-name-display');
var chal1GuessText = document.querySelector('.chal-1-guess-display');
var chal2GuessText = document.querySelector('.chal-2-guess-display');
var chal1HighLowText = document.querySelector('.chal-1-high-low');
var chal2HighLowText = document.querySelector('.chal-2-high-low');
var cardParent = document.querySelector('.output');
var winnerName;
var winnerCardID = 1;

// Error message for challenger names
var rangeErrDiv = document.querySelector('.j-rng-err');
var rangeErrTxt = document.querySelector('.j-range-txt');
var chal1NameErrDiv = document.querySelector('.j-c1n-err');
var chal2NameErrDiv = document.querySelector('.j-c2n-err');
var chal1RngErrDiv = document.querySelector('.j-c1g-err');
var chal2RngErrDiv = document.querySelector('.j-c2g-err');

// Buttons for game
var resetBtn = document.getElementById('reset-btn');
var clearBtn = document.getElementById('clear-btn');
var updateBtn = document.getElementById('update-btn');
var guessBtn = document.getElementById('guess-btn');

// Setting variable for card output side
var cardTemplate = document.querySelector('.output');

//Arrays of variables
var allInputs = [minEl, maxEl, chal1NameEl, chal1GuessEl, chal2NameEl, chal2GuessEl];
var guessErrors = [chal1RngErrDiv, chal2RngErrDiv, chal1NameErrDiv, chal2NameErrDiv];
var rangeInputsEl = [minEl, maxEl];
var guessFormInputsEl = [chal1GuessEl, chal2GuessEl, chal1NameEl, chal2NameEl];
var numInputsEl = [chal1GuessEl, chal2GuessEl, minEl, maxEl];

// Array for blocking invalid chars from number input
var invalidChars = ["-", "+", "e"];

// Event listeners
updateBtn.addEventListener('click', onUpdateRange);
clearBtn.addEventListener('click', onClearFields);
resetBtn.addEventListener('click', onReset);
guessBtn.addEventListener('click', onSubmitGuess);
cardParent.addEventListener('click', onRemoveCard);

  // Listens for whether user enters text into guess form
for (var i = 0; i < guessFormInputsEl.length; i++){
  guessFormInputsEl[i].addEventListener('keyup', function(){
    var emptyInputs = guessFormInputsEl.every(function(input) { return !input.value; });
    clearBtn.disabled = emptyInputs;
  });
}

  // Listens for whether user tries to type invalid chars into number fields
for (var i = 0; i < numInputsEl.length; i++){
  numInputsEl[i].addEventListener('keydown', function(e) {
    if (invalidChars.includes(e.key)) {
      e.preventDefault();
    }
  });
}

// Sets default states for buttons
resetBtn.disabled = true;
clearBtn.disabled = true;


// Start default game on page load
startNewGame(minInt, maxInt);

// Game timer functions
function startTimer() {
  startTime = Date.now();
}

function endTimer() {
  var endTime = Date.now();
  var totalTime = ((endTime - startTime) / 1000) / 60;
  minutes = totalTime.toFixed(2);
}

// Generates random number within the range
function setRandom(minimum, maximum) {
    randomNum = Math.floor(Math.random() * (maximum - minimum + 1)) + minimum;
  }

// Starts a new game
function startNewGame(minInt, maxInt) {

  if (minInt < 0) {
    minInt = 0;
  }

  minEl.value = minInt;
  maxEl.value = maxInt;
  document.querySelector('.min-range-txt').innerText = minInt;
  document.querySelector('.max-range-txt').innerText = maxInt;

  setRandom(minInt, maxInt);

  clearLatestScore();

  // Restart timer & number of guesses
  startTimer();
  guessCount = 1;
}

// Sets range and triggers new game with random number in that range and displays error if min > max
function onUpdateRange() {
  minInt = parseInt(minEl.value);
  maxInt = parseInt(maxEl.value);

  if (validRange(minInt, maxInt) && hasBothInputs() ) {
    clearRngErr();
    resetBtn.disabled = false;
    startNewGame(minInt, maxInt);
  } else {
    showRngErr();
  }
}

function hasBothInputs() {
  return rangeInputsEl.every(function(input) { return input.value; });
}

function validRange(minInt, maxInt) { 
 if (minInt >= maxInt) {
   return false;
  }
 else { return true;}
}

function showRngErr() {
  displayRngErr();
  if (!validRange(minInt, maxInt)) {
    rangeErrTxt.innerText = "Minimum must be less than maximum.";
  } else {
    rangeErrTxt.innerText = "Enter both a minimum and maximum value.";
  }
}

// Function to submit and record player info and guesses
function onSubmitGuess() {
  chal1GuessInt = parseInt(chal1GuessEl.value);
  chal2GuessInt = parseInt(chal2GuessEl.value);

  if (hasAllInputs() && guessesValid()) {
    showLatestScore();
    chal1GuessEl.value = "";
    chal2GuessEl.value = "";
    clearGuessFormErrs();
    resetBtn.disabled = false;
    checkForWinner(chal1GuessInt, chal2GuessInt);
  } else {
    checkForValues();
  }

  checkForMrPB();
}

//Checks if both challenger names and guesses were entered
function hasAllInputs() {
  return guessFormInputsEl.every(function(input) { return input.value; });
}

//Displays errors for EACH field that is empty
function checkForValues() {

  for (var i = 0; i < guessFormInputsEl.length; i++) {
    if (!guessFormInputsEl[i].value) {
      showInputErr(guessFormInputsEl[i], guessErrors[i], 'Please enter a value.');
    } else {
      checkInputs(guessFormInputsEl[i], guessErrors[i]);
    }
  }
}

//IDs the guess inputs and runs a check for validity, & removes errors for names w/ values
function checkInputs(guessEl, errDiv) {
  if (guessEl.type == 'number') {
    validateGuess(guessEl, errDiv);
  } else {
    removeInputErr(guessEl, errDiv);
  }
}

//Displays errors for EACH guess not within min & max range
function validateGuess(guessEl, errDiv) {
  if (parseInt(guessEl.value) < minInt || parseInt(guessEl.value) > maxInt) {
    showInputErr(guessEl, errDiv, 'Please enter a number within the range.');
    return false;
  } else {
    removeInputErr(guessEl, errDiv);
    return true;
  }
}

function showInputErr(guessEl, errDiv, message) {
  guessEl.classList.add('error-border');
  errDiv.classList.remove('error-h');
  errDiv.getElementsByClassName('error-t')[0].innerText = message;
}

function removeInputErr(guessEl, errDiv) {
  errDiv.classList.add('error-h');
  guessEl.classList.remove('error-border');
}

//Checks that both challenger guesses were within range
function guessesValid() {
  return (validateGuess(chal1GuessEl, chal1RngErrDiv) && validateGuess(chal2GuessEl, chal2RngErrDiv));
}

function checkForMrPB() {
  chal1NameLC = chal1NameEl.value.toLowerCase();
  chal2NameLC = chal2NameEl.value.toLowerCase();
  if (chal1NameLC.includes("poopy", "butthole") || chal2NameLC.value.includes("poopy", "butthole")) {
    document.querySelector('.pb-animation').classList.add('mr-pb');
  }
}

function showLatestScore() {
  chal1GuessText.innerText = chal1GuessEl.value;
  chal2GuessText.innerText = chal2GuessEl.value;
  chal1NameText.innerText = chal1NameEl.value;
  chal2NameText.innerText = chal2NameEl.value;

  highOrLow(chal1GuessInt, chal1HighLowText);
  highOrLow(chal2GuessInt, chal2HighLowText);
}

function clearLatestScore() {
  chal1NameText.innerText = "--";
  chal2NameText.innerText = "--";
  chal1GuessText.innerText = "--";
  chal2GuessText.innerText = "--";
  chal1HighLowText.innerText = "--";
  chal2HighLowText.innerText = "--";
}

// Function onClearFields
function onClearFields() {
  for (var i = 0; i < guessFormInputsEl.length; i++) {
    guessFormInputsEl[i].value = "";
  }
  clearGuessFormErrs();
  clearBtn.disabled = true;
}

function onReset() {
  minEl.value = 1;
  maxEl.value = 100;

  clearLatestScore();
  onClearFields();
  clearRngErr();
  startNewGame(1, 100);
  resetBtn.disabled = true;
}

function clearGuessFormErrs() {
  for (var i = 0; i < guessFormInputsEl.length; i++) {
    guessFormInputsEl[i].classList.remove('error-border');
    guessErrors[i].classList.add('error-h');
  }
}

function displayRngErr() {
  rangeErrDiv.classList.remove('error-h');
  minEl.classList.add('error-border');
  maxEl.classList.add('error-border');
}

function clearRngErr() {
  rangeErrDiv.classList.add('error-h');
  minEl.classList.remove('error-border');
  maxEl.classList.remove('error-border');
}

// Function checks for winner
function checkForWinner(guess1, guess2) {
  if (guess1 == randomNum && guess2 == randomNum) {
    winnerName = "Tie Game!";
    gameWon();
    onReset();
  } else if (guess1 == randomNum && guess2 != randomNum) {
    winnerName = chal1NameEl.value;
    gameWon();
  } else if (guess1 != randomNum && guess2 == randomNum) {
    winnerName = chal2NameEl.value;
    gameWon();
  } else {
    chal1GuessEl.value = "";
    chal2GuessEl.value = "";
    guessCount++;
  }
}

// State whether guesses are too high or low
function highOrLow(guess, text) {
  if (guess > randomNum) {
    text.innerText = "that's too high";
  } else if (guess < randomNum) {
    text.innerText = "that's too low";
  } else if (guess == randomNum) {
    text.innerText = "You guessed right!";
  }
}

// Function to display the card
function gameWon() {
  endTimer();
  var htmlText = `<section class="l-flex l-flex-dir winner-card animated flash">
          <div class="l-flex l-flex-j-sa">
            <p class="chal-1-name vs-chal-1 vs-chal uppercase">${chal1NameEl.value}</p>
            <p class="vs">vs</p>
            <p class="chal-2-name vs-chal-2 vs-chal uppercase">${chal2NameEl.value}</p>
          </div>
          <div class="winner-text uppercase">
            <p class="winner-chal-name">${winnerName}</p>
            <p class="fnt-light">WINNER</p>
          </div>
          <div class="l-flex l-flex-j-sb l-flex-a-e guess-count">
            <p class="l-flex-1 fnt-light uppercase"><span class="fnt-x-bold">${guessCount * 2}</span> guesses</p>
            <p class="l-flex-1 center fnt-light uppercase"><span class="fnt-x-bold">${minutes}</span> minutes</p>
            <p class="l-flex-1 right-align"><i class="fas fa-times-circle delete-button"></i></p>
          </div>
        </section>`;
  cardTemplate.innerHTML += htmlText;


  minInt -= 10;
  maxInt += 10;

  startNewGame(minInt, maxInt);
}

function onRemoveCard() {
  if (event.target.classList.contains('delete-button')) {
    event.target.parentNode.parentNode.parentNode.remove();
  }
}

