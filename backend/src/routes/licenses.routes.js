import { Router } from "express";
import { enterprises } from "../data/enterprises.js";
import {
  licenses,
  licenseTemplates,
  findTemplate,
  findLicense,
  findPendingPayment,
  createTemplate,
  createPayment,
  submitApplication,
  getExpiringLicenses,
} from "../data/licenses.js";
import {
  decideApplication,
  issueLicense,
  requestRenewal,
  decideRenewal,
  issueRenewal,
  closeLicense,
  syncExpiry,
} from "../workflow/licenseWorkflow.js";
import { authorize } from "../middleware/auth.js";
import { can } from "../data/permissions.js";

const router = Router();

function scopeToOwnEnterprise(items, user) {
  return user.role === "enterprise" ? items.filter((l) => l.enterpriseName === user.enterpriseName) : items;
}

function ownsLicense(license, user) {
  return user.role === "enterprise" && license.enterpriseName === user.enterpriseName;
}

function canManage(user) {
  return can(user.role, "licenses", "edit");
}

function canApprove(user) {
  return can(user.role, "licenses", "approve");
}

function notFound(id) {
  const err = new Error(`License ${id} not found`);
  err.status = 404;
  return err;
}

function forbidden(message) {
  const err = new Error(message);
  err.status = 403;
  return err;
}

function badRequest(message) {
  const err = new Error(message);
  err.status = 400;
  return err;
}

// --- Templates -------------------------------------------------------------

router.get("/templates", authorize("licenses", "view"), (req, res) => {
  const items = req.user.role === "enterprise" ? licenseTemplates.filter((t) => t.status === "Active") : licenseTemplates;
  res.json({ items });
});

router.post("/templates", authorize("licenses", "create"), (req, res) => {
  const item = createTemplate(req.body || {});
  res.status(201).json({ item });
});

router.put("/templates/:id", authorize("licenses", "edit"), (req, res, next) => {
  const item = findTemplate(req.params.id);
  if (!item) {
    const err = new Error(`Template ${req.params.id} not found`);
    err.status = 404;
    return next(err);
  }
  Object.assign(item, req.body || {});
  res.json({ item });
});

router.delete("/templates/:id", authorize("licenses", "delete"), (req, res, next) => {
  const idx = licenseTemplates.findIndex((t) => t.id === req.params.id);
  if (idx === -1) {
    const err = new Error(`Template ${req.params.id} not found`);
    err.status = 404;
    return next(err);
  }
  licenseTemplates.splice(idx, 1);
  res.status(204).end();
});

// --- Licenses ----------------------------------------------------------

router.get("/", authorize("licenses", "view"), (req, res) => {
  const { status, category, q } = req.query;
  let result = scopeToOwnEnterprise(licenses, req.user);
  result.forEach(syncExpiry);
  if (status && status !== "all") result = result.filter((l) => l.status === status);
  if (category && category !== "all") result = result.filter((l) => l.category === category);
  if (q) {
    const needle = q.toLowerCase();
    result = result.filter(
      (l) => l.enterpriseName.toLowerCase().includes(needle) || l.licenseNumber.toLowerCase().includes(needle)
    );
  }
  res.json({ count: result.length, items: result, templates: licenseTemplates });
});

router.get("/expiring", authorize("licenses", "view"), (req, res) => {
  const items = scopeToOwnEnterprise(getExpiringLicenses(30), req.user);
  res.json({ items });
});

// Submit a license application — an enterprise applying for itself, or an
// officer applying on an enterprise's behalf (both land as "Submitted").
router.post("/", (req, res, next) => {
  const { enterpriseId, templateId } = req.body || {};
  let enterprise;
  if (req.user.role === "enterprise") {
    enterprise = enterprises.find((e) => e.name === req.user.enterpriseName);
  } else {
    if (!can(req.user.role, "licenses", "create")) return next(forbidden("You cannot submit license applications"));
    enterprise = enterprises.find((e) => e.id === enterpriseId);
  }
  if (!enterprise) return next(notFound(`enterprise ${enterpriseId || req.user.enterpriseName}`));
  const template = findTemplate(templateId);
  if (!template) {
    const err = new Error(`Template ${templateId} not found`);
    err.status = 404;
    return next(err);
  }
  const item = submitApplication({ enterprise, template, by: req.user.name });
  res.status(201).json({ item });
});

