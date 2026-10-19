/**
 * The one place OneMRR's plans are defined. The homepage pricing section and /pricing both
 * read from here, so they can't drift apart. The app mirrors it in src/lib/billing/plans.ts
 * (a test there checks they match).
 *
 * Free is free forever with no card. Launch and Growth are monthly, bought in the app through
 * OneMRR's own Stripe account. `paidPlansLive` turns the paid CTAs into "Choose Launch/Growth"
 * once billing is switched on in the app (until then they start free; early-access workspaces
 * keep every feature). Never price on MRR or ARR.
 *
 * Counting rules, checked against chrismccaw/OneMRR:
 * - Billing connection = one syncing source on Connections. Each Stripe account, each Shopify app
 *   (Partner org + App ID), each Wix app, each Paddle account, each Lemon Squeezy store, each
 *   custom API source. Wix payout CSV uploads belong to their Wix source. A paused connection
 *   keeps its data and doesn't count.
 * - Tracked event = an accepted activity event (SDK, API or browser ping). Retries with the same
 *   event ID count once; rejected events don't count. Past the allowance, new events are refused
 *   with a plan_limit error until the monthly (UTC) reset; billing syncs never stop.
 * - Churn Signals rule = a rule turned on. "Unlimited" is fair use, with a safety limit of 50.
 * - Retention email = a customer-facing retention check-in or cancellation survey email sent
 *   automatically or after approving a draft. Not replies, digests, recaps, alerts or tests.
 */

export const fmt = (n) => (n >= 1_000_000 && n % 1_000_000 === 0 ? `${n / 1_000_000}M` : n.toLocaleString("en-US"));

export const pricing = {
  paidPlansLive: false,
  currency: "USD",
  cadence: "month",
  headline: "Your revenue grows. Your bill doesn't.",
  lede: "Start tracking your recurring revenue for free. Upgrade when you're ready to automate retention and grow your business.",
};

/** Paid capabilities, in the app's terms (src/lib/billing/plans.ts FEATURES). */
const PAID = { cancellationSurveys: true, brandedEmail: true, retentionEmails: true, retentionInbox: true };

export const plans = [
  {
    id: "free",
    name: "Free",
    price: 0,
    audience: "For developers getting started.",
    cta: "Get started free",
    limits: { connections: 2, events: 10_000, rules: 1, emails: 0 },
    features: { cancellationSurveys: false, brandedEmail: false, retentionEmails: false, retentionInbox: false },
  },
  {
    id: "launch",
    name: "Launch",
    price: 29,
    audience: "For growing SaaS founders.",
    cta: "Choose Launch",
    limits: { connections: 5, events: 100_000, rules: null, emails: 500 },
    features: PAID,
  },
  {
    id: "growth",
    name: "Growth",
    price: 79,
    audience: "For businesses managing more connections and activity.",
    badge: "More capacity",
    cta: "Choose Growth",
    limits: { connections: 20, events: 1_000_000, rules: null, emails: 3_000 },
    features: PAID,
  },
];

/** In every plan, Free included. Accurate analytics and your own data are never held back. */
export const included = [
  "MRR, ARR, growth and churn analytics",
  "Revenue movements",
  "Customer reporting and history",
  "Reconciliation",
  "Customer and revenue CSV export",
  "At-risk customer reporting",
  "Full API access",
  "Team members with owner, admin and member roles",
  "No MRR or ARR limit",
];

/** Rows for the comparison table: capacity first, then what Launch adds, then what every plan has. */
export const compare = [
  { label: "Billing connections", values: plans.map((p) => fmt(p.limits.connections)) },
  { label: "Tracked activity events / month", values: plans.map((p) => fmt(p.limits.events)) },
  { label: "Enabled Churn Signals rules", values: plans.map((p) => (p.limits.rules === null ? "Unlimited*" : fmt(p.limits.rules))) },
  { label: "Automated retention emails / month", values: plans.map((p) => (p.limits.emails ? fmt(p.limits.emails) : false)) },
  { label: "Cancellation feedback surveys", values: plans.map((p) => p.features.cancellationSurveys) },
  { label: "Branded email customization", values: plans.map((p) => p.features.brandedEmail) },
  { label: "Two-way retention inbox", values: plans.map((p) => p.features.retentionInbox) },
  ...included.map((label) => ({ label, values: plans.map(() => true) })),
];

export const limitLabels = {
  connections: { label: "Billing connections", unit: (n) => `${fmt(n)} billing connections` },
  events: { label: "Tracked events per month", unit: (n) => `${fmt(n)} tracked events / month` },
  rules: { label: "Churn Signals rules", unit: (n) => (n === null ? "Unlimited Churn Signals rules*" : `${fmt(n)} Churn Signals rule${n === 1 ? "" : "s"}`) },
  emails: { label: "Retention emails per month", unit: (n) => (n ? `${fmt(n)} automated retention emails / month` : "At-risk reporting, no automated emails") },
};

/** One sentence for under the cards; the full list is the comparison table on /pricing. */
export const includedSummary = "unified MRR and ARR, revenue movements, customer reporting, reconciliation, CSV exports, at-risk reporting and the full API, with no cap on how much MRR you track";

/** Plain definitions shown under the cards and on /pricing. */
export const definitions = [
  {
    k: "connections",
    t: "Billing connection",
    d: "One account connected on the Connections screen: a Stripe account, a Shopify app, a Wix app, a Paddle account, a Lemon Squeezy store, or a custom API source. Each Shopify or Wix app counts once, even if they share a Partner account. Wix payout uploads belong to their Wix connection, so they never add connections.",
  },
  {
    k: "events",
    t: "Tracked event",
    d: "A product activity event your app sends for Churn Signals, through the SDK, the API or a browser ping. Retries of the same event count once. It has nothing to do with how many subscriptions, customers or revenue you track.",
  },
  {
    k: "rules",
    t: "Churn Signals rule",
    d: "A rule that watches product activity for customers at risk, such as key activity stopping or dropping. Free includes one enabled rule. *Unlimited on Launch and Growth means fair use, with a technical safety limit of 50 enabled rules.",
  },
  {
    k: "emails",
    t: "Retention email",
    d: "An email sent to one of your customers by a retention or cancellation workflow, whether it goes automatically or after you approve a draft. Customer replies, your answers to them, digests, daily recaps, alerts and test emails don't count.",
  },
];
