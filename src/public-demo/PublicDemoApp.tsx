import { useEffect } from "react";
import { PublicDemoPage } from "./PublicDemoPage";
import "./styles.css";

type PublicDemoAppProps = {
  path: string;
  onNavigate: (path: string) => void;
};

export function PublicDemoApp({ path, onNavigate }: PublicDemoAppProps) {
  useEffect(() => {
    const targetId = window.location.hash.slice(1);
    if (targetId) {
      window.requestAnimationFrame(() => document.getElementById(targetId)?.scrollIntoView({ behavior: "smooth" }));
      return;
    }
    try {
      window.scrollTo({ top: 0, behavior: "instant" });
    } catch {
      // jsdom does not implement scrollTo; browsers do.
    }
  }, [path]);

  useEffect(() => {
    if (!("IntersectionObserver" in window)) {
      document.querySelectorAll("[data-niq-reveal]").forEach((target) => target.classList.add("is-visible"));
      return undefined;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { rootMargin: "120px 0px" }
    );
    document.querySelectorAll("[data-niq-reveal]:not(.is-visible)").forEach((target) => observer.observe(target));
    return () => observer.disconnect();
  }, [path]);

  return (
    <div className="niq-public-demo">
      <PublicDemoPage path={path.replace(/\/$/, "") || "/demo"} onNavigate={onNavigate} />
    </div>
  );
}
