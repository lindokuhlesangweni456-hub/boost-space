/**
 * AI service layer.
 *
 * All AI functionality in the app goes through this module so a real provider
 * (e.g. an OpenAI-backed server function) can replace the mock implementations
 * without touching any UI component.
 *
 * Real integration notes:
 *  - Never call a provider directly from the browser and never ship an API key
 *    in client code. Add a server endpoint that reads the key from an
 *    environment variable and forward these same payloads to it.
 *  - `AI_ENABLED` below flips to the live implementation once configured.
 */

export const AI_ENABLED = Boolean(import.meta.env["VITE_AI_ENABLED"]);

export type EmailAudience =
  | "Client"
  | "Manager"
  | "Team"
  | "Colleague"
  | "Supplier"
  | "Other";
export type EmailTone =
  | "Formal"
  | "Professional"
  | "Friendly"
  | "Informal"
  | "Persuasive"
  | "Concise";
export type EmailLength = "Short" | "Medium" | "Detailed";

export interface EmailRequest {
  purpose: string;
  audience: EmailAudience;
  tone: EmailTone;
  length: EmailLength;
  context?: string;
}

export interface EmailResult {
  subject: string;
  body: string;
}

export interface ActionItem {
  task: string;
  owner: string;
  deadline: string;
}

export interface MeetingSummary {
  title: string;
  executiveSummary: string;
  keyPoints: string[];
  decisions: string[];
  actionItems: ActionItem[];
  deadlines: { label: string; date: string }[];
}

export interface ChatTurn {
  role: "user" | "assistant";
  content: string;
}

const delay = (ms: number) => new Promise((r) => setTimeout(r, ms));

function rand<T>(items: T[]): T {
  return items[Math.floor(Math.random() * items.length)]!;
}

/** Simulated network/provider failures so error states are reachable. */
function maybeFail() {
  if (Math.random() < 0.06) {
    throw new Error(
      "Something went wrong while generating your response. Please try again.",
    );
  }
}

/* ------------------------------------------------------------------ email */

const GREETING: Record<EmailAudience, string[]> = {
  Client: ["Dear [Client Name],", "Hello [Client Name],"],
  Manager: ["Hi [Manager Name],", "Dear [Manager Name],"],
  Team: ["Hi team,", "Hello everyone,"],
  Colleague: ["Hi [Name],", "Hello [Name],"],
  Supplier: ["Dear [Supplier Name],", "Hello [Supplier Name],"],
  Other: ["Hello,", "Hi there,"],
};

const SIGN_OFF: Record<EmailTone, string[]> = {
  Formal: ["Yours sincerely,", "Kind regards,"],
  Professional: ["Kind regards,", "Best regards,"],
  Friendly: ["Thanks so much,", "All the best,"],
  Informal: ["Cheers,", "Thanks,"],
  Persuasive: ["Looking forward to your reply,", "Best regards,"],
  Concise: ["Regards,", "Thanks,"],
};

const OPENERS: Record<EmailTone, string[]> = {
  Formal: [
    "I hope this message finds you well.",
    "I trust you are keeping well.",
  ],
  Professional: [
    "I hope you are doing well.",
    "I hope your week is going well.",
  ],
  Friendly: ["Hope you're having a good week!", "Hope all is well on your side!"],
  Informal: ["Hope you're good.", "Quick one from me."],
  Persuasive: [
    "I wanted to reach out while the timing still works in our favour.",
    "I'm reaching out because I believe there's a clear opportunity here.",
  ],
  Concise: ["Quick note below.", "Short update from my side."],
};

function subjectFor(req: EmailRequest): string {
  const topic = summarizeTopic(req.purpose);
  return rand([
    `Follow-up: ${topic}`,
    `Regarding ${topic}`,
    `${topic} — next steps`,
    `Quick update on ${topic}`,
  ]);
}

function summarizeTopic(purpose: string): string {
  const cleaned = purpose.replace(/\s+/g, " ").trim();
  if (!cleaned) return "our recent discussion";
  const words = cleaned.split(" ").slice(0, 7).join(" ");
  return words.charAt(0).toUpperCase() + words.slice(1).replace(/[.,]$/, "");
}

