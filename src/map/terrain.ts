import type maplibregl from 'maplibre-gl';
import { config } from '../config';

/** Style: dark background, real DEM hillshade, and 3D terrain from the same elevation tiles. No API key needed. */
export function buildStyle(): maplibregl.StyleSpecification {
  const sources: maplibregl.StyleSpecification['sources'] = {
    dem: {
      type: 'raster-dem',
      tiles: [config.demTiles],
      encoding: config.demEncoding,
      tileSize: 256,
      maxzoom: config.demMaxZoom,
      attribution: config.demAttribution
    }
  };
  const layers: maplibregl.LayerSpecification[] = [
    { id: 'bg', type: 'background', paint: { 'background-color': '#10151a' } }
  ];

  if (config.basemapTiles) {
    sources.basemap = {
      type: 'raster',
      tiles: [config.basemapTiles],
      tileSize: 256,
      attribution: config.basemapAttribution
    };
    layers.push({ id: 'basemap', type: 'raster', source: 'basemap', paint: { 'raster-opacity': 0.55, 'raster-saturation': -0.4 } });
  }

  layers.push({
    id: 'hillshade',
    type: 'hillshade',
    source: 'dem',
    paint: {
      'hillshade-shadow-color': '#04070a',
      'hillshade-highlight-color': '#e4eef6',
      'hillshade-accent-color': '#3b566c',
      'hillshade-exaggeration': 0.62,
      'hillshade-illumination-direction': 315
    }
  });

  return {
    version: 8,
    name: 'everest-dark-relief',
    sources,
    layers,
    terrain: { source: 'dem', exaggeration: config.exaggeration }
  };
}

export function webglAvailable(): boolean {
  try {
    const c = document.createElement('canvas');
    return !!(c.getContext('webgl2') || c.getContext('webgl'));
  } catch {
    return false;
  }
}
