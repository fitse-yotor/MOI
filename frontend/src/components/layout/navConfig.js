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
    ],
  },
  {
    group: "Analytics & GIS",
    items: [
      { id: "gis", path: "/gis", label: "GIS & Maps", icon: "gis" },
      { id: "analytics", path: "/analytics", label: "Analytics Dashboards", icon: "analytics" },
      { id: "reports", path: "/reports", label: "Reports", icon: "reports" },
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
  "/reports": ["Statistical & Non-Statistical Reporting", "Report catalogue and builder"],
  "/benchmark": ["Benchmark & International Data", "Comparison against peer countries"],
  "/linkage": ["B2B Linkage & Market Opportunities", "Buyers, suppliers, investors and partners"],
  "/notifications": ["Notifications", "System and workflow alerts"],
  "/users": ["Users & Access", "Role-based access control"],
  "/audit": ["Audit Log", "Login, action and data-change history"],
  "/config": ["Configuration & Master Data", "System parameters and reference data"],
};
