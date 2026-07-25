const TONE_MAP = {
  Active: "success", Approved: "success", Published: "success", Success: "success", Exporting: "success", Open: "success",
  Suspended: "error", Rejected: "error", Failed: "error", Declined: "error", Revoked: "error",
  "Pending verification": "warn", Returned: "warn", "In review": "warn", "Awaiting response": "warn", Scheduled: "warn",
  "Pending payment": "warn", "Renewal pending payment": "warn", Pending: "warn",
  Draft: "muted", Closed: "muted", Domestic: "muted", Expired: "muted",
};

export default function Badge({ children, tone }) {
  const resolved = tone || TONE_MAP[children] || "info";
  return <span className={`badge ${resolved}`}>{children}</span>;
}
