document.addEventListener("DOMContentLoaded", function () {
  const CARDS = document.querySelectorAll(".flip-card");

  // Global variables
  let cardOne = null;
  let cardTwo = null;
  let matchedPairs = [];
  let lockBoard = false;
  let scoreCount = 0;

  const MAX_IMAGES = 6;

  // Calling the functions to set initial game state
  assignDuckImagesToCards();
  shuffleCards();

  function handleCardClick(e) {
    //Lockboard from Stackoverflow(1), see credits
    if (lockBoard) {
      return;
    }

    const CARD = e.currentTarget;

    const IDENTIFIER = CARD.dataset.identifier;
    if (isCardMatched(IDENTIFIER)) {
      return;
    }

    revealCard(CARD);
    trackSelectedCards(CARD, IDENTIFIER);
    updateRestartButtonState();
  }

  // This function turns a card to reveal the image on the backside
  function revealCard(card) {
    card.dataset.flipped = true;
  }

  // This function checks if clicked card is part of an already matching pair
  function isCardMatched(identifier) {
    return matchedPairs.includes(identifier);
  }

  // This function tracks the clicked card and checks if the cards are a match, if they are, stores them in the matchedPairs array
  function trackSelectedCards(card, identifier) {
    if (!cardOne) {
      cardOne = card;
    } else {
      // Prevents clicking the same card twice
      if (cardOne === card) {
        return;
      }
      cardTwo = card;

      evaluateCardMatch(identifier, cardOne, cardTwo);
    }
  }

  // This function evaluates if the turned cards match
  function evaluateCardMatch(identifier, cardOne, cardTwo) {
    if (cardOne.dataset.identifier === cardTwo.dataset.identifier) {
      matchedPairs.push(identifier);
      clearSelectedCards();
    } else {
      //Lockboard from Stackoverflow(1), see credits
      setTimeout(() => {
        cardOne.dataset.flipped = false;
        cardTwo.dataset.flipped = false;
        clearSelectedCards();
        lockBoard = false;
      }, 1500);
    }
    incrementScore();
    checkGameCompletion(scoreCount);
  }

  // This function resets the values of card one and card two
  function clearSelectedCards() {
    cardOne = null;
    cardTwo = null;
  }

  // This function adds +1 to the moves counter everytime two cards are turned
  function incrementScore() {
    scoreCount++;
    updateScore(scoreCount);
  }

  // This function updates the score text in HTML document
  function updateScore(score) {
    const COUNTER_MOVES = document.getElementById("counter-moves");
    COUNTER_MOVES.textContent = score;
  }

  // This function checks if the game has been completed and handles the actions if true.
  function checkGameCompletion(scoreCount) {
    if (matchedPairs.length === MAX_IMAGES) {
      const MODAL_SHOW = document.getElementById("player-win");
      const MOVES_COUNT_ELEMENT = document.getElementById("moves-count");

      // Update modal content with the scorecount
      MOVES_COUNT_ELEMENT.textContent = scoreCount;

      //Shows the win modal with a time delay so the user has time to see the turned cards image before showing
      setTimeout(() => {
        const BOOTSTRAP_MODAL = new bootstrap.Modal(MODAL_SHOW);
        BOOTSTRAP_MODAL.show();
      }, 900);

      const PLAY_AGAIN_BUTTON = document.getElementById("play-again");
      PLAY_AGAIN_BUTTON.addEventListener("click", function () {
        resetGame();
      });
    }
  }

  const RESET_BUTTON = document.getElementById("restart-button");
  // Eventlistener for when the reset button is pressed, calls the function to reset the game
  RESET_BUTTON.addEventListener("click", () => {
    resetGame();
  });

  // This function handles the events for when the game is reset
  function resetGame() {
    lockBoard = true;

    // Turns all the cards face-down
    CARDS.forEach((card) => (card.dataset.flipped = false));

    matchedPairs = [];
    clearSelectedCards();

    scoreCount = 0;
    updateScore(scoreCount);

    // Credit Stackoverflow(2), how to add disabled to the reset button.
    RESET_BUTTON.disabled = true;

    updateRestartButtonState();

    // Time delay so the new images doesn't show while turning back
    setTimeout(() => {
      assignDuckImagesToCards();
      shuffleCards();

      //Lockboard from Stackoverflow(1), see credits
      lockBoard = false;
    }, 1500);
  }

  // This function handles the disabled and enabled states for the reset game button
  function updateRestartButtonState() {
    if (scoreCount > 0) {
      RESET_BUTTON.removeAttribute("disabled");
      RESET_BUTTON.classList.remove("disabled-button");
      RESET_BUTTON.classList.add("button-main");
    } else {
      RESET_BUTTON.classList.remove("button-main");
      RESET_BUTTON.classList.add("disabled-button");
    }
  }

  for (let index = 0; index < CARDS.length; index++) {
    CARDS[index].addEventListener("click", handleCardClick);
  }

  // This function assigns the images in the project to the cards on the game board
  function assignDuckImagesToCards() {
    for (let i = 0; i < MAX_IMAGES; i++) {
      const DATA_IDENTIFIER = i + 1;
      const CARDS_TO_GET_IMAGE = document.querySelectorAll(
        `[data-identifier="${DATA_IDENTIFIER}"] .flip-card-back`
      );
      CARDS_TO_GET_IMAGE.forEach((card) => {
        const IMG_ELEMENT = document.createElement("img");
        IMG_ELEMENT.setAttribute(
          "src",
          `./assets/img/ducks_img/duck_${DATA_IDENTIFIER}.png`
        );
        IMG_ELEMENT.setAttribute("alt", "an image of a duck");
        IMG_ELEMENT.classList.add("duck-image");
        card.replaceChildren(IMG_ELEMENT);
      });
    }
  }

  // This function handles the shuffling event of the cards
  function shuffleCards() {
    const POSITIONS = [];
    for (let i = 0; i < MAX_IMAGES * 2; i++) {
      POSITIONS.push(i + 1);
    }

    // The Fisher Yates Algorithm to shuffle cards from w3schools
    for (let i = POSITIONS.length - 1; i > 0; i--) {
      let j = Math.floor(Math.random() * (i + 1));
      let k = POSITIONS[i];
      POSITIONS[i] = POSITIONS[j];
      POSITIONS[j] = k;
    }

    // Base code from marina-ferreira.github.io, see credits
    // Sets the cards position using flex order
    CARDS.forEach((card, index) => {
      card.style.order = POSITIONS[index];
    });
  }
});
