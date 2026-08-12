import { test } from "node:test";
import assert from "node:assert/strict";
import { licenseTemplates, submitApplication, licenses } from "../src/data/licenses.js";
import {
  decideApplication,
  issueLicense,
  confirmPayment,
  failPayment,
  requestRenewal,
  decideRenewal,
  issueRenewal,
  syncExpiry,
} from "../src/workflow/licenseWorkflow.js";

const template = licenseTemplates[0];
const enterprise = { id: "ENT-X", name: "Test Manufacturing PLC" };

test("application decision opens payment for a paid template", () => {
  const lic = submitApplication({ enterprise, template, by: "Tester" });
  const { payment } = decideApplication(lic, template, { decision: "Approved", by: "Officer" });
  assert.equal(lic.status, "Payment due");
  assert.equal(payment.amount, template.feeETB);
});

test("rejected application ends the cycle", () => {
  const lic = submitApplication({ enterprise, template, by: "Tester" });
  const { payment } = decideApplication(lic, template, { decision: "Rejected", by: "Officer", reason: "Missing docs" });
  assert.equal(lic.status, "Rejected");
  assert.equal(payment, null);
});

test("payment confirm does not auto-issue; issue is a separate action", () => {
  const lic = submitApplication({ enterprise, template, by: "Tester" });
  const { payment } = decideApplication(lic, template, { decision: "Approved", by: "Officer" });
  confirmPayment(payment, lic, { phone: "0912345678", telebirrRef: "TLB1" });
  assert.equal(lic.status, "Payment confirmed");
  issueLicense(lic, template, { by: "Officer" });
  assert.equal(lic.status, "Active");
  assert.ok(lic.issueDate);
  assert.ok(lic.expiryDate);
});

test("failed payment keeps license payable and retryable", () => {
  const lic = submitApplication({ enterprise, template, by: "Tester" });
  const { payment } = decideApplication(lic, template, { decision: "Approved", by: "Officer" });
  failPayment(payment, lic);
  assert.equal(lic.status, "Payment due");
});

test("renewal approval extends from current expiry", () => {
  const lic = submitApplication({ enterprise, template, by: "Tester" });
  const { payment } = decideApplication(lic, template, { decision: "Approved", by: "Officer" });
  confirmPayment(payment, lic, { phone: "0912345678", telebirrRef: "TLB2" });
  issueLicense(lic, template, { by: "Officer" });
  const before = lic.expiryDate;
  requestRenewal(lic, template, "Enterprise");
  const renewal = decideRenewal(lic, template, { decision: "Approved", by: "Officer" });
  assert.equal(lic.status, "Renewal payment due");
  confirmPayment(renewal.payment, lic, { phone: "0912345678", telebirrRef: "TLB3" });
  assert.equal(lic.status, "Renewal payment confirmed");
  issueRenewal(lic, template, { by: "Officer" });
  assert.equal(lic.status, "Active");
  assert.notEqual(lic.expiryDate, before);
});

test("syncExpiry lazily marks an overdue Active license as Expired", () => {
  const lic = submitApplication({ enterprise, template, by: "Tester" });
  lic.status = "Active";
  lic.expiryDate = "2000-01-01";
  syncExpiry(lic);
  assert.equal(lic.status, "Expired");
});
