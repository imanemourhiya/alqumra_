import { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, EffectFade, FreeMode, Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/effect-fade';
import 'swiper/css/free-mode';
import 'swiper/css/navigation';
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
  const heroSwiperRef = useRef(null);
  const nowPrevRef = useRef(null);
  const nowNextRef = useRef(null);

  return (
    <div className="home page-enter">

      {/* ====== HERO ====== */}
      <section className="hero">
        <Swiper
          modules={[Autoplay, EffectFade]}
          effect="fade"
          fadeEffect={{ crossFade: true }}   /* ← KEY FIX: prevents slide stacking */
          autoplay={{ delay: 5000, disableOnInteraction: false }}
          loop
          onSwiper={swiper => { heroSwiperRef.current = swiper; }}
          onSlideChange={s => setActiveHero(s.realIndex)}
          className="hero__swiper"
        >
          {HERO_MOVIES.map(movie => (
            <SwiperSlide key={movie.id}>
              <div className="hero__slide">
                <div
                  className="hero__bg"
                  style={{ backgroundImage: `url(${movie.backdrop})` }}
                />
                <div className="hero__gradient" />
                <div className="hero__content container">
                  {/* AnimatePresence + key on activeHero prevents ghost text overlap */}
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={activeHero}
                      initial={{ opacity: 0, y: 32 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -16 }}
                      transition={{ duration: 0.55 }}
                      className="hero__text"
                    >
                      <div className="hero__label">
                        <span className="ornament-dot" />
                        {t('nowShowing')}
                      </div>
                      <h1 className="hero__title">{HERO_MOVIES[activeHero]?.title}</h1>
                      <div className="hero__meta">
                        <span><FiStar style={{color:'var(--accent)'}} /> {HERO_MOVIES[activeHero]?.rating}</span>
                        <span>{HERO_MOVIES[activeHero]?.duration} {t('min')}</span>
                        <span>{HERO_MOVIES[activeHero]?.genre.join(' · ')}</span>
                      </div>
                      <p className="hero__synopsis">{HERO_MOVIES[activeHero]?.synopsis.slice(0, 180)}…</p>
                      <div className="hero__actions">
                        <Link to={`/movies/${HERO_MOVIES[activeHero]?.id}`} className="btn btn-primary">
                          <FiCalendar /> {t('bookTickets')}
                        </Link>
                        <Link to={`/movies/${HERO_MOVIES[activeHero]?.id}`} className="btn btn-outline">
                          <FiPlay /> {t('trailer')}
                        </Link>
                      </div>
                    </motion.div>
                  </AnimatePresence>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>

        {/* Poster strip with nav arrows */}
        <div className="hero__strip container">
          <button
            className="hero__strip-arrow hero__strip-arrow--prev"
            onClick={() => heroSwiperRef.current?.slidePrev()}
            aria-label="Previous"
          >
            <FiChevronLeft />
          </button>

          {HERO_MOVIES.map((m, i) => (
            <div
              key={m.id}
              className={`strip-poster ${i === activeHero ? 'strip-poster--active' : ''}`}
              style={{ backgroundImage: `url(${m.poster})` }}
              onClick={() => heroSwiperRef.current?.slideTo(i)}
            />
          ))}

          <button
            className="hero__strip-arrow hero__strip-arrow--next"
            onClick={() => heroSwiperRef.current?.slideNext()}
            aria-label="Next"
          >
            <FiChevronRight />
          </button>
        </div>
      </section>

      {/* ====== NOW SHOWING — Auto-scroll Swiper with nav buttons ====== */}
      <section className="home-section container">
        <div className="section-header">
          <h2 className="section-title">{t('nowShowing')}</h2>
          <div className="section-header__right">
            <div className="now-nav">
              <button ref={nowPrevRef} className="now-nav__btn" aria-label="Previous"><FiChevronLeft /></button>
              <button ref={nowNextRef} className="now-nav__btn" aria-label="Next"><FiChevronRight /></button>
            </div>
            <Link to="/movies" className="section-more">{t('allFilms')} <FiChevronRight /></Link>
          </div>
        </div>
        <div className="now-carousel">
          <Swiper
            modules={[Autoplay, FreeMode, Navigation]}
            slidesPerView="auto"
            spaceBetween={20}
            freeMode={{ enabled: true, momentum: true }}
            autoplay={{ delay: 2500, disableOnInteraction: false, pauseOnMouseEnter: true }}
            loop={NOW_SHOWING.length > 4}
            navigation={{ prevEl: nowPrevRef.current, nextEl: nowNextRef.current }}
            onBeforeInit={swiper => {
              swiper.params.navigation.prevEl = nowPrevRef.current;
              swiper.params.navigation.nextEl = nowNextRef.current;
            }}
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
                <Link to={`/movies/${m.id}`} className="btn btn-outline" style={{marginTop:'12px',fontSize:'0.72rem',padding:'8px 18px'}}>
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
