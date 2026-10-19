import { test } from "node:test";
import assert from "node:assert/strict";
import { pricing, plans, included, definitions, limitLabels } from "../src/data/plans.mjs";

test("two plans, Launch first, monthly only", () => {
  assert.deepEqual(plans.map((p) => p.id), ["launch", "growth"]);
  assert.equal(pricing.cadence, "month");
  assert.ok(plans[0].price < plans[1].price);
});

test("Growth only adds capacity", () => {
  for (const k of Object.keys(limitLabels)) assert.ok(plans[1].limits[k] > plans[0].limits[k], k);
  assert.ok(!plans.some((p) => p.badge === "Most popular"), "no popularity claims without evidence");
});

test("core features are included in every plan, not sold separately", () => {
  for (const f of ["Churn Signals", "Cancellation feedback surveys", "Two-way customer replies"]) assert.ok(included.includes(f), f);
});

test("nothing is priced on revenue", () => {
  const text = JSON.stringify({ pricing, plans, definitions }).toLowerCase();
  assert.ok(!/per (mrr|arr)|% of|revenue band|mrr tier/.test(text));
});

test("every limit has a plain definition", () => {
  for (const k of Object.keys(limitLabels)) assert.ok(definitions.find((d) => d.k === k), k);
});

test("prices stay marked as upcoming until billing is live", () => {
  assert.equal(pricing.paidPlansLive, false);
});
