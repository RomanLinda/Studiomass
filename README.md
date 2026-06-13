[README.md](https://github.com/user-attachments/files/28911248/README.md)
# Studiomass Site

This repository contains a static website in `public/` plus a small Express server for contact form handling.

## Project structure

- `public/` – static HTML, CSS, JavaScript, images, `robots.txt`, and a generated `sitemap.xml`
- `server.js` – Express server used to serve static files and handle contact form submissions
- `package.json` – project metadata and dependencies
- `.gitignore` – ignores `node_modules/`, `.env`, `*.log`, `resized/`, and `.vscode/`

## Dependencies

- `express`
- `helmet`
- `cors`
- `dotenv`
- `axios`
- `express-validator`
- `nodemailer`
- `multer`
- `fs-extra`
- `glob`
- `crypto`

## How to run locally

1. Install dependencies:
   ```bash
   npm install
   ```
2. Create a `.env` file with the required environment values:
   - `MAIL_USER`
   - `MAIL_PASS`
   - `RECAPTCHA_SECRET`
3. Start the server:
   ```bash
   npm start
   ```
4. Open `http://localhost:3000`

## GitHub readiness

- The `public/` section is ready for GitHub.
- Local editor settings and generated folders are ignored by `.gitignore`.
- If you want to host the static site on GitHub Pages, move the `public/` content into the repository root or a `docs/` folder and publish from that source.

## Notes

- `server.js` is required for contact form handling and should be run with Node.js.
- The site currently references `https://www.studiomass88.it/` in `robots.txt` and `sitemap.xml`.
