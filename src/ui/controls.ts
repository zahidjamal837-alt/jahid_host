import { STOPS } from '../data/stops';
import type { RouteView } from '../map/routeLayers';

export interface ControlHandlers {
  onSelect: (stopId: string) => void;
  onReset: () => void;
  onRouteVisible: (v: boolean) => void;
  onMarkersVisible: (v: boolean) => void;
  onView: (v: RouteView) => void;
}

export function mountControls(root: HTMLElement, h: ControlHandlers) {
  root.innerHTML = `
    <label class="sr-only" for="stop-select">Fly to a stop</label>
    <select id="stop-select" class="ctl-select"><option value="">Fly to stop…</option>${STOPS.map((s) => `<option value="${s.id}">${s.name} · ${s.ele.toLocaleString()} m</option>`).join('')}</select>
    <div class="ctl-row" role="group" aria-label="Route view">
      <button type="button" data-view="both" aria-pressed="true">Both</button>
      <button type="button" data-view="out" aria-pressed="false">Outbound</button>
      <button type="button" data-view="ret" aria-pressed="false">Return</button>
    </div>
    <div class="ctl-row">
      <button type="button" id="t-route" aria-pressed="true">Route</button>
      <button type="button" id="t-markers" aria-pressed="true">Markers</button>
      <button type="button" id="t-reset">Reset camera</button>
    </div>`;
  const sel = root.querySelector<HTMLSelectElement>('#stop-select')!;
  sel.addEventListener('change', () => { if (sel.value) h.onSelect(sel.value); sel.value = ''; });

  const toggle = (btn: HTMLElement, cb: (on: boolean) => void) =>
    btn.addEventListener('click', () => {
      const on = btn.getAttribute('aria-pressed') !== 'true';
      btn.setAttribute('aria-pressed', String(on));
      cb(on);
    });
  toggle(root.querySelector('#t-route')!, h.onRouteVisible);
  toggle(root.querySelector('#t-markers')!, h.onMarkersVisible);
  root.querySelector('#t-reset')!.addEventListener('click', h.onReset);

  const views = root.querySelectorAll<HTMLButtonElement>('[data-view]');
  views.forEach((b) => b.addEventListener('click', () => {
    views.forEach((o) => o.setAttribute('aria-pressed', String(o === b)));
    h.onView(b.dataset.view as RouteView);
  }));
}
