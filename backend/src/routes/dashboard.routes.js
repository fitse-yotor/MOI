import { Router } from "express";
import {
  kpis,
  growthSeries,
  regionPerformance,
  reviewQueueSummary,
  activityFeed,
  dataQualityRadar,
} from "../data/dashboard.js";
import { authorize } from "../middleware/auth.js";

const router = Router();

router.get("/summary", authorize("dashboard", "view"), (req, res) => {
  const role = req.user.role;
  res.json({
    kpis: kpis[role] || kpis.federal,
    growthSeries,
    regionPerformance,
    reviewQueueSummary,
    activityFeed,
    dataQualityRadar,
  });
});

export default router;
