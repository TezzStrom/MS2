document.addEventListener("DOMContentLoaded", function () {
  const cards = document.querySelectorAll(".flip-card");

  let cardOne = null;
  let cardTwo = null;
  let matchedPairs = [];

  // Player's turn
  function flipCard(e) {
    // Select a card
    const card = e.currentTarget;
    console.log("Clicked card", card);
    card.dataset.flipped = true;

    // Is this first or second card?
    if (!cardOne) {
      // Store as first card
      cardOne = card;
      console.log("cardOne", cardOne);
    } else {
      // Store as second card
      cardTwo = card;
      console.log("cardTwo", cardTwo);

      // Cards match?
      if (cardOne.dataset.identifier === cardTwo.dataset.identifier) {
        // Yes, keep cards face up
        const identifier = card.dataset.identifier;
        matchedPairs.push(identifier);
        console.log("match", identifier);
      } else {
        // No, flip cards back down
        cardOne.dataset.flipped = false;
        cardTwo.dataset.flipped = false;
        console.log("Flipping back");
      }

      // Reset card selection
      cardOne = null;
      cardTwo = null;
      console.log("Reset turn");
    }
  }

  // Walks through cards for eventlistener
  for (let index = 0; index < cards.length; index++) {
    cards[index].addEventListener("click", flipCard);
  }
});
