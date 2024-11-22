document.addEventListener("DOMContentLoaded", function () {
  const cards = document.querySelectorAll(".flip-card");

  let cardOne = null;
  let cardTwo = null;
  let matchedPairs = [];
  let lockBoard = false;

  // Player's turn
  function clickedCard(e) {
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
      lockBoard = true;
      setTimeout(() => {
        // No, flip cards back down
        cardOne.dataset.flipped = false;
        cardTwo.dataset.flipped = false;
        console.log("Flipping back");
        resetCards();
        lockBoard = false;
      }, 1500);
    }
  }

  function resetCards() {
    // Reset card selection
    cardOne = null;
    cardTwo = null;
    console.log("Reset turn");
  }

  // Walks through cards for eventlistener
  for (let index = 0; index < cards.length; index++) {
    cards[index].addEventListener("click", clickedCard);
  }
});
