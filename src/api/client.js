// =====================================================================
// The Polyglot's Atlas — backend API client (openapi-fetch)
//
// A typed client generated from the backend's committed OpenAPI contract
// (backend/openapi.json → schema.d.ts via `npm run gen:api`).
//
// The SPA reads the dictionary from the homelab API ONLY when a base URL is
// configured (VITE_API_URL); unset — the default — it uses the bundled local
// data. So nothing requires the backend to be up; the seam stays invisible.
// =====================================================================

import createClient from 'openapi-fetch'

// VITE_API_URL is undefined when unset, '' when set empty. The backend is used
// whenever it's DEFINED — including '' for same-origin (the container build
// sets it so the SPA calls the API it's served from); a full URL points at a
// separate origin (local dev against a backend, etc.). Unset → local-only, no
// network (static hosting / offline dev).
const apiBase = import.meta.env.VITE_API_URL

/** Whether to read the dictionary from the backend. */
export const API_ENABLED = apiBase !== undefined

/** @type {import('openapi-fetch').Client<import('./schema').paths>} */
export const api = createClient({ baseUrl: apiBase || '' })
