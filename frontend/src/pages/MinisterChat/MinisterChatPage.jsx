import { useState, useRef, useEffect } from "react";
import { api } from "../../api/client.js";
import { useSnackbar } from "../../context/SnackbarContext.jsx";

const QUICK_ACTIONS = [
  { label: "National Policy Memo", desc: "Executive policy brief on sector growth", query: "Generate official executive policy brief for the Minister of Industry on manufacturing sector growth" },
  { label: "FDI Site Selection", desc: "Optimal location for $50M foreign investment", query: "Recommend optimal investment site for a $50M foreign direct investment in textile manufacturing" },
  { label: "Import Substitution", desc: "Forex savings model for chemical & food", query: "Simulate import substitution forex savings for industrial chemicals and food processing sectors" },
  { label: "Infrastructure Bottlenecks", desc: "Energy & transport corridor analysis", query: "Analyze energy grid and logistics bottlenecks in Oromia and Amhara for industrial development" },
];

export default function MinisterChatPage() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [pending, setPending] = useState(false);
  const [sessionId] = useState(() => `EXEC-${Date.now().toString(36).toUpperCase()}`);
  const [focused, setFocused] = useState(false);
  const scrollRef = useRef(null);
  const inputRef = useRef(null);
  const { notify } = useSnackbar();

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, pending]);

  async function ask(queryText) {
    const text = (queryText || input || "").trim();
    if (!text || pending) return;
    setMessages((m) => [...m, { from: "user", text }]);
    setInput("");
    setPending(true);
    try {
      const res = await api.post("/chat/minister", { question: text });
      setMessages((m) => [...m, { from: "minister_ai", text: res.text, payload: res.payload, suggestions: res.suggestions }]);
    } catch (err) {
      setMessages((m) => [...m, { from: "minister_ai", text: err.message || "Failed to reach decision support service." }]);
    } finally {
      setPending(false);
      setTimeout(() => inputRef.current?.focus(), 80);
    }
  }

  function copyToClipboard(text) {
    navigator.clipboard.writeText(text);
    notify("Executive memo copied to clipboard", "success");
  }

  const now = new Date().toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>

      {/* ── Executive Masthead ── */}
      <div style={{
        background: "linear-gradient(135deg, #0f172a 0%, #1e293b 60%, #0f172a 100%)",
        color: "#fff",
        borderRadius: "var(--radius-lg)",
        padding: "24px 28px",
        boxShadow: "var(--shadow-md)",
        border: "1px solid rgba(255,255,255,0.08)",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        flexWrap: "wrap",
        gap: 14,
        position: "relative",
        overflow: "hidden",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 18, position: "relative" }}>
          <div style={{ width: 48, height: 48, borderRadius: 12, background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.15)", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <img src="/ministry-mark.svg" alt="Seal" style={{ width: 30, height: 30, filter: "brightness(0) invert(1)" }} />
          </div>
          <div>
            <div style={{ fontSize: 10.5, textTransform: "uppercase", letterSpacing: "0.08em", color: "#f4b41a", fontWeight: 800, marginBottom: 3 }}>
              Federal Democratic Republic of Ethiopia · Ministry of Industry
            </div>
            <h1 style={{ fontSize: 20, fontWeight: 800, margin: 0, color: "#fff", letterSpacing: "-0.02em" }}>
              Ministerial Executive Decision Support
            </h1>
            <div style={{ fontSize: 12.5, color: "#cbd5e1", marginTop: 3 }}>
              Macro policy evaluation, investment matching, and strategic decision briefing
            </div>
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 7, position: "relative" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 7, background: "rgba(34,197,94,0.12)", border: "1px solid rgba(34,197,94,0.3)", borderRadius: 20, padding: "5px 12px" }}>
            <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#22c55e", display: "inline-block" }} />
            <span style={{ fontSize: 11.5, fontWeight: 700, color: "#4ade80" }}>Decision Engine Active</span>
          </div>
          <div style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.09)", borderRadius: 6, padding: "4px 10px", fontSize: 11, color: "#94a3b8", fontFamily: "IBM Plex Mono, monospace" }}>
            {sessionId} · {now}
          </div>
        </div>
      </div>

      {/* ── Quick Action Tiles ── */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(230px, 1fr))", gap: 10 }}>
        {QUICK_ACTIONS.map((a) => (
          <button
            key={a.label}
            type="button"
            onClick={() => ask(a.query)}
            disabled={pending}
            className="card"
            style={{
              padding: "14px 16px",
              textAlign: "left",
              cursor: pending ? "not-allowed" : "pointer",
              transition: "all 0.15s ease",
              border: "1px solid var(--border)",
              opacity: pending ? 0.6 : 1,
              background: "var(--card)",
              boxShadow: "var(--shadow-xs)",
            }}
          >
            <div style={{ fontSize: 11, fontWeight: 700, color: "var(--primary)", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 4 }}>Scenario Brief</div>
            <div style={{ fontSize: 13, fontWeight: 700, color: "var(--primary-dark)", marginBottom: 2 }}>{a.label}</div>
            <div style={{ fontSize: 11.5, color: "var(--text2)", lineHeight: 1.4 }}>{a.desc}</div>
          </button>
        ))}
      </div>

      {/* ── Chat Console ── */}
      <div className="card" style={{ padding: 0, overflow: "hidden" }}>

        {/* Top bar */}
        <div style={{ padding: "12px 18px", background: "#fafcfd", borderBottom: "1px solid var(--border)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span className="card-title" style={{ margin: 0, fontSize: 13.5 }}>Executive Decision Console</span>
            <small className="muted" style={{ fontSize: 11 }}>FDRE Ministry of Industry</small>
          </div>
          <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
            <span className="badge muted">Restricted Access</span>
            {messages.length > 0 && (
              <button type="button" className="btn btn-outline btn-sm" onClick={() => setMessages([])}>
                Clear Session
              </button>
            )}
          </div>
        </div>

        {/* Messages */}
        <div ref={scrollRef} style={{ minHeight: 400, maxHeight: 520, overflowY: "auto", padding: "18px 20px", display: "flex", flexDirection: "column", gap: 14, background: "var(--bg)" }}>

          {/* Welcome */}
          {messages.length === 0 && (
            <div style={{ flex: 1, textAlign: "center", padding: "28px 20px", background: "var(--card)", borderRadius: "var(--radius)", border: "1px dashed var(--border)" }}>
              <div style={{ fontWeight: 800, fontSize: 16, color: "var(--primary-dark)", marginBottom: 6 }}>Ministerial Decision Support Console</div>
              <div style={{ fontSize: 13, color: "var(--text2)", maxWidth: 500, margin: "0 auto 18px", lineHeight: 1.6 }}>
                Select a scenario brief tile above or enter a policy directive to simulate investment suitability, evaluate infrastructure readiness, or generate executive briefs.
              </div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8, justifyContent: "center" }}>
                {[
                  "Which region has the best infrastructure for textile FDI?",
                  "Draft a policy on industrial park expansion",
                  "What is our import substitution potential?",
                ].map((s) => (
                  <button key={s} type="button" onClick={() => ask(s)} className="btn btn-outline btn-sm" style={{ borderRadius: 20, fontSize: 12 }}>
                    → {s}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Message History */}
          {messages.map((m, i) => (
            <div key={i} style={{ display: "flex", flexDirection: "column", alignItems: m.from === "user" ? "flex-end" : "flex-start", gap: 3 }}>
              <div style={{ fontSize: 10.5, color: "var(--text2)", fontWeight: 700, padding: m.from === "user" ? "0 4px 0 0" : "0 0 0 4px" }}>
                {m.from === "user" ? "Executive Directive" : "Executive Intelligence Briefing"}
              </div>

              {m.from === "user" ? (
                <div style={{ maxWidth: "70%", padding: "10px 15px", background: "var(--primary-dark)", color: "#fff", borderRadius: "14px 14px 3px 14px", fontSize: 13, lineHeight: 1.6, fontWeight: 500, boxShadow: "var(--shadow-xs)", wordBreak: "break-word" }}>
                  {m.text}
                </div>
              ) : (
                <div style={{ width: "100%", background: "var(--card)", border: "1px solid var(--border)", borderRadius: "3px 14px 14px 14px", padding: "16px 18px", boxShadow: "var(--shadow-xs)" }}>
                  {/* Header */}
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12, paddingBottom: 10, borderBottom: "1px solid var(--border)" }}>
                    <div>
                      <div style={{ fontSize: 12.5, fontWeight: 700, color: "var(--primary-dark)" }}>Executive Decision Memo</div>
                      <div style={{ fontSize: 10.5, color: "var(--text2)" }}>FDRE Ministry of Industry Analytics Unit</div>
                    </div>
                    <button type="button" className="btn btn-outline btn-sm" onClick={() => copyToClipboard(m.text)}>
                      Copy Memo
                    </button>
                  </div>

                  {/* Body */}
                  <div style={{ fontSize: 13.5, color: "var(--text)", lineHeight: 1.7, whiteSpace: "pre-wrap", wordBreak: "break-word" }}>
                    {m.text}
                  </div>

                  {/* KPIs */}
                  {m.payload?.kpis && (
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))", gap: 10, marginTop: 16, paddingTop: 14, borderTop: "1px solid var(--border)" }}>
                      {m.payload.kpis.map((k) => (
                        <div key={k.label} className="card" style={{ padding: "12px 14px", boxShadow: "var(--shadow-xs)" }}>
                          <div style={{ fontSize: 10.5, textTransform: "uppercase", letterSpacing: "0.06em", color: "var(--text2)", fontWeight: 700, marginBottom: 4 }}>{k.label}</div>
                          <div style={{ fontWeight: 700, fontSize: 18, color: "var(--primary)", fontFamily: "IBM Plex Mono, monospace" }}>{k.value}</div>
                          {k.trend && (
                            <span className={`delta ${k.trend.startsWith("+") ? "up" : "down"}`} style={{ marginTop: 5, display: "inline-flex" }}>
                              {k.trend}
                            </span>
                          )}
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Follow-ups */}
                  {m.suggestions?.length > 0 && (
                    <div style={{ marginTop: 12, paddingTop: 10, borderTop: "1px solid var(--border)", display: "flex", flexWrap: "wrap", gap: 6, alignItems: "center" }}>
                      <span style={{ fontSize: 10.5, color: "var(--text2)", fontWeight: 700 }}>Follow-up:</span>
                      {m.suggestions.map((s) => (
                        <button key={s} type="button" onClick={() => ask(s)} className="btn btn-outline btn-sm" style={{ borderRadius: 20, fontSize: 11.5, padding: "3px 10px" }}>
                          → {s}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}

          {/* Pending Indicator */}
          {pending && (
            <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start", gap: 3 }}>
              <div style={{ fontSize: 10.5, color: "var(--text2)", fontWeight: 700, paddingLeft: 4 }}>Executive Intelligence Briefing</div>
              <div style={{ display: "flex", alignItems: "center", gap: 6, padding: "10px 14px", background: "var(--card)", border: "1px solid var(--border)", borderRadius: "3px 12px 12px 12px", boxShadow: "var(--shadow-xs)" }}>
                <span style={{ fontSize: 11.5, color: "var(--text2)", fontStyle: "italic" }}>Evaluating spatial data &amp; compiling executive brief…</span>
              </div>
            </div>
          )}
        </div>

        {/* Input Bar */}
        <div style={{ padding: "10px 16px", borderTop: "1px solid var(--border)", background: "var(--card)", display: "flex", gap: 8, alignItems: "center" }}>
          <div style={{
            flex: 1, display: "flex", alignItems: "center",
            background: "var(--bg)",
            border: `1px solid ${focused ? "var(--primary)" : "var(--border)"}`,
            borderRadius: "var(--radius)",
            padding: "0 12px",
            transition: "border-color 0.15s",
            boxShadow: focused ? "0 0 0 3px rgba(15,23,42,0.06)" : "none",
          }}>
            <input
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && ask()}
              onFocus={() => setFocused(true)}
              onBlur={() => setFocused(false)}
              placeholder="Enter executive directive or policy question..."
              style={{ flex: 1, padding: "10px 0", background: "transparent", border: "none", outline: "none", fontSize: 13, color: "var(--text)", fontFamily: "inherit" }}
            />
          </div>
          <button
            type="button"
            className="btn btn-primary"
            onClick={() => ask()}
            disabled={pending || !input.trim()}
            style={{ height: 38, padding: "0 18px", fontSize: 12.5, fontWeight: 700 }}
          >
            {pending ? "Analyzing…" : "Generate Brief"}
          </button>
        </div>
      </div>
    </div>
  );
}
