import { useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useApiGet, useApiAction } from "../../api/hooks.js";
import { DataState } from "../../components/common/StateViews.jsx";
import Button from "../../components/common/Button.jsx";

export default function TelebirrCheckoutPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data, loading, error, refetch } = useApiGet(`/payments/${id}`);
  const confirm = useApiAction("post");
  const cancel = useApiAction("post");
  const [phone, setPhone] = useState("");
  const [pin, setPin] = useState("");
  const [formError, setFormError] = useState("");
  const [result, setResult] = useState(null);

  const payment = result?.payment || data?.payment;
  const { license, template } = data || {};

  async function handlePay(e) {
    e.preventDefault();
    setFormError("");
    try {
      const res = await confirm.run(`/payments/${id}/telebirr/confirm`, { phone, pin });
      setResult(res);
    } catch (err) {
      setFormError(err.message || "Payment could not be completed");
    }
  }

  async function handleCancel() {
    await cancel.run(`/payments/${id}/telebirr/cancel`);
    refetch();
  }

  return (
    <div className="telebirr-page">
      <div className="telebirr-card">
        <div className="telebirr-header">
          <span className="telebirr-wordmark">telebirr</span>
          <span className="telebirr-sandbox">SANDBOX</span>
        </div>

        <DataState loading={loading} error={error} onRetry={refetch}>
          {payment && (
            <div className="telebirr-body">
              {payment.status === "Pending" && (
                <>
                  <div className="telebirr-summary">
                    <div className="flexbtw"><span className="muted">Paying</span><span style={{ fontWeight: 700 }}>{license?.enterpriseName}</span></div>
                    <div className="flexbtw"><span className="muted">For</span><span>{template?.name}</span></div>
                    <div className="flexbtw"><span className="muted">Purpose</span><span style={{ textTransform: "capitalize" }}>{payment.purpose === "renewal" ? "License renewal" : "License issue"}</span></div>
                    <div className="flexbtw telebirr-amount"><span>Amount due</span><span>ETB {payment.amount.toLocaleString()}</span></div>
                  </div>

                  <form onSubmit={handlePay}>
                    <div className="form-field" style={{ marginBottom: 14 }}>
                      <label>Telebirr phone number</label>
                      <input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="09xxxxxxxx" required />
                    </div>
                    <div className="form-field" style={{ marginBottom: 6 }}>
                      <label>PIN</label>
                      <input
                        className="telebirr-pin"
                        type="password"
                        inputMode="numeric"
                        maxLength={6}
                        value={pin}
                        onChange={(e) => setPin(e.target.value.replace(/\D/g, ""))}
                        placeholder="••••"
                        required
                      />
                    </div>
                    <p className="muted" style={{ fontSize: 11, marginBottom: 16 }}>
                      This is a simulated Telebirr checkout for testing — no real funds are moved and no real Telebirr account is contacted.
                    </p>
                    {formError && <div className="badge error" style={{ marginBottom: 14 }}>{formError}</div>}
                    <Button style={{ width: "100%", justifyContent: "center" }} type="submit" disabled={confirm.pending}>
                      {confirm.pending ? "Processing…" : `Pay ETB ${payment.amount.toLocaleString()}`}
                    </Button>
                    <button type="button" className="link-btn" style={{ width: "100%", textAlign: "center", marginTop: 14 }} onClick={handleCancel} disabled={cancel.pending}>
                      Cancel payment
                    </button>
                  </form>
                </>
              )}

              {payment.status === "Success" && (
                <div style={{ textAlign: "center" }}>
                  <div className="badge success" style={{ marginBottom: 14 }}>Payment successful</div>
                  <p style={{ fontSize: 13.5, marginBottom: 4 }}>ETB {payment.amount.toLocaleString()} paid via Telebirr</p>
                  <p className="muted mono" style={{ fontSize: 12, marginBottom: 22 }}>Ref {payment.telebirrRef}</p>
                  <Button style={{ width: "100%", justifyContent: "center" }} onClick={() => navigate(`/licenses/${license.id}`)}>
                    Return to license
                  </Button>
                </div>
              )}

              {payment.status === "Failed" && (
                <div style={{ textAlign: "center" }}>
                  <div className="badge error" style={{ marginBottom: 14 }}>Payment cancelled</div>
                  <p className="muted" style={{ fontSize: 13, marginBottom: 22 }}>You can retry this payment any time from the license page.</p>
                  <Link to={`/licenses/${license.id}`} className="btn btn-primary" style={{ width: "100%", justifyContent: "center" }}>
                    Return to license
                  </Link>
                </div>
              )}
            </div>
          )}
        </DataState>
      </div>
    </div>
  );
}
