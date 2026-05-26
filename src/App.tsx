import { lazy, Suspense, useMemo, useState } from "react";
import { Activity, BarChart3, BookOpen, Boxes, BrainCircuit, ClipboardList, HeartHandshake, Home, Network, Settings } from "lucide-react";
import { AdminGate } from "./components/AdminGate";
import { AdminDashboard } from "./pages/AdminDashboard";
import { AdoptionDashboard } from "./pages/AdoptionDashboard";
import { AppShell } from "./pages/AppShell";
import { BetaSignupPage } from "./pages/BetaSignupPage";
import { LandingPage } from "./pages/LandingPage";
import { NurseAdoptionPage } from "./pages/NurseAdoptionPage";
import { MoatDashboard } from "./pages/MoatDashboard";
import { DarkModeConceptLab } from "./pages/DarkModeConceptLab";
import { OntologyStudio } from "./pages/OntologyStudio";
import { SpecialtyLibrary } from "./pages/SpecialtyLibrary";
import { SettingsPage } from "./pages/SettingsPage";
import { ModuleIndexPage } from "./modules/ModuleIndexPage";
import { PublicDemoApp } from "./public-demo/PublicDemoApp";

const HealthcareCognitionHome = lazy(() =>
  import("./modules/healthcare-cognition/src").then((module) => ({ default: module.HealthcareCognitionHome }))
);

const routes = [
  { path: "/", label: "Marketing", icon: Home },
  { path: "/demo", label: "Demo", icon: Activity },
  { path: "/modules", label: "Modules", icon: Boxes },
  { path: "/modules/healthcare-cognition", label: "Cognition", icon: BrainCircuit },
  { path: "/app/new-session", label: "New Story", icon: ClipboardList },
  { path: "/app/library", label: "Library", icon: BookOpen },
  { path: "/app/admin", label: "Admin", icon: BarChart3 },
  { path: "/app/admin/adoption", label: "Adoption", icon: HeartHandshake },
  { path: "/app/admin/moat", label: "Workflow Intel", icon: BarChart3 },
  { path: "/app/ontology", label: "Ontology", icon: Network },
  { path: "/app/settings", label: "Settings", icon: Settings }
];

function currentPath() {
  return window.location.pathname === "/app" ? "/app/new-session" : window.location.pathname;
}

export default function App() {
  const [path, setPath] = useState(currentPath());
  const activeRoute = useMemo(() => routes.find((route) => route.path === path), [path]);
  const isPublicDemoRoute = path.startsWith("/demo/") || path.startsWith("/articles") || path.startsWith("/glossary");

  const navigate = (nextPath: string) => {
    window.history.pushState(null, "", nextPath);
    setPath(currentPath());
    const hash = nextPath.split("#")[1];
    if (hash) {
      window.requestAnimationFrame(() => document.getElementById(hash)?.scrollIntoView({ behavior: "smooth" }));
    }
  };

  window.onpopstate = () => setPath(currentPath());

  const renderPage = () => {
    if (isPublicDemoRoute) return <PublicDemoApp path={path} onNavigate={navigate} />;
    if (path === "/modules") return <ModuleIndexPage onNavigate={navigate} />;
    if (path === "/modules/healthcare-cognition" || path === "/narrativeiq/healthcare-cognition") {
      return (
        <Suspense fallback={<div className="min-h-screen bg-canvas p-8 text-ink">Loading Healthcare Cognition Lab...</div>}>
          <HealthcareCognitionHome onNavigate={navigate} />
        </Suspense>
      );
    }
    if (path === "/modules/new-patient-story") {
      return (
        <>
          <div className="border-b border-amber-200 bg-amber-50 px-5 py-3 text-center text-sm font-semibold text-amber-900">
            Internal NarrativeIQ module preview — not intended for public publishing.
          </div>
          <AppShell mode="demo" onNavigate={navigate} />
        </>
      );
    }
    if (path === "/lab/dark-mode") return <DarkModeConceptLab onNavigate={navigate} />;
    if (path === "/beta" || path === "/waitlist") return <BetaSignupPage onNavigate={navigate} />;
    if (path === "/app/adoption") return <NurseAdoptionPage />;
    if (activeRoute?.path === "/") return <LandingPage onNavigate={navigate} />;
    if (activeRoute?.path === "/app/library") return <SpecialtyLibrary />;
    if (activeRoute?.path === "/app/admin") return <AdminGate><AdminDashboard /></AdminGate>;
    if (activeRoute?.path === "/app/admin/adoption") return <AdminGate><AdoptionDashboard /></AdminGate>;
    if (activeRoute?.path === "/app/admin/moat") return <AdminGate><MoatDashboard /></AdminGate>;
    if (activeRoute?.path === "/app/ontology") return <OntologyStudio />;
    if (activeRoute?.path === "/app/settings") return <SettingsPage />;
    return <AppShell mode={activeRoute?.path === "/demo" ? "demo" : "blank"} onNavigate={navigate} />;
  };

  return (
    <div className="min-h-screen bg-canvas text-ink">
      {renderPage()}
      {!isPublicDemoRoute && <nav className="fixed bottom-3 left-1/2 z-50 w-[calc(100%-28px)] max-w-3xl -translate-x-1/2 overflow-x-auto rounded-[1.35rem] border border-white/70 bg-white/[0.78] px-1.5 py-1.5 shadow-[0_14px_38px_rgba(15,23,42,0.14)] backdrop-blur-[18px]">
        <div className="flex min-w-max items-center justify-between gap-0.5">
          {routes.map((route) => {
            const Icon = route.icon;
            const isActive = activeRoute?.path === route.path;
            const href = ["/app/admin", "/app/admin/adoption", "/app/admin/moat"].includes(route.path)
              ? `${route.path}?admin=demo`
              : route.path;
            return (
              <button
                key={route.path}
                className={`flex min-h-11 min-w-[66px] flex-col items-center justify-center rounded-2xl px-1.5 text-[10px] font-semibold transition duration-200 ${
                  isActive ? "border border-blue-200 bg-blue-50 text-blue-800 shadow-lift ring-1 ring-blue-200" : "border border-transparent text-muted hover:bg-white/70 hover:text-ink"
                }`}
                onClick={() => navigate(href)}
                type="button"
                title={route.label}
              >
                <Icon size={17} />
                <span>{route.label}</span>
              </button>
            );
          })}
        </div>
      </nav>}
    </div>
  );
}
