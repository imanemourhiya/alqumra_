import { useState, useMemo } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiSearch, FiStar, FiFilter } from 'react-icons/fi';
import { MOVIES, GENRES, TYPES, YEARS } from '../data/mockData';
import { useLang } from '../context/LanguageContext';
import './MoviesPage.css';

export default function MoviesPage() {
  const { t } = useLang();
  const [searchParams] = useSearchParams();
  const qParam = searchParams.get('q') || '';
  const tabParam = searchParams.get('tab') || 'now-showing';
  const [tab, setTab] = useState(tabParam);
  const [search, setSearch] = useState(qParam);
  const [genre, setGenre] = useState('');
  const [type, setType] = useState('');
  const [year, setYear] = useState('');
  const [sort, setSort] = useState('rating');

  const filtered = useMemo(() => {
    let list = MOVIES.filter(m => tab === 'now-showing' ? m.nowShowing : m.comingSoon);
    if (search) list = list.filter(m => m.title.toLowerCase().includes(search.toLowerCase()) || m.director.toLowerCase().includes(search.toLowerCase()));
    if (genre) list = list.filter(m => m.genre.includes(genre));
    if (type)  list = list.filter(m => m.type === type);
    if (year)  list = list.filter(m => m.year === Number(year));
    list = [...list].sort((a, b) => sort === 'rating' ? b.rating - a.rating : b.year - a.year);
    return list;
  }, [tab, search, genre, type, year, sort]);

  return (
    <div className="movies-page page-enter">
      <div className="movies-hero">
        <div className="container">
          <p className="movies-hero__title"><span className="italic">Between light and shadow stories are born</span></p>
        </div>
      </div>
      <div className="container movies-body">
        <div className="movies-tabs">
          {['now-showing', 'coming-soon'].map(tabKey => (
            <button key={tabKey} className={`tab-btn ${tab === tabKey ? 'tab-btn--active' : ''}`} onClick={() => setTab(tabKey)}>
              {tabKey === 'now-showing' ? t('nowShowingTab') : t('comingSoonTab')}
            </button>
          ))}
        </div>
        <div className="movies-filters">
          <div className="filter-search">
            <FiSearch className="filter-icon" />
            <input type="text" placeholder={t('searchTitleDirector')} value={search} onChange={e => setSearch(e.target.value)} className="filter-input" />
          </div>
          <select className="filter-select" value={genre} onChange={e => setGenre(e.target.value)}>
            <option value="">{t('allGenres')}</option>
            {GENRES.map(g => <option key={g} value={g}>{g}</option>)}
          </select>
          <select className="filter-select" value={type} onChange={e => setType(e.target.value)}>
            <option value="">{t('allTypes')}</option>
            {TYPES.map(tp => <option key={tp} value={tp}>{tp}</option>)}
          </select>
          <select className="filter-select" value={year} onChange={e => setYear(e.target.value)}>
            <option value="">{t('allYears')}</option>
            {YEARS.map(y => <option key={y} value={y}>{y}</option>)}
          </select>
          <select className="filter-select" value={sort} onChange={e => setSort(e.target.value)}>
            <option value="rating">{t('sortRating')}</option>
            <option value="year">{t('sortYear')}</option>
          </select>
        </div>
        <p className="movies-count">{filtered.length} {t('filmsFound')}</p>
        {filtered.length === 0 ? (
          <div className="movies-empty">
            <p>{t('noFilmsMatch')}</p>
            <button className="btn btn-outline" style={{marginTop:'16px'}} onClick={() => { setSearch(''); setGenre(''); setType(''); setYear(''); }}>
              {t('clearFilters')}
            </button>
          </div>
        ) : (
          <div className="movies-grid">
            {filtered.map((movie, i) => (
              <motion.div key={movie.id} className="movie-grid-card card" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
                <Link to={`/movies/${movie.id}`}>
                  <div className="mgc__poster">
                    <img src={movie.poster} alt={movie.title} loading="lazy" />
                    <div className="mgc__overlay">
                      <span className="btn btn-primary" style={{fontSize:'0.72rem',padding:'9px 20px'}}>{t('bookNow')}</span>
                    </div>
                    <span className="mgc__rating badge badge-gold"><FiStar /> {movie.rating}</span>
                  </div>
                  <div className="mgc__body">
                    <h3 className="mgc__title">{movie.title}</h3>
                    <p className="mgc__meta">{movie.year} · {movie.duration}m · {movie.language}</p>
                    <p className="mgc__genre">{movie.genre.join(', ')}</p>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}