import { useEffect, useRef, useState, useCallback } from "react";
import { Link } from "react-router-dom";
import { api } from "../../api/client.js";
import MarkdownMessage from "./MarkdownMessage.jsx";

const SUGGESTIONS = [
  { text: "List textile companies in Oromia" },
  { text: "How many food enterprises are registered?" },
  { text: "Which sector should Dire Dawa invest in?" },
  { text: "Where are the industrial parks located?" },
  { text: "Who holds active export permits?" },
  { text: "Tell me about Bole Lemi Garments PLC" },
];

const SESSIONS_STORAGE_KEY = "moi_chat_sessions_v2";

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

function EnterpriseChips({ items }) {
  if (!items.length)
    return <div className="muted" style={{ fontStyle: "italic", fontSize: 12.5, padding: "8px 0" }}>No matching enterprises found.</div>;
  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(210px, 1fr))", gap: 8, marginTop: 10 }}>
      {items.map((e) => (
        <Link key={e.id} to={`/site/${e.slug}`} style={{ padding: "11px 13px", background: "var(--card)", borderRadius: "var(--radius)", border: "1px solid var(--border)", textDecoration: "none", color: "inherit", display: "block", boxShadow: "var(--shadow-xs)", transition: "all 0.15s ease" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 6 }}>
            <span style={{ fontSize: 11, fontWeight: 700, color: "var(--primary)" }}>{e.sector}</span>
            <span className="badge info">View Site ↗</span>
          </div>
          <div style={{ fontWeight: 700, fontSize: 13, color: "var(--primary-dark)", lineHeight: 1.3 }}>{e.name}</div>
          <div style={{ fontSize: 11, color: "var(--text2)", marginTop: 4 }}>📍 {e.region} · {e.size}</div>
        </Link>
      ))}
    </div>
  );
}

function RecommendationCards({ items }) {
  if (!items.length) return null;
  return (
    <div style={{ display: "grid", gap: 7, marginTop: 10 }}>
      {items.map((r, idx) => (
        <div key={r.sector} style={{ padding: "10px 13px", background: "#f8fafc", borderRadius: "var(--radius)", border: "1px solid #cbd5e1", display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ width: 24, height: 24, borderRadius: 6, background: "var(--primary-dark)", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontWeight: 700, fontSize: 11, flexShrink: 0 }}>{idx + 1}</div>
          <div>
            <div style={{ fontWeight: 700, fontSize: 12.5, color: "var(--primary-dark)" }}>{r.sector}</div>
            <div style={{ fontSize: 11, color: "var(--text2)", marginTop: 1 }}>{r.existing} registered enterprises · {r.infrastructure} supporting infra assets</div>
          </div>
        </div>
      ))}
    </div>
  );
}

function InfrastructureList({ items }) {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(210px, 1fr))", gap: 8, marginTop: 10 }}>
      {items.map((i) => (
        <div key={i.id} style={{ padding: "11px 13px", background: "#f8fafc", borderRadius: "var(--radius)", border: "1px solid #cbd5e1" }}>
          <div style={{ fontWeight: 700, fontSize: 12.5, color: "var(--primary-dark)", lineHeight: 1.3 }}>{i.name}</div>
          <div style={{ fontSize: 11, color: "var(--text2)", margin: "2px 0 5px" }}>{i.categoryLabel} · {i.region}</div>
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, fontWeight: 700 }}>
            <span style={{ color: "var(--success)" }}>● {i.status}</span>
            <span className="muted">{i.capacity}</span>
          </div>
        </div>
      ))}
    </div>
  );
}

function CertificateList({ items }) {
  return (
    <div style={{ display: "grid", gap: 7, marginTop: 10 }}>
      {items.map((cert) => (
        <div key={cert.enterprise} style={{ padding: "10px 13px", background: "#f8fafc", borderRadius: "var(--radius)", border: "1px solid #cbd5e1", display: "flex", gap: 10, alignItems: "center" }}>
          <div>
            <div style={{ fontWeight: 700, fontSize: 12.5, color: "var(--primary-dark)" }}>{cert.enterprise}</div>
            <div style={{ fontSize: 11, color: "var(--text2)", marginTop: 1 }}>{cert.certificates.map((x) => x.templateName).join(" · ")}</div>
          </div>
        </div>
      ))}
    </div>
  );
}

function SingleEnterprise({ item }) {
  if (!item) return null;
  return (
    <Link to={`/site/${item.slug}`} style={{ display: "flex", alignItems: "center", gap: 12, padding: "11px 13px", background: "#f0f9ff", borderRadius: "var(--radius)", border: "1px solid #bae6fd", textDecoration: "none", color: "inherit", marginTop: 10 }}>
      <div style={{ flex: 1 }}>
        <div style={{ fontWeight: 700, fontSize: 13, color: "var(--primary-dark)" }}>{item.name}</div>
        <div style={{ fontSize: 11.5, color: "var(--text2)" }}>{item.sector} · {item.region} · {item.employees} employees</div>
      </div>
      <span className="badge info">View Profile ↗</span>
    </Link>
  );
}

