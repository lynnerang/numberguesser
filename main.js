//Setting variables for range and random number
var randomNum;
var minEl = document.getElementById('min-range');
var maxEl = document.getElementById('max-range');
var minInt;
var maxInt;
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
var rangeInputsEl = [minEl, maxEl];
var guessInputsEl = [chal1NameEl, chal1GuessEl, chal2NameEl, chal2GuessEl];
var numInputsEl = [chal1GuessEl, chal2GuessEl, minEl, maxEl];
// Array for blocking invalid chars from number input
var invalidChars = ["-", "+", "e"];

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


// Buttons for game
var resetBtn = document.getElementById('reset-btn');
var clearBtn = document.getElementById('clear-btn');
var updateBtn = document.getElementById('update-btn');
var guessBtn = document.getElementById('guess-btn');

// Setting variable for card output side
var cardTemplate = document.querySelector('.output');

// Event listeners
updateBtn.addEventListener('click', onUpdateRange);
clearBtn.addEventListener('click', onClearFields);
guessBtn.addEventListener('click', onSubmitGuess);
cardParent.addEventListener('click', onRemoveCard);
chal1NameEl.addEventListener('keyup', removesErrorChalNames);
chal2NameEl.addEventListener('keyup', removesErrorChalNames);

  // Error message for challenger names
var errorDivName1 = document.querySelector('.error-c1n');
var errorDivName2 = document.querySelector('.error-c2n');

  // Listens for whether user enters text into guess form
for (var i = 0; i < guessInputsEl.length; i++){
  guessInputsEl[i].addEventListener('keyup', function(){
    var emptyInputs = guessInputsEl.every(function(input) { return !input.value; });
    clearBtn.disabled = emptyInputs;
  });
}

//Have update button disabled if both range fields aren't full
for (var i = 0; i < rangeInputsEl.length; i++){
  rangeInputsEl[i].addEventListener('keyup', function(){
    var hasBothInputs = rangeInputsEl.every(function(input) { return input.value; });

    if (hasBothInputs) {
      updateBtn.disabled = hadBothInputs;
    } else {    
      updateBtn.disabled = true;
    }
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
updateBtn.disabled = true;


// Start default game on page load
startNewGame(1, 100);

// Game timer functions
function start() {
  startTime = Date.now();
  console.log(startTime);
};

function end() {
  var endTime = Date.now();
  var totalTime = (endTime - startTime) / 1000;
  minutes = totalTime.toFixed(2);
}

// Generates random number within the range
function setRandom(minimum, maximum) {
    randomNum = Math.floor(Math.random() * (maximum - minimum + 1)) + minimum;
  }

// Starts a new game
function startNewGame(minInt, maxInt) {

  setRandom(minInt, maxInt);

  // Restart timer
  start();
  guessCount = 1;
}

// Sets range and triggers new game with random number in that range and displays error if min > max
function onUpdateRange(e) {
  e.preventDefault();

  minInt = parseInt(minEl.value);
  maxInt = parseInt(maxEl.value);
  var guessErrorDiv = document.querySelector('.j-rng-err');

  if (minInt >= maxInt) {
    guessErrorDiv.classList.remove('error-r');
  } else {
    guessErrorDiv.classList.add('error-r');
    document.querySelector('.min-range-txt').innerText = minInt;
    document.querySelector('.max-range-txt').innerText = maxInt;
    startNewGame(minInt, maxInt);
    resetBtn.disabled = false;
  }
}

// Function to submit and record player info and guesses
function onSubmitGuess(e) {
  e.preventDefault();

  chal1GuessInt = parseInt(chal1GuessEl.value);
  chal2GuessInt = parseInt(chal2GuessEl.value);

  chal1GuessText.innerText = chal1GuessEl.value;
  chal2GuessText.innerText = chal2GuessEl.value;
  chal1NameText.innerText = chal1NameEl.value;
  chal2NameText.innerText = chal2NameEl.value;
  
  checksMinMaxGuess(chal1GuessInt, chal2GuessInt);

  highOrLow(chal1GuessInt, chal1HighLowText);
  highOrLow(chal2GuessInt, chal2HighLowText);

  checkForWinner(chal1GuessInt, chal2GuessInt);

  togglesErrorChalNames();

  resetBtn.disabled = false;
}

function onClearFields(e) {
    e.preventDefault();
    for (var i = 0; i < guessInputsEl.length; i++) {
      guessInputsEl[i].value = "";
    }
    clearBtn.disabled = true;
}

// Function to check if guesses are within min/max
function checksMinMaxGuess(chal1Guess, chal2Guess) {
  if((chal1Guess < minInt || chal1Guess > maxInt) && (chal2Guess < minInt || chal2Guess > maxInt)) {
    alert('Submitted guesses are outside of defined range');
  } else if (chal1Guess < minInt || chal1Guess > maxInt) {
    alert('Submitted guess chal1 outside of defined range');
  } else if (chal2Guess < minInt || chal2Guess > maxInt) {
    alert('Submitted guess chal2 outside of defined range');
  }
}

// Function checks for winner
function checkForWinner(guess1, guess2) {
    if (guess1 == randomNum && guess2 == randomNum) {
    alert("It's a tie! Play again.");
     //!!!add reset game
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
  var winner;

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
  var htmlText = `<section class="l-flex l-flex-dir winner-card animated flash winner-card${winnerCardID}">
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
};

function onRemoveCard() {
  if (event.target.classList.contains('delete-button')) {
    event.target.parentNode.parentNode.parentNode.remove();
  }
}



  //Stop the timer
  // end();

  // Ok to go negative?
  // max = max + 10;
  // min = min - 10;
  // setRandom(min, max);

  //reset game


// Error messages


function togglesErrorChalNames (){
  if(chal1NameEl.value == "") {
    errorDivName1.classList.toggle('error-c1n');
    cha1lNameEl.classList.add('error-border');
    guessBtn.disabled = true;
  } else if (chal2NameEl.value == "") {
    errorDivName2.classList.toggle('error-c2n');
    chal2NameEl.classList.add('error-border');
    guessBtn.disabled = true;
  }
}

function removesErrorChalNames() {
  if(chal1NameEl.value !== "") {
    errorDivName1.classList.toggle('error-c1n');
    chal1NameEl.classList.remove('error-border');
    guessBtn.disabled = false;
  } else if (chal2NameEl.value !== "") {
    errorDivName2.classList.toggle('error-c2n');
    chal2NameEl.classList.remove('error-border');
    guessBtn.disabled = false;
  }
}

// If name or guess is blank, then should not be able to submit guess

// If chal1name blank and
// If chal2name blank and
// If guess1 blank and
// If guess2 blank


