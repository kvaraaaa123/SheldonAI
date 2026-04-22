"use client";

import { createContext, useContext, useEffect, useState } from "react";

const STORAGE_KEY = "sheldon_theme";

type ThemeContextValue = {
  isDark: boolean;
  toggleTheme: () => void;
};

const ThemeContext = createContext<ThemeContextValue>({
  isDark: false,
  toggleTheme: () => {},
});

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    setIsDark(stored === "dark");
  }, []);

  function toggleTheme() {
    setIsDark(prev => {
      const next = !prev;
      localStorage.setItem(STORAGE_KEY, next ? "dark" : "light");
      return next;
    });
  }

  return (
    <ThemeContext.Provider value={{ isDark, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}
