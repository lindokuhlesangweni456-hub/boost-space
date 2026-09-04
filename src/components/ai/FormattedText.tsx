import type { ReactNode } from "react";

function inline(text: string, keyPrefix: string): ReactNode[] {
  return text.split(/(\*\*[^*]+\*\*)/g).map((part, i) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return (
        <strong key={`${keyPrefix}-b${i}`} className="font-semibold text-foreground">
          {part.slice(2, -2)}
        </strong>
      );
    }
    return <span key={`${keyPrefix}-t${i}`}>{part}</span>;
  });
}

/** Lightweight renderer for headings, bullets, numbered lists and bold text. */
export function FormattedText({ content }: { content: string }) {
  const blocks: ReactNode[] = [];
  const lines = content.split("\n");
  let bullets: string[] = [];
  let numbers: string[] = [];

  const flush = (key: string) => {
    if (bullets.length) {
      blocks.push(
        <ul key={`ul-${key}`} className="list-disc space-y-1.5 pl-5">
          {bullets.map((b, i) => (
            <li key={i}>{inline(b, `ul-${key}-${i}`)}</li>
          ))}
        </ul>,
      );
      bullets = [];
    }
    if (numbers.length) {
      blocks.push(
        <ol key={`ol-${key}`} className="list-decimal space-y-1.5 pl-5">
          {numbers.map((b, i) => (
            <li key={i}>{inline(b, `ol-${key}-${i}`)}</li>
          ))}
        </ol>,
      );
      numbers = [];
    }
  };

  lines.forEach((raw, index) => {
    const line = raw.trimEnd();
    const key = String(index);
    if (/^#{1,3}\s+/.test(line)) {
      flush(key);
      blocks.push(
        <h4 key={`h-${key}`} className="text-sm font-semibold text-foreground">
          {line.replace(/^#{1,3}\s+/, "")}
        </h4>,
      );
      return;
    }
    if (/^[-*]\s+/.test(line)) {
      numbers.length && flush(`${key}-n`);
      bullets.push(line.replace(/^[-*]\s+/, ""));
      return;
    }
    if (/^\d+[.)]\s+/.test(line)) {
      bullets.length && flush(`${key}-b`);
      numbers.push(line.replace(/^\d+[.)]\s+/, ""));
      return;
    }
    flush(key);
    if (!line.trim()) return;
    blocks.push(
      <p key={`p-${key}`} className="leading-relaxed">
        {inline(line, `p-${key}`)}
      </p>,
    );
  });
  flush("end");

  return <div className="space-y-3 text-sm text-foreground">{blocks}</div>;
}
