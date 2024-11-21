document.addEventListener("DOMContentLoaded", function () {
  const cards = document.querySelectorAll(".flip-card");

  // Flip cards up
  function flipCard(e) {
    e.currentTarget.dataset.flipped = true;
  }

  for (let index = 0; index < cards.length; index++) {
    cards[index].addEventListener("click", flipCard);
  }
});
