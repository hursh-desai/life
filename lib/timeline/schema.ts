export type Range = { startAge: number; endAge: number };
export type Importance = 1 | 2 | 3; // 1 = minor, 2 = normal, 3 = major
export type EventPoint = { label: string; age: number; note?: string; kind: "bio" | "soc"; importance?: Importance };
export type EventRange = { label: string; range: Range; note?: string; kind: "bio" | "soc"; importance?: Importance };
export type TimelineItem = EventPoint | EventRange;

export function isRange(e: TimelineItem): e is EventRange {
  return (e as EventRange).range !== undefined;
}

export const HARD_CODED_EVENTS: TimelineItem[] = [
  { label: "Infancy", range: { startAge: 0, endAge: 1 }, kind: "bio", importance: 3, note: "Rapid synaptogenesis; sleep dominates." },
  { label: "Early childhood", range: { startAge: 1, endAge: 5 }, kind: "bio", importance: 2, note: "Language explosion, motor skills." },
  { label: "School-age childhood", range: { startAge: 5, endAge: 12 }, kind: "bio", importance: 2, note: "Steady growth; concrete thinking." },
  { label: "Puberty window", range: { startAge: 10, endAge: 14 }, kind: "bio", importance: 3, note: "Hormonal changes and growth spurts." },
  { label: "Peak processing speed", range: { startAge: 18, endAge: 25 }, kind: "bio", importance: 2, note: "Working memory/reaction time peak." },
  { label: "Prefrontal maturation ≈ complete", age: 25, kind: "bio", importance: 2, note: "Executive function largely mature." },
  { label: "Peak VO2 / recovery", range: { startAge: 20, endAge: 30 }, kind: "bio", importance: 1, note: "Aerobic capacity high; fastest recovery." },
  { label: "Bone density peak", age: 30, kind: "bio", importance: 2, note: "After peak, gradual decline begins." },
  { label: "Testosterone gradual decline starts", age: 30, kind: "bio", importance: 1, note: "~1%/yr on average (wide variance)." },
  { label: "Female fertility begins notable decline", age: 32, kind: "bio", importance: 3, note: "Fertility drop accelerates after ~37." },
  { label: "Presbyopia common onset", range: { startAge: 40, endAge: 45 }, kind: "bio", importance: 1, note: "Near-focus difficulty." },
  { label: "Sarcopenia acceleration", range: { startAge: 40, endAge: 60 }, kind: "bio", importance: 2, note: "Strength/muscle loss without training." },
  { label: "Perimenopause → menopause (median)", range: { startAge: 45, endAge: 51 }, kind: "bio", importance: 3, note: "Cycle/estrogen changes; menopause ~51." },
  { label: "Cardiometabolic risk climbs", range: { startAge: 50, endAge: 70 }, kind: "bio", importance: 2, note: "BP, lipids, insulin resistance trends." },
  { label: "Hearing high‑freq loss", range: { startAge: 50, endAge: 80 }, kind: "bio", importance: 1, note: "Presbycusis gradually increases." },
  { label: "Cognitive decline risk ↑", range: { startAge: 65, endAge: 90 }, kind: "bio", importance: 2, note: "Heterogeneous; lifestyle matters." },

  { label: "Start primary school", age: 5, kind: "soc", importance: 2, note: "Kindergarten/Year 1." },
  { label: "Finish high school", age: 18, kind: "soc", importance: 3, note: "Diploma/GED equivalent." },
  { label: "Finish undergrad (typical)", age: 22, kind: "soc", importance: 2, note: "If pursued; many paths exist." },
  { label: "Median US first marriage ~", age: 30, kind: "soc", importance: 1, note: "Varies by region/education/identity." },
  { label: "First child (median US)", range: { startAge: 27, endAge: 30 }, kind: "soc", importance: 2, note: "Highly variable; optional." },
  { label: "Peak earnings window", range: { startAge: 45, endAge: 55 }, kind: "soc", importance: 2, note: "Industry dependent; wide spread." },
  { label: "Social Security early eligibility", age: 62, kind: "soc", importance: 1, note: "US-specific; future adjustable." },
  { label: "Medicare eligibility", age: 65, kind: "soc", importance: 2, note: "US-specific milestone." },
  { label: "Common retirement window", range: { startAge: 65, endAge: 70 }, kind: "soc", importance: 2, note: "Many work longer or change careers." },
];

