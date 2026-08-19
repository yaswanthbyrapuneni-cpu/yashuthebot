#!/usr/bin/env bash
# Post-deploy smoke test for the live stack.
#
#   ./scripts/smoke-test.sh                      # against https://www.lavix.in
#   BASE=https://staging.example.com ./scripts/smoke-test.sh
#
# Every bug this catches has actually happened in production:
#   - /tryon redirecting to the Docker container hostname
#   - try-on returning an HTML gateway error the frontend tried to JSON.parse
#   - the hero video downloading in full before playing (no faststart)
#   - /send-alert not routed to Flask, so no alert email ever sent
#   - the marketing site vanishing when its host paused the account

set -uo pipefail
BASE="${BASE:-https://www.lavix.in}"
CURL=(curl -sk --max-time 180)
PASS=0; FAIL=0

ok()   { printf '  \033[32mPASS\033[0m  %s\n' "$1"; PASS=$((PASS+1)); }
bad()  { printf '  \033[31mFAIL\033[0m  %s\n' "$1"; printf '        %s\n' "${2:-}"; FAIL=$((FAIL+1)); }
head_() { printf '\n\033[1m%s\033[0m\n' "$1"; }

head_ "Routing"

code=$("${CURL[@]}" -o /dev/null -w '%{http_code}' "$BASE/")
[ "$code" = "200" ] && ok "marketing site returns 200" || bad "marketing site" "got HTTP $code"

code=$("${CURL[@]}" -o /dev/null -w '%{http_code}' "$BASE/tryon/")
[ "$code" = "200" ] && ok "kiosk returns 200" || bad "kiosk" "got HTTP $code"

# The two apps must not be serving each other's HTML.
if "${CURL[@]}" "$BASE/" | grep -qi "Virtual Trial Room"; then
  ok "/ serves the marketing site"
else
  bad "/ content" "marketing markers missing"
fi
if "${CURL[@]}" "$BASE/tryon/" | grep -qi "Try-On Fashion Kiosk"; then
  ok "/tryon serves the kiosk"
else
  bad "/tryon content" "kiosk markers missing"
fi

# Regression: nginx built this from the proxied Host header and leaked the
# container name, so browsers got DNS_PROBE_FINISHED_NXDOMAIN.
loc=$("${CURL[@]}" -o /dev/null -D - "$BASE/tryon" | tr -d '\r' | awk 'tolower($1)=="location:"{print $2}')
case "$loc" in
  /tryon/)         ok "/tryon redirect is relative ($loc)" ;;
  *lavix-frontend*) bad "/tryon redirect" "leaks container hostname: $loc" ;;
  *)               bad "/tryon redirect" "unexpected Location: ${loc:-<none>}" ;;
esac

head_ "Backend"

"${CURL[@]}" "$BASE/health" | grep -q '"status": *"ok"' \
  && ok "/health" || bad "/health" "no ok status"

if "${CURL[@]}" "$BASE/garments" | head -c1 | grep -q '\['; then
  ok "/garments returns a JSON array"
else
  bad "/garments" "not a JSON array (HTML error page?)"
fi

# Was silently unrouted for a long time: alerts 404'd at the proxy.
if "${CURL[@]}" "$BASE/security-test" | grep -q smtp_configured; then
  ok "/security-test routed to Flask"
  "${CURL[@]}" "$BASE/security-test" | grep -q '"smtp_configured": *"\\u2705"' \
    && ok "SMTP credentials present" || bad "SMTP credentials" "not configured on the VM"
else
  bad "/security-test" "not routed to Flask -- check the nginx location regex"
fi

head_ "Media"

# Accept-Ranges is advertised on the full response, not echoed on a 206, so
# this has to be a HEAD without a Range header.
"${CURL[@]}" -I "$BASE/intro.mp4" | grep -qi "accept-ranges: bytes" \
  && ok "video advertises range support" || bad "video ranges" "no Accept-Ranges on HEAD"

