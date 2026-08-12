import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useApiGet, useApiAction } from "../../api/hooks.js";
import { useAuth } from "../../context/AuthContext.jsx";
import { useSnackbar } from "../../context/SnackbarContext.jsx";
import { Card, CardHead } from "../../components/common/Card.jsx";
import { DataState } from "../../components/common/StateViews.jsx";
import Button from "../../components/common/Button.jsx";
import CertificatePreview from "../../components/common/CertificatePreview.jsx";
import ConfirmDialog from "../../components/common/ConfirmDialog.jsx";

const PAY_STATES = ["Payment due", "Renewal payment due"];
const CLOSEABLE_STATES = ["Payment due", "Payment confirmed", "Active", "Expired", "Renewal submitted", "Renewal payment due", "Renewal payment confirmed"];

function daysUntil(dateStr) {
  return Math.ceil((new Date(dateStr) - new Date()) / (1000 * 60 * 60 * 24));
}

export default function LicenseViewPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, can } = useAuth();
  const { notify } = useSnackbar();
  const { data, loading, error, refetch } = useApiGet(`/licenses/${id}`);
  const action = useApiAction("post");
  const [closing, setClosing] = useState(false);
  const [reason, setReason] = useState("");
  const [revoke, setRevoke] = useState(false);
  const [deciding, setDeciding] = useState(null); // { kind: "application" | "renewal", decision: "Approved" | "Rejected" }
  const [decideReason, setDecideReason] = useState("");

  const item = data?.item;
  const pendingPayment = data?.pendingPayment;
  const isOwner = user?.role?.id === "enterprise" && item?.enterpriseName === user.enterpriseName;
  const canManage = can("licenses", "edit");
  const canApprove = can("licenses", "approve");

  async function run(path, payload, successMessage) {
    try {
      await action.run(path, payload ?? undefined);
      if (successMessage) notify(successMessage, "success");
      refetch();
    } catch (err) {
      notify(err.message || "Something went wrong", "error");
    }
  }

  async function handlePay() {
    try {
      let paymentId = pendingPayment?.id;
      if (!paymentId) {
        const res = await action.run(`/licenses/${id}/payment`);
        paymentId = res.payment.id;
      }
      navigate(`/payments/${paymentId}`);
    } catch (err) {
      notify(err.message || "Could not start payment", "error");
    }
  }

  async function handleDecision() {
    const path = deciding.kind === "application" ? `/licenses/${id}/decide` : `/licenses/${id}/renew/decide`;
    await action.run(path, { decision: deciding.decision, reason: decideReason });
    notify(`${deciding.kind === "application" ? "Application" : "Renewal"} ${deciding.decision.toLowerCase()}`, "success");
    setDeciding(null);
    setDecideReason("");
    refetch();
  }

  async function handleClose() {
    await action.run(`/licenses/${id}/close`, { reason, revoke });
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
            <div>
              {item.status === "Active" && item.expiryDate && daysUntil(item.expiryDate) <= 30 && (
                <div className="hint-banner no-print">
                  This license expires in {daysUntil(item.expiryDate)} days ({item.expiryDate}). {isOwner ? "Request a renewal to stay compliant." : ""}
                </div>
              )}
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
            </div>

            <div className="stack-14 no-print">
              <Card>
                <CardHead title="Actions" subtitle={item.issuedBy ? `Issued by ${item.issuedBy}` : "Awaiting institution review"} />
                <div className="stack-8">
                  {item.status === "Submitted" && canApprove && (
                    <>
                      <Button style={{ width: "100%", justifyContent: "center" }} onClick={() => setDeciding({ kind: "application", decision: "Approved" })}>
                        Approve application
                      </Button>
                      <Button variant="error" style={{ width: "100%", justifyContent: "center" }} onClick={() => setDeciding({ kind: "application", decision: "Rejected" })}>
                        Reject application
                      </Button>
                    </>
                  )}

                  {PAY_STATES.includes(item.status) && (isOwner || canManage) && (
                    <Button style={{ width: "100%", justifyContent: "center" }} disabled={action.pending} onClick={handlePay}>
                      Pay ETB {item.feeETB.toLocaleString()} with Telebirr
                    </Button>
                  )}

                  {item.status === "Payment confirmed" && canManage && (
                    <Button style={{ width: "100%", justifyContent: "center" }} disabled={action.pending} onClick={() => run(`/licenses/${id}/issue`, null, "License issued")}>
                      Issue license
                    </Button>
                  )}

                  {["Active", "Expired"].includes(item.status) && isOwner && (
                    <Button variant="outline" style={{ width: "100%", justifyContent: "center" }} disabled={action.pending} onClick={() => run(`/licenses/${id}/renew`, null, "Renewal requested — awaiting institution review")}>
                      Request renewal
                    </Button>
                  )}

                  {item.status === "Renewal submitted" && canApprove && (
                    <>
                      <Button style={{ width: "100%", justifyContent: "center" }} onClick={() => setDeciding({ kind: "renewal", decision: "Approved" })}>
                        Approve renewal
                      </Button>
                      <Button variant="error" style={{ width: "100%", justifyContent: "center" }} onClick={() => setDeciding({ kind: "renewal", decision: "Rejected" })}>
                        Reject renewal
                      </Button>
                    </>
                  )}

                  {item.status === "Renewal payment confirmed" && canManage && (
                    <Button style={{ width: "100%", justifyContent: "center" }} disabled={action.pending} onClick={() => run(`/licenses/${id}/renew/issue`, null, "Renewal certificate issued")}>
                      Issue renewal certificate
                    </Button>
                  )}

                  {item.status === "Active" && (
                    <Button variant="outline" style={{ width: "100%", justifyContent: "center" }} onClick={() => window.print()}>
                      Print certificate
                    </Button>
                  )}

                  {canManage && CLOSEABLE_STATES.includes(item.status) && (
                    <Button variant="error" style={{ width: "100%", justifyContent: "center" }} onClick={() => setClosing(true)}>
                      Close / Revoke license
                    </Button>
                  )}

                  {!(item.status === "Submitted" && canApprove) &&
                    !(PAY_STATES.includes(item.status) && (isOwner || canManage)) &&
                    !(item.status === "Payment confirmed" && canManage) &&
                    !(["Active", "Expired"].includes(item.status) && isOwner) &&
                    !(item.status === "Renewal submitted" && canApprove) &&
                    !(item.status === "Renewal payment confirmed" && canManage) &&
                    !(canManage && CLOSEABLE_STATES.includes(item.status)) && (
                      <div className="muted" style={{ fontSize: 12.5 }}>No actions available for you at this stage.</div>
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
                      {h.note && <div className="muted" style={{ fontSize: 12 }}>{h.note}</div>}
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
        open={!!deciding}
        title={deciding ? `${deciding.decision} this ${deciding.kind}?` : ""}
        message={
          deciding?.decision === "Rejected"
            ? "Provide a reason for the applicant. This is recorded in the license history."
            : "This moves the license to the next step of the process."
        }
        confirmLabel={deciding?.decision}
        tone={deciding?.decision === "Rejected" ? "error" : "success"}
        onConfirm={handleDecision}
        onCancel={() => { setDeciding(null); setDecideReason(""); }}
      >
        <div className="form-field">
          <label>Reason {deciding?.decision === "Rejected" ? "" : "(optional)"}</label>
          <input value={decideReason} onChange={(e) => setDecideReason(e.target.value)} placeholder="e.g. Missing environmental clearance" />
        </div>
      </ConfirmDialog>

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
