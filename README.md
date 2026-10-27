# EVEREST — Beyond the Clouds

A scroll-driven Everest Base Camp expedition website using **MapLibre GL JS** and real geographic elevation tiles. The terrain is streamed from public online services; this is not an offline 3D model and it needs an internet connection.

## Run on macOS

**Do not double-click `index.html`.** That opens the page with `file://`, which prevents Vite's JavaScript module imports and package resolution from working. This is why the page may appear unstyled and the map does not appear.

### Easiest method
1. Install Node.js LTS from https://nodejs.org/ if it is not installed.
2. Double-click `START-HERE.command` (you may need to right-click → Open the first time).
3. Wait for Vite to print a local address, usually `http://localhost:5173/`.
4. Open that address in your browser. Keep the terminal window open while using the site.

### Terminal method
```bash
cd ~/Desktop/everest-beyond-clouds
npm install
npm run dev
```
Open the local URL shown by Vite.

## Build for production
```bash
npm install
npm run build
npm run preview
```

## How the map works
- MapLibre GL JS renders the geographic map and 3D terrain.
- OpenFreeMap Positron provides the pale, arctic-style basemap; a hillshade overlay and exaggerated elevation add definition to ridges and glacial valleys.
- AWS Terrain Tiles provides Terrarium-encoded elevation data.
- The landing page opens on a wide 3D panorama of the Everest/Khumbu region, with the map visible behind the full page. Scrolling between chapters moves the map camera to route waypoints; clicking map markers scrolls to the corresponding chapter.
- The route connects known waypoint coordinates with an approximate line. It is **not a verified GPS trail** and must not be used for navigation.

## Notes
- Internet access is required for map style, terrain tiles, fonts, and map libraries.
- Public services may change availability or impose usage policies. Review their terms and retain required attribution.
- This project is an illustrative web experience, not a substitute for a guide, current trail information, or safety planning.
