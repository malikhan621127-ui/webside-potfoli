"use strict";

(() => {
  const root = document.documentElement;
  const themeButtons = Array.from(document.querySelectorAll("[data-theme-choice]"));
  const themeStatus = document.querySelector("#theme-status");
  const themeMeta = document.querySelector("#theme-color-meta");
  const allowedThemes = new Set(["sakura", "cyber", "shonen", "moon", "zen"]);
  const themeLabels = {
    sakura: "Sakura",
    cyber: "Cyber Tokyo",
    shonen: "Shonen Impact",
    moon: "Moonlight",
    zen: "Zen Garden"
  };

  function safeStorageGet(key) {
    try { return window.localStorage.getItem(key); } catch (_error) { return null; }
  }
  function safeStorageSet(key, value) {
    try { window.localStorage.setItem(key, value); return true; } catch (_error) { return false; }
  }
  function safeStorageRemove(key) {
    try { window.localStorage.removeItem(key); } catch (_error) { /* Storage may be disabled. */ }
  }

  function applyTheme(theme, shouldSave = true) {
    if (!allowedThemes.has(theme)) theme = "sakura";
    root.dataset.theme = theme;
    themeButtons.forEach((button) => {
      const selected = button.dataset.themeChoice === theme;
      button.setAttribute("aria-pressed", String(selected));
    });
    if (themeStatus) themeStatus.textContent = `${themeLabels[theme]} theme selected`;
    if (themeMeta) {
      const colors = { sakura: "#0b0712", cyber: "#050d18", shonen: "#140905", moon: "#090b1c", zen: "#f1f0e8" };
      themeMeta.setAttribute("content", colors[theme]);
    }
    if (shouldSave) safeStorageSet("muhammadAliPortfolioTheme", theme);
  }

  const savedTheme = safeStorageGet("muhammadAliPortfolioTheme");
  applyTheme(allowedThemes.has(savedTheme) ? savedTheme : "sakura", false);
  themeButtons.forEach((button) => {
    button.addEventListener("click", () => applyTheme(button.dataset.themeChoice));
  });

  // Keep the footer year current.
  const year = document.querySelector("#year");
  if (year) year.textContent = String(new Date().getFullYear());

  // Copy-to-clipboard with a graceful fallback for browsers without Clipboard API.
  const copyButton = document.querySelector("#copy-email");
  const copyStatus = document.querySelector("#copy-status");
  const emailAddress = "malikhan621127@gmail.com";
  if (copyButton) {
    copyButton.addEventListener("click", async () => {
      let copied = false;
      try {
        if (navigator.clipboard && window.isSecureContext) {
          await navigator.clipboard.writeText(emailAddress);
          copied = true;
        }
      } catch (_error) { copied = false; }

      if (!copied) {
        const helper = document.createElement("textarea");
        helper.value = emailAddress;
        helper.setAttribute("readonly", "");
        helper.style.position = "fixed";
        helper.style.opacity = "0";
        document.body.appendChild(helper);
        helper.select();
        try { copied = document.execCommand("copy"); } catch (_error) { copied = false; }
        helper.remove();
      }
      if (copyStatus) copyStatus.textContent = copied ? "Email address copied." : "Copy is unavailable here. Please select the email address above.";
    });
  }

  // Guestbook comments are local to this browser and never uploaded.
  const commentStorageKey = "muhammadAliPortfolioComments";
  const commentForm = document.querySelector("#comment-form");
  const nameInput = document.querySelector("#comment-name");
  const commentInput = document.querySelector("#comment-text");
  const counter = document.querySelector("#comment-counter");
  const commentList = document.querySelector("#comment-list");
  const commentCount = document.querySelector("#comment-count");
  const commentStatus = document.querySelector("#comment-status");
  const clearCommentsButton = document.querySelector("#clear-comments");
  const maxComments = 50;

  function loadComments() {
    const stored = safeStorageGet(commentStorageKey);
    if (!stored) return [];
    try {
      const parsed = JSON.parse(stored);
      if (!Array.isArray(parsed)) return [];
      return parsed.filter((item) => item && typeof item.name === "string" && typeof item.text === "string")
        .slice(0, maxComments)
        .map((item) => ({
          name: item.name.slice(0, 40),
          text: item.text.slice(0, 500),
          date: typeof item.date === "string" ? item.date : new Date().toISOString()
        }));
    } catch (_error) {
      safeStorageRemove(commentStorageKey);
      return [];
    }
  }

  let comments = loadComments();

  function renderComments() {
    if (!commentList) return;
    commentList.replaceChildren();
    if (commentCount) commentCount.textContent = `${comments.length} ${comments.length === 1 ? "message" : "messages"}`;
    if (clearCommentsButton) clearCommentsButton.hidden = comments.length === 0;

    if (comments.length === 0) {
      const empty = document.createElement("p");
      empty.className = "empty-comments";
      empty.textContent = "No comments yet. Be the first to leave a message!";
      commentList.appendChild(empty);
      return;
    }

    comments.forEach((comment) => {
      const article = document.createElement("article");
      article.className = "comment-item";
      const heading = document.createElement("div");
      heading.className = "comment-item-head";
      const name = document.createElement("strong");
      name.textContent = comment.name;
      const time = document.createElement("time");
      const date = new Date(comment.date);
      if (!Number.isNaN(date.getTime())) {
        time.dateTime = date.toISOString();
        time.textContent = date.toLocaleString(undefined, { dateStyle: "medium", timeStyle: "short" });
      } else {
        time.textContent = "Recently";
      }
      const message = document.createElement("p");
      message.textContent = comment.text;
      heading.append(name, time);
      article.append(heading, message);
      commentList.appendChild(article);
    });
  }

  function updateCounter() {
    if (counter && commentInput) counter.textContent = `${commentInput.value.length} / 500`;
  }

  if (commentInput) commentInput.addEventListener("input", updateCounter);
  if (commentForm && nameInput && commentInput) {
    commentForm.addEventListener("submit", (event) => {
      event.preventDefault();
      const name = nameInput.value.trim();
      const text = commentInput.value.trim();
      if (!name || !text) {
        if (commentStatus) commentStatus.textContent = "Please enter your name and a comment.";
        return;
      }
      if (name.length > 40 || text.length > 500) {
        if (commentStatus) commentStatus.textContent = "Please keep your name under 40 and comment under 500 characters.";
        return;
      }
      if (comments.length >= maxComments) {
        if (commentStatus) commentStatus.textContent = "This guestbook has reached its 50-comment limit. Clear local comments to add another.";
        return;
      }
      comments.unshift({ name, text, date: new Date().toISOString() });
      const saved = safeStorageSet(commentStorageKey, JSON.stringify(comments));
      renderComments();
      commentForm.reset();
      updateCounter();
      if (commentStatus) {
        commentStatus.textContent = saved
          ? "Your comment has been saved in this browser."
          : "This browser blocked local storage, so the comment may disappear after you leave this page.";
      }
    });
  }

  if (clearCommentsButton) {
    clearCommentsButton.addEventListener("click", () => {
      const confirmed = window.confirm("Clear all guestbook comments saved in this browser on this device?");
      if (!confirmed) return;
      comments = [];
      safeStorageRemove(commentStorageKey);
      renderComments();
      if (commentStatus) commentStatus.textContent = "Local comments cleared.";
    });
  }

  renderComments();
  updateCounter();

  // Scroll progress and subtle reveal animations, with a fallback for older browsers.
  const progress = document.querySelector("#scroll-progress");
  function updateProgress() {
    if (!progress) return;
    const scrollable = document.documentElement.scrollHeight - window.innerHeight;
    const ratio = scrollable > 0 ? window.scrollY / scrollable : 0;
    progress.style.width = `${Math.min(100, Math.max(0, ratio * 100))}%`;
  }
  window.addEventListener("scroll", updateProgress, { passive: true });
  window.addEventListener("resize", updateProgress);
  updateProgress();

  const revealItems = Array.from(document.querySelectorAll(".reveal"));
  if ("IntersectionObserver" in window && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    document.documentElement.classList.add("js-ready");
    const observer = new IntersectionObserver((entries, currentObserver) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          currentObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -35px 0px" });
    revealItems.forEach((item) => observer.observe(item));
  } else {
    revealItems.forEach((item) => item.classList.add("is-visible"));
  }
})();
