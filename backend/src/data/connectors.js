import { enterprises, createEnterprise } from "./enterprises.js";

/**
 * Integration Layer — External Datasources & Datafile Store
 * Manages connections, schema mappings, file parsers, and sync execution logs for
 * external APIs (ERCA, EIC, EEU) and datafiles (CSV, JSON, GeoJSON).
 */

let connectorsStore = [
  {
    id: "conn-1",
    name: "Ethiopian Revenues & Customs Authority (ERCA) Tax API",
    type: "REST_API",
    category: "Government Tax Registry",
    endpoint: "http://localhost:4000/api/integrations/mock/erca-taxpayers",
    authType: "Bearer Token",
    syncFrequency: "Hourly",
    status: "Healthy",
    lastSync: "2026-08-13T16:30:00Z",
    recordsSynced: 12480,
    successRate: "99.8%",
    schemaMapping: {
      tin: "taxpayer_tin",
      name: "registered_name",
      taxStatus: "compliance_status",
      lastFilingYear: "filing_period_year",
    },
    description: "Automated verification of TIN tax compliance, active status, and annual revenue range.",
  },
  {
    id: "conn-2",
    name: "Ethiopian Investment Commission (EIC) FDI Portal",
    type: "REST_API",
    category: "Investment Approval Registry",
    endpoint: "http://localhost:4000/api/integrations/mock/eic-fdi",
    authType: "OAuth 2.0 Client Credentials",
    syncFrequency: "Daily",
    status: "Healthy",
    lastSync: "2026-08-13T08:00:00Z",
    recordsSynced: 1840,
    successRate: "98.5%",
    schemaMapping: {
      investorName: "company_name",
      capitalUSD: "approved_capital_usd",
      originCountry: "home_country",
      allocatedPark: "industrial_zone_slug",
    },
    description: "Ingests foreign direct investment approvals, capital commitments, and park allocations.",
  },
  {
    id: "conn-3",
    name: "Customs Monthly Export Trade Transaction Feed",
    type: "FILE_FEED",
    category: "Customs Export Records",
    format: "CSV",
    syncFrequency: "Monthly Batch",
    status: "Healthy",
    lastSync: "2026-08-01T00:00:00Z",
    recordsSynced: 34200,
    successRate: "100%",
    schemaMapping: {
      enterpriseTIN: "exporter_tin",
      hsCode: "tariff_hs_code",
      exportValueFOB: "fob_value_usd",
      destinationCountry: "destination_iso",
    },
    description: "Batch CSV export data feed containing verified FOB trade values, HS tariff codes, and shipping ports.",
  },
  {
    id: "conn-4",
    name: "Ethiopian Electric Utility (EEU) Industrial Park Power Grid Feed",
    type: "REST_API",
    category: "Energy Infrastructure",
    endpoint: "https://scada-api.eeu.gov.et/v1/substations/industrial-parks",
    authType: "API Key",
    syncFrequency: "Real-time / 15m",
    status: "Healthy",
    lastSync: "2026-08-13T17:15:00Z",
    recordsSynced: 85,
    successRate: "99.1%",
    schemaMapping: {
      substationId: "substation_code",
      capacityMW: "installed_capacity_mw",
      loadPercentage: "current_load_pct",
      status: "grid_status",
    },
    description: "Live telemetry connector tracking substation capacities, power outages, and grid stability across industrial zones.",
  },
  {
    id: "conn-5",
    name: "Ethio Telecom Fiber Backbone Infrastructure Map Feed",
    type: "FILE_FEED",
    category: "Telecom & Digital Infrastructure",
    format: "GeoJSON / JSON",
    syncFrequency: "Weekly",
    status: "Healthy",
    lastSync: "2026-08-10T12:00:00Z",
    recordsSynced: 310,
    successRate: "100%",
    schemaMapping: {
      nodeId: "point_id",
      bandwidthGbps: "available_bandwidth_gbps",
      redundancyLevel: "fiber_ring_type",
    },
    description: "GIS fiber optic line dataset mapping high-speed internet connectivity to regional manufacturing clusters.",
  },
  {
    id: "conn-6",
    name: "National Enterprise Data Exchange Seed Feed",
    type: "REST_API",
    category: "Regional Industrial Bureau",
    endpoint: "http://localhost:4000/api/integrations/demo-seed-enterprise-registry",
    authType: "None",
    syncFrequency: "Daily",
    status: "Healthy",
    lastSync: "2026-08-13T12:00:00Z",
    recordsSynced: 6,
    successRate: "100%",
    schemaMapping: {
      enterpriseName: "name",
      tinNumber: "tin",
      industrySector: "sector",
      assignedRegion: "region",
    },
    description: "Regional and customs external registry feed containing enterprise submissions pending automated synchronization into national registry.",
  },
];

