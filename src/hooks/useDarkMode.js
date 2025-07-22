import { useEffect, useState } from 'react';

export function useDarkMode() {
  const [dark, setDark] = useState(() => localStorage.theme === 'dark');

  useEffect(() => {
    if (dark) {
      document.documentElement.classList.add('dark');
      localStorage.theme = 'dark';
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.theme = 'light';
    }
  }, [dark]);

  return [dark, () => setDark((d) => !d)];
}