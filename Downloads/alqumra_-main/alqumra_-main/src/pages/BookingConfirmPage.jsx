import { useLocation, useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import QRCode from 'react-qr-code';
import { FiDownload, FiHome, FiCalendar } from 'react-icons/fi';
import { useLang } from '../context/LanguageContext';
import './BookingConfirmPage.css';

export default function BookingConfirmPage() {
  const { state } = useLocation();
  const { id } = useParams();
  const { t } = useLang();
  const bookingId = id || 'BK-' + Math.floor(Math.random() * 10000);
  const movie = state?.movie;
  const session = state?.session;
  const seats = state?.seats || [];
  const total = state?.total || 0;

  return (
    <div className="confirm page-enter">
      <div className="container confirm__inner">
        <motion.div className="confirm-card card" initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ type: 'spring', stiffness: 160, damping: 18 }}>
          <div className="confirm-header">
            <div className="confirm-anim">✦</div>
            <h1 className="confirm-title">{t('bookingConfirmed')}</h1>
            <p className="confirm-id">{bookingId}</p>
          </div>
          <div className="confirm-body">
            <div className="confirm-qr">
              <QRCode value={bookingId} size={160} bgColor="transparent" fgColor="#c8a97e" />
              <p className="confirm-qr-hint">{t('showAtEntrance')}</p>
            </div>
            <div className="confirm-details">
              {movie && (
                <div className="confirm-movie">
                  <img src={movie.poster} alt={movie.title} />
                  <div>
                    <h3 className="confirm-movie-title">{movie.title}</h3>
                    {session && <p className="confirm-meta"><FiCalendar /> {session.date} · {session.time} · {session.format}</p>}
                  </div>
                </div>
              )}
              <div className="confirm-row"><span>{t('seat')}s</span><span>{seats.map(s=>s.id).join(', ') || '—'}</span></div>
              <div className="confirm-row"><span>{t('totalPaid')}</span><span className="confirm-price">{total} MAD</span></div>
              <div className="confirm-row"><span>{t('status')}</span><span className="badge badge-gold">{t('confirmed')}</span></div>
            </div>
          </div>
          <div className="confirm-actions">
            <Link to="/" className="btn btn-outline"><FiHome /> {t('home')}</Link>
            <Link to="/history" className="btn btn-primary">{t('myBookingsTitle')}</Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
}