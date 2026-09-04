import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { EmailLength, EmailTone } from "@/services/aiService";

export type HistoryType = "email" | "meeting" | "chat";

export interface HistoryItem {
  id: string;
  type: HistoryType;
  title: string;
  preview: string;
  createdAt: string;
  payload?: unknown;
}

export interface Profile {
  name: string;
  email: string;
  jobTitle: string;
}

export type ThemeMode = "light" | "dark" | "system";

export interface Preferences {
  defaultTone: EmailTone;
  defaultLength: EmailLength;
  responseStyle: "Balanced" | "Direct" | "Detailed";
  theme: ThemeMode;
  notifyGeneration: boolean;
  notifyWeekly: boolean;
  notifyProduct: boolean;
}

interface AppState {
  profile: Profile;
  setProfile: (p: Profile) => void;
  prefs: Preferences;
  setPrefs: (p: Partial<Preferences>) => void;
  history: HistoryItem[];
  addHistory: (item: Omit<HistoryItem, "id" | "createdAt">) => HistoryItem;
  clearHistory: () => void;
  hydrated: boolean;
}

const DEFAULT_PROFILE: Profile = {
  name: "Alex Morgan",
  email: "alex.morgan@company.com",
  jobTitle: "Professional",
};

const DEFAULT_PREFS: Preferences = {
  defaultTone: "Professional",
  defaultLength: "Medium",
  responseStyle: "Balanced",
  theme: "light",
  notifyGeneration: true,
  notifyWeekly: false,
  notifyProduct: false,
};

const SEED_HISTORY: HistoryItem[] = [
  {
    id: "seed-1",
    type: "email",
    title: "Client follow-up email generated",
    preview: "Follow-up Regarding Project Proposal — Dear [Client Name], I hope you are doing well…",
    createdAt: new Date(Date.now() - 1000 * 60 * 42).toISOString(),
  },
  {
    id: "seed-2",
    type: "meeting",
    title: "Q3 planning meeting summarized",
    preview: "5 key points, 2 decisions and 4 action items captured with owners and deadlines.",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(),
  },
  {
    id: "seed-3",
    type: "chat",
    title: "AI conversation about hiring plan",
    preview: "Discussed how to structure interview feedback and share it with the panel.",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 27).toISOString(),
  },
  {
    id: "seed-4",
    type: "meeting",
    title: "Action items extracted from standup",
    preview: "3 tasks assigned across the design and engineering leads.",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 50).toISOString(),
  },
];

const STORAGE_KEY = "aiw:state:v1";

const AppContext = createContext<AppState | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [profile, setProfileState] = useState<Profile>(DEFAULT_PROFILE);
  const [prefs, setPrefsState] = useState<Preferences>(DEFAULT_PREFS);
  const [history, setHistory] = useState<HistoryItem[]>(SEED_HISTORY);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as Partial<{
          profile: Profile;
          prefs: Preferences;
          history: HistoryItem[];
        }>;
        if (parsed.profile) setProfileState({ ...DEFAULT_PROFILE, ...parsed.profile });
        if (parsed.prefs) setPrefsState({ ...DEFAULT_PREFS, ...parsed.prefs });
        if (parsed.history) setHistory(parsed.history);
      }
    } catch {
      /* ignore corrupt storage */
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      window.localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({ profile, prefs, history }),
      );
    } catch {
      /* storage unavailable */
    }
  }, [profile, prefs, history, hydrated]);

  useEffect(() => {
    if (!hydrated) return;
    const root = document.documentElement;
    const prefersDark =
      window.matchMedia?.("(prefers-color-scheme: dark)").matches ?? false;
    const dark = prefs.theme === "dark" || (prefs.theme === "system" && prefersDark);
    root.classList.toggle("dark", dark);
  }, [prefs.theme, hydrated]);

  const setPrefs = useCallback((patch: Partial<Preferences>) => {
    setPrefsState((prev) => ({ ...prev, ...patch }));
  }, []);

  const addHistory = useCallback(
    (item: Omit<HistoryItem, "id" | "createdAt">) => {
      const entry: HistoryItem = {
        ...item,
        id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
        createdAt: new Date().toISOString(),
      };
      setHistory((prev) => [entry, ...prev].slice(0, 100));
      return entry;
    },
    [],
  );

  const clearHistory = useCallback(() => setHistory([]), []);

  const value = useMemo<AppState>(
    () => ({
      profile,
      setProfile: setProfileState,
      prefs,
      setPrefs,
      history,
      addHistory,
      clearHistory,
      hydrated,
    }),
    [profile, prefs, history, addHistory, clearHistory, setPrefs, hydrated],
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp(): AppState {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used inside AppProvider");
  return ctx;
}

export function formatWhen(iso: string): string {
  const date = new Date(iso);
  const now = new Date();
  const time = date.toLocaleTimeString(undefined, {
    hour: "numeric",
    minute: "2-digit",
  });
  const sameDay = date.toDateString() === now.toDateString();
  const yesterday = new Date(now);
  yesterday.setDate(now.getDate() - 1);
  if (sameDay) return `Today, ${time}`;
  if (date.toDateString() === yesterday.toDateString()) return `Yesterday, ${time}`;
  return `${date.toLocaleDateString(undefined, { day: "numeric", month: "short" })}, ${time}`;
}
