import { Router } from "express";
import {
  analyticsKpis,
  productionSalesTrend,
  genderByRegion,
  constraints,
  ictAdoption,
} from "../data/analytics.js";
import { getFdiOpportunities, getParkConnectivity, listConnectors } from "../data/connectors.js";
import { authorize } from "../middleware/auth.js";

const router = Router();

router.get("/", authorize("analytics", "view"), (req, res) => {
  const fdiList = getFdiOpportunities();
  const parkMap = getParkConnectivity();
  const connectors = listConnectors();

  // Aggregate FDI capital by sector
  const fdiSectorMap = {};
  fdiList.forEach((item) => {
    fdiSectorMap[item.sector] = (fdiSectorMap[item.sector] || 0) + (item.capitalUsd || 0);
  });

  const fdiBySectorChart = {
    labels: Object.keys(fdiSectorMap),
    values: Object.values(fdiSectorMap).map((v) => Math.round(v / 1_000_000)), // Millions USD
  };

  // Telecom Fiber Bandwidth by Industrial Park
  const fiberParks = Object.keys(parkMap);
  const fiberBandwidth = fiberParks.map((k) => parkMap[k].bandwidthGbps || 0);

  const fiberCoverageChart = {
    labels: fiberParks,
    values: fiberBandwidth,
  };

  // Customs export summary from connector data
  const customsFeed = connectors.find((c) => c.id === "conn-3");
  const totalFdiCapitalM = (fdiList.reduce((s, f) => s + f.capitalUsd, 0) / 1_000_000).toFixed(1);

  const integrationAnalyticsKpis = [
    { label: "Approved FDI Commitments", value: `$${totalFdiCapitalM}M USD`, delta: "4 Major FDI Projects", trend: "up", color: "success" },
    { label: "Customs Synced Exports", value: `$${((customsFeed?.recordsSynced || 34200) * 85 / 1000).toFixed(1)}K USD`, delta: "FOB Trade Clearances", trend: "up", color: "primary" },
    { label: "Industrial Fiber Ring Grid", value: `${Object.keys(parkMap).length} Parks`, delta: "350 Gbps Total Backbone", trend: "up", color: "info" },
    { label: "Tax Verified TIN Registry", value: "12,480 TINs", delta: "99.8% ERCA Match Rate", trend: "up", color: "secondary" },
  ];

  res.json({
    kpis: [...analyticsKpis, ...integrationAnalyticsKpis],
    productionSalesTrend,
    genderByRegion,
    constraints,
    ictAdoption,
    fdiBySectorChart,
    fiberCoverageChart,
  });
});

export default router;

