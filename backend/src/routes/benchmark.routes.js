import { Router } from "express";
import { laborProductivity, exportShare, gapAnalysis } from "../data/benchmark.js";
import { getFdiOpportunities, listConnectors } from "../data/connectors.js";
import { authorize } from "../middleware/auth.js";

const router = Router();

router.get("/", authorize("benchmark", "view"), (req, res) => {
  const fdiList = getFdiOpportunities();
  const connectors = listConnectors();

  // Aggregate FDI capital by Home Country
  const fdiCountryMap = {};
  fdiList.forEach((item) => {
    fdiCountryMap[item.homeCountry] = (fdiCountryMap[item.homeCountry] || 0) + (item.capitalUsd || 0);
  });

  const fdiCountryBenchmark = {
    labels: Object.keys(fdiCountryMap),
    values: Object.values(fdiCountryMap).map((v) => Math.round(v / 1_000_000)), // Millions USD
  };

  // Integration Gap Indicators
  const integrationGapAnalysis = [
    { indicator: "ERCA Tax Verification Match Rate", ethiopia: "99.8%", peer: "95.0%", gap: "+4.8%", trend: "up" },
    { indicator: "Industrial Park Fiber Ring Redundancy", ethiopia: "80.0%", peer: "75.0%", gap: "+5.0%", trend: "up" },
    { indicator: "FDI Capital Realization (USD/project)", ethiopia: "$38.4M", peer: "$28.5M", gap: "+$9.9M", trend: "up" },
    { indicator: "Customs Trade Clearance Processing Time", ethiopia: "4.2 hrs", peer: "6.5 hrs", gap: "-35.4%", trend: "up" },
  ];

  res.json({
    laborProductivity,
    exportShare,
    gapAnalysis: [...gapAnalysis, ...integrationGapAnalysis],
    fdiCountryBenchmark,
    integrationCount: connectors.length,
  });
});

export default router;

