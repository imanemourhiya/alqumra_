"use client";
import apropos from "@/app/apropos/page";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";

const NAV_LINKS = [
  { label: "Cinémas", href: "/cinemas" },
  { label: "Films", href: "/films" },
  { label: "Séances", href: "/seances" },
  { label: "Offres", href: "/offres" },
   { label: "À propos de nous", href: "/apropos" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [mobileOpen, setMobileOpen] = useState(false);
  const [authOpen, setAuthOpen] = useState(false);
  const searchRef = useRef(null);
  const authRef = useRef(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (searchOpen) searchRef.current?.focus();
  }, [searchOpen]);

  useEffect(() => {
    const handler = (e) => {
      if (authRef.current && !authRef.current.contains(e.target)) {
        setAuthOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Outfit:wght@300;400;500;600&display=swap');

        :root {
          --nav-bg: #0a0a0a;
          --nav-bg-scrolled: rgba(8,8,8,0.97);
          --accent: #472104;
          --accent-hover: #7e400d;
          --text-primary: #f5f5f5;
          --text-muted: #888;
          --border: rgba(255,255,255,0.08);
          --input-bg: rgba(255,255,255,0.06);
          --nav-height: 68px;
        }

        * { box-sizing: border-box; margin: 0; padding: 0; }

        .al-qumra-nav {
          position: fixed;
          top: 0; left: 0; right: 0;
          z-index: 1000;
          height: var(--nav-height);
          background: var(--nav-bg);
          border-bottom: 1px solid var(--border);
          font-family: 'Outfit', sans-serif;
          transition: box-shadow 0.3s ease, background 0.3s ease;
        }
        .al-qumra-nav.scrolled {
          background: var(--nav-bg-scrolled);
          box-shadow: 0 4px 32px rgba(0,0,0,0.6);
        }

        .nav-inner {
          max-width: 1280px;
          margin: 0 auto;
          height: 100%;
          display: flex;
          align-items: center;
          padding: 0 24px;
        }

        .nav-logo {
          display: flex;
          align-items: center;
          gap: 8px;
          text-decoration: none;
          flex-shrink: 0;
          margin-right: 36px;
        }
        .logo-mark {
          width: 36px; height: 36px;
          background: var(--accent);
          border-radius: 4px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-family: 'Bebas Neue', sans-serif;
          font-size: 22px;
          color: #fff;
          line-height: 1;
        }
        .logo-text {
          font-family: 'Bebas Neue', sans-serif;
          font-size: 26px;
          color: var(--text-primary);
          letter-spacing: 2px;
          line-height: 1;
        }

        .nav-links {
          display: flex;
          align-items: center;
          gap: 4px;
          flex: 1;
          list-style: none;
        }
        .nav-links a {
          display: block;
          padding: 8px 14px;
          text-decoration: none;
          color: var(--text-muted);
          font-size: 14px;
          font-weight: 500;
          letter-spacing: 0.5px;
          border-radius: 6px;
          transition: color 0.2s, background 0.2s;
          position: relative;
        }
        .nav-links a::after {
          content: '';
          position: absolute;
          bottom: 2px; left: 14px; right: 14px;
          height: 2px;
          background: var(--accent);
          border-radius: 1px;
          transform: scaleX(0);
          transition: transform 0.25s cubic-bezier(.4,0,.2,1);
          transform-origin: left;
        }
        .nav-links a:hover { color: var(--text-primary); background: rgba(255,255,255,0.04); }
        .nav-links a:hover::after { transform: scaleX(1); }

        .nav-right {
          display: flex;
          align-items: center;
          gap: 10px;
          flex-shrink: 0;
        }

        .search-input-container {
          display: flex;
          align-items: center;
          background: var(--input-bg);
          border: 1px solid var(--border);
          border-radius: 8px;
          overflow: hidden;
          transition: width 0.35s cubic-bezier(.4,0,.2,1), border-color 0.2s, box-shadow 0.2s;
          width: 38px;
        }
        .search-input-container.open {
          width: 220px;
          border-color: rgba(229,0,0,0.4);
          box-shadow: 0 0 0 3px rgba(229,0,0,0.1);
        }
        .search-icon-btn {
          background: none;
          border: none;
          cursor: pointer;
          color: var(--text-muted);
          width: 38px; height: 38px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          transition: color 0.2s;
        }
        .search-icon-btn:hover { color: var(--accent); }
        .search-input {
          background: none;
          border: none;
          outline: none;
          color: var(--text-primary);
          font-family: 'Outfit', sans-serif;
          font-size: 14px;
          width: 0;
          padding: 0;
          transition: width 0.35s, padding 0.35s;
        }
        .search-input-container.open .search-input {
          width: 160px;
          padding-right: 12px;
        }
        .search-input::placeholder { color: var(--text-muted); }

        .auth-wrapper { position: relative; }
        .auth-btn {
          display: flex;
          align-items: center;
          gap: 8px;
          background: var(--accent);
          border: none;
          border-radius: 8px;
          padding: 0 16px;
          height: 38px;
          cursor: pointer;
          font-family: 'Outfit', sans-serif;
          font-size: 14px;
          font-weight: 600;
          color: #fff;
          letter-spacing: 0.3px;
          transition: background 0.2s, transform 0.15s, box-shadow 0.2s;
          white-space: nowrap;
        }
        .auth-btn:hover {
          background: var(--accent-hover);
          transform: translateY(-1px);
          box-shadow: 0 4px 16px rgba(229,0,0,0.35);
        }
        .auth-btn:active { transform: translateY(0); }

        .auth-dropdown {
          position: absolute;
          top: calc(100% + 10px);
          right: 0;
          background: #141414;
          border: 1px solid var(--border);
          border-radius: 10px;
          min-width: 200px;
          box-shadow: 0 16px 40px rgba(0,0,0,0.6);
          overflow: hidden;
          animation: dropIn 0.2s cubic-bezier(.4,0,.2,1);
          z-index: 100;
        }
        @keyframes dropIn {
          from { opacity: 0; transform: translateY(-8px) scale(0.97); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }
        .auth-dropdown-item {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 13px 16px;
          text-decoration: none;
          color: var(--text-muted);
          font-size: 14px;
          font-weight: 500;
          transition: background 0.15s, color 0.15s;
          cursor: pointer;
          background: none;
          border: none;
          width: 100%;
          font-family: 'Outfit', sans-serif;
        }
        .auth-dropdown-item:hover { background: rgba(255,255,255,0.05); color: var(--text-primary); }
        .auth-dropdown-divider { height: 1px; background: var(--border); margin: 4px 0; }
        .auth-dropdown-item.register { color: var(--accent); font-weight: 600; }
        .auth-dropdown-item.register:hover { color: var(--accent-hover); }

        .burger-btn {
          display: none;
          background: none;
          border: none;
          cursor: pointer;
          color: var(--text-primary);
          padding: 6px;
          border-radius: 6px;
          margin-left: 4px;
          transition: background 0.2s;
        }
        .burger-btn:hover { background: rgba(255,255,255,0.06); }

        .mobile-menu {
          display: none;
          position: fixed;
          top: var(--nav-height);
          left: 0; right: 0;
          background: #0d0d0d;
          border-bottom: 1px solid var(--border);
          padding: 16px 24px 24px;
          flex-direction: column;
          gap: 4px;
          animation: slideDown 0.25s ease;
          z-index: 999;
        }
        @keyframes slideDown {
          from { opacity: 0; transform: translateY(-10px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .mobile-menu.open { display: flex; }
        .mobile-menu a {
          display: block;
          padding: 12px 16px;
          text-decoration: none;
          color: var(--text-muted);
          font-size: 15px;
          font-weight: 500;
          border-radius: 8px;
          transition: background 0.15s, color 0.15s;
        }
        .mobile-menu a:hover { background: rgba(255,255,255,0.05); color: var(--text-primary); }
        .mobile-search {
          display: flex;
          align-items: center;
          background: var(--input-bg);
          border: 1px solid var(--border);
          border-radius: 8px;
          padding: 0 12px;
          margin-top: 8px;
          gap: 8px;
        }
        .mobile-search input {
          flex: 1;
          background: none;
          border: none;
          outline: none;
          color: var(--text-primary);
          font-family: 'Outfit', sans-serif;
          font-size: 14px;
          padding: 11px 0;
        }
        .mobile-search input::placeholder { color: var(--text-muted); }
        .mobile-auth-btn {
          margin-top: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          background: var(--accent);
          border: none;
          border-radius: 8px;
          padding: 13px;
          cursor: pointer;
          font-family: 'Outfit', sans-serif;
          font-size: 15px;
          font-weight: 600;
          color: #fff;
          text-decoration: none;
          transition: background 0.2s;
        }
        .mobile-auth-btn:hover { background: var(--accent-hover); }

        @media (max-width: 768px) {
          .nav-links { display: none; }
          .search-wrapper { display: none; }
          .auth-wrapper { display: none; }
          .burger-btn { display: flex; }
        }
      `}</style>

      <nav className={`al-qumra-nav${scrolled ? " scrolled" : ""}`}>
        <div className="nav-inner">

          {/* Logo */}
          <Link href="/" className="nav-logo">
            <span className="logo-mark">Q</span>
            <span className="logo-text">Al-Qumra</span>
          </Link>

          {/* Liens desktop */}
          <ul className="nav-links">
            {NAV_LINKS.map((l) => (
              <li key={l.href}>
                <Link href={l.href}>{l.label}</Link>
              </li>
            ))}
          </ul>

          {/* Zone droite */}
          <div className="nav-right">

            {/* Recherche */}
            <div className="search-wrapper">
              <div className={`search-input-container${searchOpen ? " open" : ""}`}>
                <button
                  className="search-icon-btn"
                  aria-label="Rechercher"
                  onClick={() => setSearchOpen((v) => !v)}
                >
                  <svg width="17" height="17" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <circle cx="11" cy="11" r="8" />
                    <path d="M21 21l-4.35-4.35" strokeLinecap="round" />
                  </svg>
                </button>
                <input
                  ref={searchRef}
                  className="search-input"
                  placeholder="Film, cinéma…"
                  value={searchValue}
                  onChange={(e) => setSearchValue(e.target.value)}
                  onKeyDown={(e) => e.key === "Escape" && setSearchOpen(false)}
                  aria-label="Recherche"
                />
              </div>
            </div>

            {/* Auth */}
            <div className="auth-wrapper" ref={authRef}>
              <button className="auth-btn" onClick={() => setAuthOpen((v) => !v)}>
                <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="8" r="4" />
                  <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" strokeLinecap="round" />
                </svg>
                Se connecter
              </button>

              {authOpen && (
                <div className="auth-dropdown">
                  <Link href="/login" className="auth-dropdown-item" onClick={() => setAuthOpen(false)}>
                    <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                      <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" strokeLinecap="round" />
                      <polyline points="10 17 15 12 10 7" />
                      <line x1="15" y1="12" x2="3" y2="12" strokeLinecap="round" />
                    </svg>
                    Se connecter
                  </Link>
                  <div className="auth-dropdown-divider" />
                  <Link href="/register" className="auth-dropdown-item register" onClick={() => setAuthOpen(false)}>
                    <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                      <circle cx="12" cy="8" r="4" />
                      <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" strokeLinecap="round" />
                    </svg>
                    Créer un compte
                  </Link>
                </div>
              )}
            </div>

            {/* Burger mobile */}
            <button className="burger-btn" onClick={() => setMobileOpen((v) => !v)} aria-label="Menu">
              {mobileOpen ? (
                <svg width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path d="M18 6 6 18M6 6l12 12" strokeLinecap="round" />
                </svg>
              ) : (
                <svg width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path d="M4 6h16M4 12h16M4 18h16" strokeLinecap="round" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </nav>

      {/* Menu mobile */}
      <div className={`mobile-menu${mobileOpen ? " open" : ""}`}>
        {NAV_LINKS.map((l) => (
          <Link key={l.href} href={l.href} onClick={() => setMobileOpen(false)}>
            {l.label}
          </Link>
        ))}
        <div className="mobile-search">
          <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="#888" strokeWidth="2">
            <circle cx="11" cy="11" r="8" />
            <path d="M21 21l-4.35-4.35" strokeLinecap="round" />
          </svg>
          <input placeholder="Rechercher un film, cinéma…" />
        </div>
        <Link href="/login" className="mobile-auth-btn" onClick={() => setMobileOpen(false)}>
          <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="8" r="4" />
            <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" strokeLinecap="round" />
          </svg>
          Se connecter / S'inscrire
        </Link>
      </div>
    </>
  );
}
