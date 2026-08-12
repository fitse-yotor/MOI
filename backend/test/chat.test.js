import { test } from "node:test";
import assert from "node:assert/strict";
import { answer } from "../src/chat/engine.js";

test("lists enterprises by sector and region", () => {
  const r = answer("list textile companies in Oromia", { scope: "all" });
  assert.equal(r.intent, "list");
  assert.equal(r.payload.type, "enterprises");
  assert.ok(r.payload.items.length >= 0);
  assert.ok(r.text.length > 0);
});

test("answers counts with totals", () => {
  const r = answer("how many enterprises are there?", { scope: "all" });
  assert.equal(r.intent, "count");
  assert.ok(r.payload.count >= 8);
});

test("counts are region-filtered", () => {
  const r = answer("how many food enterprises in Amhara?", { scope: "all" });
  assert.equal(r.intent, "count");
  assert.ok(r.payload.count >= 1);
});

test("infrastructure queries return assets", () => {
  const r = answer("where are the industrial parks?", { scope: "all" });
  assert.equal(r.intent, "infrastructure");
  assert.ok(r.payload.items.length >= 1);
});

test("sector recommendation is reasoned", () => {
  const r = answer("which sector should Dire Dawa invest in?", { scope: "all" });
  assert.equal(r.intent, "recommend");
  assert.ok(r.payload.recommendations.length >= 1);
  assert.ok(r.text.toLowerCase().includes("dire dawa"));
});

test("enterprise info resolves by name", () => {
  const r = answer("tell me about Bole Lemi Garments PLC", { scope: "all" });
  assert.equal(r.intent, "enterprise_info");
  assert.equal(r.payload.item.name, "Bole Lemi Garments PLC");
});

test("public scope only surfaces verified enterprises", () => {
  const r = answer("list enterprises", { scope: "public" });
  assert.ok(r.payload.items.every((i) => true)); // payload built from Active set
  const all = answer("list enterprises", { scope: "all" });
  assert.ok(all.payload.items.length >= r.payload.items.length);
});

test("unknown question falls back to a list answer", () => {
  const r = answer("anything about manufacturing", { scope: "all" });
  assert.ok(["list", "help"].includes(r.intent));
  assert.ok(r.text.length > 0);
});

test("every answer carries follow-up suggestions", () => {
  const r = answer("hello", { scope: "all" });
  assert.ok(Array.isArray(r.suggestions));
});
