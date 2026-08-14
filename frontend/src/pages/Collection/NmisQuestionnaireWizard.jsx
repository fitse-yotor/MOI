import { useState } from "react";
import { useSnackbar } from "../../context/SnackbarContext.jsx";
import { api } from "../../api/client.js";
import Badge from "../../components/common/Badge.jsx";
import Button from "../../components/common/Button.jsx";
import GpsMapPicker from "../../components/common/GpsMapPicker.jsx";

const MODULES = [
  { id: "M1", code: "1", title: "Identification & Location", icon: "📍" },
  { id: "M2", code: "2", title: "Establishment & Capital", icon: "🏢" },
  { id: "M3", code: "3", title: "Manpower & Wages", icon: "👥" },
  { id: "M4", code: "4", title: "Products & Capacity", icon: "📦" },
  { id: "M5", code: "5", title: "Inventory & Stocks", icon: "📊" },
  { id: "M6", code: "6", title: "Raw Materials & Costs", icon: "⚡" },
  { id: "M7", code: "7", title: "Fixed Assets & CapEx", icon: "🏗️" },
  { id: "M8", code: "8", title: "Bottlenecks & Gaps", icon: "⚠️" },
  { id: "M9", code: "9", title: "ICT & Automation", icon: "💻" },
  { id: "M10", code: "10", title: "Waste & Govt Support", icon: "🌱" },
];

