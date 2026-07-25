import { formatDate, createPayment } from "../data/licenses.js";

function addMonths(dateStr, months) {
  const d = new Date(dateStr);
  d.setMonth(d.getMonth() + months);
  return formatDate(d);
}

/**
 * Enterprise (or an officer on its behalf) requests renewal of an active
 * license. Opens a fresh payment cycle; the license only extends once that
 * payment is confirmed.
 */
export function requestRenewal(license, template, by) {
  license.status = "Renewal pending payment";
  license.history.push({
    action: "Renewal requested",
    by,
    date: formatDate(new Date()),
    note: `Renewal requested for ${template.name}`,
  });
  return createPayment({
    licenseId: license.id,
    enterpriseName: license.enterpriseName,
    purpose: "renewal",
    amount: template.feeETB,
  });
}

export function closeLicense(license, { by, reason, revoke }) {
  license.status = revoke ? "Revoked" : "Closed";
  license.history.push({
    action: revoke ? "Revoked" : "Closed",
    by,
    date: formatDate(new Date()),
    note: reason || "",
  });
  return license;
}

/**
 * Marks a Telebirr payment successful and activates/extends the license it
 * belongs to. On first issue this sets the initial validity window; on
 * renewal it extends from the current expiry (or today, if already lapsed).
 */
export function confirmPayment(payment, license, template, { phone, telebirrRef }) {
  payment.status = "Success";
  payment.phone = phone;
  payment.telebirrRef = telebirrRef;
  payment.completedAt = formatDate(new Date());

  const isRenewal = payment.purpose === "renewal";
  const base = isRenewal && license.expiryDate && new Date(license.expiryDate) > new Date()
    ? license.expiryDate
    : formatDate(new Date());

  license.status = "Active";
  if (!isRenewal) license.issueDate = formatDate(new Date());
  license.expiryDate = addMonths(base, template.validityMonths);
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
  license.history.push({
    action: "Payment failed",
    by: license.enterpriseName,
    date: formatDate(new Date()),
    note: "Telebirr payment was cancelled or declined",
  });
  return payment;
}
