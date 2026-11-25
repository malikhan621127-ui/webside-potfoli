"use strict";

(() => {
  const root = document.documentElement;
  const themeButtons = Array.from(document.querySelectorAll("[data-theme-choice]"));
  const themeStatus = document.querySelector("#theme-status");
  const themeMeta = document.querySelector("#theme-color-meta");
  // Keep stored theme IDs aligned with the five buttons in index.html.
  // The CSS uses the legacy visual theme names for Neon, Action and Calm.
  const allowedThemes = new Set(["rose", "neon", "action", "moon", "calm"]);
  const themeCssNames = {
    rose: "sakura",
    neon: "cyber",
    action: "shonen",
    moon: "moon",
    calm: "zen"
  };
  const themeLabels = {
    rose: "Rose",
    neon: "Neon Grid",
    action: "Action Glow",
    moon: "Moonlight",
    calm: "Calm Garden"
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

  // Motion is enabled consistently on every screen size by default.
  // Visitors can pause it explicitly; the preference is saved on this device.
  const motionStorageKey = "muhammadAliPortfolioMotion";
  let motionEnabled = safeStorageGet(motionStorageKey) !== "off";

  function setMotionEnabled(enabled, shouldSave = true) {
    motionEnabled = Boolean(enabled);
    root.classList.toggle("motion-enabled", motionEnabled);
    root.classList.toggle("motion-paused", !motionEnabled);
    if (shouldSave) safeStorageSet(motionStorageKey, motionEnabled ? "on" : "off");
  }

  setMotionEnabled(motionEnabled, false);

  // Do not spend animation frames while this tab is hidden.
  document.addEventListener("visibilitychange", () => {
    root.classList.toggle("motion-suspended", document.hidden);
  });

  function applyTheme(theme, shouldSave = true) {
    if (!allowedThemes.has(theme)) theme = "rose";
    root.dataset.theme = themeCssNames[theme];
    themeButtons.forEach((button) => {
      const selected = button.dataset.themeChoice === theme;
      button.setAttribute("aria-pressed", String(selected));
    });
    if (themeStatus) themeStatus.textContent = `${themeLabels[theme]} theme selected`;
    if (themeMeta) {
      const colors = { rose: "#0b0712", neon: "#050d18", action: "#140905", moon: "#090b1c", calm: "#f1f0e8" };
      themeMeta.setAttribute("content", colors[theme]);
    }
    if (shouldSave) safeStorageSet("muhammadAliPortfolioTheme", theme);
  }

  const savedTheme = safeStorageGet("muhammadAliPortfolioTheme");
  applyTheme(allowedThemes.has(savedTheme) ? savedTheme : "rose", false);
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

    if (comments.length === 0) {
      const empty = document.createElement("p");
      empty.className = "empty-comments";
      empty.textContent = "No comments yet. Be the first to leave a message!";
      commentList.appendChild(empty);
      return;
    }

    comments.forEach((comment, index) => {
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
      const removeButton = document.createElement("button");
      removeButton.type = "button";
      removeButton.className = "comment-delete";
      removeButton.textContent = "Remove";
      removeButton.setAttribute("aria-label", "Remove comment by " + comment.name);
      removeButton.addEventListener("click", () => {
        comments.splice(index, 1);
        const saved = safeStorageSet(commentStorageKey, JSON.stringify(comments));
        renderComments();
        if (commentStatus) {
          commentStatus.textContent = saved
            ? "Your comment was removed from this browser."
            : "This browser blocked local storage; the comment may reappear after reloading.";
        }
      });
      heading.append(name, time, removeButton);
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
  let progressFrame = 0;
  function scheduleProgressUpdate() {
    if (progressFrame) return;
    progressFrame = window.requestAnimationFrame(() => {
      progressFrame = 0;
      updateProgress();
    });
  }
  window.addEventListener("scroll", scheduleProgressUpdate, { passive: true });
  window.addEventListener("resize", scheduleProgressUpdate);
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

  // Live wallpaper selector. The public GitHub build animates the poster image with CSS;
  // video assets are optional and are not requested unless they are present in the page.
  const galleryWallpaperVideo = document.querySelector("#wallpaper-video");
  const galleryWallpaperChoices = Array.from(document.querySelectorAll("[data-wallpaper-choice]"));
  const galleryWallpaperStatus = document.querySelector("#wallpaper-status");
  const galleryWallpaperToggle = document.querySelector("#wallpaper-toggle");
  const galleryWallpaperKey = "muhammadAliPortfolioWallpaper";

  function syncGalleryMotionButton() {
    if (!galleryWallpaperToggle) return;
    const paused = root.classList.contains("motion-paused");
    const label = galleryWallpaperToggle.querySelector(".motion-toggle-label");
    const icon = galleryWallpaperToggle.querySelector(".motion-icon");
    if (label) label.textContent = paused ? "Play motion" : "Pause motion";
    if (icon) icon.innerHTML = paused
      ? '<path d="M8 5.8v12.4L18.2 12 8 5.8Z"/>'
      : '<path d="M7 5h4v14H7zM15 5h4v14h-4z"/>';
    galleryWallpaperToggle.setAttribute("aria-label", paused ? "Play all motion effects" : "Pause all motion effects");
    galleryWallpaperToggle.classList.toggle("is-paused", paused);
  }

  function selectGalleryWallpaper(id, shouldSave = true) {
    if (!galleryWallpaperVideo || galleryWallpaperChoices.length === 0) return;
    const choice = galleryWallpaperChoices.find((button) => button.dataset.wallpaperChoice === id) ||
      galleryWallpaperChoices.find((button) => button.dataset.wallpaperChoice === "fading-summer-skies") ||
      galleryWallpaperChoices[0];
    if (!choice) return;
    const title = choice.querySelector("strong")?.textContent?.trim() || "Live background";
    const poster = choice.dataset.wallpaperPoster || "";
    galleryWallpaperChoices.forEach((button) => button.setAttribute("aria-pressed", String(button === choice)));
    galleryWallpaperVideo.pause();
    galleryWallpaperVideo.removeAttribute("src");
    galleryWallpaperVideo.poster = poster;
    galleryWallpaperVideo.load();
    if (galleryWallpaperStatus) {
      galleryWallpaperStatus.textContent = root.classList.contains("motion-paused")
        ? title + " selected · motion paused"
        : title + " selected · animated background active";
    }
    if (shouldSave) safeStorageSet(galleryWallpaperKey, choice.dataset.wallpaperChoice);
  }

  const savedGalleryWallpaper = safeStorageGet(galleryWallpaperKey);
  selectGalleryWallpaper(savedGalleryWallpaper || "fading-summer-skies", false);
  galleryWallpaperChoices.forEach((button) => {
    button.addEventListener("click", () => selectGalleryWallpaper(button.dataset.wallpaperChoice));
  });
  if (galleryWallpaperToggle) {
    galleryWallpaperToggle.addEventListener("click", () => {
      const paused = root.classList.contains("motion-paused");
      setMotionEnabled(paused);
      syncGalleryMotionButton();
      if (galleryWallpaperStatus) galleryWallpaperStatus.textContent = paused
        ? "Animated background effects enabled"
        : "All motion effects paused";
    });
    syncGalleryMotionButton();
  }

  const galleryPageLoader = document.querySelector("#page-loader");
  if (galleryPageLoader) {
    const hideGalleryLoader = () => {
      galleryPageLoader.classList.add("is-hidden");
      window.setTimeout(() => galleryPageLoader.remove(), 750);
    };
    window.addEventListener("load", () => window.setTimeout(hideGalleryLoader, 350), { once: true });
    window.setTimeout(hideGalleryLoader, 2400);
  }

  const thankYouButton = document.querySelector("#thank-you-button");
  const thankYouSection = document.querySelector("#thank-you");
  const thankYouStatus = document.querySelector("#thank-you-status");
  if (thankYouButton && thankYouSection) {
    thankYouButton.addEventListener("click", () => {
      thankYouSection.classList.remove("is-celebrating");
      void thankYouSection.offsetWidth;
      thankYouSection.classList.add("is-celebrating");
      if (thankYouStatus) thankYouStatus.textContent = "Thank you for visiting!";
    });
  }
})();
