import type maplibregl from 'maplibre-gl';
import { OUT_LINE, RET_LINE } from '../data/route';
import type { LngLat } from '../types';

const feature = (coords: LngLat[]) => ({
  type: 'Feature' as const, properties: {}, geometry: { type: 'LineString' as const, coordinates: coords }
});

/** Dashed base lines (approximate geometry) plus a solid orange progress line. */
export function addRouteLayers(map: maplibregl.Map) {
  map.addSource('route-out', { type: 'geojson', data: feature(OUT_LINE) });
  map.addSource('route-ret', { type: 'geojson', data: feature(RET_LINE) });
  map.addSource('route-progress', { type: 'geojson', data: feature([]) });

  map.addLayer({ id: 'route-out', type: 'line', source: 'route-out', layout: { 'line-cap': 'round', 'line-join': 'round' },
    paint: { 'line-color': '#dfeaf2', 'line-width': 2.4, 'line-opacity': 0.75, 'line-dasharray': [2, 1.6] } });
  map.addLayer({ id: 'route-ret', type: 'line', source: 'route-ret', layout: { 'line-cap': 'round', 'line-join': 'round' },
    paint: { 'line-color': '#7fb6d8', 'line-width': 2.4, 'line-opacity': 0.85, 'line-dasharray': [0.6, 2] } });
  map.addLayer({ id: 'route-glow', type: 'line', source: 'route-progress', layout: { 'line-cap': 'round', 'line-join': 'round' },
    paint: { 'line-color': '#ff8a3d', 'line-width': 9, 'line-opacity': 0.25, 'line-blur': 6 } });
  map.addLayer({ id: 'route-progress', type: 'line', source: 'route-progress', layout: { 'line-cap': 'round', 'line-join': 'round' },
    paint: { 'line-color': '#ff8a3d', 'line-width': 3.6 } });
}

export function setProgress(map: maplibregl.Map, coords: LngLat[]) {
  const src = map.getSource('route-progress') as maplibregl.GeoJSONSource | undefined;
  src?.setData(feature(coords));
}

export type RouteView = 'both' | 'out' | 'ret';

export function setRouteVisible(map: maplibregl.Map, visible: boolean, view: RouteView) {
  const set = (id: string, on: boolean) => map.getLayer(id) && map.setLayoutProperty(id, 'visibility', on ? 'visible' : 'none');
  set('route-out', visible && view !== 'ret');
  set('route-ret', visible && view !== 'out');
  set('route-progress', visible);
  set('route-glow', visible);
}
