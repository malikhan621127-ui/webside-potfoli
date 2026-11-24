# Muhammad Ali — Creative Portfolio

A responsive static portfolio built with HTML, CSS and vanilla JavaScript. The same visual motion system runs across phones, tablets, laptops and desktop computers. The site includes five selectable themes, twelve selectable animated wallpaper scenes, animated SVG icons, a featured video, a visual gallery, contact details and a browser-local guestbook.

## Run locally

1. Extract the ZIP.
2. Open `index.html` in a modern browser, or start a local static web server in this folder.
3. Keep `style.css`, `script.js`, `images/` and `videos/` beside `index.html` so all relative paths continue to work.

## Motion and animation

- SVG interface icons use the same gentle floating animation at every viewport size; mobile and desktop do not use separate animation versions.
- The **Play motion / Pause motion** control enables or pauses the complete motion system, including the live wallpaper, animated icons, decorative effects and transitions.
- Operating-system reduced-motion settings are respected on first visit. A visitor can explicitly select **Play motion** to enable the site effects; that choice is saved on that browser/device.
- Motion pauses while the browser tab is hidden and resumes when the tab becomes visible again.
- The scroll-progress bar is updated through `requestAnimationFrame` to avoid doing layout work for every scroll event.

## Performance and media

- The twelve wallpaper clips are H.264 MP4, capped at 1280 pixels wide and 30 fps, with no audio track. The original wallpaper folder was about 106 MB; the optimized clips are about 40 MB combined.
- Only the selected wallpaper video is attached to the background player. The video is muted, loops inline, and uses a poster while it loads.
- Expensive full-screen video filters and oversized glass blur values were reduced to keep animation smoother on everyday PCs, laptops, tablets and phones.
- Image elements use asynchronous decoding; gallery images are lazy-loaded where appropriate.

## Color themes

- **Rose** — dark plum with pink and violet accents.
- **Neon Grid** — midnight blue, cyan neon and a digital grid.
- **Action Glow** — warm orange and red accents.
- **Moonlight** — indigo, lavender and cool blue.
- **Calm Garden** — light sage and warm neutral surfaces.

Theme, wallpaper and motion choices are saved in local storage on the current browser/device.

## Portfolio details

- Name: Muhammad Ali
- Location: Rahim Yar Khan, Pakistan
- Education: Matriculation / 10th class passed
- Email: malikhan621127@gmail.com

The email address is displayed publicly on the website.

## Guestbook / comments

The guestbook validates input and displays comments safely using text nodes. Comments are stored only in the visitor's local browser storage; they are not sent to a server and are not shared between visitors. A backend, authenticated accounts and moderation controls would be needed for a shared public comment system.

## Project files

- `index.html` — portfolio content and page structure.
- `style.css` — responsive layout, themes, glass surfaces, animations and motion preferences.
- `script.js` — theme and wallpaper switching, global motion control, local comments, contact helper, scroll progress and other interactions.
- `images/` — logo, gallery images and wallpaper posters.
- `videos/` — featured video and optimized live wallpaper clips.
- `.nojekyll` — tells GitHub Pages not to run Jekyll processing on the static files.

## Publish with GitHub Pages

1. Create a GitHub repository.
2. Add the **contents of this folder** to the repository root. Do not upload this ZIP as a single repository file; extract it first.
3. Open the repository's **Settings → Pages**.
4. Under **Build and deployment**, choose **Deploy from a branch**.
5. Select the `main` branch and the `/(root)` folder, then save.
6. When GitHub finishes deployment, open the site URL shown on the Pages settings screen.

This is a static HTML/CSS/JavaScript site. GitHub Pages can host the portfolio, but it does not run server-side code. The guestbook therefore remains browser-local.

## GitHub file-size note

GitHub's web upload interface currently accepts files up to 25 MiB each and up to 100 files at a time. The complete ZIP is larger than that single-file limit, so extract it before uploading the project files. The supplied media files are each below the 25 MiB browser-upload limit. For the simplest upload with nested `images/` and `videos/` folders, GitHub Desktop or Git command line can add the complete extracted folder while preserving its structure.

## Notes

- The featured video uses native browser controls and does not autoplay.
- Wallpaper autoplay can be blocked by browser settings; the motion toggle remains available, and the CSS/interface animations can still run.
- Google Fonts are optional enhancements. System font fallbacks are included.
- The website has no server-side account system, database, or cross-device comment sync.

## GitHub Pages wallpaper fallback

The GitHub-ready page animates each selected wallpaper poster with CSS, so the visual motion and floating icons work on desktop, laptop, tablet and mobile without requiring video autoplay. To keep the repository lightweight, this branch uses image files already present in the repository for the wallpaper poster previews. The original unique poster images and MP4 wallpaper loops remain in the supplied project ZIP and can be added later under `images/wallpaper-posters/` and `videos/wallpapers/`.
