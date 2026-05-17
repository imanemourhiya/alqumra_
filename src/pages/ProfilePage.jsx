import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { useLang } from '../context/LanguageContext';
import { BOOKINGS } from '../data/mockData';
import QRCode from 'react-qr-code';
import { FiCalendar, FiStar, FiRotateCcw } from 'react-icons/fi';
import './ProfilePage.css';

export default function ProfilePage() {
  const { user } = useAuth();
  const { t } = useLang();
  const currentUser = user || {
    name: 'Imane Mourhiya', email: 'imane@alqumra.ma',
    avatar: 'https://i.pravatar.cc/150?img=47',
    loyaltyPoints: 340, loyaltyTier: 'Gold', joinedDate: '2023-03-15',
  };
  const tierColors = { Gold: '#c8a97e', Silver: '#c0b8a8', Platinum: '#a8c8c8' };
  const tierColor = tierColors[currentUser.loyaltyTier] || tierColors.Gold;

  return (
    <div className="profile page-enter">
      <div className="container profile__inner">
        <div className="profile__header">
          <img src={currentUser.avatar} alt={currentUser.name} className="profile__avatar" />
          <div className="profile__info">
            <h1 className="profile__name">{currentUser.name}</h1>
            <p className="profile__email">{currentUser.email}</p>
            <p className="profile__joined"><FiCalendar /> {t('memberSince')} {currentUser.joinedDate}</p>
          </div>
        </div>
        <motion.div className="loyalty-card" initial={{ opacity: 0, rotateX: 15 }} animate={{ opacity: 1, rotateX: 0 }} transition={{ duration: 0.6, type: 'spring' }} style={{ '--tier-color': tierColor }}>
          <div className="loyalty-card__shine" />
          <div className="loyalty-card__top">
            <span className="loyalty-card__brand">AL-QUMRA</span>
            <span className="loyalty-card__tier">{currentUser.loyaltyTier}</span>
          </div>
          <div className="loyalty-card__points">
            <span className="loyalty-card__pts-num">{currentUser.loyaltyPoints}</span>
            <span className="loyalty-card__pts-label">POINTS</span>
          </div>
          <div className="loyalty-card__bottom">
            <span className="loyalty-card__name">{currentUser.name.toUpperCase()}</span>
            <span className="loyalty-card__icon">◈</span>
          </div>
        </motion.div>
        <div className="profile__stats">
          {[
            { label: t('filmsWatched'), value: BOOKINGS.length },
            { label: t('loyaltyPoints'), value: currentUser.loyaltyPoints },
            { label: t('tier'), value: currentUser.loyaltyTier },
          ].map(stat => (
            <div key={stat.label} className="stat-item card">
              <span className="stat-value">{stat.value}</span>
              <span className="stat-label">{stat.label}</span>
            </div>
          ))}
        </div>
        <div className="profile__links">
          {[
            { to: '/history', label: t('myBookings'), icon: <FiCalendar /> },
            { to: '/favorites', label: t('favourites'), icon: <FiStar /> },
            { to: '/resell', label: t('resellTicket'), icon: <FiRotateCcw /> },
          ].map(l => (
            <Link key={l.to} to={l.to} className="profile-link card">
              <span className="pl-icon">{l.icon}</span>
              <span className="pl-label">{l.label}</span>
              <span className="pl-arrow">→</span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}