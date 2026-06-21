// =====================================================================
// The reading room's morphology call — POST /v1/reading/analyze.
//
// The one network touch the folio makes. Coverage analysis lives on the backend
// (Kiwi runs there), so this is honest about needing it: when no backend is
// configured or the call fails, it returns { ok: false } and the folio shows
// "coverage needs the backend" rather than faking numbers.
// =====================================================================

import { api, API_ENABLED } from '../../api/client.js'

/**
 * Tokenize Korean text into morphemes via the backend.
 * @param {string} text
 * @returns {Promise<{ ok: true, tokens: object[] } | { ok: false, reason: 'offline' | 'error' }>}
 */
export async function analyzeText(text) {
  if (!API_ENABLED) return { ok: false, reason: 'offline' }
  try {
    const { data, error } = await api.POST('/v1/reading/analyze', { body: { text } })
    if (error || !data) return { ok: false, reason: 'error' }
    return { ok: true, tokens: data.tokens }
  } catch {
    return { ok: false, reason: 'error' }
  }
}
