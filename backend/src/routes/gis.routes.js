import { Router } from "express";
import { enterprises } from "../data/enterprises.js";
import { infrastructure, infrastructureByCategory, INFRA_CATEGORIES } from "../data/infrastructure.js";
import { authorize } from "../middleware/auth.js";

const router = Router();

router.get("/points", authorize("gis", "view"), (req, res) => {
  const { region, sector, size, status } = req.query;
  let result = enterprises;
  if (region && region !== "all") result = result.filter((e) => e.region === region);
  if (sector && sector !== "all") result = result.filter((e) => e.sector === sector);
  if (size && size !== "all") result = result.filter((e) => e.size === size);
  if (status && status !== "all") result = result.filter((e) => e.status === status);

  const points = result.map((e) => ({
    id: e.id,
    name: e.name,
    slug: e.slug,
    sector: e.sector,
    size: e.size,
    lat: e.lat,
    lng: e.lng,
    exportStatus: e.exportStatus,
    employees: e.employees,
    capacityUtilization: e.capacityUtilization,
    region: e.region,
    status: e.status,
  }));

  const regions = new Set(result.map((e) => e.region));
  const sectors = new Set(result.map((e) => e.sector));
  res.json({
    items: points,
    clusterSummary: {
      enterprisesInView: points.length,
      regionsCovered: regions.size,
      sectorsCovered: sectors.size,
      industrialParks: points.filter((p) => p.name || true).length,
    },
    filters: {
      regions: [...new Set(enterprises.map((e) => e.region))],
      sectors: [...new Set(enterprises.map((e) => e.sector))],
      sizes: [...new Set(enterprises.map((e) => e.size))],
    },
  });
});

router.get("/infrastructure", authorize("gis", "view"), (req, res) => {
  const { category, region } = req.query;
  let items = infrastructure;
  if (category && category !== "all") items = items.filter((i) => i.category === category);
  if (region && region !== "all") items = items.filter((i) => i.region === region);
  res.json({
    items,
    categories: INFRA_CATEGORIES,
    grouped: infrastructureByCategory(),
    count: items.length,
  });
});

router.get("/match-analysis", authorize("gis", "view"), (req, res) => {
  const { region, sector } = req.query;
  const regionsList = [...new Set(enterprises.map((e) => e.region))];

  const analysis = regionsList.map((r) => {
    const regionEnterprises = enterprises.filter((e) => e.region === r);
    const regionInfra = infrastructure.filter((i) => i.region === r || i.region === "Djibouti" || i.region === "Federal");

    const parkCount = regionInfra.filter((i) => i.category === "park").length;
    const powerCount = regionInfra.filter((i) => i.category === "power").length;
    const transportCount = regionInfra.filter((i) => i.category === "transport").length;
    const utilityCount = regionInfra.filter((i) => i.category === "utility").length;

    const infraScore = Math.min(100, (parkCount * 25) + (powerCount * 20) + (transportCount * 20) + (utilityCount * 15) + 20);

    const matches = [
      { sector: "Textile & Garment", suitability: Math.min(98, infraScore + (parkCount > 0 ? 15 : -10)), keyAsset: parkCount > 0 ? "Industrial Park & Water Available" : "Requires Park Shed" },
      { sector: "Food & Beverage", suitability: Math.min(95, infraScore + (utilityCount > 0 ? 10 : 0)), keyAsset: "Raw Material & Water Supply" },
      { sector: "Leather & Footwear", suitability: Math.min(92, infraScore + (parkCount > 0 ? 10 : -5)), keyAsset: "Tannery & Park Effluent Treatment" },
      { sector: "Metal & Engineering", suitability: Math.min(90, infraScore + (powerCount > 0 ? 15 : -15)), keyAsset: powerCount > 0 ? "High Voltage Grid Node" : "Power Grid Upgrade Needed" },
      { sector: "Chemicals", suitability: Math.min(88, infraScore + (transportCount > 0 ? 10 : 0)), keyAsset: "Logistics Corridor & Safety Zone" },
    ];

    return {
      region: r,
      infraScore,
      totalEnterprises: regionEnterprises.length,
      infraCount: regionInfra.length,
      matches,
    };
  });

  let filtered = analysis.map((a) => {
    let regionEnterprises = enterprises.filter((e) => e.region === a.region);
    let matchedSectors = a.matches;

    if (sector && sector !== "all") {
      regionEnterprises = regionEnterprises.filter((e) => e.sector.toLowerCase() === sector.toLowerCase());
      matchedSectors = a.matches.filter((m) => m.sector.toLowerCase() === sector.toLowerCase());
    }

    return {
      ...a,
      totalEnterprises: regionEnterprises.length,
      matches: matchedSectors,
    };
  });

  if (region && region !== "all") filtered = filtered.filter((a) => a.region === region);

  res.json({
    items: filtered,
    allRegions: regionsList,
    infrastructureSummary: {
      totalParks: infrastructure.filter((i) => i.category === "park").length,
      totalPowerNodes: infrastructure.filter((i) => i.category === "power").length,
      totalTransportNodes: infrastructure.filter((i) => i.category === "transport").length,
      totalUtilities: infrastructure.filter((i) => i.category === "utility").length,
    },
  });
});

export default router;
