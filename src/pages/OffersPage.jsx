import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiTag, FiClock, FiUsers, FiStar, FiGift, FiPercent } from 'react-icons/fi';
import { useLang } from '../context/LanguageContext';
import './OffersPage.css';

function Countdown({ expires }) {
  const [time, setTime] = useState('');
  useEffect(() => {
    const update = () => {
      const diff = expires - Date.now();
      if (diff <= 0) { setTime('Expired'); return; }
      const d = Math.floor(diff / 86400000);
      const h = Math.floor((diff % 86400000) / 3600000);
      const m = Math.floor((diff % 3600000) / 60000);
      const s = Math.floor((diff % 60000) / 1000);
      if (d > 0) setTime(`${d}d ${h}h ${m}m`);
      else setTime(`${h}h ${m}m ${s}s`);
    };
    update();
    const id = setInterval(update, 1000);
    return () => clearInterval(id);
  }, [expires]);
  return <span className="countdown">{time}</span>;
}

export default function OffersPage() {
  const { t, lang } = useLang();
  const [claimed, setClaimed] = useState([]);

  const OFFERS = [
    {
      id: 1, icon: '👩🏽‍🎓🎓',
      tag:   { fr: 'Étudiant',          en: 'Student',      ar: 'طالب'              },
      title: { fr: 'Réduction Étudiant', en: 'Student Discount', ar: 'خصم الطلاب'  },
      desc:  {
        fr: 'Études difficiles ? Les films, eux, restent accessibles. 30% sur toutes les séances avec carte étudiante. Valable Lun–Jeu.',
        en: 'Studies are tough. At least the movies should be affordable. 30% off all screenings with valid student ID. Valid Mon–Thu.',
        ar: 'خصم 30% على جميع العروض ببطاقة الطالب. صالح الاثنين–الخميس.',
      },
      discount: '30%', expires: new Date(Date.now() + 7 * 86400000),
      color: '#c8a97e', bg: 'linear-gradient(135deg, #4f5052 0%, #888e97 100%)',
    },
    {
      id: 2, icon: '🌞',
      tag:   { fr: 'Lève-tôt',   en: 'Early Bird',       ar: 'الطائر المبكر'    },
      title: { fr: 'Offre Lève-tôt', en: 'Early Bird Special', ar: 'عرض الطائر المبكر' },
      desc:  {
        fr: '25% sur la première séance du jour (avant 12h00). Commencez la journée avec le cinéma.',
        en: '25% off first screening of the day (before 12:00). Start your day with great cinema.',
        ar: '25% خصم على أول عرض يومياً (قبل الظهر). احجز قبل منتصف الليل.',
      },
      discount: '25%', expires: new Date(Date.now() + 2 * 86400000),
      color: '#e8c890', bg: 'linear-gradient(135deg, #1a1a1a 0%, #27282f 100%)',
    },
    {
      id: 3, icon: '👨‍👩‍👧‍👦',
      tag:   { fr: 'Famille',    en: 'Family',       ar: 'عائلة'            },
      title: { fr: 'Pack Famille', en: 'Family Pack', ar: 'باقة العائلة'    },
      desc:  {
        fr: 'Quatre billets, trois prix. Simple comme bonjour.',
        en: 'Four tickets, three prices. Simple as that.',
        ar: 'اشترِ 3 تذاكر واحصل على الرابعة مجاناً. أي فيلم، أي جلسة.',
      },
      discount: 'Free', expires: new Date(Date.now() + 14 * 86400000),
      color: '#c8a97e', bg: 'linear-gradient(135deg, #111111 0%, #252836 100%)',
    },
    {
      id: 4, icon: '🎉',
      tag:   { fr: 'Week-end',        en: 'Weekend',      ar: 'نهاية الأسبوع'    },
      title: { fr: 'Frénésie Week-end', en: 'Weekend Rush', ar: 'عروض نهاية الأسبوع' },
      desc:  {
        fr: 'Rendez votre week-end mémorable sans vous ruiner.',
        en: 'Make your weekend memorable without breaking the bank.',
        ar: 'خصم ثابت 15% على حجوزات نهاية الأسبوع. احجز مقعدك الآن!',
      },
      discount: '15%', expires: new Date(Date.now() + 3 * 86400000),
      color: '#e8c890', bg: 'linear-gradient(135deg, #656567 0%, #1a1a1a 100%)',
    },
    {
      id: 5, icon: '🌕',
      tag:   { fr: 'Fidélité',          en: 'Loyalty',          ar: 'ولاء'                 },
      title: { fr: 'Avantage Membre Or', en: 'Gold Member Perk', ar: 'ميزة العضو الذهبي'   },
      desc:  {
        fr: 'La fidélité a ses privilèges. Profitez-en pleinement.',
        en: 'Loyalty has its privileges. Enjoy every one of them.',
        ar: 'يحصل أعضاء الذهب والبلاتين على خصم 20% على كل حجز طوال العام.',
      },
      discount: '20%', expires: new Date(Date.now() + 365 * 86400000),
      color: '#c8a97e', bg: 'linear-gradient(135deg, #111111 0%, #252836 100%)',
    },
    {
      id: 6, icon: '🎂🥳',
      tag:   { fr: 'Anniversaire',       en: 'Birthday',          ar: 'عيد ميلاد'          },
      title: { fr: 'Surprise Anniversaire', en: 'Birthday Surprise', ar: 'مفاجأة عيد الميلاد' },
      desc:  {
        fr: 'Un jour par an, le popcorn a un goût plus sucré. Joyeux anniversaire.',
        en: 'One day a year, the popcorn tastes sweeter. Happy birthday.',
        ar: 'تذكرة مجانية في عيد ميلادك! سجّل تاريخ ميلادك للاستفادة.',
      },
      discount: '100%', expires: new Date(Date.now() + 30 * 86400000),
      color: '#e8c890', bg: 'linear-gradient(135deg, #4f5052 0%, #888e97 100%)',
    },
  ];

  return (
    <div className="offers-page page-enter">
      <div className="container">
        <div className="offers-header">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <div className="ornament">
              <FiGift style={{ color: 'var(--accent)', fontSize: '1.5rem' }} />
            </div>
          </motion.div>
        </div>

        <div className="offers-grid">
          {OFFERS.map((offer, i) => (
            <motion.div
              key={offer.id}
              className={`offer-card ${claimed.includes(offer.id) ? 'offer-card--claimed' : ''}`}
              style={{ background: offer.bg }}
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
            >
              <div className="offer-card__discount" style={{ color: offer.color }}>
                {offer.discount}
              </div>
              <div className="offer-card__top">
                <span className="offer-card__icon">{offer.icon}</span>
                <span className="badge badge-gold">{offer.tag[lang]}</span>
              </div>
              <h3 className="offer-card__title">{offer.title[lang]}</h3>
              <p className="offer-card__desc">{offer.desc[lang]}</p>
              <div className="offer-card__expires">
                <FiClock style={{ color: offer.color }} />
                <span>{t('expiresIn')} </span>
                <Countdown expires={offer.expires} />
              </div>
              <button
                className={`btn ${claimed.includes(offer.id) ? 'btn-ghost offer-claimed' : 'btn-primary'}`}
                onClick={() => { if (!claimed.includes(offer.id)) setClaimed(prev => [...prev, offer.id]); }}
                style={{ marginTop: 'auto', width: '100%', justifyContent: 'center' }}
              >
                {claimed.includes(offer.id) ? t('claimed') : t('claimOffer')}
              </button>
            </motion.div>
          ))}
        </div>

        <motion.div className="offers-loyalty" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}>
          <div className="offers-loyalty__content">
            <FiStar className="loyalty-star" />
            <div>
              <h3>{t('earnMore')}</h3>
              <p>{t('earnMoreSub')}</p>
            </div>
            <Link to="/register" className="btn btn-primary" style={{ whiteSpace: 'nowrap' }}>
              {t('joinFree')}
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
}