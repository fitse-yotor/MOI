import { useState } from "react";
import { useSnackbar } from "../../context/SnackbarContext.jsx";
import Badge from "../../components/common/Badge.jsx";
import Button from "../../components/common/Button.jsx";

// Standard NMIS & Custom Component Palette
const FIELD_PALETTE = [
  { type: "text", label: "Text / String", icon: "🔤", category: "Basic", desc: "Short or long text entry" },
  { type: "number", label: "Numeric / Quantity", icon: "🔢", category: "Basic", desc: "Integer or decimal values with units" },
  { type: "currency", label: "Currency (ETB / USD)", icon: "💵", category: "Financial", desc: "Auto-formatted monetary values" },
  { type: "select", label: "Single Select / ISIC", icon: "📑", category: "Choice", desc: "Dropdown or radio option list" },
  { type: "multiselect", label: "Multi-Select / Tags", icon: "☑️", category: "Choice", desc: "Multiple choice checkboxes" },
  { type: "gps_map", label: "GPS Map Coordinates", icon: "📍", category: "GIS / Location", desc: "Interactive OpenStreetMap pin picker" },
  { type: "repeating_table", label: "Repeating Data Table", icon: "📊", category: "Advanced", desc: "Dynamic multi-row product or cost grid" },
  { type: "calc_formula", label: "Auto-Calculated Formula", icon: "⚡", category: "Advanced", desc: "Derived metrics like capacity % or variance" },
  { type: "matrix_grid", label: "Gender × Education Matrix", icon: "👥", category: "Demographics", desc: "Multi-tier cross-tabulation table" },
  { type: "ai_extractor", label: "AI Doc / Tax Ingestion", icon: "🤖", category: "AI & Smart", desc: "Auto-extract fields from uploaded PDF/Invoice" },
];

const INITIAL_SECTIONS = [
  {
    id: "sec_1",
    num: "1",
    title: "Identification & Spatial Footprint",
    icon: "📍",
    status: "Published",
    fields: [
      { id: "f1", label: "1.11 Registered Legal Name", type: "text", varName: "m1_reg_name", required: true, help: "Official name on commercial registration" },
      { id: "f2", label: "1.9 Taxpayer Identification (TIN)", type: "text", varName: "m1_tin", required: true, help: "10-digit primary tax identifier" },
      { id: "f3", label: "1.10 ISIC 4-Digit Activity Code", type: "select", varName: "m1_isic", required: true, options: ["1410 - Manufacture of wearing apparel", "1071 - Manufacture of bakery products", "2011 - Manufacture of basic chemicals", "1511 - Tanning and dressing of leather"] },
      { id: "f4", label: "1.8 Factory GPS Coordinates", type: "gps_map", varName: "m1_gps", required: true, help: "Click map or use live device geolocation" },
    ],
  },
  {
    id: "sec_2",
    num: "2",
    title: "Establishment Profile & Utilities",
    icon: "🏢",
    status: "Published",
    fields: [
      { id: "f5", label: "2.6 Legal Form of Ownership", type: "select", varName: "m2_legal_form", required: true, options: ["Private Limited Co. (PLC)", "Share Company (S.C.)", "Sole Proprietorship", "Public Enterprise"] },
      { id: "f6", label: "2.13 Current Paid-up Capital (ETB)", type: "currency", varName: "m2_paid_capital", required: true, help: "Audited paid-up balance" },
      { id: "f7", label: "2.18 Industrial Park / Zone", type: "select", varName: "m2_park", required: true, options: ["Bole Lemi IP", "Hawassa IP", "Kilinto IP", "Dire Dawa IP", "Debre Birhan IP", "Outside Park"] },
      { id: "f8", label: "2.20 Installed Power Capacity (kW)", type: "number", varName: "m2_installed_kw", required: false, unit: "kW" },
    ],
  },
  {
    id: "sec_3",
    num: "3",
    title: "Products & Capacity Matrix",
    icon: "📦",
    status: "Published",
    fields: [
      { id: "f9", label: "4.1 Principal Product Output & Sales Table", type: "repeating_table", varName: "m4_products_table", required: true, columns: ["Product Name", "Product Code", "Unit Price (ETB)", "Qty Produced", "Production Value", "Full Capacity Value", "Export Value"] },
      { id: "f10", label: "Estimated Capacity Utilization %", type: "calc_formula", varName: "m4_capacity_pct", formula: "([Total Production Val] / [Designed Capacity Val]) * 100", required: true },
    ],
  },
  {
    id: "sec_4",
    num: "4",
    title: "Raw Materials, Energy & Taxes",
    icon: "⚡",
    status: "Published",
    fields: [
      { id: "f11", label: "6.1 Local Raw Materials Cost (ETB)", type: "currency", varName: "m6_local_raw_val", required: true },
      { id: "f12", label: "6.1 Imported Raw Materials Cost (ETB)", type: "currency", varName: "m6_import_raw_val", required: true },
      { id: "f13", label: "6.2 Annual Electricity Utility Bill (ETB)", type: "currency", varName: "m6_electric_bill", required: true },
      { id: "f14", label: "6.4 Value Added Tax (VAT) Paid (ETB)", type: "currency", varName: "m6_vat_paid", required: true },
    ],
  },
  {
    id: "sec_5",
    num: "5",
    title: "Operational Bottlenecks & Gaps",
    icon: "⚠️",
    status: "Draft",
    fields: [
      { id: "f15", label: "8.1 Primary Obstacle to Full Capacity", type: "select", varName: "m8_primary_obstacle", required: true, options: ["Foreign exchange shortage for inputs", "Power outages & voltage instability", "Raw material supply shortages", "High loan interest / working capital", "Lack of export market demand"] },
      { id: "f16", label: "8.4 Bank Loan Access Hurdles", type: "text", varName: "m8_loan_hurdles", required: false },
    ],
  },
];

