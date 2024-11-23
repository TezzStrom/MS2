document.addEventListener("DOMContentLoaded", function () {
  const cards = document.querySelectorAll(".flip-card");

  // Global variables
  let cardOne = null;
  let cardTwo = null;
  let matchedPairs = [];
  let lockBoard = false;
  let scoreCount = 0;

  // Player's turn
  function clickedCard(e) {
    //Lockboard from Stackoverflow(1), see credits
    if (lockBoard) return;
    const card = e.currentTarget;
    console.log("Clicked card", card);

    const identifier = card.dataset.identifier;
    // Exit function if clicked card is part of an already matching pair
    if (matchedCard(identifier) === true) {
      return;
    }

    flipCard(card);
    logCards(card, identifier);
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
      console.log("cardOne", cardOne);
    } else {
      if (cardOne === card) {
        return;
      }
      // Store as second card
      cardTwo = card;
      console.log("cardTwo", cardTwo);

      matchCards(identifier, cardOne, cardTwo);
    }
  }

  function matchCards(identifier, cardOne, cardTwo) {
    // Cards match?
    if (cardOne.dataset.identifier === cardTwo.dataset.identifier) {
      // Yes, keep cards face up
      matchedPairs.push(identifier);
      console.log("match", identifier);
      resetCards();
    } else {
      //Delay before turning back cards
      //Lockboard from Stackoverflow(1), see credits
      lockBoard = true;
      setTimeout(() => {
        // No, flip cards back down
        cardOne.dataset.flipped = false;
        cardTwo.dataset.flipped = false;
        console.log("Flipping back");
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
    console.log("Reset turn");
  }

  // Adds to the scorecount when two cards are matched
  function countMoves() {
    scoreCount++;
    updateScore(scoreCount);
  }

  // Updates the score text in HTML document
  function updateScore(score) {
    const counterMoves = document.getElementById("counter-moves");
    console.log("plus score", counterMoves);
    counterMoves.textContent = score;
  }

  function checkMatchedPairsLength(scoreCount) {
    if (matchedPairs.length === 6) {
      const modalShow = document.getElementById("player-win");
      const movesCountElement = document.getElementById("moves-count");

      // Update modal content with scorecount
      movesCountElement.textContent = scoreCount;

      //Show modal (Bug 5: solved with Bootstrap documentation)
      setTimeout(() => {
        const bootstrapModal = new bootstrap.Modal(modalShow);
        bootstrapModal.show();
      }, 900);

      // Eventlisteners for play again button in modal
      const playAgainButton = document.getElementById("play-again");

      // Eventlistener for the play again button in the win modal, calls the function that resets the game
      playAgainButton.addEventListener("click", function () {
        resetGame();
      });
    }
  }

  // Eventlistener for when the reset button is pressed, calls the function to reset the game
  const resetButton = document.getElementById("restart-button");
  resetButton.addEventListener("click", () => {
    resetGame();
  });

  function resetGame() {
    // Reset game variables
    matchedPairs = [];
    cardOne = null;
    cardTwo = null;

    // Reset scoreCount
    scoreCount = 0;
    updateScore(scoreCount);

    // Reset cards
    const cards = document.querySelectorAll(".flip-card");
    cards.forEach((card) => (card.dataset.flipped = false));

    // Adds the disabled state to the reset button
    // Credit Stackoverflow(2), how to add disabled to the reset button.
    resetButton.disabled = true;
    resetButton.style.pointerEvents = "none";
  }

  function changeRestartButtonState() {
    //Removes the buttons disabled state when first score is counted
    if (matchedPairs.length > 0) {
      resetButton.removeAttribute("disabled");
      resetButton.style.pointerEvents = "auto";
    }
  }

  // Walks through cards for eventlistener
  for (let index = 0; index < cards.length; index++) {
    cards[index].addEventListener("click", clickedCard);
  }
});