export async function generateEmail(req: EmailRequest): Promise<EmailResult> {
  await delay(900 + Math.random() * 900);
  maybeFail();

  const topic = summarizeTopic(req.purpose);
  const greeting = rand(GREETING[req.audience]);
  const opener = rand(OPENERS[req.tone]);
  const signOff = rand(SIGN_OFF[req.tone]);

  const core = rand([
    `I'm writing to follow up on ${topic.toLowerCase()}. I'd like to make sure we're aligned on the next steps and that nothing is holding things up on your side.`,
    `I wanted to share a short update on ${topic.toLowerCase()} and confirm how we move forward from here.`,
    `I'm reaching out about ${topic.toLowerCase()}. Below is a summary of where things stand and what I'd suggest as the next step.`,
  ]);

  const detail = rand([
    "From our side everything is prepared, and we can move ahead as soon as we have your confirmation.",
    "I've reviewed the outstanding points and believe we can close them out this week with a short call.",
    "The remaining items are minor, and I'd be happy to walk you through them at a time that suits you.",
  ]);

  const persuasion =
    req.tone === "Persuasive"
      ? rand([
          "Acting on this in the coming days would let us keep the current timeline and avoid additional cost later.",
          "Moving now means we can lock in the current schedule, which is the outcome we both want.",
        ])
      : "";

  const contextLine = req.context?.trim()
    ? `For context: ${req.context.trim()}`
    : "";

  const closing = rand([
    "Please let me know if you'd like me to send anything further.",
    "Happy to adjust the approach if you'd prefer something different.",
    "Let me know a time that works and I'll set it up.",
  ]);

  const paragraphs: string[] = [];
  if (req.length === "Short") {
    paragraphs.push(core, closing);
  } else if (req.length === "Medium") {
    paragraphs.push(opener, core, detail);
    if (persuasion) paragraphs.push(persuasion);
    if (contextLine) paragraphs.push(contextLine);
    paragraphs.push(closing);
  } else {
    paragraphs.push(
      opener,
      core,
      detail,
      contextLine,
      persuasion,
      rand([
        "To keep things simple, I've outlined what I propose:\n\n1. Confirm the points above.\n2. Align on a realistic date.\n3. Share the final version for sign-off.",
        "Proposed next steps:\n\n1. A short review call this week.\n2. Agreement on the outstanding details.\n3. Written confirmation so we can proceed.",
      ]),
      closing,
    );
  }

  const body = [greeting, "", ...paragraphs.filter(Boolean).join("\n\n").split("\n"), "", signOff, "[Your Name]"].join(
    "\n",
  );

  return { subject: subjectFor(req), body };
}

/* --------------------------------------------------------------- meetings */

const NAMES = ["Sarah", "John", "Priya", "Daniel", "Amina", "Thabo", "Elena"];

function futureDate(offsetDays: number): string {
  const d = new Date();
  d.setDate(d.getDate() + offsetDays);
  return d.toLocaleDateString(undefined, { day: "numeric", month: "long" });
}

function sentencesOf(text: string): string[] {
  return text
    .split(/\n|(?<=[.!?])\s+/)
    .map((s) => s.replace(/^[-*•\d.)\s]+/, "").trim())
    .filter((s) => s.length > 12);
}

export async function summarizeMeeting(
  notes: string,
  title?: string,
): Promise<MeetingSummary> {
  await delay(1100 + Math.random() * 900);
  maybeFail();

  const lines = sentencesOf(notes);
  const keyPoints = lines.slice(0, 5).map((l) => l.charAt(0).toUpperCase() + l.slice(1));

  const decisionLines = lines.filter((l) =>
    /decide|agree|approve|sign off|confirm|go ahead/i.test(l),
  );
  const decisions = (decisionLines.length ? decisionLines : lines.slice(5, 7)).slice(0, 3);

  const taskLines = lines.filter((l) =>
    /will |should |need to|action|follow up|send|prepare|draft|review/i.test(l),
  );
  const taskSource = (taskLines.length ? taskLines : lines).slice(0, 4);

  const actionItems: ActionItem[] = taskSource.map((l, i) => {
    const owner =
      NAMES.find((n) => new RegExp(`\\b${n}\\b`, "i").test(l)) ?? rand(NAMES);
    return {
      task: l.length > 90 ? `${l.slice(0, 87)}…` : l,
      owner,
      deadline: futureDate(3 + i * 4),
    };
  });

  const executiveSummary = [
    `The team met to discuss ${title?.trim() || "the current workstream"}.`,
    keyPoints[0]
      ? `The main focus was ${keyPoints[0].toLowerCase().replace(/\.$/, "")}.`
      : "",
    decisions.length
      ? `${decisions.length} decision${decisions.length > 1 ? "s were" : " was"} reached and ${actionItems.length} action item${actionItems.length === 1 ? "" : "s"} assigned with owners and deadlines.`
      : `${actionItems.length} follow-up action${actionItems.length === 1 ? "" : "s"} were captured with clear owners.`,
    "Progress will be reviewed at the next check-in.",
  ]
    .filter(Boolean)
    .join(" ");

  return {
    title: title?.trim() || "Untitled meeting",
    executiveSummary,
    keyPoints: keyPoints.length ? keyPoints : ["No distinct discussion points were detected in the notes."],
    decisions: decisions.length ? decisions : ["No formal decisions were recorded."],
    actionItems,
    deadlines: actionItems.map((a) => ({ label: a.task, date: a.deadline })),
  };
}

