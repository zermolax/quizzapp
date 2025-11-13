/**
 * useTheme.js - Custom Hook pentru Dark Mode
 *
 * Centralizează logica pentru dark/light mode.
 * Salvează preferința în localStorage și sincronizează cu DOM.
 *
 * Usage:
 * const { isDark, toggle } = useTheme();
 */

import { useState, useEffect } from 'react';

export function useTheme() {
  const [isDark, setIsDark] = useState(() => {
    // Initialize from localStorage
    const saved = localStorage.getItem('theme');
    return saved === 'dark';
  });

  useEffect(() => {
    // Update DOM and localStorage when theme changes
    if (isDark) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDark]);

  const toggle = () => setIsDark(prev => !prev);

  return {
    isDark,
    toggle,
    setTheme: setIsDark, // For explicit setting
  };
}

export default useTheme;
