import { useState, useRef, useEffect, useCallback } from "react";
import { api } from "../../api/client.js";
import { useSnackbar } from "../../context/SnackbarContext.jsx";
import MarkdownMessage from "../../components/chat/MarkdownMessage.jsx";

const QUICK_ACTIONS = [
  { label: "National Policy Memo", desc: "Executive policy brief on sector growth & targets", query: "Generate official executive policy brief for the Minister of Industry on manufacturing sector growth" },
  { label: "FDI Site Selection", desc: "Optimal location model for $50M investment", query: "Recommend optimal investment site for a $50M foreign direct investment in textile manufacturing" },
  { label: "Import Substitution", desc: "Forex savings model for chemical & food", query: "Simulate import substitution forex savings for industrial chemicals and food processing sectors" },
  { label: "Infrastructure Bottlenecks", desc: "Energy & transport corridor readiness audit", query: "Analyze energy grid and logistics bottlenecks in Oromia and Amhara for industrial development" },
];

const MINISTER_SESSIONS_KEY = "moi_minister_sessions_v2";

function formatSessionDate(timestamp) {
  if (!timestamp) return "Recent";
  const date = new Date(timestamp);
  const now = new Date();
  const diffDays = Math.floor((now - date) / (1000 * 60 * 60 * 24));
  if (diffDays === 0) return "Today";
  if (diffDays === 1) return "Yesterday";
  if (diffDays < 7) return `${diffDays} days ago`;
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

export default function MinisterChatPage() {
  const createNewSessionObj = () => ({
    id: `EXEC-${Date.now().toString(36).toUpperCase()}`,
    title: "New Decision Brief",
    createdAt: Date.now(),
    messages: [],
  });

  const loadInitialSessions = useCallback(() => {
    try {
      const raw = localStorage.getItem(MINISTER_SESSIONS_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {
      /* ignore */
    }
    return [createNewSessionObj()];
  }, []);

  const [sessions, setSessions] = useState(loadInitialSessions);
  const [activeSessionId, setActiveSessionId] = useState(() => sessions[0]?.id || "");
  const [showHistorySidebar, setShowHistorySidebar] = useState(true);

  const [input, setInput] = useState("");
  const [pending, setPending] = useState(false);
  const [focused, setFocused] = useState(false);
  const [copiedIdx, setCopiedIdx] = useState(null);
  const scrollRef = useRef(null);
  const inputRef = useRef(null);
  const { notify } = useSnackbar();

  const activeSession = sessions.find((s) => s.id === activeSessionId) || sessions[0] || createNewSessionObj();
  const messages = activeSession.messages || [];

  /* Persist sessions to localStorage */
  useEffect(() => {
    try {
      localStorage.setItem(MINISTER_SESSIONS_KEY, JSON.stringify(sessions));
    } catch {
      /* ignore */
    }
  }, [sessions]);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, pending]);

  function handleNewSession() {
    if (activeSession && activeSession.messages.length === 0) {
      inputRef.current?.focus();
      return;
    }
    const newSession = createNewSessionObj();
    setSessions((prev) => [newSession, ...prev]);
    setActiveSessionId(newSession.id);
    setInput("");
    notify("Started new executive decision session", "info");
    setTimeout(() => inputRef.current?.focus(), 80);
  }

  function handleDeleteSession(sessionId, e) {
    e?.stopPropagation();
    setSessions((prev) => {
      const filtered = prev.filter((s) => s.id !== sessionId);
      if (filtered.length === 0) {
        const fresh = createNewSessionObj();
        setActiveSessionId(fresh.id);
        return [fresh];
      }
      if (activeSessionId === sessionId) {
        setActiveSessionId(filtered[0].id);
      }
      return filtered;
    });
    notify("Briefing session deleted", "info");
  }

  function handleClearAllSessions() {
    const fresh = createNewSessionObj();
    setSessions([fresh]);
    setActiveSessionId(fresh.id);
    localStorage.removeItem(MINISTER_SESSIONS_KEY);
    notify("All decision history cleared", "info");
  }

  async function ask(queryText) {
    const text = (queryText || input || "").trim();
    if (!text || pending) return;

    const isFirstMessage = messages.length === 0;
    const newTitle = isFirstMessage ? (text.length > 34 ? text.slice(0, 34) + "…" : text) : activeSession.title;
    const userMsg = { from: "user", text };

    setSessions((prev) =>
      prev.map((s) => {
        if (s.id === activeSession.id) {
          return {
            ...s,
            title: isFirstMessage ? newTitle : s.title,
            messages: [...s.messages, userMsg],
          };
        }
        return s;
      })
    );

    setInput("");
    setPending(true);

    try {
      const res = await api.post("/chat/minister", { question: text });
      const ministerMsg = { from: "minister_ai", text: res.text, payload: res.payload, suggestions: res.suggestions };

      setSessions((prev) =>
        prev.map((s) => {
          if (s.id === activeSession.id) {
            return {
              ...s,
              messages: [...s.messages, ministerMsg],
            };
          }
          return s;
        })
      );
    } catch (err) {
      const errorMsg = { from: "minister_ai", text: err.message || "Failed to reach decision support service." };
      setSessions((prev) =>
        prev.map((s) => {
          if (s.id === activeSession.id) {
            return {
              ...s,
              messages: [...s.messages, errorMsg],
            };
          }
          return s;
        })
      );
    } finally {
      setPending(false);
      setTimeout(() => inputRef.current?.focus(), 80);
    }
  }

  function handleCopyMemo(text, idx) {
    navigator.clipboard.writeText(text);
    setCopiedIdx(idx);
    notify("Executive memo copied to clipboard", "success");
    setTimeout(() => setCopiedIdx(null), 2000);
  }

  const now = new Date().toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>

      {/* ── Executive Masthead ── */}
      <div style={{
        background: "linear-gradient(135deg, var(--primary-dark) 0%, #0d2b3f 60%, var(--primary-dark) 100%)",
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
            {activeSession.id} · {now}
          </div>
        </div>
      </div>

      {/* ── Quick Action Scenario Tiles ── */}
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

      {/* ── Main Chat Workspace with ChatGPT-style History Sidebar ── */}
      <div style={{ display: "flex", height: 600, background: "var(--card)", borderRadius: "var(--radius)", border: "1px solid var(--border)", overflow: "hidden", boxShadow: "var(--shadow-xs)" }}>

        {/* ── Left History Sidebar ── */}
        {showHistorySidebar && (
          <div style={{
            width: 250,
            flexShrink: 0,
            background: "#0f172a",
            color: "#fff",
            display: "flex",
            flexDirection: "column",
            borderRight: "1px solid rgba(255,255,255,0.08)",
          }}>
            <div style={{ padding: "14px 12px 10px" }}>
              <button
                type="button"
                onClick={handleNewSession}
                style={{
                  width: "100%",
                  padding: "10px 14px",
                  borderRadius: 10,
                  background: "linear-gradient(135deg, #0284c7 0%, #075985 100%)",
                  color: "#fff",
                  border: "1px solid rgba(255,255,255,0.15)",
                  fontWeight: 700,
                  fontSize: 13,
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 8,
                  boxShadow: "0 2px 6px rgba(0,0,0,0.2)",
                  transition: "all 0.15s ease",
                }}
              >
                <span style={{ fontSize: 16, lineHeight: 1 }}>+</span>
                <span>New Briefing</span>
              </button>
            </div>

            <div style={{ flex: 1, overflowY: "auto", padding: "0 8px 12px", display: "flex", flexDirection: "column", gap: 4 }}>
              <div style={{ padding: "8px 8px 4px", fontSize: 10.5, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em", color: "#64748b" }}>
                Saved Briefings
              </div>

              {sessions
              .filter((session) => session.id === activeSession.id || (session.messages && session.messages.length > 0))
              .map((session) => {
                const isActive = session.id === activeSession.id;
                return (
                  <div
                    key={session.id}
                    onClick={() => setActiveSessionId(session.id)}
                    style={{
                      padding: "9.5px 10px",
                      borderRadius: 8,
                      background: isActive ? "rgba(255,255,255,0.12)" : "transparent",
                      color: isActive ? "#ffffff" : "#cbd5e1",
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      gap: 8,
                      fontSize: 12.5,
                      fontWeight: isActive ? 700 : 500,
                      transition: "all 0.15s ease",
                      borderLeft: isActive ? "3px solid #f4b41a" : "3px solid transparent",
                    }}
                    onMouseEnter={(e) => {
                      if (!isActive) e.currentTarget.style.background = "rgba(255,255,255,0.06)";
                    }}
                    onMouseLeave={(e) => {
                      if (!isActive) e.currentTarget.style.background = "transparent";
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: 8, overflow: "hidden", flex: 1 }}>
                      <span style={{ fontSize: 13, opacity: 0.8, flexShrink: 0 }}>📜</span>
                      <div style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                        {session.title || "New Briefing"}
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={(e) => handleDeleteSession(session.id, e)}
                      title="Delete briefing"
                      style={{
                        background: "none",
                        border: "none",
                        color: "#94a3b8",
                        cursor: "pointer",
                        fontSize: 12,
                        padding: "2px 4px",
                        borderRadius: 4,
                        opacity: isActive ? 1 : 0.6,
                        transition: "opacity 0.15s",
                      }}
                    >
                      🗑
                    </button>
                  </div>
                );
              })}
            </div>

            <div style={{ padding: "10px 12px", borderTop: "1px solid rgba(255,255,255,0.08)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ fontSize: 11, color: "#64748b" }}>{sessions.length} saved briefing{sessions.length === 1 ? "" : "s"}</span>
              <button
                type="button"
                onClick={handleClearAllSessions}
                style={{ background: "none", border: "none", color: "#f43f5e", fontSize: 11.5, fontWeight: 600, cursor: "pointer", padding: "2px 6px" }}
              >
                Clear All
              </button>
            </div>
          </div>
        )}

        {/* ── Main Chat Area ── */}
        <div style={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0 }}>
          {/* Top Bar */}
          <div style={{ padding: "12px 18px", background: "#fafcfd", borderBottom: "1px solid var(--border)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <button
                type="button"
                onClick={() => setShowHistorySidebar((v) => !v)}
                title={showHistorySidebar ? "Hide Briefing History" : "Show Briefing History"}
                className="btn btn-outline btn-sm"
                style={{ padding: "4px 8px", fontSize: 12 }}
              >
                {showHistorySidebar ? "◀ History" : "▶ History"}
              </button>
              <div>
                <div style={{ fontWeight: 800, fontSize: 13.5, color: "var(--primary-dark)" }}>
                  {activeSession.title || "Executive Decision Console"}
                </div>
                <div style={{ fontSize: 11, color: "var(--text2)" }}>
                  {formatSessionDate(activeSession.createdAt)} · {messages.length} message{messages.length === 1 ? "" : "s"}
                </div>
              </div>
            </div>
            <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
              <span className="badge muted">Restricted Access</span>
              <button type="button" className="btn btn-outline btn-sm" onClick={handleNewSession}>
                + New Briefing
              </button>
            </div>
          </div>

          {/* Messages */}
          <div ref={scrollRef} style={{ flex: 1, overflowY: "auto", padding: "20px 22px", display: "flex", flexDirection: "column", gap: 16, background: "var(--bg)" }}>

            {messages.length === 0 && (
              <div style={{ flex: 1, textAlign: "center", padding: "32px 20px", background: "var(--card)", borderRadius: "var(--radius)", border: "1px dashed var(--border)" }}>
                <div style={{ fontWeight: 800, fontSize: 16, color: "var(--primary-dark)", marginBottom: 6 }}>Ministerial Decision Support Console</div>
                <div style={{ fontSize: 13, color: "var(--text2)", maxWidth: 520, margin: "0 auto 18px", lineHeight: 1.6 }}>
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

            {messages.map((m, i) => (
              <div key={i} style={{ display: "flex", flexDirection: "column", alignItems: m.from === "user" ? "flex-end" : "flex-start", gap: 4 }}>
                <div style={{ fontSize: 10.5, color: "var(--text2)", fontWeight: 700, padding: m.from === "user" ? "0 4px 0 0" : "0 0 0 4px" }}>
                  {m.from === "user" ? "Executive Directive" : "Executive Intelligence Briefing"}
                </div>

                {m.from === "user" ? (
                  <div style={{ maxWidth: "72%", padding: "11px 16px", background: "var(--primary-dark)", color: "#fff", borderRadius: "14px 14px 3px 14px", fontSize: 13, lineHeight: 1.6, fontWeight: 500, boxShadow: "var(--shadow-xs)", wordBreak: "break-word" }}>
                    {m.text}
                  </div>
                ) : (
                  <div style={{ width: "100%", background: "var(--card)", border: "1px solid var(--border)", borderRadius: "3px 14px 14px 14px", padding: "18px 20px", boxShadow: "var(--shadow-xs)" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12, paddingBottom: 10, borderBottom: "1px solid var(--border)" }}>
                      <div>
                        <div style={{ fontSize: 12.5, fontWeight: 700, color: "var(--primary-dark)" }}>Executive Decision Memo</div>
                        <div style={{ fontSize: 10.5, color: "var(--text2)" }}>FDRE Ministry of Industry Analytics Unit</div>
                      </div>
                      <button type="button" className="btn btn-outline btn-sm" onClick={() => handleCopyMemo(m.text, i)}>
                        {copiedIdx === i ? "✓ Copied" : "Copy Memo"}
                      </button>
                    </div>

                    <MarkdownMessage text={m.text} />

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

                    {m.suggestions?.length > 0 && (
                      <div style={{ marginTop: 14, paddingTop: 10, borderTop: "1px solid var(--border)", display: "flex", flexWrap: "wrap", gap: 6, alignItems: "center" }}>
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

            {pending && (
              <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start", gap: 4 }}>
                <div style={{ fontSize: 10.5, color: "var(--text2)", fontWeight: 700, paddingLeft: 4 }}>Executive Intelligence Briefing</div>
                <div style={{ display: "flex", alignItems: "center", gap: 6, padding: "12px 16px", background: "var(--card)", border: "1px solid var(--border)", borderRadius: "3px 12px 12px 12px", boxShadow: "var(--shadow-xs)" }}>
                  <span style={{ fontSize: 12, color: "var(--text2)", fontStyle: "italic" }}>Evaluating spatial data &amp; compiling executive brief…</span>
                </div>
              </div>
            )}
          </div>

          {/* Input Bar */}
          <div style={{ padding: "12px 18px", borderTop: "1px solid var(--border)", background: "var(--card)", display: "flex", gap: 8, alignItems: "center" }}>
            <div style={{
              flex: 1, display: "flex", alignItems: "center",
              background: "var(--bg)",
              border: `1px solid ${focused ? "var(--primary)" : "var(--border)"}`,
              borderRadius: "var(--radius)",
              padding: "0 14px",
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
                style={{ flex: 1, padding: "11px 0", background: "transparent", border: "none", outline: "none", fontSize: 13, color: "var(--text)", fontFamily: "inherit" }}
              />
            </div>
            <button
              type="button"
              className="btn btn-primary"
              onClick={() => ask()}
              disabled={pending || !input.trim()}
              style={{ height: 40, padding: "0 20px", fontSize: 12.5, fontWeight: 700 }}
            >
              {pending ? "Analyzing…" : "Generate Brief"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
