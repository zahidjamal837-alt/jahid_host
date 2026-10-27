# Jahid Jamal — Immersive 3D Portfolio v2

This is the npm/Vite edition of the portfolio, rebuilt from the supplied visual reference with a more detailed Three.js scene, layered procedural mountain ranges, a planet with atmospheric glow and orbit rings, floating rock shards, a reflective water plane, an orbiting crystal sculpture, 3D project cards, and improved text hierarchy.

## Requirements
- Node.js (current LTS recommended)
- npm
- A modern browser with WebGL support

## Run locally
```bash
npm install
npm run dev
```
Open the local URL printed by Vite.

## Build for deployment
```bash
npm run build
npm run preview
```
Vite outputs the production site into `dist/`.

## GitHub Pages
For GitHub Pages, set the Vite `base` option to your repository path in `vite.config.js` if the site is published at `username.github.io/repository-name/`. If using a custom domain or root-domain repository, `/` is generally appropriate. Then run `npm run build` and publish `dist/`.

## Before publishing
Replace `your-email@example.com`, the generic GitHub URL, and generic LinkedIn URL in `index.html`. Review project descriptions and technology tags for accuracy.

## Structure
- `index.html` — semantic page structure
- `src/main.js` — Three.js scenes, project data rendering and interactions
- `src/style.css` — responsive cinematic visual design
- `package.json` — npm scripts and dependencies