export default function QuestionnaireBuilder() {
  const { notify } = useSnackbar();
  const [sections, setSections] = useState(INITIAL_SECTIONS);
  const [activeSectionId, setActiveSectionId] = useState("sec_1");
  const [selectedFieldId, setSelectedFieldId] = useState("f1");
  const [activeTab, setActiveTab] = useState("canvas"); // 'canvas' | 'logic' | 'ai_copilot' | 'deploy'
  const [aiPrompt, setAiPrompt] = useState("");
  const [aiGenerating, setAiGenerating] = useState(false);
  const [schemaExportModal, setSchemaExportModal] = useState(false);

  const activeSection = sections.find((s) => s.id === activeSectionId) || sections[0];
  const selectedField = activeSection?.fields.find((f) => f.id === selectedFieldId);

  // Field manipulation helpers
  function addField(paletteItem) {
    const newField = {
      id: `f_${Date.now() % 10000}`,
      label: `New ${paletteItem.label} Question`,
      type: paletteItem.type,
      varName: `var_${Date.now() % 1000}`,
      required: false,
      help: `Custom input for ${paletteItem.label}`,
      options: paletteItem.type === "select" || paletteItem.type === "multiselect" ? ["Option A", "Option B", "Option C"] : undefined,
      columns: paletteItem.type === "repeating_table" ? ["Item Description", "Unit", "Quantity", "Total Cost"] : undefined,
    };

    setSections((prev) =>
      prev.map((s) => (s.id === activeSectionId ? { ...s, fields: [...s.fields, newField] } : s))
    );
    setSelectedFieldId(newField.id);
    notify(`Added ${paletteItem.label} to Section ${activeSection.num}`, "success");
  }

  function updateSelectedField(key, val) {
    if (!selectedFieldId) return;
    setSections((prev) =>
      prev.map((s) =>
        s.id === activeSectionId
          ? {
              ...s,
              fields: s.fields.map((f) => (f.id === selectedFieldId ? { ...f, [key]: val } : f)),
            }
          : s
      )
    );
  }

  function removeField(fieldId) {
    setSections((prev) =>
      prev.map((s) =>
        s.id === activeSectionId
          ? { ...s, fields: s.fields.filter((f) => f.id !== fieldId) }
          : s
      )
    );
    if (selectedFieldId === fieldId) setSelectedFieldId(null);
    notify("Field removed from section", "info");
  }

  function moveField(idx, dir) {
    const fields = [...activeSection.fields];
    const targetIdx = idx + dir;
    if (targetIdx < 0 || targetIdx >= fields.length) return;
    const [moved] = fields.splice(idx, 1);
    fields.splice(targetIdx, 0, moved);
    setSections((prev) =>
      prev.map((s) => (s.id === activeSectionId ? { ...s, fields } : s))
    );
  }

  function addNewSection() {
    const nextNum = (sections.length + 1).toString();
    const newSec = {
      id: `sec_${Date.now()}`,
      num: nextNum,
      title: `Custom Survey Module ${nextNum}`,
      icon: "📋",
      status: "Draft",
      fields: [
        { id: `f_${Date.now()}`, label: "Initial Question", type: "text", varName: `mod${nextNum}_q1`, required: false },
      ],
    };
    setSections((prev) => [...prev, newSec]);
    setActiveSectionId(newSec.id);
    setSelectedFieldId(newSec.fields[0].id);
    notify(`Created Section ${nextNum}`, "success");
  }

  // AI Copilot simulation
  function handleAiGenerate() {
    if (!aiPrompt.trim()) return;
    setAiGenerating(true);
    setTimeout(() => {
      const generatedFields = [
        { id: `ai_${Date.now()}_1`, label: "Annual Renewable Energy Consumed (kWh)", type: "number", varName: "green_energy_kwh", required: true, help: "Solar, wind or biomass energy usage" },
        { id: `ai_${Date.now()}_2`, label: "Carbon Footprint Audit Certification", type: "select", varName: "iso_carbon_cert", required: false, options: ["ISO 14064 Certified", "Under Assessment", "Not Certified"] },
        { id: `ai_${Date.now()}_3`, label: "Effluent Treatment Plant (ETP) Daily Capacity", type: "number", varName: "etp_capacity_m3", required: true, unit: "m³/day" },
      ];
      setSections((prev) =>
        prev.map((s) =>
          s.id === activeSectionId ? { ...s, fields: [...s.fields, ...generatedFields] } : s
        )
      );
      setAiGenerating(false);
      setAiPrompt("");
      notify(`AI Copilot generated 3 standardized indicators for ${activeSection.title}!`, "success");
    }, 900);
  }

  const totalQuestions = sections.reduce((sum, s) => sum + s.fields.length, 0);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      {/* Top Futuristic Action Bar */}
      <div
        style={{
          background: "linear-gradient(135deg, #090d16 0%, #0f172a 50%, #0369a1 100%)",
          color: "#fff",
          padding: "16px 22px",
          borderRadius: 14,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: 14,
          boxShadow: "0 10px 30px rgba(3, 105, 161, 0.25)",
          border: "1px solid rgba(56, 189, 248, 0.2)",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <div
            style={{
              width: 44,
              height: 44,
              borderRadius: 10,
              background: "rgba(56, 189, 248, 0.15)",
              border: "1px solid #38bdf8",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 22,
            }}
          >
            ⚡
          </div>
          <div>
            <div style={{ fontWeight: 800, fontSize: 17, letterSpacing: "-0.01em", display: "flex", alignItems: "center", gap: 8 }}>
              NMIS Questionnaire Studio & Schema Engine
              <span style={{ fontSize: 10, background: "rgba(56, 189, 248, 0.2)", color: "#7dd3fc", border: "1px solid #38bdf8", padding: "1px 6px", borderRadius: 4 }}>
                v16.5 NextGen
              </span>
            </div>
            <div style={{ fontSize: 12, color: "#94a3b8", marginTop: 2 }}>
              Visual dynamic schema builder, conditional logic engine, ODK/XLSForm compatibility & AI survey optimization.
            </div>
          </div>
        </div>

        <div style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}>
          <div style={{ fontSize: 12, color: "#7dd3fc", marginRight: 6 }}>
            <strong>{sections.length}</strong> Modules · <strong>{totalQuestions}</strong> Indicators Active
          </div>
          <button
            type="button"
            onClick={() => setSchemaExportModal(true)}
            style={{
              padding: "6px 12px",
              borderRadius: 8,
              background: "rgba(255, 255, 255, 0.08)",
              border: "1px solid rgba(255, 255, 255, 0.2)",
              color: "#fff",
              fontSize: 12,
              fontWeight: 700,
              cursor: "pointer",
            }}
          >
            📤 Export Schema JSON
          </button>
          <Button
            size="sm"
            onClick={() => notify("Questionnaire schema v16.5 successfully published to national enumerator network!", "success")}
            style={{
              background: "linear-gradient(135deg, #0284c7, #38bdf8)",
              color: "#fff",
              border: "none",
              boxShadow: "0 2px 10px rgba(56, 189, 248, 0.4)",
            }}
          >
            🚀 Publish Live to Field Network
          </Button>
        </div>
      </div>

      {/* Mode Subtabs */}
      <div style={{ display: "flex", gap: 6, borderBottom: "1px solid var(--border)", paddingBottom: 8 }}>
        {[
          { key: "canvas", label: "🎨 Visual Form Canvas", icon: "✨" },
          { key: "logic", label: "🔀 Skip-Logic & Branching Rules", icon: "⚡" },
          { key: "ai_copilot", label: "🤖 AI Survey Copilot & Standards Audit", icon: "🧠" },
          { key: "deploy", label: "📡 Field Campaign Targeting", icon: "🎯" },
        ].map((tab) => (
          <button
            key={tab.key}
            type="button"
            onClick={() => setActiveTab(tab.key)}
            style={{
              padding: "8px 16px",
              borderRadius: 8,
              fontSize: 12.5,
              fontWeight: 700,
              border: activeTab === tab.key ? "1px solid var(--primary)" : "1px solid transparent",
              background: activeTab === tab.key ? "var(--card)" : "transparent",
              color: activeTab === tab.key ? "var(--primary)" : "var(--text2)",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: 6,
              boxShadow: activeTab === tab.key ? "var(--shadow-xs)" : "none",
            }}
          >
            <span>{tab.icon}</span>
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* ── TAB 1: 3-PANEL VISUAL STUDIO CANVAS ── */}
      {activeTab === "canvas" && (
        <div style={{ display: "grid", gridTemplateColumns: "260px 1fr 310px", gap: 16, alignItems: "start" }}>
          {/* Left Panel: Sections & Component Palette */}
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            {/* Section Module Tree */}
            <div style={{ background: "var(--card)", padding: 14, borderRadius: 12, border: "1px solid var(--border)", boxShadow: "var(--shadow-sm)" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
                <span style={{ fontSize: 12, fontWeight: 800, color: "var(--text2)", textTransform: "uppercase" }}>Survey Modules</span>
                <button
                  type="button"
                  onClick={addNewSection}
                  style={{
                    border: "1px dashed var(--primary)",
                    background: "rgba(3, 105, 161, 0.05)",
                    color: "var(--primary)",
                    borderRadius: 6,
                    padding: "2px 8px",
                    fontSize: 11,
                    fontWeight: 700,
                    cursor: "pointer",
                  }}
                >
                  + Add Section
                </button>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                {sections.map((s) => {
                  const isActive = s.id === activeSectionId;
                  return (
                    <button
                      key={s.id}
                      type="button"
                      onClick={() => {
                        setActiveSectionId(s.id);
                        if (s.fields.length > 0) setSelectedFieldId(s.fields[0].id);
                      }}
                      style={{
                        padding: "8px 10px",
                        borderRadius: 8,
                        border: isActive ? "2px solid var(--primary)" : "1px solid var(--border)",
                        background: isActive ? "var(--bg2)" : "var(--card)",
                        textAlign: "left",
                        cursor: "pointer",
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        transition: "all 0.15s ease",
                      }}
                    >
                      <div style={{ display: "flex", alignItems: "center", gap: 8, overflow: "hidden" }}>
                        <span style={{ fontSize: 14 }}>{s.icon}</span>
                        <div style={{ textOverflow: "ellipsis", overflow: "hidden", whiteSpace: "nowrap" }}>
                          <div style={{ fontSize: 12, fontWeight: 700, color: isActive ? "var(--primary)" : "var(--text)" }}>
                            {s.num}. {s.title}
                          </div>
                          <div style={{ fontSize: 10, color: "var(--text2)" }}>{s.fields.length} questions</div>
                        </div>
                      </div>
                      <Badge tone={s.status === "Published" ? "success" : "muted"} style={{ fontSize: 9 }}>
                        {s.status}
                      </Badge>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Component Palette */}
            <div style={{ background: "var(--card)", padding: 14, borderRadius: 12, border: "1px solid var(--border)", boxShadow: "var(--shadow-sm)" }}>
              <div style={{ fontSize: 12, fontWeight: 800, color: "var(--text2)", textTransform: "uppercase", marginBottom: 10 }}>
                Indicator Component Palette
              </div>
              <div style={{ fontSize: 11, color: "var(--text2)", marginBottom: 10 }}>
                Click any component below to inject into <strong>Section {activeSection.num}</strong>:
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: 6 }}>
                {FIELD_PALETTE.map((p) => (
                  <button
                    key={p.type}
                    type="button"
                    onClick={() => addField(p)}
                    style={{
                      padding: "8px 10px",
                      borderRadius: 8,
                      border: "1px solid var(--border)",
                      background: "var(--card)",
                      display: "flex",
                      alignItems: "center",
                      gap: 10,
                      cursor: "pointer",
                      textAlign: "left",
                      transition: "all 0.12s ease",
                    }}
                    onMouseOver={(e) => {
                      e.currentTarget.style.borderColor = "var(--primary)";
                      e.currentTarget.style.background = "var(--bg2)";
                    }}
                    onMouseOut={(e) => {
                      e.currentTarget.style.borderColor = "var(--border)";
                      e.currentTarget.style.background = "var(--card)";
                    }}
                  >
                    <span style={{ fontSize: 16, width: 22, textAlign: "center" }}>{p.icon}</span>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 12, fontWeight: 700, color: "var(--text)" }}>{p.label}</div>
                      <div style={{ fontSize: 10, color: "var(--text2)" }}>{p.desc}</div>
                    </div>
                    <span style={{ fontSize: 12, color: "var(--primary)", fontWeight: 800 }}>+</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Center Canvas: Interactive Live Visual Form Builder */}
          <div style={{ background: "var(--card)", padding: 20, borderRadius: 14, border: "1px solid var(--border)", boxShadow: "var(--shadow-sm)" }}>
            {/* Section Banner Header */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid var(--border)", paddingBottom: 12, marginBottom: 16 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <span style={{ fontSize: 28 }}>{activeSection.icon}</span>
                <div>
                  <h3 style={{ margin: 0, fontSize: 17 }}>{`${activeSection.num}. ${activeSection.title}`}</h3>
                  <div style={{ fontSize: 12, color: "var(--text2)", marginTop: 2 }}>
                    Reorder, configure validation, or write formulas for this module.
                  </div>
                </div>
              </div>
              <Badge tone="info">{`${activeSection.fields.length} Fields Configured`}</Badge>
            </div>

            {/* Questions Stack */}
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {activeSection.fields.map((f, idx) => {
                const isSelected = f.id === selectedFieldId;
                return (
                  <div
                    key={f.id}
                    onClick={() => setSelectedFieldId(f.id)}
                    style={{
                      padding: "14px 16px",
                      borderRadius: 10,
                      border: isSelected ? "2px solid var(--primary)" : "1px solid var(--border)",
                      background: isSelected ? "var(--bg2)" : "var(--card)",
                      boxShadow: isSelected ? "0 4px 14px rgba(3, 105, 161, 0.12)" : "none",
                      cursor: "pointer",
                      transition: "all 0.15s ease",
                      position: "relative",
                    }}
                  >
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        <span style={{ fontSize: 11, fontWeight: 800, background: "var(--bg)", border: "1px solid var(--border)", padding: "2px 6px", borderRadius: 4, color: "var(--text2)" }}>
                          #{idx + 1}
                        </span>
                        <span style={{ fontWeight: 700, fontSize: 13.5, color: isSelected ? "var(--primary)" : "var(--text)" }}>
                          {f.label} {f.required && <span style={{ color: "#ef4444" }}>*</span>}
                        </span>
                        <Badge tone="muted" style={{ fontSize: 10 }}>{f.type}</Badge>
                      </div>

                      {/* Action buttons */}
                      <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                        <button
                          type="button"
                          onClick={(e) => { e.stopPropagation(); moveField(idx, -1); }}
                          disabled={idx === 0}
                          style={{ border: "none", background: "transparent", cursor: "pointer", opacity: idx === 0 ? 0.3 : 0.7 }}
                          title="Move up"
                        >
                          ▲
                        </button>
                        <button
                          type="button"
                          onClick={(e) => { e.stopPropagation(); moveField(idx, 1); }}
                          disabled={idx === activeSection.fields.length - 1}
                          style={{ border: "none", background: "transparent", cursor: "pointer", opacity: idx === activeSection.fields.length - 1 ? 0.3 : 0.7 }}
                          title="Move down"
                        >
                          ▼
                        </button>
                        <button
                          type="button"
                          onClick={(e) => { e.stopPropagation(); removeField(f.id); }}
                          style={{ border: "none", background: "transparent", color: "#ef4444", cursor: "pointer", marginLeft: 6, fontWeight: 800 }}
                          title="Delete field"
                        >
                          ✕
                        </button>
                      </div>
                    </div>

                    {/* Field UI Demonstration / Render */}
                    <div style={{ marginTop: 6 }}>
                      {f.type === "text" && (
                        <input disabled placeholder="Enumerator text entry..." style={{ width: "100%", opacity: 0.7, background: "var(--bg)" }} />
                      )}
                      {f.type === "number" && (
                        <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
                          <input disabled placeholder="0.00" style={{ width: "50%", opacity: 0.7, background: "var(--bg)" }} />
                          {f.unit && <span style={{ fontSize: 12, color: "var(--text2)" }}>Unit: <strong>{f.unit}</strong></span>}
                        </div>
                      )}
                      {f.type === "currency" && (
                        <input disabled placeholder="ETB 0.00" style={{ width: "50%", opacity: 0.7, background: "var(--bg)", fontFamily: "monospace" }} />
                      )}
                      {f.type === "select" && (
                        <select disabled style={{ width: "100%", opacity: 0.7, background: "var(--bg)" }}>
                          {(f.options || []).map((o) => <option key={o}>{o}</option>)}
                        </select>
                      )}
                      {f.type === "gps_map" && (
                        <div style={{ background: "var(--bg2)", border: "1px dashed var(--primary)", borderRadius: 8, padding: 12, textAlign: "center", fontSize: 12, color: "var(--primary)" }}>
                          🗺️ Interactive Leaflet Map Selector (Click-to-pin & WGS84 Geocoder) Active
                        </div>
                      )}
                      {f.type === "repeating_table" && (
                        <div style={{ background: "var(--bg)", border: "1px solid var(--border)", borderRadius: 6, padding: 8, fontSize: 11, color: "var(--text2)" }}>
                          📊 Dynamic Multi-row Matrix: <code>{(f.columns || []).join(" | ")}</code>
                        </div>
                      )}
                      {f.type === "calc_formula" && (
                        <div style={{ background: "#f0f9ff", border: "1px solid #bae6fd", borderRadius: 6, padding: 8, fontSize: 12, color: "#0369a1" }}>
                          ⚡ Calculated Metric: <code>{f.formula}</code>
                        </div>
                      )}
                    </div>

                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 8, fontSize: 11, color: "var(--text2)" }}>
                      <span>Variable: <code className="mono" style={{ color: "var(--primary)" }}>{f.varName}</code></span>
                      <span>{f.help || "No helper text"}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right Panel: Selected Field Properties Inspector */}
          <div style={{ background: "var(--card)", padding: 16, borderRadius: 12, border: "1px solid var(--border)", boxShadow: "var(--shadow-sm)" }}>
            <div style={{ fontSize: 12, fontWeight: 800, color: "var(--text2)", textTransform: "uppercase", marginBottom: 12 }}>
              ⚙️ Field Property Inspector
            </div>

            {selectedField ? (
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                <div className="form-field">
                  <label>Question Label / Display Text</label>
                  <input
                    value={selectedField.label}
                    onChange={(e) => updateSelectedField("label", e.target.value)}
                  />
                </div>

                <div className="form-field">
                  <label>Schema Variable Name (DB Key)</label>
                  <input
                    value={selectedField.varName}
                    onChange={(e) => updateSelectedField("varName", e.target.value)}
                    style={{ fontFamily: "monospace" }}
                  />
                </div>

                <div className="form-field">
                  <label>Field Type</label>
                  <input value={selectedField.type} disabled style={{ background: "var(--bg2)" }} />
                </div>

                <div className="form-field">
                  <label>Helper / Enumerator Guidance Note</label>
                  <textarea
                    rows={2}
                    value={selectedField.help || ""}
                    onChange={(e) => updateSelectedField("help", e.target.value)}
                    placeholder="Instructions for enumerator..."
                  />
                </div>

                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "8px 0", borderTop: "1px solid var(--border)" }}>
                  <span style={{ fontSize: 13, fontWeight: 600 }}>Mandatory / Required</span>
                  <input
                    type="checkbox"
                    checked={!!selectedField.required}
                    onChange={(e) => updateSelectedField("required", e.target.checked)}
                    style={{ width: 18, height: 18, cursor: "pointer" }}
                  />
                </div>

                {selectedField.type === "number" && (
                  <div className="form-field">
                    <label>Measurement Unit (e.g. kW, Pcs, m²)</label>
                    <input
                      value={selectedField.unit || ""}
                      onChange={(e) => updateSelectedField("unit", e.target.value)}
                      placeholder="e.g. kW"
                    />
                  </div>
                )}

                {selectedField.type === "calc_formula" && (
                  <div className="form-field">
                    <label>Calculation Expression</label>
                    <input
                      value={selectedField.formula || ""}
                      onChange={(e) => updateSelectedField("formula", e.target.value)}
                      placeholder="e.g. ([FieldA] / [FieldB]) * 100"
                      style={{ fontFamily: "monospace" }}
                    />
                  </div>
                )}
              </div>
            ) : (
              <div style={{ color: "var(--text2)", fontSize: 12, textAlign: "center", padding: "20px 0" }}>
                Select an indicator from the canvas to inspect and edit its properties.
              </div>
            )}
          </div>
        </div>
      )}

      {/* ── TAB 2: SKIP-LOGIC & BRANCHING RULES ── */}
      {activeTab === "logic" && (
        <div style={{ background: "var(--card)", padding: 22, borderRadius: 12, border: "1px solid var(--border)" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
            <div>
              <h3 style={{ margin: 0, fontSize: 16 }}>⚡ Visual Skip-Logic & Conditional Branching Rules</h3>
              <div style={{ fontSize: 12, color: "var(--text2)", marginTop: 2 }}>
                Dynamically hide, show, or require indicators based on enterprise responses.
              </div>
            </div>
            <Button size="sm">+ New Conditional Rule</Button>
          </div>

          <div style={{ display: "grid", gap: 12 }}>
            {[
              { ifVar: "m2_park != 'Outside Park'", thenAction: "Show 2.18 Specific Industrial Park Name selector", icon: "🏢", active: true },
              { ifVar: "m6_import_raw_val > 0", thenAction: "Show 8.8 Reasons for Imported Raw Materials dependency", icon: "📦", active: true },
              { ifVar: "m8_primary_obstacle == 'Foreign exchange shortage'", thenAction: "Trigger Forex Allocation priority support review in M10", icon: "💵", active: true },
              { ifVar: "m9_has_website == 'Yes'", thenAction: "Auto-provision public website portal template in /site/:slug", icon: "🌐", active: true },
            ].map((rule, idx) => (
              <div
                key={idx}
                style={{
                  background: "var(--bg2)",
                  padding: "12px 16px",
                  borderRadius: 10,
                  border: "1px solid var(--border)",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  flexWrap: "wrap",
                  gap: 10,
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <span style={{ fontSize: 20 }}>{rule.icon}</span>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 700 }}>
                      <span style={{ color: "var(--primary)" }}>IF</span> <code>{rule.ifVar}</code>
                    </div>
                    <div style={{ fontSize: 12, color: "var(--text2)", marginTop: 2 }}>
                      <span style={{ color: "#059669", fontWeight: 700 }}>THEN</span> {rule.thenAction}
                    </div>
                  </div>
                </div>
                <Badge tone="success">Active Rule</Badge>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── TAB 3: AI SURVEY COPILOT & AUDIT ── */}
      {activeTab === "ai_copilot" && (
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
          {/* AI Generator Panel */}
          <div style={{ background: "var(--card)", padding: 20, borderRadius: 12, border: "1px solid var(--border)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
              <span style={{ fontSize: 22 }}>🤖</span>
              <h3 style={{ margin: 0, fontSize: 16 }}>AI Survey Indicator Generator</h3>
            </div>
            <p style={{ fontSize: 12.5, color: "var(--text2)", lineHeight: 1.5, marginBottom: 14 }}>
              Describe the manufacturing domain or policy focus area, and the AI Copilot will generate standardized, CSS/ISIC-compliant survey questions.
            </p>

            <textarea
              rows={3}
              value={aiPrompt}
              onChange={(e) => setAiPrompt(e.target.value)}
              placeholder="e.g. Generate ESG green manufacturing questions, carbon footprint metrics, and renewable solar power capacity for textile mills..."
              style={{ width: "100%", marginBottom: 12 }}
            />

            <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 14 }}>
              {["ESG Green Manufacturing", "Leather Value Chain Traceability", "Forex Import Substitution", "Workplace Gender Equity"].map((preset) => (
                <button
                  key={preset}
                  type="button"
                  onClick={() => setAiPrompt(`Generate survey questions for ${preset}`)}
                  style={{
                    border: "1px solid var(--border)",
                    background: "var(--bg2)",
                    borderRadius: 14,
                    padding: "4px 10px",
                    fontSize: 11,
                    cursor: "pointer",
                  }}
                >
                  ✨ {preset}
                </button>
              ))}
            </div>

            <Button
              size="sm"
              onClick={handleAiGenerate}
              disabled={aiGenerating || !aiPrompt.trim()}
              style={{ width: "100%", justifyContent: "center" }}
            >
              {aiGenerating ? "Generating Standardized Schema..." : "⚡ Generate & Append to Section"}
            </Button>
          </div>

          {/* Standards Compliance Audit */}
          <div style={{ background: "var(--card)", padding: 20, borderRadius: 12, border: "1px solid var(--border)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
              <span style={{ fontSize: 22 }}>🛡️</span>
              <h3 style={{ margin: 0, fontSize: 16 }}>National Standards & Completeness Audit</h3>
            </div>

            <div style={{ display: "grid", gap: 10 }}>
              {[
                { label: "NMIS V16 Core Census Baseline Coverage", score: "98%", status: "success", note: "All 10 required statistical modules present" },
                { label: "UN ISIC Rev. 4 Taxonomy Alignment", score: "100%", status: "success", note: "Complies with Ethiopian Central Statistics Service standard" },
                { label: "Gender-Disaggregated Workforce Ratios", score: "94%", status: "success", note: "Permanent and contract split by sex enabled" },
                { label: "Spatial GIS Geo-Referencing Precision", score: "100%", status: "success", note: "WGS84 GPS coordinate capture configured" },
              ].map((audit, idx) => (
                <div
                  key={idx}
                  style={{
                    background: "var(--bg2)",
                    padding: "10px 14px",
                    borderRadius: 8,
                    border: "1px solid var(--border)",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <div>
                    <div style={{ fontSize: 12.5, fontWeight: 700 }}>{audit.label}</div>
                    <div style={{ fontSize: 11, color: "var(--text2)", marginTop: 2 }}>{audit.note}</div>
                  </div>
                  <Badge tone={audit.status}>{audit.score}</Badge>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ── TAB 4: FIELD DEPLOYMENT & TARGETING ── */}
      {activeTab === "deploy" && (
        <div style={{ background: "var(--card)", padding: 22, borderRadius: 12, border: "1px solid var(--border)" }}>
          <h3 style={{ margin: "0 0 14px 0", fontSize: 16 }}>📡 Multi-Channel Campaign Targeting & Deployment Matrix</h3>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 14 }}>
            <div className="form-field">
              <label>Target Industrial Sectors</label>
              <select defaultValue="all">
                <option value="all">All Manufacturing Sectors (10 Sectors)</option>
                <option value="textile">Textile & Garment Only</option>
                <option value="food">Food & Beverage Only</option>
                <option value="leather">Leather & Footwear Only</option>
              </select>
            </div>
            <div className="form-field">
              <label>Enterprise Size Classification</label>
              <select defaultValue="all">
                <option value="all">All Sizes (Small, Medium, Large)</option>
                <option value="med_large">Medium & Large Enterprises Only</option>
              </select>
            </div>
            <div className="form-field">
              <label>Geographic Deployment Scope</label>
              <select defaultValue="national">
                <option value="national">National (All 12 Regions + 2 City Admins)</option>
                <option value="parks">Industrial Parks Only (17 Parks)</option>
              </select>
            </div>
          </div>

          <div style={{ marginTop: 20, paddingTop: 16, borderTop: "1px solid var(--border)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ fontSize: 12, color: "var(--text2)" }}>
              Deployment Target: <strong>12,480 Active Establishments</strong> across Ethiopia
            </span>
            <Button variant="accent" size="sm" onClick={() => notify("Campaign configuration locked and broadcast to regional branches", "success")}>
              ✓ Lock & Broadcast Campaign
            </Button>
          </div>
        </div>
      )}

      {/* Schema Export JSON Modal */}
      {schemaExportModal && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: "rgba(0,0,0,0.7)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 9999,
            padding: 20,
          }}
        >
          <div
            style={{
              background: "var(--card)",
              borderRadius: 14,
              width: "100%",
              maxWidth: 680,
              padding: 20,
              border: "1px solid var(--border)",
              boxShadow: "0 25px 50px rgba(0,0,0,0.4)",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
              <div style={{ fontWeight: 800, fontSize: 16 }}>📤 NMIS V16 Open Data Schema JSON</div>
              <button
                type="button"
                onClick={() => setSchemaExportModal(false)}
                style={{ border: "none", background: "transparent", fontSize: 18, cursor: "pointer" }}
              >
                ✕
              </button>
            </div>
            <pre
              style={{
                background: "var(--bg2)",
                padding: 14,
                borderRadius: 8,
                maxHeight: 340,
                overflowY: "auto",
                fontSize: 11.5,
                fontFamily: "monospace",
                color: "var(--text)",
                border: "1px solid var(--border)",
              }}
            >
              {JSON.stringify({ surveyTitle: "NMIS V16", version: "16.5", totalModules: sections.length, sections }, null, 2)}
            </pre>
            <div style={{ display: "flex", justifyContent: "flex-end", gap: 10, marginTop: 14 }}>
              <Button
                size="sm"
                onClick={() => {
                  navigator.clipboard?.writeText(JSON.stringify(sections, null, 2));
                  notify("Schema JSON copied to clipboard!", "success");
                }}
              >
                📋 Copy JSON
              </Button>
              <Button variant="outline" size="sm" onClick={() => setSchemaExportModal(false)}>
                Close
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
