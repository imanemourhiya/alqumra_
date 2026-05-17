import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, FreeMode } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/free-mode';
import { FiPlay, FiCalendar, FiStar, FiChevronRight, FiChevronLeft } from 'react-icons/fi';
import { MOVIES } from '../data/mockData';
import { useLang } from '../context/LanguageContext';
import './HomePage.css';

const HERO_MOVIES = MOVIES.filter(m => m.nowShowing).slice(0, 4);
const NOW_SHOWING = MOVIES.filter(m => m.nowShowing);
const COMING_SOON = MOVIES.filter(m => m.comingSoon);

function MovieCard({ movie, index = 0 }) {
  return (
    <motion.div
      className="movie-card"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.06 }}
    >
      <Link to={`/movies/${movie.id}`} className="movie-card__link">
        <div className="movie-card__poster">
          <img src={movie.poster} alt={movie.title} loading="lazy" />
          <div className="movie-card__overlay">
            <button className="play-btn"><FiPlay /></button>
          </div>
          <span className="movie-card__badge badge badge-gold">{movie.language}</span>
        </div>
        <div className="movie-card__info">
          <h3 className="movie-card__title">{movie.title}</h3>
          <div className="movie-card__meta">
            <span className="movie-card__rating"><FiStar /> {movie.rating}</span>
            <span className="movie-card__year">{movie.year}</span>
            <span className="movie-card__duration">{movie.duration}m</span>
          </div>
          <div className="movie-card__genres">
            {movie.genre.slice(0, 2).map(g => <span key={g} className="genre-chip">{g}</span>)}
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

export default function HomePage() {
  const [activeHero, setActiveHero] = useState(0);
  const { t } = useLang();

  useEffect(() => {
    const id = setInterval(() => setActiveHero(i => (i + 1) % HERO_MOVIES.length), 5000);
    return () => clearInterval(id);
  }, []);

  const movie = HERO_MOVIES[activeHero];

  return (
    <div className="home page-enter">

      {/* ====== HERO CAROUSEL ====== */}
      <section className="hero">
        <div className="hero__carousel">
          {/* Background */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeHero}
              className="hero__bg"
              style={{ backgroundImage: `url(${movie?.backdrop})` }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.6 }}
            />
          </AnimatePresence>
          <div className="hero__gradient" />

          {/* Arrows */}
          <button className="hero__arrow hero__arrow--prev" onClick={() => setActiveHero(i => (i - 1 + HERO_MOVIES.length) % HERO_MOVIES.length)}>
            <FiChevronLeft />
          </button>
          <button className="hero__arrow hero__arrow--next" onClick={() => setActiveHero(i => (i + 1) % HERO_MOVIES.length)}>
            <FiChevronRight />
          </button>

          {/* Content */}
          <div className="hero__content">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeHero}
                className="hero__text"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5 }}
              >
                <div className="hero__label">
                  <span className="ornament-dot" />
                  {t('nowShowing')}
                </div>
                <h1 className="hero__title">{movie?.title}</h1>
                <div className="hero__meta">
                  <span><FiStar style={{ color: 'var(--accent)' }} /> {movie?.rating}</span>
                  <span>{movie?.duration} {t('min')}</span>
                  <span>{movie?.genre.join(' · ')}</span>
                </div>
                <p className="hero__synopsis">{movie?.synopsis?.slice(0, 180)}…</p>
                <div className="hero__actions">
                  <Link to={`/movies/${movie?.id}`} className="btn btn-primary">
                    <FiCalendar /> {t('bookTickets')}
                  </Link>
                  <Link to={`/movies/${movie?.id}`} className="btn btn-outline">
                    <FiPlay /> {t('trailer')}
                  </Link>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Dots */}
          <div className="hero__dots">
            {HERO_MOVIES.map((_, i) => (
              <button
                key={i}
                className={`hero__dot ${i === activeHero ? 'hero__dot--active' : ''}`}
                onClick={() => setActiveHero(i)}
              />
            ))}
          </div>
        </div>
      </section>

      {/* ====== NOW SHOWING ====== */}
      <section className="home-section container">
        <div className="section-header">
          <h2 className="section-title">{t('nowShowing')}</h2>
          <Link to="/movies" className="section-more">{t('allFilms')} <FiChevronRight /></Link>
        </div>
        <div className="now-carousel">
          <Swiper
            modules={[Autoplay, FreeMode]}
            slidesPerView="auto"
            spaceBetween={20}
            freeMode={{ enabled: true, momentum: true }}
            autoplay={{ delay: 2500, disableOnInteraction: false, pauseOnMouseEnter: true }}
            loop={NOW_SHOWING.length > 4}
            className="now-swiper"
          >
            {NOW_SHOWING.map((m, i) => (
              <SwiperSlide key={m.id} className="now-swiper__slide">
                <MovieCard movie={m} index={i} />
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </section>

      {/* ====== COMING SOON ====== */}
      <section className="home-section container">
        <div className="section-header">
          <h2 className="section-title">{t('comingSoon')}</h2>
          <Link to="/movies?tab=coming-soon" className="section-more">{t('viewAll')} <FiChevronRight /></Link>
        </div>
        <div className="coming-grid">
          {COMING_SOON.map((m, i) => (
            <motion.div
              key={m.id}
              className="coming-card"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.1 }}
              style={{ backgroundImage: `url(${m.backdrop})` }}
            >
              <div className="coming-card__overlay" />
              <div className="coming-card__content">
                <h3 className="coming-card__title">{m.title}</h3>
                <p className="coming-card__year">{m.year} · {m.genre[0]}</p>
                <Link to={`/movies/${m.id}`} className="btn btn-outline" style={{ marginTop: '12px', fontSize: '0.72rem', padding: '8px 18px' }}>
                  {t('learnMore')}
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ====== PROMO BANNER ====== */}
      <section className="promo container">
        <div className="promo__card">
          <div className="promo__text">
            <h3 className="promo__title">{t('joinLoyalty')}</h3>
            <p className="promo__sub">{t('loyaltySub')}</p>
          </div>
          <Link to="/register" className="btn btn-primary">{t('joinFree')}</Link>
        </div>
      </section>

    </div>
  );
}