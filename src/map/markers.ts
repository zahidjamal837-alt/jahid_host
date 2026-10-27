import maplibregl from 'maplibre-gl';
import { STOPS } from '../data/stops';
import type { LngLat } from '../types';

export interface Markers {
  setActive: (stopId: string | null) => void;
  setVisible: (v: boolean) => void;
  moveWalker: (ll: LngLat) => void;
}

export function addMarkers(map: maplibregl.Map, onSelect: (stopId: string) => void): Markers {
  const pins = new Map<string, HTMLElement>();
  const markers: maplibregl.Marker[] = [];

  for (const s of STOPS) {
    const el = document.createElement('button');
    el.type = 'button';
    el.className = `pin pin-${s.kind}`;
    el.setAttribute('aria-label', `Go to ${s.name}, about ${s.ele.toLocaleString()} metres`);
    el.innerHTML = `<span class="pin-dot"></span><span class="pin-label">${s.name}<small>${s.ele.toLocaleString()} m</small></span>`;
    el.addEventListener('click', (ev) => { ev.stopPropagation(); onSelect(s.id); });
    pins.set(s.id, el);
    markers.push(new maplibregl.Marker({ element: el, anchor: 'center' }).setLngLat(s.ll).addTo(map));
  }

  const walkerEl = document.createElement('div');
  walkerEl.className = 'walker';
  walkerEl.setAttribute('aria-hidden', 'true');
  const walker = new maplibregl.Marker({ element: walkerEl, anchor: 'center' }).setLngLat(STOPS[0].ll).addTo(map);

  return {
    setActive(id) { pins.forEach((el, k) => el.classList.toggle('is-active', k === id)); },
    setVisible(v) { pins.forEach((el) => (el.hidden = !v)); },
    moveWalker(ll) { walker.setLngLat(ll); }
  };
}
