#!/usr/bin/env bash
# Fast (<2s) sanity for .woodpecker.yml — catches the 1-second-fixable
# failures that otherwise burn a full Woodpecker cycle. Adapted from the
# homelab python-fastapi-vite template to this repo (uv project lives in
# backend/, so YAML parsing uses an ephemeral `uv run --with pyyaml`).
#
#   ./scripts/ci-precheck.sh                 # offline
#   WP_TOKEN=$(...) ./scripts/ci-precheck.sh # also probe secret existence

set -uo pipefail
cd "$(dirname "$0")/.."

YAML_FILE="${YAML_FILE:-.woodpecker.yml}"
WP_URL="${WP_URL:-https://ci.lab}"
WP_TOKEN="${WP_TOKEN:-}"
PY="uv run --quiet --with pyyaml python"

PASS=0; FAIL=0
red() { printf '\033[0;31m%s\033[0m' "$*"; }
grn() { printf '\033[0;32m%s\033[0m' "$*"; }
ylw() { printf '\033[0;33m%s\033[0m' "$*"; }
ok()   { PASS=$((PASS+1)); printf '  %s %s\n' "$(grn '✓')" "$*"; }
bad()  { FAIL=$((FAIL+1)); printf '  %s %s\n' "$(red '✗')" "$*"; }
skip() {                   printf '  %s %s\n' "$(ylw '○')" "$*"; }

echo "$(grn parse:)"
[[ -f "$YAML_FILE" ]] || { bad "$YAML_FILE not found"; exit 1; }
$PY -c "import yaml; yaml.safe_load(open('$YAML_FILE'))" 2>/dev/null \
    || { bad "$YAML_FILE invalid YAML"; exit 1; }
ok "$YAML_FILE parses"

echo "$(grn syntax:)"
grep -nE '^[[:space:]]*secrets:[[:space:]]*\[' "$YAML_FILE" >/dev/null 2>&1 \
    && bad "v2 \`secrets: [...]\` syntax (use environment.VAR.from_secret)" \
    || ok "no v2 \`secrets: [...]\` syntax"

echo "$(grn images:)"
grep -nE 'image:[[:space:]]*woodpeckerci/plugin-docker:' "$YAML_FILE" >/dev/null 2>&1 \
    && bad "deprecated woodpeckerci/plugin-docker (use plugin-docker-buildx)" \
    || ok "no deprecated plugin-docker references"

echo "$(grn secrets:)"
REFS=$($PY -c "
import yaml
d=yaml.safe_load(open('$YAML_FILE'))
seen=set()
def walk(n):
    if isinstance(n,dict):
        if 'from_secret' in n and isinstance(n['from_secret'],str): seen.add(n['from_secret'])
        for v in n.values(): walk(v)
    elif isinstance(n,list):
        for v in n: walk(v)
walk(d)
print('\n'.join(sorted(seen)))")
if [[ -z "$WP_TOKEN" ]]; then
    skip "WP_TOKEN unset — skipping live probe"
    [[ -n "$REFS" ]] && echo "    secrets referenced: $(echo "$REFS" | tr '\n' ' ')"
else
    HAVE=$(curl -fsSL -H "Authorization: Bearer $WP_TOKEN" "$WP_URL/api/secrets" 2>/dev/null \
            | $PY -c "import json,sys;[print(s['name']) for s in json.load(sys.stdin)]" | sort -u)
    MISSING=""
    for n in $REFS; do echo "$HAVE" | grep -qx "$n" || MISSING="$MISSING $n"; done
    [[ -n "$MISSING" ]] && bad "missing on $WP_URL:$MISSING" || ok "all referenced secrets exist"
fi

echo "$(grn deploy-target:)"
if [[ -f .deploy-target ]]; then
    $PY -c "
import yaml, sys
d=yaml.safe_load(open('.deploy-target')) or {}
errs=[]
for env,cfg in d.items():
    if not isinstance(cfg,dict): errs.append(f'{env}: not a dict')
    elif 'app' not in cfg: errs.append(f'{env}: missing app')
sys.exit(0 if not errs else 1)" \
        && ok ".deploy-target shape OK" || bad ".deploy-target malformed"
else
    skip "no .deploy-target"
fi

echo
if (( FAIL == 0 )); then
    printf '%s  %d checks passed\n' "$(grn 'PRECHECK PASS:')" "$PASS"; exit 0
else
    printf '%s  %d failed / %d total\n' "$(red 'PRECHECK FAIL:')" "$FAIL" "$((PASS+FAIL))"; exit 1
fi
