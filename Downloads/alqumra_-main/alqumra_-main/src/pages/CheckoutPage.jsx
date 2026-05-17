import { useLocation, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { FiCreditCard, FiTag, FiCheckCircle } from 'react-icons/fi';
import { useLang } from '../context/LanguageContext';
import './CheckoutPage.css';

export default function CheckoutPage() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const { t } = useLang();
  const [promo, setPromo] = useState('');
  const [promoApplied, setPromoApplied] = useState(false);
  const [paying, setPaying] = useState(false);
  const [done, setDone] = useState(false);

  if (!state) return (
    <div style={{ padding: '120px 24px', textAlign: 'center', color: 'var(--text-muted)' }}>
      <h2>{t('noBooking')}</h2>
    </div>
  );

  const { session, movie, seats, total } = state;
  const discount = promoApplied ? Math.round(total * 0.1) : 0;
  const finalTotal = total - discount;

  const handlePay = () => {
    setPaying(true);
    setTimeout(() => {
      setPaying(false); setDone(true);
      setTimeout(() => navigate('/booking-confirm/BK-NEW', { state: { session, movie, seats, total: finalTotal } }), 1500);
    }, 2000);
  };

  return (
    <div className="checkout page-enter">
      <div className="container checkout__inner">
        <h1 className="checkout__title">{t('checkout')}</h1>
        <div className="checkout__grid">
          <div className="checkout__summary card">
            <h3 className="checkout__section-title">{t('orderSummary')}</h3>
            {movie && (
              <div className="checkout__movie">
                <img src={movie.poster} alt={movie.title} className="checkout__poster" />
                <div>
                  <p className="checkout__movie-title">{movie.title}</p>
                  <p className="checkout__movie-meta">{session.date} · {session.time} · {session.format}</p>
                  <p className="checkout__movie-meta">{session.hallId}</p>
                </div>
              </div>
            )}
            <div className="checkout__divider" />
            <div className="checkout__seats">
              <p className="checkout__label">{t('seat')}s</p>
              <div className="checkout__seat-chips">
                {seats.map(s => <span key={s.id} className="seat-chip badge badge-dark">{s.id} · {s.price} MAD</span>)}
              </div>
            </div>
            <div className="checkout__divider" />
            <div className="promo-row">
              <FiTag className="promo-icon" />
              <input type="text" placeholder={t('promoCode')} value={promo} onChange={e => setPromo(e.target.value)} className="promo-input" />
              <button className="btn btn-outline" style={{ padding: '8px 16px', fontSize: '0.72rem' }} onClick={() => { if (promo.toUpperCase() === 'QUMRA10') setPromoApplied(true); }}>
                {t('apply')}
              </button>
            </div>
            {promoApplied && <p className="promo-success"><FiCheckCircle /> {t('discountApplied')}</p>}
            <div className="checkout__divider" />
            <div className="checkout__totals">
              <div className="total-row"><span>{t('subtotal')}</span><span>{total} MAD</span></div>
              {discount > 0 && <div className="total-row total-row--discount"><span>{t('discount')}</span><span>-{discount} MAD</span></div>}
              <div className="total-row total-row--final"><span>{t('total')}</span><span>{finalTotal} MAD</span></div>
            </div>
          </div>
          <div className="checkout__payment card">
            <h3 className="checkout__section-title"><FiCreditCard /> {t('payment')}</h3>
            <div className="payment-mock">
              <div className="mock-card-brand">💳 Visa / Mastercard · Stripe Secure</div>
              <div className="form-group">
                <label className="form-label">{t('cardNumber')}</label>
                <input className="form-input" type="text" placeholder="4242 4242 4242 4242" maxLength={19} readOnly />
              </div>
              <div className="payment-row">
                <div className="form-group">
                  <label className="form-label">{t('expiry')}</label>
                  <input className="form-input" type="text" placeholder="MM / YY" readOnly />
                </div>
                <div className="form-group">
                  <label className="form-label">{t('cvc')}</label>
                  <input className="form-input" type="text" placeholder="123" readOnly />
                </div>
              </div>
              <p className="payment-note">{t('demoMode')}</p>
            </div>
            <motion.button className="btn btn-primary pay-btn" onClick={handlePay} disabled={paying || done} whileTap={{ scale: 0.97 }}>
              {done ? t('paymentConfirmed') : paying ? t('processing') : `${t('pay')} ${finalTotal} MAD`}
            </motion.button>
            {paying && <div style={{ display: 'flex', justifyContent: 'center', marginTop: 16 }}><div className="spinner" /></div>}
          </div>
        </div>
      </div>
    </div>
  );
}