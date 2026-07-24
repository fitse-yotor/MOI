import { Router } from "express";
import { laborProductivity, exportShare, gapAnalysis } from "../data/benchmark.js";
import { authorize } from "../middleware/auth.js";

const router = Router();

router.get("/", authorize("benchmark", "view"), (req, res) => {
  res.json({ laborProductivity, exportShare, gapAnalysis });
});

export default router;
