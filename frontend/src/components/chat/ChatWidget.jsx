import { useState } from "react";
import ChatPanel from "./ChatPanel.jsx";

/** Floating chat launcher — used on public pages so "anyone accessing the
 *  system" can ask questions without an account. */
export default function ChatWidget({ context }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      {open && (
        <div className="chat-widget">
          <div className="chat-widget-head">
            <span>Ask the Industry Assistant</span>
            <button type="button" onClick={() => setOpen(false)} aria-label="Close chat">×</button>
          </div>
          <ChatPanel endpoint="/public/chat" context={context} compact />
        </div>
      )}
      <button type="button" className="chat-widget-fab" onClick={() => setOpen((v) => !v)} aria-label="Toggle chat">
        {open ? "×" : "Ask"}
      </button>
    </>
  );
}
