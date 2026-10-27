# Everest 3D Trek

A scroll-driven, cinematic 3D map of the Everest Base Camp trek (Lukla → Everest Base Camp → Kala Patthar → return).
Real elevation data (open terrain tiles) rendered with MapLibre GL JS; the camera follows your scroll position.

## Prerequisites
Node.js 18+ (tested for syntax on Node 22) and npm. **No API key, account or credit card is needed.**

## Install and run
```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # type-check + production build into dist/
npm run preview    # serve dist/ locally
```

## Configuration (all optional)
Copy `.env.example` to `.env.local`. You can change the elevation tile URL/encoding, terrain exaggeration, or add a raster basemap.
Provider settings live in `src/config.ts`; the map style is in `src/map/terrain.ts`.

## Structure
```
src/
  data/      route.ts (approximate corridor + elevations), stops.ts, itinerary.ts (chapters + camera poses), plan.ts
  lib/       geo.ts (haversine, interpolation), journey.ts (scroll → camera/route frame, pure & testable)
  map/       createMap.ts, terrain.ts (style + DEM), cameraController.ts, routeLayers.ts, markers.ts
  ui/        shell.ts, dashboard.ts, elevationProfile.ts (custom SVG), controls.ts
  styles/    global.css, layout.css, map.css, responsive.css
  main.ts    wiring
```
How scroll drives the camera: `ScrollMapper` converts scroll position into a fractional chapter index; `frameAt()` blends the
camera pose (zoom/pitch/bearing) and moves the centre *along the route polyline*; `CameraController` eases the real map toward it
once per animation frame with `jumpTo()` (no overlapping `flyTo` animations).
Dragging/rotating/zooming the map pauses scroll-following; the next scroll or the **Reset camera** button resumes it.
Map zoom needs Ctrl+scroll (or two fingers on touch) so normal scrolling never gets trapped by the map.

## Features
- Real 3D terrain (raster-dem) + DEM hillshade; sticky map on desktop, sticky top map on mobile
- 13 chapters: intro, Lukla, Phakding, Monjo, Namche, Tengboche, Dingboche, Lobuche, Gorak Shep, Base Camp, Kala Patthar, descent (Pheriche → Namche → Lukla), summary
- Live dashboard (stop, interpolated elevation, trek day, next leg, remaining distance, progress, lodging)
- Interactive SVG elevation profile (click/keyboard a stop to scroll the journey there), compact on the map + full in the summary
- Route explorer: fly-to select, outbound/return/both, route and marker toggles, reset camera, free exploration
- Animated orange progress line, active marker, top progress bar
- Acclimatization (Namche, Dingboche), altitude illness, weather notes, typical day-by-day plan with walking / acclimatization / optional / return labels
- Loading + error states (no WebGL, terrain tile failure → flat fallback with message), `prefers-reduced-motion` support, skip link, aria labels

## Deployment (free static hosting)
`npm run build`, then upload `dist/` to GitHub Pages, Netlify, Cloudflare Pages or Vercel (static). `base: './'` makes sub-path hosting work.

## Data sources and attribution
See `LICENSES-AND-ATTRIBUTION.md`. Terrain: Mapzen/AWS Terrain Tiles (public AWS Open Data). Keep the on-map attribution.

## Known limitations
- **Route geometry is approximate**: hand-placed waypoints along the known corridor, not a surveyed GPS track. Distances (≈ 88 km round trip along the polyline) under-count real trail length (commonly quoted ≈ 130 km). Not for navigation.
  To improve: replace `src/data/route.ts` nodes with a track from an openly licensed GPX (e.g. OpenStreetMap, ODbL).
- Town coordinates/elevations are rounded, commonly published values; sources differ by tens of metres. Walking times are typical estimates.
- Default style is hillshade only (no place names/roads) to avoid provider usage restrictions; add a basemap via `.env` if you accept its terms.
- The AWS terrain tile bucket is a free public dataset, but it carries no service-level guarantee; heavy traffic should use your own tile host/CDN.
- Cooperative gestures (Ctrl+scroll) are used on the map by design.
- **Not tested in the build environment** (no network): `npm install`, `vite build`, and any in-browser behaviour (rendering, scroll feel, tile loading, mobile layout). See below.

## What was verified when this was packaged
- TypeScript type-check passes with MapLibre/GSAP typed as `any` stubs (real types were unavailable offline).
- Route/camera logic executed in Node: stops ordered along the path, progress 0→100%, camera centre continuous across a scroll sweep.
Everything else needs a first run on your machine; please report/fix any issue `npm run build` surfaces.
