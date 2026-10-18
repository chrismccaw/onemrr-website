#!/usr/bin/env bash
# Upload dist/ to the site bucket and invalidate CloudFront. Used by .github/workflows/deploy.yml
# and runnable locally: SITE_BUCKET=… CLOUDFRONT_DISTRIBUTION_ID=… scripts/deploy.sh
set -euo pipefail
: "${SITE_BUCKET:?set SITE_BUCKET}"
: "${CLOUDFRONT_DISTRIBUTION_ID:?set CLOUDFRONT_DISTRIBUTION_ID}"
test -f dist/index.html || { echo "dist/ is missing; run pnpm build first" >&2; exit 1; }

# Fingerprinted assets never change, so they cache for a year.
aws s3 sync dist/_astro "s3://$SITE_BUCKET/_astro" --delete \
  --cache-control "public, max-age=31536000, immutable"

# Everything else (HTML, favicon, robots, sitemap) revalidates on every visit.
aws s3 sync dist "s3://$SITE_BUCKET" --delete --exclude "_astro/*" \
  --cache-control "public, max-age=0, must-revalidate"

aws cloudfront create-invalidation --distribution-id "$CLOUDFRONT_DISTRIBUTION_ID" --paths "/*" \
  --query 'Invalidation.Id' --output text