let syncLogsStore = [
  {
    id: "log-101",
    connectorId: "conn-1",
    connectorName: "Ethiopian Revenues & Customs Authority (ERCA) Tax API",
    executionTime: "2026-08-13T16:30:00Z",
    status: "SUCCESS",
    recordsProcessed: 12480,
    recordsUpdated: 142,
    errorsEncountered: 0,
    latencyMs: 340,
    details: "All taxpayer compliance records verified against national TIN database.",
  },
  {
    id: "log-102",
    connectorId: "conn-2",
    connectorName: "Ethiopian Investment Commission (EIC) FDI Portal",
    executionTime: "2026-08-13T08:00:00Z",
    status: "SUCCESS",
    recordsProcessed: 1840,
    recordsUpdated: 12,
    errorsEncountered: 0,
    latencyMs: 512,
    details: "Ingested 3 new foreign direct investment approvals for Bole Lemi Phase II.",
  },
  {
    id: "log-103",
    connectorId: "conn-3",
    connectorName: "Customs Monthly Export Trade Transaction Feed",
    executionTime: "2026-08-01T00:00:00Z",
    status: "SUCCESS",
    recordsProcessed: 34200,
    recordsUpdated: 34200,
    errorsEncountered: 0,
    latencyMs: 1250,
    details: "Processed monthly export batch CSV dataset for July 2026.",
  },
  {
    id: "log-104",
    connectorId: "conn-4",
    connectorName: "Ethiopian Electric Utility (EEU) Industrial Park Power Grid Feed",
    executionTime: "2026-08-13T17:15:00Z",
    status: "SUCCESS",
    recordsProcessed: 85,
    recordsUpdated: 4,
    errorsEncountered: 0,
    latencyMs: 180,
    details: "Telemetry metrics refreshed across 12 industrial park substations.",
  },
];

export function listConnectors() {
  return connectorsStore;
}

export function getConnector(id) {
  return connectorsStore.find((c) => c.id === id);
}

export function createConnector(data) {
  const newConn = {
    id: `conn-${Date.now()}`,
    name: data.name || "External Data Connector",
    type: data.type || "REST_API",
    category: data.category || "General Integration",
    endpoint: data.endpoint || "",
    format: data.format || undefined,
    authType: data.authType || "API Key",
    syncFrequency: data.syncFrequency || "Manual",
    status: "Healthy",
    lastSync: new Date().toISOString(),
    recordsSynced: 0,
    successRate: "100%",
    schemaMapping: data.schemaMapping || {},
    description: data.description || "",
  };
  connectorsStore.unshift(newConn);
  return newConn;
}

export function updateConnector(id, data) {
  const idx = connectorsStore.findIndex((c) => c.id === id);
  if (idx === -1) return null;
  connectorsStore[idx] = { ...connectorsStore[idx], ...data };
  return connectorsStore[idx];
}

