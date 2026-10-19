/**
 * The one place OneMRR's plans are defined. The homepage pricing section and /pricing both
 * read from here, so they can't drift apart.
 *
 * Status (October 2026): paid plans are NOT live. The app has no OneMRR subscription billing,
 * no Stripe prices and no limit enforcement yet, so every plan shows as the price "after early
 * access" and every CTA goes to the free early-access signup. When billing ships, set
 * `paidPlansLive` to true, add the real Stripe price IDs to the app (never here), and point the
 * CTAs at checkout.
 *
 * Counting rules, checked against chrismccaw/OneMRR:
 * - Billing connection = one source on Connections. Each Stripe account, each Shopify app (a
 *   source is one Partner org + one App ID), each Wix app, each Paddle account, each Lemon
 *   Squeezy store, each custom API source. Wix payout CSV uploads belong to their Wix source.
 * - Tracked event = an accepted activity event (SDK, API or browser ping). Retries with the
 *   same event ID count once (activity_ingest_daily.duplicates); rejected events don't count.
 * - Retention email = a customer-facing retention check-in or cancellation survey email sent
 *   from a workflow, automatically or after approving a draft (recovery_sends). Not replies,
 *   digests, recaps, alerts or test sends.
 */
export const pricing = {
  paidPlansLive: false,
  currency: "USD",
  cadence: "month",
  headline: "Your revenue grows. Your bill doesn't.",
  lede: "Revenue analytics, churn detection and automated recovery. Simple pricing based on what you use, not how much you earn.",
};

export const plans = [
  {
    id: "launch",
    name: "Launch",
    price: 29,
    audience: "For independent developers and growing SaaS founders.",
    limits: { connections: 5, events: 100_000, emails: 500 },
  },
  {
    id: "growth",
    name: "Growth",
    price: 79,
    audience: "For developers running multiple apps and higher activity volumes.",
    badge: "More capacity",
    limits: { connections: 20, events: 1_000_000, emails: 3_000 },
  },
];

/** Included in every plan. The upgrade buys capacity, never core features. */
export const included = [
  "Revenue analytics: MRR, ARR, growth, churn and retention",
  "Revenue movements and reconciliation",
  "Customer history, cohorts and insights",
  "Churn Signals",
  "Cancellation feedback surveys",
  "Automated or approved retention emails",
  "Two-way customer replies",
  "Public API",
  "Team members with owner, admin and member roles",
];

export const limitLabels = {
  connections: { label: "Billing connections", unit: (n) => `${n} billing connections` },
  events: { label: "Tracked events per month", unit: (n) => `${fmt(n)} tracked events / month` },
  emails: { label: "Retention emails per month", unit: (n) => `${fmt(n)} retention emails / month` },
};

/** One sentence for under the cards; the full list is the comparison table on /pricing. */
export const includedSummary = "revenue analytics and reconciliation, Churn Signals, cancellation surveys, retention emails with two-way replies, the API and team roles";

/** Plain definitions shown under the cards and on /pricing. */
export const definitions = [
  {
    k: "connections",
    t: "Billing connection",
    d: "One account connected on the Connections screen: a Stripe account, a Shopify app, a Wix app, a Paddle account, a Lemon Squeezy store, or a custom API source. Each Shopify or Wix app counts once, even if they share a Partner account. Wix payout uploads belong to their Wix connection.",
  },
  {
    k: "events",
    t: "Tracked event",
    d: "A product activity event your app sends for Churn Signals, through the SDK, the API or a browser ping. Retries of the same event count once. It has nothing to do with how many subscriptions, customers or revenue you track.",
  },
  {
    k: "emails",
    t: "Retention email",
    d: "An email sent to one of your customers by a retention or cancellation workflow, whether it goes automatically or after you approve a draft. Customer replies, your answers to them, digests, daily recaps, alerts and test emails don't count.",
  },
];

export const fmt = (n) => (n >= 1_000_000 && n % 1_000_000 === 0 ? `${n / 1_000_000}M` : n.toLocaleString("en-US"));
