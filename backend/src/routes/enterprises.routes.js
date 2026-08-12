import { Router } from "express";
import { enterprises, sectorSummary, masterData, createEnterprise } from "../data/enterprises.js";
import { authorize } from "../middleware/auth.js";

const router = Router();

function scopeToOwnEnterprise(items, user) {
  return user.role === "enterprise" ? items.filter((e) => e.name === user.enterpriseName) : items;
}

router.get("/", authorize("enterprises", "view"), (req, res) => {
  const { region, sector, size, status, q } = req.query;
  const scoped = scopeToOwnEnterprise(enterprises, req.user);
  let result = scoped;
  if (region && region !== "all") result = result.filter((e) => e.region === region);
  if (sector && sector !== "all") result = result.filter((e) => e.sector === sector);
  if (size && size !== "all") result = result.filter((e) => e.size === size);
  if (status && status !== "all") result = result.filter((e) => e.status === status);
  if (q) {
    const needle = q.toLowerCase();
    result = result.filter((e) => e.name.toLowerCase().includes(needle) || e.tin.includes(needle));
  }
  res.json({ total: scoped.length, count: result.length, items: result, filters: masterData });
});

router.get("/sectors", authorize("enterprises", "view"), (req, res) => {
  res.json({ items: sectorSummary });
});

router.get("/:id", authorize("enterprises", "view"), (req, res, next) => {
  const item = enterprises.find((e) => e.id === req.params.id);
  if (!item) {
    const err = new Error(`Enterprise ${req.params.id} not found`);
    err.status = 404;
    return next(err);
  }
  res.json({ item });
});

router.post("/", authorize("enterprises", "create"), (req, res) => {
  const item = createEnterprise(req.body || {});
  res.status(201).json({ item });
});

router.put("/:id", authorize("enterprises", "edit"), (req, res, next) => {
  const item = enterprises.find((e) => e.id === req.params.id);
  if (!item) {
    const err = new Error(`Enterprise ${req.params.id} not found`);
    err.status = 404;
    return next(err);
  }
  if (req.user.role === "enterprise" && item.name !== req.user.enterpriseName) {
    const err = new Error("You can only edit your own enterprise's profile");
    err.status = 403;
    return next(err);
  }
  Object.assign(item, req.body || {});
  res.json({ item });
});

router.delete("/:id", authorize("enterprises", "delete"), (req, res, next) => {
  const idx = enterprises.findIndex((e) => e.id === req.params.id);
  if (idx === -1) {
    const err = new Error(`Enterprise ${req.params.id} not found`);
    err.status = 404;
    return next(err);
  }
  enterprises.splice(idx, 1);
  res.status(204).end();
});

export default router;
