import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import { api } from "../api/client.js";
import Button from "../components/common/Button.jsx";
import { Card } from "../components/common/Card.jsx";

export default function Login() {
  const { login, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [accounts, setAccounts] = useState([]);
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
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "var(--bg)", padding: 20 }}>
      <div style={{ display: "flex", gap: 24, maxWidth: 820, width: "100%", flexWrap: "wrap" }}>
        <Card style={{ flex: "1 1 340px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 22 }}>
            <img src="/ministry-mark.svg" alt="Ministry of Industry" style={{ width: 40, height: 40 }} />
            <div>
              <div style={{ fontWeight: 700, fontSize: 14 }}>Manufacturing BIS</div>
              <div className="muted" style={{ fontSize: 11 }}>Ministry of Industry · Government sign-in</div>
            </div>
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
          </form>
        </Card>
        <Card style={{ flex: "1 1 340px" }}>
          <div className="card-title" style={{ marginBottom: 4 }}>Demo accounts</div>
          <div className="muted" style={{ fontSize: 11.5, marginBottom: 14 }}>
            One-click sign-in — each role has its own nav, dashboard and permissions.
          </div>
          <div className="stack-8">
            {accounts.map((a) => (
              <button
                key={a.username}
                type="button"
                onClick={() => doLogin(a.username, a.password)}
                disabled={pending}
                style={{ width: "100%", textAlign: "left", border: "1px solid var(--border)", borderRadius: 8, padding: "10px 12px", background: "#fff" }}
              >
                <div style={{ fontWeight: 600, fontSize: 13 }}>{a.name}</div>
                <div className="muted" style={{ fontSize: 11.5 }}>{a.roleLabel} · {a.username}</div>
              </button>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
