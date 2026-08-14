/**
 * National Manufacturing Industry Survey (NMIS V16) Schema & Data Store
 * Contains comprehensive definitions for all 10 Modules (M1 – M10)
 * matching the official Ministry of Industry / Central Statistics survey questionnaire.
 */

export const campaigns = [
  { id: "CMP-1", name: "2026 Annual Manufacturing Survey (NMIS V16)", period: "Aug – Sep 2026", target: 12480, done: 8214, status: "Open" },
  { id: "CMP-2", name: "Q2 ICT Adoption & Automation Survey", period: "Jun – Jul 2026", target: 4200, done: 4200, status: "Closed" },
  { id: "CMP-3", name: "FDI & Investment Pulse Check", period: "Jul – Aug 2026", target: 960, done: 210, status: "Open" },
  { id: "CMP-4", name: "Sector-Specific: Leather Value Chain", period: "Sep 2026", target: 340, done: 0, status: "Scheduled" },
  { id: "CMP-5", name: "Training & Skills Gap Survey", period: "May – Jun 2026", target: 5100, done: 4890, status: "Closed" },
  { id: "CMP-6", name: "Technology & Automation Census", period: "Oct 2026", target: 12480, done: 0, status: "Scheduled" },
];

export const NMIS_MODULES_META = [
  { id: "M1", code: "M1", title: "Identification & Location", desc: "Admin hierarchy, GIS coordinates, ISIC 4-digit code, TIN and contact details." },
  { id: "M2", code: "M2", title: "Basic Establishment Info", desc: "Top products, legal form, paid-up capital, power demand (kW) and land area (m²)." },
  { id: "M3", code: "M3", title: "Manpower, Jobs & Wages", desc: "11 education levels by gender, 10 job divisions, monthly salaries and benefits." },
  { id: "M4", code: "M4", title: "Products, Output & Capacity", desc: "Ex-factory production vs. full designed capacity, export shares and other receipts." },
  { id: "M5", code: "M5", title: "Inventory & Stocks", desc: "Beginning vs. end-of-year inventory (raw materials, WIP, finished goods) and CGS." },
  { id: "M6", code: "M6", title: "Raw Materials, Energy & Taxes", desc: "Local vs. imported inputs, electricity/diesel utility bills, and indirect taxes." },
  { id: "M7", code: "M7", title: "Fixed Assets & Financing", desc: "Book values, annual CapEx additions, depreciation schedule and financing sources." },
  { id: "M8", code: "M8", title: "Operational Bottlenecks", desc: "Top 3 capacity constraints, forex access, loan hurdles and import substitution drivers." },
  { id: "M9", code: "M9", title: "ICT & Automation Adoption", desc: "Computer density, LAN, internet use cases, web/app presence and process automation." },
  { id: "M10", code: "M10", title: "Waste, Govt Support & CSR", desc: "Industrial waste types, recycling strategies, government incentives and community impact." },
];

