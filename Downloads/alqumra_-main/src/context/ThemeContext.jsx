import { createContext, useContext, useState, useEffect } from 'react';

/* ─── 6 themes ─── */
export const THEMES = {
  dark: {
    label: 'Nuit',
    icon: '🌑',
    vars: {
      '--bg-void':       '#0c0d0f',
      '--bg-dark':       '#141618',
      '--bg-card':       '#1c1f22',
      '--bg-card-hover': '#272b30',
      '--bg-surface':    '#111315',
      '--text-primary':  '#e8ecef',
      '--text-secondary':'#adb5bd',
      '--text-muted':    '#565c64',
      '--accent':        '#adb5bd',
      '--accent-bright': '#ced4da',
      '--accent-dark':   '#858e96',
      '--ivory':         '#e8ecef',
      '--border':        'rgba(173,181,189,0.12)',
      '--border-bright': 'rgba(173,181,189,0.28)',
      '--shadow-sm':     '0 2px 8px rgba(0,0,0,0.6)',
      '--shadow-md':     '0 4px 20px rgba(0,0,0,0.75)',
      '--shadow-lg':     '0 8px 40px rgba(0,0,0,0.9)',
      '--shadow-glow':   '0 0 20px rgba(133,142,150,0.12)',
      '--gradient-hero': 'linear-gradient(180deg, rgba(12,13,15,0) 0%, rgba(12,13,15,0.7) 60%, #0c0d0f 100%)',
      '--gradient-card': 'linear-gradient(135deg, #1c1f22 0%, #141618 100%)',
      '--gradient-gold': 'linear-gradient(90deg, #383d43, #565c64, #858e96, #565c64, #383d43)',
    },
  },
  light: {
    label: 'Jour',
    icon: '☀️',
    vars: {
      '--bg-void':       '#ced4da',
      '--bg-dark':       '#adb5bd',
      '--bg-card':       '#e8ecef',
      '--bg-card-hover': '#f1f3f5',
      '--bg-surface':    '#d8dde2',
      '--text-primary':  '#0c0d0f',
      '--text-secondary':'#272b30',
      '--text-muted':    '#565c64',
      '--accent':        '#383d43',
      '--accent-bright': '#1c1f22',
      '--accent-dark':   '#565c64',
      '--ivory':         '#0c0d0f',
      '--border':        'rgba(39,43,48,0.15)',
      '--border-bright': 'rgba(39,43,48,0.32)',
      '--shadow-sm':     '0 2px 8px rgba(0,0,0,0.10)',
      '--shadow-md':     '0 4px 20px rgba(0,0,0,0.14)',
      '--shadow-lg':     '0 8px 40px rgba(0,0,0,0.20)',
      '--shadow-glow':   '0 0 20px rgba(39,43,48,0.10)',
      '--gradient-hero': 'linear-gradient(180deg, rgba(206,212,218,0) 0%, rgba(206,212,218,0.75) 60%, #ced4da 100%)',
      '--gradient-card': 'linear-gradient(135deg, #e8ecef 0%, #d0d6dc 100%)',
      '--gradient-gold': 'linear-gradient(90deg, #383d43, #565c64, #858e96, #565c64, #383d43)',
    },
  },
  'violet-dark': {
    label: 'Violet',
    icon: '🌌',
    vars: {
      '--bg-void':       '#0a071a',
      '--bg-dark':       '#0e0b1e',
      '--bg-card':       '#1a1530',
      '--bg-card-hover': '#231d3e',
      '--bg-surface':    '#120e24',
      '--text-primary':  '#e2d8f8',
      '--text-secondary':'#b8a8d8',
      '--text-muted':    '#7060a0',
      '--accent':        '#9b78e8',
      '--accent-bright': '#b89cee',
      '--accent-dark':   '#7c5cbf',
      '--ivory':         '#e8e2f8',
      '--border':        'rgba(155,120,232,0.18)',
      '--border-bright': 'rgba(155,120,232,0.35)',
      '--shadow-sm':     '0 2px 8px rgba(0,0,0,0.6)',
      '--shadow-md':     '0 4px 20px rgba(0,0,0,0.75)',
      '--shadow-lg':     '0 8px 40px rgba(0,0,0,0.9)',
      '--shadow-glow':   '0 0 20px rgba(124,92,191,0.25)',
      '--gradient-hero': 'linear-gradient(180deg, rgba(10,7,26,0) 0%, rgba(10,7,26,0.8) 60%, #0a071a 100%)',
      '--gradient-card': 'linear-gradient(135deg, #1a1530 0%, #0e0b1e 100%)',
      '--gradient-gold': 'linear-gradient(90deg, #5a3ea0, #7c5cbf, #9b78e8, #7c5cbf, #5a3ea0)',
    },
  },
  'violet-light': {
    label: 'Lavande',
    icon: '🪻',
    vars: {
      '--bg-void':       '#ede8ff',
      '--bg-dark':       '#e0d8f8',
      '--bg-card':       '#f0ecff',
      '--bg-card-hover': '#f8f5ff',
      '--bg-surface':    '#e8e2f8',
      '--text-primary':  '#1e1440',
      '--text-secondary':'#3a2870',
      '--text-muted':    '#7060a8',
      '--accent':        '#6444b0',
      '--accent-bright': '#4a2e9a',
      '--accent-dark':   '#8068c8',
      '--ivory':         '#1e1440',
      '--border':        'rgba(100,68,176,0.18)',
      '--border-bright': 'rgba(100,68,176,0.35)',
      '--shadow-sm':     '0 2px 8px rgba(80,50,150,0.12)',
      '--shadow-md':     '0 4px 20px rgba(80,50,150,0.18)',
      '--shadow-lg':     '0 8px 40px rgba(80,50,150,0.24)',
      '--shadow-glow':   '0 0 20px rgba(100,68,176,0.18)',
      '--gradient-hero': 'linear-gradient(180deg, rgba(237,232,255,0) 0%, rgba(237,232,255,0.8) 60%, #ede8ff 100%)',
      '--gradient-card': 'linear-gradient(135deg, #f0ecff 0%, #e0d8f8 100%)',
      '--gradient-gold': 'linear-gradient(90deg, #5a3ea0, #7c5cbf, #9b78e8, #7c5cbf, #5a3ea0)',
    },
  },
  'bleu-dark': {
    label: 'Océan',
    icon: '🌊',
    vars: {
      '--bg-void':       '#060e1c',
      '--bg-dark':       '#0a1424',
      '--bg-card':       '#0f1e34',
      '--bg-card-hover': '#162540',
      '--bg-surface':    '#081020',
      '--text-primary':  '#d8e8f8',
      '--text-secondary':'#90b0d0',
      '--text-muted':    '#5078a0',
      '--accent':        '#5a9cd8',
      '--accent-bright': '#7ab8ec',
      '--accent-dark':   '#3a7ab8',
      '--ivory':         '#d8e8f8',
      '--border':        'rgba(90,156,216,0.18)',
      '--border-bright': 'rgba(90,156,216,0.35)',
      '--shadow-sm':     '0 2px 8px rgba(0,0,0,0.6)',
      '--shadow-md':     '0 4px 20px rgba(0,0,0,0.75)',
      '--shadow-lg':     '0 8px 40px rgba(0,0,0,0.9)',
      '--shadow-glow':   '0 0 20px rgba(58,110,168,0.25)',
      '--gradient-hero': 'linear-gradient(180deg, rgba(6,14,28,0) 0%, rgba(6,14,28,0.8) 60%, #060e1c 100%)',
      '--gradient-card': 'linear-gradient(135deg, #0f1e34 0%, #0a1424 100%)',
      '--gradient-gold': 'linear-gradient(90deg, #2a5890, #3a80c0, #5a9cd8, #3a80c0, #2a5890)',
    },
  },
  'bleu-light': {
    label: 'Ciel',
    icon: '🩵',
    vars: {
      '--bg-void':       '#e4eeff',
      '--bg-dark':       '#d0e0f8',
      '--bg-card':       '#ecf4ff',
      '--bg-card-hover': '#f4f9ff',
      '--bg-surface':    '#d8ecff',
      '--text-primary':  '#0a1e38',
      '--text-secondary':'#204060',
      '--text-muted':    '#5070a0',
      '--accent':        '#2a5890',
      '--accent-bright': '#1a3e70',
      '--accent-dark':   '#4a78b0',
      '--ivory':         '#0a1e38',
      '--border':        'rgba(42,88,144,0.18)',
      '--border-bright': 'rgba(42,88,144,0.35)',
      '--shadow-sm':     '0 2px 8px rgba(20,60,120,0.12)',
      '--shadow-md':     '0 4px 20px rgba(20,60,120,0.18)',
      '--shadow-lg':     '0 8px 40px rgba(20,60,120,0.24)',
      '--shadow-glow':   '0 0 20px rgba(42,88,144,0.18)',
      '--gradient-hero': 'linear-gradient(180deg, rgba(228,238,255,0) 0%, rgba(228,238,255,0.8) 60%, #e4eeff 100%)',
      '--gradient-card': 'linear-gradient(135deg, #ecf4ff 0%, #d0e0f8 100%)',
      '--gradient-gold': 'linear-gradient(90deg, #2a5890, #3a80c0, #5a9cd8, #3a80c0, #2a5890)',
    },
  },
};

const ThemeContext = createContext(null);

function applyThemeVars(themeKey) {
  const theme = THEMES[themeKey];
  if (!theme) return;
  const root = document.documentElement;
  Object.entries(theme.vars).forEach(([k, v]) => root.style.setProperty(k, v));
  // Keep data-theme for any selectors that still use it
  root.setAttribute('data-theme', themeKey);
}

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(
    () => localStorage.getItem('alqumra-theme') || 'dark'
  );

  useEffect(() => {
    applyThemeVars(theme);
    localStorage.setItem('alqumra-theme', theme);
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme, themes: THEMES }}>
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = () => useContext(ThemeContext);
