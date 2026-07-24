import { Router } from "express";
import { submissions } from "../data/review.js";
import { authorize } from "../middleware/auth.js";
import { canDecideAtLevel, applyDecision, resubmit } from "../workflow/reviewWorkflow.js";

const router = Router();

function scopeToOwnEnterprise(items, user) {
  return user.role === "enterprise" ? items.filter((s) => s.enterprise === user.enterpriseName) : items;
}

router.get("/queue", authorize("review", "view"), (req, res) => {
  const items = scopeToOwnEnterprise(submissions.filter((s) => s.status === "Pending"), req.user);
  res.json({ items });
});

router.get("/returned", authorize("review", "view"), (req, res) => {
  const items = scopeToOwnEnterprise(submissions.filter((s) => s.status === "Returned"), req.user);
  res.json({ items });
});

router.get("/history", authorize("review", "view"), (req, res) => {
  const finished = scopeToOwnEnterprise(
    submissions.filter((s) => s.status === "Approved" || s.status === "Rejected"),
    req.user
  );
  const items = finished.map((s) => {
    const last = s.history[s.history.length - 1];
    return { id: s.id, enterprise: s.enterprise, decision: s.status, by: last?.by, date: last?.date, reason: last?.reason };
  });
  res.json({ items });
});

router.post("/submissions/:id/decision", authorize("review", "approve"), (req, res, next) => {
  const { decision, reason } = req.body || {};
  if (!["Approved", "Rejected", "Returned"].includes(decision)) {
    const err = new Error("decision must be Approved, Rejected, or Returned");
    err.status = 400;
    return next(err);
  }
  const submission = submissions.find((s) => s.id === req.params.id);
  if (!submission) {
    const err = new Error(`Submission ${req.params.id} not found`);
    err.status = 404;
    return next(err);
  }
  if (submission.status !== "Pending") {
    const err = new Error("This submission is not awaiting a decision");
    err.status = 400;
    return next(err);
  }
  if (!canDecideAtLevel(req.user.role, submission.level)) {
    const err = new Error(`${req.user.role} is not authorized to decide at the ${submission.level} level`);
    err.status = 403;
    return next(err);
  }
  applyDecision(submission, { decision, by: req.user.name, reason });
  res.json({ item: submission });
});

router.post("/submissions/:id/resubmit", authorize("review", "view"), (req, res, next) => {
  const submission = submissions.find((s) => s.id === req.params.id);
  if (!submission) {
    const err = new Error(`Submission ${req.params.id} not found`);
    err.status = 404;
    return next(err);
  }
  if (submission.status !== "Returned") {
    const err = new Error("Only returned submissions can be resubmitted");
    err.status = 400;
    return next(err);
  }
  const isOwner = req.user.role === "federal" || submission.enterprise === req.user.enterpriseName;
  if (!isOwner) {
    const err = new Error("You can only resubmit your own enterprise's submissions");
    err.status = 403;
    return next(err);
  }
  resubmit(submission, { by: req.user.name });
  res.json({ item: submission });
});

export default router;
