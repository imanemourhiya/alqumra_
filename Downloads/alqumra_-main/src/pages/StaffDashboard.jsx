import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiCamera, FiUsers, FiCalendar, FiLogOut, FiSearch, FiCheck, FiX, FiHash } from 'react-icons/fi';
import { SESSIONS, MOVIES, CINEMAS, BOOKINGS } from '../data/mockData';
import './StaffDashboard.css';

/* Mock valid booking IDs for demo */
const VALID_IDS = new Set(BOOKINGS.map(b => b.id));

export default function StaffDashboard() {
  const [tab, setTab] = useState('sessions');
  const [ticketCode, setTicketCode] = useState('');
  const [verifyResult, setVerifyResult] = useState(null); // null | { ok, booking }

  /* Manual ticket code verification */
  const verifyTicket = () => {
    const code = ticketCode.trim().toUpperCase();
    if (!code) return;
    const booking = BOOKINGS.find(b =>
      String(b.id).toUpperCase() === code ||
      (b.qrCode && b.qrCode.toUpperCase().includes(code))
    );
    if (booking) {
      const movie = MOVIES.find(m => m.id === booking.movieId);
      setVerifyResult({ ok: true, booking, movie });
    } else {
      setVerifyResult({ ok: false });
    }
  };

  return (
    <div className="staff-page">
      {/* Sidebar */}
      <aside className="staff-sidebar">
        <div className="staff-brand">
          <span className="logo-icon">◈</span>
          <span className="logo-text">STAFF PORTAL</span>
        </div>
        <nav className="staff-nav">
          <button className={`staff-nav-btn ${tab === 'sessions' ? 'active' : ''}`} onClick={() => setTab('sessions')}>
            <FiCalendar /> Séances du jour
          </button>
          <button className={`staff-nav-btn ${tab === 'scanner' ? 'active' : ''}`} onClick={() => setTab('scanner')}>
            <FiCamera /> Validation billets
          </button>
          <button className={`staff-nav-btn ${tab === 'walkin' ? 'active' : ''}`} onClick={() => setTab('walkin')}>
            <FiUsers /> Réservation guichet
          </button>
        </nav>
        <Link to="/" className="staff-nav-btn" style={{ marginTop: 'auto', color: 'var(--text-muted)' }}>
          <FiLogOut /> Retour au site
        </Link>
      </aside>

      {/* Main */}
      <main className="staff-main">
        {tab === 'sessions' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="staff-content">
            <h2 className="staff-title">Séances du jour</h2>
            <div className="staff-table-wrap">
              <table className="staff-table">
                <thead>
                  <tr>
                    <th>Film</th><th>Cinéma</th><th>Salle</th><th>Heure</th><th>Format</th><th>Prix</th>
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
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="staff-content">
            <h2 className="staff-title">Validation des billets</h2>

            {/* Method tabs */}
            <div className="staff-method-tabs">
              <div className="staff-method-card card">
                <div className="staff-method-card__icon"><FiCamera size={24} /></div>
                <div>
                  <h4>Scan QR Code</h4>
                  <p>Via appareil mobile ou tablette</p>
                </div>
                <div className="qr-viewfinder" style={{ marginTop: 16 }}>
                  <div className="qr-corner tl" /><div className="qr-corner tr" />
                  <div className="qr-corner bl" /><div className="qr-corner br" />
                  <div className="qr-scan-line" />
                  <p className="qr-label">Pointer la caméra vers le QR du billet</p>
                </div>
                <p className="qr-note">En production, cette zone active la caméra pour validation en temps réel.</p>
              </div>

              <div className="staff-method-divider">ou</div>

              <div className="staff-method-card card">
                <div className="staff-method-card__icon"><FiHash size={24} /></div>
                <div>
                  <h4>Saisie manuelle du code</h4>
                  <p>Pour PC ou si la caméra est indisponible</p>
                </div>
                <div className="staff-verify-form">
                  <div className="staff-verify-input-wrap">
                    <input
                      className="form-input staff-verify-input"
                      placeholder="Ex : BK-1001 ou 1001"
                      value={ticketCode}
                      onChange={e => { setTicketCode(e.target.value); setVerifyResult(null); }}
                      onKeyDown={e => e.key === 'Enter' && verifyTicket()}
                    />
                    <button className="btn btn-primary staff-verify-btn" onClick={verifyTicket}>
                      <FiSearch /> Vérifier
                    </button>
                  </div>
                  <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: 6 }}>
                    Entrez l'ID de réservation ou le code imprimé sur le billet
                  </p>

                  <AnimatePresence mode="wait">
                    {verifyResult && (
                      <motion.div
                        key={verifyResult.ok ? 'ok' : 'fail'}
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -8 }}
                        className={`staff-verify-result ${verifyResult.ok ? 'staff-verify-result--ok' : 'staff-verify-result--fail'}`}
                      >
                        {verifyResult.ok ? (
                          <>
                            <div className="staff-verify-result__icon"><FiCheck /></div>
                            <div>
                              <strong>Billet valide</strong>
                              <p>{verifyResult.booking.movieTitle}</p>
                              <p>{verifyResult.booking.date} · {verifyResult.booking.time}</p>
                              <p>Places : {verifyResult.booking.seats?.join(', ')}</p>
                            </div>
                          </>
                        ) : (
                          <>
                            <div className="staff-verify-result__icon"><FiX /></div>
                            <div>
                              <strong>Billet introuvable</strong>
                              <p>Vérifiez le code et réessayez.</p>
                            </div>
                          </>
                        )}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {tab === 'walkin' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="staff-content">
            <h2 className="staff-title">Réservation guichet</h2>
            <div className="walkin-form card">
              <div className="form-group"><label className="form-label">Séance</label>
                <select className="filter-select" style={{ width: '100%', paddingRight: 14 }}>
                  {SESSIONS.map(s => {
                    const movie = MOVIES.find(m => m.id === s.movieId);
                    return <option key={s.id} value={s.id}>{movie?.title} — {s.date} {s.time} ({s.hallId})</option>;
                  })}
                </select>
              </div>
              <div className="form-group"><label className="form-label">Nom client</label><input className="form-input" placeholder="Nom complet" /></div>
              <div className="form-group"><label className="form-label">Place</label><input className="form-input" placeholder="ex : E5" /></div>
              <div className="form-group"><label className="form-label">Paiement</label>
                <div style={{ display: 'flex', gap: 12 }}>
                  <label style={{ cursor: 'pointer', color: 'var(--text-secondary)', fontSize: '0.88rem' }}><input type="radio" name="pay" defaultChecked style={{ marginRight: 6 }} />Espèces</label>
                  <label style={{ cursor: 'pointer', color: 'var(--text-secondary)', fontSize: '0.88rem' }}><input type="radio" name="pay" style={{ marginRight: 6 }} />Carte (TPE)</label>
                </div>
              </div>
              <button className="btn btn-primary" style={{ alignSelf: 'flex-start' }}>Confirmer la réservation</button>
            </div>
          </motion.div>
        )}
      </main>
    </div>
  );
}