/* ------------------------------------------------------------------- chat */

function bulletBlock(items: string[]): string {
  return items.map((i) => `- ${i}`).join("\n");
}

export async function sendChatMessage(history: ChatTurn[]): Promise<string> {
  await delay(800 + Math.random() * 900);
  maybeFail();

  const last = [...history].reverse().find((t) => t.role === "user")?.content ?? "";
  const prevAssistant = [...history].reverse().find((t) => t.role === "assistant")?.content;
  const q = last.toLowerCase();

  if (prevAssistant && /shorter|concise|trim|cut it down/.test(q)) {
    const trimmed = prevAssistant
      .split("\n")
      .filter((l) => l.trim())
      .slice(0, 6)
      .join("\n");
    return `**Shorter version**\n\n${trimmed}\n\nLet me know if you'd like it tighter still.`;
  }

  if (prevAssistant && /persuasive|stronger|more convincing/.test(q)) {
    return `**More persuasive version**\n\n${prevAssistant.replace(/I hope you are doing well\./g, "I'll get straight to the point.")}\n\nI've added a clearer reason to act and a direct next step at the end.`;
  }

  if (prevAssistant && /formal|polite|professional tone/.test(q)) {
    return `**More formal version**\n\n${prevAssistant}\n\nI've tightened the phrasing and removed casual language.`;
  }

  if (/email/.test(q)) {
    return `Here's a draft you can adapt:\n\n**Subject:** Update on our current project\n\nDear [Name],\n\nI hope you are doing well. I wanted to update you on where things stand and outline the next steps clearly.\n\n${bulletBlock([
      "**Current status:** the work is progressing, with one dependency outstanding.",
      "**Impact:** the delivery date shifts by a short, manageable margin.",
      "**Next step:** a 15-minute call this week to confirm the revised plan.",
    ])}\n\nKind regards,\n[Your Name]\n\nWould you like this shorter, friendlier or more persuasive?`;
  }

  if (/agenda/.test(q)) {
    return `**Team meeting agenda (45 minutes)**\n\n1. **Welcome and context** — 5 min\n2. **Progress since last meeting** — 10 min\n3. **Blockers and risks** — 10 min\n4. **Decisions needed today** — 10 min\n5. **Action items and owners** — 7 min\n6. **Close** — 3 min\n\nTip: send this out a day ahead so people arrive prepared.`;
  }

  if (/summar/.test(q)) {
    return `Paste the notes and I'll return:\n\n${bulletBlock([
      "**Executive summary** — a short paragraph anyone can skim.",
      "**Key points** — the discussion that mattered.",
      "**Decisions** — what was actually agreed.",
      "**Action items** — task, owner and deadline.",
    ])}\n\nYou can also use the Meeting Summarizer page for a structured report.`;
  }

  if (/prepare|preparation|prep/.test(q)) {
    return `**Preparing for your meeting**\n\n1. **Define the outcome** — what must be true when the meeting ends?\n2. **Share context early** — circulate documents at least a day ahead.\n3. **Anticipate objections** — list the two hardest questions and your answers.\n4. **Bring numbers** — one slide of facts beats ten of opinion.\n5. **Close with owners** — never end without who does what by when.`;
  }

  if (/checklist|follow.?up/.test(q)) {
    return `**Project follow-up checklist**\n\n${bulletBlock([
      "Confirm decisions in writing within 24 hours.",
      "Assign every action an owner and a date.",
      "Flag risks and dependencies to the sponsor.",
      "Update the shared plan or tracker.",
      "Schedule the next review before you close the call.",
    ])}`;
  }

  if (/rewrite|professional/.test(q)) {
    return `Paste the message and I'll rewrite it. I'll typically:\n\n${bulletBlock([
      "Lead with the point rather than the background.",
      "Replace vague wording with specifics.",
      "Keep sentences short and neutral in tone.",
      "End with one clear request.",
    ])}`;
  }

  return `Here's how I'd approach that:\n\n${bulletBlock([
    "**Clarify the goal** — what result would make this a success?",
    "**Gather the facts** — the details that change the answer.",
    "**Draft quickly** — a rough version is easier to improve than a blank page.",
    "**Refine tone** — ask me to make it shorter, friendlier or more persuasive.",
  ])}\n\nTell me more about the specifics and I'll produce a ready-to-use draft.`;
}
