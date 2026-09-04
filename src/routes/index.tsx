import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import {
  ArrowRight,
  CheckSquare,
  Clock,
  FileText,
  Mail,
  MessageSquare,
  Sparkles,
  TrendingUp,
  type LucideIcon,
} from "lucide-react";
import { AppLayout } from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { formatWhen, useApp, type HistoryType } from "@/lib/app-store";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Dashboard | AI Workplace Productivity Assistant" },
      {
        name: "description",
        content:
          "Write better emails, understand meetings faster and work smarter with one AI workplace dashboard.",
      },
      { property: "og:title", content: "Dashboard | AI Workplace Productivity Assistant" },
      {
        property: "og:description",
        content:
          "Write better emails, understand meetings faster and work smarter with one AI workplace dashboard.",
      },
    ],
  }),
  component: Dashboard,
});

const FEATURES: {
  to: string;
  icon: LucideIcon;
  title: string;
  description: string;
  cta: string;
}[] = [
  {
    to: "/email",
    icon: Mail,
    title: "Smart Email",
    description: "Generate professional emails in seconds.",
    cta: "Create Email",
  },
  {
    to: "/meetings",
    icon: FileText,
    title: "Meeting Summarizer",
    description: "Turn meeting notes into concise summaries and action items.",
    cta: "Summarize Notes",
  },
  {
    to: "/assistant",
    icon: Sparkles,
    title: "AI Assistant",
    description: "Ask AI anything about your workplace tasks.",
    cta: "Open Assistant",
  },
];

const ACTIVITY_ICON: Record<HistoryType, LucideIcon> = {
  email: Mail,
  meeting: FileText,
  chat: MessageSquare,
};

const ACTIVITY_LABEL: Record<HistoryType, string> = {
  email: "Smart Email",
  meeting: "Meeting Summarizer",
  chat: "AI Assistant",
};

function greeting() {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 18) return "Good afternoon";
  return "Good evening";
}

function StatCard({
  icon: Icon,
  label,
  value,
  trend,
}: {
  icon: LucideIcon;
  label: string;
  value: number;
  trend: string;
}) {
  return (
    <Card className="shadow-none transition-shadow hover:shadow-[var(--shadow-card)]">
      <CardContent className="flex items-start justify-between gap-3 p-5">
        <div className="min-w-0">
          <p className="truncate text-sm text-muted-foreground">{label}</p>
          <p className="mt-1 text-2xl font-semibold tracking-tight text-foreground">{value}</p>
          <p className="mt-1 flex items-center gap-1 text-xs text-muted-foreground">
            <TrendingUp className="size-3 text-[var(--success)]" aria-hidden />
            {trend}
          </p>
        </div>
        <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-accent text-accent-foreground">
          <Icon className="size-4" aria-hidden />
        </span>
      </CardContent>
    </Card>
  );
}

function Dashboard() {
  const { profile, history } = useApp();
  const navigate = useNavigate();

  const emails = 24 + history.filter((h) => h.type === "email").length;
  const meetings = 12 + history.filter((h) => h.type === "meeting").length;
  const chats = 38 + history.filter((h) => h.type === "chat").length;

  const firstName = profile.name.split(" ")[0];

  return (
    <AppLayout
      title="Dashboard"
      description="Your AI workspace at a glance."
    >
      <div className="space-y-8">
        <section>
          <h2 className="text-2xl font-semibold tracking-tight text-foreground md:text-3xl">
            {greeting()}, {firstName}
          </h2>
          <p className="mt-2 max-w-2xl text-muted-foreground">
            Your AI workplace assistant is ready to help you get more done. Write better
            emails, understand meetings faster and work smarter with AI.
          </p>
        </section>

        <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map(({ to, icon: Icon, title, description, cta }) => (
            <Card
              key={to}
              className="group flex flex-col justify-between transition-all hover:-translate-y-0.5 hover:shadow-[var(--shadow-lift)]"
            >
              <CardHeader>
                <span className="flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <Icon className="size-5" aria-hidden />
                </span>
                <CardTitle className="mt-3 text-base">{title}</CardTitle>
                <CardDescription>{description}</CardDescription>
              </CardHeader>
              <CardContent>
                <Button asChild className="w-full">
                  <Link to={to}>
                    {cta}
                    <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" aria-hidden />
                  </Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </section>

        <section className="space-y-4">
          <h3 className="text-lg font-semibold tracking-tight text-foreground">
            Productivity overview
          </h3>
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <StatCard icon={Mail} label="Emails Generated" value={emails} trend="+8 this week" />
            <StatCard icon={FileText} label="Meetings Summarized" value={meetings} trend="+3 this week" />
            <StatCard icon={MessageSquare} label="AI Conversations" value={chats} trend="+11 this week" />
            <StatCard icon={CheckSquare} label="Tasks Identified" value={67} trend="+14 this week" />
          </div>
        </section>

        <section className="space-y-4">
          <div className="flex items-center justify-between gap-3">
            <h3 className="text-lg font-semibold tracking-tight text-foreground">Recent activity</h3>
            <Button asChild variant="ghost" size="sm">
              <Link to="/history">View all</Link>
            </Button>
          </div>

          <Card>
            <CardContent className="divide-y divide-border p-0">
              {history.slice(0, 6).map((item) => {
                const Icon = ACTIVITY_ICON[item.type];
                const target =
                  item.type === "email" ? "/email" : item.type === "meeting" ? "/meetings" : "/assistant";
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => navigate({ to: target })}
                    className={cn(
                      "flex w-full items-center gap-4 px-4 py-4 text-left transition-colors hover:bg-muted/60 sm:px-5",
                    )}
                  >
                    <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-accent text-accent-foreground">
                      <Icon className="size-4" aria-hidden />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-sm font-medium text-foreground">
                        {item.title}
                      </span>
                      <span className="mt-0.5 flex flex-wrap items-center gap-x-2 gap-y-0.5 text-xs text-muted-foreground">
                        <Clock className="size-3" aria-hidden />
                        {formatWhen(item.createdAt)}
                        <span aria-hidden>·</span>
                        {ACTIVITY_LABEL[item.type]}
                      </span>
                    </span>
                    <ArrowRight className="size-4 shrink-0 text-muted-foreground" aria-hidden />
                  </button>
                );
              })}
              {history.length === 0 ? (
                <p className="px-5 py-10 text-center text-sm text-muted-foreground">
                  No activity yet. Generate an email or summarize a meeting to get started.
                </p>
              ) : null}
            </CardContent>
          </Card>
        </section>
      </div>
    </AppLayout>
  );
}
