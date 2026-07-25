import { useState } from "react";
import Button from "./Button.jsx";

/** In-page confirmation modal for destructive actions — stays on the current page, no route change. */
export default function ConfirmDialog({ open, title, message, onConfirm, onCancel, confirmLabel = "Delete", tone = "error", children }) {
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");
  if (!open) return null;

  async function handleConfirm() {
    setPending(true);
    setError("");
    try {
      await onConfirm();
    } catch (err) {
      setError(err.message || "Something went wrong");
      setPending(false);
    }
  }

  return (
    <div
      className="overlay"
      style={{ alignItems: "center", justifyContent: "center" }}
      onClick={(e) => e.target === e.currentTarget && onCancel()}
    >
      <div className="card" style={{ width: 420 }}>
        <div className={`badge ${tone}`} style={{ marginBottom: 14 }}>{confirmLabel}</div>
        <div className="card-title" style={{ marginBottom: 8 }}>{title}</div>
        <p className="muted" style={{ fontSize: 13, lineHeight: 1.6, marginBottom: children ? 16 : 20 }}>{message}</p>
        {children && <div style={{ marginBottom: 20 }}>{children}</div>}
        {error && <div className="badge error" style={{ marginBottom: 14 }}>{error}</div>}
        <div style={{ display: "flex", gap: 10 }}>
          <Button variant="outline" onClick={onCancel} disabled={pending} style={{ flex: 1, justifyContent: "center" }}>
            Cancel
          </Button>
          <Button variant={tone === "error" ? "error" : "primary"} onClick={handleConfirm} disabled={pending} style={{ flex: 1, justifyContent: "center" }}>
            {pending ? "Working…" : confirmLabel}
          </Button>
        </div>
      </div>
    </div>
  );
}
