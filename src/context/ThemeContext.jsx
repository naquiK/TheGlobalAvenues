import { createContext, useEffect, useMemo, useState } from 'react';

export const ThemeContext = createContext(undefined);
const THEME_STORAGE_KEY = 'tga-theme-preference';
const LEGACY_THEME_SESSION_KEY = 'tga-theme-session';

const getInitialTheme = () => {
  if (typeof window === 'undefined') {
    return 'light';
  }

  try {
    const storedTheme = window.localStorage.getItem(THEME_STORAGE_KEY);
    if (storedTheme === 'light' || storedTheme === 'dark') {
      return storedTheme;
    }

    const legacyTheme = window.sessionStorage.getItem(LEGACY_THEME_SESSION_KEY);
    if (legacyTheme === 'light' || legacyTheme === 'dark') {
      window.localStorage.setItem(THEME_STORAGE_KEY, legacyTheme);
      return legacyTheme;
    }
  } catch (error) {
    // Ignore storage access issues and fall back to default light.
  }

  return 'light';
};

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(getInitialTheme);

  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }

    const root = window.document.documentElement;
    root.classList.toggle('dark', theme === 'dark');

    try {
      window.localStorage.setItem(THEME_STORAGE_KEY, theme);
      window.sessionStorage.removeItem(LEGACY_THEME_SESSION_KEY);
    } catch (error) {
      // Ignore storage access issues; theme still updates in DOM.
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme((currentTheme) => (currentTheme === 'dark' ? 'light' : 'dark'));
  };

  const value = useMemo(
    () => ({
      theme,
      toggleTheme,
      isDark: theme === 'dark',
    }),
    [theme]
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}
