import { Router } from "express";
import { auditLog } from "../data/audit.js";
import { authorize } from "../middleware/auth.js";

const router = Router();

router.get("/", authorize("audit", "view"), (req, res) => {
  const { action, q } = req.query;
  let result = auditLog;
  if (action && action !== "all") result = result.filter((a) => a.action === action);
  if (q) {
    const needle = q.toLowerCase();
    result = result.filter(
      (a) => a.user.toLowerCase().includes(needle) || a.entity.toLowerCase().includes(needle)
    );
  }
  res.json({ items: result });
});

export default router;
