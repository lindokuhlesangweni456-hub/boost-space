import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { Bot, RotateCcw, Send, Sparkles, User } from "lucide-react";
import { toast } from "sonner";
import { AppLayout } from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { AiDisclaimer, AiThinking, ErrorState } from "@/components/ai/AiStates";
import { FormattedText } from "@/components/ai/FormattedText";
import { useApp } from "@/lib/app-store";
import { sendChatMessage, type ChatTurn } from "@/services/aiService";

export const Route = createFileRoute("/assistant")({
  head: () => ({
    meta: [
      { title: "AI Workplace Assistant | AI Workplace" },
      {
        name: "description",
        content:
          "Chat with an intelligent assistant for drafting emails, preparing meetings and everyday workplace tasks.",
      },
      { property: "og:title", content: "AI Workplace Assistant | AI Workplace" },
      {
        property: "og:description",
        content: "Your intelligent assistant for everyday workplace tasks.",
      },
    ],
  }),
  component: AssistantPage,
});

interface Message extends ChatTurn {
  id: string;
  at: string;
}

const SUGGESTIONS = [
  "Write a professional email to a client.",
  "Summarize these meeting notes.",
  "Help me prepare for a meeting.",
  "Create an agenda for my team meeting.",
  "Rewrite this message professionally.",
  "Create a project follow-up checklist.",
];

function timeNow() {
  return new Date().toLocaleTimeString(undefined, { hour: "numeric", minute: "2-digit" });
}

function AssistantPage() {
  const { addHistory } = useApp();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [lastSent, setLastSent] = useState<string | null>(null);
  const endRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  async function ask(text: string, history: Message[]) {
    setLoading(true);
    setError(false);
    try {
      const reply = await sendChatMessage([
        ...history.map(({ role, content }) => ({ role, content })),
      ]);
      setMessages((prev) => [
        ...prev,
        { id: `${Date.now()}-a`, role: "assistant", content: reply, at: timeNow() },
      ]);
      addHistory({
        type: "chat",
        title: text.length > 60 ? `${text.slice(0, 57)}…` : text,
        preview: reply.replace(/[*#\n]+/g, " ").slice(0, 120),
      });
    } catch {
      setError(true);
    } finally {
      setLoading(false);
      inputRef.current?.focus();
    }
  }

  function send(text: string) {
    const trimmed = text.trim();
    if (!trimmed || loading) return;
    const userMsg: Message = {
      id: `${Date.now()}-u`,
      role: "user",
      content: trimmed,
      at: timeNow(),
    };
    const next = [...messages, userMsg];
    setMessages(next);
    setInput("");
    setLastSent(trimmed);
    void ask(trimmed, next);
  }

  const empty = messages.length === 0;

  return (
    <AppLayout
      title="AI Workplace Assistant"
      description="Your intelligent assistant for everyday workplace tasks."
      contentClassName="flex max-w-4xl flex-col px-0 py-0 md:px-0 md:py-0"
    >
      <div className="flex min-h-[calc(100vh-8.5rem)] flex-1 flex-col">
        <div className="flex items-center justify-between gap-3 border-b border-border px-4 py-4 md:px-6">
          <div className="min-w-0">
            <h2 className="text-lg font-semibold tracking-tight text-foreground">
              AI Workplace Assistant
            </h2>
            <p className="truncate text-sm text-muted-foreground">
              Your intelligent assistant for everyday workplace tasks.
            </p>
          </div>
          {!empty ? (
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setMessages([]);
                setError(false);
                toast.success("Conversation cleared");
              }}
            >
              <RotateCcw className="size-4" aria-hidden />
              <span className="hidden sm:inline">New chat</span>
            </Button>
          ) : null}
        </div>

        <div className="flex-1 space-y-6 overflow-y-auto px-4 py-6 md:px-6">
          {empty ? (
            <div className="flex flex-col items-center py-8 text-center">
              <span className="flex size-16 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                <Bot className="size-8" aria-hidden />
              </span>
              <h3 className="mt-5 text-xl font-semibold tracking-tight text-foreground">
                How can I help you today?
              </h3>
              <p className="mt-2 max-w-md text-sm text-muted-foreground">
                Ask anything about your workplace tasks, or start with one of these.
              </p>
              <div className="mt-6 grid w-full max-w-2xl gap-2 sm:grid-cols-2">
                {SUGGESTIONS.map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => send(s)}
                    className="rounded-xl border border-border bg-card px-4 py-3 text-left text-sm text-foreground transition-colors hover:border-primary/40 hover:bg-accent/60"
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          ) : null}

          {messages.map((m) => (
            <div key={m.id} className="flex gap-3">
              <span
                className={
                  m.role === "user"
                    ? "flex size-8 shrink-0 items-center justify-center rounded-lg bg-secondary text-secondary-foreground"
                    : "flex size-8 shrink-0 items-center justify-center rounded-lg bg-primary text-primary-foreground"
                }
              >
                {m.role === "user" ? (
                  <User className="size-4" aria-hidden />
                ) : (
                  <Sparkles className="size-4" aria-hidden />
                )}
              </span>
              <div className="min-w-0 flex-1">
                <p className="mb-1 flex items-center gap-2 text-xs text-muted-foreground">
                  <span className="font-medium text-foreground">
                    {m.role === "user" ? "You" : "AI Assistant"}
                  </span>
                  {m.at}
                </p>
                {m.role === "user" ? (
                  <div className="inline-block max-w-full rounded-xl bg-primary px-4 py-2.5 text-sm whitespace-pre-wrap text-primary-foreground">
                    {m.content}
                  </div>
                ) : (
                  <FormattedText content={m.content} />
                )}
              </div>
            </div>
          ))}

          {loading ? <AiThinking /> : null}
          {error ? (
            <ErrorState
              onRetry={() => {
                if (lastSent) void ask(lastSent, messages);
              }}
            />
          ) : null}
          <div ref={endRef} />
        </div>

        <div className="sticky bottom-0 border-t border-border bg-background/90 px-4 py-4 backdrop-blur md:px-6">
          <div className="flex items-end gap-2 rounded-xl border border-border bg-card p-2 shadow-[var(--shadow-card)]">
            <Textarea
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  send(input);
                }
              }}
              placeholder="Ask your workplace assistant anything..."
              className="max-h-40 min-h-11 resize-none border-0 bg-transparent shadow-none focus-visible:ring-0"
            />
            <Button
              size="icon"
              className="size-10 shrink-0"
              onClick={() => send(input)}
              disabled={loading || !input.trim()}
              aria-label="Send message"
            >
              <Send className="size-4" aria-hidden />
            </Button>
          </div>
          <AiDisclaimer className="mt-3" />
        </div>
      </div>
    </AppLayout>
  );
}
