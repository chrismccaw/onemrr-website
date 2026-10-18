/**
 * Synthetic demo data for the product demonstrations. "Pulse Tasks" and every customer here
 * are invented; nothing comes from a real workspace. Plans and prices follow the app's demo
 * generator (revspot/src/lib/demo/generate.ts), and the Churn Signals sentences follow the
 * wording of revspot/src/lib/churn/evaluate.ts. test/demo.test.mjs checks that the numbers
 * add up and that the signal sentences match the evaluator's arithmetic.
 */

export const workspace = { name: "Pulse Tasks", initial: "P", color: "#b04a26", asOf: "October 18, 2026" };

/** Month-end MRR in dollars, Nov 2025 → Oct 2026. */
export const mrrHistory = [33500, 34300, 35100, 36600, 37600, 39100, 41100, 42900, 44600, 46100, 46870, 48210];
export const mrrMonths = ["Nov", "Dec", "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct"];

export const sources = [
  { key: "stripe", name: "Stripe", badge: "S", mrr: 21460, delta: 820, history: [15200, 15600, 16000, 16700, 17100, 17800, 18600, 19300, 20000, 20400, 20640, 21460] },
  { key: "shopify", name: "Shopify", badge: "S", mrr: 15320, delta: 410, history: [10400, 10800, 11100, 11700, 12200, 12800, 13600, 14200, 14600, 14900, 14910, 15320] },
  { key: "wix", name: "Wix", badge: "W", mrr: 11430, delta: 110, estimated: true, history: [7900, 7900, 8000, 8200, 8300, 8500, 8900, 9400, 10000, 10800, 11320, 11430] },
];

export const mrr = 48210;
export const arr = mrr * 12;
export const previousMrr = 46870;

/** September → October MRR bridge. Customer lists are the largest movers of each kind. */
export const bridge = [
  {
    key: "new", label: "New", count: 23, amount: 2140,
    customers: [
      { name: "Atlas Labs", source: "stripe", plan: "Business, monthly", date: "Oct 4", amount: 349 },
      { name: "Cedar & Rye", source: "shopify", plan: "Pro, monthly", date: "Oct 9", amount: 99 },
      { name: "Orbit Supply", source: "stripe", plan: "Growth, monthly", date: "Oct 15", amount: 79 },
      { name: "Lighthouse Yoga", source: "wix", plan: "Premium, annual", date: "Oct 11", amount: 33 },
    ],
  },
  {
    key: "expansion", label: "Expansion", count: 9, amount: 610,
    customers: [
      { name: "Northwind Studio", source: "stripe", plan: "Growth → Pro", date: "Oct 2", amount: 70 },
      { name: "Tidewater Co", source: "shopify", plan: "Plus → Pro", date: "Oct 8", amount: 50 },
      { name: "Fernhill Events", source: "wix", plan: "Basic → Premium", date: "Oct 13", amount: 24 },
    ],
  },
  {
    key: "reactivation", label: "Reactivation", count: 3, amount: 180,
    customers: [
      { name: "Copper Kettle", source: "stripe", plan: "Growth, monthly", date: "Oct 6", amount: 79 },
      { name: "Juniper & Co", source: "shopify", plan: "Plus, monthly", date: "Oct 10", amount: 49 },
      { name: "Quarry Lane", source: "wix", plan: "Basic, monthly", date: "Oct 14", amount: 15 },
    ],
  },
  {
    key: "contraction", label: "Contraction", count: 4, amount: -240,
    customers: [
      { name: "Redwood Tickets", source: "stripe", plan: "Pro → Growth", date: "Oct 3", amount: -70 },
      { name: "Sable Studio", source: "shopify", plan: "Plus → Basic", date: "Oct 12", amount: -30 },
    ],
  },
  {
    key: "churn", label: "Churn", count: 17, amount: -1350,
    customers: [
      { name: "Pinecrest Media", source: "stripe", plan: "Pro, monthly", date: "Oct 5", amount: -149 },
      { name: "Lantern Goods", source: "shopify", plan: "Pro, monthly", date: "Oct 7", amount: -99 },
      { name: "Willow Fair", source: "wix", plan: "Pro, monthly", date: "Oct 9", amount: -79 },
      { name: "Bright Path", source: "stripe", plan: "Growth, monthly", date: "Oct 16", amount: -79 },
    ],
  },
];

