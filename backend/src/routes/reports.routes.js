import { Router } from "express";
import { reports } from "../data/reports.js";
import { authorize } from "../middleware/auth.js";

const router = Router();
let nextNum = 8;

router.get("/", authorize("reports", "view"), (req, res) => {
  const { category, q } = req.query;
  let result = reports;
  if (category && category !== "all") result = result.filter((r) => r.category === category);
  if (q) {
    const needle = q.toLowerCase();
    result = result.filter((r) => r.name.toLowerCase().includes(needle));
  }
  res.json({ items: result });
});

router.get("/:id", authorize("reports", "view"), (req, res, next) => {
  const item = reports.find((r) => r.id === req.params.id);
  if (!item) {
    const err = new Error(`Report ${req.params.id} not found`);
    err.status = 404;
    return next(err);
  }
  res.json({ item });
});

router.post("/", authorize("reports", "create"), (req, res) => {
  const body = req.body || {};
  const item = {
    id: `RPT-${nextNum++}`,
    name: body.name || "Untitled report",
    category: body.category || "Registry",
    period: body.period || "",
    published: "—",
    status: body.status || "Draft",
  };
  reports.push(item);
  res.status(201).json({ item });
});

router.put("/:id", authorize("reports", "edit"), (req, res, next) => {
  const item = reports.find((r) => r.id === req.params.id);
  if (!item) {
    const err = new Error(`Report ${req.params.id} not found`);
    err.status = 404;
    return next(err);
  }
  Object.assign(item, req.body || {});
  res.json({ item });
});

router.delete("/:id", authorize("reports", "delete"), (req, res, next) => {
  const idx = reports.findIndex((r) => r.id === req.params.id);
  if (idx === -1) {
    const err = new Error(`Report ${req.params.id} not found`);
    err.status = 404;
    return next(err);
  }
  reports.splice(idx, 1);
  res.status(204).end();
});

export default router;
