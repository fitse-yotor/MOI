import { Router } from "express";
import { enterprises } from "../data/enterprises.js";
import {
  licenses,
  licenseTemplates,
  payments,
  findTemplate,
  findLicense,
  createTemplate,
  createLicense,
} from "../data/licenses.js";
import { requestRenewal, closeLicense } from "../workflow/licenseWorkflow.js";
import { authorize } from "../middleware/auth.js";
import { can } from "../data/permissions.js";

const router = Router();

function scopeToOwnEnterprise(items, user) {
  return user.role === "enterprise" ? items.filter((l) => l.enterpriseName === user.enterpriseName) : items;
}

function ownsLicense(license, user) {
  return user.role === "enterprise" && license.enterpriseName === user.enterpriseName;
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

router.post("/", authorize("licenses", "create"), (req, res, next) => {
  const { enterpriseId, templateId } = req.body || {};
  const enterprise = enterprises.find((e) => e.id === enterpriseId);
  if (!enterprise) return next(notFound(`enterprise ${enterpriseId}`));
  const template = findTemplate(templateId);
  if (!template) {
    const err = new Error(`Template ${templateId} not found`);
    err.status = 404;
    return next(err);
  }
  const { license, payment } = createLicense({ enterprise, template, issuedBy: req.user.name });
  res.status(201).json({ item: license, payment });
});

router.get("/:id", authorize("licenses", "view"), (req, res, next) => {
  const item = findLicense(req.params.id);
  if (!item) return next(notFound(req.params.id));
  if (req.user.role === "enterprise" && !ownsLicense(item, req.user)) {
    return next(forbidden("You can only view your own enterprise's licenses"));
  }
  const payment = payments.find((p) => p.licenseId === item.id && p.status === "Pending");
  res.json({ item, pendingPayment: payment || null });
});

router.post("/:id/renew", (req, res, next) => {
  const item = findLicense(req.params.id);
  if (!item) return next(notFound(req.params.id));
  const canManage = can(req.user.role, "licenses", "edit");
  const isOwner = ownsLicense(item, req.user);
  if (!isOwner && !canManage) return next(forbidden("You cannot renew this license"));
  if (item.status !== "Active") {
    const err = new Error("Only an active license can be renewed");
    err.status = 400;
    return next(err);
  }
  const template = findTemplate(item.templateId);
  const payment = requestRenewal(item, template, req.user.name);
  res.json({ item, payment });
});

router.post("/:id/close", authorize("licenses", "edit"), (req, res, next) => {
  const item = findLicense(req.params.id);
  if (!item) return next(notFound(req.params.id));
  const { reason, revoke } = req.body || {};
  closeLicense(item, { by: req.user.name, reason, revoke: !!revoke });
  res.json({ item });
});

export default router;
