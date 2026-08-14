import { Router } from "express";
import {
  campaigns,
  baselineForm,
  questionnaireBuilder,
  NMIS_MODULES_META,
  NMIS_SAMPLE_RESPONSE,
} from "../data/collection.js";
import { authorize } from "../middleware/auth.js";

const router = Router();
let nextNum = 7;

// In-memory submissions store
const submissionsStore = [
  {
    id: "SUB-1001",
    campaignId: "CMP-1",
    enterpriseName: "Bole Lemi Garments PLC",
    tin: "0012348765",
    submittedAt: new Date().toISOString(),
    status: "Verified",
    data: NMIS_SAMPLE_RESPONSE,
  },
];

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

// ── NMIS V16 Dedicated Endpoints ─────────────────────────────────────

// GET /api/collection/nmis-questionnaire — Full 10-module schema & metadata
router.get("/nmis-questionnaire", authorize("collection", "view"), (req, res) => {
  res.json({
    title: "National Manufacturing Industry Survey (NMIS V16)",
    version: "V16 Post-Pilot Revised",
    surveyYear: 2026,
    referenceYear: "2015 E.C. (2022/2023 G.C.)",
    modules: NMIS_MODULES_META,
    totalModules: NMIS_MODULES_META.length,
  });
});

// GET /api/collection/nmis-sample — Pre-filled 10-module sample dataset
router.get("/nmis-sample", authorize("collection", "view"), (req, res) => {
  res.json({
    sampleEnterprise: "Bole Lemi Garments PLC",
    tin: "0012348765",
    data: NMIS_SAMPLE_RESPONSE,
  });
});

// POST /api/collection/nmis-submit — Submit completed NMIS V16 survey
router.post("/nmis-submit", authorize("collection", "create"), (req, res) => {
  const { campaignId, formData } = req.body || {};
  const submissionId = `SUB-${Date.now()}`;
  const record = {
    id: submissionId,
    campaignId: campaignId || "CMP-1",
    enterpriseName: formData?.m1?.registeredName || "Unnamed Enterprise",
    tin: formData?.m1?.tin || "0000000000",
    submittedAt: new Date().toISOString(),
    status: "Pending Review",
    data: formData,
  };
  submissionsStore.unshift(record);

  // Increment campaign completion counter
  const camp = campaigns.find((c) => c.id === (campaignId || "CMP-1"));
  if (camp) {
    camp.done = (camp.done || 0) + 1;
  }

  res.status(201).json({
    message: `NMIS V16 Questionnaire successfully submitted for ${record.enterpriseName}!`,
    submissionId,
    timestamp: record.submittedAt,
  });
});

export default router;
