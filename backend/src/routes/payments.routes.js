import { Router } from "express";
import { findPayment, findLicense, findTemplate } from "../data/licenses.js";
import { confirmPayment, failPayment } from "../workflow/licenseWorkflow.js";
import { can } from "../data/permissions.js";

const router = Router();

function notFound(what) {
  const err = new Error(`${what} not found`);
  err.status = 404;
  return err;
}

function forbidden(message) {
  const err = new Error(message);
  err.status = 403;
  return err;
}

function loadContext(req, res, next) {
  const payment = findPayment(req.params.id);
  if (!payment) return next(notFound(`Payment ${req.params.id}`));
  const license = findLicense(payment.licenseId);
  if (!license) return next(notFound(`License ${payment.licenseId}`));
  if (req.user.role === "enterprise" && license.enterpriseName !== req.user.enterpriseName) {
    return next(forbidden("You can only pay for your own enterprise's licenses"));
  }
  req.payment = payment;
  req.license = license;
  req.template = findTemplate(license.templateId);
  next();
}

router.get("/:id", loadContext, (req, res) => {
  res.json({ payment: req.payment, license: req.license, template: req.template });
});

const PHONE_RE = /^(?:\+?251|0)9\d{8}$/;

function requireCanPay(req, res, next) {
  const isOwner = req.user.role === "enterprise" && req.license.enterpriseName === req.user.enterpriseName;
  if (!isOwner && !can(req.user.role, "licenses", "edit")) {
    return next(forbidden("You cannot act on this payment"));
  }
  next();
}

router.post("/:id/telebirr/confirm", loadContext, requireCanPay, (req, res, next) => {
  if (req.payment.status !== "Pending") {
    const err = new Error("This payment has already been settled");
    err.status = 400;
    return next(err);
  }
  const { phone, pin } = req.body || {};
  if (!PHONE_RE.test((phone || "").replace(/\s/g, ""))) {
    const err = new Error("Enter a valid Ethiopian phone number (e.g. 09xxxxxxxx)");
    err.status = 400;
    return next(err);
  }
  if (!/^\d{4,6}$/.test(pin || "")) {
    const err = new Error("PIN must be 4-6 digits");
    err.status = 400;
    return next(err);
  }
  const telebirrRef = `TLB${Date.now().toString().slice(-10)}`;
  const result = confirmPayment(req.payment, req.license, req.template, { phone, telebirrRef });
  res.json(result);
});

router.post("/:id/telebirr/cancel", loadContext, requireCanPay, (req, res, next) => {
  if (req.payment.status !== "Pending") {
    const err = new Error("This payment has already been settled");
    err.status = 400;
    return next(err);
  }
  const payment = failPayment(req.payment, req.license);
  res.json({ payment });
});

export default router;
