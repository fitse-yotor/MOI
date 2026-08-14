import { Router } from "express";
import {
  listConnectors,
  getConnector,
  createConnector,
  updateConnector,
  triggerConnectorSync,
  triggerConnectorSyncAsync,
  ingestEnterprisesFromPayload,
  parseAndPreviewFileData,
  ingestFileDataToRegistry,
  listSyncLogs,
  refreshEnrichmentCaches,
  getEnterpriseEnrichment,
  getFdiOpportunities,
  getParkConnectivity,
  listDiscoveredUnregisteredEnterprises,
  autoRegisterFromIntegration,
} from "../data/connectors.js";

const router = Router();

// GET /api/integrations — List all active connectors and summary metrics
router.get("/", (req, res) => {
  const items = listConnectors();
  const logs = listSyncLogs();

  const totalIntegrations = items.length;
  const connectedApis = items.filter((c) => c.type === "REST_API").length;
  const activeFileFeeds = items.filter((c) => c.type === "FILE_FEED").length;
  const totalRecordsSynced = items.reduce((sum, c) => sum + (c.recordsSynced || 0), 0);

  res.json({
    summary: {
      totalIntegrations,
      connectedApis,
      activeFileFeeds,
      totalRecordsSynced,
    },
    items,
  });
});

// GET /api/integrations/logs — List sync logs
router.get("/logs", (req, res) => {
  const logs = listSyncLogs();
  res.json({ items: logs });
});

// GET /api/integrations/:id — Get single connector
router.get("/:id", (req, res) => {
  const conn = getConnector(req.params.id);
  if (!conn) return res.status(404).json({ error: "Connector not found" });
  res.json({ item: conn });
});

// POST /api/integrations — Register a new connector
router.post("/", (req, res) => {
  const { name, type, endpoint, category, syncFrequency, schemaMapping, description, authType, format } = req.body;
  if (!name) {
    return res.status(400).json({ error: "Connector name is required" });
  }

  const created = createConnector({
    name,
    type,
    endpoint,
    category,
    syncFrequency,
    schemaMapping,
    description,
    authType,
    format,
  });

  res.status(201).json({ message: "Integration connector created successfully", item: created });
});

// PUT /api/integrations/:id — Update connector configuration
router.put("/:id", (req, res) => {
  const updated = updateConnector(req.params.id, req.body);
  if (!updated) return res.status(404).json({ error: "Connector not found" });
  res.json({ message: "Connector updated successfully", item: updated });
});

// POST /api/integrations/:id/sync — Execute manual sync trigger
// Uses async version so it actually fetches from the connector's live endpoint URL.
router.post("/:id/sync", async (req, res) => {
  try {
    const result = await triggerConnectorSyncAsync(req.params.id);
    if (!result) return res.status(404).json({ error: "Connector not found" });
    // Auto-refresh enrichment caches on every sync (no duplicates — Map deduplicates by key)
    refreshEnrichmentCaches();
    res.json({
      message: `Sync execution completed for ${result.connector.name}`,
      connector: result.connector,
      log: result.log,
      newEnterprisesAdded: result.newEnterprisesAdded,
    });
  } catch (err) {
    res.status(500).json({ error: "Sync failed", details: err.message });
  }
});

// POST /api/integrations/ingest-payload — Push a raw JSON payload directly into Enterprise Registry
// Send { endpoint: "http://...", payload: [...] } or just { payload: [...] } to skip the fetch
router.post("/ingest-payload", async (req, res) => {
  const { endpoint, payload, sourceName } = req.body || {};
  let data = payload;
  let source = sourceName || endpoint || "Direct Payload";

  if (!data && endpoint) {
    try {
      const resp = await fetch(endpoint);
      if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
      data = await resp.json();
    } catch (err) {
      return res.status(502).json({ error: `Failed to fetch from ${endpoint}: ${err.message}` });
    }
  }

  if (!data) return res.status(400).json({ error: "Provide either 'payload' array or 'endpoint' URL" });

  const added = ingestEnterprisesFromPayload(data, source);
  refreshEnrichmentCaches();
  res.json({
    message: `Payload ingested. ${added} new enterprise(s) added to Enterprise Registry (duplicates skipped).`,
    newEnterprisesAdded: added,
  });
});

