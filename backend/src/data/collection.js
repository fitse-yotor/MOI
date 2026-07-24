export const campaigns = [
  { id: "CMP-1", name: "2026 Annual Manufacturing Survey", period: "Aug – Sep 2026", target: 12480, done: 8214, status: "Open" },
  { id: "CMP-2", name: "Q2 ICT Adoption Survey", period: "Jun – Jul 2026", target: 4200, done: 4200, status: "Closed" },
  { id: "CMP-3", name: "FDI & Investment Pulse Check", period: "Jul – Aug 2026", target: 960, done: 210, status: "Open" },
  { id: "CMP-4", name: "Sector-Specific: Leather Value Chain", period: "Sep 2026", target: 340, done: 0, status: "Scheduled" },
  { id: "CMP-5", name: "Training & Skills Gap Survey", period: "May – Jun 2026", target: 5100, done: 4890, status: "Closed" },
  { id: "CMP-6", name: "Technology & Automation Census", period: "Oct 2026", target: 12480, done: 0, status: "Scheduled" },
];

export const baselineForm = {
  title: "2026 Annual Manufacturing Survey",
  sectionLabel: "Section 2 of 7 — Employment, Wages & Salaries",
  savedAt: "Draft saved 09:41",
  steps: [
    { label: "Establishment", state: "done" },
    { label: "Employment", state: "current" },
    { label: "Products & Sales", state: "pending" },
    { label: "Raw Materials", state: "pending" },
    { label: "Costs", state: "pending" },
    { label: "Assets", state: "pending" },
    { label: "Review", state: "pending" },
  ],
  fields: [
    { label: "Total permanent employees", value: "184" },
    { label: "Total temporary / contract employees", value: "47" },
    { label: "Female employees", value: "96" },
    { label: "Male employees", value: "135" },
    { label: "Employees with disability", value: "4" },
    { label: "Foreign nationals employed", value: "2" },
    { label: "New jobs created this period", value: "18" },
    { label: "Vacancies (unfilled)", value: "6" },
    { label: "Average monthly wage (ETB)", value: "8,450" },
  ],
  totalHeadcount: 231,
};

export const questionnaireBuilder = {
  section: "Raw Materials & Inputs",
  fields: [
    { label: "Input type & name", type: "Text", required: true },
    { label: "Local or imported", type: "Single-select", required: true },
    { label: "Source country", type: "Single-select", required: false, note: "Conditional: shown if imported" },
    { label: "Quantity & unit cost", type: "Table / repeating", required: false, note: "Calculated total" },
  ],
  campaignSettings: {
    assignBySector: ["All sectors", "Food & Beverage only"],
    assignBySize: ["All sizes", "Medium & Large only"],
    openingDate: "01 Aug 2026",
    closingDate: "30 Sep 2026",
  },
};
