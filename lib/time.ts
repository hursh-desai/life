export const clamp = (v: number, a: number, b: number) => Math.max(a, Math.min(b, v));

export function addYears(date: Date, years: number) {
  const d = new Date(date);
  d.setFullYear(d.getFullYear() + years);
  return d;
}

export function fmt(d: Date) {
  return d.toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" });
}

export function yearsBetween(a: Date, b: Date) {
  return (b.getTime() - a.getTime()) / (1000 * 60 * 60 * 24 * 365.2425);
}

export function ageToDate(birth: Date, ageYears: number) {
  return addYears(birth, Math.round(ageYears * 1000) / 1000);
}

