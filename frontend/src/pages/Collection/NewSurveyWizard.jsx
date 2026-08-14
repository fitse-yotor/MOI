/**
 * NewSurveyWizard.jsx
 * A premium multi-step survey creation wizard.
 * Steps: 1. Template → 2. Metadata → 3. Modules → 4. Targeting → 5. Review & Launch
 */
import { useState } from "react";
import { useSnackbar } from "../../context/SnackbarContext.jsx";
import Button from "../../components/common/Button.jsx";
import Badge from "../../components/common/Badge.jsx";

/* ─── Survey Template Library ─── */
const TEMPLATES = [
  {
    id: "nmis_v16",
    name: "NMIS V16 Manufacturing Census",
    icon: "🏭",
    badge: "Official",
    badgeTone: "success",
    description: "Full 10-module national manufacturing industry census based on CSA/MoTRI NMIS V16 standard. Covers Identification, Capital, Manpower, Products, Inventory, Raw Materials, Assets, Bottlenecks, ICT & Environment.",
    estimatedTime: "45–60 min",
    sections: 10,
    questions: 78,
    compatible: ["ISIC Rev.4", "SDG 9.3", "Africa CEMA"],
    tags: ["Census", "Manufacturing", "MoTRI"],
  },
  {
    id: "rapid_assessment",
    name: "Rapid Enterprise Assessment",
    icon: "⚡",
    badge: "Recommended",
    badgeTone: "info",
    description: "Lightweight 4-module diagnostic for sector mapping, employment, output, and bottleneck identification. Designed for quarterly or emergency surveys with minimal enumerator burden.",
    estimatedTime: "12–18 min",
    sections: 4,
    questions: 22,
    compatible: ["ILO", "World Bank LEAP"],
    tags: ["Rapid", "Field Diagnostic", "Quarterly"],
  },
  {
    id: "esg_environmental",
    name: "Green Industry & ESG Compliance",
    icon: "🌱",
    badge: "New",
    badgeTone: "warning",
    description: "Focused environmental and sustainability survey covering carbon footprint, effluent treatment, renewable energy use, waste recycling, and green certification alignment.",
    estimatedTime: "20–30 min",
    sections: 5,
    questions: 31,
    compatible: ["ISO 14001", "GRI Standards", "Paris Agreement"],
    tags: ["ESG", "Green", "Sustainability"],
  },
  {
    id: "sme_finance",
    name: "SME Finance & Credit Access Diagnostic",
    icon: "💰",
    badge: "Specialized",
    badgeTone: "muted",
    description: "In-depth assessment of capital structure, credit access barriers, working capital cycles, forex exposure, and government support programs utilization.",
    estimatedTime: "25–35 min",
    sections: 6,
    questions: 40,
    compatible: ["FinScope", "IFC SME Finance"],
    tags: ["Finance", "SME", "Credit"],
  },
  {
    id: "custom",
    name: "Start from Scratch (Blank Canvas)",
    icon: "✏️",
    badge: "Custom",
    badgeTone: "muted",
    description: "Build your own questionnaire from a blank state using the Indicator Component Palette. Full control over schema, branching logic, and field types.",
    estimatedTime: "Custom",
    sections: 0,
    questions: 0,
    compatible: ["ODK XLSForm", "KoboToolbox", "SurveyCTO"],
    tags: ["Custom", "Blank Canvas"],
  },
];

/* ─── Sector / ISIC Map ─── */
const SECTORS = [
  { code: "10-12", label: "Food & Beverage Manufacturing" },
  { code: "13-15", label: "Textile, Garment & Leather" },
  { code: "16-18", label: "Wood Products, Paper & Printing" },
  { code: "19-23", label: "Chemical, Rubber & Plastics" },
  { code: "24-25", label: "Basic Metals & Fabricated Metal" },
  { code: "26-28", label: "Electronics, Machinery & Equipment" },
  { code: "29-30", label: "Vehicles & Transport Equipment" },
  { code: "31-33", label: "Furniture, Repair & Other Manufacturing" },
];

/* ─── Region list for targeting ─── */
const REGIONS = [
  { id: "AA", name: "Addis Ababa City Administration" },
  { id: "OR", name: "Oromia Regional State" },
  { id: "AM", name: "Amhara Regional State" },
  { id: "TI", name: "Tigray Regional State" },
  { id: "SN", name: "SNNPR" },
  { id: "SO", name: "Somali Regional State" },
  { id: "BE", name: "Benishangul-Gumuz" },
  { id: "HR", name: "Harari People's Region" },
  { id: "DI", name: "Dire Dawa City Administration" },
  { id: "GA", name: "Gambella Regional State" },
  { id: "AF", name: "Afar Regional State" },
  { id: "SW", name: "South West Ethiopia" },
];

