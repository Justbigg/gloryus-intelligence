import { useState, useRef, useEffect } from "react";
import Send from "icon:send";
import BookOpen from "icon:book-open";
import Clock from "icon:clock";
import Bookmark from "icon:bookmark";
import { Badge } from "../components/ui/Badge.jsx";
import { Button } from "../components/ui/Button.jsx";
import { Card } from "../components/ui/Card.jsx";
import { demoQA } from "../lib/demoData.js";

const DEMO_NOTICE =
  "This is demo mode — I can answer questions about trends, audiences, competitors, and product opportunities. Try one of the suggested questions below.";

function fuzzyMatch(input, question) {
  const inputWords = input.toLowerCase().split(/\s+/).filter((w) => w.length > 3);
  const q = question.toLowerCase();
  return inputWords.some((w) => q.includes(w));
}

function findAnswer(input) {
  for (const qa of demoQA) {
    if (fuzzyMatch(input, qa.question)) return qa;
  }
  return null;
}

function AIMessage({ qa }) {
  if (!qa) {
    return (
      <div className="flex gap-3 items-start">
        <div className="w-8 h-8 rounded-full bg-signal/20 border border-signal/30 flex items-center justify-center shrink-0 text-signal font-display font-bold text-xs">
          GI
        </div>
        <div className="bg-panel border border-border rounded-xl rounded-tl-sm px-4 py-3 max-w-lg">
          <Badge variant="amber" size="xs" className="mb-2">DEMO INTELLIGENCE</Badge>
          <p className="text-sm text-secondary mt-1">{DEMO_NOTICE}</p>
        </div>
      </div>
    );
  }
  return (
    <div className="flex gap-3 items-start">
      <div className="w-8 h-8 rounded-full bg-signal/20 border border-signal/30 flex items-center justify-center shrink-0 text-signal font-display font-bold text-xs">
        GI
      </div>
      <div className="bg-panel border border-border rounded-xl rounded-tl-sm px-4 py-3 max-w-2xl space-y-3">
        <Badge variant="amber" size="xs">DEMO INTELLIGENCE</Badge>

        <div>
          <p className="text-xs text-muted uppercase tracking-wide mb-1">Summary</p>
          <p className="text-sm text-primary">{qa.summary}</p>
        </div>

        {qa.signals?.length > 0 && (
          <div>
            <p className="text-xs text-muted uppercase tracking-wide mb-1">Signals</p>
            <ul className="space-y-1">
              {qa.signals.map((s, i) => (
                <li key={i} className="flex items-start gap-1.5 text-xs text-secondary">
                  <span className="text-signal mt-0.5">•</span>{s}
                </li>
              ))}
            </ul>
          </div>
        )}

        <div>
          <p className="text-xs text-muted uppercase tracking-wide mb-1">Evidence</p>
          <p className="text-xs text-secondary">{qa.evidence}</p>
        </div>

        <div>
          <p className="text-xs text-muted uppercase tracking-wide mb-1">Interpretation</p>
          <p className="text-xs text-secondary">{qa.interpretation}</p>
        </div>

        {qa.opportunities?.length > 0 && (
          <div>
            <p className="text-xs text-muted uppercase tracking-wide mb-1">Opportunities</p>
            <ul className="space-y-1">
              {qa.opportunities.map((o, i) => (
                <li key={i} className="flex items-start gap-1.5 text-xs text-secondary">
                  <span className="text-glow mt-0.5">→</span>{o}
                </li>
              ))}
            </ul>
          </div>
        )}

        {qa.recommendedResearch?.length > 0 && (
          <div>
            <p className="text-xs text-muted uppercase tracking-wide mb-1">Recommended Research</p>
            <ul className="space-y-1">
              {qa.recommendedResearch.map((r, i) => (
                <li key={i} className="flex items-start gap-1.5 text-xs text-secondary">
                  <span className="text-pulse mt-0.5">◈</span>{r}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}

export default function Assistant() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef(null);
  const textareaRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  function sendMessage(text) {
    if (!text.trim()) return;
    const userMsg = { role: "user", text: text.trim() };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);
    setTimeout(() => {
      const qa = findAnswer(text);
      setMessages((prev) => [...prev, { role: "ai", qa }]);
      setLoading(false);
    }, 600);
  }

  function handleKeyDown(e) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage(input);
    }
  }

  const suggestions = demoQA.slice(0, 6).map((q) => q.question);
  const recentTopics = messages
    .filter((m) => m.role === "user")
    .slice(-3)
    .map((m) => m.text.slice(0, 40) + (m.text.length > 40 ? "…" : ""));

  return (
    <div className="min-h-screen bg-void text-primary font-body">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-6">
          <h1 className="font-display text-3xl font-bold text-primary">AI Research Assistant</h1>
          <p className="text-secondary mt-1">Ask anything about markets, trends, and opportunities</p>
        </div>

        <div className="flex gap-6 items-start">
          {/* Main Chat */}
          <div className="flex-1 flex flex-col" style={{ minHeight: "calc(100vh - 200px)" }}>
            <Card className="flex-1 flex flex-col overflow-hidden" style={{ minHeight: "500px" }}>
              {/* Message history */}
              <div className="flex-1 overflow-y-auto px-5 py-5 space-y-5">
                {messages.length === 0 && (
                  <div className="flex items-center justify-center h-full">
                    <div className="text-center">
                      <div className="w-14 h-14 rounded-full bg-signal/10 border border-signal/20 flex items-center justify-center mx-auto mb-3">
                        <BookOpen className="w-6 h-6 text-signal" />
                      </div>
                      <p className="text-secondary text-sm">Ask a question to begin your research session</p>
                    </div>
                  </div>
                )}
                {messages.map((msg, i) =>
                  msg.role === "user" ? (
                    <div key={i} className="flex justify-end">
                      <div className="bg-signal/20 border border-signal/20 text-primary rounded-xl rounded-tr-sm px-4 py-2.5 max-w-md text-sm">
                        {msg.text}
                      </div>
                    </div>
                  ) : (
                    <AIMessage key={i} qa={msg.qa} />
                  )
                )}
                {loading && (
                  <div className="flex gap-3 items-start">
                    <div className="w-8 h-8 rounded-full bg-signal/20 border border-signal/30 flex items-center justify-center shrink-0 text-signal font-display font-bold text-xs">
                      GI
                    </div>
                    <div className="bg-panel border border-border rounded-xl rounded-tl-sm px-4 py-3">
                      <div className="flex gap-1">
                        {[0, 1, 2].map((i) => (
                          <span
                            key={i}
                            className="w-2 h-2 rounded-full bg-signal/60 animate-bounce"
                            style={{ animationDelay: `${i * 0.15}s` }}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                )}
                <div ref={bottomRef} />
              </div>

              {/* Suggested Questions */}
              <div className="px-5 pt-3 border-t border-border">
                <p className="text-xs text-muted mb-2">Suggested questions:</p>
                <div className="flex flex-wrap gap-2 pb-3">
                  {suggestions.map((q, i) => (
                    <button
                      key={i}
                      onClick={() => sendMessage(q)}
                      className="text-xs bg-surface border border-border text-secondary hover:text-signal hover:border-signal/40 px-3 py-1 rounded-full transition-colors"
                    >
                      {q.length > 60 ? q.slice(0, 60) + "…" : q}
                    </button>
                  ))}
                </div>
              </div>

              {/* Input Bar */}
              <div className="px-5 pb-5 pt-2 flex gap-3 items-end">
                <textarea
                  ref={textareaRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Ask about trends, audiences, competitors, or opportunities…"
                  rows={2}
                  className="flex-1 resize-none bg-surface border border-border rounded-lg px-4 py-2.5 text-sm text-primary placeholder:text-muted focus:outline-none focus:border-signal/50 transition-colors"
                />
                <Button
                  variant="primary"
                  size="md"
                  onClick={() => sendMessage(input)}
                  disabled={!input.trim() || loading}
                  className="shrink-0"
                >
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            </Card>
          </div>

          {/* Right Panel — desktop only */}
          <div className="hidden lg:flex flex-col gap-4 w-64 shrink-0">
            <Card className="p-4">
              <div className="flex items-center gap-2 mb-3">
                <Clock className="w-4 h-4 text-signal" />
                <h3 className="font-display font-semibold text-sm">Active Context</h3>
              </div>
              {recentTopics.length === 0 ? (
                <p className="text-xs text-muted">No topics yet this session</p>
              ) : (
                <ul className="space-y-1.5">
                  {recentTopics.map((t, i) => (
                    <li key={i} className="text-xs text-secondary bg-surface border border-border rounded px-2 py-1">
                      {t}
                    </li>
                  ))}
                </ul>
              )}
            </Card>

            <Card className="p-4">
              <div className="flex items-center gap-2 mb-3">
                <Bookmark className="w-4 h-4 text-pulse" />
                <h3 className="font-display font-semibold text-sm">Saved Insights</h3>
              </div>
              <div className="text-center py-4">
                <p className="text-xs text-muted">No saved insights yet</p>
                <p className="text-xs text-muted mt-1">Bookmark answers to save them here</p>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