function CountCard({ count }) {
  return (
    <div style={{ display: "inline-flex", alignItems: "center", gap: 12, padding: "10px 16px", background: "var(--primary-dark)", color: "#fff", borderRadius: "var(--radius)", marginTop: 10 }}>
      <div>
        <div style={{ fontWeight: 800, fontSize: 20, fontFamily: "IBM Plex Mono, monospace" }}>{count}</div>
        <div style={{ fontSize: 11, color: "rgba(255,255,255,0.7)" }}>enterprises matching query</div>
      </div>
    </div>
  );
}

function renderPayload(payload) {
  if (!payload) return null;
  switch (payload.type) {
    case "enterprises": return <EnterpriseChips items={payload.items} />;
    case "recommendations": return <RecommendationCards items={payload.recommendations} />;
    case "infrastructure": return <InfrastructureList items={payload.items} />;
    case "certificates": return <CertificateList items={payload.items} />;
    case "enterprise": return <SingleEnterprise item={payload.item} />;
    case "counts": return <CountCard count={payload.count} />;
    default: return null;
  }
}

function TypingDots() {
  return (
    <>
      <style>{`
        @keyframes chatBounce {
          0%, 60%, 100% { transform: translateY(0); opacity: 0.35; }
          30% { transform: translateY(-4px); opacity: 1; }
        }
      `}</style>
      <div style={{ display: "flex", alignItems: "center", gap: 6, padding: "10px 14px", background: "var(--card)", border: "1px solid var(--border)", borderRadius: "3px 12px 12px 12px", width: "fit-content" }}>
        {[0, 1, 2].map((i) => (
          <span key={i} style={{ display: "inline-block", width: 6, height: 6, borderRadius: "50%", background: "var(--primary-dark)", animation: `chatBounce 1.3s ease ${i * 0.18}s infinite` }} />
        ))}
        <span style={{ fontSize: 11.5, color: "var(--text2)", fontStyle: "italic", marginLeft: 4 }}>Processing intelligence query…</span>
      </div>
    </>
  );
}

