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
  assert.deepEqual(compare.map((g) => g.group), ["Capacity", "Retention automation", "In every plan"]);
  assert.equal(compare.at(-1).rows.length, included.length);
});

test("each card leads with what it's for and what it adds, not raw limits", () => {
  for (const p of plans) assert.ok(p.outcome && p.benefits?.length >= 1, p.id);
  assert.ok(!plans.some((p) => p.badge), "no capacity badge competing with the featured plan");
});

test("nothing is priced on revenue", () => {
  const text = JSON.stringify({ pricing, plans, definitions }).toLowerCase();
  assert.ok(!/per (mrr|arr)|% of|revenue band|mrr tier/.test(text));
});

test("every limit has a plain definition", () => {
  for (const k of Object.keys(limitLabels)) assert.ok(definitions.find((d) => d.k === k), k);
});

test("paid plans are live, and the headline is kept honest", () => {
  assert.equal(pricing.paidPlansLive, true);
  assert.match(pricing.promise, /MRR never changes your price/);
  assert.ok(plans.every((p) => p.outcome && p.outcome.length < 60), "each card leads with a short outcome");
});

test("the limit policy matches the app: nothing queued, nothing deleted, no overages", async () => {
  const { atLimit, atLimitShort, earlyAccess } = await import("../src/data/plans.mjs");
  const text = [...atLimit.keeps, ...atLimit.stops].join(" ").toLowerCase();
  for (const s of ["billing syncs", "aren't queued", "not sent later", "no overage charges", "nothing is deleted"]) assert.ok(text.includes(s), s);
  for (const s of ["refused", "skipped", "not queued or sent later", "1st", "no overage charges"]) assert.ok(atLimitShort.includes(s), s);
  assert.ok(!/\bpause/i.test(atLimitShort), "never say pause: nothing resumes or catches up");
  assert.match(earlyAccess, /at least 30 days/);
});
