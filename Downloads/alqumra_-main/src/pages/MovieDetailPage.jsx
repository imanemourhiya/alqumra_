import { useParams, Link } from 'react-router-dom';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { FiStar, FiClock, FiCalendar, FiPlay, FiHeart } from 'react-icons/fi';
import { MOVIES, SESSIONS, CINEMAS } from '../data/mockData';
import { useLang } from '../context/LanguageContext';
import './MovieDetailPage.css';

export default function MovieDetailPage() {
  const { id } = useParams();
  const { t } = useLang();
  const movie = MOVIES.find(m => m.id === Number(id));
  const [wishlisted, setWishlisted] = useState(false);
  const [trailerOpen, setTrailerOpen] = useState(false);

  if (!movie) return (
    <div style={{ padding: '120px 24px', textAlign: 'center', color: 'var(--text-muted)' }}>
      <h2>{t('filmNotFound')}</h2>
      <Link to="/movies" className="btn btn-outline" style={{ marginTop: 20 }}>{t('backToCatalogue')}</Link>
    </div>
  );

  const sessions = SESSIONS.filter(s => s.movieId === movie.id);

  return (
    <div className="mdp page-enter">
      <div className="mdp__backdrop" style={{ backgroundImage: `url(${movie.backdrop})` }}>
        <div className="mdp__backdrop-overlay" />
      </div>
      <div className="container mdp__inner">
        <div className="mdp__hero">
          <motion.div className="mdp__poster" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5 }}>
            <img src={movie.poster} alt={movie.title} />
            <button className={`wishlist-btn ${wishlisted ? 'wishlisted' : ''}`} onClick={() => setWishlisted(v => !v)} aria-label="Add to favourites">
              <FiHeart />
            </button>
          </motion.div>
          <motion.div className="mdp__info" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5, delay: 0.15 }}>
            <div className="mdp__genres">
              {movie.genre.map(g => <span key={g} className="genre-chip">{g}</span>)}
              <span className="genre-chip">{movie.type}</span>
            </div>
            <h1 className="mdp__title">{movie.title}</h1>
            <div className="mdp__meta">
              <span><FiStar style={{ color: 'var(--accent)' }} /> {movie.rating}/10</span>
              <span><FiClock /> {movie.duration} {t('min')}</span>
              <span><FiCalendar /> {movie.year}</span>
              <span className="badge badge-dark">{movie.language}</span>
            </div>
            <p className="mdp__director">{t('directedBy')} <strong>{movie.director}</strong></p>
            <p className="mdp__synopsis font-garamond">{movie.synopsis}</p>
            <div className="mdp__cast">
              <p className="mdp__cast-label">{t('cast')}</p>
              <div className="mdp__cast-list">
                {movie.cast.map(actor => <span key={actor} className="cast-chip">{actor}</span>)}
              </div>
            </div>
            <div className="mdp__actions">
              {!trailerOpen && movie.trailer && (
                <button className="btn btn-outline" onClick={() => setTrailerOpen(true)}>
                  <FiPlay /> {t('watchTrailer')}
                </button>
              )}
            </div>
          </motion.div>
        </div>
        {trailerOpen && movie.trailer && (
          <motion.div className="mdp__trailer" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <div className="trailer-wrap">
              <iframe src={`${movie.trailer}?autoplay=1`} title="Trailer" frameBorder="0" allow="autoplay; fullscreen" allowFullScreen />
            </div>
            <button className="btn btn-ghost" onClick={() => setTrailerOpen(false)} style={{ marginTop: 12 }}>{t('closeTrailer')}</button>
          </motion.div>
        )}
        {sessions.length > 0 && (
          <div className="mdp__sessions">
            <h2 className="section-title" style={{ marginBottom: 24 }}>{t('bookSession')}</h2>
            <div className="sessions-list">
              {sessions.map(s => {
                const cinema = CINEMAS.find(c => c.id === s.cinemaId);
                return (
                  <div key={s.id} className="session-card card">
                    <div className="sc__info">
                      <p className="sc__cinema">{cinema?.name}</p>
                      <p className="sc__datetime">{s.date} &nbsp;·&nbsp; {s.time}</p>
                      <div className="sc__tags">
                        <span className="badge badge-dark">{s.format}</span>
                        <span className="badge badge-dark">{s.language}</span>
                        <span className="badge badge-dark">{s.hallId}</span>
                      </div>
                    </div>
                    <div className="sc__right">
                      <p className="sc__price">{s.price} MAD</p>
                      <Link to={`/seats/${s.id}`} className="btn btn-primary" style={{ fontSize: '0.78rem', padding: '10px 20px' }}>{t('chooseSeats')}</Link>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}