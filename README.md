# Jahid Jamal — 3D Portfolio (Updated)

This version follows the supplied portfolio reference: huge mountain-textured name typography, a clear half-body portrait, icy Himalayan scenery, a left-side index rail, floating 3D crystals, orbital rings, a dark tech-stack panel, Nepal/location card, gamer card, and layered 3D effects through the other sections.

## Run on macOS

1. Extract the ZIP.
2. Open Terminal in the `jahid-portfolio` folder.
3. Run:

```bash
python3 -m http.server 8000
```

4. Visit http://localhost:8000. Leave Terminal running while browsing; press Ctrl+C to stop.

## What is inside

- `index.html` — responsive portfolio, styling, interactions, and real-time Three.js geometry.
- `assets/jahid-halfbody-portrait.png` — transparent half-body portrait cutout used in the hero, cropped to keep the face large and visible.
- `assets/jahid-mountains-original.jpeg` and `assets/mountain-backdrop.webp` — the originally uploaded mountain photo and the backdrop crop.
- `assets/jahid-portrait-original.jpeg` / `assets/jahid-portrait.webp` — second uploaded portrait used in the About section.
- `assets/template-reference.jpeg` — supplied screenshot for reference only; it is not used as a flat website background.

## Notes

This is a static site; no backend, database, or paid API is required. Three.js and Google Fonts load from CDNs, so an internet connection is needed for the complete 3D experience and fonts. The hero portrait is a 2D image cutout (not a fully modelled 3D human); the surrounding environment uses CSS and real-time Three.js geometry. Replace `replace-with-your-email@example.com` and add your profile links before publishing.

## Deploy

Upload the contents of this folder to GitHub Pages or another static host; keep `index.html` at the published root so relative asset URLs resolve.
