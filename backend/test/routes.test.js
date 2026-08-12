import { test, beforeEach } from "node:test";
import assert from "node:assert/strict";
import request from "supertest";
import { createApp } from "../src/app.js";

let app;
let token;

beforeEach(async () => {
  app = createApp();
  const res = await request(app).post("/api/auth/login").send({ username: "federal.admin", password: "Federal@123" });
  token = res.body.token;
});

test("health endpoint responds", async () => {
  const res = await request(app).get("/health");
  assert.equal(res.status, 200);
  assert.deepEqual(res.body, { status: "ok" });
});

test("login rejects wrong password", async () => {
  const res = await request(app).post("/api/auth/login").send({ username: "federal.admin", password: "wrong" });
  assert.equal(res.status, 401);
});

test("protected routes reject missing token", async () => {
  const res = await request(app).get("/api/enterprises");
  assert.equal(res.status, 401);
});

test("authenticated user can list enterprises with consistent totals", async () => {
  const res = await request(app).get("/api/enterprises").set("Authorization", `Bearer ${token}`);
  assert.equal(res.status, 200);
  assert.equal(res.body.count, res.body.items.length);
  assert.ok(res.body.total >= res.body.count);
});

test("enterprise filtering applies to count", async () => {
  const res = await request(app).get("/api/enterprises?region=Oromia").set("Authorization", `Bearer ${token}`);
  assert.ok(res.body.count >= 1);
  assert.ok(res.body.items.every((e) => e.region === "Oromia"));
});

test("enterprise role is row-scoped to its own enterprise", async () => {
  const login = await request(app).post("/api/auth/login").send({ username: "enterprise.mgr", password: "Enterprise@123" });
  const res = await request(app).get("/api/enterprises").set("Authorization", `Bearer ${login.body.token}`);
  assert.equal(res.status, 200);
  assert.ok(res.body.items.every((e) => e.name === "Bole Lemi Garments PLC"));
});

test("enterprise role cannot create enterprises", async () => {
  const login = await request(app).post("/api/auth/login").send({ username: "enterprise.mgr", password: "Enterprise@123" });
  const res = await request(app).post("/api/enterprises").set("Authorization", `Bearer ${login.body.token}`).send({ name: "X" });
  assert.equal(res.status, 403);
});

test("review queue is filtered to levels the role can decide", async () => {
  const login = await request(app).post("/api/auth/login").send({ username: "woreda.officer", password: "Woreda@123" });
  const res = await request(app).get("/api/review/queue").set("Authorization", `Bearer ${login.body.token}`);
  assert.equal(res.status, 200);
  assert.ok(res.body.items.every((s) => s.level === "Woreda"));
});

test("public apply requires name and TIN", async () => {
  const res = await request(app).post("/api/public/apply").send({ name: "Only Name" });
  assert.equal(res.status, 400);
});

test("public apply registers a pending enterprise and returns a slugged profile", async () => {
  const res = await request(app).post("/api/public/apply").send({ name: "Test Factory PLC", tin: "1112223334" });
  assert.equal(res.status, 201);
  const profile = await request(app).get("/api/public/industries/test-factory-plc");
  assert.equal(profile.status, 200);
  assert.equal(profile.body.item.name, "Test Factory PLC");
});

test("demo-accounts endpoint never exposes passwords", async () => {
  const res = await request(app).get("/api/auth/demo-accounts");
  assert.equal(res.status, 200);
  for (const item of res.body.items) {
    assert.ok(!("password" in item));
  }
});