// POST /api/integrations/preview-file — Ingest and preview uploaded datafile (CSV / JSON)
router.post("/preview-file", (req, res) => {
  const { fileContent, fileType } = req.body;
  if (!fileContent) {
    return res.status(400).json({ error: "File content payload is required" });
  }

  const preview = parseAndPreviewFileData(fileContent, fileType || "csv");
  if (preview.error) {
    return res.status(400).json({ error: preview.error });
  }

  res.json({
    message: "File payload parsed and validated successfully",
    headers: preview.headers,
    previewRows: preview.rows,
    totalRecords: preview.totalCount,
  });
});

// POST /api/integrations/ingest-file — Ingest datafile records directly into Enterprise Registry
router.post("/ingest-file", (req, res) => {
  const { fileContent, fileType } = req.body;
  if (!fileContent) {
    return res.status(400).json({ error: "File content payload is required" });
  }

  const result = ingestFileDataToRegistry(fileContent, fileType || "csv");
  res.json({
    message: `Successfully ingested file dataset! Auto-integrated ${result.count} new enterprise(s) into Enterprise Registry.`,
    count: result.count,
    items: result.items,
  });
});

/* ─────────────────────────────────────────────────────────────────
   ENRICHED DATA ENDPOINTS
   Cross-module linkage: integration data joined to registry, B2B, and GIS.
───────────────────────────────────────────────────────────────── */

// GET /api/integrations/enriched/enterprise/:tin
// Returns ERCA tax compliance + Customs trade record for a given TIN.
router.get("/enriched/enterprise/:tin", (req, res) => {
  const result = getEnterpriseEnrichment(req.params.tin);
  if (!result) return res.status(404).json({ error: "No external data found for this TIN" });
  res.json(result);
});

// GET /api/integrations/enriched/fdi-opportunities
// Returns EIC FDI records shaped as B2B linkage opportunity cards.
router.get("/enriched/fdi-opportunities", (req, res) => {
  res.json({ items: getFdiOpportunities() });
});

// GET /api/integrations/enriched/park-connectivity
// Returns telecom fiber + FDI data keyed by park name for GIS map popup enrichment.
router.get("/enriched/park-connectivity", (req, res) => {
  res.json(getParkConnectivity());
});

// GET /api/integrations/discovered-enterprises
// Discovers unregistered external enterprises from live integration feeds (ERCA, EIC, Customs).
router.get("/discovered-enterprises", (req, res) => {
  const discovered = listDiscoveredUnregisteredEnterprises();
  res.json({ count: discovered.length, items: discovered });
});

// POST /api/integrations/auto-register
// 1-Click auto-provisions an unregistered external enterprise into the official Enterprise Registry.
router.post("/auto-register", (req, res) => {
  const payload = req.body || {};
  const resObj = autoRegisterFromIntegration(payload);
  if (resObj.duplicate) {
    return res.status(200).json({
      duplicate: true,
      message: resObj.message,
      item: resObj.item,
    });
  }
  res.status(201).json({
    duplicate: false,
    message: `Enterprise '${resObj.item.name}' auto-registered successfully into National Registry from ${payload.source || "Integration Feed"}`,
    item: resObj.item,
  });
});


/* ─────────────────────────────────────────────────────────────────
   DEMO MOCK API ENDPOINTS & SAMPLE FILE FEEDS
───────────────────────────────────────────────────────────────── */

// Mock ERCA Taxpayer REST API
router.get("/mock/erca-taxpayers", (req, res) => {
  res.json({
    system: "Ethiopian Revenues & Customs Authority Taxpayer Verification System",
    timestamp: new Date().toISOString(),
    count: 5,
    data: [
      { taxpayer_tin: "0091234567", registered_name: "Bole Lemi Garments PLC", compliance_status: "COMPLIANT", filing_period_year: 2025, revenue_range_etb: "500M - 1B" },
      { taxpayer_tin: "0098765432", registered_name: "Awash Wine S.C.", compliance_status: "COMPLIANT", filing_period_year: 2025, revenue_range_etb: "250M - 500M" },
      { taxpayer_tin: "0054321098", registered_name: "Dire Dawa Textiles PLC", compliance_status: "COMPLIANT", filing_period_year: 2025, revenue_range_etb: "100M - 250M" },
      { taxpayer_tin: "0011223344", registered_name: "Mojo Leather Tannery", compliance_status: "COMPLIANT", filing_period_year: 2025, revenue_range_etb: "50M - 100M" },
      { taxpayer_tin: "0077889900", registered_name: "Ethiopia Steel Works PLC", compliance_status: "PENDING_AUDIT", filing_period_year: 2024, revenue_range_etb: "500M - 1B" },
    ],
  });
});