/* ─── Step definitions ─── */
const STEPS = [
  { id: "template", num: 1, label: "Survey Template", icon: "📋" },
  { id: "metadata", num: 2, label: "Identity & Period", icon: "📝" },
  { id: "modules", num: 3, label: "Scope & Modules", icon: "🧩" },
  { id: "targeting", num: 4, label: "Targeting", icon: "🎯" },
  { id: "review", num: 5, label: "Review & Launch", icon: "🚀" },
];

/* ─── Main Component ─── */
export default function NewSurveyWizard({ onCancel, onCreated }) {
  const { notify } = useSnackbar();
  const [step, setStep] = useState(0);
  const [launching, setLaunching] = useState(false);

  const [form, setForm] = useState({
    template: null,
    name: "",
    code: "",
    referenceYear: "2025/2026",
    openDate: "",
    closeDate: "",
    description: "",
    language: "English & Amharic",
    sectors: [],
    regions: [],
    enterpriseSize: ["Small", "Medium", "Large"],
    parkOnly: false,
    enumeratorMode: "Mobile App + Web Portal",
    enableGps: true,
    enableAiExtract: false,
    enableOffline: true,
    selectedModules: ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10"],
  });

  function update(key, val) {
    setForm((prev) => ({ ...prev, [key]: val }));
  }

  function toggleArrayItem(key, item) {
    setForm((prev) => {
      const arr = prev[key] || [];
      return {
        ...prev,
        [key]: arr.includes(item) ? arr.filter((x) => x !== item) : [...arr, item],
      };
    });
  }

  const selectedTemplate = TEMPLATES.find((t) => t.id === form.template);

  function canProceed() {
    if (step === 0) return !!form.template;
    if (step === 1) return form.name.trim().length >= 3 && form.openDate && form.closeDate;
    if (step === 2) return form.selectedModules.length > 0;
    if (step === 3) return form.regions.length > 0 || form.sectors.length > 0;
    return true;
  }

  async function handleLaunch() {
    setLaunching(true);
    await new Promise((r) => setTimeout(r, 700)); // simulated API call
    notify(`Survey "${form.name}" has been created and broadcast to enumerators! 🎉`, "success");
    setLaunching(false);
    onCreated?.({ ...form, id: `SRV-${Date.now() % 10000}` });
  }

  const NMIS_MODULES = [
    { num: "1", title: "Identification & Location", icon: "📍", required: true },
    { num: "2", title: "Establishment & Capital", icon: "🏢", required: true },
    { num: "3", title: "Manpower & Wages", icon: "👥", required: false },
    { num: "4", title: "Products & Capacity", icon: "📦", required: false },
    { num: "5", title: "Inventory & Stocks", icon: "📊", required: false },
    { num: "6", title: "Raw Materials & Costs", icon: "⚡", required: false },
    { num: "7", title: "Fixed Assets & CapEx", icon: "🏗️", required: false },
    { num: "8", title: "Bottlenecks & Gaps", icon: "⚠️", required: false },
    { num: "9", title: "ICT & Automation", icon: "💻", required: false },
    { num: "10", title: "Waste & Govt Support", icon: "🌱", required: false },
  ];

  return (
    <div
      style={{
        background: "var(--bg)",
        minHeight: "100%",
        display: "flex",
        flexDirection: "column",
        gap: 0,
      }}
    >
      {/* Header */}
      <div
        style={{
          background: "linear-gradient(135deg, #090d16 0%, #0f172a 60%, #0369a1 100%)",
          padding: "18px 28px",
          borderBottom: "1px solid rgba(56,189,248,0.2)",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          borderRadius: "12px 12px 0 0",
          marginBottom: 0,
        }}
      >
        <div>
          <div style={{ fontWeight: 900, fontSize: 20, color: "#fff", letterSpacing: "-0.02em" }}>
            Create New Survey Campaign
          </div>
          <div style={{ fontSize: 12.5, color: "#7dd3fc", marginTop: 3 }}>
            Design, configure, and deploy a new data collection campaign across the field enumerator network.
          </div>
        </div>
        <button
          type="button"
          onClick={onCancel}
          style={{ background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.2)", color: "#fff", borderRadius: 8, padding: "6px 14px", cursor: "pointer", fontSize: 13 }}
        >
          ✕ Cancel
        </button>
      </div>

      {/* Step Indicator */}
      <div
        style={{
          background: "var(--card)",
          padding: "14px 28px",
          borderBottom: "1px solid var(--border)",
          display: "flex",
          alignItems: "center",
          gap: 0,
          overflowX: "auto",
        }}
      >
        {STEPS.map((s, idx) => {
          const isDone = idx < step;
          const isActive = idx === step;
          return (
            <div key={s.id} style={{ display: "flex", alignItems: "center" }}>
              <button
                type="button"
                onClick={() => idx <= step && setStep(idx)}
                disabled={idx > step}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  padding: "7px 14px",
                  borderRadius: 30,
                  border: isActive ? "2px solid var(--primary)" : isDone ? "1px solid #059669" : "1px solid var(--border)",
                  background: isActive ? "var(--bg2)" : isDone ? "#ecfdf5" : "transparent",
                  color: isActive ? "var(--primary)" : isDone ? "#059669" : "var(--text2)",
                  fontWeight: isActive ? 800 : 600,
                  fontSize: 12.5,
                  cursor: idx <= step ? "pointer" : "default",
                  whiteSpace: "nowrap",
                  transition: "all 0.15s ease",
                }}
              >
                {isDone ? (
                  <span style={{ width: 20, height: 20, borderRadius: "50%", background: "#059669", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11 }}>✓</span>
                ) : (
                  <span style={{ width: 20, height: 20, borderRadius: "50%", background: isActive ? "var(--primary)" : "var(--border)", color: isActive ? "#fff" : "var(--text2)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 800 }}>{s.num}</span>
                )}
                <span>{s.icon} {s.label}</span>
              </button>
              {idx < STEPS.length - 1 && (
                <div style={{ width: 28, height: 2, background: isDone ? "#059669" : "var(--border)", margin: "0 2px", flexShrink: 0 }} />
              )}
            </div>
          );
        })}
      </div>

      {/* Step Body */}
      <div style={{ padding: "24px 28px", flex: 1 }}>

        {/* ── STEP 1: TEMPLATE SELECTION ── */}
        {step === 0 && (
          <div>
            <div style={{ marginBottom: 18 }}>
              <h3 style={{ margin: 0, fontSize: 17 }}>1. Choose a Survey Template</h3>
              <p style={{ margin: "4px 0 0 0", fontSize: 13, color: "var(--text2)" }}>
                Select a standardized template or start with a blank canvas. Templates pre-populate all fields, validation rules, and skip-logic.
              </p>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: 14 }}>
              {TEMPLATES.map((t) => {
                const isSelected = form.template === t.id;
                return (
                  <div
                    key={t.id}
                    onClick={() => update("template", t.id)}
                    style={{
                      padding: "16px 18px",
                      borderRadius: 12,
                      border: isSelected ? "2px solid var(--primary)" : "1px solid var(--border)",
                      background: isSelected ? "var(--bg2)" : "var(--card)",
                      cursor: "pointer",
                      boxShadow: isSelected ? "0 4px 18px rgba(3, 105, 161, 0.15)" : "var(--shadow-sm)",
                      transition: "all 0.15s ease",
                      display: "flex",
                      flexDirection: "column",
                      gap: 10,
                    }}
                  >
                    {/* Template Header */}
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                        <span style={{ fontSize: 28 }}>{t.icon}</span>
                        <div>
                          <div style={{ fontWeight: 800, fontSize: 14, color: isSelected ? "var(--primary)" : "var(--text)" }}>{t.name}</div>
                          <Badge tone={t.badgeTone} style={{ fontSize: 10, marginTop: 3 }}>{t.badge}</Badge>
                        </div>
                      </div>
                      <div
                        style={{
                          width: 22,
                          height: 22,
                          borderRadius: "50%",
                          border: isSelected ? "2px solid var(--primary)" : "2px solid var(--border)",
                          background: isSelected ? "var(--primary)" : "transparent",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          flexShrink: 0,
                        }}
                      >
                        {isSelected && <span style={{ color: "#fff", fontSize: 12, lineHeight: 1 }}>✓</span>}
                      </div>
                    </div>

                    {/* Description */}
                    <p style={{ margin: 0, fontSize: 12.5, color: "var(--text2)", lineHeight: 1.5 }}>{t.description}</p>

                    {/* Stats strip */}
                    <div style={{ display: "flex", gap: 16, fontSize: 12 }}>
                      {t.sections > 0 && <span><strong>{t.sections}</strong> <span style={{ color: "var(--text2)" }}>Modules</span></span>}
                      {t.questions > 0 && <span><strong>{t.questions}</strong> <span style={{ color: "var(--text2)" }}>Questions</span></span>}
                      <span>⏱ <span style={{ color: "var(--text2)" }}>{t.estimatedTime}</span></span>
                    </div>

                    {/* Tags */}
                    <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                      {t.tags.map((tag) => (
                        <span key={tag} style={{ fontSize: 10, background: "var(--bg)", border: "1px solid var(--border)", padding: "2px 7px", borderRadius: 10, color: "var(--text2)" }}>{tag}</span>
                      ))}
                    </div>

                    {/* Standards */}
                    <div style={{ fontSize: 11, color: "var(--text2)", borderTop: "1px solid var(--border)", paddingTop: 8 }}>
                      Compatible with: {t.compatible.join(" · ")}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ── STEP 2: METADATA / IDENTITY ── */}
        {step === 1 && (
          <div style={{ maxWidth: 720 }}>
            <div style={{ marginBottom: 18 }}>
              <h3 style={{ margin: 0, fontSize: 17 }}>2. Survey Identity & Reference Period</h3>
              <p style={{ margin: "4px 0 0 0", fontSize: 13, color: "var(--text2)" }}>
                Name this campaign and set the data collection window.
              </p>
            </div>

            <div style={{ display: "grid", gap: 16 }}>
              <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: 12 }}>
                <div className="form-field">
                  <label>Survey Campaign Name *</label>
                  <input
                    value={form.name}
                    onChange={(e) => update("name", e.target.value)}
                    placeholder="e.g. Annual NMIS 2025/2026 National Census"
                  />
                </div>
                <div className="form-field">
                  <label>Campaign Code / Reference ID</label>
                  <input
                    value={form.code}
                    onChange={(e) => update("code", e.target.value)}
                    placeholder="e.g. NMIS-2026-Q1"
                  />
                </div>
              </div>

              <div className="form-field">
                <label>Survey Description / Mandate</label>
                <textarea
                  rows={2}
                  value={form.description}
                  onChange={(e) => update("description", e.target.value)}
                  placeholder="Official purpose of this data collection campaign..."
                />
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12 }}>
                <div className="form-field">
                  <label>Ethiopian Fiscal Reference Year *</label>
                  <select value={form.referenceYear} onChange={(e) => update("referenceYear", e.target.value)}>
                    <option value="2024/2025">2024/2025 E.C.</option>
                    <option value="2025/2026">2025/2026 E.C.</option>
                    <option value="2026/2027">2026/2027 E.C.</option>
                  </select>
                </div>
                <div className="form-field">
                  <label>Field Data Collection Opens *</label>
                  <input type="date" value={form.openDate} onChange={(e) => update("openDate", e.target.value)} />
                </div>
                <div className="form-field">
                  <label>Collection Window Closes *</label>
                  <input type="date" value={form.closeDate} onChange={(e) => update("closeDate", e.target.value)} />
                </div>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                <div className="form-field">
                  <label>Questionnaire Language</label>
                  <select value={form.language} onChange={(e) => update("language", e.target.value)}>
                    <option value="English & Amharic">English & Amharic (Bilingual)</option>
                    <option value="English Only">English Only</option>
                    <option value="Amharic Only">Amharic Only</option>
                  </select>
                </div>
                <div className="form-field">
                  <label>Enumerator Access Channels</label>
                  <select value={form.enumeratorMode} onChange={(e) => update("enumeratorMode", e.target.value)}>
                    <option value="Mobile App + Web Portal">Mobile App + Web Portal</option>
                    <option value="Web Portal Only">Web Portal Only</option>
                    <option value="CAPI Offline Only">CAPI Offline Only</option>
                  </select>
                </div>
              </div>

              <div style={{ background: "var(--bg2)", padding: "12px 16px", borderRadius: 10, border: "1px solid var(--border)", display: "flex", gap: 20, flexWrap: "wrap" }}>
                <label style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer", fontSize: 13 }}>
                  <input type="checkbox" checked={form.enableGps} onChange={(e) => update("enableGps", e.target.checked)} />
                  <span>📍 Mandatory GPS Geolocation Capture</span>
                </label>
                <label style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer", fontSize: 13 }}>
                  <input type="checkbox" checked={form.enableOffline} onChange={(e) => update("enableOffline", e.target.checked)} />
                  <span>📵 Enable Offline CAPI Sync Support</span>
                </label>
                <label style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer", fontSize: 13 }}>
                  <input type="checkbox" checked={form.enableAiExtract} onChange={(e) => update("enableAiExtract", e.target.checked)} />
                  <span>🤖 Enable AI Document / Invoice Extraction</span>
                </label>
              </div>
            </div>
          </div>
        )}

        {/* ── STEP 3: MODULE SCOPE SELECTION ── */}
        {step === 2 && (
          <div>
            <div style={{ marginBottom: 18 }}>
              <h3 style={{ margin: 0, fontSize: 17 }}>3. Configure Survey Scope & Module Inclusion</h3>
              <p style={{ margin: "4px 0 0 0", fontSize: 13, color: "var(--text2)" }}>
                Select which modules will be active in this survey campaign. Modules 1 & 2 are always required for enterprise identification.
              </p>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 12 }}>
              {NMIS_MODULES.map((m) => {
                const isOn = form.selectedModules.includes(m.num);
                return (
                  <div
                    key={m.num}
                    onClick={() => !m.required && toggleArrayItem("selectedModules", m.num)}
                    style={{
                      padding: "13px 16px",
                      borderRadius: 10,
                      border: isOn ? "2px solid var(--primary)" : "1px solid var(--border)",
                      background: isOn ? "var(--bg2)" : "var(--card)",
                      cursor: m.required ? "default" : "pointer",
                      display: "flex",
                      alignItems: "center",
                      gap: 12,
                      transition: "all 0.15s ease",
                      opacity: m.required ? 1 : 1,
                    }}
                  >
                    <span style={{ fontSize: 24 }}>{m.icon}</span>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 700, fontSize: 13, color: isOn ? "var(--primary)" : "var(--text)" }}>
                        {m.num}. {m.title}
                        {m.required && <Badge tone="muted" style={{ marginLeft: 6, fontSize: 9 }}>Required</Badge>}
                      </div>
                    </div>
                    <div
                      style={{
                        width: 22,
                        height: 22,
                        borderRadius: 6,
                        border: isOn ? "2px solid var(--primary)" : "2px solid var(--border)",
                        background: isOn ? "var(--primary)" : "transparent",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        flexShrink: 0,
                      }}
                    >
                      {isOn && <span style={{ color: "#fff", fontSize: 13 }}>✓</span>}
                    </div>
                  </div>
                );
              })}
            </div>

            <div style={{ marginTop: 14, padding: "10px 14px", background: "var(--bg2)", border: "1px solid var(--border)", borderRadius: 8, display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: 13 }}>
              <span style={{ color: "var(--text2)" }}>Active modules:</span>
              <strong style={{ color: "var(--primary)" }}>{form.selectedModules.length} / 10 modules selected</strong>
            </div>
          </div>
        )}

        {/* ── STEP 4: TARGETING ── */}
        {step === 3 && (
          <div style={{ maxWidth: 900 }}>
            <div style={{ marginBottom: 18 }}>
              <h3 style={{ margin: 0, fontSize: 17 }}>4. Geographic & Sectoral Targeting</h3>
              <p style={{ margin: "4px 0 0 0", fontSize: 13, color: "var(--text2)" }}>
                Define which regions, sectors, and enterprise categories this survey targets.
              </p>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
              {/* Regions */}
              <div>
                <div style={{ fontWeight: 700, fontSize: 13, marginBottom: 10 }}>📍 Target Regions *</div>
                <div style={{ display: "grid", gap: 8 }}>
                  <button
                    type="button"
                    onClick={() => update("regions", form.regions.length === REGIONS.length ? [] : REGIONS.map((r) => r.id))}
                    style={{ padding: "7px 12px", borderRadius: 8, border: "1px dashed var(--primary)", background: "var(--bg2)", color: "var(--primary)", cursor: "pointer", fontSize: 12, fontWeight: 700, textAlign: "left" }}
                  >
                    {form.regions.length === REGIONS.length ? "✓ All Selected — Click to Deselect All" : "☑ Select All Regions (National Deployment)"}
                  </button>
                  {REGIONS.map((r) => {
                    const isOn = form.regions.includes(r.id);
                    return (
                      <label
                        key={r.id}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 10,
                          padding: "8px 12px",
                          borderRadius: 8,
                          border: isOn ? "1px solid var(--primary)" : "1px solid var(--border)",
                          background: isOn ? "var(--bg2)" : "var(--card)",
                          cursor: "pointer",
                          fontSize: 13,
                          transition: "all 0.12s ease",
                        }}
                      >
                        <input type="checkbox" checked={isOn} onChange={() => toggleArrayItem("regions", r.id)} />
                        <span>{r.name}</span>
                      </label>
                    );
                  })}
                </div>
              </div>

              {/* Sectors + Enterprise Size */}
              <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
                <div>
                  <div style={{ fontWeight: 700, fontSize: 13, marginBottom: 10 }}>🏭 Target ISIC Sectors</div>
                  <div style={{ display: "grid", gap: 8 }}>
                    {SECTORS.map((s) => {
                      const isOn = form.sectors.includes(s.code);
                      return (
                        <label
                          key={s.code}
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 10,
                            padding: "8px 12px",
                            borderRadius: 8,
                            border: isOn ? "1px solid var(--primary)" : "1px solid var(--border)",
                            background: isOn ? "var(--bg2)" : "var(--card)",
                            cursor: "pointer",
                            fontSize: 12.5,
                          }}
                        >
                          <input type="checkbox" checked={isOn} onChange={() => toggleArrayItem("sectors", s.code)} />
                          <span><strong style={{ fontFamily: "monospace", fontSize: 11 }}>{s.code}</strong> — {s.label}</span>
                        </label>
                      );
                    })}
                  </div>
                </div>

                <div>
                  <div style={{ fontWeight: 700, fontSize: 13, marginBottom: 10 }}>📏 Enterprise Size Classification</div>
                  <div style={{ display: "flex", gap: 10 }}>
                    {["Small", "Medium", "Large"].map((size) => {
                      const isOn = form.enterpriseSize.includes(size);
                      return (
                        <label
                          key={size}
                          style={{
                            flex: 1,
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            padding: "10px",
                            borderRadius: 8,
                            border: isOn ? "2px solid var(--primary)" : "1px solid var(--border)",
                            background: isOn ? "var(--bg2)" : "var(--card)",
                            cursor: "pointer",
                            fontSize: 13,
                            fontWeight: 700,
                            gap: 4,
                          }}
                        >
                          <input type="checkbox" checked={isOn} onChange={() => toggleArrayItem("enterpriseSize", size)} />
                          <span>{size}</span>
                          <span style={{ fontSize: 10, color: "var(--text2)", fontWeight: 400 }}>
                            {size === "Small" ? "5–29 workers" : size === "Medium" ? "30–99 workers" : "100+ workers"}
                          </span>
                        </label>
                      );
                    })}
                  </div>
                </div>

                <label style={{ display: "flex", alignItems: "center", gap: 10, cursor: "pointer", padding: "10px 12px", borderRadius: 8, border: "1px solid var(--border)", background: "var(--card)" }}>
                  <input type="checkbox" checked={form.parkOnly} onChange={(e) => update("parkOnly", e.target.checked)} />
                  <div>
                    <div style={{ fontWeight: 700, fontSize: 13 }}>🏗️ Industrial Parks Only</div>
                    <div style={{ fontSize: 11.5, color: "var(--text2)" }}>Restrict survey deployment to establishments inside industrial parks.</div>
                  </div>
                </label>
              </div>
            </div>
          </div>
        )}

        {/* ── STEP 5: REVIEW & LAUNCH ── */}
        {step === 4 && (
          <div style={{ maxWidth: 680 }}>
            <div style={{ marginBottom: 18 }}>
              <h3 style={{ margin: 0, fontSize: 17 }}>5. Review Survey Configuration & Launch</h3>
              <p style={{ margin: "4px 0 0 0", fontSize: 13, color: "var(--text2)" }}>
                Confirm all settings before broadcasting to the field enumerator network.
              </p>
            </div>

            {/* Summary cards */}
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {[
                {
                  icon: "📋",
                  title: "Template",
                  value: selectedTemplate?.name || "—",
                  sub: `${selectedTemplate?.sections || 0} base modules · ${selectedTemplate?.estimatedTime || "—"}`,
                },
                {
                  icon: "📝",
                  title: "Survey Name",
                  value: form.name || "—",
                  sub: `Code: ${form.code || "Not set"} · Ref. Year: ${form.referenceYear}`,
                },
                {
                  icon: "📅",
                  title: "Collection Window",
                  value: form.openDate && form.closeDate ? `${form.openDate} → ${form.closeDate}` : "Not configured",
                  sub: form.language + " · " + form.enumeratorMode,
                },
                {
                  icon: "🧩",
                  title: "Active Modules",
                  value: `${form.selectedModules.length} of 10 modules enabled`,
                  sub: form.selectedModules.join(", "),
                },
                {
                  icon: "🎯",
                  title: "Targeting",
                  value: `${form.regions.length} region${form.regions.length !== 1 ? "s" : ""} · ${form.sectors.length || "All"} sector${form.sectors.length !== 1 ? "s" : ""}`,
                  sub: `Size: ${form.enterpriseSize.join(", ")}${form.parkOnly ? " · Industrial Parks Only" : ""}`,
                },
                {
                  icon: "⚙️",
                  title: "Features",
                  value: [form.enableGps && "GPS Capture", form.enableOffline && "Offline Sync", form.enableAiExtract && "AI Extraction"].filter(Boolean).join(" · ") || "None",
                  sub: null,
                },
              ].map((row) => (
                <div
                  key={row.title}
                  style={{
                    background: "var(--card)",
                    padding: "12px 16px",
                    borderRadius: 10,
                    border: "1px solid var(--border)",
                    display: "flex",
                    gap: 12,
                    alignItems: "flex-start",
                  }}
                >
                  <span style={{ fontSize: 22, marginTop: 2 }}>{row.icon}</span>
                  <div>
                    <div style={{ fontSize: 11, fontWeight: 700, color: "var(--text2)", textTransform: "uppercase", letterSpacing: "0.05em" }}>{row.title}</div>
                    <div style={{ fontSize: 14, fontWeight: 700, color: "var(--text)", marginTop: 2 }}>{row.value}</div>
                    {row.sub && <div style={{ fontSize: 12, color: "var(--text2)", marginTop: 2 }}>{row.sub}</div>}
                  </div>
                </div>
              ))}
            </div>

            {/* Launch Alert */}
            <div
              style={{
                background: "linear-gradient(135deg, #eff6ff, #dbeafe)",
                border: "1px solid #93c5fd",
                borderRadius: 10,
                padding: "14px 18px",
                marginTop: 16,
                display: "flex",
                alignItems: "flex-start",
                gap: 12,
              }}
            >
              <span style={{ fontSize: 22 }}>🚀</span>
              <div>
                <div style={{ fontWeight: 700, fontSize: 14, color: "#1e40af" }}>Ready to broadcast to field network?</div>
                <div style={{ fontSize: 12.5, color: "#3b82f6", lineHeight: 1.5, marginTop: 3 }}>
                  Clicking "Launch Survey Campaign" will instantly notify all authorized enumerators in the selected regions, activate the NMIS CAPI mobile app sync, and create a live campaign dashboard with real-time response tracking.
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Footer Navigation */}
      <div
        style={{
          padding: "14px 28px",
          borderTop: "1px solid var(--border)",
          background: "var(--card)",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          borderRadius: "0 0 12px 12px",
        }}
      >
        <div>
          {step > 0 && (
            <Button variant="outline" size="sm" onClick={() => setStep((s) => s - 1)}>
              ← Previous
            </Button>
          )}
        </div>
        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          <span style={{ fontSize: 12, color: "var(--text2)" }}>Step {step + 1} of {STEPS.length}</span>
          {step < STEPS.length - 1 ? (
            <Button
              size="sm"
              onClick={() => setStep((s) => s + 1)}
              disabled={!canProceed()}
              style={{ minWidth: 120 }}
            >
              Next Step →
            </Button>
          ) : (
            <Button
              size="sm"
              onClick={handleLaunch}
              disabled={launching}
              style={{
                background: "linear-gradient(135deg, #059669, #34d399)",
                color: "#fff",
                border: "none",
                minWidth: 180,
                justifyContent: "center",
                boxShadow: "0 4px 14px rgba(5,150,105,0.3)",
              }}
            >
              {launching ? "Launching..." : "🚀 Launch Survey Campaign"}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
