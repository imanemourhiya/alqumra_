import { useState, useRef, useEffect } from 'react';
import { useTheme, THEMES } from '../context/ThemeContext';
import './ThemePicker.css';

export default function ThemePicker() {
  const { theme, setTheme } = useTheme();
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  // Close on outside click
  useEffect(() => {
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const current = THEMES[theme];

  return (
    <div className="tp-wrap" ref={ref}>
      <button
        className="tp-trigger icon-btn"
        onClick={() => setOpen(v => !v)}
        aria-label="Changer de thème"
        title="Thème"
      >
        <span className="tp-trigger__icon">{current?.icon ?? '🎨'}</span>
      </button>

      {open && (
        <div className="tp-panel" role="dialog" aria-label="Sélecteur de thème">
          <p className="tp-title">Choisir un thème</p>
          <div className="tp-grid">
            {Object.entries(THEMES).map(([key, t]) => (
              <button
                key={key}
                className={`tp-option ${theme === key ? 'tp-option--active' : ''}`}
                onClick={() => { setTheme(key); setOpen(false); }}
                aria-label={t.label}
                title={t.label}
              >
                <span
                  className="tp-swatch"
                  style={{
                    background: t.vars['--bg-card'],
                    borderColor: t.vars['--accent'],
                  }}
                >
                  <span
                    className="tp-dot"
                    style={{ background: t.vars['--accent'] }}
                  />
                </span>
                <span className="tp-label">{t.icon} {t.label}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
