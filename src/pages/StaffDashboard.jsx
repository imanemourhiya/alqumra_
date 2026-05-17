import { Link } from 'react-router-dom';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { FiCamera, FiUsers, FiCalendar, FiLogOut, FiMapPin, FiClock } from 'react-icons/fi';
import { SESSIONS, MOVIES, CINEMAS } from '../data/mockData';
import { useLang } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import './StaffDashboard.css';

const STAFF_INFO = {
  cinema: 'Al-Qumra Casablanca',
  shift: '14:00 — 22:00',
  id: 'EMP-0021',
  since: 'Jan 2024',
};

export default function StaffDashboard() {
  const { t, lang } = useLang();
  const { user } = useAuth();
  const [tab, setTab] = useState('sessions');

  return (
    <div className="staff-page">
      <aside className="staff-sidebar">
        <div className="staff-brand">
          <span className="logo-icon">◈</span>
          <span className="logo-text">{t('staffPortal')}</span>
        </div>

        {user && (
          <div className="staff-profile">
            <div className="sp-avatar">{user.name?.split(' ').map(n=>n[0]).join('').slice(0,2).toUpperCase()}</div>
            <div className="sp-name">{user.name}</div>
            <div className="sp-role">{lang === 'ar' ? 'موظف' : 'Staff'}</div>
            <div className="sp-divider" />
            <div className="sp-row"><FiMapPin size={11}/> {STAFF_INFO.cinema}</div>
            <div className="sp-row"><FiClock size={11}/> {STAFF_INFO.shift}</div>
            <div className="sp-row" style={{justifyContent:'space-between'}}>
              <span style={{color:'var(--text-muted)',fontSize:'0.72rem'}}>ID</span>
              <span style={{color:'var(--accent)',fontSize:'0.72rem'}}>{STAFF_INFO.id}</span>
            </div>
          </div>
        )}

        <nav className="staff-nav">
          <button className={`staff-nav-btn ${tab==='sessions'?'active':''}`} onClick={()=>setTab('sessions')}>
            <FiCalendar /> {t('todaysSessions')}
          </button>
          <button className={`staff-nav-btn ${tab==='scanner'?'active':''}`} onClick={()=>setTab('scanner')}>
            <FiCamera /> {t('qrScanner')}
          </button>
          <button className={`staff-nav-btn ${tab==='walkin'?'active':''}`} onClick={()=>setTab('walkin')}>
            <FiUsers /> {t('walkInBooking')}
          </button>
        </nav>
        <Link to="/" className="staff-nav-btn" style={{marginTop:'auto',color:'var(--text-muted)'}}>
          <FiLogOut /> {t('exitToSite')}
        </Link>
      </aside>

      <main className="staff-main">
        {tab === 'sessions' && (
          <motion.div initial={{opacity:0}} animate={{opacity:1}} className="staff-content">
            <h2 className="staff-title">{t('todaysSessions')}</h2>
            <div className="staff-table-wrap">
              <table className="staff-table">
                <thead>
                  <tr>
                    <th>{t('film')}</th><th>{t('cinema')}</th><th>{t('hall')}</th>
                    <th>{t('time')}</th><th>{t('format')}</th><th>{t('price')}</th>
                  </tr>
                </thead>
                <tbody>
                  {SESSIONS.map(s => {
                    const movie = MOVIES.find(m => m.id === s.movieId);
                    const cinema = CINEMAS.find(c => c.id === s.cinemaId);
                    return (
                      <tr key={s.id}>
                        <td>{movie?.title}</td>
                        <td>{cinema?.city}</td>
                        <td>{s.hallId}</td>
                        <td>{s.time}</td>
                        <td><span className="badge badge-dark">{s.format}</span></td>
                        <td>{s.price} MAD</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </motion.div>
        )}

        {tab === 'scanner' && (
          <motion.div initial={{opacity:0}} animate={{opacity:1}} className="staff-content">
            <h2 className="staff-title">{t('qrScanner')}</h2>
            <div className="qr-scanner-ui">
              <div className="qr-viewfinder">
                <div className="qr-corner tl" /><div className="qr-corner tr" />
                <div className="qr-corner bl" /><div className="qr-corner br" />
                <div className="qr-scan-line" />
                <p className="qr-label">{t('pointCamera')}</p>
              </div>
              <p className="qr-note">{t('qrNote')}</p>
              <div className="qr-manual">
                <input className="form-input" placeholder={t('typeBookingId')} style={{flex:1}} />
                <button className="btn btn-primary">{t('validate')}</button>
              </div>
            </div>
          </motion.div>
        )}

        {tab === 'walkin' && (
          <motion.div initial={{opacity:0}} animate={{opacity:1}} className="staff-content">
            <h2 className="staff-title">{t('walkInBooking')}</h2>
            <div className="walkin-form card">
              <div className="form-group">
                <label className="form-label">{t('session')}</label>
                <select className="filter-select" style={{width:'100%',paddingRight:14}}>
                  {SESSIONS.map(s => {
                    const movie = MOVIES.find(m=>m.id===s.movieId);
                    return <option key={s.id} value={s.id}>{movie?.title} — {s.date} {s.time} ({s.hallId})</option>;
                  })}
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">{t('customerName')}</label>
                <input className="form-input" placeholder={t('fullName')} />
              </div>
              <div className="form-group">
                <label className="form-label">{t('seatLabel')}</label>
                <input className="form-input" placeholder="e.g. E5" />
              </div>
              <div className="form-group">
                <label className="form-label">{t('paymentMethod')}</label>
                <div style={{display:'flex',gap:12}}>
                  <label style={{cursor:'pointer',color:'var(--text-secondary)',fontSize:'0.88rem'}}>
                    <input type="radio" name="pay" defaultChecked style={{marginRight:6}}/>{t('cash')}
                  </label>
                  <label style={{cursor:'pointer',color:'var(--text-secondary)',fontSize:'0.88rem'}}>
                    <input type="radio" name="pay" style={{marginRight:6}}/>{t('card')}
                  </label>
                </div>
              </div>
              <button className="btn btn-primary" style={{alignSelf:'flex-start'}}>
                {t('confirmWalkIn')}
              </button>
            </div>
          </motion.div>
        )}
      </main>
    </div>
  );
}