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

// --- Seed demo data ---------------------------------------------------------
// Populated at startup so the Licenses pages, certificate previews and
// enterprise websites have realistic records on first run.
const day = (y, m, d) => formatDate(new Date(Date.UTC(y, m - 1, d)));

licenses.push(
  {
    id: "LC-SEED-001", licenseNumber: "LIC-2025-00001", enterpriseId: "ENT-1001",
    enterpriseName: "Bole Lemi Garments PLC", templateId: "TPL-1", templateName: "Manufacturing Operating License",
    category: "Operating license", feeETB: 5000, status: "Active",
    issueDate: day(2025, 9, 1), expiryDate: day(2026, 9, 1), issuedBy: "Tsion Bekele",
    history: [
      { action: "Application submitted", by: "Aster Kebede", date: day(2025, 8, 20), note: "Manufacturing Operating License application submitted for Bole Lemi Garments PLC" },
      { action: "Application approved", by: "Tsion Bekele", date: day(2025, 8, 26), note: "" },
      { action: "Payment confirmed", by: "Bole Lemi Garments PLC", date: day(2025, 8, 28), note: "Paid ETB 5,000 via Telebirr (ref TLB2025082801)" },
      { action: "Issued", by: "Tsion Bekele", date: day(2025, 9, 1), note: "Manufacturing Operating License issued to Bole Lemi Garments PLC" },
    ],
  },
  {
    id: "LC-SEED-002", licenseNumber: "LIC-2025-00002", enterpriseId: "ENT-1004",
    enterpriseName: "Hawassa Leather Products", templateId: "TPL-2", templateName: "Environmental Compliance Certificate",
    category: "Compliance certificate", feeETB: 3200, status: "Active",
    issueDate: day(2025, 3, 15), expiryDate: day(2027, 3, 15), issuedBy: "Abrham Girma",
    history: [
      { action: "Application submitted", by: "Meron Tadesse", date: day(2025, 3, 1), note: "Environmental Compliance Certificate application submitted for Hawassa Leather Products" },
      { action: "Application approved", by: "Abrham Girma", date: day(2025, 3, 10), note: "" },
      { action: "Payment confirmed", by: "Hawassa Leather Products", date: day(2025, 3, 12), note: "Paid ETB 3,200 via Telebirr (ref TLB2025031201)" },
      { action: "Issued", by: "Abrham Girma", date: day(2025, 3, 15), note: "Environmental Compliance Certificate issued to Hawassa Leather Products" },
    ],
  },
  {
    id: "LC-SEED-003", licenseNumber: "LIC-2026-00003", enterpriseId: "ENT-1005",
    enterpriseName: "Bahir Dar Textiles PLC", templateId: "TPL-3", templateName: "Export Permit License",
    category: "Trade permit", feeETB: 2500, status: "Payment due",
    issueDate: null, expiryDate: null, issuedBy: null,
    history: [
      { action: "Application submitted", by: "Yohannes Alebachew", date: day(2026, 7, 28), note: "Export Permit License application submitted for Bahir Dar Textiles PLC" },
      { action: "Application approved", by: "Tsion Bekele", date: day(2026, 8, 2), note: "" },
    ],
  },
  {
    id: "LC-SEED-004", licenseNumber: "LIC-2026-00004", enterpriseId: "ENT-1002",
    enterpriseName: "Adama Agro Processing", templateId: "TPL-1", templateName: "Manufacturing Operating License",
    category: "Operating license", feeETB: 5000, status: "Submitted",
    issueDate: null, expiryDate: null, issuedBy: null,
    history: [
      { action: "Application submitted", by: "Dawit Alemu", date: day(2026, 8, 5), note: "Manufacturing Operating License application submitted for Adama Agro Processing" },
    ],
  },
  {
    id: "LC-SEED-005", licenseNumber: "LIC-2024-00005", enterpriseId: "ENT-1006",
    enterpriseName: "Dire Dawa Chemical Industries", templateId: "TPL-3", templateName: "Export Permit License",
    category: "Trade permit", feeETB: 2500, status: "Expired",
    issueDate: day(2024, 6, 1), expiryDate: day(2025, 6, 1), issuedBy: "Tsion Bekele",
    history: [
      { action: "Application submitted", by: "Nuru Ahmed", date: day(2024, 5, 10), note: "Export Permit License application submitted for Dire Dawa Chemical Industries" },
      { action: "Application approved", by: "Tsion Bekele", date: day(2024, 5, 20), note: "" },
      { action: "Payment confirmed", by: "Dire Dawa Chemical Industries", date: day(2024, 5, 22), note: "Paid ETB 2,500 via Telebirr (ref TLB2024052201)" },
      { action: "Issued", by: "Tsion Bekele", date: day(2024, 6, 1), note: "Export Permit License issued to Dire Dawa Chemical Industries" },
      { action: "Expired", by: "System", date: day(2025, 6, 2), note: "Validity period ended 2025-06-01" },
    ],
  },
);

// Pending Telebirr payment for the "Payment due" seed license above, so the
// checkout flow is immediately exercisable.
payments.push({
  id: "PAY-00001",
  licenseId: "LC-SEED-003",
  enterpriseName: "Bahir Dar Textiles PLC",
  purpose: "issue",
  amount: 2500,
  method: "telebirr",
  status: "Pending",
  phone: "",
  telebirrRef: "",
  createdAt: day(2026, 8, 2),
  completedAt: null,
});

nextLicenseNum = 6;
nextPaymentNum = 2;

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
