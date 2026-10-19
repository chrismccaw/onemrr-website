#!/usr/bin/env bash
# Checks a deployed site: the homepage, the 404 page, security headers, and (for the real
# domain) that http and www both redirect to https://onemrr.dev.
set -euo pipefail
URL="${1:-https://onemrr.dev}"
fail() { echo "FAIL: $*" >&2; exit 1; }

code=$(curl -s -o /tmp/home.html -w '%{http_code}' "$URL/")
[ "$code" = 200 ] || fail "$URL/ returned $code"
grep -q "Know your revenue" /tmp/home.html || fail "homepage content missing"

for page in pricing churn-signals integrations security docs privacy terms sitemap.xml; do
  code=$(curl -s -o /dev/null -w '%{http_code}' "$URL/$page")
  [ "$code" = 200 ] || fail "$URL/$page returned $code"
done

code=$(curl -s -o /dev/null -w '%{http_code}' "$URL/no-such-page")
[ "$code" = 404 ] || fail "missing page returned $code, expected 404"

headers=$(curl -sI "$URL/")
for h in strict-transport-security content-security-policy x-content-type-options; do
  grep -qi "^$h:" <<<"$headers" || fail "missing header $h"
done

if [ "$URL" = "https://onemrr.dev" ]; then
  for from in http://onemrr.dev/ https://www.onemrr.dev/ http://www.onemrr.dev/; do
    final=$(curl -sL -o /dev/null -w '%{url_effective}' "$from")
    [ "$final" = "https://onemrr.dev/" ] || fail "$from ended at $final"
  done
  loc=$(curl -sI "https://www.onemrr.dev/faq?x=1" | awk 'tolower($1)=="location:"{print $2}' | tr -d '\r')
  [ "$loc" = "https://onemrr.dev/faq?x=1" ] || fail "www redirect kept path wrong: $loc"
fi
echo "OK: $URL"
