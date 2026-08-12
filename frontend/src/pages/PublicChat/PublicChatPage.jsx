import { useState } from "react";
import { Link } from "react-router-dom";
import ChatPanel from "../../components/chat/ChatPanel.jsx";

export default function PublicChatPage() {
  return (
    <div className="site-page site-theme-marine" style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <header className="site-topbar">
        <Link to="/" className="site-brand">
          <img src="/ministry-mark.svg" alt="Ministry of Industry" />
          <span>Manufacturing BIS <em>Ministry of Industry, Ethiopia</em></span>
        </Link>
        <div className="site-topbar-links">
          <Link to="/apply" className="site-topbar-link">Register Enterprise</Link>
          <Link to="/login" className="site-topbar-link">Sign in</Link>
        </div>
      </header>

      <main style={{ flex: 1, padding: "24px 20px", maxWidth: 1000, margin: "0 auto", width: "100%" }}>
        <div style={{ marginBottom: 20, textAlign: "center" }}>
          <div className="badge info" style={{ marginBottom: 8 }}>AI Public Intelligence Service</div>
          <h1 style={{ fontSize: 28, fontWeight: 800, color: "var(--primary)", margin: "4px 0" }}>
            Ethiopia Industrial &amp; Infrastructure Matching Assistant
          </h1>
          <p style={{ fontSize: 14, color: "var(--text2)", maxWidth: 640, margin: "0 auto" }}>
            Ask anything about registered manufacturing enterprises, power &amp; transport infrastructure, industrial park locations, and optimal sector-to-region matching.
          </p>
        </div>

        <div style={{ background: "#fff", borderRadius: 12, border: "1px solid var(--border)", boxShadow: "0 4px 12px rgba(0,0,0,.05)", overflow: "hidden", minHeight: 520 }}>
          <ChatPanel endpoint="/public/chat" />
        </div>
      </main>

      <footer className="site-footer" style={{ marginTop: "auto" }}>
        <div>
          <img src="/ministry-mark.svg" alt="" />
          <span>Manufacturing BIS · Ministry of Industry, Federal Democratic Republic of Ethiopia</span>
        </div>
        <span className="site-footer-right">Public Intelligence Portal</span>
      </footer>
    </div>
  );
}