// Mock EIC Foreign Investment REST API
router.get("/mock/eic-fdi", (req, res) => {
  res.json({
    portal: "Ethiopian Investment Commission FDI Gateway",
    timestamp: new Date().toISOString(),
    count: 4,
    data: [
      { investment_id: "FDI-2026-089", company_name: "Sino-Ethio Textile Investment Ltd", home_country: "China", approved_capital_usd: 45000000, industrial_zone_slug: "oromia-hawassa", sector: "Textile & Apparel", status: "APPROVED" },
      { investment_id: "FDI-2026-092", company_name: "Anadolu Chemical Industries", home_country: "Turkey", approved_capital_usd: 28000000, industrial_zone_slug: "dire-dawa", sector: "Chemicals & Plastics", status: "UNDER_CONSTRUCTION" },
      { investment_id: "FDI-2026-104", company_name: "Prism Agro-Processing BV", home_country: "Netherlands", approved_capital_usd: 18500000, industrial_zone_slug: "amhara-kombolcha", sector: "Food & Beverage", status: "OPERATIONAL" },
      { investment_id: "FDI-2026-115", company_name: "GreenPower Battery Tech", home_country: "South Korea", approved_capital_usd: 62000000, industrial_zone_slug: "kilinto-pharma", sector: "Electronics & Metals", status: "LICENSED" },
    ],
  });
});

// Sample Customs Export CSV File Endpoint
router.get("/sample-files/customs-export.csv", (req, res) => {
  const csvContent = `exporter_tin,registered_name,tariff_hs_code,fob_value_usd,destination_iso,export_date,status
0091234567,Bole Lemi Garments PLC,6203.42,450000,USA,2026-08-01,CLEARED
0098765432,Awash Wine S.C.,2204.21,120000,KEN,2026-08-02,CLEARED
0054321098,Dire Dawa Textiles PLC,5208.11,850000,CHN,2026-08-03,CLEARED
0011223344,Mojo Leather Tannery,4104.11,320000,ITA,2026-08-04,CLEARED
0077889900,Ethiopia Steel Works PLC,7214.20,980000,DJI,2026-08-05,CLEARED
0033445566,Amhara Metal Manufacturing,7308.90,210000,SDN,2026-08-06,CLEARED`;

  res.setHeader("Content-Type", "text/csv");
  res.setHeader("Content-Disposition", "attachment; filename=customs-export-sample.csv");
  res.send(csvContent);
});

// Sample Telecom Fiber JSON File Endpoint
router.get("/sample-files/telecom-fiber.json", (req, res) => {
  const jsonContent = [
    { point_id: "FIBER-HL-01", park_name: "Hawassa Industrial Park", available_bandwidth_gbps: 100, fiber_ring_type: "Dual Redundant Fiber Ring", status: "ACTIVE", active_factories_connected: 38 },
    { point_id: "FIBER-BL-02", park_name: "Bole Lemi Industrial Park", available_bandwidth_gbps: 100, fiber_ring_type: "Dual Redundant Fiber Ring", status: "ACTIVE", active_factories_connected: 42 },
    { point_id: "FIBER-DD-03", park_name: "Dire Dawa Free Trade Zone", available_bandwidth_gbps: 50, fiber_ring_type: "Single Core Fiber Ring", status: "ACTIVE", active_factories_connected: 19 },
    { point_id: "FIBER-KM-04", park_name: "Kombolcha Industrial Park", available_bandwidth_gbps: 40, fiber_ring_type: "Single Core Fiber Ring", status: "MAINTENANCE", active_factories_connected: 14 },
  ];

  res.json(jsonContent);
});

export default router;