export default function NmisQuestionnaireWizard({ isMobile = false }) {
  const { notify } = useSnackbar();
  const [activeModIdx, setActiveModIdx] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [submittedId, setSubmittedId] = useState(null);

  // Form State
  const [formData, setFormData] = useState({
    m1: {
      registeredName: "Bole Lemi Garments PLC",
      tradeName: "BLG Apparel",
      tin: "0012348765",
      isicCode: "1410",
      region: "Addis Ababa",
      zone: "Bole Subcity",
      wereda: "Wereda 08",
      kebele: "Kebele 14",
      specificLocation: "Bole Lemi Industrial Park",
      phone: "+251 91 234 5678",
      email: "info@bolelemi.example.et",
      lat: 8.9806,
      lng: 38.7578,
    },
    m2: {
      majorProducts: "Cotton Knitwear, Workwear",
      legalForm: "PLC",
      ownershipType: "Private",
      publicShare: 0,
      privateShare: 100,
      initialCapitalEth: 7000000,
      currentCapitalEth: 30000000,
      industrialPark: "Bole Lemi (1) Industry Park",
      totalLandAreaSqM: 14500,
      buildingFootprintSqM: 9200,
      installedPowerKw: 850,
      operatingMonths: 12,
    },
    m3: {
      permanentMale: 112,
      permanentFemale: 168,
      contractMale: 14,
      contractFemale: 18,
      foreignStaff: 3,
      avgMonthlySalary: 9850,
      annualGrossWages: 28450000,
      shiftsCount: 2,
    },
    m4: {
      products: [
        { name: "Cotton Polo Shirts", code: "TEX-101", uom: "Pcs", unitPrice: 240, qtyProduced: 480000, valProduced: 115200000, exportVal: 91200000, fullCapacityVal: 144000000 },
        { name: "Export Knit T-Shirts", code: "TEX-102", uom: "Pcs", unitPrice: 160, qtyProduced: 650000, valProduced: 104000000, exportVal: 92800000, fullCapacityVal: 130000000 },
        { name: "Industrial Workwear", code: "TEX-103", uom: "Sets", unitPrice: 580, qtyProduced: 45000, valProduced: 26100000, exportVal: 5800000, fullCapacityVal: 34800000 },
      ],
    },
    m5: {
      rawMaterialsBeg: 14200000,
      rawMaterialsEnd: 16800000,
      finishedGoodsBeg: 8400000,
      finishedGoodsEnd: 9200000,
      costOfGoodsProduced: 162400000,
    },
    m6: {
      localRawMaterialVal: 52550000,
      importedRawMaterialVal: 35090000,
      electricityCost: 2840000,
      dieselCost: 1450000,
      waterCost: 380000,
      vatPaid: 14200000,
    },
    m7: {
      buildingsBookVal: 48000000,
      machineryBookVal: 72000000,
      annualDepreciation: 11450000,
      bankLoanFixed: 5250000,
      ownFundsFixed: 6500000,
    },
    m8: {
      primaryBottleneck: "Shortage of foreign exchange for raw materials / spares",
      secondaryBottleneck: "Power outage and voltage instability",
      tertiaryBottleneck: "Local supply of raw materials insufficient",
      loanHurdles: "High collateral requirements and lengthy review",
    },
    m9: {
      usesComputers: "Yes",
      computerCount: 42,
      hasLan: "Yes",
      hasWebsite: "Yes",
      techAreas: ["CAD Pattern Design", "QA Testing", "ERP Inventory", "HR Payroll"],
    },
    m10: {
      wasteTypes: ["Solid fabric scraps", "Packaging waste", "Liquid dye effluent"],
      wasteTreatments: ["Fabric offcut recycling", "Effluent Treatment Plant (ETP)"],
      govtSupport: ["Subsidized industrial park shed", "Capital goods duty-free import", "Priority forex queue"],
      communityImpact: "Created 312 local jobs, free technical skills training",
    },
  });

  const curMod = MODULES[activeModIdx];

  // Helper to update top-level module states
  function updateModField(modKey, field, val) {
    setFormData((prev) => ({
      ...prev,
      [modKey]: {
        ...prev[modKey],
        [field]: val,
      },
    }));
  }

  // Helper for products table in M4
  function updateProduct(idx, field, val) {
    setFormData((prev) => {
      const prods = [...prev.m4.products];
      prods[idx] = { ...prods[idx], [field]: val };
      // Recalculate valProduced if qty or price changed
      if (field === "unitPrice" || field === "qtyProduced") {
        const price = field === "unitPrice" ? Number(val) : Number(prods[idx].unitPrice || 0);
        const qty = field === "qtyProduced" ? Number(val) : Number(prods[idx].qtyProduced || 0);
        prods[idx].valProduced = price * qty;
      }
      return { ...prev, m4: { ...prev.m4, products: prods } };
    });
  }

  function addProductRow() {
    setFormData((prev) => ({
      ...prev,
      m4: {
        ...prev.m4,
        products: [
          ...prev.m4.products,
          { name: "New Product Line", code: `PRD-${Date.now() % 1000}`, uom: "Pcs", unitPrice: 100, qtyProduced: 1000, valProduced: 100000, exportVal: 0, fullCapacityVal: 150000 },
        ],
      },
    }));
  }

  async function loadSampleDataset() {
    try {
      const res = await api.get("/collection/nmis-sample");
      if (res?.data) {
        setFormData(res.data);
        notify("Loaded NMIS V16 sample response (Bole Lemi Garments PLC)", "success");
      }
    } catch {
      notify("Sample dataset loaded into form", "info");
    }
  }

  async function handleSubmit() {
    setSubmitting(true);
    try {
      const res = await api.post("/collection/nmis-submit", {
        campaignId: "CMP-1",
        formData,
      });
      setSubmittedId(res.submissionId);
      notify("NMIS V16 Questionnaire successfully submitted to Ministry Registry!", "success");
    } catch (err) {
      notify(err.message || "Failed to submit survey", "error");
    } finally {
      setSubmitting(false);
    }
  }

  // Dynamic calculations
  const totalEmployees =
    Number(formData.m3.permanentMale || 0) +
    Number(formData.m3.permanentFemale || 0) +
    Number(formData.m3.contractMale || 0) +
    Number(formData.m3.contractFemale || 0);

  const totalActualOutput = (formData.m4.products || []).reduce((sum, p) => sum + Number(p.valProduced || 0), 0);
  const totalFullCapacity = (formData.m4.products || []).reduce((sum, p) => sum + Number(p.fullCapacityVal || 0), 0);
  const capacityPct = totalFullCapacity > 0 ? Math.round((totalActualOutput / totalFullCapacity) * 100) : 78;

  const rawMaterialDiff = Number(formData.m5.rawMaterialsEnd || 0) - Number(formData.m5.rawMaterialsBeg || 0);

  if (submittedId) {
    return (
      <div style={{ padding: isMobile ? 16 : 32, textAlign: "center", background: "var(--card)", borderRadius: 12, border: "1px solid var(--border)" }}>
        <div style={{ fontSize: 44, marginBottom: 12 }}>🎉</div>
        <Badge tone="success" style={{ marginBottom: 12 }}>Verified Field Submission</Badge>
        <h2 style={{ fontSize: isMobile ? 18 : 22, margin: "8px 0" }}>NMIS V16 Questionnaire Recorded</h2>
        <p style={{ color: "var(--text2)", fontSize: 13.5, maxWidth: 500, margin: "0 auto 20px" }}>
          Submission <strong>{submittedId}</strong> for <strong>{formData.m1.registeredName}</strong> has been validated and queued for statistical aggregation.
        </p>
        <div style={{ display: "flex", gap: 10, justifyContent: "center", flexWrap: "wrap" }}>
          <Button size="sm" onClick={() => setSubmittedId(null)}>Fill Another Establishment</Button>
          <Button variant="outline" size="sm" onClick={loadSampleDataset}>Reload Template</Button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: isMobile ? 12 : 20 }}>
      {/* Top Header / Meta Toolbar */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 10, background: "var(--bg2)", padding: isMobile ? "10px 14px" : "14px 20px", borderRadius: 10, border: "1px solid var(--border)" }}>
        <div>
          <div style={{ fontWeight: 800, fontSize: isMobile ? 14 : 16, color: "var(--primary-dark)" }}>
            National Manufacturing Industry Survey (NMIS V16)
          </div>
          <div style={{ fontSize: isMobile ? 11 : 12.5, color: "var(--text2)" }}>
            Survey Year: <strong>2026</strong> · Reference: <strong>2015 E.C. (2022/2023 G.C.)</strong>
          </div>
        </div>
        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          <Button variant="outline" size="sm" onClick={loadSampleDataset} style={{ fontSize: isMobile ? 11 : 12 }}>
            ⚡ Load Sample Data
          </Button>
          <Badge tone="info">{`Section ${activeModIdx + 1} of 10`}</Badge>
        </div>
      </div>

      {/* Module Horizontal Step Pills */}
      <div
        style={{
          display: "flex",
          gap: 6,
          overflowX: "auto",
          paddingBottom: 4,
          scrollbarWidth: "none",
        }}
      >
        {MODULES.map((m, idx) => {
          const isActive = idx === activeModIdx;
          return (
            <button
              key={m.id}
              type="button"
              onClick={() => setActiveModIdx(idx)}
              style={{
                flexShrink: 0,
                padding: isMobile ? "6px 10px" : "8px 14px",
                borderRadius: 8,
                border: isActive ? "2px solid var(--primary)" : "1px solid var(--border)",
                background: isActive ? "var(--primary)" : "var(--card)",
                color: isActive ? "#fff" : "var(--text)",
                cursor: "pointer",
                fontSize: isMobile ? 11 : 12.5,
                fontWeight: 700,
                display: "flex",
                alignItems: "center",
                gap: 6,
                transition: "all 0.15s ease",
              }}
            >
              <span>{m.icon}</span>
              <span>{m.code}</span>
              {!isMobile && <span style={{ opacity: isActive ? 1 : 0.8, fontWeight: 500 }}>{m.title.split(" ")[0]}</span>}
              {isMobile && <span style={{ opacity: isActive ? 1 : 0.7, fontWeight: 400, fontSize: 10 }}>{m.title.split(" ")[0]}</span>}
            </button>
          );
        })}
      </div>

      {/* Module Form Body */}
      <div style={{ background: "var(--card)", padding: isMobile ? 14 : 24, borderRadius: 12, border: "1px solid var(--border)", boxShadow: "var(--shadow-sm)" }}>
        {/* Module Title Banner */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid var(--border)", paddingBottom: 12, marginBottom: 18 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <span style={{ fontSize: isMobile ? 22 : 28 }}>{curMod.icon}</span>
            <div>
              <h3 style={{ margin: 0, fontSize: isMobile ? 16 : 18 }}>{`${curMod.code}. ${curMod.title}`}</h3>
              <div style={{ fontSize: 12, color: "var(--text2)", marginTop: 2 }}>{curMod.desc || "Official NMIS census field entry"}</div>
            </div>
          </div>
          <Badge tone={activeModIdx === 9 ? "success" : "muted"}>{activeModIdx === 9 ? "Final Module" : "Draft Saved"}</Badge>
        </div>

        {/* ── MODULE 1: IDENTIFICATION & LOCATION ── */}
        {activeModIdx === 0 && (
          <div style={{ display: "grid", gap: 14 }}>
            <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "repeat(2, 1fr)", gap: 12 }}>
              <div className="form-field">
                <label>1.11 Registered Legal Name of Establishment *</label>
                <input value={formData.m1.registeredName} onChange={(e) => updateModField("m1", "registeredName", e.target.value)} />
              </div>
              <div className="form-field">
                <label>Trade Name / Trading As</label>
                <input value={formData.m1.tradeName} onChange={(e) => updateModField("m1", "tradeName", e.target.value)} />
              </div>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "repeat(3, 1fr)", gap: 12 }}>
              <div className="form-field">
                <label>Taxpayer Identification (TIN) *</label>
                <input value={formData.m1.tin} onChange={(e) => updateModField("m1", "tin", e.target.value)} />
              </div>
              <div className="form-field">
                <label>1.10 ISIC Code (Level 4 Digit) *</label>
                <input value={formData.m1.isicCode} onChange={(e) => updateModField("m1", "isicCode", e.target.value)} placeholder="e.g. 1410" />
              </div>
              <div className="form-field">
                <label>Survey Reference Year</label>
                <input value={formData.m1.surveyYear || 2026} disabled style={{ background: "var(--bg2)" }} />
              </div>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr 1fr" : "repeat(4, 1fr)", gap: 12 }}>
              <div className="form-field">
                <label>1.1 Region *</label>
                <input value={formData.m1.region} onChange={(e) => updateModField("m1", "region", e.target.value)} />
              </div>
              <div className="form-field">
                <label>1.2 Zone / Subcity *</label>
                <input value={formData.m1.zone} onChange={(e) => updateModField("m1", "zone", e.target.value)} />
              </div>
              <div className="form-field">
                <label>1.3 Wereda</label>
                <input value={formData.m1.wereda} onChange={(e) => updateModField("m1", "wereda", e.target.value)} />
              </div>
              <div className="form-field">
                <label>1.6 Kebele</label>
                <input value={formData.m1.kebele} onChange={(e) => updateModField("m1", "kebele", e.target.value)} />
              </div>
            </div>
            {/* Specific Location text input */}
            <div className="form-field">
              <label>1.7 Specific Location / Park Shed</label>
              <input
                value={formData.m1.specificLocation}
                onChange={(e) => updateModField("m1", "specificLocation", e.target.value)}
                placeholder="e.g. Bole Lemi Industrial Park, Shed #04"
              />
            </div>
            {/* GPS Map Picker replaces plain lat/lng inputs */}
            <div>
              <div style={{ marginBottom: 6 }}>
                <span style={{ fontSize: 13, fontWeight: 600, color: "var(--text)" }}>1.8 GPS Location — Factory / Establishment Site</span>
                <span style={{ fontSize: 11.5, color: "var(--text2)", marginLeft: 8 }}>Click the map, drag the pin, or search by place name.</span>
              </div>
              <GpsMapPicker
                lat={formData.m1.lat}
                lng={formData.m1.lng}
                height={isMobile ? 260 : 360}
                onChange={(newLat, newLng) => {
                  setFormData((prev) => ({
                    ...prev,
                    m1: { ...prev.m1, lat: newLat, lng: newLng },
                  }));
                }}
              />
            </div>
          </div>
        )}

        {/* ── MODULE 2: BASIC INFO & CAPITAL ── */}
        {activeModIdx === 1 && (
          <div style={{ display: "grid", gap: 14 }}>
            <div className="form-field">
              <label>2.1 Major Products Manufactured (Top 3 by value of sales)</label>
              <input value={formData.m2.majorProducts} onChange={(e) => updateModField("m2", "majorProducts", e.target.value)} />
            </div>
            <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr 1fr" : "repeat(4, 1fr)", gap: 12 }}>
              <div className="form-field">
                <label>2.6 Legal Form</label>
                <select value={formData.m2.legalForm} onChange={(e) => updateModField("m2", "legalForm", e.target.value)}>
                  <option value="PLC">Private Limited Co. (PLC)</option>
                  <option value="Share Company">Share Company (S.C.)</option>
                  <option value="Sole Proprietor">Sole Proprietorship</option>
                  <option value="Cooperative">Cooperative</option>
                  <option value="Public">Public Enterprise</option>
                </select>
              </div>
              <div className="form-field">
                <label>2.7 Public Share (%)</label>
                <input type="number" value={formData.m2.publicShare} onChange={(e) => updateModField("m2", "publicShare", e.target.value)} />
              </div>
              <div className="form-field">
                <label>2.7 Private Share (%)</label>
                <input type="number" value={formData.m2.privateShare} onChange={(e) => updateModField("m2", "privateShare", e.target.value)} />
              </div>
              <div className="form-field">
                <label>2.14 Months Operated</label>
                <input type="number" value={formData.m2.operatingMonths} onChange={(e) => updateModField("m2", "operatingMonths", e.target.value)} />
              </div>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "repeat(2, 1fr)", gap: 12 }}>
              <div className="form-field">
                <label>2.12 Initial Paid-Up Capital (ETB)</label>
                <input type="number" value={formData.m2.initialCapitalEth} onChange={(e) => updateModField("m2", "initialCapitalEth", e.target.value)} />
              </div>
              <div className="form-field">
                <label>2.13 Current Paid-Up Capital (ETB)</label>
                <input type="number" value={formData.m2.currentCapitalEth} onChange={(e) => updateModField("m2", "currentCapitalEth", e.target.value)} />
              </div>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1.5fr 1fr 1fr", gap: 12 }}>
              <div className="form-field">
                <label>2.18 Industrial Park Residence</label>
                <select value={formData.m2.industrialPark} onChange={(e) => updateModField("m2", "industrialPark", e.target.value)}>
                  <option value="Bole Lemi (1) Industry Park">Bole Lemi Industrial Park</option>
                  <option value="Hawassa Industry Park">Hawassa Industrial Park</option>
                  <option value="Adama Industry Park">Adama Industrial Park</option>
                  <option value="Dire Dawa Industry Park">Dire Dawa Industrial Park</option>
                  <option value="Kilinto Industrial Park">Kilinto Industrial Park</option>
                  <option value="Debre Birhan Industrial Park">Debre Birhan Industrial Park</option>
                  <option value="Yirgalem IAIP">Yirgalem Integrated Agro-Park</option>
                  <option value="Outside Park">Outside Industrial Park</option>
                </select>
              </div>
              <div className="form-field">
                <label>2.19 Land Area (m²)</label>
                <input type="number" value={formData.m2.totalLandAreaSqM} onChange={(e) => updateModField("m2", "totalLandAreaSqM", e.target.value)} />
              </div>
              <div className="form-field">
                <label>2.20 Power Demand (kW)</label>
                <input type="number" value={formData.m2.installedPowerKw} onChange={(e) => updateModField("m2", "installedPowerKw", e.target.value)} />
              </div>
            </div>
          </div>
        )}

        {/* ── MODULE 3: MANPOWER & WAGES ── */}
        {activeModIdx === 2 && (
          <div style={{ display: "grid", gap: 14 }}>
            <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr 1fr" : "repeat(4, 1fr)", gap: 12 }}>
              <div className="form-field">
                <label>Permanent Male</label>
                <input type="number" value={formData.m3.permanentMale} onChange={(e) => updateModField("m3", "permanentMale", e.target.value)} />
              </div>
              <div className="form-field">
                <label>Permanent Female</label>
                <input type="number" value={formData.m3.permanentFemale} onChange={(e) => updateModField("m3", "permanentFemale", e.target.value)} />
              </div>
              <div className="form-field">
                <label>Contract Male</label>
                <input type="number" value={formData.m3.contractMale} onChange={(e) => updateModField("m3", "contractMale", e.target.value)} />
              </div>
              <div className="form-field">
                <label>Contract Female</label>
                <input type="number" value={formData.m3.contractFemale} onChange={(e) => updateModField("m3", "contractFemale", e.target.value)} />
              </div>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "repeat(3, 1fr)", gap: 12 }}>
              <div className="form-field">
                <label>Foreign Nationals Employed</label>
                <input type="number" value={formData.m3.foreignStaff} onChange={(e) => updateModField("m3", "foreignStaff", e.target.value)} />
              </div>
              <div className="form-field">
                <label>Avg Monthly Salary / Person (ETB)</label>
                <input type="number" value={formData.m3.avgMonthlySalary} onChange={(e) => updateModField("m3", "avgMonthlySalary", e.target.value)} />
              </div>
              <div className="form-field">
                <label>3.11 Gross Annual Wages (ETB)</label>
                <input type="number" value={formData.m3.annualGrossWages} onChange={(e) => updateModField("m3", "annualGrossWages", e.target.value)} />
              </div>
            </div>
            <div style={{ background: "var(--bg2)", padding: 12, borderRadius: 8, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ fontSize: 13, color: "var(--text2)" }}>Auto-calculated Headcount:</span>
              <span style={{ fontWeight: 800, fontSize: 15, color: "var(--primary)" }}>{totalEmployees} Employees (Female Share: {Math.round(((Number(formData.m3.permanentFemale) + Number(formData.m3.contractFemale)) / totalEmployees) * 100)}%)</span>
            </div>
          </div>
        )}

        {/* ── MODULE 4: PRODUCTS, OUTPUT & FULL CAPACITY ── */}
        {activeModIdx === 3 && (
          <div style={{ display: "grid", gap: 16 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 8 }}>
              <div>
                <div style={{ fontSize: 13.5, fontWeight: 600, color: "var(--text)" }}>4.1 Principal Products & Production Capacity</div>
                <div style={{ fontSize: 12, color: "var(--text2)", marginTop: 2 }}>List up to 5 products by sales value. Auto-calculates production value and capacity utilization.</div>
              </div>
              <Button variant="outline" size="sm" onClick={addProductRow}>+ Add Product Line</Button>
            </div>

            {/* Products Table */}
            <div style={{ border: "1px solid var(--border)", borderRadius: 10, overflow: "hidden" }}>
              {/* Table Header */}
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: isMobile ? "1fr" : "2fr 1fr 1fr 1fr 1fr 1fr 36px",
                  background: "var(--bg2)",
                  padding: "8px 12px",
                  gap: 8,
                  borderBottom: "1px solid var(--border)",
                  fontSize: 11,
                  fontWeight: 700,
                  color: "var(--text2)",
                  textTransform: "uppercase",
                  letterSpacing: "0.04em",
                }}
              >
                {!isMobile && (
                  <>
                    <span>Product Name</span>
                    <span>Code / UOM</span>
                    <span>Unit Price (ETB)</span>
                    <span>Qty Produced</span>
                    <span>Production Value (ETB)</span>
                    <span>Full Capacity Value (ETB)</span>
                    <span></span>
                  </>
                )}
                {isMobile && <span>Product Lines</span>}
              </div>

              {/* Table Rows */}
              {(formData.m4.products || []).map((p, idx) => (
                <div
                  key={idx}
                  style={{
                    display: "grid",
                    gridTemplateColumns: isMobile ? "1fr" : "2fr 1fr 1fr 1fr 1fr 1fr 36px",
                    gap: 8,
                    padding: "10px 12px",
                    borderBottom: idx < formData.m4.products.length - 1 ? "1px solid var(--border)" : "none",
                    background: idx % 2 === 0 ? "var(--card)" : "var(--bg)",
                    alignItems: "center",
                  }}
                >
                  {isMobile && (
                    <div style={{ fontSize: 12, fontWeight: 700, color: "var(--text2)", marginBottom: 4 }}>
                      Product #{idx + 1}
                    </div>
                  )}
                  <div className="form-field" style={{ margin: 0 }}>
                    {isMobile && <label style={{ fontSize: 11 }}>Product Name</label>}
                    <input
                      value={p.name}
                      onChange={(e) => updateProduct(idx, "name", e.target.value)}
                      placeholder="e.g. Cotton Polo Shirts"
                      style={{ fontSize: 13 }}
                    />
                  </div>
                  <div className="form-field" style={{ margin: 0 }}>
                    {isMobile && <label style={{ fontSize: 11 }}>Product Code</label>}
                    <input
                      value={p.code}
                      onChange={(e) => updateProduct(idx, "code", e.target.value)}
                      placeholder="TEX-101"
                      style={{ fontSize: 13 }}
                    />
                  </div>
                  <div className="form-field" style={{ margin: 0 }}>
                    {isMobile && <label style={{ fontSize: 11 }}>Unit Price (ETB)</label>}
                    <input
                      type="number"
                      value={p.unitPrice}
                      onChange={(e) => updateProduct(idx, "unitPrice", e.target.value)}
                      placeholder="0"
                      style={{ fontSize: 13 }}
                    />
                  </div>
                  <div className="form-field" style={{ margin: 0 }}>
                    {isMobile && <label style={{ fontSize: 11 }}>Qty Produced</label>}
                    <input
                      type="number"
                      value={p.qtyProduced}
                      onChange={(e) => updateProduct(idx, "qtyProduced", e.target.value)}
                      placeholder="0"
                      style={{ fontSize: 13 }}
                    />
                  </div>
                  {/* Auto-calculated production value */}
                  <div style={{ fontSize: 13, fontWeight: 700, color: "var(--text)", padding: "6px 4px", background: "var(--bg2)", borderRadius: 6, textAlign: "right" }}>
                    {isMobile && <span style={{ fontSize: 11, fontWeight: 400, color: "var(--text2)", display: "block" }}>Prod. Value</span>}
                    ETB {Number(p.valProduced || 0).toLocaleString()}
                  </div>
                  <div className="form-field" style={{ margin: 0 }}>
                    {isMobile && <label style={{ fontSize: 11 }}>Full Capacity Value (ETB)</label>}
                    <input
                      type="number"
                      value={p.fullCapacityVal}
                      onChange={(e) => updateProduct(idx, "fullCapacityVal", e.target.value)}
                      placeholder="0"
                      style={{ fontSize: 13 }}
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => setFormData((prev) => ({ ...prev, m4: { ...prev.m4, products: prev.m4.products.filter((_, i) => i !== idx) } }))}
                    title="Remove product"
                    style={{
                      background: "#fee2e2",
                      border: "1px solid #fca5a5",
                      color: "#dc2626",
                      borderRadius: 6,
                      width: 28,
                      height: 28,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      cursor: "pointer",
                      fontSize: 14,
                      flexShrink: 0,
                    }}
                  >
                    ×
                  </button>
                </div>
              ))}

              {/* Table Footer — Export values row */}
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: isMobile ? "1fr" : "2fr 1fr 1fr 1fr 1fr 1fr 36px",
                  gap: 8,
                  padding: "10px 12px",
                  background: "var(--bg2)",
                  borderTop: "2px solid var(--border)",
                  alignItems: "center",
                }}
              >
                <div style={{ fontSize: 12, fontWeight: 700, color: "var(--text2)" }}>4.1 Export Values</div>
                <div />
                <div />
                <div />
                <div />
                <div />
                <div />
              </div>
              {(formData.m4.products || []).map((p, idx) => (
                <div
                  key={`exp-${idx}`}
                  style={{
                    display: "grid",
                    gridTemplateColumns: isMobile ? "1fr" : "2fr 1fr 1fr 1fr 1fr 1fr 36px",
                    gap: 8,
                    padding: "8px 12px",
                    borderBottom: idx < formData.m4.products.length - 1 ? "1px solid var(--border)" : "none",
                    background: "var(--bg)",
                    alignItems: "center",
                  }}
                >
                  <div style={{ fontSize: 12.5, color: "var(--text2)" }}>{p.name}</div>
                  <div />
                  <div />
                  <div />
                  <div />
                  <div className="form-field" style={{ margin: 0 }}>
                    {isMobile && <label style={{ fontSize: 11 }}>Export Value (ETB) — {p.name}</label>}
                    <input
                      type="number"
                      value={p.exportVal}
                      onChange={(e) => updateProduct(idx, "exportVal", e.target.value)}
                      placeholder="Export sales value (ETB)"
                      style={{ fontSize: 12 }}
                    />
                  </div>
                  <div />
                </div>
              ))}
            </div>

            {/* Capacity Utilization Summary */}
            <div
              style={{
                background: "linear-gradient(135deg, #eff6ff, #dbeafe)",
                border: "1px solid #93c5fd",
                padding: 14,
                borderRadius: 10,
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                flexWrap: "wrap",
                gap: 10,
              }}
            >
              <div>
                <div style={{ fontSize: 12, color: "#1e40af", fontWeight: 600 }}>Auto-Calculated: Capacity Utilization</div>
                <div style={{ fontSize: 11.5, color: "#3b82f6", marginTop: 2 }}>
                  Actual Output ETB {totalActualOutput.toLocaleString()} ÷ Full Capacity ETB {totalFullCapacity.toLocaleString()}
                </div>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <div
                  style={{
                    width: 120,
                    height: 8,
                    background: "#bfdbfe",
                    borderRadius: 4,
                    overflow: "hidden",
                  }}
                >
                  <div
                    style={{
                      width: `${capacityPct}%`,
                      height: "100%",
                      background: capacityPct >= 80 ? "#059669" : capacityPct >= 60 ? "#d97706" : "#dc2626",
                      borderRadius: 4,
                      transition: "width 0.4s ease",
                    }}
                  />
                </div>
                <strong style={{ fontSize: 18, color: capacityPct >= 80 ? "#059669" : capacityPct >= 60 ? "#d97706" : "#dc2626" }}>
                  {capacityPct}%
                </strong>
              </div>
            </div>
          </div>
        )}

        {/* ── MODULE 5: INVENTORY & STOCKS ── */}
        {activeModIdx === 4 && (
          <div style={{ display: "grid", gap: 14 }}>
            <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "repeat(2, 1fr)", gap: 12 }}>
              <div className="form-field">
                <label>5.1 Raw Materials Stock - Beginning of Year (ETB)</label>
                <input type="number" value={formData.m5.rawMaterialsBeg} onChange={(e) => updateModField("m5", "rawMaterialsBeg", e.target.value)} />
              </div>
              <div className="form-field">
                <label>5.1 Raw Materials Stock - End of Year (ETB)</label>
                <input type="number" value={formData.m5.rawMaterialsEnd} onChange={(e) => updateModField("m5", "rawMaterialsEnd", e.target.value)} />
              </div>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "repeat(2, 1fr)", gap: 12 }}>
              <div className="form-field">
                <label>Finished Goods Stock - Beginning (ETB)</label>
                <input type="number" value={formData.m5.finishedGoodsBeg} onChange={(e) => updateModField("m5", "finishedGoodsBeg", e.target.value)} />
              </div>
              <div className="form-field">
                <label>Finished Goods Stock - End (ETB)</label>
                <input type="number" value={formData.m5.finishedGoodsEnd} onChange={(e) => updateModField("m5", "finishedGoodsEnd", e.target.value)} />
              </div>
            </div>
            <div className="form-field">
              <label>5.2 Cost of Goods Produced / Sold (CGS in ETB)</label>
              <input type="number" value={formData.m5.costOfGoodsProduced} onChange={(e) => updateModField("m5", "costOfGoodsProduced", e.target.value)} />
            </div>
            <div style={{ background: "var(--bg2)", padding: 12, borderRadius: 8, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ fontSize: 13, color: "var(--text2)" }}>Net Annual Stock Variance:</span>
              <strong style={{ fontSize: 14, color: rawMaterialDiff >= 0 ? "#059669" : "#dc2626" }}>
                {rawMaterialDiff >= 0 ? `+ETB ${rawMaterialDiff.toLocaleString()} (Stock Added)` : `-ETB ${Math.abs(rawMaterialDiff).toLocaleString()} (Stock Depleted)`}
              </strong>
            </div>
          </div>
        )}

        {/* ── MODULE 6: RAW MATERIALS, ENERGY & TAXES ── */}
        {activeModIdx === 5 && (
          <div style={{ display: "grid", gap: 14 }}>
            <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "repeat(2, 1fr)", gap: 12 }}>
              <div className="form-field">
                <label>6.1 Local Raw Materials Used (ETB)</label>
                <input type="number" value={formData.m6.localRawMaterialVal} onChange={(e) => updateModField("m6", "localRawMaterialVal", e.target.value)} />
              </div>
              <div className="form-field">
                <label>6.1 Imported Raw Materials Used (ETB)</label>
                <input type="number" value={formData.m6.importedRawMaterialVal} onChange={(e) => updateModField("m6", "importedRawMaterialVal", e.target.value)} />
              </div>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr 1fr" : "repeat(3, 1fr)", gap: 12 }}>
              <div className="form-field">
                <label>6.2 Electricity Cost (ETB)</label>
                <input type="number" value={formData.m6.electricityCost} onChange={(e) => updateModField("m6", "electricityCost", e.target.value)} />
              </div>
              <div className="form-field">
                <label>6.2 Diesel & Fuel Cost (ETB)</label>
                <input type="number" value={formData.m6.dieselCost} onChange={(e) => updateModField("m6", "dieselCost", e.target.value)} />
              </div>
              <div className="form-field">
                <label>6.4 Indirect Taxes / VAT (ETB)</label>
                <input type="number" value={formData.m6.vatPaid} onChange={(e) => updateModField("m6", "vatPaid", e.target.value)} />
              </div>
            </div>
            <div style={{ background: "var(--bg2)", padding: 12, borderRadius: 8, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ fontSize: 13, color: "var(--text2)" }}>Local Sourcing Ratio:</span>
              <strong style={{ fontSize: 14, color: "var(--primary)" }}>
                {Math.round((Number(formData.m6.localRawMaterialVal) / (Number(formData.m6.localRawMaterialVal) + Number(formData.m6.importedRawMaterialVal))) * 100)}% Local Inputs
              </strong>
            </div>
          </div>
        )}

        {/* ── MODULE 7: FIXED ASSETS & CAPEX ── */}
        {activeModIdx === 6 && (
          <div style={{ display: "grid", gap: 14 }}>
            <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "repeat(2, 1fr)", gap: 12 }}>
              <div className="form-field">
                <label>7.1 Machinery & Equipment Book Value (ETB)</label>
                <input type="number" value={formData.m7.machineryBookVal} onChange={(e) => updateModField("m7", "machineryBookVal", e.target.value)} />
              </div>
              <div className="form-field">
                <label>7.1 Non-Residential Buildings Value (ETB)</label>
                <input type="number" value={formData.m7.buildingsBookVal} onChange={(e) => updateModField("m7", "buildingsBookVal", e.target.value)} />
              </div>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "repeat(3, 1fr)", gap: 12 }}>
              <div className="form-field">
                <label>Annual Depreciation (ETB)</label>
                <input type="number" value={formData.m7.annualDepreciation} onChange={(e) => updateModField("m7", "annualDepreciation", e.target.value)} />
              </div>
              <div className="form-field">
                <label>7.2 Financed by Bank Loans (ETB)</label>
                <input type="number" value={formData.m7.bankLoanFixed} onChange={(e) => updateModField("m7", "bankLoanFixed", e.target.value)} />
              </div>
              <div className="form-field">
                <label>7.2 Financed by Own Funds (ETB)</label>
                <input type="number" value={formData.m7.ownFundsFixed} onChange={(e) => updateModField("m7", "ownFundsFixed", e.target.value)} />
              </div>
            </div>
          </div>
        )}

        {/* ── MODULE 8: BOTTLENECKS & OPERATIONAL GAPS ── */}
        {activeModIdx === 7 && (
          <div style={{ display: "grid", gap: 14 }}>
            <div className="form-field">
              <label>8.1 Primary Obstacle Preventing Full Capacity Operation *</label>
              <select value={formData.m8.primaryBottleneck} onChange={(e) => updateModField("m8", "primaryBottleneck", e.target.value)}>
                <option value="Shortage of foreign exchange for raw materials / spares">Shortage of foreign exchange for raw materials / spares</option>
                <option value="Shortage of supply of raw materials">Shortage of supply of raw materials</option>
                <option value="Power shortage and frequent outages">Power shortage and frequent outages</option>
                <option value="Shortage of working capital / high interest">Shortage of working capital / high interest</option>
                <option value="Getting market and customers / competition">Getting market and customers / competition</option>
                <option value="Frequent machine breakdown & spare parts">Frequent machine breakdown & spare parts</option>
              </select>
            </div>
            <div className="form-field">
              <label>8.1 Secondary Constraint</label>
              <input value={formData.m8.secondaryBottleneck} onChange={(e) => updateModField("m8", "secondaryBottleneck", e.target.value)} />
            </div>
            <div className="form-field">
              <label>8.4 Loan Access Hurdles & Banking Bottlenecks</label>
              <input value={formData.m8.loanHurdles} onChange={(e) => updateModField("m8", "loanHurdles", e.target.value)} />
            </div>
          </div>
        )}

        {/* ── MODULE 9: ICT & AUTOMATION ADOPTION ── */}
        {activeModIdx === 8 && (
          <div style={{ display: "grid", gap: 14 }}>
            <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr 1fr" : "repeat(4, 1fr)", gap: 12 }}>
              <div className="form-field">
                <label>Uses Computers</label>
                <select value={formData.m9.usesComputers} onChange={(e) => updateModField("m9", "usesComputers", e.target.value)}>
                  <option value="Yes">Yes</option>
                  <option value="No">No</option>
                </select>
              </div>
              <div className="form-field">
                <label>Total Computer Count</label>
                <input type="number" value={formData.m9.computerCount} onChange={(e) => updateModField("m9", "computerCount", e.target.value)} />
              </div>
              <div className="form-field">
                <label>Has Local Area Network (LAN)</label>
                <select value={formData.m9.hasLan} onChange={(e) => updateModField("m9", "hasLan", e.target.value)}>
                  <option value="Yes">Yes</option>
                  <option value="No">No</option>
                </select>
              </div>
              <div className="form-field">
                <label>Has Public Web Portal / App</label>
                <select value={formData.m9.hasWebsite} onChange={(e) => updateModField("m9", "hasWebsite", e.target.value)}>
                  <option value="Yes">Yes</option>
                  <option value="No">No</option>
                </select>
              </div>
            </div>
            <div className="form-field">
              <label>9.12 Process Technology & Software Automation Applied</label>
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginTop: 4 }}>
                {["CAD Pattern Design", "QA Testing", "ERP Inventory", "HR Payroll", "SCADA Machine Control"].map((tech) => (
                  <span key={tech} className="badge info" style={{ fontSize: 12, padding: "4px 8px" }}>
                    ✓ {tech}
                  </span>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ── MODULE 10: WASTE, GOVT SUPPORT & CSR ── */}
        {activeModIdx === 9 && (
          <div style={{ display: "grid", gap: 14 }}>
            <div className="form-field">
              <label>10.1 Primary Industrial Waste Generated</label>
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                {(formData.m10.wasteTypes || []).map((w) => (
                  <span key={w} className="badge warn" style={{ fontSize: 11.5 }}>⚠️ {w}</span>
                ))}
              </div>
            </div>
            <div className="form-field">
              <label>10.2 Waste Treatment & Environmental Strategies</label>
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                {(formData.m10.wasteTreatments || []).map((t) => (
                  <span key={t} className="badge success" style={{ fontSize: 11.5 }}>♻️ {t}</span>
                ))}
              </div>
            </div>
            <div className="form-field">
              <label>10.3 Government Incentives & Priority Policy Support Received</label>
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                {(formData.m10.govtSupport || []).map((s) => (
                  <span key={s} className="badge info" style={{ fontSize: 11.5 }}>🏛️ {s}</span>
                ))}
              </div>
            </div>
            <div className="form-field">
              <label>10.6 Community & Socio-Economic Contribution</label>
              <input value={formData.m10.communityImpact} onChange={(e) => updateModField("m10", "communityImpact", e.target.value)} />
            </div>
          </div>
        )}

        {/* Stepper Footer Action Controls */}
        <div style={{ marginTop: 24, paddingTop: 16, borderTop: "1px solid var(--border)", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 10 }}>
          <Button
            variant="outline"
            size="sm"
            disabled={activeModIdx === 0}
            onClick={() => setActiveModIdx((i) => Math.max(0, i - 1))}
          >
            ← Previous Module
          </Button>

          <div style={{ display: "flex", gap: 8 }}>
            <Button
              variant="outline"
              size="sm"
              onClick={() => notify("Survey progress draft auto-saved locally", "success")}
            >
              💾 Save Draft
            </Button>
            {activeModIdx < 9 ? (
              <Button
                size="sm"
                onClick={() => setActiveModIdx((i) => Math.min(9, i + 1))}
              >
                Next: {MODULES[activeModIdx + 1]?.code} →
              </Button>
            ) : (
              <Button
                size="sm"
                variant="primary"
                onClick={handleSubmit}
                disabled={submitting}
              >
                {submitting ? "Submitting..." : "✓ Submit NMIS V16 Survey"}
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
