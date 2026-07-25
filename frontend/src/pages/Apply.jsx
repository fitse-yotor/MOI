import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../api/client.js";
import Button from "../components/common/Button.jsx";

const FIELDS = (ref) => [
  { key: "name", label: "Enterprise legal name", required: true },
  { key: "tin", label: "TIN", required: true },
  { key: "sector", label: "Sector", type: "select", options: ref.sectors },
  { key: "region", label: "Region", type: "select", options: ref.regions },
  { key: "size", label: "Size", type: "select", options: ref.sizes },
  { key: "manager", label: "Contact person" },
  { key: "phone", label: "Phone" },
  { key: "email", label: "Email", type: "email" },
];

export default function Apply() {
  const [ref, setRef] = useState({ regions: [], sectors: [], sizes: [] });
  const [values, setValues] = useState({});
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState(null);

  useEffect(() => {
    api.get("/public/apply/reference-data").then(setRef).catch(() => {});
  }, []);

  useEffect(() => {
    if (ref.sectors.length) {
      setValues((v) => ({ sector: ref.sectors[0], region: ref.regions[0], size: ref.sizes[0], ...v }));
    }
  }, [ref]);

  function update(key, val) {
    setValues((v) => ({ ...v, [key]: val }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setPending(true);
    setError("");
    try {
      const res = await api.post("/public/apply", values);
      setResult(res);
    } catch (err) {
      setError(err.message || "Something went wrong");
    } finally {
      setPending(false);
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-hero">
        <div className="auth-hero-top">
          <img src="/ministry-mark.svg" alt="Ministry of Industry" />
          <div className="auth-hero-brand">
            Manufacturing BIS
            <span>Ministry of Industry, Ethiopia</span>
          </div>
        </div>
        <div className="auth-hero-mid">
          <div className="auth-hero-title">Register your enterprise, then get licensed in days.</div>
          <div className="auth-hero-sub">
            Submit your application below. Once verified, you'll be able to sign in, apply for operating licenses and
            certificates, and pay securely with Telebirr — all from your own enterprise dashboard.
          </div>
        </div>
        <div className="auth-hero-stats">
          <div><strong>1</strong><span>Simple form</span></div>
          <div><strong>3</strong><span>Review levels</span></div>
          <div><strong>~48h</strong><span>Typical review</span></div>
        </div>
      </div>

      <div className="auth-form-side">
        <div className="auth-form-wrap" style={{ maxWidth: 460 }}>
          {result ? (
            <div>
              <div className="badge success" style={{ marginBottom: 16 }}>Application received</div>
              <div style={{ fontWeight: 800, fontSize: 20, marginBottom: 10 }}>You're almost set.</div>
              <p style={{ fontSize: 13.5, lineHeight: 1.7, marginBottom: 10, color: "var(--text2)" }}>{result.message}</p>
              <p style={{ fontSize: 13.5, marginBottom: 26 }}>
                Reference number: <strong className="mono">{result.referenceId}</strong>
              </p>
              <Link to="/login" className="btn btn-primary" style={{ width: "100%", justifyContent: "center" }}>
                Back to sign-in
              </Link>
            </div>
          ) : (
            <>
              <div style={{ marginBottom: 24 }}>
                <div style={{ fontWeight: 800, fontSize: 21, letterSpacing: "-0.01em" }}>Apply to register</div>
                <div className="muted" style={{ fontSize: 12.5, marginTop: 5 }}>A woreda or regional officer will review your submission</div>
              </div>
              <form onSubmit={handleSubmit}>
                <div className="form-grid">
                  {FIELDS(ref).map((f) => (
                    <div className="form-field" key={f.key}>
                      <label>
                        {f.label}
                        {f.required && <span style={{ color: "var(--error)" }}> *</span>}
                      </label>
                      {f.type === "select" ? (
                        <select value={values[f.key] ?? ""} onChange={(e) => update(f.key, e.target.value)}>
                          {(f.options || []).map((o) => <option key={o} value={o}>{o}</option>)}
                        </select>
                      ) : (
                        <input
                          type={f.type || "text"}
                          value={values[f.key] ?? ""}
                          onChange={(e) => update(f.key, e.target.value)}
                          required={f.required}
                        />
                      )}
                    </div>
                  ))}
                </div>
                {error && <div className="badge error" style={{ marginTop: 14 }}>{error}</div>}
                <Button style={{ width: "100%", justifyContent: "center", marginTop: 20 }} type="submit" disabled={pending}>
                  {pending ? "Submitting…" : "Submit application"}
                </Button>
                <div style={{ textAlign: "center", marginTop: 16 }}>
                  <Link to="/login" className="link-btn">Already have an account? Sign in</Link>
                </div>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
