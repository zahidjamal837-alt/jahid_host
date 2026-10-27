# Jahid Jamal — Immersive 3D Portfolio

A responsive static portfolio inspired by your reference image. It uses procedural Three.js scenes in the hero, about, and contact sections, plus animated layered project cards and pointer-based 3D tilt.

## No installation required
Extract the ZIP and open `index.html` in a modern browser. No npm, Node.js, build step, or local server is required. Internet is needed for the Three.js and Google Fonts CDN resources.

## Personalize before publishing
In `index.html`, replace:
- `your-email@example.com`
- the generic GitHub profile URL
- the generic LinkedIn profile URL

Check project descriptions and technologies so they accurately represent your work.

## GitHub Pages
Upload the contents of this folder to the repository root, commit to `main`, then choose **Settings → Pages → Deploy from a branch → main → /(root)**.

## Structure
- `index.html` — page structure
- `assets/css/style.css` — visual styling and responsive layouts
- `assets/data/projects.js` — project content
- `assets/js/scene.js` — procedural Three.js scenes
- `assets/js/main.js` — project rendering, scroll progress, reveal and card interactions

Note: 3D scenes require a browser with WebGL support and internet access to load the Three.js CDN. The visuals are generated in code rather than used as a static screenshot background.
