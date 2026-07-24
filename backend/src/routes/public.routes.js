import { Router } from "express";
import { createEnterprise, masterData } from "../data/enterprises.js";

const router = Router();

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
    message: "Application received. A woreda or regional officer will review your submission.",
  });
});

router.get("/apply/reference-data", (req, res) => {
  res.json({ regions: masterData.regions, sectors: masterData.sectors, sizes: masterData.sizes });
});

export default router;
