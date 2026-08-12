import { formatDate, addMonths, createPayment } from "../data/licenses.js";

/** Institution reviews a submitted application. Approving opens payment (or
 * skips straight to "awaiting issuance" for a free template); rejecting ends
 * this cycle with a reason recorded. */
export function decideApplication(license, template, { decision, by, reason }) {
  license.history.push({ action: `Application ${decision.toLowerCase()}`, by, date: formatDate(new Date()), note: reason || "" });

  if (decision === "Rejected") {
    license.status = "Rejected";
    return { item: license, payment: null };
  }

  if (template.feeETB > 0) {
    license.status = "Payment due";
    const payment = createPayment({ licenseId: license.id, enterpriseName: license.enterpriseName, purpose: "issue", amount: template.feeETB });
    return { item: license, payment };
  }

  license.status = "Payment confirmed";
  return { item: license, payment: null };
}

/** Admin manually issues the license once payment (or free-template approval) has cleared. */
export function issueLicense(license, template, { by }) {
  license.status = "Active";
  license.issueDate = formatDate(new Date());
  license.expiryDate = addMonths(license.issueDate, template.validityMonths);
  license.issuedBy = by;
  license.history.push({ action: "Issued", by, date: formatDate(new Date()), note: `${template.name} issued to ${license.enterpriseName}` });
  return license;
}

/** Enterprise (or an officer on its behalf) requests renewal of an active
 * license. Nothing is charged yet — the institution must approve first. */
export function requestRenewal(license, template, by) {
  license.status = "Renewal submitted";
  license.history.push({ action: "Renewal requested", by, date: formatDate(new Date()), note: `Renewal requested for ${template.name}` });
  return license;
}

/** Institution reviews a renewal request. Approving opens payment (or skips
 * straight to "awaiting issuance" if free); rejecting reverts to Active —
 * the existing license is untouched and still valid until its real expiry. */
export function decideRenewal(license, template, { decision, by, reason }) {
  license.history.push({ action: `Renewal ${decision.toLowerCase()}`, by, date: formatDate(new Date()), note: reason || "" });

  if (decision === "Rejected") {
    license.status = "Active";
    return { item: license, payment: null };
  }

  if (template.feeETB > 0) {
    license.status = "Renewal payment due";
    const payment = createPayment({ licenseId: license.id, enterpriseName: license.enterpriseName, purpose: "renewal", amount: template.feeETB });
    return { item: license, payment };
  }

  license.status = "Renewal payment confirmed";
  return { item: license, payment: null };
}

/** Admin issues the renewal certificate, extending validity from the
 * current expiry (or today, if it had already lapsed). */
export function issueRenewal(license, template, { by }) {
  const base = license.expiryDate && new Date(license.expiryDate) > new Date() ? license.expiryDate : formatDate(new Date());
  license.status = "Active";
  license.expiryDate = addMonths(base, template.validityMonths);
  license.history.push({ action: "Renewal issued", by, date: formatDate(new Date()), note: `Renewed until ${license.expiryDate}` });
  return license;
}

export function closeLicense(license, { by, reason, revoke }) {
  license.status = revoke ? "Revoked" : "Closed";
  license.history.push({ action: revoke ? "Revoked" : "Closed", by, date: formatDate(new Date()), note: reason || "" });
  return license;
}

/** Marks a Telebirr payment successful. Does NOT activate the license —
 * issuance is always a separate, explicit admin action. */
export function confirmPayment(payment, license, { phone, telebirrRef }) {
  payment.status = "Success";
  payment.phone = phone;
  payment.telebirrRef = telebirrRef;
  payment.completedAt = formatDate(new Date());

  license.status = payment.purpose === "renewal" ? "Renewal payment confirmed" : "Payment confirmed";
  license.history.push({
    action: "Payment confirmed",
    by: license.enterpriseName,
    date: formatDate(new Date()),
    note: `Paid ETB ${payment.amount.toLocaleString()} via Telebirr (ref ${telebirrRef})`,
  });
  return { payment, license };
}

export function failPayment(payment, license) {
  payment.status = "Failed";
  payment.completedAt = formatDate(new Date());
  license.status = payment.purpose === "renewal" ? "Renewal payment due" : "Payment due";
  license.history.push({
    action: "Payment failed",
    by: license.enterpriseName,
    date: formatDate(new Date()),
    note: "Telebirr payment was cancelled or declined — you can retry",
  });
  return payment;
}

/** Lazily flips a lapsed Active license to Expired the first time it's
 * read, rather than needing a background scheduler. */
export function syncExpiry(license) {
  if (license.status === "Active" && license.expiryDate && new Date(license.expiryDate) < new Date()) {
    license.status = "Expired";
    license.history.push({ action: "Expired", by: "System", date: formatDate(new Date()), note: `Validity period ended ${license.expiryDate}` });
  }
  return license;
}
