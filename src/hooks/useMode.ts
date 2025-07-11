import { useLayoutEffect, useState } from 'react';

type Theme = 'light' | 'dark';

export function useMode(): [Theme, () => void] {
  const [mode, setMode] = useState<Theme>('light');

  useLayoutEffect(() => {
    const stored = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

    const initial: Theme =
      stored === 'dark' || stored === 'light'
        ? stored
        : prefersDark
        ? 'dark'
        : 'light';

    document.documentElement.setAttribute('data-theme', initial);
    setMode(initial);
  }, []);

  const toggleMode = () => {
    const newMode = mode === 'dark' ? 'light' : 'dark';
    setMode(newMode);
    localStorage.setItem('theme', newMode);
    document.documentElement.setAttribute('data-theme', newMode);
  };

  return [mode, toggleMode];
}
