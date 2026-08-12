export const licenseTemplates = [
  {
    id: "TPL-1",
    name: "Manufacturing Operating License",
    code: "MOL",
    category: "Operating license",
    description: "Authorizes a registered enterprise to operate a manufacturing facility within its licensed sector and premises.",
    feeETB: 5000,
    validityMonths: 12,
    terms: [
      "Must maintain valid workplace safety and environmental clearances.",
      "Production capacity changes above 20% must be reported within 30 days.",
      "License must be displayed at the primary facility.",
    ],
    status: "Active",
    createdAt: "2025-01-10",
  },
  {
    id: "TPL-2",
    name: "Environmental Compliance Certificate",
    code: "ECC",
    category: "Compliance certificate",
    description: "Certifies that the enterprise's waste, emissions and effluent handling meet national environmental standards.",
    feeETB: 3200,
    validityMonths: 24,
    terms: [
      "Subject to unannounced environmental audits.",
      "Any process change affecting emissions must be pre-approved.",
    ],
    status: "Active",
    createdAt: "2025-01-10",
  },
  {
    id: "TPL-3",
    name: "Export Permit License",
    code: "EPL",
    category: "Trade permit",
    description: "Permits an exporting enterprise to ship manufactured goods internationally under Ministry oversight.",
    feeETB: 2500,
    validityMonths: 12,
    terms: [
      "Each shipment must be logged with the customs reference number.",
      "Permit is void if export status lapses to Domestic.",
    ],
    status: "Active",
    createdAt: "2025-02-04",
  },
];

export const licenses = [];
export const payments = [];

let nextTemplateNum = 4;
let nextLicenseNum = 1;
let nextPaymentNum = 1;

// License status machine:
//   Submitted -> Rejected
//             -> Payment due -> Payment confirmed -> Active
//   Active -> Renewal submitted -> (rejected, back to Active)
//                                -> Renewal payment due -> Renewal payment confirmed -> Active (extended)
//   Active -> Expired (derived when past expiryDate; see syncExpiry)
//   Active/Expired -> Closed / Revoked
export const STATUSES = [
  "Submitted",
  "Rejected",
  "Payment due",
  "Payment confirmed",
  "Active",
  "Renewal submitted",
  "Renewal payment due",
  "Renewal payment confirmed",
  "Expired",
  "Closed",
  "Revoked",
];

export function formatDate(date) {
  return date.toISOString().slice(0, 10);
}

export function addMonths(dateStr, months) {
  const d = new Date(dateStr);
  d.setMonth(d.getMonth() + months);
  return formatDate(d);
}

export function findTemplate(id) {
  return licenseTemplates.find((t) => t.id === id);
}

export function findLicense(id) {
  return licenses.find((l) => l.id === id);
}

export function findPayment(id) {
  return payments.find((p) => p.id === id);
}

export function createTemplate(body = {}) {
  const item = {
    id: `TPL-${nextTemplateNum++}`,
    name: body.name || "Untitled template",
    code: body.code || "",
    category: body.category || "Operating license",
    description: body.description || "",
    feeETB: Number(body.feeETB) || 0,
    validityMonths: Number(body.validityMonths) || 12,
    terms: Array.isArray(body.terms) ? body.terms.filter(Boolean) : [],
    status: body.status || "Active",
    createdAt: formatDate(new Date()),
  };
  licenseTemplates.push(item);
  return item;
}

export function createPayment({ licenseId, enterpriseName, purpose, amount }) {
  const payment = {
    id: `PAY-${String(nextPaymentNum++).padStart(5, "0")}`,
    licenseId,
    enterpriseName,
    purpose,
    amount,
    method: "telebirr",
    status: "Pending",
    phone: "",
    telebirrRef: "",
    createdAt: formatDate(new Date()),
    completedAt: null,
  };
  payments.push(payment);
  return payment;
}

/**
 * Submits a license application — either an enterprise applying for itself,
 * or an officer applying on an enterprise's behalf. Always starts as
 * "Submitted"; nothing is issued or charged until an institution reviews it.
 */
export function submitApplication({ enterprise, template, by }) {
  const year = new Date().getFullYear();
  const licenseNumber = `LIC-${year}-${String(nextLicenseNum++).padStart(5, "0")}`;
  const item = {
    id: `LC-${Date.now().toString(36).toUpperCase()}`,
    licenseNumber,
    enterpriseId: enterprise.id,
    enterpriseName: enterprise.name,
    templateId: template.id,
    templateName: template.name,
    category: template.category,
    feeETB: template.feeETB,
    status: "Submitted",
    issueDate: null,
    expiryDate: null,
    issuedBy: null,
    history: [
      { action: "Application submitted", by, date: formatDate(new Date()), note: `${template.name} application submitted for ${enterprise.name}` },
    ],
  };
  licenses.push(item);
  return item;
}

/** Finds a currently-open (Pending) payment for a license, if any. */
export function findPendingPayment(licenseId) {
  return payments.find((p) => p.licenseId === licenseId && p.status === "Pending");
}

/** Licenses expiring within `withinDays` days, still Active. Used for reminders. */
export function getExpiringLicenses(withinDays = 30) {
  const today = new Date();
  const cutoff = new Date(today);
  cutoff.setDate(cutoff.getDate() + withinDays);
  return licenses.filter((l) => {
    if (l.status !== "Active" || !l.expiryDate) return false;
    const expiry = new Date(l.expiryDate);
    return expiry >= today && expiry <= cutoff;
  });
}
