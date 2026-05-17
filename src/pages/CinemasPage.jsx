import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CINEMAS } from '../data/mockData';
import { FiMapPin } from 'react-icons/fi';
import { useLang } from '../context/LanguageContext';
import './SimplePage.css';

export default function CinemasPage() {
  const { t } = useLang();
  return (
    <div className="simple-page page-enter">
      <div className="container">
        <div className="cinema-grid">
          {CINEMAS.map((cinema, i) => (
            <motion.div key={cinema.id} className="cinema-card card" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
              <img src={cinema.image} alt={cinema.name} className="cinema-card__img" />
              <div className="cinema-card__body">
                <h3 className="cinema-card__name">{cinema.name}</h3>
                <p className="cinema-card__addr"><FiMapPin /> {cinema.address}</p>
                <div className="cinema-amenities">
                  {cinema.amenities.map(a => <span key={a} className="amenity-chip">{a}</span>)}
                </div>
                <div style={{ display: 'flex', gap: 10 }}>
                  <Link to={`/cinemas/${cinema.id}`} className="btn btn-primary" style={{ fontSize: '0.72rem', padding: '8px 16px' }}>
                    {t('viewSessions')}
                  </Link>
                  <a href={`https://www.google.com/maps?q=${cinema.lat},${cinema.lng}`} target="_blank" rel="noopener noreferrer" className="btn btn-outline" style={{ fontSize: '0.72rem', padding: '8px 16px' }}>
                    <FiMapPin /> Map
                  </a>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}