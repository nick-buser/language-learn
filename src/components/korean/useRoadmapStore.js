import { useCallback, useState } from 'react'

// =====================================================================
// The roadmap's ink — per-learner progress state, persisted.
//
// This is the atlas's first persistent store, and its shape is the
// pilot for the per-learner state the future backend will hold
// (docs/vocabulary-plan.md, phase 3). Swapping localStorage for an API
// must not require component surgery, so everything below speaks in
// the same shapes the backend would serve:
//
//   {
//     checks:   { [itemId]: 'YYYY-MM-DD' },          when each box was ticked
//     habits:   { [habitId]: { [day]: true } },      days each habit happened
//     checkins: [ { date, phase, note } ],           the weekly reckonings
//     profiles: { [phaseId]: profileId },            chosen effort mix
//     pace:     number,                              hours per week
//   }
// =====================================================================

const KEY = 'atlas.ko.roadmap.v1'

// Local-date key (toISOString would drift across midnight in UTC).
export function dayKey(d = new Date()) {
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${d.getFullYear()}-${m}-${day}`
}

function load() {
  if (typeof window === 'undefined') return {}
  try {
    return JSON.parse(window.localStorage.getItem(KEY)) || {}
  } catch {
    return {}
  }
}

export default function useRoadmapStore() {
  const [store, setStore] = useState(load)

  // Every mutation writes through; the store is the single source of truth.
  const patch = useCallback((fn) => {
    setStore(prev => {
      const next = fn(prev)
      try { window.localStorage.setItem(KEY, JSON.stringify(next)) } catch { /* private mode: session-only */ }
      return next
    })
  }, [])

  const toggleCheck = useCallback((id) => patch(s => {
    const checks = { ...(s.checks || {}) }
    if (checks[id]) delete checks[id]
    else checks[id] = dayKey()
    return { ...s, checks }
  }), [patch])

  const toggleHabitDay = useCallback((habitId, day) => patch(s => {
    const habits = { ...(s.habits || {}) }
    const days = { ...(habits[habitId] || {}) }
    if (days[day]) delete days[day]
    else days[day] = true
    habits[habitId] = days
    return { ...s, habits }
  }), [patch])

  const addCheckin = useCallback((phase, note) => patch(s => ({
    ...s,
    checkins: [...(s.checkins || []), { date: dayKey(), phase, note }],
  })), [patch])

  const setProfile = useCallback((phaseId, profileId) => patch(s => ({
    ...s,
    profiles: { ...(s.profiles || {}), [phaseId]: profileId },
  })), [patch])

  const setPace = useCallback((h) => patch(s => ({ ...s, pace: h })), [patch])

  return {
    checks: store.checks || {},
    habits: store.habits || {},
    checkins: store.checkins || [],
    profiles: store.profiles || {},
    pace: store.pace || 7,
    toggleCheck,
    toggleHabitDay,
    addCheckin,
    setProfile,
    setPace,
  }
}
