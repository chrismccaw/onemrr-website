/**
 * The one place OneMRR's plans are defined. The homepage pricing section and /pricing both
 * read from here, so they can't drift apart. The app mirrors it in src/lib/billing/plans.ts
 * (a test there checks they match).
 *
 * Free is free forever with no card. Launch and Growth are monthly, bought in the app through
 * OneMRR's own Stripe account (live since October 19, 2026). `paidPlansLive` makes the paid CTAs
 * "Choose Launch/Growth" (signup, then billing with that plan picked). Never price on MRR or ARR.
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
  paidPlansLive: true,
  currency: "USD",
  cadence: "month",
  headline: "Your revenue grows. Your bill doesn't.",
  lede: "Start tracking your recurring revenue for free. Upgrade when you're ready to automate retention and grow your business.",
  /** Keeps the headline honest: MRR never moves the price; capacity can. */
  promise: "Growing MRR never changes your price. You'd only move up a plan for more connections, tracked events or retention emails.",
};

/**
 * What happens at a limit, exactly as the app does it (revspot src/lib/billing/gates.ts). Don't
 * promise queued events or automatic catch-up: refused events and skipped emails aren't retried.
 */
export const atLimit = {
  keeps: [
    "Revenue analytics, billing syncs and every report keep running. Customers, history and past events stay available, and nothing is deleted.",
    "You're warned in the app at 80%, and owners get an email when a limit is reached.",
    "There are no overage charges. Upgrading lifts the limit straight away.",
  ],
  stops: [
    "New tracked events are refused with a clear error your SDK reports. They aren't queued; events your app sends again after the reset are counted.",
    "Due retention emails are skipped and logged, not sent later. Drafts stay ready to send.",
    "Adding a billing connection needs a free slot: pause or remove one, or upgrade.",
  ],
};

/** The same policy in one line, for the homepage FAQ. Must agree with `atLimit`. */
export const atLimitShort =
  "Billing syncs and your reports keep running and nothing is deleted. New tracked events are refused and due retention emails are skipped (not queued or sent later) until the allowance resets on the 1st, or until you upgrade, which lifts the limit straight away. There are no overage charges.";

/** One consistent early-access message for the site. */
export const earlyAccess =
  "Workspaces created during early access keep their current access, with no limits, until we move them to the new plans. We'll email owners at least 30 days before, and nobody is charged without choosing a paid plan.";

/** Paid capabilities, in the app's terms (src/lib/billing/plans.ts FEATURES). */
const PAID = { cancellationSurveys: true, brandedEmail: true, retentionEmails: true, retentionInbox: true };

export const plans = [
  {
    id: "free",
    name: "Free",
    price: 0,
    outcome: "Understand your recurring revenue across platforms.",
    benefits: ["Unified MRR, ARR and churn, with exports and the full API", "At-risk customers and the MRR behind them"],
    cta: "Get started free",
    limits: { connections: 2, events: 10_000, rules: 1, emails: 0 },
    features: { cancellationSurveys: false, brandedEmail: false, retentionEmails: false, retentionInbox: false },
  },
  {
    id: "launch",
    name: "Launch",
    price: 29,
    outcome: "Turn revenue insights into retention actions.",
    benefits: ["Branded retention emails, automatic or approved by you", "Cancellation surveys and a two-way inbox"],
    cta: "Choose Launch",
    limits: { connections: 5, events: 100_000, rules: null, emails: 500 },
    features: PAID,
  },
  {
    id: "growth",
    name: "Growth",
    price: 79,
    outcome: "All the tools you need, with more room to scale.",
    benefits: ["Everything in Launch", "4× the connections, 10× the events and 6× the emails"],
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

/** The comparison table, in three groups: capacity, what paid plans add, what every plan has. */
export const compare = [
  {
    group: "Capacity",
    rows: [
      { label: "Billing connections", values: plans.map((p) => fmt(p.limits.connections)) },
      { label: "Tracked activity events / month", values: plans.map((p) => fmt(p.limits.events)) },
      { label: "Enabled Churn Signals rules", values: plans.map((p) => (p.limits.rules === null ? "Unlimited*" : fmt(p.limits.rules))) },
      { label: "Automated retention emails / month", values: plans.map((p) => (p.limits.emails ? fmt(p.limits.emails) : false)) },
    ],
  },
  {
    group: "Retention automation",
    rows: [
      { label: "Cancellation feedback surveys", values: plans.map((p) => p.features.cancellationSurveys) },
      { label: "Branded email customization", values: plans.map((p) => p.features.brandedEmail) },
      { label: "Two-way retention inbox", values: plans.map((p) => p.features.retentionInbox) },
    ],
  },
  { group: "In every plan", rows: included.map((label) => ({ label, values: plans.map(() => true) })) },
];

export const limitLabels = {
  connections: { label: "Billing connections", unit: (n) => `${fmt(n)} billing connections` },
  events: { label: "Tracked events per month", unit: (n) => `${fmt(n)} tracked events / month` },
  rules: { label: "Churn Signals rules", unit: (n) => (n === null ? "Unlimited Churn Signals rules (fair use)" : `${fmt(n)} Churn Signals rule${n === 1 ? "" : "s"}`) },
  emails: { label: "Retention emails per month", unit: (n) => (n ? `${fmt(n)} automated retention emails / month` : "No automated retention emails") },
};

/** One sentence for under the cards; the full list is the comparison table on /pricing. */
export const includedSummary = "unified MRR and ARR, revenue movements, customer reporting, reconciliation, CSV exports, at-risk reporting and the full API, with no cap on how much MRR you track.";

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
