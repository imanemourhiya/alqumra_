import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { MOVIES, GENRES, TYPES } from '../data/mockData';
import {
  FiZap, FiX, FiStar, FiClock, FiUser, FiFilm,
  FiGlobe, FiCalendar, FiChevronRight, FiChevronLeft,
  FiRefreshCw, FiPlay,
  FiCompass, FiHeart, FiAlertTriangle, FiSmile, FiCpu, FiUsers
} from 'react-icons/fi';
import './AIRecommendPage.css';

/* ─── Data ─── */
const MOODS = [
  { label: 'Aventure',  Icon: FiCompass,      genres: ['Adventure','Action'],         desc: 'Action & grands espaces' },
  { label: 'Émotion',   Icon: FiHeart,         genres: ['Drama','Romance'],             desc: 'Dramatiquement fort' },
  { label: 'Frissons',  Icon: FiAlertTriangle, genres: ['Thriller','Horror'],           desc: 'Suspense & tension' },
  { label: 'Rires',     Icon: FiSmile,         genres: ['Comedy','Animation'],          desc: 'Légèreté garantie' },
  { label: 'Réflexion', Icon: FiCpu,           genres: ['Sci-Fi','History','Mystery'],  desc: 'Pour l\'esprit curieux' },
  { label: 'Famille',   Icon: FiUsers,         genres: ['Animation','Family'],          desc: 'Pour tous les âges' },
  { label: 'Court',     Icon: FiClock,         genres: [],                              desc: 'Moins de 1h40' },
  { label: 'Classique', Icon: FiFilm,          genres: ['Drama','History'],             desc: 'Cinéma intemporel' },
];
const DURATIONS = [
  { label: '< 1h30',  max: 90 },
  { label: '1h30–2h', min: 90, max: 120 },
  { label: '> 2h',    min: 120 },
];
const RATINGS   = [{ label: '7+ ', min: 7 }, { label: '8+', min: 8 }, { label: '9+', min: 9 }];
const LANG_META = {
  EN: { flag: '🇬🇧', name: 'Anglais'  },
  FR: { flag: '🇫🇷', name: 'Français' },
  AR: { flag: '🇲🇦', name: 'Arabe'    },
  JA: { flag: '🇯🇵', name: 'Japonais' },
};

/* ─── Slide animation ─── */
const SLIDE = (dir) => ({
  initial:    { opacity: 0, x: dir * 60 },
  animate:    { opacity: 1, x: 0 },
  exit:       { opacity: 0, x: -dir * 60 },
  transition: { duration: 0.3, ease: [0.4, 0, 0.2, 1] },
});

/* ─── Step progress bar ─── */
function StepBar({ step, total }) {
  return (
    <div className="wizard-bar">
      {Array.from({ length: total }).map((_, i) => (
        <div key={i} className={`wizard-bar__seg ${i < step ? 'wizard-bar__seg--done' : i === step ? 'wizard-bar__seg--active' : ''}`} />
      ))}
    </div>
  );
}

const TOTAL_STEPS = 3;

