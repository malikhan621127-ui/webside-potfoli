"use strict";

const year = document.querySelector("#year");
const helloButton = document.querySelector("#hello-button");
const message = document.querySelector("#message");

// Keep the footer year current without requiring a manual update.
if (year) {
  year.textContent = String(new Date().getFullYear());
}

// Show a small on-page greeting. This does not submit or send any data.
if (helloButton && message) {
  helloButton.addEventListener(
    "click",
    () => {
      message.textContent = "Hello! Thanks for visiting my portfolio.";
      helloButton.textContent = "Thanks for stopping by!";
      helloButton.setAttribute("aria-label", "Thank you for visiting");
      helloButton.disabled = true;
    },
    { once: true }
  );
}
