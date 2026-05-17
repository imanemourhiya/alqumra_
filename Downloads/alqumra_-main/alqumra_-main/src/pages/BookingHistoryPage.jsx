import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { BOOKINGS, MOVIES } from '../data/mockData';
import QRCode from 'react-qr-code';
import { FiCalendar, FiMapPin, FiRotateCcw } from 'react-icons/fi';
import { useLang } from '../context/LanguageContext';
import './BookingHistoryPage.css';

export default function BookingHistoryPage() {
  const { t } = useLang();
  return (
    <div className="history page-enter">
      <div className="container history__inner">
        <h1 className="history__title">{t('myBookingsTitle')}</h1>
        {BOOKINGS.length === 0 ? (
          <div className="history-empty">
            <p>{t('noBookingsYet')}</p>
            <Link to="/movies" className="btn btn-primary" style={{marginTop:16}}>{t('browseFilms')}</Link>
          </div>
        ) : (
          <div className="history-list">
            {BOOKINGS.map((booking, i) => {
              const movie = MOVIES.find(m => m.id === booking.movieId);
              return (
                <motion.div key={booking.id} className={`booking-card card ${booking.status === 'past' ? 'booking-card--past' : ''}`} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }}>
                  <div className="bc__poster">{movie && <img src={movie.poster} alt={movie.title} />}</div>
                  <div className="bc__info">
                    <h3 className="bc__title">{booking.movieTitle}</h3>
                    <p className="bc__meta"><FiCalendar /> {booking.date} · {booking.time}</p>
                    <p className="bc__meta"><FiMapPin /> {booking.cinema}</p>
                    <p className="bc__seats">Sièges: <strong>{booking.seats.join(', ')}</strong></p>
                    <div className="bc__bottom">
                      <span className={`badge ${booking.status === 'confirmed' ? 'badge-gold' : 'badge-silver'}`}>
                        {booking.status === 'confirmed' ? t('confirmed') : 'Passé'}
                      </span>
                      <span className="bc__total">{booking.total} MAD</span>
                    </div>
                  </div>
                  <div className="bc__qr">
                    <QRCode value={booking.qr} size={80} bgColor="transparent" fgColor="#c8a97e" />
                    {booking.status === 'confirmed' && (
                      <Link to="/resell" className="bc__resell-btn"><FiRotateCcw /> {t('resell')}</Link>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}