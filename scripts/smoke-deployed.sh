#!/usr/bin/env bash
# Post-deploy smoke for polyglot-atlas. ~10 checks against a running instance.
#   ./scripts/smoke-deployed.sh                                   # dev (default)
#   TARGET=https://polyglot-atlas.app.bittern-chameleon.dev ./scripts/smoke-deployed.sh

set -uo pipefail
TARGET="${TARGET:-https://polyglot-atlas-dev.app.bittern-chameleon.dev}"
CURL=(curl -fsS --max-time 15)

PASS=0; FAIL=0
red() { printf '\033[0;31m%s\033[0m' "$*"; }
grn() { printf '\033[0;32m%s\033[0m' "$*"; }
ok()  { PASS=$((PASS+1)); printf '  %s %s\n' "$(grn '✓')" "$*"; }
bad() { FAIL=$((FAIL+1)); printf '  %s %s\n' "$(red '✗')" "$*"; }

echo "smoke → $TARGET"

# liveness / readiness
"${CURL[@]}" "$TARGET/healthz" | grep -q '"status":"ok"' && ok "healthz ok" || bad "healthz"
"${CURL[@]}" "$TARGET/readyz"  | grep -q '"status":"ready"' && ok "readyz (db) ok" || bad "readyz"

# SPA same-origin: root + a deep route serve HTML
ct=$(curl -fsS -o /dev/null -w '%{content_type}' "$TARGET/" 2>/dev/null)
[[ "$ct" == text/html* ]] && ok "/ serves SPA (text/html)" || bad "/ content-type: $ct"
curl -fsS "$TARGET/ko/vocab" 2>/dev/null | grep -qi '<!doctype html' && ok "/ko/vocab → index.html" || bad "deep SPA route"

# API: the dictionary slice
count=$("${CURL[@]}" "$TARGET/v1/dictionary/ko" 2>/dev/null \
        | python3 -c "import sys,json;print(json.load(sys.stdin).get('count',0))" 2>/dev/null)
[[ "${count:-0}" -gt 0 ]] && ok "/v1/dictionary/ko → $count entries" || bad "dictionary slice empty"
"${CURL[@]}" "$TARGET/v1/dictionary/ko/hakgyo" 2>/dev/null | grep -q '"head"' && ok "single entry ok" || bad "single entry"

# API 404 must stay problem+json (not absorbed by the SPA fallback)
ct=$(curl -s -o /dev/null -w '%{content_type}' "$TARGET/v1/dictionary/ko/__nope__" 2>/dev/null)
[[ "$ct" == application/problem+json* ]] && ok "API 404 is problem+json" || bad "API 404 content-type: $ct"

echo
if (( FAIL == 0 )); then
    printf '%s  %d checks passed\n' "$(grn 'SMOKE PASS:')" "$PASS"; exit 0
else
    printf '%s  %d failed / %d total\n' "$(red 'SMOKE FAIL:')" "$FAIL" "$((PASS+FAIL))"; exit 1
fi
