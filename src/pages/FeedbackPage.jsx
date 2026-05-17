import { useState } from 'react';
import { motion } from 'framer-motion';
import { FiMessageSquare, FiCheckCircle } from 'react-icons/fi';
import { useLang } from '../context/LanguageContext';
import './SimplePage.css';

export default function FeedbackPage() {
  const { t } = useLang();
  const [rating, setRating] = useState(0);
  const [text, setText] = useState('');
  const [submitted, setSubmitted] = useState(false);

  return (
    <div className="simple-page page-enter">
      <div className="container">
        <h1 className="simple-page__title"><FiMessageSquare /> {t('submitFeedback')}</h1>
        {submitted ? (
          <motion.div className="feedback-card card" style={{padding:32}} initial={{scale:0.9,opacity:0}} animate={{scale:1,opacity:1}}>
            <FiCheckCircle style={{fontSize:'3rem',color:'var(--accent)',marginBottom:12}} />
            <h3 style={{fontFamily:'Cinzel,serif',color:'var(--text-primary)',marginBottom:8}}>{t('thankYou')}</h3>
            <p style={{color:'var(--text-muted)'}}>{t('feedbackHelps')}</p>
          </motion.div>
        ) : (
          <div className="feedback-card card" style={{padding:28}}>
            <div className="form-group" style={{marginBottom:20}}>
              <label className="form-label">{t('yourRating')}</label>
              <div className="stars-input">
                {[1,2,3,4,5].map(n => <button key={n} className={`star-btn ${n <= rating ? 'active' : ''}`} onClick={() => setRating(n)}>★</button>)}
              </div>
            </div>
            <div className="form-group" style={{marginBottom:20}}>
              <label className="form-label">{t('filmSession')}</label>
              <input className="form-input" placeholder="e.g. Dune: Part Two, 20 Jul 18:00" />
            </div>
            <div className="form-group" style={{marginBottom:24}}>
              <label className="form-label">{t('yourComment')}</label>
              <textarea className="form-input" rows={5} placeholder={t('shareExperience')} value={text} onChange={e=>setText(e.target.value)} style={{resize:'vertical'}} />
            </div>
            <button className="btn btn-primary" disabled={rating===0 || !text.trim()} onClick={() => setSubmitted(true)}>
              {t('submitFeedbackBtn')}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}