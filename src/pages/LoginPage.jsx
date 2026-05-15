import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { useLang } from '../context/LanguageContext';
import { FiMail, FiLock, FiEye, FiEyeOff, FiAlertCircle } from 'react-icons/fi';
import './AuthPages.css';

export default function LoginPage() {
  const { login } = useAuth();
  const { t } = useLang();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [show, setShow] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [googleMsg, setGoogleMsg] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email || !password) { setError('Please fill in all fields.'); return; }
    setLoading(true); setError('');
    setTimeout(() => {
      const result = login(email, password);
      setLoading(false);
      if (result.role === 'admin') navigate('/admin');
      else if (result.role === 'staff') navigate('/staff');
      else navigate('/');
    }, 900);
  };

  return (
    <div className="auth-page">
      <div className="auth-bg" />
      <motion.div className="auth-card glass" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <div className="auth-logo">
          <img src="/logo.jpg" alt="Al-Qumra Cinema" style={{ height: '70px', width: 'auto', borderRadius: '50%', marginBottom: '12px' }} />
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <span className="logo-signature" style={{ fontSize: '2.5rem' }}>al-qumra</span>
          </div>
        </div>
        <h2 className="auth-title">{t('welcomeBack')}</h2>
        <p className="auth-sub">{t('signInAccount')}</p>
        {error && <div className="auth-error"><FiAlertCircle /> {error}</div>}
        {googleMsg && <div className="auth-info">{googleMsg}</div>}
        <div className="auth-hint"><strong>Demo:</strong> admin@alqumra.ma / admin123 · staff@alqumra.ma / staff123</div>
        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label className="form-label"><FiMail /> Email</label>
            <input type="email" className="form-input" placeholder="you@example.com" value={email} onChange={e=>setEmail(e.target.value)} />
          </div>
          <div className="form-group">
            <label className="form-label"><FiLock /> {t('password')}</label>
            <div className="input-wrap">
              <input type={show ? 'text' : 'password'} className="form-input" placeholder="••••••••" value={password} onChange={e=>setPassword(e.target.value)} />
              <button type="button" className="eye-btn" onClick={() => setShow(v=>!v)}>{show ? <FiEyeOff /> : <FiEye />}</button>
            </div>
          </div>
          <Link to="/reset-password" className="auth-forgot">{t('forgotPassword')}</Link>
          <button type="submit" className="btn btn-primary auth-submit" disabled={loading}>
            {loading ? t('signingIn') : t('signInBtn')}
          </button>
        </form>
        <div className="auth-divider"><span>{t('orDivider')}</span></div>
        <button className="google-btn" onClick={() => setGoogleMsg('Google Sign-In sera disponible une fois connecté au backend.')}>
          <svg width="18" height="18" viewBox="0 0 18 18"><path fill="#4285F4" d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.797 2.717v2.258h2.908c1.702-1.567 2.684-3.875 2.684-6.615Z"/><path fill="#34A853" d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18Z"/><path fill="#FBBC05" d="M3.964 10.71A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.042l3.007-2.332Z"/><path fill="#EA4335" d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58Z"/></svg>
          {t('continueGoogle')}
        </button>
        <p className="auth-switch">{t('noAccount')} <Link to="/register">{t('joinAlQumra')}</Link></p>
      </motion.div>
    </div>
  );
}