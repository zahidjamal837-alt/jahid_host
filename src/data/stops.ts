import type { Stop, StopMeta } from '../types';
import { JOURNEY, distOf, indexOf } from './route';

const LODGE = 'Family-run tea-house lodges; basic rooms, shared bathrooms, meals in a common dining room.';

export const STOP_META: StopMeta[] = [
  { id: 'lukla', name: 'Lukla', kind: 'start', day: 'Day 1', next: 'to Phakding · ≈ 3–4 h', overnight: 'Most trekkers sleep at Phakding the first night; Lukla has many lodges if flights are delayed.' },
  { id: 'phakding', name: 'Phakding', kind: 'overnight', day: 'Day 1 (night)', next: 'to Monjo / Namche · ≈ 5–6.5 h', overnight: LODGE },
  { id: 'monjo', name: 'Monjo', kind: 'pass', day: 'Day 2 (lunch / park gate)', next: 'to Namche Bazaar · ≈ 2.5–3.5 h (steep)', overnight: 'Optional overnight to split the climb to Namche; lodges available.' },
  { id: 'namche', name: 'Namche Bazaar', kind: 'overnight', day: 'Day 2 (night) · Day 3 rest', next: 'to Tengboche · ≈ 5–6 h', overnight: 'Widest choice of lodges and bakeries on the route; two nights recommended for acclimatization.' },
  { id: 'tengboche', name: 'Tengboche', kind: 'overnight', day: 'Day 4', next: 'to Dingboche · ≈ 5–6 h', overnight: 'A handful of lodges beside the monastery; cold nights, limited rooms in peak season.' },
  { id: 'dingboche', name: 'Dingboche', kind: 'overnight', day: 'Day 5 (night) · Day 6 rest', next: 'to Lobuche · ≈ 4–5 h', overnight: 'Many lodges; the standard second acclimatization stop (two nights).' },
  { id: 'lobuche', name: 'Lobuche', kind: 'overnight', day: 'Day 7', next: 'to Gorak Shep · ≈ 3–4 h', overnight: 'Simple, cold lodges at nearly 5,000 m; sleep is often poor.' },
  { id: 'gorakshep', name: 'Gorak Shep', kind: 'overnight', day: 'Day 8', next: 'to Base Camp · ≈ 1.5–2 h each way', overnight: 'The highest regular overnight stop; very basic lodges, very cold.' },
  { id: 'ebc', name: 'Everest Base Camp', kind: 'goal', day: 'Day 8 (day visit)', next: 'back to Gorak Shep · ≈ 1.5–2 h', overnight: 'No tourist lodging; a seasonal expedition camp. Return to Gorak Shep to sleep.' },
  { id: 'kalapatthar', name: 'Kala Patthar', kind: 'viewpoint', day: 'Day 9 (dawn, optional)', next: 'down to Pheriche · ≈ 5–6 h', overnight: 'Viewpoint only, reached on a ≈ 1.5–2 h climb from Gorak Shep; start before dawn, in the cold.' },
  { id: 'pheriche', name: 'Pheriche', kind: 'return', day: 'Day 9 (night)', next: 'to Namche · ≈ 6–7 h', overnight: 'Lodges and a seasonal volunteer aid post that gives altitude talks; a common first night of the descent.' }
];

/** Stops merged with coordinates, elevation and route distance from the journey data. */
export const STOPS: Stop[] = STOP_META.map((m) => {
  const node = JOURNEY[indexOf(m.id)];
  return { ...m, ll: node.ll, ele: node.ele, dist: distOf(m.id) };
});

export const stopById = (id: string): Stop => {
  const s = STOPS.find((x) => x.id === id);
  if (!s) throw new Error(`Unknown stop: ${id}`);
  return s;
};
