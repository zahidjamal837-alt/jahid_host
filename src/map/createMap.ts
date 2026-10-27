import maplibregl from 'maplibre-gl';
import { buildStyle, webglAvailable } from './terrain';
import { config } from '../config';
import type { CamPose, LngLat } from '../types';

export interface MapHandle {
  map: maplibregl.Map;
  /** Resolves when the style has loaded (terrain may still be streaming). */
  ready: Promise<void>;
}

export interface MapCallbacks {
  onStatus: (msg: string | null, level: 'info' | 'warn') => void;
}

export function createMap(
  container: HTMLElement,
  start: { center: LngLat; cam: CamPose },
  cb: MapCallbacks
): MapHandle | null {
  if (!webglAvailable()) {
    cb.onStatus('WebGL is not available in this browser, so the 3D map cannot be shown. The itinerary below still works.', 'warn');
    return null;
  }

  const map = new maplibregl.Map({
    container,
    style: buildStyle(),
    center: start.center,
    zoom: start.cam.zoom,
    pitch: start.cam.pitch,
    bearing: start.cam.bearing,
    maxPitch: 82,
    minZoom: 8,
    maxZoom: 16,
    // Wheel/one-finger gestures pass through to the page; Ctrl+wheel or two fingers drive the map.
    cooperativeGestures: true,
    attributionControl: { compact: true },
    canvasContextAttributes: { antialias: true }
  } as maplibregl.MapOptions);

  map.addControl(new maplibregl.NavigationControl({ visualizePitch: true }), 'top-left');
  map.addControl(new maplibregl.ScaleControl({ unit: 'metric' }), 'bottom-left');

  let demErrors = 0;
  map.on('error', (e: any) => {
    if (e?.sourceId === 'dem') {
      demErrors++;
      if (demErrors === 4) {
        try { map.setTerrain(null); } catch { /* ignore */ }
        cb.onStatus(`Elevation tiles could not be loaded (${hostOf(config.demTiles)}). Showing the flat map; the journey still works.`, 'warn');
      }
    }
  });

  const slow = window.setTimeout(() => cb.onStatus('Still loading terrain — slow connection? The journey will refine as tiles arrive.', 'info'), 9000);

  const ready = new Promise<void>((resolve) => {
    map.once('load', () => resolve());
    map.once('idle', () => {
      window.clearTimeout(slow);
      cb.onStatus(null, 'info');
    });
  });

  return { map, ready };
}

function hostOf(url: string) {
  try { return new URL(url.replace(/\{[^}]+\}/g, '0')).host; } catch { return 'tile server'; }
}
