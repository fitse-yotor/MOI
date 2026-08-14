import { Router } from "express";
import {
  kpis,
  growthSeries,
  regionPerformance,
  reviewQueueSummary,
  activityFeed,
  dataQualityRadar,
} from "../data/dashboard.js";
import { listConnectors, listSyncLogs, getFdiOpportunities } from "../data/connectors.js";
import { authorize } from "../middleware/auth.js";

const router = Router();

router.get("/summary", authorize("dashboard", "view"), (req, res) => {
  const role = req.user.role;

  // Build live integration panel from connector cache
  const connectors = listConnectors();
  const recentLogs = listSyncLogs().slice(0, 5);
  const fdiItems = getFdiOpportunities();

  const healthyCount = connectors.filter((c) => c.status === "Healthy").length;
  const totalFdiCapital = fdiItems.reduce((sum, f) => sum + (f.capitalUsd || 0), 0);
  const totalRecordsSynced = connectors.reduce((sum, c) => sum + (c.recordsSynced || 0), 0);

  const integrationPanel = {
    connectorHealth: { healthy: healthyCount, total: connectors.length },
    totalFdiCapitalUsd: totalFdiCapital,
    totalRecordsSynced,
    recentSyncs: recentLogs.map((l) => ({
      name: l.connectorName,
      time: l.executionTime,
      status: l.status,
      updated: l.recordsUpdated,
    })),
    fdiByStatus: fdiItems.reduce((acc, f) => {
      acc[f.status] = (acc[f.status] || 0) + 1;
      return acc;
    }, {}),
    fdiBySector: fdiItems.reduce((acc, f) => {
      acc[f.sector] = (acc[f.sector] || 0) + (f.capitalUsd || 0);
      return acc;
    }, {}),
  };

  res.json({
    kpis: kpis[role] || kpis.federal,
    growthSeries,
    regionPerformance,
    reviewQueueSummary,
    activityFeed,
    dataQualityRadar,
    integrationPanel,
  });
});

export default router;
