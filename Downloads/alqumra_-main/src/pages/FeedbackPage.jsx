import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FiStar, FiCheckCircle, FiMessageSquare, FiFilm,
  FiThumbsUp, FiThumbsDown, FiSend
} from 'react-icons/fi';
import { MOVIES } from '../data/mockData';
import './SimplePage.css';
import './FeedbackPage.css';

const CATEGORIES = [
  'Image & son', 'Confort des sièges', 'Accueil', 'Propreté', 'Cafétéria', 'Application',
];

export default function FeedbackPage() {
  const [rating, setRating] = useState(0);
  const [hovered, setHovered] = useState(0);
  const [category, setCategory] = useState('');
  const [film, setFilm] = useState('');
  const [text, setText] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const ratingLabel = ['', 'Décevant', 'Passable', 'Bien', 'Très bien', 'Excellent !'][rating] || '';

  const handleSubmit = (e) => {
    e.preventDefault();
    if (rating === 0 || !text.trim()) return;
    setSubmitted(true);
  };

  return (
    <div className="simple-page page-enter">
      <div className="container">

        {/* Page header */}
        <div className="fb-header">
          <div className="fb-header__icon">
            <FiMessageSquare size={22} />
          </div>
          <div>
            <h1 className="fb-header__title">Votre avis nous importe</h1>
            <p className="fb-header__sub">Aidez-nous à améliorer votre expérience Al-Qumra</p>
          </div>
        </div>

        <AnimatePresence mode="wait">
          {submitted ? (
            <motion.div
              key="success"
              className="fb-success card"
              initial={{ scale: 0.88, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            >
              <div className="fb-success__icon">
                <FiCheckCircle size={40} />
              </div>
              <h2 className="fb-success__title">Merci pour votre retour !</h2>
              <p className="fb-success__sub">
                Votre avis a bien été enregistré. Il nous aide à offrir la meilleure expérience cinéma possible.
              </p>
              <div className="fb-success__rating">
                {[1,2,3,4,5].map(n => (
                  <span key={n} style={{ color: n <= rating ? 'var(--accent)' : 'var(--border)' }}>★</span>
                ))}
              </div>
              <button
                className="btn-primary prf-save-btn"
                style={{ alignSelf: 'center', marginTop: 20 }}
                onClick={() => { setSubmitted(false); setRating(0); setText(''); setCategory(''); setFilm(''); }}
              >
                Soumettre un autre avis
              </button>
            </motion.div>
          ) : (
            <motion.form
              key="form"
              className="fb-form card"
              onSubmit={handleSubmit}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.28 }}
            >
              {/* Star rating */}
              <div className="fb-section">
                <label className="fb-label">Note globale <span className="fb-required">*</span></label>
                <div className="fb-stars">
                  {[1,2,3,4,5].map(n => (
                    <button
                      key={n}
                      type="button"
                      className={`star-btn ${n <= (hovered || rating) ? 'active' : ''}`}
                      onMouseEnter={() => setHovered(n)}
                      onMouseLeave={() => setHovered(0)}
                      onClick={() => setRating(n)}
                      aria-label={`${n} étoile${n > 1 ? 's' : ''}`}
                    >★</button>
                  ))}
                  {(hovered || rating) > 0 && (
                    <motion.span
                      className="fb-rating-label"
                      initial={{ opacity: 0, x: -6 }}
                      animate={{ opacity: 1, x: 0 }}
                      key={hovered || rating}
                    >
                      {['', 'Décevant', 'Passable', 'Bien', 'Très bien', 'Excellent !'][hovered || rating]}
                    </motion.span>
                  )}
                </div>
              </div>

              {/* Category */}
              <div className="fb-section">
                <label className="fb-label">Catégorie</label>
                <div className="feedback-category">
                  {CATEGORIES.map(c => (
                    <button
                      key={c}
                      type="button"
                      className={`feedback-cat-btn ${category === c ? 'feedback-cat-btn--active' : ''}`}
                      onClick={() => setCategory(prev => prev === c ? '' : c)}
                    >{c}</button>
                  ))}
                </div>
              </div>

              {/* Film */}
              <div className="fb-section">
                <label className="fb-label">Film concerné <span className="fb-optional">(optionnel)</span></label>
                <select
                  className="form-input fb-select"
                  value={film}
                  onChange={e => setFilm(e.target.value)}
                >
                  <option value="">— Sélectionner un film —</option>
                  {MOVIES.filter(m => m.nowShowing).map(m => (
                    <option key={m.id} value={m.title}>{m.title}</option>
                  ))}
                </select>
              </div>

              {/* Comment */}
              <div className="fb-section">
                <label className="fb-label">
                  Votre commentaire <span className="fb-required">*</span>
                  <span className="fb-char-count">{text.length}/500</span>
                </label>
                <textarea
                  className="form-input fb-textarea"
                  rows={5}
                  placeholder="Partagez votre expérience en détail…"
                  value={text}
                  maxLength={500}
                  onChange={e => setText(e.target.value)}
                />
              </div>

              {/* Submit */}
              <div className="fb-footer">
                <div className="fb-footer__hint">
                  {rating === 0 || !text.trim()
                    ? 'Veuillez donner une note et un commentaire'
                    : <><FiThumbsUp size={13} /> Prêt à envoyer !</>
                  }
                </div>
                <button
                  type="submit"
                  className="prf-save-btn btn-primary"
                  disabled={rating === 0 || !text.trim()}
                  style={{ gap: 8 }}
                >
                  <FiSend size={14} /> Envoyer mon avis
                </button>
              </div>
            </motion.form>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}