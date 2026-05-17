import { useParams, Link } from 'react-router-dom';
import { CINEMAS, SESSIONS, MOVIES } from '../data/mockData';
import { FiMapPin, FiPhone, FiCalendar } from 'react-icons/fi';
import { useLang } from '../context/LanguageContext';
import './SimplePage.css';

export default function CinemaDetailPage() {
  const { id } = useParams();
  const { t } = useLang();
  const cinema = CINEMAS.find(c => c.id === Number(id));
  const sessions = SESSIONS.filter(s => s.cinemaId === Number(id));

  if (!cinema) return (
    <div style={{ padding: '120px 24px', textAlign: 'center', color: 'var(--text-muted)' }}>
      <h2>{t('cinemaNotFound')}</h2>
      <Link to="/cinemas" className="btn btn-outline" style={{ marginTop: 16 }}>Back</Link>
    </div>
  );

  return (
    <div className="simple-page page-enter">
      <div className="container">
        <div className="cinema-detail-hero" style={{ backgroundImage: `url(${cinema.image})` }}>
          <div className="cdh-overlay" />
          <div className="cdh-content">
            <h1 className="simple-page__title" style={{ marginBottom: 8 }}>{cinema.name}</h1>
            <p style={{ color: 'var(--text-secondary)', display: 'flex', gap: 8 }}><FiMapPin /> {cinema.address}</p>
            <p style={{ color: 'var(--text-secondary)', display: 'flex', gap: 8, marginTop: 4 }}><FiPhone /> {cinema.phone}</p>
          </div>
        </div>
        <h2 className="section-title" style={{ margin: '40px 0 24px' }}>{t('sessions')}</h2>
        {sessions.length === 0 ? (
          <p style={{ color: 'var(--text-muted)' }}>{t('noSessions')}</p>
        ) : (
          <div className="cinema-sessions">
            {sessions.map(s => {
              const movie = MOVIES.find(m => m.id === s.movieId);
              return (
                <div key={s.id} className="cs-card card">
                  {movie && <img src={movie.poster} alt={movie.title} className="cs-poster" />}
                  <div className="cs-info">
                    <h4 className="cs-movie">{movie?.title}</h4>
                    <p className="cs-meta"><FiCalendar /> {s.date} · {s.time}</p>
                    <p className="cs-meta">{s.hallId} · {s.format} · {s.language}</p>
                    <p className="cs-price">{s.price} MAD / {t('seat')}</p>
                  </div>
                  <Link to={`/seats/${s.id}`} className="btn btn-primary" style={{ fontSize: '0.78rem', padding: '10px 20px', alignSelf: 'center' }}>
                    {t('chooseSeats')}
                  </Link>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}