export default function ChatPanel({ endpoint = "/chat", context, compact, storageKey = "ai_assistant" }) {
  const storeKey = `${SESSIONS_STORAGE_KEY}_${storageKey}`;

  // Helper to create a new session object
  const createNewSessionObj = () => ({
    id: `session_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
    title: "New Chat",
    createdAt: Date.now(),
    messages: [],
  });

  // Load initial sessions from localStorage
  const loadInitialSessions = useCallback(() => {
    try {
      const raw = localStorage.getItem(storeKey);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {
      /* ignore */
    }
    return [createNewSessionObj()];
  }, [storeKey]);

  const [sessions, setSessions] = useState(loadInitialSessions);
  const [activeSessionId, setActiveSessionId] = useState(() => sessions[0]?.id || "");
  const [showHistorySidebar, setShowHistorySidebar] = useState(!compact);

  const [input, setInput] = useState("");
  const [pending, setPending] = useState(false);
  const [suggestions, setSuggestions] = useState(SUGGESTIONS);
  const [focused, setFocused] = useState(false);
  const [copiedIdx, setCopiedIdx] = useState(null);
  const scrollRef = useRef(null);
  const inputRef = useRef(null);

  // Active session object
  const activeSession = sessions.find((s) => s.id === activeSessionId) || sessions[0] || createNewSessionObj();
  const messages = activeSession.messages || [];

  // Persist sessions whenever sessions array changes
  useEffect(() => {
    try {
      localStorage.setItem(storeKey, JSON.stringify(sessions));
    } catch {
      /* ignore */
    }
  }, [sessions, storeKey]);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, pending]);

  // Handle "+ New Chat" action
  function handleNewChat() {
    if (activeSession && activeSession.messages.length === 0) {
      inputRef.current?.focus();
      return;
    }
    const newSession = createNewSessionObj();
    setSessions((prev) => [newSession, ...prev]);
    setActiveSessionId(newSession.id);
    setInput("");
    setTimeout(() => inputRef.current?.focus(), 80);
  }

  // Delete a specific session
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
  }

  // Clear all chat history
  function handleClearAllSessions() {
    const fresh = createNewSessionObj();
    setSessions([fresh]);
    setActiveSessionId(fresh.id);
    localStorage.removeItem(storeKey);
  }

  function handleCopy(text, idx) {
    navigator.clipboard.writeText(text);
    setCopiedIdx(idx);
    setTimeout(() => setCopiedIdx(null), 2000);
  }

  async function ask(question) {
    const text = (question || input || "").trim();
    if (!text || pending) return;

    const isFirstMessage = messages.length === 0;
    const newTitle = isFirstMessage ? (text.length > 34 ? text.slice(0, 34) + "…" : text) : activeSession.title;

    const userMsg = { from: "user", text };

    // Update active session locally
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
      const res = await api.post(endpoint, { question: text, context: context || undefined });
      const assistantMsg = { from: "assistant", text: res.text, payload: res.payload, suggestions: res.suggestions };

      setSessions((prev) =>
        prev.map((s) => {
          if (s.id === activeSession.id) {
            return {
              ...s,
              messages: [...s.messages, assistantMsg],
            };
          }
          return s;
        })
      );

      if (res.suggestions?.length) setSuggestions(res.suggestions.map((sg) => ({ text: sg })));
    } catch (err) {
      const errorMsg = { from: "assistant", text: err.message || "Something went wrong. Please try again." };
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

  const isEmpty = messages.length === 0;

  return (
    <div style={{ display: "flex", height: compact ? 460 : 620, background: "var(--bg)", borderRadius: "var(--radius)", border: "1px solid var(--border)", overflow: "hidden", boxShadow: "var(--shadow-xs)" }}>

      {/* ── ChatGPT-style Left Sessions Sidebar ── */}
      {showHistorySidebar && (
        <div style={{
          width: 240,
          flexShrink: 0,
          background: "#0f172a",
          color: "#fff",
          display: "flex",
          flexDirection: "column",
          borderRight: "1px solid rgba(255,255,255,0.08)",
        }}>
          {/* Top New Chat Button */}
          <div style={{ padding: "14px 12px 10px" }}>
            <button
              type="button"
              onClick={handleNewChat}
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
              <span>New Chat</span>
            </button>
          </div>

          {/* History List */}
          <div style={{ flex: 1, overflowY: "auto", padding: "0 8px 12px", display: "flex", flexDirection: "column", gap: 4 }}>
            <div style={{ padding: "8px 8px 4px", fontSize: 10.5, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em", color: "#64748b" }}>
              Chat History
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
                    padding: "9px 10px",
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
                    borderLeft: isActive ? "3px solid #38bdf8" : "3px solid transparent",
                  }}
                  onMouseEnter={(e) => {
                    if (!isActive) e.currentTarget.style.background = "rgba(255,255,255,0.06)";
                  }}
                  onMouseLeave={(e) => {
                    if (!isActive) e.currentTarget.style.background = "transparent";
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: 8, overflow: "hidden", flex: 1 }}>
                    <span style={{ fontSize: 13, opacity: 0.8, flexShrink: 0 }}>💬</span>
                    <div style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                      {session.title || "New Chat"}
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={(e) => handleDeleteSession(session.id, e)}
                    title="Delete conversation"
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

          {/* Footer: Clear All */}
          <div style={{ padding: "10px 12px", borderTop: "1px solid rgba(255,255,255,0.08)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ fontSize: 11, color: "#64748b" }}>{sessions.length} saved thread{sessions.length === 1 ? "" : "s"}</span>
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
      <div style={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0, background: "var(--card)" }}>

        {/* Console Header Bar */}
        <div style={{ padding: "12px 18px", borderBottom: "1px solid var(--border)", background: "#fafcfd", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <button
              type="button"
              onClick={() => setShowHistorySidebar((v) => !v)}
              title={showHistorySidebar ? "Hide Chat History" : "Show Chat History"}
              className="btn btn-outline btn-sm"
              style={{ padding: "4px 8px", fontSize: 12 }}
            >
              {showHistorySidebar ? "◀ History" : "▶ History"}
            </button>
            <div>
              <div style={{ fontWeight: 800, fontSize: 13.5, color: "var(--primary-dark)" }}>
                {activeSession.title || "Industrial Intelligence Console"}
              </div>
              <div style={{ fontSize: 11, color: "var(--text2)" }}>
                {formatSessionDate(activeSession.createdAt)} · {messages.length} message{messages.length === 1 ? "" : "s"}
              </div>
            </div>
          </div>
          <button type="button" className="btn btn-outline btn-sm" onClick={handleNewChat}>
            + New Chat
          </button>
        </div>

        {/* ── Messages Container ── */}
        <div ref={scrollRef} style={{ flex: 1, overflowY: "auto", padding: isEmpty ? 0 : "20px 22px 12px", display: "flex", flexDirection: "column", gap: 16, background: "var(--bg)" }}>

          {/* Welcome State */}
          {isEmpty && (
            <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "32px 24px", textAlign: "center" }}>
              <div style={{ width: 44, height: 44, borderRadius: 12, background: "#f0f9ff", border: "1px solid #bae6fd", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, marginBottom: 12 }}>
                🤖
              </div>
              <div style={{ fontWeight: 800, fontSize: 17, color: "var(--primary-dark)", marginBottom: 6, letterSpacing: "-0.01em" }}>
                Industrial Intelligence Assistant
              </div>
              <div style={{ fontSize: 13, color: "var(--text2)", maxWidth: 480, lineHeight: 1.6, marginBottom: 24 }}>
                Query real-time data across 12,480+ registered enterprises, regional infrastructure, active permits, and market opportunities.
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 9, width: "100%", maxWidth: 660 }}>
                {suggestions.map((s) => (
                  <button key={s.text} type="button" onClick={() => ask(s.text)}
                    style={{ padding: "11px 15px", background: "var(--card)", border: "1px solid var(--border)", borderRadius: "var(--radius)", textAlign: "left", fontSize: 12.5, color: "var(--text)", cursor: "pointer", fontWeight: 600, display: "flex", alignItems: "center", justifyContent: "space-between", boxShadow: "var(--shadow-xs)", transition: "all 0.15s ease" }}>
                    <span style={{ lineHeight: 1.4 }}>{s.text}</span>
                    <span style={{ fontSize: 11, color: "var(--text2)", marginLeft: 6 }}>→</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Conversation Bubbles */}
          {messages.map((m, i) => (
            <div key={i} style={{ display: "flex", flexDirection: "column", alignItems: m.from === "user" ? "flex-end" : "flex-start", gap: 4 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 10.5, color: "var(--text2)", fontWeight: 700, padding: m.from === "user" ? "0 4px 0 0" : "0 0 0 4px" }}>
                <span>{m.from === "user" ? "User Query" : "AI Intelligence Engine"}</span>
                {m.from === "assistant" && (
                  <button
                    type="button"
                    onClick={() => handleCopy(m.text, i)}
                    style={{ background: "none", border: "none", cursor: "pointer", fontSize: 10, color: "var(--primary)", fontWeight: 600, padding: 0 }}
                  >
                    {copiedIdx === i ? "✓ Copied" : "Copy"}
                  </button>
                )}
              </div>

              <div style={{ maxWidth: m.from === "user" ? "75%" : "100%", width: m.from === "assistant" ? "100%" : "auto" }}>
                {m.from === "user" ? (
                  <div style={{ padding: "11px 16px", background: "var(--primary-dark)", color: "#fff", borderRadius: "14px 14px 3px 14px", fontSize: 13, lineHeight: 1.6, fontWeight: 500, boxShadow: "var(--shadow-xs)", wordBreak: "break-word" }}>
                    {m.text}
                  </div>
                ) : (
                  <div style={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: "3px 14px 14px 14px", padding: "16px 18px", boxShadow: "var(--shadow-xs)", width: "100%", boxSizing: "border-box" }}>
                    <MarkdownMessage text={m.text} />
                    {m.payload && <div style={{ marginTop: 8 }}>{renderPayload(m.payload)}</div>}
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
            </div>
          ))}

          {pending && (
            <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start", gap: 4 }}>
              <div style={{ fontSize: 10.5, color: "var(--text2)", fontWeight: 700, paddingLeft: 4 }}>AI Intelligence Engine</div>
              <TypingDots />
            </div>
          )}
        </div>

        {/* ── Input Bar ── */}
        <div style={{ padding: "12px 16px", borderTop: "1px solid var(--border)", background: "var(--card)", display: "flex", gap: 8, alignItems: "center" }}>
          <div style={{ flex: 1, display: "flex", alignItems: "center", background: "var(--bg)", border: `1px solid ${focused ? "var(--primary)" : "var(--border)"}`, borderRadius: "var(--radius)", padding: "0 14px", transition: "border-color 0.15s", boxShadow: focused ? "0 0 0 3px rgba(15,23,42,0.06)" : "none" }}>
            <input
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && ask()}
              onFocus={() => setFocused(true)}
              onBlur={() => setFocused(false)}
              placeholder="Type a natural language query on enterprises, infrastructure, or market fit..."
              style={{ flex: 1, padding: "11px 0", background: "transparent", border: "none", outline: "none", fontSize: 13, color: "var(--text)", fontFamily: "inherit" }}
            />
          </div>
          <button type="button" className="btn btn-primary" onClick={() => ask()} disabled={pending || !input.trim()} style={{ padding: "0 20px", height: 40, fontWeight: 700, fontSize: 12.5 }}>
            Submit
          </button>
        </div>
      </div>
    </div>
  );
}
