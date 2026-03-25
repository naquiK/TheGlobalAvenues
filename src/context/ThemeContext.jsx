import { createContext, useEffect, useMemo, useState } from 'react';

export const ThemeContext = createContext(undefined);
const THEME_SESSION_KEY = 'tga-theme-session';

const getInitialTheme = () => {
  if (typeof window === 'undefined') {
    return 'dark';
  }

  try {
    const storedTheme = window.sessionStorage.getItem(THEME_SESSION_KEY);
    if (storedTheme === 'light' || storedTheme === 'dark') {
      return storedTheme;
    }
  } catch (error) {
    // Ignore storage access issues and fall back to default dark.
  }

  return 'dark';
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
      window.sessionStorage.setItem(THEME_SESSION_KEY, theme);
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
