import { Link } from 'react-router-dom';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { FiCamera, FiUsers, FiCalendar, FiLogOut } from 'react-icons/fi';
import { SESSIONS, MOVIES, CINEMAS } from '../data/mockData';
import './StaffDashboard.css';

export default function StaffDashboard() {
  const [tab, setTab] = useState('sessions');

  return (
    <div className="staff-page">
      {/* Sidebar */}
      <aside className="staff-sidebar">
        <div className="staff-brand">
          <span className="logo-icon">◈</span>
          <span className="logo-text">STAFF PORTAL</span>
        </div>
        <nav className="staff-nav">
          <button className={`staff-nav-btn ${tab==='sessions'?'active':''}`} onClick={()=>setTab('sessions')}>
            <FiCalendar /> Today's Sessions
          </button>
          <button className={`staff-nav-btn ${tab==='scanner'?'active':''}`} onClick={()=>setTab('scanner')}>
            <FiCamera /> QR Scanner
          </button>
          <button className={`staff-nav-btn ${tab==='walkin'?'active':''}`} onClick={()=>setTab('walkin')}>
            <FiUsers /> Walk-in Booking
          </button>
        </nav>
        <Link to="/" className="staff-nav-btn" style={{marginTop:'auto',color:'var(--text-muted)'}}>
          <FiLogOut /> Exit to Site
        </Link>
      </aside>

      {/* Main */}
      <main className="staff-main">
        {tab === 'sessions' && (
          <motion.div initial={{opacity:0}} animate={{opacity:1}} className="staff-content">
            <h2 className="staff-title">Today's Sessions</h2>
            <div className="staff-table-wrap">
              <table className="staff-table">
                <thead>
                  <tr>
                    <th>Film</th><th>Cinema</th><th>Hall</th><th>Time</th><th>Format</th><th>Price</th>
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
            <h2 className="staff-title">QR Code Scanner</h2>
            <div className="qr-scanner-ui">
              <div className="qr-viewfinder">
                <div className="qr-corner tl" /><div className="qr-corner tr" />
                <div className="qr-corner bl" /><div className="qr-corner br" />
                <div className="qr-scan-line" />
                <p className="qr-label">Point camera at ticket QR code</p>
              </div>
              <p className="qr-note">In production, this would activate your device camera for real-time ticket validation.</p>
              <div className="qr-manual">
                <input className="form-input" placeholder="Or type booking ID manually…" style={{flex:1}} />
                <button className="btn btn-primary">Validate</button>
              </div>
            </div>
          </motion.div>
        )}

        {tab === 'walkin' && (
          <motion.div initial={{opacity:0}} animate={{opacity:1}} className="staff-content">
            <h2 className="staff-title">Walk-in Booking</h2>
            <div className="walkin-form card">
              <div className="form-group"><label className="form-label">Session</label>
                <select className="filter-select" style={{width:'100%',paddingRight:14}}>
                  {SESSIONS.map(s => {
                    const movie = MOVIES.find(m=>m.id===s.movieId);
                    return <option key={s.id} value={s.id}>{movie?.title} — {s.date} {s.time} ({s.hallId})</option>;
                  })}
                </select>
              </div>
              <div className="form-group"><label className="form-label">Customer Name</label><input className="form-input" placeholder="Full name" /></div>
              <div className="form-group"><label className="form-label">Seat</label><input className="form-input" placeholder="e.g. E5" /></div>
              <div className="form-group"><label className="form-label">Payment Method</label>
                <div style={{display:'flex',gap:12}}>
                  <label style={{cursor:'pointer',color:'var(--text-secondary)',fontSize:'0.88rem'}}><input type="radio" name="pay" defaultChecked style={{marginRight:6}}/>Cash</label>
                  <label style={{cursor:'pointer',color:'var(--text-secondary)',fontSize:'0.88rem'}}><input type="radio" name="pay" style={{marginRight:6}}/>Card (TPE)</label>
                </div>
              </div>
              <button className="btn btn-primary" style={{alignSelf:'flex-start'}}>Confirm Walk-in Booking</button>
            </div>
          </motion.div>
        )}
      </main>
    </div>
  );
}
