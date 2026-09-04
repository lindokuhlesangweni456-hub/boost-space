import { AlertTriangle, Info, Loader2, type LucideIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function AiThinking({
  label = "AI is thinking...",
  className,
}: {
  label?: string;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex items-center gap-3 rounded-xl border border-border bg-muted/50 px-4 py-3",
        className,
      )}
      role="status"
      aria-live="polite"
    >
      <Loader2 className="size-4 animate-spin text-primary" aria-hidden />
      <span className="text-sm font-medium text-foreground">{label}</span>
      <span className="flex items-center gap-1" aria-hidden>
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            className="size-1.5 animate-pulse rounded-full bg-primary/60"
            style={{ animationDelay: `${i * 160}ms` }}
          />
        ))}
      </span>
    </div>
  );
}

export function AiSkeletonLines({ lines = 5 }: { lines?: number }) {
  return (
    <div className="space-y-3" aria-hidden>
      {Array.from({ length: lines }).map((_, i) => (
        <div
          key={i}
          className="h-3 animate-pulse rounded-full bg-muted"
          style={{ width: `${70 + ((i * 13) % 30)}%` }}
        />
      ))}
    </div>
  );
}

export function ErrorState({
  message = "Something went wrong while generating your response. Please try again.",
  onRetry,
}: {
  message?: string;
  onRetry?: () => void;
}) {
  return (
    <div className="rounded-xl border border-destructive/30 bg-destructive/5 p-5">
      <div className="flex items-start gap-3">
        <AlertTriangle className="mt-0.5 size-5 shrink-0 text-destructive" aria-hidden />
        <div className="space-y-3">
          <p className="text-sm text-foreground">{message}</p>
          {onRetry ? (
            <Button size="sm" variant="outline" onClick={onRetry}>
              Try Again
            </Button>
          ) : null}
        </div>
      </div>
    </div>
  );
}

export function EmptyState({
  icon: Icon,
  title,
  description,
  hints,
}: {
  icon: LucideIcon;
  title: string;
  description: string;
  hints?: string[];
}) {
  return (
    <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border bg-muted/30 px-6 py-12 text-center">
      <span className="mb-4 flex size-12 items-center justify-center rounded-full bg-accent text-accent-foreground">
        <Icon className="size-6" aria-hidden />
      </span>
      <h3 className="text-base font-semibold text-foreground">{title}</h3>
      <p className="mt-1 max-w-md text-sm text-muted-foreground">{description}</p>
      {hints?.length ? (
        <ul className="mt-5 w-full max-w-md space-y-2 text-left">
          {hints.map((hint) => (
            <li
              key={hint}
              className="rounded-lg border border-border bg-card px-3 py-2 text-sm text-muted-foreground"
            >
              {hint}
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}

export function AiDisclaimer({ className }: { className?: string }) {
  return (
    <p
      className={cn(
        "flex items-start gap-2 text-xs leading-relaxed text-muted-foreground",
        className,
      )}
    >
      <Info className="mt-0.5 size-3.5 shrink-0" aria-hidden />
      <span>
        AI-generated content may contain inaccuracies. Review and verify important
        information before using it in professional communication or decision-making.
      </span>
    </p>
  );
}

export function AiBadge() {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-accent px-2.5 py-1 text-[11px] font-medium tracking-wide text-accent-foreground uppercase">
      <span className="size-1.5 rounded-full bg-primary" aria-hidden />
      AI Generated
    </span>
  );
}
