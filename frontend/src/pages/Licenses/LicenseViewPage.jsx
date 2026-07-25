import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useApiGet, useApiAction } from "../../api/hooks.js";
import { useAuth } from "../../context/AuthContext.jsx";
import { useSnackbar } from "../../context/SnackbarContext.jsx";
import { Card, CardHead } from "../../components/common/Card.jsx";
import { DataState } from "../../components/common/StateViews.jsx";
import Button from "../../components/common/Button.jsx";
import Badge from "../../components/common/Badge.jsx";
import CertificatePreview from "../../components/common/CertificatePreview.jsx";
import ConfirmDialog from "../../components/common/ConfirmDialog.jsx";

const PENDING_STATES = ["Pending payment", "Renewal pending payment"];

export default function LicenseViewPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, can } = useAuth();
  const { notify } = useSnackbar();
  const { data, loading, error, refetch } = useApiGet(`/licenses/${id}`);
  const renewAction = useApiAction("post");
  const closeAction = useApiAction("post");
  const [closing, setClosing] = useState(false);
  const [reason, setReason] = useState("");
  const [revoke, setRevoke] = useState(false);

  const item = data?.item;
  const pendingPayment = data?.pendingPayment;
  const isOwner = user?.role === "enterprise" && item?.enterpriseName === user.enterpriseName;
  const canManage = can("licenses", "edit");

  async function handleRenew() {
    try {
      await renewAction.run(`/licenses/${id}/renew`);
      notify("Renewal requested — payment is required to activate it", "success");
      refetch();
    } catch (err) {
      notify(err.message || "Could not request renewal", "error");
    }
  }

  async function handleClose() {
    await closeAction.run(`/licenses/${id}/close`, { reason, revoke });
    notify(revoke ? "License revoked" : "License closed", "success");
    setClosing(false);
    refetch();
  }

  return (
    <div style={{ maxWidth: 1080, margin: "0 auto" }}>
      <button className="link-btn no-print" onClick={() => navigate("/licenses")} style={{ marginBottom: 14 }}>← Back</button>
      <DataState loading={loading} error={error} onRetry={refetch}>
        {item && (
          <div className="grid g2" style={{ alignItems: "start" }}>
            <CertificatePreview
              templateName={item.templateName}
              category={item.category}
              licenseNumber={item.licenseNumber}
              enterpriseName={item.enterpriseName}
              issueDate={item.issueDate}
              expiryDate={item.expiryDate}
              feeETB={item.feeETB}
              status={item.status}
            />

            <div className="stack-14 no-print">
              <Card>
                <CardHead title="Actions" subtitle={`Issued by ${item.issuedBy}`} />
                <div className="stack-8">
                  {PENDING_STATES.includes(item.status) && pendingPayment && (isOwner || canManage) && (
                    <Button style={{ width: "100%", justifyContent: "center" }} onClick={() => navigate(`/payments/${pendingPayment.id}`)}>
                      Pay ETB {pendingPayment.amount.toLocaleString()} with Telebirr
                    </Button>
                  )}
                  {item.status === "Active" && isOwner && (
                    <Button
                      variant="outline"
                      style={{ width: "100%", justifyContent: "center" }}
                      disabled={renewAction.pending}
                      onClick={handleRenew}
                    >
                      {renewAction.pending ? "Requesting…" : "Request renewal"}
                    </Button>
                  )}
                  <Button variant="outline" style={{ width: "100%", justifyContent: "center" }} onClick={() => window.print()}>
                    Print certificate
                  </Button>
                  {canManage && !["Closed", "Revoked"].includes(item.status) && (
                    <Button variant="error" style={{ width: "100%", justifyContent: "center" }} onClick={() => setClosing(true)}>
                      Close / Revoke license
                    </Button>
                  )}
                </div>
              </Card>

              <Card>
                <CardHead title="History" />
                <div className="stack-8">
                  {item.history.slice().reverse().map((h, i) => (
                    <div key={i} style={{ borderBottom: "1px solid var(--border)", paddingBottom: 8 }}>
                      <div className="flexbtw">
                        <span style={{ fontWeight: 600, fontSize: 12.5 }}>{h.action}</span>
                        <span className="muted" style={{ fontSize: 11 }}>{h.date}</span>
                      </div>
                      <div className="muted" style={{ fontSize: 12 }}>{h.note}</div>
                      <div className="muted" style={{ fontSize: 11 }}>by {h.by}</div>
                    </div>
                  ))}
                </div>
              </Card>
            </div>
          </div>
        )}
      </DataState>

      <ConfirmDialog
        open={closing}
        title="Close this license?"
        message="Choose whether to close it (routine end-of-cycle) or revoke it (for-cause action). This is recorded in the license history."
        confirmLabel={revoke ? "Revoke license" : "Close license"}
        onConfirm={handleClose}
        onCancel={() => setClosing(false)}
      >
        <div className="form-field" style={{ marginBottom: 10 }}>
          <label>Reason</label>
          <input value={reason} onChange={(e) => setReason(e.target.value)} placeholder="e.g. Enterprise ceased operations" />
        </div>
        <label style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 12.5 }}>
          <input type="checkbox" checked={revoke} onChange={(e) => setRevoke(e.target.checked)} />
          Revoke for cause (non-compliance) rather than a routine close
        </label>
      </ConfirmDialog>
    </div>
  );
}
