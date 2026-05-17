import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiMail, FiCheckCircle } from 'react-icons/fi';
import { useLang } from '../context/LanguageContext';
import './AuthPages.css';

export default function ResetPasswordPage() {
  const { t } = useLang();
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  return (
    <div className="auth-page">
      <div className="auth-bg" />
      <motion.div className="auth-card glass" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <div className="auth-logo"><span>◈</span><p className="auth-logo-text">AL<span>QUMRA</span></p></div>
        {submitted ? (
          <div style={{ textAlign: 'center' }}>
            <FiCheckCircle style={{ fontSize: '3rem', color: 'var(--accent)', marginBottom: 16 }} />
            <h2 className="auth-title">{t('checkEmail')}</h2>
            <p className="auth-sub">{t('resetSent')} <strong>{email}</strong></p>
            <Link to="/login" className="btn btn-primary" style={{ marginTop: 24, width: '100%', justifyContent: 'center' }}>{t('backToSignIn')}</Link>
          </div>
        ) : (
          <>
            <h2 className="auth-title">{t('resetPassword')}</h2>
            <p className="auth-sub">{t('resetSub')}</p>
            <form onSubmit={e => { e.preventDefault(); if(email) setSubmitted(true); }} className="auth-form">
              <div className="form-group">
                <label className="form-label"><FiMail /> Email</label>
                <input type="email" className="form-input" placeholder="you@example.com" value={email} onChange={e => setEmail(e.target.value)} required />
              </div>
              <button type="submit" className="btn btn-primary auth-submit">{t('sendResetLink')}</button>
            </form>
            <p className="auth-switch"><Link to="/login">← {t('backToSignIn')}</Link></p>
          </>
        )}
      </motion.div>
    </div>
  );
}