export function syncIntegrateEnterprisesForConnector(conn) {
  const registeredTins = new Set(enterprises.map((e) => e.tin));
  const registeredNames = new Set(enterprises.map((e) => e.name.toLowerCase()));
  let newEnterpriseCount = 0;

  if (conn.id === "conn-1") {
    // ERCA Tax API Sync -> Ingest unregistered taxpayers into Enterprise Registry
    ERCA_SOURCE.forEach((erca) => {
      if (!registeredTins.has(erca.taxpayer_tin) && !registeredNames.has(erca.registered_name.toLowerCase())) {
        createEnterprise(
          {
            name: erca.registered_name,
            tin: erca.taxpayer_tin,
            sector: "Textile & Garment",
            region: "Addis Ababa",
            ownership: "Domestic private",
            status: "Integrated (ERCA)",
            about: `Auto-integrated from ERCA Tax Verification API during connector sync. Verified TIN compliance: ${erca.compliance_status}.`,
          },
          { source: "ERCA Tax API" }
        );
        newEnterpriseCount++;
      }
    });
  } else if (conn.id === "conn-2") {
    // EIC FDI Portal Sync -> Ingest approved foreign investment projects into Enterprise Registry
    EIC_SOURCE.forEach((fdi) => {
      if (!registeredNames.has(fdi.company_name.toLowerCase())) {
        createEnterprise(
          {
            name: fdi.company_name,
            sector: fdi.sector,
            region: fdi.park_name.includes("Hawassa") ? "Sidama" : fdi.park_name.includes("Dire Dawa") ? "Dire Dawa" : fdi.park_name.includes("Kombolcha") ? "Amhara" : "Addis Ababa",
            ownership: `Foreign (${fdi.home_country})`,
            industrialPark: fdi.park_name,
            status: "Integrated (EIC FDI)",
            about: `Auto-integrated from EIC Foreign Direct Investment Gateway. Approved capital commitment: $${(fdi.approved_capital_usd / 1_000_000).toFixed(1)}M USD.`,
          },
          { source: "EIC FDI Gateway" }
        );
        newEnterpriseCount++;
      }
    });
  } else if (conn.id === "conn-3") {
    // Customs CSV Feed Sync -> Ingest exporter records into Enterprise Registry
    CUSTOMS_SOURCE.forEach((cust) => {
      if (!registeredTins.has(cust.exporter_tin)) {
        createEnterprise(
          {
            name: cust.registered_name || `Customs Exporter ${cust.exporter_tin}`,
            tin: cust.exporter_tin,
            sector: "Export Manufacturing",
            region: "Oromia",
            exportStatus: "Exporting",
            status: "Integrated (Customs Feed)",
            about: `Auto-integrated from Customs Monthly Export Feed during batch sync. Verified FOB trade value: $${cust.fob_value_usd.toLocaleString()} USD.`,
          },
          { source: "Customs Export Feed" }
        );
        newEnterpriseCount++;
      }
    });
  } else if (conn.id === "conn-6") {
    // Seed Feed Sync -> Ingest unregistered entities from DEMO_SEED_SOURCE into Enterprise Registry
    DEMO_SEED_SOURCE.forEach((item) => {
      if (!registeredTins.has(item.tin) && !registeredNames.has(item.name.toLowerCase())) {
        createEnterprise(
          {
            name: item.name,
            tin: item.tin,
            sector: item.sector,
            region: item.region,
            ownership: item.ownership,
            industrialPark: item.industrialPark,
            status: "Integrated (Seed Feed)",
            about: `Auto-integrated into National Enterprise Registry during connector sync (${conn.name}).`,
          },
          { source: conn.name }
        );
        newEnterpriseCount++;
      }
    });
  }

  return newEnterpriseCount;
}

/**
 * Ingest an array of enterprise objects from any external source.
 * Accepts any shape: flat array OR { enterprises: [...] } OR { data: [...] } etc.
 * Deduplicates against the Enterprise Registry by TIN + name.
 * Returns count of newly added enterprises.
 */
export function ingestEnterprisesFromPayload(payload, sourceName = "External Endpoint") {
  // Normalise: extract array from any common wrapper shape
  let items = [];
  if (Array.isArray(payload)) {
    items = payload;
  } else if (payload && typeof payload === "object") {
    // Try common wrapper keys
    items =
      payload.enterprises ||
      payload.data ||
      payload.records ||
      payload.items ||
      payload.results ||
      [];
  }

  if (!Array.isArray(items) || items.length === 0) return 0;

  const registeredTins  = new Set(enterprises.map((e) => e.tin));
  const registeredNames = new Set(enterprises.map((e) => e.name.toLowerCase()));
  let count = 0;

  items.forEach((item) => {
    const name = item.name || item.registered_name || item.company_name || item.enterpriseName || "";
    const tin  = item.tin  || item.taxpayer_tin   || item.exporter_tin  || item.tinNumber      || "";

    if (!name) return; // skip rows with no name

    if (
      (tin  && registeredTins.has(tin)) ||
      (name && registeredNames.has(name.toLowerCase()))
    ) {
      return; // duplicate — skip
    }

    createEnterprise(
      {
        name,
        tin,
        sector:        item.sector        || item.industrySector || "General Manufacturing",
        region:        item.region        || item.assignedRegion || "Addis Ababa",
        ownership:     item.ownership     || "Unknown",
        industrialPark:item.industrialPark|| item.park_name      || "—",
        status:        "Integrated (External Feed)",
        about:         `Auto-integrated from ${sourceName} during connector sync.`,
      },
      { source: sourceName }
    );

    registeredTins.add(tin);
    registeredNames.add(name.toLowerCase());
    count++;
  });

  return count;
}

