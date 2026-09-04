import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { CalendarClock, Copy, Download, FileText, RefreshCw, Sparkles, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { AppLayout } from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  AiBadge,
  AiDisclaimer,
  AiSkeletonLines,
  AiThinking,
  EmptyState,
  ErrorState,
} from "@/components/ai/AiStates";
import { useApp } from "@/lib/app-store";
import { summarizeMeeting, type MeetingSummary } from "@/services/aiService";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/meetings")({
  head: () => ({
    meta: [
      { title: "Meeting Notes Summarizer | AI Workplace" },
      {
        name: "description",
        content:
          "Turn lengthy meeting notes into clear summaries, decisions and actionable tasks with owners and deadlines.",
      },
      { property: "og:title", content: "Meeting Notes Summarizer | AI Workplace" },
      {
        property: "og:description",
        content: "Turn lengthy meeting notes into summaries, decisions and action items.",
      },
    ],
  }),
  component: MeetingsPage,
});

function summaryToText(s: MeetingSummary): string {
  return [
    `${s.title}`,
    "",
    "EXECUTIVE SUMMARY",
    s.executiveSummary,
    "",
    "KEY POINTS",
    ...s.keyPoints.map((k) => `- ${k}`),
    "",
    "DECISIONS MADE",
    ...s.decisions.map((d) => `- ${d}`),
    "",
    "ACTION ITEMS",
    ...s.actionItems.map((a) => `- ${a.task} | ${a.owner} | ${a.deadline}`),
  ].join("\n");
}

