import { Link, useRouterState } from "@tanstack/react-router";
import { useEffect, useState, type ReactNode } from "react";
import {
  Bell,
  Bot,
  Clock,
  FileText,
  LayoutDashboard,
  Mail,
  Menu,
  Search,
  Settings,
  Sparkles,
  type LucideIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { AiDisclaimer } from "@/components/ai/AiStates";
import { useApp } from "@/lib/app-store";
import { cn } from "@/lib/utils";

interface NavItem {
  to: string;
  label: string;
  icon: LucideIcon;
}

const PRIMARY_NAV: NavItem[] = [
  { to: "/", label: "Dashboard", icon: LayoutDashboard },
  { to: "/email", label: "Smart Email", icon: Mail },
  { to: "/meetings", label: "Meeting Summarizer", icon: FileText },
  { to: "/assistant", label: "AI Assistant", icon: Sparkles },
];

const SECONDARY_NAV: NavItem[] = [
  { to: "/history", label: "History", icon: Clock },
  { to: "/settings", label: "Settings", icon: Settings },
];

function initials(name: string) {
  return name
    .split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

function NavLinks({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  const render = (items: NavItem[]) =>
    items.map(({ to, label, icon: Icon }) => {
      const active = to === "/" ? pathname === "/" : pathname.startsWith(to);
      return (
        <Link
          key={to}
          to={to}
          onClick={onNavigate}
          aria-current={active ? "page" : undefined}
          className={cn(
            "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
            active
              ? "bg-sidebar-accent text-sidebar-accent-foreground"
              : "text-muted-foreground hover:bg-sidebar-accent/60 hover:text-sidebar-accent-foreground",
          )}
        >
          <Icon className="size-4 shrink-0" aria-hidden />
          <span className="truncate">{label}</span>
        </Link>
      );
    });

  return (
    <nav className="flex flex-1 flex-col gap-6 overflow-y-auto px-3 py-4">
      <div className="space-y-1">
        <p className="px-3 pb-1 text-[11px] font-semibold tracking-wider text-muted-foreground uppercase">
          Workspace
        </p>
        {render(PRIMARY_NAV)}
      </div>
      <div className="space-y-1">
        <p className="px-3 pb-1 text-[11px] font-semibold tracking-wider text-muted-foreground uppercase">
          Library
        </p>
        {render(SECONDARY_NAV)}
      </div>
    </nav>
  );
}

function SidebarBrand() {
  return (
    <Link to="/" className="flex items-center gap-3 border-b border-sidebar-border px-5 py-4">
      <span className="flex size-9 items-center justify-center rounded-xl bg-primary text-primary-foreground">
        <Bot className="size-5" aria-hidden />
      </span>
      <span className="flex flex-col leading-tight">
        <span className="text-sm font-semibold text-foreground">AI Workplace</span>
        <span className="text-xs text-muted-foreground">Productivity Assistant</span>
      </span>
    </Link>
  );
}

function SidebarFooter() {
  const { profile } = useApp();
  return (
    <div className="border-t border-sidebar-border p-3">
      <div className="flex items-center gap-3 rounded-lg px-2 py-2">
        <Avatar className="size-9">
          <AvatarFallback className="bg-accent text-xs font-semibold text-accent-foreground">
            {initials(profile.name)}
          </AvatarFallback>
        </Avatar>
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-medium text-foreground">{profile.name}</p>
          <p className="truncate text-xs text-muted-foreground">{profile.jobTitle}</p>
        </div>
        <Button asChild variant="ghost" size="icon" aria-label="Open settings">
          <Link to="/settings">
            <Settings className="size-4" aria-hidden />
          </Link>
        </Button>
      </div>
    </div>
  );
}

export function AppLayout({
  title,
  description,
  children,
  contentClassName,
}: {
  title: string;
  description: string;
  children: ReactNode;
  contentClassName?: string;
}) {
  const { profile } = useApp();
  const [open, setOpen] = useState(false);
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  return (
    <div className="flex min-h-screen w-full bg-background">
      <aside className="fixed inset-y-0 left-0 hidden w-[250px] flex-col border-r border-sidebar-border bg-sidebar lg:flex">
        <SidebarBrand />
        <NavLinks />
        <SidebarFooter />
      </aside>

      <div className="flex min-w-0 flex-1 flex-col lg:pl-[250px]">
        <header className="sticky top-0 z-30 flex items-center gap-3 border-b border-border bg-background/85 px-4 py-3 backdrop-blur md:px-8">
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="lg:hidden" aria-label="Open navigation">
                <Menu className="size-5" aria-hidden />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[270px] bg-sidebar p-0">
              <SheetTitle className="sr-only">Navigation</SheetTitle>
              <div className="flex h-full flex-col">
                <SidebarBrand />
                <NavLinks onNavigate={() => setOpen(false)} />
                <SidebarFooter />
              </div>
            </SheetContent>
          </Sheet>

          <div className="min-w-0 flex-1">
            <h1 className="truncate text-base font-semibold text-foreground md:text-lg">{title}</h1>
            <p className="hidden truncate text-sm text-muted-foreground sm:block">{description}</p>
          </div>

          <div className="flex items-center gap-1">
            <Button variant="ghost" size="icon" aria-label="Search" className="hidden sm:inline-flex">
              <Search className="size-4" aria-hidden />
            </Button>
            <Button variant="ghost" size="icon" aria-label="Notifications" className="relative">
              <Bell className="size-4" aria-hidden />
              <span className="absolute top-2 right-2 size-1.5 rounded-full bg-primary" aria-hidden />
            </Button>
            <Avatar className="ml-1 size-8">
              <AvatarFallback className="bg-accent text-[11px] font-semibold text-accent-foreground">
                {initials(profile.name)}
              </AvatarFallback>
            </Avatar>
          </div>
        </header>

        <main className={cn("mx-auto w-full max-w-6xl flex-1 px-4 py-6 md:px-8 md:py-8", contentClassName)}>
          {children}
        </main>

        <footer className="border-t border-border px-4 py-5 md:px-8">
          <div className="mx-auto max-w-6xl">
            <AiDisclaimer />
          </div>
        </footer>
      </div>
    </div>
  );
}
