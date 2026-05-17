import { useState, useMemo } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FiSearch, FiStar, FiX } from 'react-icons/fi';
import { MOVIES, GENRES, TYPES, YEARS } from '../data/mockData';
import { useLang } from '../context/LanguageContext';
import './MoviesPage.css';

export default function MoviesPage() {
  const { t, lang } = useLang();
  const [searchParams] = useSearchParams();
  const [search, setSearch] = useState(searchParams.get('q') || '');
  const [tab, setTab] = useState('all');
  const [genre, setGenre] = useState('');
  const [sort, setSort] = useState('popular');
  const [searchOpen, setSearchOpen] = useState(!!searchParams.get('q'));

  const TABS = [
    { key: 'all',         label: { fr: 'Tout', en: 'All', ar: 'الكل' } },
    { key: 'now-showing', label: { fr: 'À l\'affiche', en: 'Now Showing', ar: 'يُعرض الآن' } },
    { key: 'coming-soon', label: { fr: 'Prochainement', en: 'Coming Soon', ar: 'قريباً' } },
  ];

  const SORT_OPTS = [
    { key: 'popular', label: { fr: 'Les + vus', en: 'Most Popular', ar: 'الأكثر مشاهدة' } },
    { key: 'rating',  label: { fr: 'Note',      en: 'Top Rated',   ar: 'تقييم عالٍ' } },
    { key: 'recent',  label: { fr: 'Récents',   en: 'Latest',      ar: 'الأحدث' } },
  ];

  const filtered = useMemo(() => {
    let list = [...MOVIES];
    if (tab === 'now-showing') list = list.filter(m => m.nowShowing);
    if (tab === 'coming-soon') list = list.filter(m => m.comingSoon);
    if (search) list = list.filter(m =>
      m.title.toLowerCase().includes(search.toLowerCase()) ||
      m.director.toLowerCase().includes(search.toLowerCase())
    );
    if (genre) list = list.filter(m => m.genre.includes(genre));
    if (sort === 'rating')  list = [...list].sort((a, b) => b.rating - a.rating);
    if (sort === 'recent')  list = [...list].sort((a, b) => b.year - a.year);
    if (sort === 'popular') list = [...list].sort((a, b) => b.rating * b.year - a.rating * a.year);
    return list;
  }, [tab, search, genre, sort]);

  return (
    <div className="movies-page page-enter">

      {/* Top search bar */}
      <div className="mp-topbar">
        <AnimatePresence mode="wait">
          {searchOpen ? (
            <motion.div key="search" className="mp-search-bar" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <FiSearch className="mp-search-icon" />
              <input
                autoFocus
                type="text"
                className="mp-search-input"
                placeholder={t('searchPlaceholder')}
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
              <button className="mp-search-close" onClick={() => { setSearch(''); setSearchOpen(false); }}>
                <FiX />
              </button>
            </motion.div>
          ) : (
            <motion.div key="title" className="mp-topbar-inner" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <h1 className="mp-topbar-title">{t('allFilms')}</h1>
              <button className="mp-search-btn" onClick={() => setSearchOpen(true)}>
                <FiSearch />
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Tab filters */}
      <div className="mp-chips-wrap">
        <div className="mp-chips">
          {TABS.map(tb => (
            <button
              key={tb.key}
              className={`mp-chip ${tab === tb.key ? 'mp-chip--active' : ''}`}
              onClick={() => setTab(tb.key)}
            >
              {tb.label[lang] || tb.label.fr}
            </button>
          ))}
        </div>
      </div>

      {/* Genre filters */}
      <div className="mp-chips-wrap">
        <div className="mp-chips">
          {GENRES.map(g => (
            <button
              key={g}
              className={`mp-chip mp-chip--sm ${genre === g ? 'mp-chip--active' : ''}`}
              onClick={() => setGenre(genre === g ? '' : g)}
            >
              {g}
            </button>
          ))}
        </div>
      </div>

      {/* Sort filters */}
      <div className="mp-chips-wrap">
        <div className="mp-chips">
          {SORT_OPTS.map(s => (
            <button
              key={s.key}
              className={`mp-chip mp-chip--sm ${sort === s.key ? 'mp-chip--active' : ''}`}
              onClick={() => setSort(s.key)}
            >
              {s.label[lang] || s.label.fr}
            </button>
          ))}
        </div>
      </div>

      {/* Results count */}
      {(search || genre) && (
        <p className="mp-count">{filtered.length} {t('filmsFound')}</p>
      )}

      {/* Grid */}
      {filtered.length === 0 ? (
        <div className="mp-empty">
          <p>{t('noFilmsMatch')}</p>
          <button className="btn btn-outline" style={{ marginTop: 16 }} onClick={() => { setSearch(''); setGenre(''); }}>
            {t('clearFilters')}
          </button>
        </div>
      ) : (
        <div className="mp-grid">
          {filtered.map((movie, i) => (
            <motion.div
              key={movie.id}
              className="mp-card"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.03 }}
            >
              <Link to={`/movies/${movie.id}`}>
                <div className="mp-card__poster">
                  <img src={movie.poster} alt={movie.title} loading="lazy" />
                  <div className="mp-card__rating">
                    <FiStar /> {movie.rating}
                  </div>
                  {movie.nowShowing && (
                    <div className="mp-card__badge">
                      {lang === 'ar' ? 'يُعرض' : lang === 'fr' ? 'Affiche' : 'Showing'}
                    </div>
                  )}
                </div>
                <div className="mp-card__info">
                  <p className="mp-card__title">{movie.title}</p>
                  <p className="mp-card__meta">{movie.genre.slice(0, 2).join(' · ')}</p>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}