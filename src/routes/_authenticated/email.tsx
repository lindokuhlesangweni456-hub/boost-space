import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Copy, Mail, Pencil, RefreshCw, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { AppLayout } from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { AiBadge, AiDisclaimer, AiSkeletonLines, AiThinking, EmptyState, ErrorState } from "@/components/ai/AiStates";
import { useApp } from "@/lib/app-store";
import {
  generateEmail,
  type EmailAudience,
  type EmailLength,
  type EmailResult,
  type EmailTone,
} from "@/services/aiService";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/_authenticated/email")({
  head: () => ({
    meta: [
      { title: "Smart Email Generator | AI Workplace" },
      {
        name: "description",
        content:
          "Create clear, professional emails tailored to your audience, tone and length in seconds.",
      },
      { property: "og:title", content: "Smart Email Generator | AI Workplace" },
      {
        property: "og:description",
        content: "Create clear, professional emails tailored to your audience and tone.",
      },
    ],
  }),
  component: EmailPage,
});

const AUDIENCES: EmailAudience[] = ["Client", "Manager", "Team", "Colleague", "Supplier", "Other"];
const TONES: EmailTone[] = ["Formal", "Professional", "Friendly", "Informal", "Persuasive", "Concise"];
const LENGTHS: EmailLength[] = ["Short", "Medium", "Detailed"];

