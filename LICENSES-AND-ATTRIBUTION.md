# Licenses and attribution

| Component | Use | License / terms |
|---|---|---|
| MapLibre GL JS | map rendering | BSD-3-Clause |
| GSAP (ScrollTrigger) | scroll animation | GreenSock "Standard No Charge" license — free for this use; review https://gsap.com/standard-license |
| Vite, TypeScript | build tooling | MIT / Apache-2.0 |
| Terrain tiles (Terrarium) | elevation + hillshade | Mapzen / AWS Open Data "Terrain Tiles": https://registry.opendata.aws/terrain-tiles/ — built from SRTM, ASTER GDEM, and other sources; required attribution: https://github.com/tilezen/joerd/blob/master/docs/attribution.md . The attribution is shown in the map's attribution control — do not remove it. |
| Route geometry | route line | Hand-placed approximation by the project authors; no third-party track is bundled |
| Place coordinates / elevations / durations | content | Rounded commonly published figures, unverified against a single authoritative source |

Usage limits: the default tile bucket needs no key; no formal rate limit is documented, but it is not a guaranteed service. Verify current terms before launching at scale.
If you enable `VITE_BASEMAP_TILES`, you must comply with that provider's usage policy and attribution (e.g. OpenStreetMap tiles are not for heavy production use).

Fonts: system font stacks only; no external font requests.
