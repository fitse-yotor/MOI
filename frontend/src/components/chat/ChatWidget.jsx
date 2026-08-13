import { useState, useRef, useEffect } from "react";
import { api } from "../../api/client.js";
import MarkdownMessage from "./MarkdownMessage.jsx";

const QUICK_SUGGESTIONS = [
  "What products does this company manufacture?",
  "What verified certificates & permits does it hold?",
  "Is this enterprise currently exporting?",
  "How can I contact sales or visit the factory?",
];

export default function ChatWidget({ context, enterpriseName }) {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [pending, setPending] = useState(false);
  const [focused, setFocused] = useState(false);
  const scrollRef = useRef(null);
  const inputRef = useRef(null);

  const slug = context?.enterpriseSlug;

  useEffect(() => {
    if (open) {
      scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
      setTimeout(() => inputRef.current?.focus(), 150);
    }
  }, [open, messages, pending]);

  async function ask(questionText) {
    const text = (questionText || input || "").trim();
    if (!text || pending) return;

    setMessages((m) => [...m, { from: "user", text }]);
    setInput("");
    setPending(true);

    try {
      const res = await api.post("/public/chat", { question: text, context: { enterpriseSlug: slug } });
      setMessages((m) => [...m, { from: "ai", text: res.text }]);
    } catch {
      setMessages((m) => [...m, { from: "ai", text: "Unable to connect to Industry Assistant. Please try again." }]);
    } finally {
      setPending(false);
    }
  }

  return (
    <>
      {/* ── Floating Chat Popup Card ── */}
      {open && (
        <div
          style={{
            position: "fixed",
            bottom: 88,
            right: 24,
            width: 380,
            maxWidth: "calc(100vw - 32px)",
            height: 520,
            maxHeight: "calc(100vh - 120px)",
            background: "#ffffff",
            borderRadius: 16,
            boxShadow: "0 20px 40px -10px rgba(15, 23, 42, 0.25), 0 0 0 1px rgba(15, 23, 42, 0.08)",
            display: "flex",
            flexDirection: "column",
            zIndex: 9999,
            overflow: "hidden",
            animation: "floatChatIn 0.25s cubic-bezier(0.16, 1, 0.3, 1)",
          }}
        >
          {/* Header */}
          <div
            style={{
              background: "linear-gradient(135deg, #0f172a 0%, #1e293b 100%)",
              color: "#ffffff",
              padding: "14px 18px",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: 10,
                  background: "rgba(255, 255, 255, 0.12)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 16,
                }}
              >
                🤖
              </div>
              <div>
                <div style={{ fontSize: 13, fontWeight: 700, letterSpacing: "-0.01em" }}>
                  {enterpriseName ? `${enterpriseName} Assistant` : "Industry Assistant"}
                </div>
                <div style={{ fontSize: 11, color: "#94a3b8", display: "flex", alignItems: "center", gap: 5 }}>
                  <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#22c55e", display: "inline-block" }} />
                  Online · Official AI
                </div>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setOpen(false)}
              style={{
                background: "rgba(255, 255, 255, 0.1)",
                border: "none",
                color: "#cbd5e1",
                width: 28,
                height: 28,
                borderRadius: "50%",
                fontSize: 16,
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                transition: "all 0.15s",
              }}
            >
              ✕
            </button>
          </div>

          {/* Messages */}
          <div
            ref={scrollRef}
            style={{
              flex: 1,
              overflowY: "auto",
              padding: "16px",
              display: "flex",
              flexDirection: "column",
              gap: 12,
              background: "#f8fafc",
            }}
          >
            {messages.length === 0 && (
              <div style={{ textAlign: "center", padding: "16px 8px" }}>
                <div style={{ fontSize: 12.5, color: "#64748b", marginBottom: 14, lineHeight: 1.5 }}>
                  Ask any question about this enterprise&apos;s products, location, verified permits, or operations.
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                  {QUICK_SUGGESTIONS.map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => ask(s)}
                      style={{
                        padding: "8px 12px",
                        background: "#ffffff",
                        border: "1px solid #e2e8f0",
                        borderRadius: 10,
                        fontSize: 12,
                        textAlign: "left",
                        color: "#334155",
                        cursor: "pointer",
                        fontWeight: 600,
                        boxShadow: "0 1px 2px rgba(0, 0, 0, 0.04)",
                        transition: "all 0.15s",
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      <span>{s}</span>
                      <span style={{ color: "#94a3b8", fontSize: 11 }}>→</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {messages.map((m, idx) => (
              <div
                key={idx}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: m.from === "user" ? "flex-end" : "flex-start",
                  gap: 3,
                }}
              >
                <span style={{ fontSize: 10, fontWeight: 700, color: "#94a3b8", padding: m.from === "user" ? "0 4px 0 0" : "0 0 0 4px" }}>
                  {m.from === "user" ? "You" : "Assistant"}
                </span>
                <div
                  style={{
                    maxWidth: "84%",
                    padding: m.from === "user" ? "10px 14px" : "12px 14px",
                    background: m.from === "user" ? "#075985" : "#ffffff",
                    color: m.from === "user" ? "#ffffff" : "#1e293b",
                    border: m.from === "user" ? "none" : "1px solid #e2e8f0",
                    borderRadius: m.from === "user" ? "14px 14px 2px 14px" : "2px 14px 14px 14px",
                    fontSize: 12.5,
                    lineHeight: 1.6,
                    boxShadow: "0 1px 3px rgba(0, 0, 0, 0.05)",
                    wordBreak: "break-word",
                  }}
                >
                  {m.from === "user" ? m.text : <MarkdownMessage text={m.text} />}
                </div>
              </div>
            ))}

            {pending && (
              <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start", gap: 3 }}>
                <span style={{ fontSize: 10, fontWeight: 700, color: "#94a3b8", paddingLeft: 4 }}>Assistant</span>
                <div style={{ padding: "10px 14px", background: "#ffffff", border: "1px solid #e2e8f0", borderRadius: "2px 14px 14px 14px", display: "flex", gap: 5, alignItems: "center" }}>
                  {[0, 1, 2].map((i) => (
                    <span key={i} style={{ width: 5, height: 5, borderRadius: "50%", background: "#94a3b8", animation: `chatBounce 1.2s ease ${i * 0.18}s infinite` }} />
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Input */}
          <div style={{ padding: "10px 12px", background: "#ffffff", borderTop: "1px solid #e2e8f0", display: "flex", gap: 6 }}>
            <div
              style={{
                flex: 1,
                display: "flex",
                alignItems: "center",
                background: "#f8fafc",
                border: `1px solid ${focused ? "#075985" : "#cbd5e1"}`,
                borderRadius: 10,
                padding: "0 10px",
                transition: "all 0.15s",
              }}
            >
              <input
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && ask()}
                onFocus={() => setFocused(true)}
                onBlur={() => setFocused(false)}
                placeholder="Ask about this enterprise…"
                style={{ flex: 1, padding: "9px 0", background: "transparent", border: "none", outline: "none", fontSize: 12.5, color: "#0f172a", fontFamily: "inherit" }}
              />
            </div>
            <button
              type="button"
              onClick={() => ask()}
              disabled={pending || !input.trim()}
              style={{
                padding: "0 14px",
                height: 36,
                borderRadius: 10,
                background: "#075985",
                color: "#ffffff",
                border: "none",
                fontWeight: 700,
                fontSize: 12,
                cursor: pending || !input.trim() ? "not-allowed" : "pointer",
                opacity: pending || !input.trim() ? 0.5 : 1,
              }}
            >
              Send
            </button>
          </div>
        </div>
      )}

      {/* ── Floating Action Launcher Button (FAB) ── */}
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        style={{
          position: "fixed",
          bottom: 24,
          right: 24,
          height: 48,
          padding: open ? "0 16px" : "0 20px",
          borderRadius: 24,
          background: "linear-gradient(135deg, #0f172a 0%, #0369a1 100%)",
          color: "#ffffff",
          border: "1px solid rgba(255, 255, 255, 0.2)",
          boxShadow: "0 10px 25px -5px rgba(7, 89, 133, 0.5), 0 4px 12px rgba(15, 23, 42, 0.3)",
          display: "flex",
          alignItems: "center",
          gap: 9,
          fontSize: 13,
          fontWeight: 700,
          cursor: "pointer",
          zIndex: 9999,
          transition: "all 0.2s cubic-bezier(0.16, 1, 0.3, 1)",
        }}
      >
        <span style={{ fontSize: 18, lineHeight: 1 }}>{open ? "✕" : "💬"}</span>
        <span>{open ? "Close Chat" : "Ask AI Assistant"}</span>
        {!open && (
          <span style={{ width: 8, height: 8, borderRadius: "50%", background: "#34d399", display: "inline-block", marginLeft: 2 }} />
        )}
      </button>

      <style>{`
        @keyframes floatChatIn {
          from { opacity: 0; transform: translateY(16px) scale(0.95); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes chatBounce {
          0%, 60%, 100% { transform: translateY(0); opacity: 0.35; }
          30% { transform: translateY(-4px); opacity: 1; }
        }
      `}</style>
    </>
  );
}