function EmailPage() {
  const { prefs, addHistory } = useApp();
  const [purpose, setPurpose] = useState("");
  const [audience, setAudience] = useState<EmailAudience>("Client");
  const [tone, setTone] = useState<EmailTone>(prefs.defaultTone);
  const [length, setLength] = useState<EmailLength>(prefs.defaultLength);
  const [context, setContext] = useState("");

  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [result, setResult] = useState<EmailResult | null>(null);
  const [editing, setEditing] = useState(false);
  const [touched, setTouched] = useState(false);

  const invalid = purpose.trim().length < 10;

  async function run() {
    setTouched(true);
    if (invalid) {
      toast.error("Tell the AI what the email should say (at least 10 characters).");
      return;
    }
    setStatus("loading");
    setEditing(false);
    toast.info("Generating...");
    try {
      const res = await generateEmail({ purpose, audience, tone, length, context });
      setResult(res);
      setStatus("success");
      toast.success("Generated successfully");
      addHistory({
        type: "email",
        title: res.subject,
        preview: res.body.replace(/\n+/g, " ").slice(0, 120),
        payload: res,
      });
    } catch {
      setStatus("error");
    }
  }

  function copy() {
    if (!result) return;
    void navigator.clipboard
      .writeText(`Subject: ${result.subject}\n\n${result.body}`)
      .then(() => toast.success("Copied to clipboard"))
      .catch(() => toast.error("Couldn't copy to clipboard"));
  }

  return (
    <AppLayout
      title="Smart Email Generator"
      description="Create clear, professional emails in seconds."
    >
      <div className="space-y-8">
        <section>
          <h2 className="text-2xl font-semibold tracking-tight text-foreground">
            Smart Email Generator
          </h2>
          <p className="mt-2 max-w-2xl text-muted-foreground">
            Create clear, professional emails tailored to your audience and communication style.
          </p>
        </section>

        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Email details</CardTitle>
              <CardDescription>Describe the message and we'll shape the rest.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="purpose">What would you like to say?</Label>
                <Textarea
                  id="purpose"
                  value={purpose}
                  onChange={(e) => setPurpose(e.target.value)}
                  onBlur={() => setTouched(true)}
                  placeholder="Example: Follow up with a client about an outstanding proposal..."
                  className={cn("min-h-28 resize-y", touched && invalid && "border-destructive")}
                />
                {touched && invalid ? (
                  <p className="text-xs text-destructive">
                    Add a little more detail so the AI knows what to write.
                  </p>
                ) : null}
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label>Audience</Label>
                  <Select value={audience} onValueChange={(v) => setAudience(v as EmailAudience)}>
                    <SelectTrigger className="w-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {AUDIENCES.map((a) => (
                        <SelectItem key={a} value={a}>
                          {a}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Tone</Label>
                  <Select value={tone} onValueChange={(v) => setTone(v as EmailTone)}>
                    <SelectTrigger className="w-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {TONES.map((t) => (
                        <SelectItem key={t} value={t}>
                          {t}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Email length</Label>
                <div className="grid grid-cols-3 gap-2">
                  {LENGTHS.map((l) => (
                    <Button
                      key={l}
                      type="button"
                      variant={length === l ? "default" : "outline"}
                      onClick={() => setLength(l)}
                      aria-pressed={length === l}
                    >
                      {l}
                    </Button>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="context">Additional context</Label>
                <Textarea
                  id="context"
                  value={context}
                  onChange={(e) => setContext(e.target.value)}
                  placeholder="Add any additional context..."
                  className="min-h-20 resize-y"
                />
              </div>

              <div className="flex flex-col gap-2 sm:flex-row">
                <Button size="lg" className="flex-1" onClick={run} disabled={status === "loading"}>
                  <Sparkles className="size-4" aria-hidden />
                  {status === "loading" ? "Generating..." : "Generate Email"}
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  onClick={() => {
                    setPurpose("");
                    setContext("");
                    setResult(null);
                    setStatus("idle");
                    setTouched(false);
                  }}
                >
                  Clear
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-start justify-between gap-3 space-y-0">
              <div>
                <CardTitle className="text-base">Generated Email</CardTitle>
                <CardDescription>Review before sending.</CardDescription>
              </div>
              {status === "success" ? <AiBadge /> : null}
            </CardHeader>
            <CardContent className="space-y-4">
              {status === "idle" ? (
                <EmptyState
                  icon={Mail}
                  title="No email yet"
                  description="Describe your message on the left and generate a draft you can edit."
                  hints={[
                    "Follow up with a client about an outstanding proposal",
                    "Ask my manager for approval on next quarter's budget",
                    "Tell the team about a change to Friday's deadline",
                  ]}
                />
              ) : null}

              {status === "loading" ? (
                <div className="space-y-4">
                  <AiThinking />
                  <AiSkeletonLines lines={7} />
                </div>
              ) : null}

              {status === "error" ? <ErrorState onRetry={run} /> : null}

              {status === "success" && result ? (
                <div className="space-y-4">
                  <div className="rounded-xl border border-border bg-muted/40 p-4">
                    <p className="text-xs font-semibold tracking-wider text-muted-foreground uppercase">
                      Subject
                    </p>
                    <p className="mt-1 text-sm font-medium text-foreground">{result.subject}</p>
                    {editing ? (
                      <Textarea
                        className="mt-4 min-h-72 resize-y bg-card font-normal"
                        value={result.body}
                        onChange={(e) => setResult({ ...result, body: e.target.value })}
                      />
                    ) : (
                      <p className="mt-4 text-sm leading-relaxed whitespace-pre-wrap text-foreground">
                        {result.body}
                      </p>
                    )}
                  </div>

                  <div className="flex flex-wrap gap-2">
                    <Button variant="outline" size="sm" onClick={copy}>
                      <Copy className="size-4" aria-hidden />
                      Copy
                    </Button>
                    <Button variant="outline" size="sm" onClick={run}>
                      <RefreshCw className="size-4" aria-hidden />
                      Regenerate
                    </Button>
                    <Button
                      variant={editing ? "default" : "outline"}
                      size="sm"
                      onClick={() => {
                        setEditing((e) => !e);
                        if (editing) toast.success("Changes saved");
                      }}
                    >
                      <Pencil className="size-4" aria-hidden />
                      {editing ? "Done editing" : "Edit"}
                    </Button>
                  </div>

                  <AiDisclaimer />
                </div>
              ) : null}
            </CardContent>
          </Card>
        </div>
      </div>
    </AppLayout>
  );
}
