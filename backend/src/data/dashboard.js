export const kpis = {
  federal: [
    { label: "Registered enterprises", value: "12,480", delta: "+4.2% vs last quarter", trend: "up", color: "primary" },
    { label: "Total employment", value: "614,920", delta: "+2.8% YoY", trend: "up", color: "secondary" },
    { label: "Export revenue (USD)", value: "$1.92B", delta: "+6.1% YoY", trend: "up", color: "accent" },
    { label: "Pending verifications", value: "1,206", delta: "-3.4% this week", trend: "down", color: "error" },
  ],
  regional: [
    { label: "Regional enterprises", value: "2,140", delta: "+3.1% vs last quarter", trend: "up", color: "primary" },
    { label: "Regional employment", value: "98,340", delta: "+1.9% YoY", trend: "up", color: "secondary" },
    { label: "Awaiting regional review", value: "96", delta: "-8% this week", trend: "down", color: "error" },
    { label: "Data quality score", value: "88%", delta: "+2 pts", trend: "up", color: "accent" },
  ],
  woreda: [
    { label: "Woreda enterprises", value: "412", delta: "+1.4% this quarter", trend: "up", color: "primary" },
    { label: "Field visits this month", value: "58", delta: "+6", trend: "up", color: "secondary" },
    { label: "Awaiting woreda review", value: "312", delta: "+18 today", trend: "up", color: "error" },
    { label: "Overdue submissions", value: "24", delta: "-5 this week", trend: "down", color: "accent" },
  ],
  analyst: [
    { label: "Production index", value: "108.4", delta: "+3.1 pts", trend: "up", color: "primary" },
    { label: "Capacity utilization", value: "71.6%", delta: "+1.8 pts", trend: "up", color: "secondary" },
    { label: "FDI inflow (USD)", value: "$318M", delta: "-2.2%", trend: "down", color: "accent" },
    { label: "Import dependency", value: "46.3%", delta: "-0.9 pts", trend: "down", color: "info" },
  ],
  enterprise: [
    { label: "My submissions", value: "6", delta: "1 pending review", trend: "up", color: "primary" },
    { label: "Open linkage requests", value: "3", delta: "1 awaiting response", trend: "up", color: "secondary" },
    { label: "Document expiring soon", value: "1", delta: "Tax clearance", trend: "down", color: "error" },
    { label: "Profile completeness", value: "92%", delta: "+4 pts", trend: "up", color: "accent" },
  ],
};

export const growthSeries = {
  labels: ["Aug", "Sep", "Oct", "Nov", "Dec", "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul"],
  registered: [11020, 11180, 11340, 11480, 11620, 11780, 11910, 12040, 12160, 12270, 12380, 12480],
  verified: [9800, 10020, 10260, 10480, 10700, 10920, 11150, 11360, 11540, 11700, 11860, 12010],
};

export const regionPerformance = {
  labels: ["Addis Ababa", "Oromia", "Amhara", "Tigray", "SNNPR", "Sidama", "Dire Dawa"],
  employmentIndex: [128, 112, 104, 84, 98, 90, 76],
  productionIndex: [121, 118, 109, 79, 102, 94, 81],
};

export const reviewQueueSummary = [
  { label: "Woreda review", count: 312, pct: 64, color: "info" },
  { label: "Zonal review", count: 184, pct: 41, color: "secondary" },
  { label: "Regional approval", count: 96, pct: 28, color: "primary" },
  { label: "Federal approval", count: 28, pct: 12, color: "accentDark" },
];

export const activityFeed = [
  { who: "Aster Kebede", act: "submitted the 2026 Annual Survey", entity: "Bole Lemi Garments PLC", time: "12 min ago", tone: "info" },
  { who: "Samuel Fikru", act: "rejected submission SUB-20488", entity: "Adama Agro Processing", time: "48 min ago", tone: "error" },
  { who: "System", act: "completed nightly ETL sync from Customs Commission", entity: "1,204 records processed", time: "2 hr ago", tone: "muted" },
  { who: "Helen Tesfaye", act: "returned submission for correction", entity: "Mekelle Metal Works", time: "3 hr ago", tone: "warn" },
  { who: "Abrham Girma", act: "approved regional aggregation", entity: "Amhara Region · Q2 2026", time: "5 hr ago", tone: "success" },
];

export const dataQualityRadar = {
  labels: ["Completeness", "Uniqueness", "Consistency", "Accuracy", "Timeliness", "Validity"],
  values: [92, 88, 81, 86, 74, 90],
};