function MeetingsPage() {
  const { addHistory } = useApp();
  const [title, setTitle] = useState("");
  const [notes, setNotes] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [summary, setSummary] = useState<MeetingSummary | null>(null);
  const [touched, setTouched] = useState(false);

  const invalid = notes.trim().length < 40;

  async function run() {
    setTouched(true);
    if (invalid) {
      toast.error("Paste a bit more of your notes so the AI has something to work with.");
      return;
    }
    setStatus("loading");
    toast.info("Generating...");
    try {
      const res = await summarizeMeeting(notes, title);
      setSummary(res);
      setStatus("success");
      toast.success("Generated successfully");
      addHistory({
        type: "meeting",
        title: `${res.title} summarized`,
        preview: res.executiveSummary.slice(0, 120),
        payload: res,
      });
    } catch {
      setStatus("error");
    }
  }

  function copy() {
    if (!summary) return;
    void navigator.clipboard
      .writeText(summaryToText(summary))
      .then(() => toast.success("Copied to clipboard"))
      .catch(() => toast.error("Couldn't copy to clipboard"));
  }

  function download() {
    if (!summary) return;
    const blob = new Blob([summaryToText(summary)], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${summary.title.replace(/[^\w\s-]/g, "").trim() || "meeting-summary"}.txt`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success("Summary downloaded");
  }

  return (
    <AppLayout
      title="Meeting Notes Summarizer"
      description="Summaries, decisions and action items from raw notes."
    >
      <div className="space-y-8">
        <section>
          <h2 className="text-2xl font-semibold tracking-tight text-foreground">
            Meeting Notes Summarizer
          </h2>
          <p className="mt-2 max-w-2xl text-muted-foreground">
            Turn lengthy meeting notes into clear summaries, decisions and actionable tasks.
          </p>
        </section>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Your notes</CardTitle>
            <CardDescription>Rough notes are fine — bullet points work well.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="mtitle">Meeting title (optional)</Label>
              <Input
                id="mtitle"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Q3 planning review"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="notes">Paste your meeting notes</Label>
              <Textarea
                id="notes"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                onBlur={() => setTouched(true)}
                placeholder="Paste your meeting notes here..."
                className={cn("min-h-56 resize-y", touched && invalid && "border-destructive")}
              />
              {touched && invalid ? (
                <p className="text-xs text-destructive">
                  Please paste at least a few lines of notes.
                </p>
              ) : null}
            </div>
            <div className="flex flex-col gap-2 sm:flex-row">
              <Button size="lg" className="sm:flex-1" onClick={run} disabled={status === "loading"}>
                <Sparkles className="size-4" aria-hidden />
                {status === "loading" ? "Summarizing..." : "Summarize Meeting"}
              </Button>
              <Button
                size="lg"
                variant="outline"
                onClick={() => {
                  setNotes("");
                  setTitle("");
                  setSummary(null);
                  setStatus("idle");
                  setTouched(false);
                  toast.success("Notes cleared");
                }}
              >
                <Trash2 className="size-4" aria-hidden />
                Clear notes
              </Button>
            </div>
          </CardContent>
        </Card>

        {status === "idle" ? (
          <EmptyState
            icon={FileText}
            title="No summary yet"
            description="Paste your notes above and the assistant will structure them for you."
            hints={[
              "Include who said what — owners are picked up from names.",
              "Words like 'agreed', 'approved' or 'will send' become decisions and tasks.",
              "Longer notes produce richer key points.",
            ]}
          />
        ) : null}

        {status === "loading" ? (
          <Card>
            <CardContent className="space-y-4 p-6">
              <AiThinking label="AI is reading your notes..." />
              <AiSkeletonLines lines={8} />
            </CardContent>
          </Card>
        ) : null}

        {status === "error" ? <ErrorState onRetry={run} /> : null}

        {status === "success" && summary ? (
          <div className="space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <h3 className="text-lg font-semibold tracking-tight text-foreground">
                  {summary.title}
                </h3>
                <AiBadge />
              </div>
              <div className="flex flex-wrap gap-2">
                <Button variant="outline" size="sm" onClick={copy}>
                  <Copy className="size-4" aria-hidden />
                  Copy summary
                </Button>
                <Button variant="outline" size="sm" onClick={download}>
                  <Download className="size-4" aria-hidden />
                  Export
                </Button>
                <Button variant="outline" size="sm" onClick={run}>
                  <RefreshCw className="size-4" aria-hidden />
                  Regenerate
                </Button>
              </div>
            </div>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">Executive summary</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm leading-relaxed text-foreground">{summary.executiveSummary}</p>
              </CardContent>
            </Card>

            <div className="grid gap-6 lg:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Key points</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="list-disc space-y-2 pl-5 text-sm text-foreground">
                    {summary.keyPoints.map((k, i) => (
                      <li key={i}>{k}</li>
                    ))}
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Decisions made</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm text-foreground">
                    {summary.decisions.map((d, i) => (
                      <li key={i} className="rounded-lg border border-border bg-muted/40 px-3 py-2">
                        {d}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">Action items</CardTitle>
                <CardDescription>Task, responsible person and deadline.</CardDescription>
              </CardHeader>
              <CardContent className="px-0 sm:px-6">
                <div className="hidden sm:block">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Task</TableHead>
                        <TableHead className="w-32">Responsible</TableHead>
                        <TableHead className="w-40">Deadline</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {summary.actionItems.map((a, i) => (
                        <TableRow key={i}>
                          <TableCell className="whitespace-normal">{a.task}</TableCell>
                          <TableCell className="font-medium">{a.owner}</TableCell>
                          <TableCell>{a.deadline}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
                <ul className="space-y-3 px-4 sm:hidden">
                  {summary.actionItems.map((a, i) => (
                    <li key={i} className="rounded-lg border border-border p-3">
                      <p className="text-sm text-foreground">{a.task}</p>
                      <p className="mt-2 flex flex-wrap gap-2 text-xs">
                        <Badge variant="secondary">{a.owner}</Badge>
                        <Badge variant="outline">{a.deadline}</Badge>
                      </p>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">Deadlines</CardTitle>
              </CardHeader>
              <CardContent className="flex flex-wrap gap-2">
                {summary.deadlines.map((d, i) => (
                  <span
                    key={i}
                    className="inline-flex items-center gap-2 rounded-lg border border-border bg-muted/50 px-3 py-2 text-xs text-foreground"
                  >
                    <CalendarClock className="size-3.5 text-primary" aria-hidden />
                    <span className="font-medium">{d.date}</span>
                    <span className="max-w-[16rem] truncate text-muted-foreground">{d.label}</span>
                  </span>
                ))}
              </CardContent>
            </Card>

            <AiDisclaimer />
          </div>
        ) : null}
      </div>
    </AppLayout>
  );
}
