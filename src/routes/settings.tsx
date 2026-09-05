import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Moon, Save, Sun, Laptop, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { AppLayout } from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { AiDisclaimer } from "@/components/ai/AiStates";
import { useApp, type ThemeMode } from "@/lib/app-store";
import type { EmailLength, EmailTone } from "@/services/aiService";

export const Route = createFileRoute("/settings")({
  head: () => ({
    meta: [
      { title: "Settings | AI Workplace Productivity Assistant" },
      {
        name: "description",
        content: "Update your profile, AI defaults, appearance and notification preferences.",
      },
      { property: "og:title", content: "Settings | AI Workplace Productivity Assistant" },
      {
        property: "og:description",
        content: "Update your profile, AI defaults, appearance and notification preferences.",
      },
    ],
  }),
  component: SettingsPage,
});

const TONES: EmailTone[] = ["Professional", "Friendly", "Formal", "Persuasive", "Apologetic"];
const LENGTHS: EmailLength[] = ["Short", "Medium", "Detailed"];
const THEMES: { value: ThemeMode; label: string; icon: typeof Sun }[] = [
  { value: "light", label: "Light", icon: Sun },
  { value: "dark", label: "Dark", icon: Moon },
  { value: "system", label: "System", icon: Laptop },
];

function SettingsPage() {
  const { profile, setProfile, prefs, setPrefs, clearHistory } = useApp();
  const [draft, setDraft] = useState(profile);

  return (
    <AppLayout title="Settings" description="Personalize your AI workspace.">
      <div className="max-w-3xl space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Profile</CardTitle>
            <CardDescription>Used to personalize greetings and generated content.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="name">Full name</Label>
                <Input
                  id="name"
                  value={draft.name}
                  onChange={(e) => setDraft({ ...draft, name: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email address</Label>
                <Input
                  id="email"
                  type="email"
                  value={draft.email}
                  onChange={(e) => setDraft({ ...draft, email: e.target.value })}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="job">Job title</Label>
              <Input
                id="job"
                value={draft.jobTitle}
                onChange={(e) => setDraft({ ...draft, jobTitle: e.target.value })}
              />
            </div>
            <Button
              onClick={() => {
                if (!draft.name.trim()) {
                  toast.error("Please enter your name.");
                  return;
                }
                setProfile(draft);
                toast.success("Profile updated");
              }}
            >
              <Save className="size-4" aria-hidden />
              Save changes
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">AI preferences</CardTitle>
            <CardDescription>Defaults applied when you generate new content.</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4 sm:grid-cols-3">
            <div className="space-y-2">
              <Label>Default tone</Label>
              <Select
                value={prefs.defaultTone}
                onValueChange={(v) => setPrefs({ defaultTone: v as EmailTone })}
              >
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {TONES.map((t) => (
                    <SelectItem key={t} value={t}>{t}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Default length</Label>
              <Select
                value={prefs.defaultLength}
                onValueChange={(v) => setPrefs({ defaultLength: v as EmailLength })}
              >
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {LENGTHS.map((l) => (
                    <SelectItem key={l} value={l}>{l}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Response style</Label>
              <Select
                value={prefs.responseStyle}
                onValueChange={(v) => setPrefs({ responseStyle: v as typeof prefs.responseStyle })}
              >
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {(["Balanced", "Direct", "Detailed"] as const).map((s) => (
                    <SelectItem key={s} value={s}>{s}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Appearance</CardTitle>
            <CardDescription>Choose how the workspace looks.</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-wrap gap-2">
            {THEMES.map(({ value, label, icon: Icon }) => (
              <Button
                key={value}
                type="button"
                variant={prefs.theme === value ? "default" : "outline"}
                onClick={() => setPrefs({ theme: value })}
              >
                <Icon className="size-4" aria-hidden />
                {label}
              </Button>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Notifications</CardTitle>
            <CardDescription>Decide what you want to hear about.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {[
              { key: "notifyGeneration", label: "Generation complete", desc: "Notify me when AI finishes a task." },
              { key: "notifyWeekly", label: "Weekly summary", desc: "A recap of your workspace activity." },
              { key: "notifyProduct", label: "Product updates", desc: "News about new AI features." },
            ].map(({ key, label, desc }) => (
              <div key={key} className="flex items-start justify-between gap-4">
                <div className="min-w-0">
                  <p className="text-sm font-medium text-foreground">{label}</p>
                  <p className="text-xs text-muted-foreground">{desc}</p>
                </div>
                <Switch
                  checked={prefs[key as "notifyGeneration" | "notifyWeekly" | "notifyProduct"]}
                  onCheckedChange={(checked) => setPrefs({ [key]: checked })}
                  aria-label={label}
                />
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Data</CardTitle>
            <CardDescription>Your activity is stored on this device only.</CardDescription>
          </CardHeader>
          <CardContent>
            <Button
              variant="outline"
              onClick={() => {
                clearHistory();
                toast.success("History cleared");
              }}
            >
              <Trash2 className="size-4" aria-hidden />
              Clear activity history
            </Button>
          </CardContent>
        </Card>

        <AiDisclaimer />
      </div>
    </AppLayout>
  );
}
