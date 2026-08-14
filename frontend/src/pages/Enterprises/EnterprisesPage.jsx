import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useApiGet, useApiAction, buildQuery } from "../../api/hooks.js";
import FilterBar from "../../components/common/FilterBar.jsx";
import DataTable from "../../components/common/DataTable.jsx";
import Badge from "../../components/common/Badge.jsx";
import Button from "../../components/common/Button.jsx";
import { Card, CardHead } from "../../components/common/Card.jsx";
import { DataState } from "../../components/common/StateViews.jsx";
import ConfirmDialog from "../../components/common/ConfirmDialog.jsx";
import { useAuth } from "../../context/AuthContext.jsx";
import { useSnackbar } from "../../context/SnackbarContext.jsx";

export default function EnterprisesPage() {
  const { can } = useAuth();
  const navigate = useNavigate();
  const { notify } = useSnackbar();
  const [filters, setFilters] = useState({ q: "", region: "all", sector: "all", size: "all", status: "all" });
  const [deleting, setDeleting] = useState(null);
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [registeringId, setRegisteringId] = useState(null);

  const query = buildQuery(filters);
  const { data, loading, error, refetch } = useApiGet(`/enterprises${query}`, { deps: [query] });
  const { data: discoveredData, refetch: refetchDiscovered } = useApiGet("/integrations/discovered-enterprises");
  const del = useApiAction("del");
  const { run: autoRegister } = useApiAction("post");

  const masterData = data?.filters || { regions: [], sectors: [], sizes: [], statuses: [] };

  async function handleDelete() {
    await del.run(`/enterprises/${deleting.id}`);
    notify(`${deleting.name} removed from the registry`, "success");
    setDeleting(null);
    refetch();
  }

  async function handleAutoRegister(item) {
    setRegisteringId(item.id);
    try {
      const res = await autoRegister("/integrations/auto-register", item.rawPayload || item);
      notify(`Auto-registered '${item.name}' into official Enterprise Registry!`, "success");
      refetch();
      refetchDiscovered();
    } catch (err) {
      notify(err.message || "Failed to auto-register enterprise", "error");
    } finally {
      setRegisteringId(null);
    }
  }

  const columns = [
    {
      key: "name",
      label: "Enterprise",
      render: (row) => (
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div className="avatar-sm">{row.name.split(" ").map((w) => w[0]).slice(0, 2).join("")}</div>
          <div>
            <div className="tag-name">{row.name}</div>
            <div className="tag-sub">{row.region}</div>
          </div>
        </div>
      ),
    },
    { key: "tin", label: "TIN", render: (r) => <span className="mono">{r.tin}</span> },
    { key: "sector", label: "Sector" },
    { key: "region", label: "Region" },
    { key: "size", label: "Size" },
    { key: "employees", label: "Employees", render: (r) => <span className="mono">{r.employees}</span> },
    { key: "status", label: "Status", render: (r) => <Badge tone={r.status.startsWith("Integrated") ? "success" : r.status.includes("Integration") ? "info" : "default"}>{r.status}</Badge> },
    {
      key: "actions",
      label: "",
      render: (r) => (
        <div style={{ display: "flex", gap: 6 }}>
          <Button variant="outline" size="sm" onClick={(e) => { e.stopPropagation(); navigate(`/enterprises/${r.id}`); }}>View</Button>
          {can("enterprises", "view") && r.slug && (
            <Button variant="outline" size="sm" onClick={(e) => { e.stopPropagation(); navigate(`/site/${r.slug}`); }}>Website</Button>
          )}
          {can("enterprises", "edit") && (
            <Button variant="outline" size="sm" onClick={(e) => { e.stopPropagation(); navigate(`/enterprises/${r.id}/edit`); }}>Edit</Button>
          )}
          {can("enterprises", "delete") && (
            <Button variant="error" size="sm" onClick={(e) => { e.stopPropagation(); setDeleting(r); }}>Delete</Button>
          )}
        </div>
      ),
    },
  ];

  return (
    <>
      <FilterBar
        filters={[
          { type: "search", key: "q", placeholder: "Search name, TIN, license no." },
          { type: "select", key: "region", label: "regions", options: masterData.regions },
          { type: "select", key: "sector", label: "sectors", options: masterData.sectors },
          { type: "select", key: "size", label: "sizes", options: masterData.sizes },
          { type: "select", key: "status", label: "status", allLabel: "Any status", options: masterData.statuses },
        ]}
        values={filters}
        onChange={(key, value) => setFilters((f) => ({ ...f, [key]: value }))}
        actions={
          <>
            <Button variant="outline" size="sm" onClick={() => setIsImportModalOpen(true)}>
              ⚡ Import from Integration ({discoveredData?.items?.length || 0})
            </Button>
            <Button variant="outline" size="sm">Export list</Button>
            {can("enterprises", "create") && <Button size="sm" onClick={() => navigate("/enterprises/new")}>Register enterprise</Button>}
          </>
        }
      />
      <Card noPadding>
        <div style={{ padding: "16px 18px 0" }}>
          <CardHead title="Enterprise Registry" subtitle={`${data?.total?.toLocaleString() || "…"} records · showing ${data?.count ?? 0}`} />
        </div>
        <DataState loading={loading} error={error} onRetry={refetch} isEmpty={data && data.items.length === 0}>
          {data && <DataTable columns={columns} rows={data.items} onRowClick={(r) => navigate(`/enterprises/${r.id}`)} />}
        </DataState>
      </Card>

      {/* ── Modal: Import / Provision Enterprise from Integration Feed ── */}
      {isImportModalOpen && (
        <div className="overlay" style={{ alignItems: "center", justifyContent: "center", padding: 20 }}>
          <div className="card" style={{ width: "100%", maxWidth: 680, boxShadow: "var(--shadow-lg)" }}>
            <div className="flexbtw" style={{ marginBottom: 16 }}>
              <div>
                <h3 style={{ fontSize: 16, fontWeight: 800, color: "var(--primary-dark)", margin: 0 }}>
                  ⚡ Auto-Register Unregistered Enterprises from Integration Feeds
                </h3>
                <small style={{ color: "var(--text2)" }}>
                  Discovered from ERCA Tax API, EIC FDI Gateway, and Customs Export Feeds. Click 1-click Auto-Register to integrate into Registry without manual form entry.
                </small>
              </div>
              <button type="button" onClick={() => setIsImportModalOpen(false)} style={{ background: "none", border: "none", fontSize: 18, cursor: "pointer", color: "var(--text2)" }}>✕</button>
            </div>

            {discoveredData?.items?.length === 0 ? (
              <div style={{ padding: 20, textAlign: "center", color: "var(--text2)" }}>
                ✓ All discovered external enterprises have already been registered!
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: 10, maxHeight: 380, overflowY: "auto" }}>
                {(discoveredData?.items || []).map((item) => (
                  <div key={item.id} style={{ padding: "12px 16px", background: "#f8fafc", borderRadius: 8, border: "1px solid var(--border)", display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12 }}>
                    <div>
                      <div style={{ fontWeight: 700, fontSize: 14, color: "var(--primary-dark)" }}>{item.name}</div>
                      <div style={{ fontSize: 12, color: "var(--text2)" }}>
                        TIN: <span style={{ fontFamily: "IBM Plex Mono, monospace" }}>{item.tin}</span> · {item.sector} ({item.region})
                      </div>
                      <div style={{ fontSize: 11, color: "var(--primary)", marginTop: 2 }}>{item.details}</div>
                    </div>
                    <Button
                      variant="success"
                      size="sm"
                      onClick={() => handleAutoRegister(item)}
                      disabled={registeringId === item.id}
                    >
                      {registeringId === item.id ? "Registering…" : "⚡ Auto-Register"}
                    </Button>
                  </div>
                ))}
              </div>
            )}

            <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 16 }}>
              <Button variant="outline" onClick={() => setIsImportModalOpen(false)}>Done</Button>
            </div>
          </div>
        </div>
      )}

      <ConfirmDialog
        open={!!deleting}
        title={deleting ? `Remove ${deleting.name}?` : ""}
        message="This permanently removes the enterprise from the registry. This cannot be undone."
        onConfirm={handleDelete}
        onCancel={() => setDeleting(null)}
      />
    </>
  );
}