# And confirm a range request is actually honoured.
code=$("${CURL[@]}" -o /dev/null -w '%{http_code}' -r 0-99 "$BASE/intro.mp4")
[ "$code" = "206" ] && ok "video serves partial content (206)" \
  || bad "video ranges" "range request returned HTTP $code, expected 206"

# moov must precede mdat or the browser downloads the whole file before playing.
if "${CURL[@]}" -r 0-1200 "$BASE/intro.mp4" | tr -c '[:print:]' '.' | grep -q moov; then
  ok "video is faststart (moov at front)"
else
  bad "video faststart" "moov not near the start -- it cannot stream"
fi

for asset in "/tryon/ad-poster.jpg" "/intro-poster.jpg" "/tryon/siren.mp3" "/favicon.ico"; do
  code=$("${CURL[@]}" -o /dev/null -w '%{http_code}' "$BASE$asset")
  [ "$code" = "200" ] && ok "$asset" || bad "$asset" "HTTP $code"
done

head_ "Try-on (real request)"

PNG='iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg=='
body=$(printf '{"person_image":"%s","garment_image":"%s"}' "$PNG" "$PNG")
start=$(date +%s)
resp=$("${CURL[@]}" -X POST -H 'Content-Type: application/json' -d "$body" "$BASE/try-on")
elapsed=$(( $(date +%s) - start ))

# The exact production failure: an HTML gateway page hitting JSON.parse.
if printf '%s' "$resp" | head -c1 | grep -q '{'; then
  ok "try-on returns JSON, not an HTML error page"
else
  bad "try-on response" "not JSON: $(printf '%s' "$resp" | head -c 120)"
fi

# Two separate concerns. The hard limit is the 150s worker timeout. The soft
# one caught a real regression: rembg downloading its 176MB model on the first
# request after every rebuild put the first customer at 130s, twenty seconds
# from a killed worker. A warm, healthy request is single-digit seconds.
if [ "$elapsed" -ge 140 ]; then
  bad "try-on duration" "${elapsed}s -- at the worker timeout, requests are being killed"
elif [ "$elapsed" -ge 60 ]; then
  bad "try-on duration" "${elapsed}s -- far above normal; is a model downloading on first use?"
else
  ok "try-on completed in ${elapsed}s"
fi

printf '%s' "$resp" | grep -q '"mode"' \
  && ok "response declares an engine mode" || bad "mode field" "missing -- UI cannot flag degraded output"

# The probe image is a 1x1 pixel, which Vertex legitimately rejects with a 400.
# That still proves reachability and working credentials, so only treat
# auth/quota/connectivity failures as real -- those are the ones that silently
# degrade every customer render to the flat compositor.
if printf '%s' "$resp" | grep -q '"mode": *"vertex"'; then
  ok "Vertex AI is the active engine"
else
  reason=$(printf '%s' "$resp" | sed -n 's/.*"fallback_reason": *"\([^"]*\)".*/\1/p')
  case "$reason" in
    *credentials*|*403*|*401*|*PERMISSION*|*quota*|*QUOTA*|*timed\ out*)
      bad "Vertex AI" "credential/quota/timeout failure -- all renders are degraded: $reason" ;;
    *400*)
      ok "Vertex AI reachable and authenticated (400 expected for the 1x1 probe)" ;;
    *)
      bad "Vertex AI" "unexpected fallback: ${reason:-unknown}" ;;
  esac
fi

# Malformed input must be refused, not echoed back as a successful render.
resp=$("${CURL[@]}" -X POST -H 'Content-Type: application/json' \
       -d '{"person_image":"@@@bad@@@","garment_image":"@@@bad@@@"}' "$BASE/try-on")
printf '%s' "$resp" | grep -q '"success": *false' \
  && ok "malformed input rejected" || bad "malformed input" "did not report failure"

printf '\n\033[1m%d passed, %d failed\033[0m\n' "$PASS" "$FAIL"
[ "$FAIL" -eq 0 ] || exit 1
