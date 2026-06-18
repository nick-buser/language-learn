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

const baseUrl = import.meta.env.VITE_API_URL

/** Whether a backend base URL is configured. */
export const API_ENABLED = Boolean(baseUrl)

/** @type {import('openapi-fetch').Client<import('./schema').paths>} */
export const api = createClient({ baseUrl: baseUrl || '/' })
