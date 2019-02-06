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
var winnerText = 'You guessed right!';
var winnerName;
var winnerCardID = 1;

// Error message for challenger names
var rangeErrDiv = document.querySelector('.j-rng-err');
var rangeErrTxt = document.querySelector('.js-range-txt');
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
  var totalTime = (endTime - startTime) / 1000;
  console.log('total ' + totalTime);
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

  // Restart timer & number of guesses
  startTimer();
  guessCount = 1;
}

// Sets range and triggers new game with random number in that range and displays error if min > max
function onUpdateRange() {
  
  var hasBothInputs = rangeInputsEl.every(function(input) { return input.value; });

  if (!hasBothInputs) {
    rangeErrTxt.innerText = "Enter both minimnum and maximum numbers.";
    displayRangeFormErrors();
  } else {  
    minInt = parseInt(minEl.value);
    maxInt = parseInt(maxEl.value);
    clearRangeFormErrors();
    validateRange(minInt, maxInt);
  }
}

function validateRange(minInt, maxInt) {
  if (minInt >= maxInt) {
    rangeErrTxt.innerText = "Minimum must be less than maximum.";
    displayRangeFormErrors();
  } else {
    clearRangeFormErrors();
    startNewGame(minInt, maxInt);
    resetBtn.disabled = false;
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
    resetBtn.disabled = false;
    checkForWinner(chal1GuessInt, chal2GuessInt);
  }
}

function hasAllInputs() {
  var hasAll = guessFormInputsEl.every(function(input) { return input.value; });
  if (hasAll === true) {
    clearGuessFormErrors();
    return true;
  } else {
    updateGuessFormErrs();
    return false;
  }
}

//Displays errors for EACH field that is empty
function updateGuessFormErrs() {
  for (var i = 0; i < guessFormInputsEl.length; i++){
    if (!guessFormInputsEl[i].value) {
      guessFormInputsEl[i].classList.add('error-border');
      guessErrors[i].classList.remove('error-h');
      guessErrors[i].getElementsByClassName('error-t')[0].innerText = "Please enter a value.";
    } else {
      guessFormInputsEl[i].classList.remove('error-border');
      guessErrors[i].classList.add('error-h');
    }
  }
}

//Displays errors for EACH guess not within min & max range
function validateGuess(guessEl, errDiv) {
  if (parseInt(guessEl.value) < minInt || parseInt(guessEl.value) > maxInt) {
    errDiv.classList.remove('error-h');
    guessEl.classList.add('error-border');
    errDiv.getElementsByClassName('error-t')[0].innerText = "Guess must be within range.";
    return false;
  } else {
    errDiv.classList.add('error-h');
    guessEl.classList.remove('error-border');
    return true;
  }
}

//Checks that both challenger guesses were within range, and if so, updates latest scores and checks for a winner
function guessesValid() {
  if (validateGuess(chal1GuessEl, chal1RngErrDiv) && validateGuess(chal2GuessEl, chal2RngErrDiv)) {
    return true;
  }
  else {
    return false;
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
  chal1NameText.innerText = "Challenger 1 Name";
  chal2NameText.innerText = "Challenger 2 Name";
  chal1GuessText.innerText = "0";
  chal2GuessText.innerText = "0";
  chal1HighLowText.innerText = "--";
  chal2HighLowText.innerText = "--";
}

// Function onClearFields
function onClearFields() {
  for (var i = 0; i < guessFormInputsEl.length; i++) {
    guessFormInputsEl[i].value = "";
  }
  clearGuessFormErrors();
  clearBtn.disabled = true;
}

function onReset() {
  minEl.value = 1;
  maxEl.value = 100;

  clearLatestScore();
  onClearFields();
  clearRangeFormErrors();
  startNewGame(1, 100);
  resetBtn.disabled = true;
}

function clearGuessFormErrors() {
  for (var i = 0; i < guessFormInputsEl.length; i++) {
    guessFormInputsEl[i].classList.remove('error-border');
    guessErrors[i].classList.add('error-h');
  }
}

function displayRangeFormErrors() {
  rangeErrDiv.classList.remove('error-r');
  minEl.classList.add('error-border');
  maxEl.classList.add('error-border');
}

function clearRangeFormErrors() {
  rangeErrDiv.classList.add('error-h');
  minEl.classList.remove('error-border');
  maxEl.classList.remove('error-border');
}

// Function checks for winner
function checkForWinner(guess1, guess2) {
    if (guess1 == randomNum && guess2 == randomNum) {
    alert("It's a tie! Play again.");
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
    text.innerText = winnerText;
  }
}

// Function to display the card
function gameWon() {
  endTimer();
  var htmlText = `<section class="l-flex l-flex-dir winner-card winner-card${winnerCardID}">
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
  winnerCardID++;

  minInt -= 10;
  maxInt += 10;

  startNewGame(minInt, maxInt);
}

function onRemoveCard() {
  if (event.target.classList.contains('delete-button')) {
    event.target.parentNode.parentNode.parentNode.remove();
  }
}