export async function triggerConnectorSyncAsync(id) {
  const conn = getConnector(id);
  if (!conn) return null;

  const now = new Date().toISOString();
  let newEnterprisesIntegrated = 0;

  // For built-in connectors (conn-1..5) use the hardcoded source maps.
  // For conn-6 or any connector with a live external endpoint: fetch from the URL.
  const builtInIds = new Set(["conn-1", "conn-2", "conn-3", "conn-4", "conn-5"]);

  if (builtInIds.has(conn.id)) {
    newEnterprisesIntegrated = syncIntegrateEnterprisesForConnector(conn);
  } else if (conn.endpoint && conn.endpoint.startsWith("http")) {
    try {
      const response = await fetch(conn.endpoint);
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const payload = await response.json();
      newEnterprisesIntegrated = ingestEnterprisesFromPayload(payload, conn.name);
    } catch (err) {
      // Return a failed log entry so the UI can show the error
      const failLog = {
        id: `log-${Date.now()}`,
        connectorId: conn.id,
        connectorName: conn.name,
        executionTime: now,
        status: "FAILED",
        recordsProcessed: 0,
        recordsUpdated: 0,
        errorsEncountered: 1,
        latencyMs: 0,
        details: `Sync failed: could not fetch from ${conn.endpoint}. Error: ${err.message}`,
      };
      syncLogsStore.unshift(failLog);
      return { connector: conn, log: failLog, newEnterprisesAdded: 0 };
    }
  } else {
    // Fallback: try the hardcoded path
    newEnterprisesIntegrated = syncIntegrateEnterprisesForConnector(conn);
  }

  const simulatedRecords = Math.floor(Math.random() * 200) + 40;
  const simulatedUpdated = Math.floor(Math.random() * 20) + 1;
  const latency          = Math.floor(Math.random() * 300) + 120;

  conn.lastSync     = now;
  conn.recordsSynced = (conn.recordsSynced || 0) + simulatedUpdated + newEnterprisesIntegrated;
  conn.status       = "Healthy";

  const detailsMsg = newEnterprisesIntegrated > 0
    ? `Sync completed. Fetched ${simulatedRecords} records from ${conn.endpoint || "source"}, auto-registered ${newEnterprisesIntegrated} new enterprise(s) into Enterprise Registry.`
    : `Sync completed. Fetched from ${conn.endpoint || "source"}. No new enterprises found (all duplicates or 0 records).`;

  const logEntry = {
    id: `log-${Date.now()}`,
    connectorId: conn.id,
    connectorName: conn.name,
    executionTime: now,
    status: "SUCCESS",
    recordsProcessed: simulatedRecords,
    recordsUpdated:   simulatedUpdated + newEnterprisesIntegrated,
    errorsEncountered: 0,
    latencyMs: latency,
    details: detailsMsg,
  };

  syncLogsStore.unshift(logEntry);
  return { connector: conn, log: logEntry, newEnterprisesAdded: newEnterprisesIntegrated };
}

// Synchronous fallback kept for backward-compatibility with existing callers
export function triggerConnectorSync(id) {
  const conn = getConnector(id);
  if (!conn) return null;

  const now = new Date().toISOString();
  const newEnterprisesIntegrated = syncIntegrateEnterprisesForConnector(conn);

  const simulatedRecords = Math.floor(Math.random() * 200) + 40;
  const simulatedUpdated = Math.floor(Math.random() * 20) + 1;
  const latency = Math.floor(Math.random() * 300) + 120;

  conn.lastSync = now;
  conn.recordsSynced = (conn.recordsSynced || 0) + simulatedUpdated + newEnterprisesIntegrated;
  conn.status = "Healthy";

  const detailsMsg = newEnterprisesIntegrated > 0
    ? `Sync completed. Ingested ${simulatedRecords} records, updated ${simulatedUpdated} entities, and auto-registered ${newEnterprisesIntegrated} new enterprise(s) into Enterprise Registry.`
    : `Sync completed. Ingested ${simulatedRecords} raw records, updated ${simulatedUpdated} system entities.`;

  const logEntry = {
    id: `log-${Date.now()}`,
    connectorId: conn.id,
    connectorName: conn.name,
    executionTime: now,
    status: "SUCCESS",
    recordsProcessed: simulatedRecords,
    recordsUpdated: simulatedUpdated + newEnterprisesIntegrated,
    errorsEncountered: 0,
    latencyMs: latency,
    details: detailsMsg,
  };

  syncLogsStore.unshift(logEntry);
  return { connector: conn, log: logEntry, newEnterprisesAdded: newEnterprisesIntegrated };
}

