export const analyticsKpis = [
  { label: "Production index", value: "108.4", delta: "+3.1 pts", trend: "up", color: "primary" },
  { label: "Capacity utilization", value: "71.6%", delta: "+1.8 pts", trend: "up", color: "secondary" },
  { label: "FDI inflow (USD)", value: "$318M", delta: "-2.2%", trend: "down", color: "accent" },
  { label: "Import dependency", value: "46.3%", delta: "-0.9 pts", trend: "down", color: "info" },
];

export const productionSalesTrend = {
  labels: ["Q3'25", "Q4'25", "Q1'26", "Q2'26"],
  production: [142, 148, 151, 159],
  sales: [131, 139, 143, 151],
};

export const genderByRegion = {
  labels: ["Addis Ababa", "Oromia", "Amhara", "Tigray", "SNNPR"],
  female: [52, 48, 45, 41, 47],
  male: [48, 52, 55, 59, 53],
};

export const constraints = {
  labels: ["Access to finance", "Foreign currency", "Market access", "Raw materials", "Power supply", "Logistics", "Skilled labor"],
  values: [68, 61, 54, 49, 44, 38, 31],
};

export const ictAdoption = {
  labels: ["Internet access", "Computer use", "Accounting software", "ERP system", "E-commerce", "Digital payments"],
  values: [81, 64, 47, 22, 29, 53],
};