export default function AIRecommendPage() {
  const [step,     setStep]     = useState(0);      // 0, 1, 2  → results
  const [dir,      setDir]      = useState(1);
  const [mood,     setMood]     = useState('');
  const [genre,    setGenre]    = useState('');
  const [type,     setType]     = useState('');
  const [duration, setDuration] = useState(null);
  const [minRating,setMinRating]= useState(null);
  const [lang,     setLang]     = useState('');
  const [year,     setYear]     = useState(null);
  const [results,   setResults]   = useState(null);
  const [noResults, setNoResults] = useState(false);
  const [loading,   setLoading]   = useState(false);

  const go = (d) => { setDir(d); setStep(s => s + d); };

  const handleGenerate = () => {
    setLoading(true); setResults(null); setNoResults(false);
    setTimeout(() => {
      let pool = [...MOVIES];
      if (genre)   pool = pool.filter(m => m.genre.includes(genre));
      if (type)    pool = pool.filter(m => m.type === type);
      if (mood) {
        const m = MOODS.find(x => x.label === mood);
        if (m?.genres.length) {
          const hit = pool.filter(mv => mv.genre.some(g => m.genres.includes(g)));
          if (hit.length >= 2) pool = hit;
        }
        if (mood === 'Court') pool = pool.filter(m => m.duration < 100);
      }
      if (duration?.min != null) pool = pool.filter(m => m.duration >= duration.min);
      if (duration?.max != null) pool = pool.filter(m => m.duration  < duration.max);
      if (minRating) pool = pool.filter(m => m.rating >= minRating);
      if (lang)   pool = pool.filter(m => m.language === lang);
      if (year)   pool = pool.filter(m => m.year === year);

      if (!pool.length) {
        setNoResults(true);
        setLoading(false);
        return;
      }
      setResults(pool.sort(() => Math.random() - 0.5).slice(0, 3));
      setLoading(false);
    }, 1200);
  };

  const resetAll = () => {
    setStep(0); setDir(-1); setResults(null); setNoResults(false);
    setMood(''); setGenre(''); setType('');
    setDuration(null); setMinRating(null); setLang(''); setYear(null);
  };

  /* ── Labels for summary ── */
  const chips = [mood, genre, type,
    duration?.label, minRating && `≥${minRating}★`, lang && LANG_META[lang]?.name,
    year && String(year)
  ].filter(Boolean);

  /* ────────────────────── RENDER ────────────────────── */
  return (
    <div className="ai-page page-enter">
      <div className="container ai-inner">

        {/* ── No results ── */}
        {noResults && !loading && (
          <motion.div className="wizard-noresults" initial={{ opacity:0, y:16 }} animate={{ opacity:1, y:0 }}>
            <FiFilm size={36} className="wizard-noresults__icon" />
            <h3>Aucune séance disponible</h3>
            <p>Aucun film au programme ne correspond à vos critères.<br/>Essayez d'assouplir votre recherche (genre, durée, langue…)</p>
            <button className="btn btn-primary" onClick={resetAll}>
              <FiRefreshCw size={14} /> Modifier mes critères
            </button>
          </motion.div>
        )}

        {/* ── Loading state ── */}
        {loading && (
          <div className="wizard-loading">
            <div className="wl-orbs"><div className="orb"/><div className="orb"/><div className="orb"/></div>
            <p className="wl-text">Analyse de la bibliothèque…</p>
          </div>
        )}

        {/* ── Results ── */}
        {results && !loading && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>

            {/* Summary chips */}
            <div className="wizard-summary">
              <span className="wizard-summary__label">Sélection basée sur :</span>
              {chips.map(c => <span key={c} className="wizard-summary__chip">{c}</span>)}
              <button className="btn btn-ghost" style={{ marginLeft: 'auto', fontSize: '0.78rem' }} onClick={resetAll}>
                <FiRefreshCw size={12} /> Recommencer
              </button>
            </div>

            {/* Film cards */}
            <div className="ai-results-title">Films disponibles à l'affiche</div>
            <div className="ai-cards">
              {results.map((movie, i) => (
                <motion.div key={movie.id} className="ai-card card"
                  initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.12 }}>
                  <div className="ai-card__poster-wrap">
                    <img src={movie.poster} alt={movie.title} className="ai-card__poster"/>
                    <div className="ai-card__rank-badge">#{i + 1}</div>
                    {movie.nowShowing && <div className="ai-card__now-badge">En salle</div>}
                  </div>
                  <div className="ai-card__body">
                    <h3 className="ai-card__title">{movie.title}</h3>
                    <div className="ai-card__meta-grid">
                      <span className="ai-meta-item"><FiStar size={11}/> {movie.rating}/10</span>
                      <span className="ai-meta-item"><FiClock size={11}/> {movie.duration} min</span>
                      <span className="ai-meta-item"><FiCalendar size={11}/> {movie.year}</span>
                      <span className="ai-meta-item"><FiGlobe size={11}/> {LANG_META[movie.language]?.name ?? movie.language}</span>
                    </div>
                    <div className="ai-card__genres">
                      {movie.genre.map(g => <span key={g} className="ai-genre-tag">{g}</span>)}
                    </div>
                    <div className="ai-card__crew">
                      <div className="ai-crew-row"><FiUser size={11}/><strong>Réal.</strong> {movie.director}</div>
                      <div className="ai-crew-row"><FiFilm size={11}/><strong>Avec</strong> {movie.cast.slice(0, 2).join(', ')}</div>
                    </div>
                    <p className="ai-card__synopsis">{movie.synopsis}</p>
                    <div className="ai-card__cta">
                      <Link to={`/movies/${movie.id}`} className="btn btn-primary" style={{ flex: 1, justifyContent: 'center', fontSize: '0.8rem' }}>Réserver</Link>
                      <Link to={`/movies/${movie.id}`} className="btn btn-ghost" style={{ fontSize: '0.8rem', padding: '9px 14px' }}>Détails</Link>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            <button className="btn btn-ghost" style={{ marginTop: 16, fontSize: '0.82rem' }} onClick={generate}>
              <FiRefreshCw size={13}/> Nouvelle sélection
            </button>
          </motion.div>
        )}

        {/* ── Wizard ── */}
        {!results && !loading && (
          <div className="wizard">
            <StepBar step={step} total={TOTAL_STEPS} />

            <AnimatePresence mode="wait" custom={dir}>
              {/* ── STEP 0 : Mood ── */}
              {step === 0 && (
                <motion.div key="s0" {...SLIDE(dir)} className="wizard-step">
                  <p className="wizard-step__num">Étape 1 sur 3</p>
                  <h2 className="wizard-step__q">Quelle humeur ce soir ?</h2>
                  <p className="wizard-step__hint">Choisissez-en une (ou passez)</p>
                  <div className="mood-grid">
                    {MOODS.map(m => (
                      <button
                        key={m.label}
                        className={`mood-tile ${mood === m.label ? 'mood-tile--active' : ''}`}
                        onClick={() => setMood(mood === m.label ? '' : m.label)}
                      >
                        <m.Icon size={24} className="mood-tile__icon" />
                        <span className="mood-tile__label">{m.label}</span>
                        <span className="mood-tile__desc">{m.desc}</span>
                      </button>
                    ))}
                  </div>
                  <div className="wizard-nav">
                    <span />
                    <button className="btn btn-primary" onClick={() => go(1)}>
                      {mood ? `Continuer avec "${mood}"` : 'Passer'} <FiChevronRight/>
                    </button>
                  </div>
                </motion.div>
              )}

              {/* ── STEP 1 : Genre ── */}
              {step === 1 && (
                <motion.div key="s1" {...SLIDE(dir)} className="wizard-step">
                  <p className="wizard-step__num">Étape 2 sur 3</p>
                  <h2 className="wizard-step__q">Quel genre préférez-vous ?</h2>
                  <p className="wizard-step__hint">Un seul choix (ou passez)</p>
                  <div className="genre-pill-grid">
                    {GENRES.map(g => (
                      <button key={g}
                        className={`genre-pill ${genre === g ? 'genre-pill--active' : ''}`}
                        onClick={() => setGenre(genre === g ? '' : g)}
                      >{g}</button>
                    ))}
                  </div>
                  <div className="wizard-nav">
                    <button className="btn btn-ghost" onClick={() => go(-1)}><FiChevronLeft/> Retour</button>
                    <button className="btn btn-primary" onClick={() => go(1)}>
                      {genre ? `Continuer` : 'Passer'} <FiChevronRight/>
                    </button>
                  </div>
                </motion.div>
              )}

              {/* ── STEP 2 : Preferences ── */}
              {step === 2 && (
                <motion.div key="s2" {...SLIDE(dir)} className="wizard-step">
                  <p className="wizard-step__num">Étape 3 sur 3</p>
                  <h2 className="wizard-step__q">Quelques préférences ?</h2>
                  <p className="wizard-step__hint">Tout est optionnel</p>

                  <div className="pref-grid">
                    {/* Duration */}
                    <div className="pref-group">
                      <label className="pref-label"><FiClock size={12}/> Durée</label>
                      <div className="pref-chips">
                        {DURATIONS.map(d => (
                          <button key={d.label}
                            className={`pref-chip ${duration?.label === d.label ? 'pref-chip--active' : ''}`}
                            onClick={() => setDuration(duration?.label === d.label ? null : d)}
                          >{d.label}</button>
                        ))}
                      </div>
                    </div>

                    {/* Rating */}
                    <div className="pref-group">
                      <label className="pref-label"><FiStar size={12}/> Note minimum</label>
                      <div className="pref-chips">
                        {RATINGS.map(r => (
                          <button key={r.label}
                            className={`pref-chip ${minRating === r.min ? 'pref-chip--active' : ''}`}
                            onClick={() => setMinRating(minRating === r.min ? null : r.min)}
                          >{r.label}</button>
                        ))}
                      </div>
                    </div>

                    {/* Language */}
                    <div className="pref-group">
                      <label className="pref-label"><FiGlobe size={12}/> Langue</label>
                      <div className="pref-chips">
                        {Object.entries(LANG_META).map(([code, { flag, name }]) => (
                          <button key={code}
                            className={`pref-chip ${lang === code ? 'pref-chip--active' : ''}`}
                            onClick={() => setLang(lang === code ? '' : code)}
                          >{flag} {name}</button>
                        ))}
                      </div>
                    </div>

                    {/* Year */}
                    <div className="pref-group">
                      <label className="pref-label"><FiCalendar size={12}/> Année</label>
                      <div className="pref-chips">
                        {[2024, 2023, 2022, 2021].map(y => (
                          <button key={y}
                            className={`pref-chip ${year === y ? 'pref-chip--active' : ''}`}
                            onClick={() => setYear(year === y ? null : y)}
                          >{y}</button>
                        ))}
                      </div>
                    </div>

                    {/* Format */}
                    <div className="pref-group">
                      <label className="pref-label"><FiPlay size={12}/> Format</label>
                      <div className="pref-chips">
                        {TYPES.map(tp => (
                          <button key={tp}
                            className={`pref-chip ${type === tp ? 'pref-chip--active' : ''}`}
                            onClick={() => setType(type === tp ? '' : tp)}
                          >{tp}</button>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="wizard-nav">
                    <button className="btn btn-ghost" onClick={() => go(-1)}><FiChevronLeft/> Retour</button>
                    <button className="btn btn-primary wizard-generate" onClick={handleGenerate}>
                      <FiZap/> Trouver des séances
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}

      </div>
    </div>
  );
}