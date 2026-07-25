import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import { api } from "../api/client.js";
import Button from "../components/common/Button.jsx";

export default function Login() {
  const { login, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [accounts, setAccounts] = useState([]);
  const [showDemo, setShowDemo] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);

  useEffect(() => {
    api.get("/auth/demo-accounts").then((res) => setAccounts(res.items)).catch(() => {});
  }, []);

  useEffect(() => {
    if (user) navigate(location.state?.from?.pathname || "/", { replace: true });
  }, [user, navigate, location]);

  async function doLogin(u, p) {
    setError("");
    setPending(true);
    try {
      await login(u, p);
    } catch (err) {
      setError(err.message || "Login failed");
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
          <div className="auth-hero-title">One national platform for every manufacturing enterprise.</div>
          <div className="auth-hero-sub">
            Register your enterprise, submit statistical reports, get licensed and stay compliant — all from woreda to
            federal level, in one connected system.
          </div>
        </div>
        <div className="auth-hero-stats">
          <div><strong>12,480</strong><span>Enterprises</span></div>
          <div><strong>11</strong><span>Regions</span></div>
          <div><strong>24/7</strong><span>Live oversight</span></div>
        </div>
      </div>

      <div className="auth-form-side">
        <div className="auth-form-wrap">
          <div style={{ marginBottom: 28 }}>
            <div style={{ fontWeight: 800, fontSize: 21, letterSpacing: "-0.01em" }}>Sign in</div>
            <div className="muted" style={{ fontSize: 12.5, marginTop: 5 }}>Enter your credentials to access your dashboard</div>
          </div>

          <form onSubmit={(e) => { e.preventDefault(); doLogin(username, password); }}>
            <div className="form-field" style={{ marginBottom: 14 }}>
              <label>Username</label>
              <input value={username} onChange={(e) => setUsername(e.target.value)} placeholder="e.g. federal.admin" />
            </div>
            <div className="form-field" style={{ marginBottom: 14 }}>
              <label>Password</label>
              <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
            </div>
            {error && <div className="badge error" style={{ marginBottom: 14 }}>{error}</div>}
            <Button style={{ width: "100%", justifyContent: "center" }} type="submit" disabled={pending}>
              {pending ? "Signing in…" : "Sign in"}
            </Button>
            <div style={{ textAlign: "center", marginTop: 16 }}>
              <Link to="/apply" className="link-btn">New enterprise? Apply to register →</Link>
            </div>
          </form>

          <div style={{ marginTop: 30, paddingTop: 22, borderTop: "1px solid var(--border)" }}>
            <button type="button" className="link-btn" onClick={() => setShowDemo((v) => !v)}>
              {showDemo ? "Hide demo accounts" : "Try a demo account →"}
            </button>
            {showDemo && (
              <div className="stack-8" style={{ marginTop: 14 }}>
                {accounts.map((a) => (
                  <button
                    key={a.username}
                    type="button"
                    onClick={() => doLogin(a.username, a.password)}
                    disabled={pending}
                    style={{ width: "100%", textAlign: "left", border: "1px solid var(--border)", borderRadius: 9, padding: "10px 12px", background: "#fff", transition: "border-color 0.15s" }}
                  >
                    <div style={{ fontWeight: 600, fontSize: 13 }}>{a.name}</div>
                    <div className="muted" style={{ fontSize: 11.5 }}>{a.roleLabel} · {a.username}</div>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
