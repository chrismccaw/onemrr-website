import { test } from "node:test";
import assert from "node:assert/strict";
import * as d from "../src/data/demo.mjs";

const sum = (xs) => xs.reduce((a, b) => a + b, 0);

test("sources add up to MRR, this month and every month", () => {
  assert.equal(sum(d.sources.map((s) => s.mrr)), d.mrr);
  assert.equal(sum(d.sources.map((s) => s.delta)), d.mrr - d.previousMrr);
  d.mrrHistory.forEach((m, i) => assert.equal(sum(d.sources.map((s) => s.history[i])), m, `month ${d.mrrMonths[i]}`));
  d.sources.forEach((s) => assert.equal(s.history.at(-1) - s.history.at(-2), s.delta, s.name));
});

test("the MRR bridge closes", () => {
  assert.equal(d.previousMrr + sum(d.bridge.map((b) => b.amount)), d.mrr);
  assert.equal(d.mrrHistory.at(-2), d.previousMrr);
  assert.equal(d.arr, d.mrr * 12);
});

test("listed movers never exceed their movement", () => {
  for (const b of d.bridge) {
    assert.ok(b.customers.length <= b.count, b.key);
    assert.ok(Math.abs(sum(b.customers.map((c) => c.amount))) <= Math.abs(b.amount), b.key);
    for (const c of b.customers) assert.equal(Math.sign(c.amount), Math.sign(b.amount), c.name);
  }
});

test("Bluebird's signal matches the decline rule (60% threshold)", () => {
  assert.equal(d.bluebirdSignal.dropPct, 74);
  assert.ok(d.bluebirdSignal.dropPct >= 60);
  assert.equal(d.bluebirdSignal.sentence, "Key activity fell 74%: 31 a week on average over the 56 days to Oct 3, 8 a week in the 14 days since.");
  assert.equal(d.atRisk[0].normal, "31 → 8 a week");
});

test("Harbor's signal matches the inactivity rule", () => {
  assert.equal(d.harborSignal.threshold, 14);
  assert.equal(d.harborSignal.flagged, true);
});

test("the reconciliation explains the whole gap", () => {
  assert.equal(sum(d.recon.rows.map((r) => r.diff)), d.recon.billed - d.recon.onemrr);
});

test("the feedback funnel only narrows", () => {
  d.funnel.slice(1).forEach((f, i) => assert.ok(f.n <= d.funnel[i].n, f.label));
  assert.ok(sum(d.reasons.map((r) => r.n)) <= d.funnel.at(-1).n);
});