router.get("/:id", authorize("licenses", "view"), (req, res, next) => {
  const item = findLicense(req.params.id);
  if (!item) return next(notFound(req.params.id));
  if (req.user.role === "enterprise" && !ownsLicense(item, req.user)) {
    return next(forbidden("You can only view your own enterprise's licenses"));
  }
  syncExpiry(item);
  res.json({ item, pendingPayment: findPendingPayment(item.id) || null });
});

// Institution decides on a submitted application.
router.post("/:id/decide", authorize("licenses", "approve"), (req, res, next) => {
  const item = findLicense(req.params.id);
  if (!item) return next(notFound(req.params.id));
  if (item.status !== "Submitted") return next(badRequest("This application is not awaiting a decision"));
  const { decision, reason } = req.body || {};
  if (!["Approved", "Rejected"].includes(decision)) return next(badRequest("decision must be Approved or Rejected"));
  const template = findTemplate(item.templateId);
  const result = decideApplication(item, template, { decision, by: req.user.name, reason });
  res.json(result);
});

// Admin manually issues the license once payment has cleared (or the
// template is free and the application was approved).
router.post("/:id/issue", authorize("licenses", "edit"), (req, res, next) => {
  const item = findLicense(req.params.id);
  if (!item) return next(notFound(req.params.id));
  if (item.status !== "Payment confirmed") return next(badRequest("This license is not ready to be issued"));
  const template = findTemplate(item.templateId);
  issueLicense(item, template, { by: req.user.name });
  res.json({ item });
});

// Re-opens a fresh Telebirr payment for a license stuck in a "due" state
// with no live payment (e.g. after a cancelled/declined attempt).
router.post("/:id/payment", (req, res, next) => {
  const item = findLicense(req.params.id);
  if (!item) return next(notFound(req.params.id));
  const isOwner = ownsLicense(item, req.user);
  if (!isOwner && !canManage(req.user)) return next(forbidden("You cannot pay for this license"));
  if (!["Payment due", "Renewal payment due"].includes(item.status)) return next(badRequest("No payment is currently due"));
  const existing = findPendingPayment(item.id);
  if (existing) return res.json({ payment: existing });
  const payment = createPayment({
    licenseId: item.id,
    enterpriseName: item.enterpriseName,
    purpose: item.status === "Renewal payment due" ? "renewal" : "issue",
    amount: item.feeETB,
  });
  res.status(201).json({ payment });
});

router.post("/:id/renew", (req, res, next) => {
  const item = findLicense(req.params.id);
  if (!item) return next(notFound(req.params.id));
  const isOwner = ownsLicense(item, req.user);
  if (!isOwner && !canManage(req.user)) return next(forbidden("You cannot renew this license"));
  syncExpiry(item);
  if (!["Active", "Expired"].includes(item.status)) return next(badRequest("Only an active or expired license can be renewed"));
  const template = findTemplate(item.templateId);
  requestRenewal(item, template, req.user.name);
  res.json({ item });
});

// Institution decides on a renewal request.
router.post("/:id/renew/decide", authorize("licenses", "approve"), (req, res, next) => {
  const item = findLicense(req.params.id);
  if (!item) return next(notFound(req.params.id));
  if (item.status !== "Renewal submitted") return next(badRequest("This renewal is not awaiting a decision"));
  const { decision, reason } = req.body || {};
  if (!["Approved", "Rejected"].includes(decision)) return next(badRequest("decision must be Approved or Rejected"));
  const template = findTemplate(item.templateId);
  const result = decideRenewal(item, template, { decision, by: req.user.name, reason });
  res.json(result);
});

// Admin issues the renewed certificate once the renewal payment has cleared.
router.post("/:id/renew/issue", authorize("licenses", "edit"), (req, res, next) => {
  const item = findLicense(req.params.id);
  if (!item) return next(notFound(req.params.id));
  if (item.status !== "Renewal payment confirmed") return next(badRequest("This renewal is not ready to be issued"));
  const template = findTemplate(item.templateId);
  issueRenewal(item, template, { by: req.user.name });
  res.json({ item });
});

router.post("/:id/close", authorize("licenses", "edit"), (req, res, next) => {
  const item = findLicense(req.params.id);
  if (!item) return next(notFound(req.params.id));
  const { reason, revoke } = req.body || {};
  closeLicense(item, { by: req.user.name, reason, revoke: !!revoke });
  res.json({ item });
});

export default router;
