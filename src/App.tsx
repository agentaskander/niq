import { useMemo, useState } from "react";
import { Activity, BarChart3, BookOpen, ClipboardList, HeartHandshake, Home, Settings } from "lucide-react";
import { AdminDashboard } from "./pages/AdminDashboard";
import { AppShell } from "./pages/AppShell";
import { LandingPage } from "./pages/LandingPage";
import { NurseAdoptionPage } from "./pages/NurseAdoptionPage";
import { SpecialtyLibrary } from "./pages/SpecialtyLibrary";
import { SettingsPage } from "./pages/SettingsPage";

const routes = [
  { path: "/", label: "Home", icon: Home },
  { path: "/demo", label: "Demo", icon: Activity },
  { path: "/app", label: "App", icon: ClipboardList },
  { path: "/app/new-session", label: "New", icon: ClipboardList },
  { path: "/app/library", label: "Library", icon: BookOpen },
  { path: "/app/admin", label: "Admin", icon: BarChart3 },
  { path: "/app/adoption", label: "Adopt", icon: HeartHandshake },
  { path: "/app/settings", label: "Settings", icon: Settings }
];

function currentPath() {
  return window.location.pathname === "/demo" ? "/app/new-session" : window.location.pathname;
}

export default function App() {
  const [path, setPath] = useState(currentPath());
  const activeRoute = useMemo(() => routes.find((route) => route.path === path) ?? routes[0], [path]);

  const navigate = (nextPath: string) => {
    window.history.pushState(null, "", nextPath);
    setPath(currentPath());
  };

  window.onpopstate = () => setPath(currentPath());

  const renderPage = () => {
    if (activeRoute.path === "/") return <LandingPage onNavigate={navigate} />;
    if (activeRoute.path === "/app/library") return <SpecialtyLibrary />;
    if (activeRoute.path === "/app/admin") return <AdminDashboard />;
    if (activeRoute.path === "/app/adoption") return <NurseAdoptionPage />;
    if (activeRoute.path === "/app/settings") return <SettingsPage />;
    return <AppShell />;
  };

  return (
    <div className="min-h-screen bg-canvas text-ink">
      {renderPage()}
      {activeRoute.path !== "/" && (
        <nav className="fixed bottom-3 left-1/2 z-50 flex w-[calc(100%-24px)] max-w-md -translate-x-1/2 items-center justify-between rounded-3xl border border-line bg-white/90 px-2 py-2 shadow-soft backdrop-blur">
          {routes.slice(1).map((route) => {
            const Icon = route.icon;
            const isActive = activeRoute.path === route.path;
            return (
              <button
                key={route.path}
                className={`flex min-h-12 flex-1 flex-col items-center justify-center rounded-xl text-[11px] transition ${
                  isActive ? "bg-soft-blue text-blue" : "text-muted hover:bg-hover hover:text-ink"
                }`}
                onClick={() => navigate(route.path)}
                type="button"
                title={route.label}
              >
                <Icon size={17} />
                <span>{route.label}</span>
              </button>
            );
          })}
        </nav>
      )}
    </div>
  );
}
