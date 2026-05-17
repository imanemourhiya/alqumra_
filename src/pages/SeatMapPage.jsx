import { useParams, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { generateSeats, SESSIONS, MOVIES } from '../data/mockData';
import { useLang } from '../context/LanguageContext';
import './SeatMapPage.css';

function Seat({ status, isSelected, isVip, onClick, seatId }) {
  let topColor, baseColor, shadowColor;
  if (isSelected) {
    topColor = '#4b4d54'; baseColor = '#101010'; shadowColor = '#212427';
  } else if (status === 'occupied') {
    topColor = '#4a2a2a'; baseColor = '#3a2020'; shadowColor = '#2a1515';
  } else if (isVip) {
    topColor = '#b02020'; baseColor = '#8b1a1a'; shadowColor = '#5a0f0f';
  } else {
    topColor = '#c02020'; baseColor = '#9b1c1c'; shadowColor = '#6b1010';
  }

  return (
    <svg
      viewBox="0 0 40 38"
      width="40"
      height="38"
      className={`seat-svg ${status !== 'occupied' ? 'seat-svg--clickable' : ''}`}
      onClick={status !== 'occupied' ? onClick : undefined}
      style={{ cursor: status === 'occupied' ? 'not-allowed' : 'pointer', display: 'block' }}
      title={seatId}
    >
      <ellipse cx="20" cy="13" rx="17" ry="13" fill={topColor} />
      <ellipse cx="20" cy="11" rx="13" ry="9" fill={baseColor} opacity="0.5" />
      <rect x="3" y="22" width="34" height="13" rx="6" fill={baseColor} />
      <rect x="6" y="23" width="28" height="8" rx="4" fill={topColor} opacity="0.4" />
      <ellipse cx="20" cy="36" rx="14" ry="2.5" fill={shadowColor} opacity="0.6" />
      {isSelected && <ellipse cx="20" cy="13" rx="17" ry="13" fill="#464441" opacity="0.25" />}
      {isVip && status !== 'occupied' && !isSelected && (
        <text x="20" y="16" textAnchor="middle" fontSize="8" fill="#3b3935" fontFamily="serif" opacity="0.9">★</text>
      )}
    </svg>
  );
}

export default function SeatMapPage() {
  const { sessionId } = useParams();
  const navigate = useNavigate();
  const { t } = useLang();
  const session = SESSIONS.find(s => s.id === Number(sessionId));
  const movie = session ? MOVIES.find(m => m.id === session.movieId) : null;
  const [seats, setSeats] = useState(generateSeats(sessionId));
  const [selected, setSelected] = useState([]);

  if (!session) return (
    <div style={{ padding: '120px 24px', textAlign: 'center', color: 'var(--text-muted)' }}>
      <h2>{t('sessionNotFound')}</h2>
    </div>
  );

  const rows = [...new Set(seats.map(s => s.row))];
  const toggle = (seat) => {
    if (seat.status === 'occupied') return;
    setSelected(prev =>
      prev.includes(seat.id) ? prev.filter(id => id !== seat.id) : [...prev, seat.id]
    );
  };

  const selectedSeats = seats.filter(s => selected.includes(s.id));
  const total = selectedSeats.reduce((sum, s) => sum + s.price, 0);

  const handleCheckout = () => {
    if (selected.length === 0) return;
    navigate('/checkout', { state: { session, movie, seats: selectedSeats, total } });
  };

  return (
    <div className="seatmap page-enter">
      <div className="seatmap__inner">
        <div className="seatmap__header container">
          <h1 className="seatmap__title">{movie?.title}</h1>
          <p className="seatmap__sub">{session.date} · {session.time} · {session.hallId} · {session.format}</p>
        </div>

        <div className="auditorium">
          <div className="screen-stage">
            <div className="curtain curtain--left">
              <div className="curtain-fold" /><div className="curtain-fold" /><div className="curtain-fold" />
            </div>
            <div className="screen-frame">
              <div className="screen-inner">
                <span className="screen-text">{t('nowShowingScreen')}</span>
              </div>
            </div>
            <div className="curtain curtain--right">
              <div className="curtain-fold" /><div className="curtain-fold" /><div className="curtain-fold" />
            </div>
          </div>

          <div className="stage-edge" />

          <div className="hall-perspective">
            <div className="seat-grid">
              {rows.map((row, rowIdx) => {
                const leftSeats  = seats.filter(s => s.row === row && s.block === 'left');
                const rightSeats = seats.filter(s => s.row === row && s.block === 'right');
                const scale = 0.72 + (rowIdx / rows.length) * 0.28;
                const opacity = 0.75 + (rowIdx / rows.length) * 0.25;
                const renderSeat = (seat) => (
                  <motion.div
                    key={seat.id}
                    className="seat-wrapper"
                    whileHover={seat.status !== 'occupied' ? { scale: 1.18, y: -4 } : {}}
                    whileTap={seat.status !== 'occupied' ? { scale: 0.9 } : {}}
                    title={`${seat.id} — ${seat.price} MAD`}
                  >
                    <Seat
                      status={seat.status}
                      isSelected={selected.includes(seat.id)}
                      isVip={seat.type === 'vip'}
                      onClick={() => toggle(seat)}
                      seatId={`${seat.id} · ${seat.price} MAD`}
                    />
                  </motion.div>
                );
                return (
                  <div key={row} className="seat-row" style={{ transform: `scaleX(${scale})`, opacity }}>
                    <span className="row-label">{row}</span>
                    <div className="row-seats">{leftSeats.map(renderSeat)}</div>
                    <div className="aisle-gap" />
                    <div className="row-seats">{rightSeats.map(renderSeat)}</div>
                    <span className="row-label">{row}</span>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="hall-floor" />
        </div>

        {/* Legend */}
        <div className="seat-legend container">
          {[
            { top: '#c02020', base: '#9b1c1c', labelKey: 'available' },
            { top: '#5e5f62', base: '#5b5c61', labelKey: 'selected' },
            { top: '#4a2a2a', base: '#3a2020', labelKey: 'occupied' },
            { top: '#b02020', base: '#8b1a1a', labelKey: 'vip' },
          ].map(l => (
            <div key={l.labelKey} className="legend-item">
              <svg viewBox="0 0 40 38" width="24" height="22">
                <ellipse cx="20" cy="13" rx="17" ry="13" fill={l.top} />
                <rect x="3" y="22" width="34" height="13" rx="6" fill={l.base} />
              </svg>
              <span>{t(l.labelKey)}</span>
            </div>
          ))}
        </div>

        {/* Summary */}
        <motion.div
          className="seat-summary container"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: selected.length > 0 ? 1 : 0.5, y: 0 }}
        >
          <div className="ss__info">
            {selected.length > 0 ? (
              <>
                <p className="ss__seats">{t('selected')}: <strong>{selected.join(', ')}</strong></p>
                <p className="ss__total">Total: <span className="ss__price">{total} MAD</span></p>
              </>
            ) : (
              <p className="ss__hint">{t('selectSeatHint')}</p>
            )}
          </div>
          <button
            className="btn btn-primary"
            disabled={selected.length === 0}
            onClick={handleCheckout}
            style={{ padding: '14px 32px' }}
          >
            {t('proceedCheckout')} ({selected.length} {selected.length !== 1 ? t('seats') : t('seat')})
          </button>
        </motion.div>
      </div>
    </div>
  );
}