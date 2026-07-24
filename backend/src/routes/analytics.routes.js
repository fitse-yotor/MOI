import { Router } from "express";
import {
  analyticsKpis,
  productionSalesTrend,
  genderByRegion,
  constraints,
  ictAdoption,
} from "../data/analytics.js";
import { authorize } from "../middleware/auth.js";

const router = Router();

router.get("/", authorize("analytics", "view"), (req, res) => {
  res.json({
    kpis: analyticsKpis,
    productionSalesTrend,
    genderByRegion,
    constraints,
    ictAdoption,
  });
});

export default router;
