const env = import.meta.env;

/** All provider settings are overridable through VITE_* variables (see .env.example). */
export const config = {
  demTiles:
    env.VITE_DEM_TILES || 'https://s3.amazonaws.com/elevation-tiles-prod/terrarium/{z}/{x}/{y}.png',
  demEncoding: (env.VITE_DEM_ENCODING || 'terrarium') as 'terrarium' | 'mapbox',
  demMaxZoom: Number(env.VITE_DEM_MAXZOOM || 15),
  exaggeration: Number(env.VITE_TERRAIN_EXAGGERATION || 1.35),
  basemapTiles: (env.VITE_BASEMAP_TILES || '') as string,
  basemapAttribution: (env.VITE_BASEMAP_ATTRIBUTION || '') as string,
  demAttribution:
    'Terrain: <a href="https://registry.opendata.aws/terrain-tiles/" target="_blank" rel="noopener">Mapzen / AWS Terrain Tiles</a> (SRTM, ASTER GDEM, others — <a href="https://github.com/tilezen/joerd/blob/master/docs/attribution.md" target="_blank" rel="noopener">attribution</a>)',
  routeAttribution: 'Route: approximate corridor, hand-drawn'
};
