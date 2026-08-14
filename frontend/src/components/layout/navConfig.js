export const NAV_GROUPS = [
  {
    group: "Overview",
    items: [{ id: "dashboard", path: "/", label: "Executive Dashboard", icon: "dashboard" }],
  },
  {
    group: "Data Management",
    items: [
      { id: "enterprises", path: "/enterprises", label: "Enterprise Registry", icon: "enterprises" },
      { id: "collection", path: "/collection", label: "Data Collection", icon: "collection" },
      { id: "review", path: "/review", label: "Review & Approval", icon: "review", badge: 42 },
      { id: "integrations", path: "/integrations", label: "Data Integrations", icon: "config" },
    ],
  },
  {
    group: "Analytics & GIS",
    items: [
      { id: "gis", path: "/gis", label: "GIS & Maps", icon: "gis" },
      { id: "analytics", path: "/analytics", label: "Analytics Dashboards", icon: "analytics" },
      { id: "reports", path: "/reports", label: "Reporting", icon: "reports" },
      { id: "benchmark", path: "/benchmark", label: "Benchmark", icon: "benchmark" },
    ],
  },
  {
    group: "Market",
    items: [
      { id: "linkage", path: "/linkage", label: "Linkage & Opportunities", icon: "linkage" },
      { id: "notifications", path: "/notifications", label: "Notifications", icon: "bell" },
    ],
  },
  {
    group: "Intelligence",
    items: [
      { id: "chat", path: "/chat", label: "AI Assistant", icon: "chat" },
      { id: "advisory", path: "/advisory", label: "Minister's Advisory", icon: "advisory" },
    ],
  },
  {
    group: "Licensing",
    items: [
      { id: "licenses", path: "/licenses", label: "Licenses & Certificates", icon: "licenses" },
      { id: "licenseTemplates", module: "licenses", path: "/licenses/templates", label: "License Templates", icon: "template" },
    ],
  },
  {
    group: "Administration",
    items: [
      { id: "users", path: "/users", label: "Users & Access", icon: "users" },
      { id: "audit", path: "/audit", label: "Audit Log", icon: "audit" },
      { id: "config", path: "/config", label: "Configuration", icon: "config" },
    ],
  },
];

export const PAGE_META = {
  "/": ["Executive Dashboard", "National overview · updated hourly"],
  "/enterprises": ["Enterprise Registry", "12,480 enterprises across 11 regions and 2 city administrations"],
  "/collection": ["Data Collection", "Manage campaigns, forms and questionnaires"],
  "/review": ["Review & Approval", "Multi-level verification workflow"],
  "/gis": ["GIS & Spatial Reporting", "Geographic distribution of manufacturing enterprises"],
  "/analytics": ["Industry Analysis Dashboards", "Interactive indicators with drill-down"],
  "/reports": ["Reporting", "Report catalogue and builder"],
  "/benchmark": ["Benchmark & International Data", "Comparison against peer countries"],
  "/linkage": ["B2B Linkage & Market Opportunities", "Buyers, suppliers, investors and partners"],
  "/notifications": ["Notifications", "System and workflow alerts"],
  "/licenses": ["Licenses & Certificates", "Issue, renew and close enterprise licenses"],
  "/licenses/issue": ["Issue License", "Issue a new license or certificate to a registered enterprise"],
  "/licenses/templates": ["License Templates", "Design and manage license certificate templates"],
  "/licenses/templates/new": ["New License Template", "Build a new license certificate template"],
  "/users": ["Users & Access", "Role-based access control"],
  "/audit": ["Audit Log", "Login, action and data-change history"],
  "/config": ["Configuration & Master Data", "System parameters and reference data"],
  "/integrations": ["External Data Integration", "Connect REST APIs, datafiles (CSV/JSON), and external feeds"],
  "/chat": ["AI Assistant", "Ask about enterprises, infrastructure and market opportunities"],
  "/advisory": ["Minister's Advisory", "Decision-support analysis for ministry officials"],
};
