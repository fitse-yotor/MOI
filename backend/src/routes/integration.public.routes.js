/**
 * Public Integration Demo Routes — No authentication required.
 * These serve mock API responses and sample datafile downloads
 * so the integration layer can be demonstrated without a login session.
 */
import { Router } from "express";
import { autoRegisterFromIntegration, triggerConnectorSync, triggerConnectorSyncAsync, listConnectors, DEMO_SEED_SOURCE, addSampleToDemoSeedSource, ingestEnterprisesFromPayload } from "../data/connectors.js";

const router = Router();

// ── Mock ERCA Taxpayer REST API ──────────────────────────────────
router.get("/mock/erca-taxpayers", (req, res) => {
  res.json({
    system: "Ethiopian Revenues & Customs Authority Taxpayer Verification System",
    timestamp: new Date().toISOString(),
    count: 5,
    data: [
      { taxpayer_tin: "0091234567", registered_name: "Bole Lemi Garments PLC",    compliance_status: "COMPLIANT",     filing_period_year: 2025, revenue_range_etb: "500M - 1B"   },
      { taxpayer_tin: "0098765432", registered_name: "Awash Wine S.C.",            compliance_status: "COMPLIANT",     filing_period_year: 2025, revenue_range_etb: "250M - 500M" },
      { taxpayer_tin: "0054321098", registered_name: "Dire Dawa Textiles PLC",     compliance_status: "COMPLIANT",     filing_period_year: 2025, revenue_range_etb: "100M - 250M" },
      { taxpayer_tin: "0011223344", registered_name: "Mojo Leather Tannery",       compliance_status: "COMPLIANT",     filing_period_year: 2025, revenue_range_etb: "50M - 100M"  },
      { taxpayer_tin: "0077889900", registered_name: "Ethiopia Steel Works PLC",   compliance_status: "PENDING_AUDIT", filing_period_year: 2024, revenue_range_etb: "500M - 1B"   },
    ],
  });
});

// ── Mock EIC Foreign Direct Investment REST API ──────────────────
router.get("/mock/eic-fdi", (req, res) => {
  res.json({
    portal: "Ethiopian Investment Commission FDI Gateway",
    timestamp: new Date().toISOString(),
    count: 4,
    data: [
      { investment_id: "FDI-2026-089", company_name: "Sino-Ethio Textile Investment Ltd", home_country: "China",       approved_capital_usd: 45000000, industrial_zone_slug: "oromia-hawassa",   sector: "Textile & Apparel",       status: "APPROVED"          },
      { investment_id: "FDI-2026-092", company_name: "Anadolu Chemical Industries",        home_country: "Turkey",      approved_capital_usd: 28000000, industrial_zone_slug: "dire-dawa",        sector: "Chemicals & Plastics",    status: "UNDER_CONSTRUCTION"},
      { investment_id: "FDI-2026-104", company_name: "Prism Agro-Processing BV",           home_country: "Netherlands", approved_capital_usd: 18500000, industrial_zone_slug: "amhara-kombolcha", sector: "Food & Beverage",         status: "OPERATIONAL"       },
      { investment_id: "FDI-2026-115", company_name: "GreenPower Battery Tech",             home_country: "South Korea", approved_capital_usd: 62000000, industrial_zone_slug: "kilinto-pharma",  sector: "Electronics & Metals",    status: "LICENSED"          },
    ],
  });
});

// ── Sample Customs Export CSV ────────────────────────────────────
router.get("/sample-files/customs-export.csv", (req, res) => {
  const csv = `exporter_tin,registered_name,tariff_hs_code,fob_value_usd,destination_iso,export_date,status
0091234567,Bole Lemi Garments PLC,6203.42,450000,USA,2026-08-01,CLEARED
0098765432,Awash Wine S.C.,2204.21,120000,KEN,2026-08-02,CLEARED
0054321098,Dire Dawa Textiles PLC,5208.11,850000,CHN,2026-08-03,CLEARED
0011223344,Mojo Leather Tannery,4104.11,320000,ITA,2026-08-04,CLEARED
0077889900,Ethiopia Steel Works PLC,7214.20,980000,DJI,2026-08-05,CLEARED
0033445566,Amhara Metal Manufacturing,7308.90,210000,SDN,2026-08-06,CLEARED
0044556677,Hawassa Industrial Park Co.,5407.61,670000,DEU,2026-08-07,CLEARED
0055667788,Adama Agro-Processing PLC,0901.11,95000,ARE,2026-08-08,CLEARED`;

  res.setHeader("Content-Type", "text/csv");
  res.setHeader("Content-Disposition", "attachment; filename=customs-export-sample.csv");
  res.send(csv);
});

// ── Sample Telecom Fiber JSON ────────────────────────────────────
router.get("/sample-files/telecom-fiber.json", (req, res) => {
  res.json([
    { point_id: "FIBER-HL-01", park_name: "Hawassa Industrial Park",    available_bandwidth_gbps: 100, fiber_ring_type: "Dual Redundant Fiber Ring", status: "ACTIVE",      active_factories_connected: 38 },
    { point_id: "FIBER-BL-02", park_name: "Bole Lemi Industrial Park",  available_bandwidth_gbps: 100, fiber_ring_type: "Dual Redundant Fiber Ring", status: "ACTIVE",      active_factories_connected: 42 },
    { point_id: "FIBER-DD-03", park_name: "Dire Dawa Free Trade Zone",  available_bandwidth_gbps: 50,  fiber_ring_type: "Single Core Fiber Ring",     status: "ACTIVE",      active_factories_connected: 19 },
    { point_id: "FIBER-KM-04", park_name: "Kombolcha Industrial Park",  available_bandwidth_gbps: 40,  fiber_ring_type: "Single Core Fiber Ring",     status: "MAINTENANCE", active_factories_connected: 14 },
    { point_id: "FIBER-AW-05", park_name: "Adama Industrial Park",      available_bandwidth_gbps: 60,  fiber_ring_type: "Dual Redundant Fiber Ring",  status: "ACTIVE",      active_factories_connected: 27 },
  ]);
});

