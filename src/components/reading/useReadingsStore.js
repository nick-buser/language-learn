import { useCallback, useState } from 'react'

// =====================================================================
// The reading room's shelf — imported passages, kept per device.
//
// localStorage-first pilot (atlas.ko.readings.v1), the same idiom as
// useVocabStore. Each record is a Reading (see src/data/koreanReadings.js):
// title + raw text + cached morphology tokens (so reopening skips the backend)
// + an informational coverage snapshot. This shape is the contract for the
// future /v1/readings resource + Garage blob store (vocabulary-plan phase 4).
//
// Per-word known/target state is NOT here — that lives in useVocabStore and
// already persists to the backend. The shelf only holds the texts.
// =====================================================================

const KEY = 'atlas.ko.readings.v1'

function load() {
  if (typeof window === 'undefined') return {}
  try {
    return JSON.parse(window.localStorage.getItem(KEY)) || {}
  } catch {
    return {}
  }
}

let _seq = 0
function newId() {
  return 'r' + Date.now().toString(36) + (_seq++).toString(36)
}

export default function useReadingsStore() {
  const [store, setStore] = useState(load)

  const patch = useCallback((fn) => {
    setStore((prev) => {
      const next = fn(prev)
      try { window.localStorage.setItem(KEY, JSON.stringify(next)) } catch { /* private mode: session-only */ }
      return next
    })
  }, [])

  // Insert or update a reading; returns the saved record (with its id).
  const put = useCallback((reading) => {
    const id = reading.id || newId()
    const rec = { ...reading, id, importedAt: reading.importedAt || new Date().toISOString() }
    patch((s) => ({ ...s, readings: { ...(s.readings || {}), [id]: rec } }))
    return rec
  }, [patch])

  const remove = useCallback((id) => {
    patch((s) => {
      const all = { ...(s.readings || {}) }
      delete all[id]
      return { ...s, readings: all }
    })
  }, [patch])

  const readings = store.readings || {}
  // newest first
  const list = Object.values(readings).sort((a, b) =>
    (b.importedAt || '').localeCompare(a.importedAt || '')
  )

  return { readings, list, put, remove }
}
