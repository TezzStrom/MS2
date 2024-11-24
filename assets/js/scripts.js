document.addEventListener("DOMContentLoaded", function () {
  const cards = document.querySelectorAll(".flip-card");

  // Global variables
  let cardOne = null;
  let cardTwo = null;
  let matchedPairs = [];
  let lockBoard = false;
  let scoreCount = 0;

  // Calling the functions to set initial game state
  const proxyUrl =
    "https://corsproxy.io/?" +
    encodeURIComponent("https://random-d.uk/api/v2/random");
  setDuckImages();
  shuffleCards();

  // Player's turn
  function clickedCard(e) {
    //Lockboard from Stackoverflow(1), see credits
    if (lockBoard) return;
    const card = e.currentTarget;

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
    } else {
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
    const counterMoves = document.getElementById("counter-moves");
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

    setDuckImages();
    shuffleCards();
    changeRestartButtonState();
  }

  function changeRestartButtonState() {
    //Removes the buttons disabled state when first score is counted
    if (scoreCount > 0) {
      resetButton.removeAttribute("disabled");
      resetButton.classList.remove("disabled-button");
      resetButton.classList.add("button-main");
    } else {
      resetButton.classList.remove("button-main");
      resetButton.classList.add("disabled-button");
    }
  }

  // Walks through cards for eventlistener
  for (let index = 0; index < cards.length; index++) {
    cards[index].addEventListener("click", clickedCard);
  }

  function setDuckImages() {
    // Fetch 6 images via API, see credits for proxy and duck API
    for (let i = 0; i < 6; i++) {
      fetch(proxyUrl)
        .then((response) => response.json())
        .then((data) => {
          const dataIdentifier = i + 1;
          const cardsToGetImage = document.querySelectorAll(
            `[data-identifier="${dataIdentifier}"] .flip-card-back`
          );
          cardsToGetImage.forEach((card) => {
            const imgElement = document.createElement("img");
            imgElement.setAttribute("src", data.url);
            imgElement.setAttribute("alt", "an image of a duck");
            imgElement.classList.add("duck-image");
            card.replaceChildren(imgElement);
          });
        })
        .catch((error) => console.error("Error:", error));
    }
  }

  function shuffleCards() {
    const positions = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];

    // The Fisher Yates Algorithm to shuffle cards from w3schools
    for (let i = positions.length - 1; i > 0; i--) {
      let j = Math.floor(Math.random() * (i + 1));
      let k = positions[i];
      positions[i] = positions[j];
      positions[j] = k;
    }

    // Base code from marina-ferreira.github.io, see credits
    cards.forEach((card, index) => {
      card.style.order = positions[index];
    });
  }
});
