const TONE_MAP = {
  Active: "success", Approved: "success", Published: "success", Success: "success", Exporting: "success", Open: "success",
  Suspended: "error", Rejected: "error", Failed: "error", Declined: "error", Revoked: "error",
  "Pending verification": "warn", Returned: "warn", "In review": "warn", "Awaiting response": "warn", Scheduled: "warn",
  Submitted: "warn", "Payment due": "warn", "Renewal payment due": "warn", "Renewal submitted": "warn", Pending: "warn",
  "Payment confirmed": "info", "Renewal payment confirmed": "info",
  Draft: "muted", Closed: "muted", Domestic: "muted", Expired: "muted",
};

export default function Badge({ children, tone }) {
  const resolved = tone || TONE_MAP[children] || "info";
  return <span className={`badge ${resolved}`}>{children}</span>;
}
