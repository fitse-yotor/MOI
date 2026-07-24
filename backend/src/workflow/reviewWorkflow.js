export const LEVELS = ["Woreda", "Zonal", "Regional", "Federal"];

// Which login role is authorized to decide at each review level. Federal
// administrators can act at any level (escalation / override).
const ROLE_FOR_LEVEL = { Woreda: "woreda", Zonal: "regional", Regional: "regional", Federal: "federal" };

export function canDecideAtLevel(role, level) {
  return role === "federal" || ROLE_FOR_LEVEL[level] === role;
}

export function formatDate(date) {
  return date.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });
}

/**
 * Mutates `submission` in place according to the decision:
 *  - Approved: advances to the next level, or becomes final "Approved" at Federal.
 *  - Rejected / Returned: final state for this cycle (Returned can be resubmitted).
 * Returns the history entry that was appended.
 */
export function applyDecision(submission, { decision, by, reason }) {
  const entry = { level: submission.level, decision, by, date: formatDate(new Date()), reason: reason || "" };
  submission.history.push(entry);

  if (decision === "Approved") {
    const idx = LEVELS.indexOf(submission.level);
    if (idx === LEVELS.length - 1) {
      submission.status = "Approved";
    } else {
      submission.level = LEVELS[idx + 1];
      submission.status = "Pending";
    }
  } else if (decision === "Rejected") {
    submission.status = "Rejected";
  } else if (decision === "Returned") {
    submission.status = "Returned";
  }

  return entry;
}

export function resubmit(submission, { by }) {
  submission.history.push({ level: submission.level, decision: "Resubmitted", by, date: formatDate(new Date()), reason: "" });
  submission.status = "Pending";
}
