import { useState } from "react";
import { useApiGet, useApiAction } from "../../api/hooks.js";
import { useSnackbar } from "../../context/SnackbarContext.jsx";
import Badge from "../../components/common/Badge.jsx";
import Button from "../../components/common/Button.jsx";
import DataTable from "../../components/common/DataTable.jsx";
import { DataState } from "../../components/common/StateViews.jsx";

const SAMPLE_CSV = `exporter_tin,registered_name,tariff_hs_code,fob_value_usd,destination_iso,export_date
0091234567,Bole Lemi Garments PLC,6203.42,450000,USA,2026-08-01
0098765432,Awash Wine S.C.,2204.21,120000,KEN,2026-08-02
0054321098,Dire Dawa Textiles PLC,5208.11,850000,CHN,2026-08-03
0011223344,Mojo Leather Tannery,4104.11,320000,ITA,2026-08-04`;

const SAMPLE_JSON = JSON.stringify(
  [
    { point_id: "FIBER-HL-01", park_name: "Hawassa Industrial Park", available_bandwidth_gbps: 100, fiber_ring_type: "Dual Redundant Fiber Ring", status: "ACTIVE", active_factories_connected: 38 },
    { point_id: "FIBER-BL-02", park_name: "Bole Lemi Industrial Park", available_bandwidth_gbps: 100, fiber_ring_type: "Dual Redundant Fiber Ring", status: "ACTIVE", active_factories_connected: 42 },
    { point_id: "FIBER-DD-03", park_name: "Dire Dawa Free Trade Zone", available_bandwidth_gbps: 50, fiber_ring_type: "Single Core Fiber Ring", status: "ACTIVE", active_factories_connected: 19 },
    { point_id: "FIBER-KM-04", park_name: "Kombolcha Industrial Park", available_bandwidth_gbps: 40, fiber_ring_type: "Single Core Fiber Ring", status: "MAINTENANCE", active_factories_connected: 14 }
  ],
  null,
  2
);

