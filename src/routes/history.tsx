import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { ArrowRight, Clock, FileText, Mail, MessageSquare, Search, Trash2, type LucideIcon } from "lucide-react";
import { AppLayout } from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { EmptyState } from "@/components/ai/AiStates";
import { formatWhen, useApp, type HistoryType } from "@/lib/app-store";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

export const Route = createFileRoute("/history")({
  head: () => ({
    meta: [
      { title: "Activity History | AI Workplace Productivity Assistant" },
      {
        name: "description",
        content: "Browse every email, meeting summary and AI conversation you have created in your workspace.",
      },
      { property: "og:title", content: "Activity History | AI Workplace Productivity Assistant" },
      {
        property: "og:description",
        content: "Browse every email, meeting summary and AI conversation you have created in your workspace.",
      },
    ],
  }),
  component: HistoryPage,
});

const ICON: Record<HistoryType, LucideIcon> = {
  email: Mail,
  meeting: FileText,
  chat: MessageSquare,
};

const LABEL: Record<HistoryType, string> = {
  email: "Smart Email",
  meeting: "Meeting Summarizer",
  chat: "AI Assistant",
};

const TARGET: Record<HistoryType, "/email" | "/meetings" | "/assistant"> = {
  email: "/email",
  meeting: "/meetings",
  chat: "/assistant",
};

const FILTERS: { value: "all" | HistoryType; label: string }[] = [
  { value: "all", label: "All" },
  { value: "email", label: "Emails" },
  { value: "meeting", label: "Meetings" },
  { value: "chat", label: "Chats" },
];

function HistoryPage() {
  const { history, clearHistory } = useApp();
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<"all" | HistoryType>("all");

  const items = useMemo(() => {
    const q = query.trim().toLowerCase();
    return history.filter((item) => {
      if (filter !== "all" && item.type !== filter) return false;
      if (!q) return true;
      return `${item.title} ${item.preview}`.toLowerCase().includes(q);
    });
  }, [history, query, filter]);

  return (
    <AppLayout title="History" description="Everything you have created with AI, in one place.">
      <div className="space-y-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative w-full sm:max-w-xs">
            <Search className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" aria-hidden />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search activity"
              aria-label="Search activity"
              className="pl-9"
            />
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              clearHistory();
              toast.success("History cleared");
            }}
            disabled={history.length === 0}
          >
            <Trash2 className="size-4" aria-hidden />
            Clear history
          </Button>
        </div>

        <div className="flex flex-wrap gap-2">
          {FILTERS.map((f) => (
            <Button
              key={f.value}
              type="button"
              size="sm"
              variant={filter === f.value ? "default" : "outline"}
              onClick={() => setFilter(f.value)}
            >
              {f.label}
            </Button>
          ))}
        </div>

        {items.length === 0 ? (
          <EmptyState
            title="Nothing here yet"
            description="Generate an email, summarize a meeting or chat with the assistant to build your history."
          />
        ) : (
          <Card>
            <CardContent className="divide-y divide-border p-0">
              {items.map((item) => {
                const Icon = ICON[item.type];
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => navigate({ to: TARGET[item.type] })}
                    className={cn(
                      "flex w-full items-start gap-4 px-4 py-4 text-left transition-colors hover:bg-muted/60 sm:px-5",
                    )}
                  >
                    <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-accent text-accent-foreground">
                      <Icon className="size-4" aria-hidden />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-sm font-medium text-foreground">{item.title}</span>
                      <span className="mt-0.5 block line-clamp-2 text-xs text-muted-foreground">{item.preview}</span>
                      <span
                        suppressHydrationWarning
                        className="mt-1 flex flex-wrap items-center gap-x-2 text-xs text-muted-foreground"
                      >
                        <Clock className="size-3" aria-hidden />
                        {formatWhen(item.createdAt)}
                        <span aria-hidden>·</span>
                        {LABEL[item.type]}
                      </span>
                    </span>
                    <ArrowRight className="mt-1 size-4 shrink-0 text-muted-foreground" aria-hidden />
                  </button>
                );
              })}
            </CardContent>
          </Card>
        )}
      </div>
    </AppLayout>
  );
}
