# Muhammad Ali — Anime-Inspired Portfolio

A responsive static portfolio made with HTML, CSS and vanilla JavaScript. It includes five switchable anime-inspired themes, subtle motion effects, contact details and a browser-local guestbook.

## Run locally

1. Extract the project ZIP.
2. Open `index.html` in a modern browser, or serve the folder with a local static web server.
3. Keep `style.css`, `script.js`, the `images/` folder and the `videos/` folder alongside `index.html`.

No build tools, package installation or framework are required.

## Five selectable themes

- **Sakura** — dark plum with pink and violet accents.
- **Cyber Tokyo** — midnight blue, cyan neon and a digital grid.
- **Shonen** — warm action-inspired orange and red.
- **Moonlight** — midnight indigo, lavender and cool blue.
- **Zen Garden** — light sage and warm neutral surfaces.

Theme choice is saved in browser local storage and restored on the next visit on that same browser/device.

## Portfolio details

- Name: Muhammad Ali
- Location: Rahim Yar Khan, Pakistan
- Education: Matriculation / 10th class passed
- Email: malikhan621127@gmail.com

The email address is displayed publicly as requested. Consider using a separate public-facing email address if you do not want your personal inbox exposed on a public website.

## Guestbook / comments

The comment form validates input and displays comments safely using text nodes. Comments are stored in the visitor's browser local storage only. They are **not** sent to a server and are not visible to other visitors. A backend and appropriate moderation/anti-spam controls would be needed for a shared public comment system.

## Project files

- `index.html` — portfolio sections, five-theme selector, contact information and guestbook.
- `style.css` — responsive layout, theme variables, anime-inspired visual effects and reduced-motion support.
- `script.js` — theme persistence, email copy helper, local comments, scroll progress and reveal animations.
- `images/` — the supplied logo and visual assets.
- `videos/` — the supplied featured MP4.

## Notes

- The featured video uses native browser controls and does not autoplay.
- Existing image and video files are retained.
- The theme selector works without JavaScript disabled only in its default Sakura appearance; interactive switching and the guestbook require JavaScript.
- Google Fonts are optional enhancements; system font fallbacks are included.
