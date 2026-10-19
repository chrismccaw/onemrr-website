import { test } from "node:test";
import assert from "node:assert/strict";
import { pricing, plans, included, compare, definitions, limitLabels } from "../src/data/plans.mjs";

test("Free, Launch and Growth, monthly only", () => {
  assert.deepEqual(plans.map((p) => p.id), ["free", "launch", "growth"]);
  assert.deepEqual(plans.map((p) => p.price), [0, 29, 79]);
  assert.equal(pricing.cadence, "month");
});

test("each plan adds capacity over the one before", () => {
  for (const k of ["connections", "events", "emails"]) {
    assert.ok(plans[1].limits[k] > plans[0].limits[k], k);
    assert.ok(plans[2].limits[k] > plans[1].limits[k], k);
  }
  assert.equal(plans[0].limits.rules, 1);
  assert.ok(plans.slice(1).every((p) => p.limits.rules === null), "paid plans: unlimited rules (fair use)");
  assert.ok(!plans.some((p) => p.badge === "Most popular"), "no popularity claims without evidence");
});

test("Free is genuinely useful: analytics, exports and the API are in every plan", () => {
  for (const f of ["MRR, ARR, growth and churn analytics", "Customer and revenue CSV export", "Full API access", "At-risk customer reporting", "No MRR or ARR limit"]) assert.ok(included.includes(f), f);
});

test("paid plans add retention automation, Free doesn't sell it", () => {
  assert.ok(Object.values(plans[0].features).every((v) => v === false));
  assert.ok(plans.slice(1).every((p) => Object.values(p.features).every(Boolean)));
  assert.equal(plans[0].limits.emails, 0);
  assert.equal(compare.length, 7 + included.length);
});

test("nothing is priced on revenue", () => {
  const text = JSON.stringify({ pricing, plans, definitions }).toLowerCase();
  assert.ok(!/per (mrr|arr)|% of|revenue band|mrr tier/.test(text));
});

test("every limit has a plain definition", () => {
  for (const k of Object.keys(limitLabels)) assert.ok(definitions.find((d) => d.k === k), k);
});

test("paid CTAs stay on free signup until billing is live", () => {
  assert.equal(pricing.paidPlansLive, false);
});
