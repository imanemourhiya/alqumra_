import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { MOVIES, GENRES, TYPES } from '../data/mockData';
import { FiZap, FiX, FiStar } from 'react-icons/fi';
import { useLang } from '../context/LanguageContext';
import './AIRecommendPage.css';

export default function AIRecommendPage() {
  const { t } = useLang();
  const [genre, setGenre] = useState('');
  const [type, setType] = useState('');
  const [mood, setMood] = useState('');
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);

  const MOODS = t('moods');

  const handleGenerate = () => {
    setLoading(true);
    setTimeout(() => {
      let filtered = [...MOVIES];
      if (genre) filtered = filtered.filter(m => m.genre.includes(genre));
      if (type)  filtered = filtered.filter(m => m.type === type);
      filtered = filtered.sort(() => Math.random() - 0.5).slice(0, 3);
      if (filtered.length === 0) filtered = MOVIES.slice(0, 3);
      setResults(filtered);
      setLoading(false);
    }, 1400);
  };

  return (
    <div className="ai-page page-enter">
      <div className="container ai-inner">
        <div className="ai-header">
          <div className="ai-icon-wrap"><FiZap /></div>
          <h1 className="ai-title">{t('aiFilmPicker')}</h1>
          <p className="ai-sub">{t('aiSub')}</p>
        </div>
        <div className="ai-filters card">
          <div className="form-group">
            <label className="form-label">{t('genrePreference')}</label>
            <div className="chip-row">
              {GENRES.slice(0,8).map(g => (
                <button key={g} className={`chip-btn ${genre===g?'chip-btn--active':''}`} onClick={() => setGenre(genre===g?'':g)}>{g}</button>
              ))}
            </div>
          </div>
          <div className="form-group">
            <label className="form-label">{t('filmType')}</label>
            <div className="chip-row">
              {TYPES.map(tp => (
                <button key={tp} className={`chip-btn ${type===tp?'chip-btn--active':''}`} onClick={() => setType(type===tp?'':tp)}>{tp}</button>
              ))}
            </div>
          </div>
          <div className="form-group">
            <label className="form-label">{t('tonightsMood')}</label>
            <div className="chip-row">
              {MOODS.map(m => (
                <button key={m} className={`chip-btn ${mood===m?'chip-btn--active':''}`} onClick={() => setMood(mood===m?'':m)}>{m}</button>
              ))}
            </div>
          </div>
          <button className="btn btn-primary ai-btn" onClick={handleGenerate} disabled={loading}>
            {loading ? t('analysing') : <><FiZap /> {t('generatePicks')}</>}
          </button>
        </div>
        {loading && (
          <div className="ai-loading">
            <div className="spinner" />
            <p>{t('aiCurating')}</p>
          </div>
        )}
        <AnimatePresence>
          {results && !loading && (
            <motion.div className="ai-results" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
              <h2 className="section-title" style={{ marginBottom: 24 }}>{t('yourPicksTonight')}</h2>
              <div className="ai-cards">
                {results.map((movie, i) => (
                  <motion.div key={movie.id} className="ai-card card" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.12 }}>
                    <img src={movie.poster} alt={movie.title} className="ai-card__poster" />
                    <div className="ai-card__body">
                      <div className="ai-card__rank">#{i+1} {t('pick')}</div>
                      <h3 className="ai-card__title">{movie.title}</h3>
                      <p className="ai-card__meta"><FiStar style={{color:'var(--accent)'}}/> {movie.rating} · {movie.duration}{t('min')}</p>
                      <p className="ai-card__genre">{movie.genre.join(' · ')}</p>
                      <p className="ai-card__synopsis">{movie.synopsis.slice(0,100)}…</p>
                      <Link to={`/movies/${movie.id}`} className="btn btn-primary" style={{fontSize:'0.72rem',padding:'9px 18px',marginTop:12}}>
                        {t('bookNow')}
                      </Link>
                    </div>
                  </motion.div>
                ))}
              </div>
              <button className="btn btn-ghost" style={{marginTop:20}} onClick={() => setResults(null)}>
                <FiX /> {t('clearPicks')}
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}