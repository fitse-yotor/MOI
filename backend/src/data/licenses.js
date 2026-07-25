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

export function formatDate(date) {
  return date.toISOString().slice(0, 10);
}

function addMonths(dateStr, months) {
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

function createPayment({ licenseId, enterpriseName, purpose, amount }) {
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
 * Issues a new license to an enterprise from a template. Free templates
 * (feeETB === 0) activate immediately; paid ones open in "Pending payment"
 * with a linked Telebirr payment row for the enterprise to settle.
 */
export function createLicense({ enterprise, template, issuedBy }) {
  const year = new Date().getFullYear();
  const licenseNumber = `LIC-${year}-${String(nextLicenseNum++).padStart(5, "0")}`;
  const requiresPayment = template.feeETB > 0;
  const item = {
    id: `LC-${Date.now().toString(36).toUpperCase()}`,
    licenseNumber,
    enterpriseId: enterprise.id,
    enterpriseName: enterprise.name,
    templateId: template.id,
    templateName: template.name,
    category: template.category,
    feeETB: template.feeETB,
    status: requiresPayment ? "Pending payment" : "Active",
    issueDate: requiresPayment ? null : formatDate(new Date()),
    expiryDate: requiresPayment ? null : addMonths(formatDate(new Date()), template.validityMonths),
    issuedBy,
    history: [
      { action: "Issued", by: issuedBy, date: formatDate(new Date()), note: `${template.name} issued to ${enterprise.name}` },
    ],
  };
  licenses.push(item);

  let payment = null;
  if (requiresPayment) {
    payment = createPayment({
      licenseId: item.id,
      enterpriseName: enterprise.name,
      purpose: "issue",
      amount: template.feeETB,
    });
  }
  return { license: item, payment };
}

export { addMonths, createPayment };
