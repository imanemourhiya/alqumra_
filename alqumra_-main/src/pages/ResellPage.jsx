import { useState } from 'react';
import { motion } from 'framer-motion';
import { BOOKINGS } from '../data/mockData';
import { FiAlertTriangle, FiCheckCircle } from 'react-icons/fi';
import { useLang } from '../context/LanguageContext';
import './SimplePage.css';

export default function ResellPage() {
  const { t } = useLang();
  const [selected, setSelected] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const eligible = BOOKINGS.filter(b => b.status === 'confirmed');

  return (
    <div className="simple-page page-enter">
      <div className="container">
        <h1 className="simple-page__title">{t('resellTitle')}</h1>
        {submitted ? (
          <motion.div className="resell-card card" style={{padding:32}} initial={{scale:0.9,opacity:0}} animate={{scale:1,opacity:1}}>
            <FiCheckCircle style={{fontSize:'3rem',color:'var(--accent)',marginBottom:12}} />
            <h3 style={{fontFamily:'Cinzel,serif',color:'var(--text-primary)',marginBottom:8}}>{t('ticketListed')}</h3>
            <p style={{color:'var(--text-muted)',fontSize:'0.88rem'}}>{t('ticketListedSub')}</p>
          </motion.div>
        ) : (
          <div className="resell-card card" style={{padding:28}}>
            <div className="resell-notice">
              <FiAlertTriangle style={{marginRight:8}} />
              <strong>Note:</strong> {t('resellNote')}
            </div>
            <div className="resell-form">
              <div className="form-group">
                <label className="form-label">{t('selectBooking')}</label>
                <select className="filter-select" style={{width:'100%',paddingRight:14}} value={selected} onChange={e=>setSelected(e.target.value)}>
                  <option value="">{t('chooseBooking')}</option>
                  {eligible.map(b => <option key={b.id} value={b.id}>{b.id} · {b.movieTitle} · {b.date}</option>)}
                </select>
              </div>
              <p style={{fontSize:'0.82rem',color:'var(--text-muted)'}}>{t('estimatedRefund')} <strong style={{color:'var(--accent)'}}>{selected ? Math.round(eligible.find(b=>b.id===selected)?.total * 0.5) + ' MAD' : '—'}</strong></p>
              <button className="btn btn-danger" disabled={!selected} onClick={() => setSubmitted(true)} style={{alignSelf:'flex-start'}}>
                {t('confirmResell')}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}