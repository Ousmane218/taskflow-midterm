import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';
import { ThemeColors, ThemeMode, themes } from '@/constants/theme';
import {
  loadThemeFromStorage,
  resetThemeInStorage,
  saveThemeToStorage,
} from '@/services/storage';

interface ThemeContextValue {
  theme: ThemeMode;
  colors: ThemeColors;
  isDark: boolean;
  toggleTheme: () => void;
  resetTheme: () => Promise<void>;
}

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<ThemeMode>('light');

  useEffect(() => {
    let isMounted = true;

    async function restoreTheme() {
      const savedTheme = await loadThemeFromStorage();
      if (isMounted && savedTheme) {
        setTheme(savedTheme);
      }
    }

    restoreTheme();

    return () => {
      isMounted = false;
    };
  }, []);

  const toggleTheme = useCallback(() => {
    setTheme((prevTheme) => {
      const nextTheme: ThemeMode = prevTheme === 'light' ? 'dark' : 'light';
      saveThemeToStorage(nextTheme);
      return nextTheme;
    });
  }, []);

  const resetTheme = useCallback(async () => {
    await resetThemeInStorage();
    setTheme('light');
  }, []);

  const value: ThemeContextValue = {
    theme,
    colors: themes[theme],
    isDark: theme === 'dark',
    toggleTheme,
    resetTheme,
  };

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
}

export function useTheme(): ThemeContextValue {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}
