import { Router } from "express";
import { campaigns, baselineForm, questionnaireBuilder } from "../data/collection.js";
import { authorize } from "../middleware/auth.js";

const router = Router();
let nextNum = 7;

router.get("/campaigns", authorize("collection", "view"), (req, res) => {
  res.json({ items: campaigns });
});

router.get("/campaigns/:id", authorize("collection", "view"), (req, res, next) => {
  const item = campaigns.find((c) => c.id === req.params.id);
  if (!item) {
    const err = new Error(`Campaign ${req.params.id} not found`);
    err.status = 404;
    return next(err);
  }
  res.json({ item });
});

router.post("/campaigns", authorize("collection", "create"), (req, res) => {
  const body = req.body || {};
  const item = {
    id: `CMP-${nextNum++}`,
    name: body.name || "Untitled campaign",
    period: body.period || "",
    target: Number(body.target) || 0,
    done: 0,
    status: body.status || "Scheduled",
  };
  campaigns.push(item);
  res.status(201).json({ item });
});

router.put("/campaigns/:id", authorize("collection", "edit"), (req, res, next) => {
  const item = campaigns.find((c) => c.id === req.params.id);
  if (!item) {
    const err = new Error(`Campaign ${req.params.id} not found`);
    err.status = 404;
    return next(err);
  }
  Object.assign(item, req.body || {});
  res.json({ item });
});

router.delete("/campaigns/:id", authorize("collection", "delete"), (req, res, next) => {
  const idx = campaigns.findIndex((c) => c.id === req.params.id);
  if (idx === -1) {
    const err = new Error(`Campaign ${req.params.id} not found`);
    err.status = 404;
    return next(err);
  }
  campaigns.splice(idx, 1);
  res.status(204).end();
});

router.get("/baseline-form", authorize("collection", "view"), (req, res) => {
  res.json(baselineForm);
});

router.get("/questionnaire-builder", authorize("collection", "view"), (req, res) => {
  res.json(questionnaireBuilder);
});

export default router;
