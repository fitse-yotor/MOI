import { Router } from "express";
import { users } from "../data/users.js";
import { authorize } from "../middleware/auth.js";

const router = Router();
let nextNum = 7;

router.get("/", authorize("users", "view"), (req, res) => {
  const { role, q } = req.query;
  let result = users;
  if (role && role !== "all") result = result.filter((u) => u.role.toLowerCase().includes(role.toLowerCase()));
  if (q) {
    const needle = q.toLowerCase();
    result = result.filter((u) => u.name.toLowerCase().includes(needle));
  }
  res.json({ items: result });
});

router.get("/:id", authorize("users", "view"), (req, res, next) => {
  const item = users.find((u) => u.id === req.params.id);
  if (!item) {
    const err = new Error(`User ${req.params.id} not found`);
    err.status = 404;
    return next(err);
  }
  res.json({ item });
});

router.post("/", authorize("users", "create"), (req, res) => {
  const body = req.body || {};
  const item = {
    id: `USR-${nextNum++}`,
    name: body.name || "New User",
    role: body.role || "Data Collector",
    jurisdiction: body.jurisdiction || "—",
    lastLogin: "Never",
    status: body.status || "Active",
  };
  users.push(item);
  res.status(201).json({ item });
});

router.put("/:id", authorize("users", "edit"), (req, res, next) => {
  const item = users.find((u) => u.id === req.params.id);
  if (!item) {
    const err = new Error(`User ${req.params.id} not found`);
    err.status = 404;
    return next(err);
  }
  Object.assign(item, req.body || {});
  res.json({ item });
});

router.delete("/:id", authorize("users", "delete"), (req, res, next) => {
  const idx = users.findIndex((u) => u.id === req.params.id);
  if (idx === -1) {
    const err = new Error(`User ${req.params.id} not found`);
    err.status = 404;
    return next(err);
  }
  users.splice(idx, 1);
  res.status(204).end();
});

export default router;