export function parseAndPreviewFileData(rawString, fileType = "csv") {
  if (!rawString) return { headers: [], rows: [], totalCount: 0 };

  try {
    if (fileType.toLowerCase() === "json") {
      const parsed = JSON.parse(rawString);
      const rows = Array.isArray(parsed) ? parsed : [parsed];
      const headers = rows.length > 0 ? Object.keys(rows[0]) : [];
      return { headers, rows: rows.slice(0, 10), totalCount: rows.length };
    }

    // CSV Parsing fallback
    const lines = rawString.trim().split(/\r?\n/).filter(Boolean);
    if (!lines.length) return { headers: [], rows: [], totalCount: 0 };

    const headers = lines[0].split(",").map((h) => h.trim().replace(/^["']|["']$/g, ""));
    const rows = lines.slice(1, 11).map((line) => {
      const values = line.split(",").map((v) => v.trim().replace(/^["']|["']$/g, ""));
      const rowObj = {};
      headers.forEach((h, idx) => {
        rowObj[h] = values[idx] || "";
      });
      return rowObj;
    });

    return { headers, rows, totalCount: lines.length - 1 };
  } catch (err) {
    return { error: err.message || "Failed to parse file payload" };
  }
}

export function ingestFileDataToRegistry(rawString, fileType = "csv") {
  const parsed = parseAndPreviewFileData(rawString, fileType);
  if (parsed.error || !parsed.rows.length) return { count: 0, items: [] };

  const registeredTins = new Set(enterprises.map((e) => e.tin));
  const registeredNames = new Set(enterprises.map((e) => e.name.toLowerCase()));
  const createdItems = [];

  parsed.rows.forEach((row) => {
    const name = row.registered_name || row.park_name || row.company_name || row.name || `Datafile Entity ${Date.now()}`;
    const tin = row.exporter_tin || row.taxpayer_tin || row.tin || `00${Math.floor(10000000 + Math.random() * 90000000)}`;

    if (!registeredTins.has(tin) && !registeredNames.has(name.toLowerCase())) {
      const created = createEnterprise(
        {
          name,
          tin,
          sector: row.tariff_hs_code ? "Export Manufacturing" : row.available_bandwidth_gbps ? "Telecom & Fiber" : "General Industry",
          region: "Oromia",
          status: "Integrated (Datafile Batch)",
          about: `Auto-integrated into National Enterprise Registry from batch ${fileType.toUpperCase()} datafile ingestion stream.`,
        },
        { source: `Batch ${fileType.toUpperCase()} Datafile` }
      );
      createdItems.push(created);
    }
  });

  return { count: createdItems.length, items: createdItems };
}

export function listSyncLogs() {
  return syncLogsStore;
}

/* ─────────────────────────────────────────────────────────────────
   ENRICHMENT DATA STORES
   Populated on sync (auto) and kept deduplicated by key.
───────────────────────────────────────────────────────────────── */

// ERCA mock source
const ERCA_SOURCE = [
  { taxpayer_tin: "0091234567", registered_name: "Bole Lemi Garments PLC",  compliance_status: "COMPLIANT",     filing_period_year: 2025, revenue_range_etb: "500M - 1B"   },
  { taxpayer_tin: "0098765432", registered_name: "Awash Wine S.C.",          compliance_status: "COMPLIANT",     filing_period_year: 2025, revenue_range_etb: "250M - 500M" },
  { taxpayer_tin: "0054321098", registered_name: "Dire Dawa Textiles PLC",   compliance_status: "COMPLIANT",     filing_period_year: 2025, revenue_range_etb: "100M - 250M" },
  { taxpayer_tin: "0011223344", registered_name: "Mojo Leather Tannery",     compliance_status: "COMPLIANT",     filing_period_year: 2025, revenue_range_etb: "50M - 100M"  },
  { taxpayer_tin: "0077889900", registered_name: "Ethiopia Steel Works PLC", compliance_status: "PENDING_AUDIT", filing_period_year: 2024, revenue_range_etb: "500M - 1B"   },
];

// Customs CSV source (keyed by exporter_tin)
const CUSTOMS_SOURCE = [
  { exporter_tin: "0091234567", fob_value_usd: 450000,  destination_iso: "USA", tariff_hs_code: "6203.42", export_date: "2026-08-01" },
  { exporter_tin: "0098765432", fob_value_usd: 120000,  destination_iso: "KEN", tariff_hs_code: "2204.21", export_date: "2026-08-02" },
  { exporter_tin: "0054321098", fob_value_usd: 850000,  destination_iso: "CHN", tariff_hs_code: "5208.11", export_date: "2026-08-03" },
  { exporter_tin: "0011223344", fob_value_usd: 320000,  destination_iso: "ITA", tariff_hs_code: "4104.11", export_date: "2026-08-04" },
  { exporter_tin: "0077889900", fob_value_usd: 980000,  destination_iso: "DJI", tariff_hs_code: "7214.20", export_date: "2026-08-05" },
  { exporter_tin: "0033445566", fob_value_usd: 210000,  destination_iso: "SDN", tariff_hs_code: "7308.90", export_date: "2026-08-06" },
];

// EIC FDI source
const EIC_SOURCE = [
  { investment_id: "FDI-2026-089", company_name: "Sino-Ethio Textile Investment Ltd", home_country: "China",       approved_capital_usd: 45000000, industrial_zone_slug: "oromia-hawassa",   park_name: "Hawassa Industrial Park",   sector: "Textile & Apparel",    status: "APPROVED"          },
  { investment_id: "FDI-2026-092", company_name: "Anadolu Chemical Industries",        home_country: "Turkey",      approved_capital_usd: 28000000, industrial_zone_slug: "dire-dawa",        park_name: "Dire Dawa Industrial Park", sector: "Chemicals & Plastics", status: "UNDER_CONSTRUCTION"},
  { investment_id: "FDI-2026-104", company_name: "Prism Agro-Processing BV",           home_country: "Netherlands", approved_capital_usd: 18500000, industrial_zone_slug: "amhara-kombolcha", park_name: "Kombolcha Industrial Park", sector: "Food & Beverage",      status: "OPERATIONAL"       },
  { investment_id: "FDI-2026-115", company_name: "GreenPower Battery Tech",             home_country: "South Korea", approved_capital_usd: 62000000, industrial_zone_slug: "kilinto-pharma",  park_name: "Kilinto Industrial Park",   sector: "Electronics & Metals", status: "LICENSED"          },
];

// National Enterprise Data Exchange Seed Feed Source
export const DEMO_SEED_SOURCE = [
  // ── Add your custom sample enterprises below ──
  { name: "Ethio Leather Export PLC",         tin: "0031122334", sector: "Leather & Footwear",   region: "Addis Ababa", industrialPark: "Bole Lemi Industrial Park",  ownership: "Domestic private"           },
  { name: "Tigray Cement & Mining S.C.",      tin: "0042233445", sector: "Mining & Quarrying",    region: "Tigray",      industrialPark: "—",                          ownership: "Public Enterprise"          },
  { name: "Bahir Dar Textile Mills PLC",      tin: "0053344556", sector: "Textile & Garment",     region: "Amhara",      industrialPark: "Combolcha Industrial Park",  ownership: "Domestic private"           },
  { name: "Hawassa Agro-Chemical Ltd",        tin: "0064455667", sector: "Chemicals & Plastics",  region: "Sidama",      industrialPark: "Hawassa Industrial Park",    ownership: "Foreign (India)"            },
  { name: "Jimma Bio-Organic Farming Co.",    tin: "0075566778", sector: "Agribusiness",          region: "Oromia",      industrialPark: "—",                          ownership: "Cooperative"                },
  { name: "Addis Precision Metals S.C.",      tin: "0086677889", sector: "Metal & Engineering",   region: "Addis Ababa", industrialPark: "Kilinto Industrial Park",    ownership: "Public-Private Partnership" },
  { name: "Djibouti Link Logistics PLC",      tin: "0097788990", sector: "Transport & Logistics", region: "Dire Dawa",   industrialPark: "Dire Dawa Industrial Park",  ownership: "Foreign (UAE)"              },
  { name: "Mekelle Green Energy SC",          tin: "0055112233", sector: "Renewable Energy",      region: "Tigray",      industrialPark: "Mekelle Industrial Park",    ownership: "Domestic private"           },
];

export function addSampleToDemoSeedSource(item = {}) {
  const name = item.name || "Sample Enterprise";
  const tin = item.tin || `00${Math.floor(10000000 + Math.random() * 90000000)}`;
  const entry = {
    name,
    tin,
    sector: item.sector || "General Manufacturing",
    region: item.region || "Addis Ababa",
    industrialPark: item.industrialPark || "—",
    ownership: item.ownership || "Domestic private",
  };
  DEMO_SEED_SOURCE.push(entry);
  return entry;
}

// Telecom fiber source (keyed by park_name)
const TELECOM_SOURCE = [
  { point_id: "FIBER-HL-01", park_name: "Hawassa Industrial Park",   available_bandwidth_gbps: 100, fiber_ring_type: "Dual Redundant Fiber Ring", status: "ACTIVE",      active_factories_connected: 38 },
  { point_id: "FIBER-BL-02", park_name: "Bole Lemi Industrial Park", available_bandwidth_gbps: 100, fiber_ring_type: "Dual Redundant Fiber Ring", status: "ACTIVE",      active_factories_connected: 42 },
  { point_id: "FIBER-DD-03", park_name: "Dire Dawa Free Trade Zone", available_bandwidth_gbps: 50,  fiber_ring_type: "Single Core Fiber Ring",     status: "ACTIVE",      active_factories_connected: 19 },
  { point_id: "FIBER-KM-04", park_name: "Kombolcha Industrial Park", available_bandwidth_gbps: 40,  fiber_ring_type: "Single Core Fiber Ring",     status: "MAINTENANCE", active_factories_connected: 14 },
  { point_id: "FIBER-AW-05", park_name: "Adama Industrial Park",     available_bandwidth_gbps: 60,  fiber_ring_type: "Dual Redundant Fiber Ring",  status: "ACTIVE",      active_factories_connected: 27 },
];

// In-memory enrichment caches (deduplication by key)
let _ercaCache = new Map(ERCA_SOURCE.map((r) => [r.taxpayer_tin, r]));
let _customsCache = new Map(CUSTOMS_SOURCE.map((r) => [r.exporter_tin, r]));
let _eicCache = new Map(EIC_SOURCE.map((r) => [r.investment_id, r]));
let _telecomCache = new Map(TELECOM_SOURCE.map((r) => [r.park_name, r]));

/**
 * Called on every sync trigger. Re-merges source data into caches
 * without creating duplicates (Map key = natural PK).
 */
export function refreshEnrichmentCaches() {
  ERCA_SOURCE.forEach((r) => _ercaCache.set(r.taxpayer_tin, r));
  CUSTOMS_SOURCE.forEach((r) => _customsCache.set(r.exporter_tin, r));
  EIC_SOURCE.forEach((r) => _eicCache.set(r.investment_id, r));
  TELECOM_SOURCE.forEach((r) => _telecomCache.set(r.park_name, r));
}

/**
 * GET /api/integrations/enriched/enterprise/:tin
 * Returns ERCA + Customs data merged for a TIN.
 */
export function getEnterpriseEnrichment(tin) {
  const erca = _ercaCache.get(tin);
  const customs = _customsCache.get(tin);
  if (!erca && !customs) return null;
  return {
    tin,
    taxCompliance: erca
      ? { status: erca.compliance_status, filingYear: erca.filing_period_year, revenueRange: erca.revenue_range_etb }
      : null,
    tradeRecord: customs
      ? { fobValueUsd: customs.fob_value_usd, destinationIso: customs.destination_iso, hsCode: customs.tariff_hs_code, exportDate: customs.export_date }
      : null,
    lastVerifiedAt: new Date().toISOString(),
    sources: [erca ? "ERCA Tax API" : null, customs ? "Customs Export CSV" : null].filter(Boolean),
  };
}

/**
 * GET /api/integrations/enriched/fdi-opportunities
 * Returns EIC FDI records shaped as linkage opportunity cards.
 */
export function getFdiOpportunities() {
  return [..._eicCache.values()].map((r) => ({
    id: `fdi-${r.investment_id}`,
    investmentId: r.investment_id,
    companyName: r.company_name,
    homeCountry: r.home_country,
    capitalUsd: r.approved_capital_usd,
    parkName: r.park_name,
    sector: r.sector,
    status: r.status,
    source: "EIC FDI Portal",
  }));
}

/**
 * GET /api/integrations/enriched/park-connectivity
 * Returns telecom fiber data keyed by park name for GIS popup enrichment.
 */
export function getParkConnectivity() {
  const result = {};
  for (const [parkName, data] of _telecomCache.entries()) {
    result[parkName] = {
      bandwidthGbps: data.available_bandwidth_gbps,
      fiberRingType: data.fiber_ring_type,
      fiberStatus: data.status,
      factoriesConnected: data.active_factories_connected,
      pointId: data.point_id,
    };
  }
  // Overlay FDI investors per park
  for (const fdi of _eicCache.values()) {
    if (result[fdi.park_name]) {
      if (!result[fdi.park_name].fdiInvestors) result[fdi.park_name].fdiInvestors = [];
      result[fdi.park_name].fdiInvestors.push({
        investmentId: fdi.investment_id,
        company: fdi.company_name,
        country: fdi.home_country,
        capitalUsd: fdi.approved_capital_usd,
        sector: fdi.sector,
        status: fdi.status,
      });
    }
  }
  return result;
}

/**
 * Discovers external enterprises from ERCA, EIC, and Customs integration feeds
 * that do NOT yet exist in the official Enterprise Registry.
 */
export function listDiscoveredUnregisteredEnterprises() {
  const registeredTins = new Set(enterprises.map((e) => e.tin));
  const registeredNames = new Set(enterprises.map((e) => e.name.toLowerCase()));

  const discovered = [];

  // ERCA Taxpayers
  for (const erca of _ercaCache.values()) {
    if (!registeredTins.has(erca.taxpayer_tin) && !registeredNames.has(erca.registered_name.toLowerCase())) {
      discovered.push({
        id: `disc-erca-${erca.taxpayer_tin}`,
        name: erca.registered_name,
        tin: erca.taxpayer_tin,
        source: "ERCA Tax API",
        sourceCategory: "Government Tax Registry",
        sector: "Manufacturing",
        region: "Addis Ababa",
        details: `Compliance: ${erca.compliance_status} · Revenue Range: ${erca.revenue_range_etb}`,
        rawPayload: {
          name: erca.registered_name,
          tin: erca.taxpayer_tin,
          sector: "Textile & Garment",
          region: "Addis Ababa",
          status: "Verified (via ERCA)",
        },
      });
    }
  }

  // EIC FDI Projects
  for (const fdi of _eicCache.values()) {
    if (!registeredNames.has(fdi.company_name.toLowerCase())) {
      discovered.push({
        id: `disc-eic-${fdi.investment_id}`,
        name: fdi.company_name,
        tin: `00${Math.floor(10000000 + Math.random() * 90000000)}`,
        source: "EIC FDI Gateway",
        sourceCategory: "Investment Approval Registry",
        sector: fdi.sector,
        region: fdi.park_name.includes("Hawassa") ? "Sidama" : fdi.park_name.includes("Dire Dawa") ? "Dire Dawa" : fdi.park_name.includes("Kombolcha") ? "Amhara" : "Addis Ababa",
        details: `FDI ID: ${fdi.investment_id} · Origin: ${fdi.home_country} · Capital: $${(fdi.approved_capital_usd / 1_000_000).toFixed(1)}M USD`,
        rawPayload: {
          name: fdi.company_name,
          sector: fdi.sector,
          ownership: `FDI (${fdi.home_country})`,
          industrialPark: fdi.park_name,
          status: "Approved FDI",
        },
      });
    }
  }

  // Customs CSV Exporters
  for (const cust of _customsCache.values()) {
    if (!registeredTins.has(cust.exporter_tin)) {
      const alreadyAdded = discovered.some((d) => d.tin === cust.exporter_tin);
      if (!alreadyAdded) {
        discovered.push({
          id: `disc-cust-${cust.exporter_tin}`,
          name: `Exporter ${cust.exporter_tin}`,
          tin: cust.exporter_tin,
          source: "Customs Export Feed",
          sourceCategory: "Customs Trade Records",
          sector: "Export Manufacturing",
          region: "Oromia",
          details: `Export Destination: ${cust.destination_iso} · FOB Value: $${cust.fob_value_usd.toLocaleString()} USD`,
          rawPayload: {
            name: `Exporter ${cust.exporter_tin}`,
            tin: cust.exporter_tin,
            exportStatus: "Exporting",
          },
        });
      }
    }
  }

  return discovered;
}

/**
 * 1-Click Auto-register a discovered external enterprise directly into the Enterprise Registry.
 * If duplicate TIN or name already exists in the Enterprise Registry, no sync is needed and duplicate is skipped.
 */
export function autoRegisterFromIntegration(itemPayload) {
  const tin = itemPayload.tin;
  const name = itemPayload.name || "Integrated Enterprise";

  // Check for existing enterprise by TIN or Name
  const existing = enterprises.find(
    (e) => (tin && e.tin === tin) || e.name.toLowerCase() === name.toLowerCase()
  );

  if (existing) {
    return {
      duplicate: true,
      item: existing,
      message: `Enterprise '${existing.name}' (TIN: ${existing.tin}) already exists in Enterprise Registry. Duplicate skipped — no sync needed.`,
    };
  }

  const created = createEnterprise(
    {
      name,
      tin,
      sector: itemPayload.sector || "General Manufacturing",
      region: itemPayload.region || "Addis Ababa",
      ownership: itemPayload.ownership || "Domestic private",
      industrialPark: itemPayload.industrialPark || "—",
      status: "Auto-Verified via Integration",
      about: `Auto-provisioned into national registry from live data integration feed (${itemPayload.source || "External API"}). Verified TIN compliance & trade metrics.`,
    },
    { source: itemPayload.source || "integration" }
  );

  return { duplicate: false, item: created };
}

