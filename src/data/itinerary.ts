import type { Chapter } from '../types';

/** Narrative chapters. Each stop chapter drives one camera pose; the camera blends between them as you scroll. */
export const CHAPTERS: Chapter[] = [
  {
    id: 'intro', kind: 'intro', kicker: 'The Khumbu · Nepal', title: 'Walk toward the roof of the world',
    paragraphs: [
      'Everest Base Camp is not a summit — it is a place you earn by walking. The classic route climbs the Dudh Koshi valley from a mountain airstrip, through Sherpa villages and rhododendron forest, to a glacier more than 5,000 m above the sea.',
      'Scroll to travel the route. The terrain beneath you is real elevation data; the camera follows the trail corridor.'
    ],
    facts: [['Highest peak', 'Everest · 8,849 m'], ['Typical duration', '≈ 11–14 days round trip'], ['Trek high point', 'Kala Patthar · ≈ 5,545 m']],
    cam: { zoom: 9.4, pitch: 72, bearing: 8 }, center: [86.83, 27.88]
  },
  {
    id: 'lukla', kind: 'stop', stopId: 'lukla', kicker: 'Day 1 · The gateway', title: 'Lukla',
    paragraphs: [
      'Almost every trek begins with a short flight from Kathmandu to a sloping mountain airstrip. Weather can delay flights by a day or more, so build slack into any plan.',
      'From the airstrip the trail drops north-west toward the Dudh Koshi river.'
    ],
    facts: [['Elevation', '≈ 2,860 m'], ['Role', 'Start / end of the trek']],
    cam: { zoom: 12.6, pitch: 70, bearing: 15 }
  },
  {
    id: 'phakding', kind: 'stop', stopId: 'phakding', kicker: 'Day 1 · First night', title: 'Phakding',
    paragraphs: ['A gentle first day beside the river, crossing prayer-flag bridges and passing mani walls. You actually lose a little height here — a kind start before the climbing begins.'],
    facts: [['Elevation', '≈ 2,610 m'], ['Walking time', '≈ 3–4 h from Lukla']],
    cam: { zoom: 12.6, pitch: 70, bearing: 5 }
  },
  {
    id: 'monjo', kind: 'stop', stopId: 'monjo', kicker: 'Day 2 · The park gate', title: 'Monjo',
    paragraphs: ['Monjo sits at the entrance to Sagarmatha National Park, where permits are checked. Beyond it the valley narrows and the trail crosses the high suspension bridges below Namche.'],
    facts: [['Elevation', '≈ 2,835 m'], ['Note', 'Permit rules change — confirm with your agency']],
    cam: { zoom: 12.6, pitch: 70, bearing: 0 }
  },
  {
    id: 'namche', kind: 'stop', stopId: 'namche', kicker: 'Day 2–3 · Acclimatization', title: 'Namche Bazaar',
    paragraphs: ['The Sherpa capital of the Khumbu fills an amphitheatre of terraces. After a steep climb from the river, it is the first place to rest properly at altitude.'],
    facts: [['Elevation', '≈ 3,440 m'], ['Rest day', 'Day 3 · optional walk to ≈ 3,880 m']],
    callout: { title: 'Acclimatization · Namche', text: 'Spend two nights here. On the rest day, climb high and sleep low — for example a short walk toward the Everest View Hotel (≈ 3,880 m), then return to sleep at Namche.' },
    cam: { zoom: 12.9, pitch: 72, bearing: 30 }
  },
  {
    id: 'tengboche', kind: 'stop', stopId: 'tengboche', kicker: 'Day 4 · The monastery', title: 'Tengboche',
    paragraphs: ['The trail contours high above the river, drops to Phunki Tenga, then climbs through forest to a ridge crowned by the region’s best-known monastery, facing Ama Dablam, Lhotse and Everest.'],
    facts: [['Elevation', '≈ 3,867 m'], ['Walking time', '≈ 5–6 h from Namche']],
    cam: { zoom: 12.8, pitch: 72, bearing: 70 }
  },
  {
    id: 'dingboche', kind: 'stop', stopId: 'dingboche', kicker: 'Day 5–6 · Above the trees', title: 'Dingboche',
    paragraphs: ['Above the tree line the valley opens into stone-walled barley fields beneath Ama Dablam. Pheriche, in the neighbouring valley, is the alternative stop and the base for the descent.'],
    facts: [['Elevation', '≈ 4,410 m'], ['Pheriche', '≈ 4,371 m · alternative stop']],
    callout: { title: 'Acclimatization · Dingboche', text: 'Take a full rest day here. A common option is a slow walk up the ridge behind the village, a few hundred metres higher, before returning to sleep. Rest, fluids and unhurried pacing matter more than distance.' },
    cam: { zoom: 12.8, pitch: 72, bearing: 20 }
  },
  {
    id: 'lobuche', kind: 'stop', stopId: 'lobuche', kicker: 'Day 7 · Glacier country', title: 'Lobuche',
    paragraphs: ['The trail climbs past Dughla and the memorials to climbers who died on these mountains, then runs beside the Khumbu Glacier. Nights are cold and sleep is often light.'],
    facts: [['Elevation', '≈ 4,940 m'], ['Walking time', '≈ 4–5 h from Dingboche']],
    cam: { zoom: 12.8, pitch: 74, bearing: 350 }
  },
  {
    id: 'gorakshep', kind: 'stop', stopId: 'gorakshep', kicker: 'Day 8 · The last village', title: 'Gorak Shep',
    paragraphs: ['A cluster of lodges on a frozen sandy lake bed. This is the highest regular overnight stop, and the base for both Everest Base Camp and Kala Patthar.'],
    facts: [['Elevation', '≈ 5,164 m'], ['Walking time', '≈ 3–4 h from Lobuche']],
    cam: { zoom: 13, pitch: 74, bearing: 10 }
  },
  {
    id: 'ebc', kind: 'stop', stopId: 'ebc', kicker: 'Day 8 · The goal', title: 'Everest Base Camp',
    paragraphs: ['A tent town on moving ice. In climbing season you will see expedition camps; the summit itself is hidden behind the Nuptse ridge. Allow time to rest, then return to Gorak Shep to sleep.'],
    facts: [['Elevation', '≈ 5,364 m'], ['Round trip from Gorak Shep', '≈ 3–4 h']],
    cam: { zoom: 13, pitch: 74, bearing: 100 }
  },
  {
    id: 'kalapatthar', kind: 'stop', stopId: 'kalapatthar', kicker: 'Day 9 · Optional viewpoint', title: 'Kala Patthar',
    paragraphs: ['The classic panorama: Everest, Lhotse, Nuptse and Pumori in a single sweep. Most trekkers climb before dawn for first light — a cold, thin-air ascent of roughly two hours.'],
    facts: [['Elevation', '≈ 5,545 m'], ['Type', 'Optional viewpoint (highest point of the trek)']],
    callout: { title: 'Know when to turn back', text: 'This is the highest point of the trek. Descend at the first signs of serious illness, severe cold or deteriorating weather — the summit of a viewpoint is never worth a medical emergency.' },
    cam: { zoom: 13.2, pitch: 76, bearing: 95 }
  },
  {
    id: 'descent', kind: 'stop', stopId: 'pheriche', kicker: 'Days 9–11 · The return', title: 'Descent to Pheriche, Namche and Lukla',
    paragraphs: ['The way back retraces the valley: Pheriche, then Tengboche, Namche and Lukla. Descending is faster — often two long days — and the thicker air feels like a gift.', 'The map line shows the return in glacier blue; the orange line is your progress.'],
    facts: [['Pheriche', '≈ 4,371 m'], ['Return', 'Pheriche → Namche ≈ 6–7 h · Namche → Lukla ≈ 6–7 h']],
    cam: { zoom: 12, pitch: 70, bearing: 190 }
  },
  {
    id: 'summary', kind: 'summary', kicker: 'The full journey', title: 'Eleven days, one valley, 3,000 m of thin air',
    paragraphs: ['Lukla to Everest Base Camp and back, with two acclimatization days and an optional dawn climb of Kala Patthar. Select any point on the profile to jump back to that place.'],
    cam: { zoom: 9.9, pitch: 48, bearing: 0 }, center: [86.8, 27.86]
  }
];
