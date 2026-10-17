"use client";

import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";

export default function ThemeToggle() {
  const [theme, setTheme] = useState<"dark" | "light">("light");

  useEffect(() => {
    const saved = localStorage.getItem("pulsewatch_theme") as "dark" | "light" | null;
    if (saved) {
      setTheme(saved);
      document.documentElement.setAttribute("data-theme", saved);
    } else {
      setTheme("light");
      document.documentElement.setAttribute("data-theme", "light");
    }
  }, []);

  const toggle = () => {
    const next = theme === "dark" ? "light" : "dark";
    setTheme(next);
    localStorage.setItem("pulsewatch_theme", next);
    document.documentElement.setAttribute("data-theme", next);
  };

  return (
    <button
      onClick={toggle}
      className="w-9 h-9 rounded-xl flex items-center justify-center border border-[var(--border)] bg-[var(--surface)] text-[var(--muted)] hover:text-[var(--foreground)] hover:border-[var(--border-hi)] shadow-sm transition-all"
      title={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
      aria-label="Toggle theme"
    >
      {theme === "dark" ? <Sun size={17} className="text-amber-400" /> : <Moon size={17} className="text-slate-700" />}
    </button>
  );
}