/* ------------------------------------------------------------- Churn Signals */

/** Weekly key events for Bluebird Bakery, Aug 1 → Oct 17. The last two weeks fall. */
export const bluebirdWeeks = [31, 32, 30, 33, 29, 32, 31, 34, 30, 29, 9, 7];

/**
 * The decline rule's sentence, with the evaluator's arithmetic: rates per usage period over
 * the baseline and evaluation windows, and the drop between them.
 */
export function declineSentence({ baselineEvents, baselineDays, recentEvents, evaluationDays, periodDays, unit, baselineTo }) {
  const base = baselineEvents / baselineDays;
  const recent = recentEvents / evaluationDays;
  const dropPct = Math.round(Math.max(0, 1 - recent / base) * 100);
  const r1 = (n) => Math.round(n * 10) / 10;
  const text = `${r1(base * periodDays)} a ${unit} on average over the ${baselineDays} days to ${baselineTo}, ${r1(recent * periodDays)} a ${unit} in the ${evaluationDays} days since`;
  return { dropPct, sentence: `Key activity fell ${dropPct}%: ${text}.` };
}

/** The inactivity rule's sentence. Weekly pattern: quiet floor 14 days, gap multiplier 2. */
export function inactivitySentence({ quietDays, lastActive, usualGapDays, gapMultiplier = 2, quietFloor = 14 }) {
  const threshold = Math.max(quietFloor, Math.ceil(gapMultiplier * usualGapDays));
  return {
    threshold,
    flagged: quietDays >= threshold,
    sentence: `No key activity for ${quietDays} days, since ${lastActive}. This customer usually goes at most ${usualGapDays} days between active days, so OneMRR expected some within ${threshold} days.`,
  };
}

// Bluebird: weeks 3–10 are the 56-day baseline, weeks 11–12 the 14-day evaluation window.
export const bluebirdSignal = declineSentence({
  baselineEvents: bluebirdWeeks.slice(2, 10).reduce((a, b) => a + b, 0),
  baselineDays: 56,
  recentEvents: bluebirdWeeks.slice(10).reduce((a, b) => a + b, 0),
  evaluationDays: 14,
  periodDays: 7,
  unit: "week",
  baselineTo: "Oct 3",
});

export const harborSignal = inactivitySentence({ quietDays: 30, lastActive: "Sep 17", usualGapDays: 6 });

export const atRisk = [
  { name: "Bluebird Bakery", source: "stripe", plan: "Growth, monthly", mrr: 79, priority: "High", normal: "31 → 8 a week", last: "Yesterday", outreach: "—" },
  { name: "Harbor Fitness", source: "stripe", plan: "Pro, monthly", mrr: 149, priority: "Medium", normal: "Quiet 30 days", last: "Sep 17", outreach: "Replied" },
  { name: "Maple Fair", source: "stripe", plan: "Starter, monthly", mrr: 29, priority: "Low", normal: "Quiet this season", last: "Aug 9", outreach: "Draft ready" },
];

/* --------------------------------------------------------- Cancellation feedback */

export const reasons = [
  { label: "Missing features", n: 6 },
  { label: "Pricing", n: 5 },
  { label: "Low usage", n: 3 },
  { label: "Competitor", n: 2 },
];
export const funnel = [
  { label: "Sent", n: 41 },
  { label: "Delivered", n: 39 },
  { label: "Opened", n: 30 },
  { label: "Clicked", n: 19 },
  { label: "Answered", n: 16 },
];

/* ------------------------------------------------------------- Reconciliation */

export const recon = {
  source: "Stripe",
  onemrr: 21460,
  billed: 21612,
  rows: [
    { label: "Match exactly", customers: 271, diff: 0 },
    { label: "Billed, then cancelled or refunded", customers: 3, diff: 187 },
    { label: "Billed more than once", customers: 2, diff: 58 },
    { label: "Discounts, prorations or price changes", customers: 4, diff: -64 },
    { label: "Not in both", customers: 1, diff: -29 },
  ],
};

export const usd = (n, sign = false) => `${sign ? (n > 0 ? "+" : n < 0 ? "−" : "") : n < 0 ? "−" : ""}$${Math.abs(n).toLocaleString("en-US")}`;
