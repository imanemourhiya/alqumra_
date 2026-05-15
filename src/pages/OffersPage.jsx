import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiTag, FiClock, FiUsers, FiStar, FiGift, FiPercent } from 'react-icons/fi';
import './OffersPage.css';

const OFFERS = [
  {
    id: 1,
    icon: '👩🏽‍🎓🎓',
    tag: 'Student',
    title: 'Student Discount',
    titleAr: 'خصم الطلاب',
    desc: 'Studies are tough. At least the movies should be affordable.30% off all screenings with valid student ID. Valid Mon–Thu.',
    descAr: 'خصم 30% على جميع العروض ببطاقة الطالب. صالح الاثنين–الخميس.',
    discount: '30%',
    badge: 'badge-gold',
    expires: new Date(Date.now() + 7 * 86400000),
    color: '#c8a97e',
    bg: 'linear-gradient(135deg, #4f5052 0%, #888e97 100%)',
  },
  {
    id: 2,
    icon: '🌞',
    tag: 'Early Bird',
    title: 'Early Bird Special',
    titleAr: 'عرض الطائر المبكر',
    desc: '25% off first screening of the day (before 12:00),Start your day with great cinema .',
    descAr: '25% خصم على أول عرض يومياً (قبل الظهر). احجز قبل منتصف الليل.',
    discount: '25%',
    badge: 'badge-gold',
    expires: new Date(Date.now() + 2 * 86400000),
    color: '#e8c890',
    bg: 'linear-gradient(135deg, #1a1a1a 0%, #27282f 100%)',
  },
  {
    id: 3,
    icon: '👨‍👩‍👧‍👦',
    tag: 'Family',
    title: 'Family Pack',
    titleAr: 'باقة العائلة',
    desc: 'Four tickets, three prices. Simple as that.',
    descAr: 'اشترِ 3 تذاكر واحصل على الرابعة مجاناً. أي فيلم، أي جلسة.',
    discount: 'Free',
    badge: 'badge-gold',
    expires: new Date(Date.now() + 14 * 86400000),
    color: '#c8a97e',
    bg: 'linear-gradient(135deg, #111111 0%, #252836 100%)',
  },
  {
    id: 4,
    icon: '🎉',
    tag: 'Weekend',
    title: 'Weekend Rush',
    titleAr: 'عروض نهاية الأسبوع',
    desc: 'Make your weekend memorable without breaking the bank.',
    descAr: 'خصم ثابت 15% على حجوزات نهاية الأسبوع. احجز مقعدك الآن!',
    discount: '15%',
    badge: 'badge-gold',
    expires: new Date(Date.now() + 3 * 86400000),
    color: '#e8c890',
    bg: 'linear-gradient(135deg, #656567 0%, #1a1a1a 100%)',
  },
  {
    id: 5,
    icon: '🌕',
    tag: 'Loyalty',
    title: 'Gold Member Perk',
    titleAr: 'ميزة العضو الذهبي',
    desc: 'Loyalty has its privileges. Enjoy every one of them.',
    descAr: 'يحصل أعضاء الذهب والبلاتين على خصم 20% على كل حجز طوال العام.',
    discount: '20%',
    badge: 'badge-gold',
    expires: new Date(Date.now() + 365 * 86400000),
    color: '#c8a97e',
    bg: 'linear-gradient(135deg,#111111 0%, #252836 100%)',
  },
  {
    id: 6,
    icon: '🎂🥳',
    tag: 'Birthday',
    title: 'Birthday Surprise',
    titleAr: 'مفاجأة عيد الميلاد',
    desc: 'One day a year, the popcorn tastes sweeter. Happy birthday.',
    descAr: 'تذكرة مجانية في عيد ميلادك! سجّل تاريخ ميلادك للاستفادة.',
    discount: '100%',
    badge: 'badge-gold',
    expires: new Date(Date.now() + 30 * 86400000),
    color: '#e8c890',
    bg: 'linear-gradient(135deg, #4f5052 0%, #888e97 100%)',
  },
];

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
  const [claimed, setClaimed] = useState([]);

  const handleClaim = (id) => {
    if (!claimed.includes(id)) {
      setClaimed(prev => [...prev, id]);
    }
  };

  return (
    <div className="offers-page page-enter">
      <div className="container">
        {/* Header */}
        <div className="offers-header">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="ornament">
              <FiGift style={{ color: 'var(--accent)', fontSize: '1.5rem' }} />
            </div>
           
           
          </motion.div>
         </div> 

        {/* Cards Grid */}
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
              {/* Discount badge */}
              <div className="offer-card__discount" style={{ color: offer.color }}>
                {offer.discount}
              </div>

              {/* Icon + Tag */}
              <div className="offer-card__top">
                <span className="offer-card__icon">{offer.icon}</span>
                <span className="badge badge-gold">{offer.tag}</span>
              </div>

              <h3 className="offer-card__title">{offer.title}</h3>
              <p className="offer-card__desc">{offer.desc}</p>

              {/* Expires */}
              <div className="offer-card__expires">
                <FiClock style={{ color: offer.color }} />
                <span>Expires in </span>
                <Countdown expires={offer.expires} />
              </div>

              <button
                className={`btn ${claimed.includes(offer.id) ? 'btn-ghost offer-claimed' : 'btn-primary'}`}
                onClick={() => handleClaim(offer.id)}
                style={{ marginTop: 'auto', width: '100%', justifyContent: 'center' }}
              >
                {claimed.includes(offer.id) ? '✓ Claimed' : 'Claim Offer'}
              </button>
            </motion.div>
          ))}
        </div>

        {/* Loyalty info banner */}
        <motion.div
          className="offers-loyalty"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          <div className="offers-loyalty__content">
            <FiStar className="loyalty-star" />
            <div>
              <h3>Earn More with Al-Qumra Loyalty</h3>
              <p>Our way of saying thank you, every time..</p>
            </div>
            <Link to="/register" className="btn btn-primary" style={{ whiteSpace: 'nowrap' }}>
              Join Free
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
