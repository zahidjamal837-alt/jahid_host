import maplibregl from 'maplibre-gl';
import { route } from '../data/route.js';

export function createTerrainMap() {
  const map = new maplibregl.Map({
    container: 'map',
    style: 'https://tiles.openfreemap.org/styles/positron',
    // Begin with a wide, cinematic view of the Khumbu instead of zooming into Lukla.
    center: [86.82, 27.85],
    zoom: 8.25,
    pitch: 61,
    bearing: -18,
    antialias: true,
    attributionControl: false,
    maxPitch: 85
  });
  map.addControl(new maplibregl.AttributionControl({ compact: true }), 'bottom-right');
  map.addControl(new maplibregl.NavigationControl({ showCompass: true, showZoom: false, visualizePitch: true }), 'bottom-right');
  let terrainOn = true;
  map.on('load', () => {
    map.addSource('everest-dem', {
      type: 'raster-dem',
      tiles: ['https://elevation-tiles-prod.s3.amazonaws.com/terrarium/{z}/{x}/{y}.png'],
      tileSize: 256,
      encoding: 'terrarium',
      maxzoom: 15,
      attribution: 'Terrain: AWS Open Data / Map data: OpenStreetMap contributors'
    });
    map.setTerrain({ source: 'everest-dem', exaggeration: 1.65 });
    // Relief shading makes ridges and glacial valleys legible on the pale arctic basemap.
    map.addLayer({
      id: 'everest-hillshade', type: 'hillshade', source: 'everest-dem',
      paint: {
        'hillshade-exaggeration': 0.42,
        'hillshade-shadow-color': '#476b7b',
        'hillshade-highlight-color': '#f5fdff',
        'hillshade-accent-color': '#a7c8d5',
        'hillshade-illumination-direction': 315
      }
    });
    map.setFog({ color: 'rgb(203, 229, 238)', 'high-color': 'rgb(160, 210, 228)', 'space-color': 'rgb(8, 27, 40)', 'horizon-blend': 0.16, 'star-intensity': 0.05 });
    const coordinates = route.slice(0, 8).map(s => s.coords);
    map.addSource('trek-route', { type: 'geojson', data: { type: 'Feature', properties: {}, geometry: { type: 'LineString', coordinates } } });
    map.addLayer({ id: 'route-glow', type: 'line', source: 'trek-route', layout: { 'line-cap': 'round', 'line-join': 'round' }, paint: { 'line-color': '#58d9e8', 'line-width': 7, 'line-opacity': 0.16, 'line-blur': 3 } });
    map.addLayer({ id: 'route-line', type: 'line', source: 'trek-route', layout: { 'line-cap': 'round', 'line-join': 'round' }, paint: { 'line-color': '#8debf0', 'line-width': 2.5, 'line-opacity': 0.92, 'line-dasharray': [1.4, 1.3] } });
    map.addSource('route-stops', { type: 'geojson', data: { type: 'FeatureCollection', features: route.slice(0, 8).map((s, i) => ({ type: 'Feature', geometry: { type: 'Point', coordinates: s.coords }, properties: { index: i, name: s.name, altitude: s.altitude } })) } });
    map.addLayer({ id: 'stops-halo', type: 'circle', source: 'route-stops', paint: { 'circle-radius': ['case', ['==', ['get', 'index'], 0], 9, 6], 'circle-color': '#68e3ed', 'circle-opacity': 0.22, 'circle-blur': 0.4 } });
    map.addLayer({ id: 'stops-dot', type: 'circle', source: 'route-stops', paint: { 'circle-radius': ['case', ['==', ['get', 'index'], 0], 4, 3], 'circle-color': '#c6fbff', 'circle-stroke-color': '#153d4b', 'circle-stroke-width': 1.5 } });
    map.on('click', 'stops-dot', e => {
      const index = Number(e.features?.[0]?.properties?.index);
      if (Number.isFinite(index)) window.dispatchEvent(new CustomEvent('route-stop-click', { detail: index }));
    });
    map.on('mouseenter', 'stops-dot', () => map.getCanvas().style.cursor = 'pointer');
    map.on('mouseleave', 'stops-dot', () => map.getCanvas().style.cursor = '');
    window.dispatchEvent(new Event('terrain-ready'));
  });
  return {
    map,
    flyToStop(stop, instant = false) {
      if (!map.isStyleLoaded()) return;
      map.flyTo({ center: stop.coords, zoom: stop.zoom, pitch: stop.pitch, bearing: stop.bearing, duration: instant ? 0 : 2100, essential: true, curve: 1.25, speed: 0.72 });
    },
    reset() { map.flyTo({ center: [86.82, 27.85], zoom: 8.25, pitch: 61, bearing: -18, duration: 1800, essential: true }); },
    toggleTerrain() {
      terrainOn = !terrainOn;
      if (map.getSource('everest-dem')) map.setTerrain(terrainOn ? { source: 'everest-dem', exaggeration: 1.4 } : null);
      return terrainOn;
    }
  };
}
