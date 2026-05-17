import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiTag, FiClock, FiStar, FiGift, FiPercent, FiUsers, FiSun, FiHeart, FiZap } from 'react-icons/fi';
import './OffersPage.css';

const OFFERS = [
  {
    id: 1,
    Icon: FiPercent,
    tag: 'Étudiant',
    title: 'Réduction Étudiante',
    desc: 'Les études, c\'est dur. Le cinéma, ça devrait être abordable. 30% de réduction avec carte étudiante valide. Valable lun.–jeu.',
    discount: '−30%',
    expires: new Date(Date.now() + 7 * 86400000),
    accent: 0.28,
  },
  {
    id: 2,
    Icon: FiSun,
    tag: 'Lève-tôt',
    title: 'Séance Matinale',
    desc: '25% de réduction sur la première séance du jour (avant 12h). Commencez votre journée avec du grand cinéma.',
    discount: '−25%',
    expires: new Date(Date.now() + 2 * 86400000),
    accent: 0.22,
  },
  {
    id: 3,
    Icon: FiUsers,
    tag: 'Famille',
    title: 'Pack Famille',
    desc: '4 billets, 3 prix. Simple comme bonjour. N\'importe quel film, n\'importe quelle séance.',
    discount: '4×3',
    expires: new Date(Date.now() + 14 * 86400000),
    accent: 0.32,
  },
  {
    id: 4,
    Icon: FiZap,
    tag: 'Week-end',
    title: 'Rush Week-end',
    desc: '15% de réduction sur toutes les réservations du week-end. Rendez votre week-end inoubliable.',
    discount: '−15%',
    expires: new Date(Date.now() + 3 * 86400000),
    accent: 0.20,
  },
  {
    id: 5,
    Icon: FiStar,
    tag: 'Fidélité',
    title: 'Avantage Gold',
    desc: 'La fidélité a ses privilèges. Les membres Gold et Platinum bénéficient de 20% sur chaque réservation.',
    discount: '−20%',
    expires: new Date(Date.now() + 365 * 86400000),
    accent: 0.30,
  },
  {
    id: 6,
    Icon: FiGift,
    tag: 'Anniversaire',
    title: 'Cadeau d\'Anniversaire',
    desc: 'Un jour par an, le pop-corn est encore plus savoureux. Billet offert le jour de votre anniversaire.',
    discount: '100%',
    expires: new Date(Date.now() + 30 * 86400000),
    accent: 0.26,
  },
];

function Countdown({ expires }) {
  const [time, setTime] = useState('');
  useEffect(() => {
    const update = () => {
      const diff = expires - Date.now();
      if (diff <= 0) { setTime('Expiré'); return; }
      const d = Math.floor(diff / 86400000);
      const h = Math.floor((diff % 86400000) / 3600000);
      const m = Math.floor((diff % 3600000) / 60000);
      const s = Math.floor((diff % 60000) / 1000);
      if (d > 0) setTime(`${d}j ${h}h ${m}m`);
      else setTime(`${h}h ${m}m ${s}s`);
    };
    update();
    const id = setInterval(update, 1000);
    return () => clearInterval(id);
  }, [expires]);
  return <span className="countdown">{time}</span>;
}

export default function OffersPage() {
  const [claimed, setClaimed] = useState([]);
  const handleClaim = (id) => { if (!claimed.includes(id)) setClaimed(prev => [...prev, id]); };

  return (
    <div className="offers-page page-enter">
      <div className="container">
        {/* Header */}
        <div className="offers-header">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <div className="ornament"><FiGift style={{ color: 'var(--accent)', fontSize: '1.5rem' }} /></div>
          </motion.div>
        </div>

        {/* Cards Grid */}
        <div className="offers-grid">
          {OFFERS.map((offer, i) => (
            <motion.div
              key={offer.id}
              className={`offer-card ${claimed.includes(offer.id) ? 'offer-card--claimed' : ''}`}
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
            >
              {/* Discount badge */}
              <div className="offer-card__discount">{offer.discount}</div>

              {/* Icon + Tag */}
              <div className="offer-card__top">
                <div className="offer-card__icon-wrap">
                  <offer.Icon size={20} />
                </div>
                <span className="badge badge-gold">{offer.tag}</span>
              </div>

              <h3 className="offer-card__title">{offer.title}</h3>
              <p className="offer-card__desc">{offer.desc}</p>

              {/* Expires */}
              <div className="offer-card__expires">
                <FiClock />
                <span>Expire dans </span>
                <Countdown expires={offer.expires} />
              </div>

              <button
                className={`btn ${claimed.includes(offer.id) ? 'btn-ghost offer-claimed' : 'btn-primary'}`}
                onClick={() => handleClaim(offer.id)}
                style={{ marginTop: 'auto', width: '100%', justifyContent: 'center' }}
              >
                {claimed.includes(offer.id) ? 'Activé' : 'Activer l\'offre'}
              </button>
            </motion.div>
          ))}
        </div>

        {/* Loyalty banner */}
        <motion.div
          className="offers-loyalty"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          <div className="offers-loyalty__content">
            <FiStar className="loyalty-star" />
            <div>
              <h3>Cumulez des points avec Al-Qumra</h3>
              <p>Notre façon de vous remercier, à chaque visite.</p>
            </div>
            <Link to="/register" className="btn btn-primary" style={{ whiteSpace: 'nowrap' }}>
              Rejoindre gratuitement
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