export default function IntegrationsPage() {
  const { data, loading, error, refetch } = useApiGet("/integrations");
  const { data: logsData } = useApiGet("/integrations/logs");
  const { data: discoveredData, refetch: refetchDiscovered } = useApiGet("/integrations/discovered-enterprises");
  const { run: triggerSync, pending: syncing } = useApiAction("post");
  const { run: previewFile } = useApiAction("post");
  const { run: createConn } = useApiAction("post");
  const { run: autoRegister } = useApiAction("post");
  const { notify } = useSnackbar();

  const [activeTab, setActiveTab] = useState("connectors");
  const [selectedConnector, setSelectedConnector] = useState(null);
  const [registeringId, setRegisteringId] = useState(null);
  const [syncingId, setSyncingId] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // File Upload State
  const [fileContent, setFileContent] = useState(SAMPLE_CSV);
  const [fileType, setFileType] = useState("csv");
  const [previewResult, setPreviewResult] = useState(null);
  const [fileIngested, setFileIngested] = useState(false);

  // New Connector Form
  const [form, setForm] = useState({
    name: "",
    type: "REST_API",
    category: "Government Agency",
    endpoint: "",
    syncFrequency: "Daily",
    authType: "API Key",
    description: "",
  });

  const summary = data?.summary || { totalIntegrations: 0, connectedApis: 0, activeFileFeeds: 0, totalRecordsSynced: 0 };
  const items = data?.items || [];
  const logs = logsData?.items || [];

  const { run: ingestFile } = useApiAction("post");

  async function handleSync(connector) {
    setSyncingId(connector.id);
    try {
      const res = await triggerSync(`/integrations/${connector.id}/sync`, {});
      const addedMsg = res?.newEnterprisesAdded > 0
        ? ` Auto-integrated ${res.newEnterprisesAdded} new enterprise(s) into Enterprise Registry!`
        : "";
      notify(`Sync completed for ${connector.name}.${addedMsg}`, "success");
      refetch();
      refetchDiscovered();
    } catch (err) {
      notify(err.message || "Sync execution failed", "error");
    } finally {
      setSyncingId(null);
    }
  }

  async function handlePreviewFile() {
    if (!fileContent.trim()) {
      notify("Please provide or paste file content", "warn");
      return;
    }
    try {
      const res = await previewFile("/integrations/preview-file", { fileContent, fileType });
      setPreviewResult(res);
      setFileIngested(false);
      notify(`Schema analyzed. Detected ${res.headers?.length || 0} columns across ${res.totalRecords || 0} rows.`, "info");
    } catch (err) {
      notify(err.message || "Failed to parse file content", "error");
    }
  }

  async function handleIngestData() {
    try {
      const res = await ingestFile("/integrations/ingest-file", { fileContent, fileType });
      setFileIngested(true);
      notify(`Ingested batch dataset! Integrated ${res?.count || 0} new enterprise(s) directly into Enterprise Registry.`, "success");
      refetchDiscovered();
    } catch (err) {
      notify(err.message || "Failed to ingest datafile into registry", "error");
    }
  }

  async function handleCreateConnector(e) {
    e.preventDefault();
    if (!form.name.trim()) {
      notify("Connector name is required", "warn");
      return;
    }
    try {
      await createConn("/integrations", form);
      notify("New data integration connector created successfully!", "success");
      setIsModalOpen(false);
      setForm({ name: "", type: "REST_API", category: "Government Agency", endpoint: "", syncFrequency: "Daily", authType: "API Key", description: "" });
      refetch();
    } catch (err) {
      notify(err.message || "Failed to create connector", "error");
    }
  }

  async function handleAutoRegister(item) {
    setRegisteringId(item.id);
    try {
      const res = await autoRegister("/integrations/auto-register", item.rawPayload || item);
      notify(`Auto-registered '${item.name}' into official Enterprise Registry!`, "success");
      refetchDiscovered();
    } catch (err) {
      notify(err.message || "Failed to auto-register enterprise", "error");
    } finally {
      setRegisteringId(null);
    }
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>

      {/* ── KPI Summary Header ── */}
      <div className="grid g4">
        <div className="card kpi">
          <div className="accent-bar" style={{ background: "var(--primary)" }} />
          <div className="label">Total Integration Channels</div>
          <div className="value">{summary.totalIntegrations}</div>
          <span className="badge info" style={{ marginTop: 8 }}>Operational</span>
        </div>
        <div className="card kpi">
          <div className="accent-bar" style={{ background: "var(--success)" }} />
          <div className="label">Connected REST APIs</div>
          <div className="value">{summary.connectedApis}</div>
          <span className="badge success" style={{ marginTop: 8 }}>Live Telemetry</span>
        </div>
        <div className="card kpi">
          <div className="accent-bar" style={{ background: "var(--accent)" }} />
          <div className="label">Active Datafile Feeds</div>
          <div className="value">{summary.activeFileFeeds}</div>
          <span className="badge warn" style={{ marginTop: 8 }}>Batch Processing</span>
        </div>
        <div className="card kpi">
          <div className="accent-bar" style={{ background: "var(--info)" }} />
          <div className="label">Ingested External Records</div>
          <div className="value">{summary.totalRecordsSynced?.toLocaleString() || "0"}</div>
          <span className="badge info" style={{ marginTop: 8 }}>Synced to Registry</span>
        </div>
      </div>

      {/* ── Toolbar & Action Bar ── */}
      <div className="card" style={{ padding: "16px 20px" }}>
        <div className="flexbtw" style={{ flexWrap: "wrap", gap: 12 }}>
          <div className="tabs" style={{ margin: 0, border: "none" }}>
            <button type="button" className={`tab ${activeTab === "connectors" ? "active" : ""}`} onClick={() => setActiveTab("connectors")}>
              🔌 Data Connectors ({items.length})
            </button>
            <button type="button" className={`tab ${activeTab === "fileimport" ? "active" : ""}`} onClick={() => setActiveTab("fileimport")}>
              📁 Datafile Ingestion (CSV / JSON)
            </button>
            <button type="button" className={`tab ${activeTab === "logs" ? "active" : ""}`} onClick={() => setActiveTab("logs")}>
              📜 Sync Execution Audit Log ({logs.length})
            </button>
            <button type="button" className={`tab ${activeTab === "discovered" ? "active" : ""}`} onClick={() => setActiveTab("discovered")}>
              ⚡ Discovered Unregistered ({discoveredData?.items?.length || 0})
            </button>
          </div>
          <Button variant="primary" onClick={() => setIsModalOpen(true)}>
            + Add Data Connector
          </Button>
        </div>
      </div>

      {/* ── Data State Container ── */}
      <DataState loading={loading} error={error} onRetry={refetch} isEmpty={items.length === 0}>

        {/* ── TAB 1: Data Connectors ── */}
        {activeTab === "connectors" && (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(340px, 1fr))", gap: 18 }}>
            {items.map((c) => {
              const isSyncing = syncingId === c.id;
              return (
                <div key={c.id} className="card" style={{ display: "flex", flexDirection: "column", justifyContent: "space-between", gap: 16 }}>
                  <div>
                    <div className="flexbtw" style={{ marginBottom: 10 }}>
                      <span className={`badge ${c.type === "REST_API" ? "success" : "warn"}`}>
                        {c.type === "REST_API" ? "⚡ REST API" : `📁 File Feed (${c.format || "CSV"})`}
                      </span>
                      <span className="badge info">{c.syncFrequency}</span>
                    </div>
                    <h3 style={{ fontSize: 15, fontWeight: 700, color: "var(--primary-dark)", marginBottom: 6, lineHeight: 1.3 }}>
                      {c.name}
                    </h3>
                    <div style={{ fontSize: 11.5, color: "var(--text2)", marginBottom: 12, fontWeight: 600 }}>
                      {c.category} · Auth: {c.authType || "Standard"}
                    </div>
                    <p style={{ fontSize: 12.5, color: "var(--text)", lineHeight: 1.5, marginBottom: 14 }}>
                      {c.description}
                    </p>

                    {c.endpoint && (
                      <div style={{ background: "#f8fafc", padding: "8px 10px", borderRadius: 8, border: "1px solid var(--border)", fontSize: 11, fontFamily: "IBM Plex Mono, monospace", color: "#334155", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", marginBottom: 14 }}>
                        {c.endpoint}
                      </div>
                    )}

                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, padding: "10px 12px", background: "#f1f5f9", borderRadius: 8, fontSize: 11.5 }}>
                      <div>
                        <span className="muted">Last Synced:</span>
                        <div style={{ fontWeight: 700, color: "var(--primary-dark)", marginTop: 2 }}>
                          {c.lastSync ? new Date(c.lastSync).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) : "Never"}
                        </div>
                      </div>
                      <div>
                        <span className="muted">Records Synced:</span>
                        <div style={{ fontWeight: 700, color: "var(--primary-dark)", marginTop: 2 }}>
                          {c.recordsSynced?.toLocaleString() || "0"}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flexbtw" style={{ borderTop: "1px solid var(--border)", paddingTop: 14 }}>
                    <button
                      type="button"
                      className="link-btn"
                      onClick={() => setSelectedConnector(selectedConnector?.id === c.id ? null : c)}
                    >
                      {selectedConnector?.id === c.id ? "Hide Schema" : "Schema Mapping ⚙"}
                    </button>
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={() => handleSync(c)}
                      disabled={isSyncing}
                    >
                      {isSyncing ? "Syncing…" : "Sync Now 🔄"}
                    </Button>
                  </div>

                  {/* Schema Mapping Drawer */}
                  {selectedConnector?.id === c.id && (
                    <div style={{ marginTop: 10, padding: 12, background: "#f8fafc", borderRadius: 8, border: "1px solid var(--border)", fontSize: 12 }}>
                      <div style={{ fontWeight: 700, color: "var(--primary-dark)", marginBottom: 8 }}>Target Field Mapping</div>
                      <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                        {Object.entries(c.schemaMapping || {}).map(([target, ext]) => (
                          <div key={target} style={{ display: "flex", justifyContent: "space-between", fontSize: 11.5 }}>
                            <span style={{ color: "var(--text2)", fontFamily: "IBM Plex Mono, monospace" }}>{target}</span>
                            <span style={{ fontWeight: 600, color: "var(--primary)" }}>← {ext}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* ── TAB 2: Datafile Ingestion (CSV/JSON) ── */}
        {activeTab === "fileimport" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            <div className="card">
              <div className="card-head">
                <div>
                  <h3 className="card-title">Datafile Ingestion &amp; Schema Matcher</h3>
                  <small className="muted">Ingest batch records from regional bureaus, customs CSV files, or JSON feeds</small>
                </div>
                <div style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}>
                  <select className="filter-select" value={fileType} onChange={(e) => setFileType(e.target.value)}>
                    <option value="csv">CSV File Format</option>
                    <option value="json">JSON Array Format</option>
                  </select>
                  <Button variant="outline" size="sm" onClick={() => { setFileContent(SAMPLE_CSV); setFileType("csv"); setPreviewResult(null); }}>
                    📄 Load Sample CSV
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => { setFileContent(SAMPLE_JSON); setFileType("json"); setPreviewResult(null); }}>
                    {`{}`} Load Sample JSON
                  </Button>
                </div>
              </div>

              <div style={{ marginBottom: 14 }}>
                <label style={{ fontSize: 12, fontWeight: 700, color: "var(--primary-dark)", display: "block", marginBottom: 6 }}>
                  File Content Payload (Paste or Upload)
                </label>
                <textarea
                  rows={6}
                  value={fileContent}
                  onChange={(e) => setFileContent(e.target.value)}
                  placeholder="Paste raw CSV header & rows or JSON payload..."
                  style={{
                    width: "100%",
                    padding: 12,
                    borderRadius: 9,
                    border: "1px solid var(--border)",
                    fontFamily: "IBM Plex Mono, monospace",
                    fontSize: 12,
                    color: "var(--text)",
                    background: "#fafcfd",
                    outline: "none",
                  }}
                />
              </div>

              <div className="flexbtw">
                <span className="muted" style={{ fontSize: 12 }}>
                  Supports CSV, JSON, GeoJSON attributes. First row must contain column headers.
                </span>
                <Button variant="primary" onClick={handlePreviewFile}>
                  Analyze Schema &amp; Preview
                </Button>
              </div>
            </div>

            {/* Ingestion Preview Table */}
            {previewResult && (
              <div className="card">
                <div className="card-head">
                  <div>
                    <h3 className="card-title">Ingestion Dry-Run &amp; Validation</h3>
                    <small className="muted">
                      Validated {previewResult.totalRecords} records across {previewResult.headers?.length} detected columns
                    </small>
                  </div>
                  <Button variant="success" onClick={handleIngestData} disabled={fileIngested}>
                    {fileIngested ? "✓ Records Ingested" : `Ingest ${previewResult.totalRecords} Records`}
                  </Button>
                </div>

                <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 16 }}>
                  {previewResult.headers?.map((h) => (
                    <span key={h} className="badge info" style={{ fontFamily: "IBM Plex Mono, monospace" }}>
                      Column: {h}
                    </span>
                  ))}
                </div>

                <DataTable
                  columns={previewResult.headers?.map((h) => ({
                    key: h,
                    header: h,
                    accessor: (row) => <span style={{ fontFamily: "IBM Plex Mono, monospace", fontSize: 12 }}>{row[h] || "—"}</span>,
                  }))}
                  data={previewResult.previewRows || []}
                  keyExtractor={(_, i) => i}
                />
              </div>
            )}
          </div>
        )}

        {/* ── TAB 3: Sync Execution Audit Log ── */}
        {activeTab === "logs" && (
          <div className="card">
            <div className="card-head">
              <div>
                <h3 className="card-title">Integration Execution Audit Trail</h3>
                <small className="muted">System telemetry of automated and manual data synchronization cycles</small>
              </div>
            </div>

            <DataTable
              columns={[
                {
                  key: "executionTime",
                  header: "Execution Time",
                  accessor: (row) => (
                    <span style={{ fontFamily: "IBM Plex Mono, monospace", fontSize: 12 }}>
                      {new Date(row.executionTime).toLocaleString()}
                    </span>
                  ),
                },
                {
                  key: "connectorName",
                  header: "Connector Name",
                  accessor: (row) => <span style={{ fontWeight: 700, color: "var(--primary-dark)" }}>{row.connectorName}</span>,
                },
                {
                  key: "status",
                  header: "Status",
                  accessor: (row) => (
                    <Badge tone={row.status === "SUCCESS" ? "success" : "error"}>
                      {row.status}
                    </Badge>
                  ),
                },
                {
                  key: "processed",
                  header: "Processed / Updated",
                  accessor: (row) => (
                    <span style={{ fontSize: 12, fontWeight: 600 }}>
                      {row.recordsProcessed} / <b style={{ color: "var(--success)" }}>+{row.recordsUpdated}</b>
                    </span>
                  ),
                },
                {
                  key: "latency",
                  header: "Latency",
                  accessor: (row) => (
                    <span style={{ fontFamily: "IBM Plex Mono, monospace", fontSize: 12, color: "var(--text2)" }}>
                      {row.latencyMs} ms
                    </span>
                  ),
                },
                {
                  key: "details",
                  header: "Details",
                  accessor: (row) => <span style={{ fontSize: 12, color: "var(--text2)" }}>{row.details}</span>,
                },
              ]}
              rows={logs}
              keyExtractor={(row) => row.id}
            />
          </div>
        )}

        {/* ── TAB 4: Discovered Unregistered Enterprises ── */}
        {activeTab === "discovered" && (
          <div className="card">
            <div className="card-head">
              <div>
                <h3 className="card-title">Discovered Unregistered External Enterprises</h3>
                <small className="muted">
                  External entities identified across ERCA, EIC FDI Gateway, and Customs trade streams that are not yet in the official Enterprise Registry
                </small>
              </div>
            </div>

            <DataTable
              columns={[
                {
                  key: "name",
                  header: "Enterprise Name",
                  accessor: (row) => (
                    <div>
                      <div style={{ fontWeight: 700, color: "var(--primary-dark)" }}>{row.name}</div>
                      <div style={{ fontSize: 11, color: "var(--text2)" }}>{row.details}</div>
                    </div>
                  ),
                },
                {
                  key: "tin",
                  header: "TIN",
                  accessor: (row) => <span style={{ fontFamily: "IBM Plex Mono, monospace", fontSize: 12 }}>{row.tin}</span>,
                },
                {
                  key: "source",
                  header: "Integration Source",
                  accessor: (row) => <Badge tone="info">{row.source}</Badge>,
                },
                {
                  key: "sector",
                  header: "Sector / Region",
                  accessor: (row) => <span style={{ fontSize: 12 }}>{row.sector} · {row.region}</span>,
                },
                {
                  key: "action",
                  header: "Auto-Provision",
                  accessor: (row) => (
                    <Button
                      variant="success"
                      size="sm"
                      onClick={() => handleAutoRegister(row)}
                      disabled={registeringId === row.id}
                    >
                      {registeringId === row.id ? "Registering…" : "⚡ Auto-Register to Registry"}
                    </Button>
                  ),
                },
              ]}
              rows={discoveredData?.items || []}
              keyExtractor={(row) => row.id}
            />
          </div>
        )}

      </DataState>

      {/* ── Add Connector Modal ── */}
      {isModalOpen && (
        <div className="overlay" style={{ alignItems: "center", justifyContent: "center", padding: 20 }}>
          <div className="card" style={{ width: "100%", maxWidth: 540, boxShadow: "var(--shadow-lg)" }}>
            <div className="flexbtw" style={{ marginBottom: 16 }}>
              <h3 style={{ fontSize: 16, fontWeight: 800, color: "var(--primary-dark)" }}>Register New External Data Connector</h3>
              <button type="button" onClick={() => setIsModalOpen(false)} style={{ background: "none", border: "none", fontSize: 18, cursor: "pointer", color: "var(--text2)" }}>✕</button>
            </div>
            <form onSubmit={handleCreateConnector} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              <div>
                <label style={{ fontSize: 12, fontWeight: 700, color: "var(--primary-dark)", display: "block", marginBottom: 4 }}>
                  Connector Name
                </label>
                <input
                  type="text"
                  className="filter-input"
                  style={{ width: "100%" }}
                  placeholder="e.g. ERCA Customs Automated Export Stream"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  required
                />
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                <div>
                  <label style={{ fontSize: 12, fontWeight: 700, color: "var(--primary-dark)", display: "block", marginBottom: 4 }}>
                    Connector Type
                  </label>
                  <select
                    className="filter-select"
                    style={{ width: "100%" }}
                    value={form.type}
                    onChange={(e) => setForm({ ...form, type: e.target.value })}
                  >
                    <option value="REST_API">REST API Endpoint</option>
                    <option value="FILE_FEED">Batch Datafile Feed (CSV/JSON)</option>
                    <option value="WEBHOOK">Custom Webhook Listener</option>
                  </select>
                </div>

                <div>
                  <label style={{ fontSize: 12, fontWeight: 700, color: "var(--primary-dark)", display: "block", marginBottom: 4 }}>
                    Category
                  </label>
                  <select
                    className="filter-select"
                    style={{ width: "100%" }}
                    value={form.category}
                    onChange={(e) => setForm({ ...form, category: e.target.value })}
                  >
                    <option value="Government Agency">Government Agency</option>
                    <option value="Customs & Trade">Customs &amp; Trade</option>
                    <option value="Utility & Grid">Utility &amp; Energy Grid</option>
                    <option value="Telecom & Fiber">Telecom &amp; Fiber</option>
                    <option value="Regional Bureau">Regional Industrial Bureau</option>
                  </select>
                </div>
              </div>

              <div>
                <label style={{ fontSize: 12, fontWeight: 700, color: "var(--primary-dark)", display: "block", marginBottom: 4 }}>
                  Endpoint URL / Data Source Address
                </label>
                <input
                  type="text"
                  className="filter-input"
                  style={{ width: "100%", fontFamily: "IBM Plex Mono, monospace" }}
                  placeholder="https://api.agency.gov.et/v1/resource"
                  value={form.endpoint}
                  onChange={(e) => setForm({ ...form, endpoint: e.target.value })}
                />
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                <div>
                  <label style={{ fontSize: 12, fontWeight: 700, color: "var(--primary-dark)", display: "block", marginBottom: 4 }}>
                    Sync Frequency
                  </label>
                  <select
                    className="filter-select"
                    style={{ width: "100%" }}
                    value={form.syncFrequency}
                    onChange={(e) => setForm({ ...form, syncFrequency: e.target.value })}
                  >
                    <option value="Real-time / 15m">Real-time (15 min)</option>
                    <option value="Hourly">Hourly</option>
                    <option value="Daily">Daily</option>
                    <option value="Weekly">Weekly</option>
                    <option value="Monthly Batch">Monthly Batch</option>
                    <option value="Manual">Manual Trigger</option>
                  </select>
                </div>

                <div>
                  <label style={{ fontSize: 12, fontWeight: 700, color: "var(--primary-dark)", display: "block", marginBottom: 4 }}>
                    Authentication Type
                  </label>
                  <select
                    className="filter-select"
                    style={{ width: "100%" }}
                    value={form.authType}
                    onChange={(e) => setForm({ ...form, authType: e.target.value })}
                  >
                    <option value="Bearer Token">Bearer Token</option>
                    <option value="API Key">API Key</option>
                    <option value="OAuth 2.0">OAuth 2.0</option>
                    <option value="Basic Auth">Basic Auth</option>
                    <option value="None">None (Public)</option>
                  </select>
                </div>
              </div>

              <div>
                <label style={{ fontSize: 12, fontWeight: 700, color: "var(--primary-dark)", display: "block", marginBottom: 4 }}>
                  Description
                </label>
                <textarea
                  rows={3}
                  className="filter-input"
                  style={{ width: "100%" }}
                  placeholder="Briefly describe what dataset this connector ingests..."
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                />
              </div>

              <div className="flexbtw" style={{ marginTop: 10 }}>
                <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" variant="primary">
                  Register Connector
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
