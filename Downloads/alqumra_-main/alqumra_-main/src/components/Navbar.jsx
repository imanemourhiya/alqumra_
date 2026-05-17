import { useState, useEffect } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { useLang } from '../context/LanguageContext';
import { FiSearch, FiMenu, FiX, FiUser, FiStar, FiClock, FiHeart, FiLogOut } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';
import ThemePicker from './ThemePicker';
import './Navbar.css';

export default function Navbar() {
  const { user, logout } = useAuth();
  const { lang, t, toggleLang, setLangDirect } = useLang();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchVal, setSearchVal] = useState('');
  const navigate = useNavigate();

  const NAV_LINKS = [
    { to: '/', label: t('home') },
    { to: '/movies', label: t('films') },
    { to: '/cinemas', label: t('cinemas') },
    { to: '/offers', label: t('offers') },
    { to: '/ai-recommend', label: '✦ AI Pick' },
  ];

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchVal.trim()) {
      navigate(`/movies?q=${encodeURIComponent(searchVal.trim())}`);
      setSearchOpen(false);
      setSearchVal('');
    }
  };

  return (
    <header className={`navbar ${scrolled ? 'navbar--scrolled' : ''}`}>
      <div className="navbar__film-strip" aria-hidden="true">
        {Array.from({length: 30}).map((_,i) => <span key={i} className="perf" />)}
      </div>

      <div className="navbar__inner container">
        <Link to="/" className="navbar__logo" onClick={() => setMenuOpen(false)}>
          <img src="/logo.jpg" alt="Al-Qumra Cinema" style={{ height: '40px', width: 'auto', borderRadius: '50%' }} />
          <span className="logo-text-artistic">
            <span className="al">A</span>l-<span className="al">Q</span>umra
          </span>
        </Link>

        <nav className="navbar__links">
          {NAV_LINKS.map(l => (
            <NavLink
              key={l.to}
              to={l.to}
              end={l.to === '/'}
              className={({ isActive }) => `nav-link ${isActive ? 'nav-link--active' : ''}`}
            >
              {l.label}
            </NavLink>
          ))}
        </nav>

        <div className="navbar__actions">
          {/* Search */}
          <button className="icon-btn" onClick={() => setSearchOpen(v => !v)} aria-label="Search">
            <FiSearch />
          </button>

          {/* Theme picker */}
          <ThemePicker />

          {/* Language selector */}
<div className="lang-selector">
  {[{code:'fr',label:'FR'},{code:'en',label:'EN'},{code:'ar',label:'عر'}].map(l => (
    <button
      key={l.code}
      className={`lang-option ${lang === l.code ? 'lang-option--active' : ''}`}
      onClick={() => setLangDirect(l.code)}
    >{l.label}</button>
  ))}
</div>

          {user ? (
            <div className="profile-wrap">
              <button className="icon-btn avatar-btn" onClick={() => setProfileOpen(v => !v)}>
                <img src={user.avatar} alt={user.name} className="avatar" />
              </button>
              <AnimatePresence>
                {profileOpen && (
                  <motion.div
                    className="profile-dropdown"
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.18 }}
                  >
                    <div className="pd-header">
                      <img src={user.avatar} alt="" className="pd-avatar" />
                      <div>
                        <div className="pd-name">{user.name}</div>
                        <div className="pd-tier">
                          <span className={`role-badge role-badge--${user.role}`}>{user.role}</span>
                          {user.loyaltyPoints && ` · ${user.loyaltyPoints} pts`}
                        </div>
                      </div>
                    </div>
                    <div className="pd-divider" />
                    {user.role === 'admin' && (
                      <Link to="/admin" className="pd-item pd-item--admin" onClick={() => setProfileOpen(false)}>⚙ Admin Panel</Link>
                    )}
                    {user.role === 'staff' && (
                      <Link to="/staff" className="pd-item pd-item--staff" onClick={() => setProfileOpen(false)}>🎫 Staff Dashboard</Link>
                    )}
                    <Link to="/profile" className="pd-item" onClick={() => setProfileOpen(false)}><FiUser /> {t('profile')}</Link>
                    <Link to="/profile?tab=bookings" className="pd-item" onClick={() => setProfileOpen(false)}><FiClock /> {t('myBookings')}</Link>
                    <Link to="/favorites" className="pd-item" onClick={() => setProfileOpen(false)}><FiHeart /> {t('favourites')}</Link>
                    <div className="pd-divider" />
                    <button className="pd-item pd-item--danger" onClick={() => { logout(); setProfileOpen(false); }}>
                      <FiLogOut /> {t('signOut')}
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ) : (
            <div className="auth-btns">
              <Link to="/login" className="btn btn-ghost" style={{padding:'8px 14px',fontSize:'0.78rem'}}>{t('signIn')}</Link>
              <Link to="/register" className="btn btn-primary" style={{padding:'8px 18px',fontSize:'0.78rem'}}>{t('join')}</Link>
            </div>
          )}

          <button className="icon-btn hamburger" onClick={() => setMenuOpen(v => !v)} aria-label="Menu">
            {menuOpen ? <FiX /> : <FiMenu />}
          </button>
        </div>
      </div>

      {/* Search bar */}
      <AnimatePresence>
        {searchOpen && (
          <motion.form
            className="navbar__search"
            onSubmit={handleSearch}
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <div className="container search-inner">
              <FiSearch className="search-icon" />
              <input
                autoFocus
                type="text"
                value={searchVal}
                onChange={e => setSearchVal(e.target.value)}
                placeholder={t('searchPlaceholder')}
                className="search-input"
              />
              <button type="submit" className="btn btn-primary" style={{padding:'8px 20px',fontSize:'0.78rem'}}>{t('search')}</button>
            </div>
          </motion.form>
        )}
      </AnimatePresence>

      {/* Mobile menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.nav
            className="navbar__mobile"
            initial={{ opacity: 0, x: '100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '100%' }}
            transition={{ duration: 0.25 }}
          >
            {NAV_LINKS.map(l => (
              <NavLink
                key={l.to}
                to={l.to}
                end={l.to === '/'}
                className={({ isActive }) => `mobile-link ${isActive ? 'mobile-link--active' : ''}`}
                onClick={() => setMenuOpen(false)}
              >
                {l.label}
              </NavLink>
            ))}
            <div className="mobile-divider" />
            <div className="mobile-controls">
              <button className="mobile-link" onClick={() => setMenuOpen(false)} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ fontSize: '0.8rem' }}>🎨</span> Thème
                <ThemePicker />
              </button>
              <div className="mobile-lang">
  {[{code:'fr',label:'Français'},{code:'en',label:'English'},{code:'ar',label:'العربية'}].map(l => (
    <button
      key={l.code}
      className={`mobile-lang-btn ${lang === l.code ? 'mobile-lang-btn--active' : ''}`}
      onClick={() => setLangDirect(l.code)}
    >{l.label}</button>
  ))}
</div>
            </div>
            <div className="mobile-divider" />
            {user ? (
              <>
                {user.role === 'admin' && <Link to="/admin" className="mobile-link" onClick={() => setMenuOpen(false)}>⚙ Admin Panel</Link>}
                {user.role === 'staff' && <Link to="/staff" className="mobile-link" onClick={() => setMenuOpen(false)}>🎫 Staff Dashboard</Link>}
                <Link to="/profile" className="mobile-link" onClick={() => setMenuOpen(false)}>{t('profile')}</Link>
                <Link to="/profile?tab=bookings" className="mobile-link" onClick={() => setMenuOpen(false)}>{t('myBookings')}</Link>
                <Link to="/feedback" className="mobile-link" onClick={() => setMenuOpen(false)}>Donner mon avis</Link>
                <button className="mobile-link mobile-link--danger" onClick={() => { logout(); setMenuOpen(false); }}>{t('signOut')}</button>
              </>
            ) : (
              <>
                <Link to="/login" className="mobile-link" onClick={() => setMenuOpen(false)}>{t('signIn')}</Link>
                <Link to="/register" className="mobile-link mobile-link--cta" onClick={() => setMenuOpen(false)}>Join Now</Link>
              </>
            )}
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
}
