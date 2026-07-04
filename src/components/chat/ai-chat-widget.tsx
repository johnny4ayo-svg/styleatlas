"use client";

import { useEffect, useRef, useState } from "react";
import { MessageSquareText, Send, X, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { createClient } from "@/lib/supabase/client";

type ChatMessage = { role: "user" | "assistant"; content: string };

function getVisitorId() {
  const key = "styleatlas_visitor_id";
  let id = typeof window !== "undefined" ? localStorage.getItem(key) : null;
  if (!id) {
    id = crypto.randomUUID();
    if (typeof window !== "undefined") localStorage.setItem(key, id);
  }
  return id;
}

export function AIChatWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: "assistant",
      content:
        "Hi! I'm the STYLEATLAS style concierge. Tell me what you're looking for — a designer, brand, or fashion school — and where you're based, and I'll point you in the right direction.",
    },
  ]);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const supabase = createClient();

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, open]);

  const handleSend = async () => {
    const message = input.trim();
    if (!message || sending) return;

    setInput("");
    setMessages((prev) => [...prev, { role: "user", content: message }]);
    setSending(true);

    try {
      const { data, error } = await supabase.functions.invoke("ai-live-chat", {
        body: {
          message,
          sessionId,
          visitorId: getVisitorId(),
          sourcePage: typeof window !== "undefined" ? window.location.pathname : "/",
        },
      });

      if (error) throw error;

      setSessionId(data.sessionId);
      setMessages((prev) => [...prev, { role: "assistant", content: data.reply }]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "Sorry, I'm having trouble responding right now. You can reach our team via the Contact page.",
        },
      ]);
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="fixed bottom-5 right-5 z-50">
      {open && (
        <div className="mb-3 flex h-[520px] w-[calc(100vw-2.5rem)] max-w-sm flex-col overflow-hidden rounded-xl border border-charcoal-100 bg-white shadow-elevated animate-fade-in-up">
          <div className="flex items-center justify-between bg-charcoal-900 px-4 py-3 text-white">
            <div className="flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-gold-400" />
              <span className="font-serif text-sm font-semibold">STYLEATLAS Concierge</span>
            </div>
            <button onClick={() => setOpen(false)} aria-label="Close chat">
              <X className="h-4 w-4" />
            </button>
          </div>

          <div ref={scrollRef} className="flex-1 space-y-3 overflow-y-auto p-4">
            {messages.map((m, i) => (
              <div
                key={i}
                className={cn(
                  "max-w-[85%] rounded-lg px-3.5 py-2.5 text-sm",
                  m.role === "user"
                    ? "ml-auto bg-gold-400 text-charcoal-900"
                    : "bg-charcoal-50 text-charcoal-800"
                )}
              >
                {m.content}
              </div>
            ))}
            {sending && <div className="w-fit rounded-lg bg-charcoal-50 px-3.5 py-2.5 text-sm text-muted-foreground">Typing…</div>}
          </div>

          <div className="flex items-center gap-2 border-t border-charcoal-100 p-3">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
              placeholder="Ask about designers, budgets, cities…"
              className="flex-1 rounded-md border border-charcoal-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gold-400"
            />
            <Button size="icon" onClick={handleSend} disabled={sending}>
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}

      <button
        onClick={() => setOpen((v) => !v)}
        className="flex h-14 w-14 items-center justify-center rounded-full bg-gold-400 text-charcoal-900 shadow-gold transition hover:bg-gold-500"
        aria-label="Open AI chat"
      >
        {open ? <X className="h-6 w-6" /> : <MessageSquareText className="h-6 w-6" />}
      </button>
    </div>
  );
}
