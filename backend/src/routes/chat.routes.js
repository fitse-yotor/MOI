import { Router } from "express";
import { answer } from "../chat/engine.js";
import { answerMinister } from "../chat/ministerEngine.js";
import { authorize } from "../middleware/auth.js";

const router = Router();

// Authenticated assistant — any signed-in role can ask about the full
// (non-public) registry, infrastructure and market data.
router.post("/", authorize("chat", "view"), (req, res, next) => {
  const { question } = req.body || {};
  if (!question || !question.trim()) {
    const err = new Error("A question is required");
    err.status = 400;
    return next(err);
  }
  const result = answer(question, {
    role: req.user.role,
    region: req.user.region,
    enterpriseName: req.user.enterpriseName,
    scope: "all",
  });
  res.json(result);
});

// Dedicated Ministerial Executive Decision Support AI for Ministry Leadership
router.post("/minister", authorize("chat", "view"), (req, res, next) => {
  const { question } = req.body || {};
  if (!question || !question.trim()) {
    const err = new Error("A question is required");
    err.status = 400;
    return next(err);
  }
  const result = answerMinister(question, req.user);
  res.json(result);
});

export default router;
