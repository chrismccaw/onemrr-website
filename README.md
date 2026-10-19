# onemrr-website

The marketing site for [OneMRR](https://onemrr.dev): one dashboard for MRR, ARR and churn across billing platforms, with Churn Signals, retention email and cancellation feedback. The app itself lives at app.onemrr.dev (repo `chrismccaw/OneMRR`).

Static [Astro](https://astro.build) site, no client framework, no cookies and no trackers. Served from a private S3 bucket through CloudFront.

## Develop

```bash
pnpm install
pnpm dev          # http://localhost:4321
pnpm test         # demo data adds up; signal sentences match the app's evaluator
pnpm check        # Astro and TypeScript
pnpm build        # dist/
pnpm og           # re-render public/og.png from scripts/og.html (needs Chrome)
```

## Product demonstrations

The dark panels are hand-built replicas of the app's screens (Overview, MRR bridge, Churn → At risk, Automations, Cancellation feedback, Reconciliation), using the app's dark tokens, labels and copy. All data is synthetic, from `src/data/demo.mjs`: a made-up company, "Pulse Tasks", and made-up customers. Never put real workspace data here.

- **Hero**: a 10-second CSS loop. It opens on a finished frame and stays there with reduced motion.
- **Churn Signals**: six steps that auto-advance while on screen, can be clicked, and pause. With reduced motion it shows the last step. The signal sentences use the same arithmetic as `revspot/src/lib/churn/evaluate.ts`, and `test/demo.test.mjs` checks them.
- **Cancellation feedback**: four frames light up in turn once, the first time they scroll into view.

## Claims

Every product claim was checked against the app's code (October 2026). Keep these limits in the copy:

- Paddle and Lemon Squeezy are **beta**. Wix MRR is **estimated** from payout exports.
- Churn Signals compares each customer with their own history. It is not a prediction, and priority is not a probability. Don't say "AI" or "predict".
- Automatic retention emails are off by default, never retroactive, and rechecked before each send.
- Automatic cancellation follow-ups need a **confirmed cancellation and the customer's email**. Stripe provides both; Shopify needs emails added through the API's customer endpoint; Wix cancellations are inferred, so Wix uses the survey link. Activity (retention) follow-ups need a customer email from billing or from `identify`. Don't merge the two.
- Pricing lives in `src/data/plans.mjs` (homepage, /pricing and structured data read it; the app mirrors it in `src/lib/billing/plans.ts` and a test there checks they match): Free ($0 forever, no card), Launch $29 and Growth $79 a month, priced by capacity, never by MRR or ARR. Paid plans are live (`paidPlansLive: true`). What happens at a limit (`atLimit`) and the early-access message (`earlyAccess`) must match the app: refused events and skipped emails aren't queued, nothing is deleted, no overage charges. Don't add trials, annual prices, grandfathering or an early-access end date without an explicit decision.
- No testimonials, customer counts or recovery rates until they exist.

## Pages

| Route | Purpose |
|---|---|
| `/` | The story: one MRR, what's changing, Churn Signals (3 steps), follow-up, trust and pricing, founder, FAQ |
| `/churn-signals` | Full six-step demo, detection rules, automation settings, cancellation feedback, setup and reporting |
| `/integrations` | What each billing platform supports, honestly |
| `/pricing` | Free, Launch and Growth: comparison, what counts, what happens at a limit, pricing questions |
| `/security` | Verified data-handling properties only |
| `/docs` | Quickstart, connections, how the numbers work, Churn Signals and cancellation setup |

`pnpm check:links` (also in CI) fails the build on any broken internal link or anchor.

## Launch blockers

- **Have the Privacy Policy and Terms reviewed by a lawyer**, especially liability, indemnity and governing law (California, San Diego County). Both were updated for paid plans and Stripe on October 19, 2026 (Terms sections 1–2, Privacy providers); include the billing terms in that review, and decide whether to offer refunds (none are promised).

- **Production outreach is allowlisted.** `ONEMRR_OUTREACH_ALLOWLIST` is set on the app, so retention and cancellation emails only reach listed addresses. The site describes automatic follow-ups; lift the allowlist (or say "coming soon") before promoting them.

## Infrastructure

One CloudFormation stack, `onemrr-website`, in **us-east-1** (account 387748308477), from [infra/website.yml](infra/website.yml): an S3 bucket, CloudFront (OAC, HTTP/3, security headers), an ACM certificate for onemrr.dev and www, a viewer-request function (www → apex 301, directory index pages), Route 53 aliases in the existing onemrr.dev zone (registered through Route 53; it also holds app.onemrr.dev and the email records), and a GitHub OIDC deploy role.

`https://onemrr.dev` is canonical. `www.onemrr.dev` redirects there with a 301. Plain `http://` never reaches the site, because `.dev` is HSTS-preloaded in every browser, and CloudFront redirects it to HTTPS anyway.

```bash
aws cloudformation deploy --region us-east-1 --stack-name onemrr-website \
  --template-file infra/website.yml --capabilities CAPABILITY_NAMED_IAM
```

## Deploys

Pushing to `main` runs [deploy.yml](.github/workflows/deploy.yml): tests, type check and build ([ci.yml](.github/workflows/ci.yml), which also runs on pull requests), then upload to S3, a CloudFront invalidation and a smoke test ([scripts/smoke.sh](scripts/smoke.sh)) covering the homepage, the 404 page, headers and the www redirect. AWS access goes through GitHub OIDC, with no stored keys. It needs the `production` environment and these repository variables, all taken from the stack outputs: `AWS_DEPLOY_ROLE_ARN`, `SITE_BUCKET`, `CLOUDFRONT_DISTRIBUTION_ID` and `SITE_URL`.

Fingerprinted files in `_astro/` are cached for a year. HTML revalidates on every visit.
