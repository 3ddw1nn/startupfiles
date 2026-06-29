"use client";

import { useEffect, useState } from "react";

type ThemeMode = "light" | "dark";

function getSystemTheme(): ThemeMode {
  if (typeof window === "undefined") {
    return "light";
  }

  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

function applyTheme(theme: ThemeMode) {
  document.documentElement.dataset.theme = theme;
  document.documentElement.style.colorScheme = theme;
}

export function ThemeToggle() {
  const [theme, setTheme] = useState<ThemeMode>("light");

  useEffect(() => {
    const storedTheme = window.localStorage.getItem("startupfiles-theme");
    const nextTheme = storedTheme === "light" || storedTheme === "dark" ? storedTheme : getSystemTheme();
    setTheme(nextTheme);
    applyTheme(nextTheme);
  }, []);

  const toggleTheme = () => {
    const nextTheme = theme === "dark" ? "light" : "dark";
    setTheme(nextTheme);
    window.localStorage.setItem("startupfiles-theme", nextTheme);
    applyTheme(nextTheme);
  };

  return (
    <button
      type="button"
      className="inline-flex h-[42px] w-[42px] items-center justify-center rounded-xl border border-[var(--border)] bg-[var(--panel-strong)] p-0 text-[var(--text)] shadow-none transition-colors hover:bg-[color-mix(in_srgb,var(--accent)_8%,transparent)]"
      onClick={toggleTheme}
      aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
      title={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
    >
      <span
        className="inline-flex h-[18px] w-[18px] items-center justify-center text-[var(--accent-strong)]"
        aria-hidden="true"
      >
        {theme === "dark" ? (
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="block h-[18px] w-[18px]"
          >
            <circle cx="12" cy="12" r="4.5" />
            <path d="M12 2.75v2.5M12 18.75v2.5M21.25 12h-2.5M5.25 12h-2.5M18.54 5.46l-1.77 1.77M7.23 16.77l-1.77 1.77M18.54 18.54l-1.77-1.77M7.23 7.23 5.46 5.46" />
          </svg>
        ) : (
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="block h-[18px] w-[18px]"
          >
            <path d="M20.5 14.2A8.5 8.5 0 1 1 9.8 3.5a7 7 0 0 0 10.7 10.7Z" />
          </svg>
        )}
      </span>
    </button>
  );
}
