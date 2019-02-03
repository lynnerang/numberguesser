//Setting variables for range and random number
var randomNum;
var min = document.getElementById('min-range');
var max = document.getElementById('max-range');
var guessCount = 1;  //To log the first time before checkWinner fn is run that adds to it
var startTime;
var minutes;

//Setting reusable variables for Challenger names and guesses from inputs
var chalName1 = document.getElementById('chal-1-name');
var chalGuess1 = document.getElementById('chal-1-guess');
var chalName2 = document.getElementById('chal-2-name');
var chalGuess2 = document.getElementById('chal-2-guess');
var guessInputs = [chalName1, chalGuess1, chalName2, chalGuess2];
var numInputs = [chalGuess1, chalGuess2, min, max];

// Setting variables for text to update
var chal1NameText = document.querySelector('.chal-1-name-display');
var chal2NameText = document.querySelector('.chal-2-name-display');
var chal1GuessText = document.querySelector('.chal-1-guess-display');
var chal2GuessText = document.querySelector('.chal-2-guess-display');
var chal1HighLowText = document.querySelector('.chal-1-high-low');
var chal2HighLowText = document.querySelector('.chal-2-high-low');
var winnerText = 'You guessed right!';
var winnerName;

// Setting variable for card output side
var cardTemplate = document.querySelector('.output');

// Array for blocking invalid chars from number input
var invalidChars = [
  "-",
  "+",
  "e",
];

// Start default game on page load
setRandom(1, 100);

console.log(min.value + max.value);
console.log(randomNum);

// Game timer functions
function start() {
  startTime = Date.now();
  console.log(startTime);
};

function end() {
  var endTime = Date.now();
  var totalTime = endTime - startTime;
  var minutes = totalTime / 1000;


  console.log(totalTime.toFixed(2) + " minutes");
  console.log(guessCount);
}

// Starts new game and generates random number within the range
function setRandom(minimum, maximum) {
    // min = Math.ceil(min);
    // max = Math.floor(max);
    console.log("Set random " + minimum + "and" + maximum);
    randomNum = Math.floor(Math.random() * (maximum - minimum + 1)) + minimum;
    guessCount = 1;
    console.log(randomNum + " in set random");
    start();
    //try this later Math.floor(Math.random() * 3 + 1)
  }

// Function to set range
var updateBtn = document.getElementById('update-btn');

updateBtn.addEventListener('click', setRange);

function setRange(e) {
  e.preventDefault();

  min = parseInt(min.value);
  max = parseInt(max.value);

  console.log("min max in beginning of setrange" + min + max);
  
  if (min >= max) {
    alert('Must have higher maximum than minimum!');
  } else {
    // Sets range text to entries
    document.querySelector('.min-range-txt').innerText = min;
    document.querySelector('.max-range-txt').innerText = max;

    console.log("minimum " + min + " and maximum " + max);

    setRandom(min, max);

    // Restart timer
    start();
  }
  resetBtn.disabled = false;
  console.log(randomNum + 'in end of set range');
}

// Function to submit and record player info and guesses
var guessBtn = document.getElementById('guess-btn');

guessBtn.addEventListener('click', submitGuess);

function submitGuess(e) {
  e.preventDefault();

  chal1GuessText.innerText = chalGuess1.value;
  chal2GuessText.innerText = chalGuess2.value;
  chal1NameText.innerText = chalName1.value;
  chal2NameText.innerText = chalName2.value;
  
  checksMinMaxGuess(chalGuess1.value, chalGuess2.value);

  highOrLow(chalGuess1.value, chal1HighLowText);
  highOrLow(chalGuess2.value, chal2HighLowText);

  checkForWinner(chalGuess1.value, chalGuess2.value);

  togglesErrorChalNames();

  resetBtn.disabled = false;
}