// ── Sample Public Enterprise Integration API Endpoint ────────────
// POST /api/integrations/sample-integrate-enterprise
// Call this endpoint from browser, curl, or Postman to push a new enterprise into the registry!
router.post("/sample-integrate-enterprise", (req, res) => {
  const body = req.body || {};
  const name = body.name || "Awash Solar Manufacturing S.C.";
  const tin = body.tin || "0099887766";
  const sector = body.sector || "Electronics & Metals";
  const region = body.region || "Oromia";

  const created = autoRegisterFromIntegration({
    name,
    tin,
    sector,
    region,
    ownership: body.ownership || "Public-Private Partnership",
    industrialPark: body.industrialPark || "Adama Industrial Park",
    source: body.source || "Public Integration API Endpoint",
  });

  res.status(201).json({
    message: `Success! Enterprise '${created.name}' (TIN: ${created.tin}) has been integrated into the National Enterprise Registry.`,
    item: created,
    instructions: "Refresh or open http://localhost:5173/enterprises to see the newly integrated enterprise listed!",
  });
});

// ── Public Trigger All Syncs Endpoint ────────────────────────────
// POST /api/integrations/trigger-demo-sync
// Triggers sync across all connectors at once and auto-provisions all unregistered sample enterprises!
router.post("/trigger-demo-sync", (req, res) => {
  const connectors = listConnectors();
  let totalAdded = 0;
  const results = connectors.map((c) => {
    const res = triggerConnectorSync(c.id);
    totalAdded += res?.newEnterprisesAdded || 0;
    return res;
  });

  res.json({
    message: `Demo sync complete across ${connectors.length} connectors! Auto-integrated ${totalAdded} enterprise(s) into Enterprise Registry.`,
    totalAdded,
    results,
  });
});

// ── GET Demo Endpoint: View Sample External Integration Dataset ──
// GET /api/integrations/demo-sample-enterprises
// Open in browser to view pre-packaged sample external enterprises from ERCA, EIC, and Customs!
router.get("/demo-sample-enterprises", (req, res) => {
  res.json({
    system: "National Industry Data Integration Gateway",
    description: "Sample external datasets ready to be integrated into the National Enterprise Registry",
    count: 4,
    samples: [
      { name: "Awash Solar Manufacturing S.C.", tin: "0099887766", sector: "Electronics & Metals", region: "Oromia", industrialPark: "Adama Industrial Park", ownership: "Public-Private Partnership", source: "EEU & ERCA Integration API", taxCompliance: "COMPLIANT", revenueRange: "500M - 1B ETB" },
      { name: "Rift Valley Agro-Beverage S.C.", tin: "0088776655", sector: "Food & Beverage", region: "Sidama", industrialPark: "Hawassa Industrial Park", ownership: "Domestic private", source: "Customs Export CSV Feed", exportFobUsd: 1250000, exportDestination: "KEN" },
      { name: "Dire Dawa Heavy Steel PLC", tin: "0077665544", sector: "Metal & Engineering", region: "Dire Dawa", industrialPark: "Dire Dawa Industrial Park", ownership: "Foreign (Turkey)", source: "EIC FDI Gateway", fdiApprovedCapitalUsd: 28000000, status: "Under Construction" },
    ],
  });
});

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// External Enterprise Data Feed — Standalone Data Server
// This endpoint behaves like a completely external/third-party
// API server. It ONLY serves raw enterprise data.
// NO integration or registry writing happens here.
// Integration happens when a connector configured with this
// URL is synced from the Data Integrations page.
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

// GET /api/integrations/demo-seed-enterprise-registry
// Returns the raw enterprise dataset — just like http://localhost:8999/payload.json would.
router.get("/demo-seed-enterprise-registry", (req, res) => {
  res.json({
    enterprises: DEMO_SEED_SOURCE,
  });
});

// POST /api/integrations/demo-seed-enterprise-registry
// Add a new enterprise record to this external data feed.
// It won't appear in the Enterprise Registry until a connector syncs.
router.post("/demo-seed-enterprise-registry", (req, res) => {
  const body = req.body || {};
  if (!body.name) {
    return res.status(400).json({ error: "name is required" });
  }
  const added = addSampleToDemoSeedSource(body);
  res.status(201).json({
    added,
    totalRecords: DEMO_SEED_SOURCE.length,
    note: "Record added to external feed. To sync into Enterprise Registry, trigger connector sync separately.",
  });
});

// GET /api/integrations/public-sync/:id
// Trigger live sync for any connector by ID, fetching from its configured endpoint.
router.get("/public-sync/:id", async (req, res) => {
  const connId = req.params.id || "conn-6";
  try {
    const syncRes = await triggerConnectorSyncAsync(connId);
    if (!syncRes) return res.status(404).json({ error: `Connector '${connId}' not found` });
    res.json({
      status: syncRes.log.status,
      connectorName: syncRes.connector.name,
      endpoint: syncRes.connector.endpoint,
      message: syncRes.log.details,
      newEnterprisesAdded: syncRes.newEnterprisesAdded,
      viewRegistryUrl: "http://localhost:5173/enterprises",
      log: syncRes.log,
    });
  } catch (err) {
    res.status(500).json({ error: "Sync failed", details: err.message });
  }
});

export default router;
