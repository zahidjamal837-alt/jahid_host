export type DayType = 'walk' | 'acclimatization' | 'optional' | 'return';

export interface PlanRow {
  day: string;
  route: string;
  type: DayType[];
  time: string;
  night: string;
}

/** Typical itinerary. Times are walking times and exclude rests; they vary with fitness, weather and trail conditions. */
export const PLAN: PlanRow[] = [
  { day: '1', route: 'Lukla → Phakding', type: ['walk'], time: '≈ 3–4 h', night: 'Phakding · 2,610 m' },
  { day: '2', route: 'Phakding → Monjo → Namche Bazaar', type: ['walk'], time: '≈ 5–6.5 h', night: 'Namche Bazaar · 3,440 m' },
  { day: '3', route: 'Namche rest day · walk toward Everest View Hotel', type: ['acclimatization', 'optional'], time: '≈ 2–3 h (optional)', night: 'Namche Bazaar' },
  { day: '4', route: 'Namche → Tengboche', type: ['walk'], time: '≈ 5–6 h', night: 'Tengboche · 3,867 m' },
  { day: '5', route: 'Tengboche → Dingboche', type: ['walk'], time: '≈ 5–6 h', night: 'Dingboche · 4,410 m' },
  { day: '6', route: 'Dingboche rest day · ridge walk', type: ['acclimatization', 'optional'], time: '≈ 3–4 h (optional)', night: 'Dingboche' },
  { day: '7', route: 'Dingboche → Lobuche', type: ['walk'], time: '≈ 4–5 h', night: 'Lobuche · 4,940 m' },
  { day: '8', route: 'Lobuche → Gorak Shep → Base Camp → Gorak Shep', type: ['walk'], time: '≈ 7–9 h', night: 'Gorak Shep · 5,164 m' },
  { day: '9', route: 'Kala Patthar (dawn) → Gorak Shep → Pheriche', type: ['optional', 'return'], time: '≈ 6–8 h', night: 'Pheriche · 4,371 m' },
  { day: '10', route: 'Pheriche → Tengboche → Namche', type: ['return'], time: '≈ 6–7 h', night: 'Namche Bazaar' },
  { day: '11', route: 'Namche → Lukla', type: ['return'], time: '≈ 6–7 h', night: 'Lukla · 2,860 m' }
];
