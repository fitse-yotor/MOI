import { Router } from "express";
import { createEnterprise, masterData } from "../data/enterprises.js";
import { enterprises } from "../data/enterprises.js";
import { licenses } from "../data/licenses.js";
import { answer } from "../chat/engine.js";

const router = Router();

// Unauthenticated assistant — answers from verified/public data only.
router.post("/chat", (req, res, next) => {
  const { question } = req.body || {};
  if (!question || !question.trim()) {
    const err = new Error("A question is required");
    err.status = 400;
    return next(err);
  }
  res.json(answer(question, { scope: "public" }));
});

// Unauthenticated — a new enterprise applying to join the registry, before
// any account exists for them. Lands as "Pending verification" for a woreda
// or regional officer to review, same as an admin-entered record.
router.post("/apply", (req, res, next) => {
  const body = req.body || {};
  if (!body.name || !body.tin) {
    const err = new Error("Enterprise name and TIN are required");
    err.status = 400;
    return next(err);
  }
  const item = createEnterprise(body, { status: "Pending verification", source: "self-registration" });
  res.status(201).json({
    referenceId: item.id,
    slug: item.slug,
    message: "Application received. A woreda or regional officer will review your submission.",
  });
});

router.get("/apply/reference-data", (req, res) => {
  res.json({ regions: masterData.regions, sectors: masterData.sectors, sizes: masterData.sizes });
});

// Public directory of registered (verified) enterprises — powers the portal
// listing and the /site/:slug website pages.
router.get("/industries", (req, res) => {
  const items = enterprises
    .filter((e) => e.status === "Active")
    .map((e) => ({
      id: e.id,
      slug: e.slug,
      name: e.name,
      sector: e.sector,
      subsector: e.subsector,
      region: e.region,
      size: e.size,
      theme: e.theme,
      tagline: e.tagline,
      lat: e.lat,
      lng: e.lng,
    }));
  res.json({ count: items.length, items });
});

// Full public profile for one enterprise website: about, products, location,
// contacts, plus the certificates currently valid for it.
router.get("/industries/:slug", (req, res, next) => {
  const item = enterprises.find((e) => e.slug === req.params.slug);
  if (!item) {
    const err = new Error("Enterprise not found");
    err.status = 404;
    return next(err);
  }
  const certificates = licenses.filter((l) => l.enterpriseName === item.name && l.status === "Active").map((l) => ({
    licenseNumber: l.licenseNumber,
    templateName: l.templateName,
    category: l.category,
    issueDate: l.issueDate,
    expiryDate: l.expiryDate,
    issuedBy: l.issuedBy,
  }));
  res.json({ item, certificates });
});

export default router;
