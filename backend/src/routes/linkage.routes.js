import { Router } from "express";
import { opportunities, linkageRequests } from "../data/linkage.js";
import { authorize } from "../middleware/auth.js";

const router = Router();
let nextNum = 7;

router.get("/opportunities", authorize("linkage", "view"), (req, res) => {
  const { type } = req.query;
  let result = opportunities;
  if (type && type !== "all") result = result.filter((o) => o.category === type);
  res.json({ items: result });
});

router.get("/opportunities/:id", authorize("linkage", "view"), (req, res, next) => {
  const item = opportunities.find((o) => o.id === req.params.id);
  if (!item) {
    const err = new Error(`Opportunity ${req.params.id} not found`);
    err.status = 404;
    return next(err);
  }
  res.json({ item });
});

router.post("/opportunities", authorize("linkage", "create"), (req, res) => {
  const body = req.body || {};
  const item = {
    id: `OPP-${nextNum++}`,
    category: body.category || "Buying opportunity",
    title: body.title || "Untitled opportunity",
    body: body.body || "",
    region: body.region || "Any region",
    views: 0,
    expires: body.expires || "",
  };
  opportunities.push(item);
  res.status(201).json({ item });
});

router.put("/opportunities/:id", authorize("linkage", "edit"), (req, res, next) => {
  const item = opportunities.find((o) => o.id === req.params.id);
  if (!item) {
    const err = new Error(`Opportunity ${req.params.id} not found`);
    err.status = 404;
    return next(err);
  }
  Object.assign(item, req.body || {});
  res.json({ item });
});

router.delete("/opportunities/:id", authorize("linkage", "delete"), (req, res, next) => {
  const idx = opportunities.findIndex((o) => o.id === req.params.id);
  if (idx === -1) {
    const err = new Error(`Opportunity ${req.params.id} not found`);
    err.status = 404;
    return next(err);
  }
  opportunities.splice(idx, 1);
  res.status(204).end();
});

router.get("/requests", authorize("linkage", "view"), (req, res) => {
  res.json({ items: linkageRequests });
});

router.post("/opportunities/:id/interest", authorize("linkage", "view"), (req, res) => {
  res.json({ id: req.params.id, status: "interest recorded" });
});

export default router;