export const NMIS_SAMPLE_RESPONSE = {
  // M1: Identification
  m1: {
    region: "Addis Ababa",
    zone: "Bole Subcity",
    wereda: "Wereda 08",
    town: "Addis Ababa",
    subCity: "Bole",
    kebele: "Kebele 14",
    specificLocation: "Bole Lemi Industrial Park, Phase 1",
    houseNo: "Factory Shed #04",
    surveyYear: 2026,
    isicCode: "1410",
    registeredName: "Bole Lemi Garments PLC",
    tradeName: "BLG Apparel",
    tin: "0012348765",
    phone: "+251 91 234 5678",
    pobox: "PO Box 1024",
    email: "operations@bolelemi.example.et",
    lat: 8.9806,
    lng: 38.7578,
  },

  // M2: Basic Info & Capital
  m2: {
    majorProducts: "Cotton Polo Shirts, Export T-Shirts, Twill Workwear",
    branchCount: 1,
    commencementDate: "12/04/2011",
    booksOfAccount: "1", // Full books
    calendarType: "1", // Ethiopian fiscal year
    ownershipType: "1", // Private
    publicShare: 0,
    privateShare: 100,
    privatized: "2", // No
    legalForm: "4", // Private Limited Company
    ownersMale: 3,
    ownersFemale: 2,
    initialCapitalEthMale: 4500000,
    initialCapitalEthFemale: 2500000,
    initialCapitalForeign: 0,
    initialCapitalPublic: 0,
    currentCapitalEthMale: 18000000,
    currentCapitalEthFemale: 12000000,
    currentCapitalForeign: 0,
    currentCapitalPublic: 0,
    operatingMonths: 12,
    locationType: "1", // Industrial Park
    industrialPark: "Bole Lemi (1) Industry Park",
    totalLandAreaSqM: 14500,
    buildingFootprintSqM: 9200,
    installedPowerKw: 850,
    additionalPowerRequiredKw: 250,
  },

  // M3: Manpower & Wages
  m3: {
    citizenshipManagement: "3", // Both Ethiopian and Foreign
    citizenshipWorkers: "1", // Ethiopian only
    shiftsCount: 2,
    headcountSummary: {
      permanentMale: 112,
      permanentFemale: 168,
      contractMale: 14,
      contractFemale: 18,
      foreignStaff: 3,
    },
    educationMatrix: [
      { level: "Technical Diploma (3-5 Yrs)", male: 28, female: 42, avgSalary: 11500 },
      { level: "BA/BSc Degree", male: 16, female: 22, avgSalary: 16800 },
      { level: "Basic Education (Grades 9-12)", male: 68, female: 104, avgSalary: 6800 },
    ],
    jobDivisions: [
      { dept: "Top Management", male: 4, female: 2, avgSalary: 45000 },
      { dept: "Production Workers", male: 78, female: 132, avgSalary: 7200 },
      { dept: "Quality Control", male: 12, female: 18, avgSalary: 12400 },
      { dept: "Maintenance & Engineering", male: 14, female: 2, avgSalary: 14500 },
    ],
    annualGrossWages: 28450000,
    annualBenefits: 2100000,
    pensionInsurancePaid: 1980000,
  },

  // M4: Products, Output & Full Capacity
  m4: {
    products: [
      { name: "Cotton Polo Shirts", code: "TEX-101", uom: "Pcs", unitPrice: 240, qtyProduced: 480000, valProduced: 115200000, salesQty: 460000, salesVal: 110400000, exportQty: 380000, exportVal: 91200000, fullCapacityVal: 144000000 },
      { name: "Export Knit T-Shirts", code: "TEX-102", uom: "Pcs", unitPrice: 160, qtyProduced: 650000, valProduced: 104000000, salesQty: 640000, salesVal: 102400000, exportQty: 580000, exportVal: 92800000, fullCapacityVal: 130000000 },
      { name: "Industrial Workwear", code: "TEX-103", uom: "Sets", unitPrice: 580, qtyProduced: 45000, valProduced: 26100000, salesQty: 42000, salesVal: 24360000, exportQty: 10000, exportVal: 5800000, fullCapacityVal: 34800000 },
    ],
    otherReceipts: {
      repairMaintenanceForOthers: 140000,
      goodsResoldWithoutTransformation: 0,
      industrialServices: 280000,
      interestReceived: 65000,
    },
  },

  // M5: Inventory & Stocks
  m5: {
    finishedGoodsBeg: 8400000,
    finishedGoodsEnd: 9200000,
    semiFinishedBeg: 3100000,
    semiFinishedEnd: 3600000,
    rawMaterialsBeg: 14200000,
    rawMaterialsEnd: 16800000,
    costOfGoodsProduced: 162400000,
  },

  // M6: Raw Materials, Energy & Taxes
  m6: {
    rawMaterials: [
      { name: "Cotton Carded Yarn", uom: "Kg", localQty: 420000, localVal: 48300000, importQty: 180000, importVal: 23400000, fullCapacityVal: 86000000 },
      { name: "Dyestuffs & Auxiliaries", uom: "Ltr", localQty: 12000, localVal: 1800000, importQty: 45000, importVal: 9450000, fullCapacityVal: 13500000 },
      { name: "Zippers, Buttons & Thread", uom: "Pack", localQty: 35000, localVal: 2450000, importQty: 28000, importVal: 2240000, fullCapacityVal: 5800000 },
    ],
    utilities: {
      electricityCost: 2840000,
      dieselCost: 1450000,
      fuelOilCost: 0,
      waterCost: 380000,
      repairMaintenanceDoneByOthers: 890000,
    },
    taxesPaid: {
      vat: 14200000,
      tot: 0,
      exciseTax: 0,
      customsDuty: 3800000,
    },
  },

  // M7: Fixed Assets & Investments
  m7: {
    fixedAssets: [
      { assetType: "Non-Residential Buildings", begValue: 48000000, additions: 2500000, disposals: 0, depreciation: 2400000 },
      { assetType: "Machinery & Equipment", begValue: 72000000, additions: 8400000, disposals: 400000, depreciation: 7200000 },
      { assetType: "Vehicles & Transport", begValue: 6800000, additions: 0, disposals: 600000, depreciation: 1200000 },
      { assetType: "Computers & Software", begValue: 2400000, additions: 850000, disposals: 0, depreciation: 650000 },
    ],
    financeSource: {
      ownFundsFixed: 6500000,
      bankLoanFixed: 5250000,
      foreignFdiFixed: 0,
      workingCapitalBankLoan: 15000000,
    },
  },

  // M8: Bottlenecks & Capacity Constraints
  m8: {
    topCapacityConstraints: [
      { rank: 1, reason: "Shortage of foreign exchange for raw materials / spares" },
      { rank: 2, reason: "Power outage and voltage instability" },
      { rank: 3, reason: "Local supply of raw materials insufficient & inconsistent" },
    ],
    marketAccessHurdles: "Unable to compete foreign products in lead time / delivery logistics",
    loanAcquired: "1", // Yes
    loanHurdles: "Loan processing procedure takes too long and high collateral ratio",
    importReason: "Required quality and tensile strength yarn not available locally",
  },

  // M9: ICT & Technology Adoption
  m9: {
    usesComputers: "1", // Yes
    computerCount: 42,
    hasLan: "1", // Yes
    pctWorkersUsingComputers: 35,
    usesInternet: "1", // Yes
    pctWorkersUsingInternet: 28,
    internetUseCases: ["E-mail", "Placing purchase orders", "Receiving buyer orders", "Government tax filing", "Instant messaging"],
    hasWebsite: "1", // Yes
    websiteUseCases: ["Online product catalogue & specifications", "Receiving international buyer inquiries", "Marketing promotion"],
    appliedTechAreas: ["Product pattern CAD design", "Raw material quality testing", "Final garment QA/QC", "HR & payroll management", "Inventory warehouse ERP"],
  },

  // M10: Waste, Govt Support & CSR
  m10: {
    wasteGenerated: ["Solid fabric scraps", "Packaging waste", "Liquid dye effluent"],
    wasteStrategies: ["Recycling fabric offcuts into cotton batting", "Effluent Treatment Plant (ETP) wastewater recycling", "Authorized landfill disposal"],
    govtSupportCommencement: ["Subsidized industrial park shed lease", "Zero duty on capital goods imports", "Corporate income tax holiday (5 years)"],
    govtSupportFiscalYear: ["Priority forex queue for cotton yarn", "Fast-track export customs green lane", "Export tax rebate"],
    communitySupport: ["Created 312 direct local jobs (62% youth & women)", "Free on-site technical skills training center", "Subsidized workwear supply to local schools"],
  },
};

export const baselineForm = {
  title: "2026 Annual Manufacturing Survey (NMIS V16)",
  sectionLabel: "Module 3 of 10 — Manpower, Education, Jobs & Wages",
  savedAt: "Auto-saved 11:24",
  steps: NMIS_MODULES_META.map((m, idx) => ({
    id: m.id,
    label: m.code,
    title: m.title,
    state: idx === 2 ? "current" : idx < 2 ? "done" : "pending",
  })),
  fields: [
    { label: "Total permanent employees", value: "280" },
    { label: "Total temporary / contract employees", value: "32" },
    { label: "Female employees", value: "186" },
    { label: "Male employees", value: "126" },
    { label: "Foreign nationals employed", value: "3" },
    { label: "Average monthly wage (ETB)", value: "9,850" },
  ],
  totalHeadcount: 312,
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
    assignBySector: ["All sectors", "Food & Beverage only", "Textile & Garment only"],
    assignBySize: ["All sizes", "Medium & Large only"],
    openingDate: "01 Aug 2026",
    closingDate: "30 Sep 2026",
  },
};
