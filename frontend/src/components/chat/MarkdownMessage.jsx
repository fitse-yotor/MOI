/**
 * MarkdownMessage — parses AI response markdown into professional HTML.
 * Uses default marked.parse() (no custom renderer) and relies on the
 * `.md-body` CSS class in theme.css for institutional styling.
 */
import { useMemo } from "react";
import { marked } from "marked";

marked.use({ breaks: true, gfm: true });

export default function MarkdownMessage({ text }) {
  const html = useMemo(() => {
    if (!text) return "";
    try {
      // Remove lone # and * that are clearly not intended as markdown
      return marked.parse(text);
    } catch {
      return `<p>${text}</p>`;
    }
  }, [text]);

  return (
    <div
      className="md-body"
      // eslint-disable-next-line react/no-danger
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