// Function to check it guesses are within min/max
function checksMinMaxGuess(chal1guess, chal2guess) {
  if((chal1guess < min || chal1guess > max) && (chal2guess < min || chal2guess > max)) {
    alert('Submitted guesses are outside of defined range');
  } else if (chal1guess < min || chal1guess > max) {
    alert('Submitted guess chal1 outside of defined range');
  } else if (chal2guess < min || chal2guess > max) {
    alert('Submitted guess chal2 outside of defined range');
  }
}

// Function checks for winner
function checkForWinner(guess1, guess2) {
    if (guess1 == randomNum && guess2 == randomNum) {
    alert("It's a tie! Play again.");
     //!!!add reset game
  } else if (guess1 == randomNum && guess2 != randomNum) {
    winnerName = chalName1.value;
    gameWon();
  } else if (guess1 != randomNum && guess2 == randomNum) {
    winnerName = chalName2.value;
    gameWon();
  } else {
    chalGuess1.value = "";
    chalGuess2.value = "";
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
  guessInputs[i].addEventListener('keyup', function(){
    var emptyInputs = guessInputs.every(function(input) { return !input.value; });
    clearBtn.disabled = emptyInputs;
  });
}

// Listens for whether user tries to type invalid chars into number fields
for (var i = 0; i < numInputs.length; i++){
  numInputs[i].addEventListener('keydown', function(e) {
    if (invalidChars.includes(e.key)) {
      e.preventDefault();
    }
  });
}

function clearFields(e) {
    e.preventDefault();
    for (var i = 0; i < guessInputs.length; i++) {
      guessInputs[i].value = "";
    }
    clearBtn.disabled = true;
}

// Function to display the card
function gameWon() {
var htmlText = `<section class="l-flex l-flex-dir winner-card">
          <div class="l-flex l-flex-j-sa">
            <p class="chal-1-name vs-chal-1 vs-chal uppercase">${chalName1.value}</p>
            <p class="vs">vs</p>
            <p class="chal-2-name vs-chal-2 vs-chal uppercase">${chalName2.value}</p>
          </div>
          <div class="winner-text uppercase">
            <p class="winner-chal-name">${winnerName}</p>
            <p class="fnt-light">WINNER</p>
          </div>
          <div class="l-flex l-flex-j-sb l-flex-a-e guess-count">
            <p class="l-flex-1 fnt-light uppercase"><span class="fnt-x-bold">${guessCount * 2}</span> guesses</p>
            <p class="l-flex-1 center fnt-light uppercase"><span class="fnt-x-bold">1.35</span> minutes</p>
            <p class="l-flex-1 right-align"><i class="fas fa-times-circle"></i></p>
          </div>
        </section>`;
  cardTemplate.innerHTML += htmlText;
};


  //Stop the timer
  // end();

  // Ok to go negative?
  // max = max + 10;
  // min = min - 10;
  // setRandom(min, max);

  //reset game


// Error messages

// Error message for challenger names
var errorDivName1 = document.querySelector('.error-c1n');
var errorDivName2 = document.querySelector('.error-c2n');

function togglesErrorChalNames (){
  if(chalName1.value == "") {
    errorDivName1.classList.toggle('error-c1n');
    chalName1.classList.add('error-border');
    guessBtn.disabled = true;
  } else if (chalName2.value == "") {
    errorDivName2.classList.toggle('error-c2n');
    chalName2.classList.add('error-border');
    guessBtn.disabled = true;
  }
}

chalName1.addEventListener('keyup', removesErrorChalNames);
chalName2.addEventListener('keyup', removesErrorChalNames);

function removesErrorChalNames() {
  if(chalName1.value !== "") {
    errorDivName1.classList.toggle('error-c1n');
    chalName1.classList.remove('error-border');
    guessBtn.disabled = false;
  } else if (chalName2.value !== "") {
    errorDivName2.classList.toggle('error-c2n');
    chalName2.classList.remove('error-border');
    guessBtn.disabled = false;
  }
}

// If name or guess is blank, then should not be able to submit guess

// If chal1name blank and
// If chal2name blank and
// If guess1 blank and
// If guess2 blank





