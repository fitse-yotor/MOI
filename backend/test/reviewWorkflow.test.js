import { test } from "node:test";
import assert from "node:assert/strict";
import { applyDecision, resubmit, canDecideAtLevel } from "../src/workflow/reviewWorkflow.js";

function submission() {
  return {
    id: "SUB-1",
    enterprise: "Bole Lemi Garments PLC",
    level: "Woreda",
    status: "Pending",
    history: [],
  };
}

test("approving advances to the next level", () => {
  const s = submission();
  applyDecision(s, { decision: "Approved", by: "Helen Tesfaye" });
  assert.equal(s.level, "Zonal");
  assert.equal(s.status, "Pending");
  assert.equal(s.history.length, 1);
  assert.equal(s.history[0].decision, "Approved");
});

test("approving at Federal finalizes as Approved", () => {
  const s = submission();
  s.level = "Federal";
  applyDecision(s, { decision: "Approved", by: "Tsion Bekele" });
  assert.equal(s.status, "Approved");
});

test("rejected is terminal for the cycle", () => {
  const s = submission();
  applyDecision(s, { decision: "Rejected", by: "Helen Tesfaye", reason: "Incomplete data" });
  assert.equal(s.status, "Rejected");
  assert.equal(s.history[0].reason, "Incomplete data");
});

test("returned can be resubmitted back to Pending", () => {
  const s = submission();
  applyDecision(s, { decision: "Returned", by: "Helen Tesfaye" });
  assert.equal(s.status, "Returned");
  resubmit(s, { by: "Aster Kebede" });
  assert.equal(s.status, "Pending");
  assert.equal(s.history.at(-1).decision, "Resubmitted");
});

test("role authorization per level", () => {
  assert.equal(canDecideAtLevel("woreda", "Woreda"), true);
  assert.equal(canDecideAtLevel("woreda", "Zonal"), false);
  assert.equal(canDecideAtLevel("regional", "Zonal"), true);
  assert.equal(canDecideAtLevel("regional", "Regional"), true);
  assert.equal(canDecideAtLevel("regional", "Woreda"), false);
  assert.equal(canDecideAtLevel("federal", "Woreda"), true);
  assert.equal(canDecideAtLevel("federal", "Federal"), true);
  assert.equal(canDecideAtLevel("enterprise", "Woreda"), false);
});
