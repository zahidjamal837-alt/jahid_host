# Jahid Jamal — Cinematic 3D Portfolio

A responsive, static portfolio with a live Three.js sculpture, orbiting geometry, particle field, scroll reveals, hover tilt project cards, and a mobile navigation.

## Run it
- Extract the ZIP.
- Open `index.html` in a modern browser with an internet connection.
- For local development, use VS Code Live Server if available (no npm required).

The 3D scene imports Three.js from jsDelivr and fonts from Google Fonts. No package installation or build step is required.

## Deploy to GitHub Pages
1. Upload the contents of this folder to the root of your repository.
2. In GitHub, open **Settings → Pages**.
3. Select **Deploy from a branch**, branch `main`, folder `/(root)`, then Save.
4. Wait for the Pages build to finish.

## Structure
```text
index.html
assets/
  css/style.css
  js/main.js
  js/scene.js
  data/projects.js
README.md
```

## Customise
- Edit name, text, sections and contact email in `index.html`.
- Change colours and responsive layout in `assets/css/style.css`.
- Adjust 3D geometry, lighting and animation in `assets/js/scene.js`.
- Project data reference is in `assets/data/projects.js`.

## Notes
- This is a frontend-only portfolio; contact currently opens an email draft.
- The main 3D scene requires WebGL and an internet connection to load Three.js.
- If the 3D scene does not appear when opening `file://`, run it with VS Code Live Server or deploy to GitHub Pages. No npm installation is needed.


## User-provided Everest image
The image you supplied is included at `assets/images/everest-hero.jpeg` and is used as a full-screen, gently animated background layer. Keep the relative file path intact when deploying to GitHub Pages. No npm install or build step is required for this static version.


## Cyberpunk visual edition
This edition adds a neon cyan/magenta cyberpunk HUD aesthetic, scanline texture, angular controls, neon project cards, and a tinted version of the supplied Everest artwork. It remains a static site; no npm install or build step is required.


Motion update: this edition keeps the cyberpunk 3D sculpture, orbit rings, text, and background stable. No continuous spinning, floating, cursor-following glow, or animated text; only subtle hover styling and normal smooth scrolling remain.


### 3D scene note
The hero sculpture uses Three.js from a CDN and renders a real WebGL 3D scene. It is deliberately not continuously rotating. Open `index.html` with an internet connection, or publish the folder to GitHub Pages. No npm install or build command is required. If a browser blocks WebGL or the CDN, the 3D scene may not render.
