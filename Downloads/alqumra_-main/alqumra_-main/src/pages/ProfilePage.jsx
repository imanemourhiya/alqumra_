import { useState, Component, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { useLang } from '../context/LanguageContext';
import { BOOKINGS, MOVIES, USER } from '../data/mockData';
import { QRCode as QRCodeLib } from 'react-qr-code';

/* Safe QR wrapper — error boundary prevents tab crash if QR fails */
class QRErrorBoundary extends Component {
  constructor(props) { super(props); this.state = { error: false }; }
  static getDerivedStateFromError() { return { error: true }; }
  render() {
    if (this.state.error) return (
      <div className="prf-bc__qr" style={{ width: 52, height: 52, opacity: 0.3, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.65rem', color: 'var(--text-muted)' }}>QR</div>
    );
    return this.props.children;
  }
}

function SafeQR({ value, size, bgColor, fgColor }) {
  if (!value) return null;
  return (
    <QRErrorBoundary>
      <QRCodeLib value={String(value)} size={size} bgColor={bgColor} fgColor={fgColor} />
    </QRErrorBoundary>
  );
}
import {
  FiUser, FiCalendar, FiHeart, FiStar, FiSettings, FiBell, FiLogOut,
  FiEdit3, FiMapPin, FiChevronRight, FiArrowLeft,
  FiCreditCard, FiShield, FiAward, FiGift, FiFilm, FiCheck,
  FiX, FiTag, FiDollarSign, FiAlertTriangle, FiCheckCircle, FiPlus
} from 'react-icons/fi';
import './ProfilePage.css';

/* ─── constants ─── */
const TABS = [
  { id: 'overview',   label: 'Vue d\'ensemble',  Icon: FiUser },
  { id: 'bookings',   label: 'Réservations',      Icon: FiCalendar },
  { id: 'favorites',  label: 'Favoris',            Icon: FiHeart },
  { id: 'loyalty',    label: 'Fidélité',           Icon: FiAward },
  { id: 'settings',   label: 'Paramètres',         Icon: FiSettings },
];

const SETTINGS_PAGES = {
  personal:     { label: 'Informations personnelles', Icon: FiUser,       desc: 'Nom, email, téléphone' },
  notifications:{ label: 'Notifications',             Icon: FiBell,       desc: 'Alertes, offres, avant‑premières' },
  payment:      { label: 'Moyens de paiement',        Icon: FiCreditCard, desc: 'Cartes enregistrées' },
  security:     { label: 'Sécurité',                  Icon: FiShield,     desc: 'Mot de passe, authentification' },
};

const LOYALTY_MAX = 2000;
const FAVORITE_IDS = USER.favorites || [1, 3, 7];

/* ─── helpers ─── */
const initials = (name = '') =>
  name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2);

/* ═══════════════════════════════════════════════════════════════ */
/*  Modal overlay                                                 */
/* ═══════════════════════════════════════════════════════════════ */

function Modal({ onClose, children }) {
  return (
    <AnimatePresence>
      <motion.div
        className="modal-overlay"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      >
        <motion.div
          className="modal-box"
          initial={{ scale: 0.92, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.92, opacity: 0, y: 20 }}
          transition={{ duration: 0.22 }}
          onClick={e => e.stopPropagation()}
        >
          <button className="modal-close" onClick={onClose}><FiX size={18} /></button>
          {children}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

/* ═══════════════════════════════════════════════════════════════ */
/*  Add Card Modal                                                */
/* ═══════════════════════════════════════════════════════════════ */

function AddCardModal({ onClose, onAdd }) {
  const [form, setForm] = useState({ number: '', name: '', expiry: '', cvv: '' });
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (form.number.replace(/\s/g, '').length < 16) {
      setError('Numéro de carte invalide.');
      return;
    }
    if (!form.expiry.match(/^\d{2}\/\d{2}$/)) {
      setError('Date d\'expiration invalide (MM/AA).');
      return;
    }
    if (form.cvv.length < 3) {
      setError('CVV invalide.');
      return;
    }
    setError('');
    setSaved(true);
    setTimeout(() => {
      onAdd({
        last4: form.number.replace(/\s/g, '').slice(-4),
        brand: form.number.startsWith('4') ? 'Visa' : 'Mastercard',
        expiry: form.expiry,
        isDefault: false,
      });
      onClose();
    }, 1200);
  };

  const formatCardNumber = (val) => {
    const digits = val.replace(/\D/g, '').slice(0, 16);
    return digits.replace(/(.{4})/g, '$1 ').trim();
  };

  const formatExpiry = (val) => {
    const digits = val.replace(/\D/g, '').slice(0, 4);
    if (digits.length >= 3) return digits.slice(0, 2) + '/' + digits.slice(2);
    return digits;
  };

  return (
    <Modal onClose={onClose}>
      <div className="add-card-modal">
        {/* Mini card preview */}
        <div className="card-preview">
          <div className="card-preview__shine" />
          <div className="card-preview__top">
            <span className="card-preview__brand">AL-QUMRA PAY</span>
            <FiCreditCard size={20} />
          </div>
          <p className="card-preview__number">
            {form.number || '•••• •••• •••• ••••'}
          </p>
          <div className="card-preview__bottom">
            <span>{form.name || 'NOM PRÉNOM'}</span>
            <span>{form.expiry || 'MM/AA'}</span>
          </div>
        </div>

        <h3 className="add-card-modal__title">Ajouter une carte</h3>

        {error && (
          <div className="modal-error">
            <FiAlertTriangle size={14} /> {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="prf-form">
          <div className="prf-form__group">
            <label className="prf-form__label">Numéro de carte</label>
            <input
              className="prf-form__input form-input"
              placeholder="1234 5678 9012 3456"
              value={form.number}
              maxLength={19}
              onChange={e => setForm({ ...form, number: formatCardNumber(e.target.value) })}
            />
          </div>
          <div className="prf-form__group">
            <label className="prf-form__label">Titulaire</label>
            <input
              className="prf-form__input form-input"
              placeholder="Imane Mourhiya"
              value={form.name}
              onChange={e => setForm({ ...form, name: e.target.value.toUpperCase() })}
            />
          </div>
          <div className="add-card-row">
            <div className="prf-form__group" style={{ flex: 1 }}>
              <label className="prf-form__label">Expiration</label>
              <input
                className="prf-form__input form-input"
                placeholder="MM/AA"
                value={form.expiry}
                maxLength={5}
                onChange={e => setForm({ ...form, expiry: formatExpiry(e.target.value) })}
              />
            </div>
            <div className="prf-form__group" style={{ flex: 1 }}>
              <label className="prf-form__label">CVV</label>
              <input
                className="prf-form__input form-input"
                placeholder="•••"
                type="password"
                maxLength={4}
                value={form.cvv}
                onChange={e => setForm({ ...form, cvv: e.target.value.replace(/\D/g, '') })}
              />
            </div>
          </div>
          <button
            type="submit"
            className={`prf-save-btn btn-primary ${saved ? 'prf-save-btn--done' : ''}`}
            style={{ width: '100%', justifyContent: 'center', marginTop: 8 }}
          >
            {saved ? <><FiCheck /> Carte ajoutée !</> : 'Ajouter la carte'}
          </button>
        </form>
      </div>
    </Modal>
  );
}

/* ═══════════════════════════════════════════════════════════════ */
/*  Resell Ticket Modal                                           */
/* ═══════════════════════════════════════════════════════════════ */

function ResellModal({ booking, movie, onClose, onSold }) {
  const [submitted, setSubmitted] = useState(false);
  const sellerReceives = Math.round(booking.total * 0.5);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    // After 2s auto-close and mark as sold in parent
    setTimeout(() => onSold(booking.id), 2000);
  };

  return (
    <Modal onClose={onClose}>
      <div className="resell-modal">
        {submitted ? (
          <motion.div
            className="resell-modal__success"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
          >
            <FiCheckCircle className="resell-modal__success-icon" />
            <h3>Ticket mis en vente !</h3>
            <p>Votre ticket pour <strong>{booking.movieTitle}</strong> a été publié sur le marché de revente au prix original. Vous serez notifié dès qu'un acheteur est trouvé.</p>
            <button className="btn-primary prf-save-btn" style={{ alignSelf: 'center', marginTop: 16 }} onClick={onClose}>
              Fermer
            </button>
          </motion.div>
        ) : (
          <>
            <div className="resell-modal__header">
              {movie && <img src={movie.poster} alt={movie.title} className="resell-modal__poster" />}
              <div>
                <h3 className="resell-modal__title">Revendre mon ticket</h3>
                <p className="resell-modal__movie">{booking.movieTitle}</p>
                <p className="resell-modal__meta">
                  <FiCalendar size={11} /> {booking.date} · {booking.time}
                </p>
                <p className="resell-modal__meta">
                  <FiMapPin size={11} /> {booking.cinema}
                </p>
                <p className="resell-modal__seats">Sièges : <strong>{booking.seats.join(', ')}</strong></p>
              </div>
            </div>

            <div className="resell-modal__notice">
              <FiAlertTriangle size={14} />
              <span>Le ticket sera revendu au <strong>prix original : {booking.total} MAD</strong>. La plateforme prend <strong>50%</strong> de commission.</span>
            </div>

            {/* Fixed price display */}
            <div className="resell-modal__price-box">
              <div className="resell-modal__price-row">
                <span>Prix de vente</span>
                <strong className="resell-modal__price-val">{booking.total} MAD</strong>
              </div>
              <div className="resell-modal__price-divider" />
              <div className="resell-modal__price-row">
                <span>Commission plateforme (50%)</span>
                <span className="resell-modal__fee">− {Math.round(booking.total * 0.5)} MAD</span>
              </div>
              <div className="resell-modal__price-row resell-modal__price-row--total">
                <span>Vous recevrez</span>
                <strong style={{ color: 'var(--accent)', fontSize: '1.1rem' }}>{sellerReceives} MAD</strong>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="prf-form" style={{ marginTop: 4 }}>
              <button type="submit" className="prf-save-btn btn-primary" style={{ width: '100%', justifyContent: 'center' }}>
                <FiDollarSign size={15} /> Confirmer la mise en vente
              </button>
            </form>
          </>
        )}
      </div>
    </Modal>
  );
}


/* ═══════════════════════════════════════════════════════════════ */
/*  Settings sub-pages                                            */
/* ═══════════════════════════════════════════════════════════════ */

function PersonalForm({ user, onBack }) {
  const [form, setForm] = useState({
    name:  user.name  || '',
    email: user.email || '',
    phone: user.phone || '',
  });
  const [saved, setSaved] = useState(false);

  const save = (e) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <SettingsPanel title="Informations personnelles" onBack={onBack}>
      <form onSubmit={save} className="prf-form">
        <div className="prf-form__group">
          <label className="prf-form__label">Nom complet</label>
          <input className="prf-form__input form-input" value={form.name}
            onChange={e => setForm({ ...form, name: e.target.value })} />
        </div>
        <div className="prf-form__group">
          <label className="prf-form__label">Adresse e-mail</label>
          <input className="prf-form__input form-input" type="email" value={form.email}
            onChange={e => setForm({ ...form, email: e.target.value })} />
        </div>
        <div className="prf-form__group">
          <label className="prf-form__label">Téléphone</label>
          <input className="prf-form__input form-input" placeholder="+212 6XX XXX XXX" value={form.phone}
            onChange={e => setForm({ ...form, phone: e.target.value })} />
        </div>
        <button type="submit" className={`prf-save-btn btn-primary ${saved ? 'prf-save-btn--done' : ''}`}>
          {saved ? <><FiCheck /> Enregistré !</> : 'Enregistrer les modifications'}
        </button>
      </form>
    </SettingsPanel>
  );
}

function NotificationsForm({ onBack }) {
  const [notifs, setNotifs] = useState({
    newMovies:   true,
    offers:      true,
    reminders:   true,
    newsletter:  false,
    premieres:   true,
  });
  const toggle = key => setNotifs(p => ({ ...p, [key]: !p[key] }));

  const items = [
    { key: 'newMovies',  label: 'Nouveaux films', desc: 'Soyez alerté des nouvelles sorties' },
    { key: 'offers',     label: 'Offres & promotions', desc: 'Réductions exclusives et codes promo' },
    { key: 'reminders',  label: 'Rappels séance', desc: '2h avant votre séance réservée' },
    { key: 'premieres',  label: 'Avant‑premières', desc: 'Accès prioritaire aux avant-premières' },
    { key: 'newsletter', label: 'Newsletter', desc: 'Actualités cinéma hebdomadaires' },
  ];

  return (
    <SettingsPanel title="Notifications" onBack={onBack}>
      <div className="notif-list">
        {items.map(({ key, label, desc }) => (
          <div key={key} className="notif-item">
            <div className="notif-item__text">
              <span className="notif-item__label">{label}</span>
              <span className="notif-item__desc">{desc}</span>
            </div>
            <button
              className={`toggle-btn ${notifs[key] ? 'toggle-btn--on' : ''}`}
              onClick={() => toggle(key)}
              aria-label={label}
            >
              <span className="toggle-thumb" />
            </button>
          </div>
        ))}
      </div>
    </SettingsPanel>
  );
}

function PaymentForm({ onBack }) {
  const [cards, setCards] = useState([
    { last4: '4242', brand: 'Visa', expiry: '08/27', isDefault: true },
    { last4: '1234', brand: 'Mastercard', expiry: '12/25', isDefault: false },
  ]);
  const [showAddCard, setShowAddCard] = useState(false);

  const handleAddCard = (newCard) => {
    setCards(prev => [...prev, newCard]);
  };

  const setDefault = (last4) => {
    setCards(prev => prev.map(c => ({ ...c, isDefault: c.last4 === last4 })));
  };

  const remove = (last4) => {
    setCards(prev => prev.filter(c => c.last4 !== last4));
  };

  return (
    <SettingsPanel title="Moyens de paiement" onBack={onBack}>
      <div className="payment-list">
        {cards.map(card => (
          <div key={card.last4} className={`payment-card-item ${card.isDefault ? 'payment-card-item--default' : ''}`}>
            <div className="payment-card-item__icon">{card.brand === 'Visa' ? '💳' : '🏦'}</div>
            <div className="payment-card-item__info">
              <span className="payment-card-item__brand">{card.brand} •••• {card.last4}</span>
              <span className="payment-card-item__expiry">Expire {card.expiry}</span>
            </div>
            <div className="payment-card-item__actions">
              {card.isDefault
                ? <span className="payment-default-badge">Par défaut</span>
                : <button className="payment-action-btn" onClick={() => setDefault(card.last4)}>Définir</button>
              }
              {!card.isDefault && (
                <button className="payment-action-btn payment-action-btn--remove" onClick={() => remove(card.last4)}>
                  <FiX size={13} />
                </button>
              )}
            </div>
          </div>
        ))}

        <button className="prf-add-btn" onClick={() => setShowAddCard(true)}>
          <FiPlus size={14} style={{ marginRight: 6 }} />
          Ajouter une carte
        </button>
      </div>

      {showAddCard && (
        <AddCardModal
          onClose={() => setShowAddCard(false)}
          onAdd={handleAddCard}
        />
      )}
    </SettingsPanel>
  );
}

function SecurityForm({ onBack }) {
  const [pwd, setPwd] = useState({ current: '', next: '', confirm: '' });
  const [saved, setSaved] = useState(false);
  const save = (e) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
    setPwd({ current: '', next: '', confirm: '' });
  };

  return (
    <SettingsPanel title="Sécurité" onBack={onBack}>
      <form onSubmit={save} className="prf-form">
        <p className="prf-section-label">Changer le mot de passe</p>
        {[
          { key: 'current', label: 'Mot de passe actuel' },
          { key: 'next',    label: 'Nouveau mot de passe' },
          { key: 'confirm', label: 'Confirmer le nouveau mot de passe' },
        ].map(({ key, label }) => (
          <div className="prf-form__group" key={key}>
            <label className="prf-form__label">{label}</label>
            <input className="prf-form__input form-input" type="password"
              value={pwd[key]} onChange={e => setPwd({ ...pwd, [key]: e.target.value })} />
          </div>
        ))}
        <button type="submit" className={`prf-save-btn btn-primary ${saved ? 'prf-save-btn--done' : ''}`}>
          {saved ? <><FiCheck /> Mot de passe mis à jour !</> : 'Mettre à jour'}
        </button>

        <div className="prf-divider" />
        <p className="prf-section-label">Authentification à deux facteurs</p>
        <div className="notif-item" style={{ marginTop: 8 }}>
          <div className="notif-item__text">
            <span className="notif-item__label">2FA activé</span>
            <span className="notif-item__desc">Protège votre compte avec une étape de vérification</span>
          </div>
          <button className="toggle-btn toggle-btn--on" aria-label="2FA">
            <span className="toggle-thumb" />
          </button>
        </div>
      </form>
    </SettingsPanel>
  );
}

function SettingsPanel({ title, onBack, children }) {
  return (
    <motion.div
      key={title}
      initial={{ opacity: 0, x: 24 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 24 }}
      transition={{ duration: 0.25 }}
      className="settings-panel"
    >
      <button className="settings-panel__back" onClick={onBack}>
        <FiArrowLeft size={16} />
        Paramètres
      </button>
      <h2 className="settings-panel__title">{title}</h2>
      {children}
    </motion.div>
  );
}

/* ═══════════════════════════════════════════════════════════════ */
/*  Main ProfilePage                                              */
/* ═══════════════════════════════════════════════════════════════ */

export default function ProfilePage() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { t } = useLang();
  const [searchParams] = useSearchParams();

  const currentUser = user || {
    name: 'Imane Mourhiya',
    email: 'imane@alqumra.ma',
    avatar: 'https://i.pravatar.cc/150?img=47',
    loyaltyPoints: 340,
    loyaltyTier: 'Gold',
    joinedDate: '2023-03-15',
    favorites: [1, 3, 7],
  };

  const [activeTab, setActiveTab] = useState(() => {
    const tab = searchParams.get('tab');
    return ['overview','bookings','favorites','loyalty','settings'].includes(tab) ? tab : 'overview';
  });
  const [settingPage, setSettingPage] = useState(null);
  const [resellBooking, setResellBooking] = useState(null);
  const [soldBookings, setSoldBookings] = useState(new Set()); // IDs of tickets put up for resale

  // Also respond if the URL tab param changes after mount
  useEffect(() => {
    const tab = searchParams.get('tab');
    if (tab && ['overview','bookings','favorites','loyalty','settings'].includes(tab)) {
      setActiveTab(tab);
    }
  }, [searchParams]);

  const loyaltyPoints = currentUser.loyaltyPoints || 340;
  const tierColor = { Gold: '#c8a97e', Silver: '#adb5bd', Platinum: '#a8c8c8' }[currentUser.loyaltyTier] || '#c8a97e';

  const favoriteMovies = MOVIES.filter(m => FAVORITE_IDS.includes(m.id));

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  /* ─── Booking tab content (inline) ─── */
  const renderBookingsTab = () => (
    <>
      {BOOKINGS.length === 0 ? (
        <div className="prf-empty">
          <FiCalendar size={48} className="prf-empty__icon" />
          <p>Aucune réservation pour le moment</p>
          <Link to="/movies" className="btn btn-primary" style={{ marginTop: 16 }}>Parcourir les films</Link>
        </div>
      ) : (
        <div className="prf-booking-list">
          {BOOKINGS.map((booking, i) => {
            const movie = MOVIES.find(m => m.id === booking.movieId);
            const isSold = soldBookings.has(booking.id);
            return (
              <motion.div
                key={booking.id}
                className={`prf-booking-card card ${booking.status === 'past' ? 'prf-booking-card--past' : ''}`}
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.07 }}
              >
                <div className="prf-bc__poster">
                  {movie && <img src={movie.poster} alt={movie.title} />}
                </div>
                <div className="prf-bc__info">
                  <div className="prf-bc__header">
                    <h3 className="prf-bc__title">{booking.movieTitle}</h3>
                    {isSold ? (
                      <span className="prf-badge prf-badge--sold">Mise en vente</span>
                    ) : (
                      <span className={`prf-badge ${booking.status === 'confirmed' ? 'prf-badge--gold' : 'prf-badge--muted'}`}>
                        {booking.status === 'confirmed' ? 'À venir' : 'Terminé'}
                      </span>
                    )}
                  </div>
                  <div className="prf-bc__meta-row">
                    <span><FiCalendar size={12} /> {booking.date} · {booking.time}</span>
                    <span><FiMapPin size={12} /> {booking.cinema}</span>
                  </div>
                  <p className="prf-bc__seats">Sièges : <strong>{booking.seats.join(', ')}</strong></p>
                  <div className="prf-bc__footer">
                    <span className="prf-bc__total">{booking.total} MAD</span>
                    <div className="prf-bc__actions">
                      {booking.status === 'confirmed' && !isSold && (
                        <div className="prf-bc__qr">
                          <SafeQR value={booking.qr} size={52} bgColor="transparent" fgColor={tierColor} />
                        </div>
                      )}
                      {booking.status === 'confirmed' && !isSold && (
                        <button
                          className="btn-resell"
                          onClick={() => setResellBooking(booking)}
                        >
                          <FiTag size={12} />
                          Revendre
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* Resell Modal */}
      {resellBooking && (
        <ResellModal
          booking={resellBooking}
          movie={MOVIES.find(m => m.id === resellBooking.movieId)}
          onClose={() => setResellBooking(null)}
          onSold={(id) => {
            setSoldBookings(prev => new Set([...prev, id]));
            setResellBooking(null);
          }}
        />
      )}
    </>
  );

  return (
    <div className="prf-page page-enter">
      {/* ─── Header ─── */}
      <div className="prf-hero">
        <div className="container prf-hero__inner">
          <div className="prf-hero__avatar" style={{ '--tier': tierColor }}>
            {currentUser.avatar
              ? <img src={currentUser.avatar} alt={currentUser.name} />
              : <span>{initials(currentUser.name)}</span>
            }
            <div className="prf-hero__tier-dot">◈</div>
          </div>

          <div className="prf-hero__info">
            <h1 className="prf-hero__name">{currentUser.name}</h1>
            <p className="prf-hero__sub">{currentUser.email} · Membre depuis {currentUser.joinedDate}</p>
            <span className="prf-tier-badge" style={{ '--tier': tierColor }}>
              ⭐ {currentUser.loyaltyTier}
            </span>
          </div>

          <div className="prf-hero__stats">
            {[
              { val: BOOKINGS.length, label: 'Réservations' },
              { val: favoriteMovies.length, label: 'Favoris' },
              { val: loyaltyPoints.toLocaleString(), label: 'Points' },
            ].map(({ val, label }) => (
              <div key={label} className="prf-hero__stat">
                <span className="prf-hero__stat-val">{val}</span>
                <span className="prf-hero__stat-label">{label}</span>
              </div>
            ))}
          </div>

          <button className="prf-edit-btn" onClick={() => { setActiveTab('settings'); setSettingPage('personal'); }}>
            <FiEdit3 size={14} /> Modifier
          </button>
        </div>
      </div>

      {/* ─── Tabs ─── */}
      <div className="prf-tabs-bar">
        <div className="container">
          <div className="prf-tabs">
            {TABS.map(({ id, label, Icon }) => (
              <button
                key={id}
                className={`prf-tab ${activeTab === id ? 'prf-tab--active' : ''}`}
                onClick={() => { setActiveTab(id); setSettingPage(null); }}
              >
                <Icon size={14} />
                <span>{label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ─── Tab body ─── */}
      <div className="container prf-body">
        <AnimatePresence mode="wait">

          {/* ── Vue d'ensemble ── */}
          {activeTab === 'overview' && (
            <motion.div key="overview" {...tabAnim} className="prf-tab-content">
              <div className="prf-overview-grid">

                {/* Stat cards */}
                <div className="prf-stat-cards">
                  {[
                    { Icon: FiFilm,     label: 'Films vus',     val: BOOKINGS.filter(b => b.status === 'past').length },
                    { Icon: FiCalendar, label: 'À venir',        val: BOOKINGS.filter(b => b.status === 'confirmed').length },
                    { Icon: FiHeart,    label: 'Favoris',        val: favoriteMovies.length },
                    { Icon: FiAward,    label: 'Points fidélité',val: loyaltyPoints },
                  ].map(({ Icon, label, val }) => (
                    <div key={label} className="prf-stat-card card">
                      <Icon size={18} className="prf-stat-card__icon" />
                      <span className="prf-stat-card__val">{val}</span>
                      <span className="prf-stat-card__label">{label}</span>
                    </div>
                  ))}
                </div>

                {/* Loyalty mini-card */}
                <div className="prf-loyalty-mini" style={{ '--tier': tierColor }}>
                  <div className="prf-loyalty-mini__shine" />
                  <div className="prf-loyalty-mini__top">
                    <span className="prf-loyalty-mini__brand">AL-QUMRA</span>
                    <FiAward size={18} />
                  </div>
                  <p className="prf-loyalty-mini__pts">{loyaltyPoints.toLocaleString()}</p>
                  <p className="prf-loyalty-mini__pts-lbl">POINTS</p>
                  <div className="prf-loyalty-mini__bar-wrap">
                    <div className="prf-loyalty-mini__bar">
                      <motion.div
                        className="prf-loyalty-mini__fill"
                        initial={{ width: 0 }}
                        animate={{ width: `${Math.min((loyaltyPoints / LOYALTY_MAX) * 100, 100)}%` }}
                        transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
                      />
                    </div>
                    <span className="prf-loyalty-mini__bar-lbl">{loyaltyPoints} / {LOYALTY_MAX} → Platinum</span>
                  </div>
                  <button className="prf-loyalty-mini__cta" onClick={() => setActiveTab('loyalty')}>
                    Voir ma carte fidélité →
                  </button>
                </div>

                {/* Recent bookings */}
                <div className="prf-recent">
                  <div className="prf-section-header">
                    <h3 className="prf-section-title">Activité récente</h3>
                    <button className="prf-see-all" onClick={() => setActiveTab('bookings')}>Tout voir →</button>
                  </div>
                  {BOOKINGS.slice(0, 2).map(booking => {
                    const movie = MOVIES.find(m => m.id === booking.movieId);
                    return (
                      <div key={booking.id} className="prf-recent-item card">
                        {movie && <img src={movie.poster} alt={movie.title} className="prf-recent-item__poster" />}
                        <div className="prf-recent-item__info">
                          <h4 className="prf-recent-item__title">{booking.movieTitle}</h4>
                          <p className="prf-recent-item__meta"><FiMapPin size={11} /> {booking.cinema}</p>
                          <p className="prf-recent-item__meta"><FiCalendar size={11} /> {booking.date} · {booking.time}</p>
                        </div>
                        <div className="prf-recent-item__right">
                          <span className="prf-recent-item__total">{booking.total} MAD</span>
                          <span className={`prf-badge ${booking.status === 'confirmed' ? 'prf-badge--gold' : 'prf-badge--muted'}`}>
                            {booking.status === 'confirmed' ? 'À venir' : 'Terminé'}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>

              </div>
            </motion.div>
          )}

          {activeTab === 'bookings' && (
            <motion.div key="bookings" {...tabAnim} className="prf-tab-content">
              {renderBookingsTab()}
            </motion.div>
          )}

          {/* ── Favoris ── */}
          {activeTab === 'favorites' && (
            <motion.div key="favorites" {...tabAnim} className="prf-tab-content">
              {favoriteMovies.length === 0 ? (
                <div className="prf-empty">
                  <FiHeart size={48} className="prf-empty__icon" />
                  <p>Aucun favori pour le moment</p>
                  <Link to="/movies" className="btn btn-primary" style={{ marginTop: 16 }}>Parcourir les films</Link>
                </div>
              ) : (
                <div className="prf-fav-grid">
                  {favoriteMovies.map((movie, i) => (
                    <motion.div
                      key={movie.id}
                      className="prf-fav-card"
                      initial={{ opacity: 0, y: 14 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.08 }}
                    >
                      <Link to={`/movies/${movie.id}`}>
                        <div className="prf-fav-card__img-wrap">
                          <img src={movie.poster} alt={movie.title} className="prf-fav-card__img" />
                          <div className="prf-fav-card__heart"><FiHeart /></div>
                        </div>
                        <h4 className="prf-fav-card__title">{movie.title}</h4>
                        <p className="prf-fav-card__genre">{movie.genre.slice(0, 2).join(' · ')}</p>
                        <div className="prf-fav-card__rating">
                          <FiStar size={11} /> {movie.rating}
                        </div>
                      </Link>
                    </motion.div>
                  ))}
                </div>
              )}
            </motion.div>
          )}

          {/* ── Fidélité ── */}
          {activeTab === 'loyalty' && (
            <motion.div key="loyalty" {...tabAnim} className="prf-tab-content prf-loyalty-wrap">
              {/* Big loyalty card */}
              <div className="loyalty-card-full" style={{ '--tier': tierColor }}>
                <div className="loyalty-card-full__shine" />
                <div className="loyalty-card-full__top">
                  <span className="loyalty-card-full__brand">AL-QUMRA</span>
                  <span className="loyalty-card-full__tier">{currentUser.loyaltyTier}</span>
                </div>
                <p className="loyalty-card-full__pts">{loyaltyPoints.toLocaleString()}</p>
                <p className="loyalty-card-full__pts-lbl">POINTS DISPONIBLES</p>
                <div className="loyalty-card-full__bottom">
                  <span className="loyalty-card-full__name">{currentUser.name.toUpperCase()}</span>
                  <span className="loyalty-card-full__chip">◈</span>
                </div>
              </div>

              {/* Progress */}
              <div className="loyalty-progress card">
                <div className="loyalty-progress__header">
                  <span>Progression vers Platinum</span>
                  <span className="loyalty-progress__pts">{loyaltyPoints} / {LOYALTY_MAX}</span>
                </div>
                <div className="loyalty-progress__bar-track">
                  <motion.div
                    className="loyalty-progress__bar-fill"
                    style={{ '--tier': tierColor }}
                    initial={{ width: 0 }}
                    animate={{ width: `${Math.min((loyaltyPoints / LOYALTY_MAX) * 100, 100)}%` }}
                    transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
                  />
                </div>
                <p className="loyalty-progress__hint">{LOYALTY_MAX - loyaltyPoints} points restants</p>
              </div>

              {/* Rewards */}
              <h3 className="prf-section-title" style={{ marginTop: 28, marginBottom: 14 }}>Récompenses disponibles</h3>
              <div className="loyalty-rewards">
                {[
                  { pts: 100,  label: '1 place Standard offerte',    claimed: true },
                  { pts: 250,  label: 'Réduction -10% sur la prochaine réservation', claimed: false },
                  { pts: 500,  label: '1 place VIP offerte',          claimed: false },
                  { pts: 1000, label: 'Mois de réduction -15%',       claimed: false },
                  { pts: 2000, label: 'Accès avant-première exclusive',claimed: false },
                ].map((r, i) => (
                  <div key={i} className={`loyalty-reward-item card ${r.pts <= loyaltyPoints ? 'loyalty-reward-item--unlocked' : ''}`}>
                    <div className="loyalty-reward-item__icon"><FiGift /></div>
                    <div className="loyalty-reward-item__info">
                      <span className="loyalty-reward-item__label">{r.label}</span>
                      <span className="loyalty-reward-item__pts">{r.pts} points</span>
                    </div>
                    {r.claimed ? (
                      <span className="loyalty-reward-item__used">Utilisé</span>
                    ) : r.pts <= loyaltyPoints ? (
                      <button className="loyalty-reward-item__cta">Échanger</button>
                    ) : (
                      <span className="loyalty-reward-item__missing">−{r.pts - loyaltyPoints} pts</span>
                    )}
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {/* ── Paramètres ── */}
          {activeTab === 'settings' && (
            <motion.div key="settings" {...tabAnim} className="prf-tab-content">
              <AnimatePresence mode="wait">
                {!settingPage ? (
                  <motion.div key="settings-menu" {...tabAnim} className="prf-settings-menu">
                    {Object.entries(SETTINGS_PAGES).map(([key, { label, Icon, desc }]) => (
                      <button
                        key={key}
                        className="prf-settings-item card"
                        onClick={() => setSettingPage(key)}
                      >
                        <span className="prf-settings-item__icon-wrap"><Icon size={18} /></span>
                        <span className="prf-settings-item__text">
                          <span className="prf-settings-item__label">{label}</span>
                          <span className="prf-settings-item__desc">{desc}</span>
                        </span>
                        <FiChevronRight size={16} className="prf-settings-item__arrow" />
                      </button>
                    ))}

                    <div className="prf-settings-divider" />
                    <button className="prf-logout-btn" onClick={handleLogout}>
                      <FiLogOut size={16} />
                      Se déconnecter
                    </button>
                  </motion.div>
                ) : settingPage === 'personal' ? (
                  <PersonalForm user={currentUser} onBack={() => setSettingPage(null)} />
                ) : settingPage === 'notifications' ? (
                  <NotificationsForm onBack={() => setSettingPage(null)} />
                ) : settingPage === 'payment' ? (
                  <PaymentForm onBack={() => setSettingPage(null)} />
                ) : settingPage === 'security' ? (
                  <SecurityForm onBack={() => setSettingPage(null)} />
                ) : null}
              </AnimatePresence>
            </motion.div>
          )}

        </AnimatePresence>
      </div>
    </div>
  );
}

/* shared animation preset */
const tabAnim = {
  initial:    { opacity: 0, y: 16 },
  animate:    { opacity: 1, y: 0  },
  exit:       { opacity: 0, y: -16 },
  transition: { duration: 0.28 },
};