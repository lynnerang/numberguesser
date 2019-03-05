$(document).ready(() => {
  let guessCount;  
  let randomNum;
  let startTime;
  const min = $('#min-range');
  const max = $('#max-range');
  const chal1Name = $('#chal-1-name');
  const chal1Gss = $('#chal-1-guess');
  const chal2Name = $('#chal-2-name');
  const chal2Gss = $('#chal-2-guess');
  const cardArea = $('.output');


  const startTimer = () => startTime = Date.now();

  const endTimer = () => (((Date.now() - startTime) / 1000) / 60).toFixed(2);

  const setRandom = (min, max) => randomNum = Math.floor(Math.random() * (max - min + 1)) + min;

  const startNewGame = (minNum, maxNum) => {
    if (minNum < 1) minNum = 1; 
    clearLatestScore();
    clearGuessFormErrs();
    removeRngErr();
    updateRangeDisplay(minNum, maxNum);
    setRandom(minNum, maxNum);
    startTimer();
    guessCount = 1;
  }

  const updateRangeDisplay = (minNum, maxNum) => {
    min.val(minNum);
    max.val(maxNum);
    $('.min-range-txt').text(minNum);
    $('.max-range-txt').text(maxNum);
  }

  const hasBothInputs = () => min.val() && max.val();

  const validRange = (minNum, maxNum) => minNum >= maxNum ? false : true;

  const showRngErr = () => {
    const rangeErr = $('.j-range-txt');
    displayRngErr();
    !validRange(parseInt(min.val()), parseInt(max.val())) ? rangeErr.text('Minimum must be less than maximum.')
    : rangeErr.text('Enter both minimum and maximum values.');
  }

  const hasAllInputs = () => {
    let isValid = true;
    $('#chal-section :input:not(:button)').each(function() {
      if ($(this).val() === '') { 
        isValid = false; 
      }
    });
    return isValid;
  }

  const hasAnyInputs = () => {
    let hasInputs = false;
    $('#chal-section :input:not(:button)').each(function() {
      if ($(this).val() !== '') { 
        hasInputs = true; 
      }
    });
    return hasInputs;
  }

  const checkForValues = () => {
    $('#chal-section :input:not(:button)').each(function() {
      !$(this).val() ? showInputErr($(this), $(this).next('.err'), 'Please enter a value.')
      : checkInputs($(this), $(this).next('.err')); 
    });
  }

  const checkInputs = (guess, errDiv) => {
    guess.attr('type') === 'number' ? validateGuess(guess, errDiv)
    : removeInputErr(guess, errDiv);
  }

  const validateGuess = (guess, errDiv) => {
    const guessInt = parseInt(guess.val());
    if (guessInt < parseInt(min.val()) || guessInt > parseInt(max.val())) {
      showInputErr(guess, errDiv, 'Enter a number within the range.');
      return false;
    } else {
      removeInputErr(guess, errDiv);
      return true;
    }
  }

  const showInputErr = (guess, errDiv, message) => {
    guess.addClass('error-border');
    errDiv.removeClass('error-h');
    errDiv.find('.error-t').text(message);
  }

  const removeInputErr = (guess, errDiv) => {
    errDiv.addClass('error-h');
    guess.removeClass('error-border');
  }

  const guessesValid = () => validateGuess(chal1Gss, chal1Gss.next('.err')) && validateGuess(chal2Gss, chal2Gss.next('.err'));

  const checkForMrPB = () => {
    if (chal1Name.val().toLowerCase().includes('poopy', 'butthole') || 
      chal2Name.val().toLowerCase().includes('poopy', 'butthole')) {
        $('.pb-animation').addClass('mr-pb');
    }
  }

  const showLatestScore = () => {
    $('.chal-1-guess-display').text(chal1Gss.val());
    $('.chal-2-guess-display').text(chal2Gss.val());
    $('.chal-1-name-display').text(chal1Name.val());
    $('.chal-2-name-display').text(chal2Name.val());
    showHighOrLow(parseInt(chal1Gss.val()), $('.chal-1-high-low'));
    showHighOrLow(parseInt(chal2Gss.val()), $('.chal-2-high-low'));
  }

  const clearLatestScore = () => $('.last-score').text("--");

  const clearGuessFormErrs = () => {
    $('#chal-section :input:not(:button)').removeClass('error-border');
    $('.err').addClass('error-h');
  }

  const displayRngErr = () => {
    $('.j-rng-err').removeClass('error-h');
    $('#rng-section :input:not(:button)').addClass('error-border');
  }

  const removeRngErr = () => {
    $('.j-rng-err').addClass('error-h');
    $('#rng-section :input:not(:button)').removeClass('error-border');
  }

  const checkForWinner = (guess1, guess2) => {
    switch (true) {
    case (guess1 === randomNum && guess2 === randomNum): 
      gameWon('Tie Game!');
      break;
    case (guess1 === randomNum && guess2 !== randomNum): 
      gameWon(chal1Name.val());
      break;
    case (guess1 !== randomNum && guess2 === randomNum): 
      gameWon(chal2Name.val());
      break;
    default:
      chal1Gss.val('');
      chal2Gss.val('');
      guessCount++;
    }
  }

  const showHighOrLow = (guess, txt) => {
    switch (true) {
      case (guess > randomNum):
        txt.text("that's too high");
        break;
      case (guess < randomNum):
        txt.text("that's too low");
        break;
      case (guess === randomNum):
        txt.text('you guessed right!');
        break;
    }
  }

  const gameWon = winner => {
    const htmlText = `<section class="l-flex l-flex-dir winner-card animated flash">
            <div class="l-flex l-flex-j-sa">
              <p class="chal-1-name vs-chal-1 vs-chal uppercase">${chal1Name.val()}</p>
              <p class="vs">vs</p>
              <p class="chal-2-name vs-chal-2 vs-chal uppercase">${chal2Name.val()}</p>
            </div>
            <div class="winner-text uppercase">
              <p class="winner-chal-name">${winner}</p>
              <p class="fnt-light">WINNER</p>
            </div>
            <div class="l-flex l-flex-j-sb l-flex-a-e guess-count">
              <p class="l-flex-1 fnt-light uppercase"><span class="fnt-x-bold">${guessCount * 2}</span> guesses</p>
              <p class="l-flex-1 center fnt-light uppercase"><span class="fnt-x-bold">${endTimer()}</span> minutes</p>
              <p class="l-flex-1 right-align"><i class="fas fa-times-circle delete-button"></i></p>
            </div>
          </section>`;
    cardArea.append(htmlText);
    startNewGame((parseInt(min.val()) - 10), (parseInt(max.val()) + 10));
  }

  const onUpdateRange = () => {
    const minNum = parseInt(min.val());
    const maxNum = parseInt(max.val());
    if (validRange(minNum, maxNum) && hasBothInputs() ) {
      $('#reset-btn').prop('disabled', false);
      startNewGame(minNum, maxNum);
    } else {
      showRngErr();
    }
  }

  const onSubmitGuess = () => {
    if (hasAllInputs() && guessesValid()) {
      showLatestScore();
      checkForWinner(parseInt(chal1Gss.val()), parseInt(chal2Gss.val()));
      clearGuessFormErrs();
      chal1Gss.val('');
      chal2Gss.val('');
      $('#reset-btn').prop('disabled', false);
    } else {
      checkForValues();
    }
    checkForMrPB();
  }

  const onClearFields = () => {
    $('#chal-section :input:not(:button)').val('');
    clearGuessFormErrs();
    $('#clear-btn').prop('disabled', true);
  }

  const onReset = () => {
    clearLatestScore();
    onClearFields();
    startNewGame(1, 100);
    $('#reset-btn').prop('disabled', true);
  }

  const onRemoveCard = () => {
    if ($(event.target).hasClass('delete-button')) {
      $(event.target).closest('.winner-card').remove();
    }
  }

  cardArea.click(onRemoveCard);
  $('#reset-btn').click(onReset);
  $('#clear-btn').click(onClearFields);
  $('#update-btn').click(onUpdateRange);
  $('#guess-btn').click(onSubmitGuess);
  $('#chal-section :input:not(:button)').keyup(() => $('#clear-btn').prop('disabled', !hasAnyInputs()));
  $("input[type='number']").keydown(e => { 
    const invalidChars = ['-', '+', 'e'];
    if (invalidChars.includes(e.key)) { 
      e.preventDefault(); 
    }
  });

  startNewGame(1, 100);
});