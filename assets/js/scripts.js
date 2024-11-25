document.addEventListener("DOMContentLoaded", function () {
  const cards = document.querySelectorAll(".flip-card");

  // Global variables
  let cardOne = null;
  let cardTwo = null;
  let matchedPairs = [];
  let lockBoard = false;
  let scoreCount = 0;

  // Calling the functions to set initial game state
  setDuckImages();
  shuffleCards();

  function onClickedCard(e) {
    //Lockboard from Stackoverflow(1), see credits
    if (lockBoard) return;
    const CARD = e.currentTarget;

    const IDENTIFIER = CARD.dataset.identifier;
    // Exit function if clicked card is part of an already matching pair
    if (matchedCard(IDENTIFIER)) {
      return;
    }

    flipCard(CARD);
    logCards(CARD, IDENTIFIER);
    changeRestartButtonState();
  }

  // Select a card
  function flipCard(card) {
    card.dataset.flipped = true;
  }

  // Checks if clicked card is part of an already matching pair
  function matchedCard(identifier) {
    return matchedPairs.includes(identifier);
  }

  function logCards(card, identifier) {
    // Is this first or second card?
    if (!cardOne) {
      // Store as first card
      cardOne = card;
    } else {
      // Prevents clicking the same card twice
      if (cardOne === card) {
        return;
      }
      // Store as second card
      cardTwo = card;

      matchCards(identifier, cardOne, cardTwo);
    }
  }

  function matchCards(identifier, cardOne, cardTwo) {
    // Cards match?
    if (cardOne.dataset.identifier === cardTwo.dataset.identifier) {
      // Yes, keep cards face up
      matchedPairs.push(identifier);
      resetCards();
    } else {
      //Delay before turning back cards
      //Lockboard from Stackoverflow(1), see credits
      lockBoard = true;
      setTimeout(() => {
        // No, flip cards back down
        cardOne.dataset.flipped = false;
        cardTwo.dataset.flipped = false;
        resetCards();
        //Lockboard from Stackoverflow(1), see credits
        lockBoard = false;
      }, 1500);
    }
    countMoves();
    checkMatchedPairsLength(scoreCount);
  }

  function resetCards() {
    // Reset card selection
    cardOne = null;
    cardTwo = null;
  }

  // Adds to the scorecount when two cards are matched
  function countMoves() {
    scoreCount++;
    updateScore(scoreCount);
  }

  // Updates the score text in HTML document
  function updateScore(score) {
    const COUNTER_MOVES = document.getElementById("counter-moves");
    COUNTER_MOVES.textContent = score;
  }

  function checkMatchedPairsLength(scoreCount) {
    if (matchedPairs.length === 6) {
      const MODAL_SHOW = document.getElementById("player-win");
      const MOVES_COUNT_ELEMENT = document.getElementById("moves-count");

      // Update modal content with scorecount
      MOVES_COUNT_ELEMENT.textContent = scoreCount;

      //Show modal (Bug 5: solved with Bootstrap documentation)
      setTimeout(() => {
        const BOOTSTRAP_MODAL = new bootstrap.Modal(MODAL_SHOW);
        BOOTSTRAP_MODAL.show();
      }, 900);

      // Eventlisteners for play again button in modal
      const PLAY_AGAIN_BUTTON = document.getElementById("play-again");

      // Eventlistener for the play again button in the win modal, calls the function that resets the game
      PLAY_AGAIN_BUTTON.addEventListener("click", function () {
        resetGame();
      });
    }
  }

  // Eventlistener for when the reset button is pressed, calls the function to reset the game
  const RESET_BUTTON = document.getElementById("restart-button");
  RESET_BUTTON.addEventListener("click", () => {
    resetGame();
  });

  function resetGame() {
    lockBoard = true;

    // Reset cards
    CARDS.forEach((card) => (card.dataset.flipped = false));

    // Reset game variables
    matchedPairs = [];
    cardOne = null;
    cardTwo = null;

    // Reset scoreCount
    scoreCount = 0;
    updateScore(scoreCount);

    // Adds the disabled state to the reset button
    // Credit Stackoverflow(2), how to add disabled to the reset button.
    RESET_BUTTON.disabled = true;

    changeRestartButtonState();

    // Time delay so the new images doesn't show while turning back
    setTimeout(() => {
      setDuckImages();
      shuffleCards();

      //Lockboard from Stackoverflow(1), see credits
      lockBoard = false;
    }, 1500);
  }

  function changeRestartButtonState() {
    //Removes the buttons disabled state when first score is counted
    if (scoreCount > 0) {
      RESET_BUTTON.removeAttribute("disabled");
      RESET_BUTTON.classList.remove("disabled-button");
      RESET_BUTTON.classList.add("button-main");
    } else {
      RESET_BUTTON.classList.remove("button-main");
      RESET_BUTTON.classList.add("disabled-button");
    }
  }

  // Walks through cards for eventlistener
  for (let index = 0; index < cards.length; index++) {
    cards[index].addEventListener("click", onClickedCard);
  }

  function setDuckImages() {
    for (let i = 0; i < 6; i++) {
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

  function shuffleCards() {
    const POSITIONS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];

    // The Fisher Yates Algorithm to shuffle cards from w3schools
    for (let i = POSITIONS.length - 1; i > 0; i--) {
      let j = Math.floor(Math.random() * (i + 1));
      let k = POSITIONS[i];
      POSITIONS[i] = POSITIONS[j];
      POSITIONS[j] = k;
    }

    // Base code from marina-ferreira.github.io, see credits
    // Sets the cards position using flex order
    cards.forEach((card, index) => {
      card.style.order = POSITIONS[index];
    });
  }
});
