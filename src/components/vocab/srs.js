// =====================================================================
// The review drawer's clockwork — a plain SM-2-ish interval scheduler.
//
// Deliberately boring (docs/vocabulary-plan.md, phase 5): day-granular,
// four grades, one ease factor. Pure functions only — the store applies
// them, the instruments preview them. All dates are local-day keys
// ('YYYY-MM-DD'); ISO ordering makes string comparison safe.
//
//   Srs: { reps, lapses, ease, interval, due }
//     reps     — successful reviews since last lapse
//     ease     — interval multiplier, 1.3 ≤ ease, starts 2.5
//     interval — days to next review (0 = again today)
//     due      — day key when the card resurfaces
// =====================================================================

export const GRADES = [
  { id: 'again', label: 'again', key: '1', hint: 'blank — back to today' },
  { id: 'hard',  label: 'hard',  key: '2', hint: 'recalled, barely' },
  { id: 'good',  label: 'good',  key: '3', hint: 'recalled' },
  { id: 'easy',  label: 'easy',  key: '4', hint: 'instant' },
]

// A learning word graduates to known once its interval clears this many
// days — three weeks held without a lapse.
export const KNOWN_INTERVAL = 21

const MAX_INTERVAL = 365

// Local-date key (toISOString would drift across midnight in UTC).
export function dayKey(d = new Date()) {
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${d.getFullYear()}-${m}-${day}`
}

export function addDays(day, n) {
  const [y, m, d] = day.split('-').map(Number)
  return dayKey(new Date(y, m - 1, d + n))
}

export function newSrs(today = dayKey()) {
  return { reps: 0, lapses: 0, ease: 2.5, interval: 0, due: today }
}

// The would-be interval (days) for a grade — used both to schedule and
// to print the previews on the grade buttons.
export function previewInterval(srs, grade) {
  const { reps, ease, interval } = srs
  if (grade === 'again') return 0
  if (reps === 0) {
    // new or freshly lapsed: hard repeats today, good steps out, easy leaps
    return grade === 'hard' ? 0 : grade === 'good' ? 1 : 4
  }
  const next =
    grade === 'hard' ? interval * 1.2 :
    grade === 'good' ? interval * ease :
    interval * ease * 1.3
  return Math.min(MAX_INTERVAL, Math.max(interval + 1, Math.round(next)))
}

export function schedule(srs, grade, today = dayKey()) {
  const interval = previewInterval(srs, grade)
  const next = { ...srs, interval, due: addDays(today, interval) }
  if (grade === 'again') {
    return { ...next, reps: 0, lapses: srs.lapses + 1, ease: Math.max(1.3, srs.ease - 0.2) }
  }
  const ease =
    grade === 'hard' ? Math.max(1.3, srs.ease - 0.15) :
    grade === 'easy' ? srs.ease + 0.15 :
    srs.ease
  return { ...next, reps: srs.reps + 1, ease }
}

export function isDue(srs, today = dayKey()) {
  return srs.due <= today
}

// '0 → today · 1 → 1 d · 18 → 18 d · 35 → 5 w · 90 → 3 mo'
export function fmtInterval(days) {
  if (days <= 0) return 'today'
  if (days < 21) return days + ' d'
  if (days < 70) return Math.round(days / 7) + ' w'
  return Math.round(days / 30) + ' mo'
}
