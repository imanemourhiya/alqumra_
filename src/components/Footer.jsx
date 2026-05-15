import { Link } from 'react-router-dom';
import { useLang } from '../context/LanguageContext';
import { FiInstagram, FiFacebook, FiYoutube, FiMail, FiPhone, FiMapPin } from 'react-icons/fi';
import './Footer.css';

export default function Footer() {
  const { lang, t, setLangDirect } = useLang();
  return (
    <footer className="footer">
      <div className="footer__body container">
        <div className="footer__grid">
          <div className="footer__col footer__col--brand">
            <div className="footer__logo">
              <img src="/logo.jpg" alt="Al-Qumra Cinema" style={{ height: '46px', width: 'auto', borderRadius: '50%' }} />
              <span className="logo-signature" style={{ fontSize: '1.8rem' }}>al-qumra</span>
            </div>
            <p className="footer__tagline font-garamond">
              "Al-qumra : nous faisons de l'ombre un refuge de lumière."
            </p>
            <div className="footer__social">
              <a href="#" className="social-btn" aria-label="Instagram"><FiInstagram /></a>
              <a href="#" className="social-btn" aria-label="Facebook"><FiFacebook /></a>
              <a href="#" className="social-btn" aria-label="YouTube"><FiYoutube /></a>
              <a href="mailto:contact@alqumra.ma" className="social-btn" aria-label="Email"><FiMail /></a>
            </div>
          </div>

          <div className="footer__col">
            <h4 className="footer__heading">{t('explore')}</h4>
            <ul className="footer__links">
              <li><Link to="/movies">{t('nowShowingFooter')}</Link></li>
              <li><Link to="/movies?tab=coming-soon">{t('comingSoonFooter')}</Link></li>
              <li><Link to="/cinemas">{t('ourCinemas')}</Link></li>
              <li><Link to="/ai-recommend">{t('aiPicks')}</Link></li>
            </ul>
          </div>

          <div className="footer__col">
            <h4 className="footer__heading">{t('account')}</h4>
            <ul className="footer__links">
              <li><Link to="/register">{t('joinAlQumra')}</Link></li>
              <li><Link to="/login">{t('signIn')}</Link></li>
              <li><Link to="/history">{t('myBookings')}</Link></li>
              <li><Link to="/profile">{t('loyaltyCard')}</Link></li>
              <li><Link to="/resell">{t('resellTicket')}</Link></li>
            </ul>
          </div>

          <div className="footer__col">
            <h4 className="footer__heading">{t('contact')}</h4>
            <ul className="footer__contact-list">
              <li><FiPhone /> <span>+212 522 123 456</span></li>
              <li><FiMail /> <span>contact@alqumra.ma</span></li>
              <li><FiMail style={{ color: '#cc6666' }} /> <span>complaints@alqumra.ma</span></li>
              <li><FiMapPin /> <span>Maarif, Casablanca</span></li>
            </ul>
          </div>
        </div>

        <div className="footer__bottom">
          <div className="ornament" style={{ marginBottom: '16px' }}>
            <span style={{ fontSize: '0.6rem', letterSpacing: '0.3em', fontFamily: 'Cinzel,serif', color: 'var(--text-muted)' }}>
              AL-QUMRA CINEMA GROUP
            </span>
          </div>
          <div className="footer__lang">
            {[{code:'fr',label:'Français'},{code:'en',label:'English'},{code:'ar',label:'العربية'}].map(l => (
              <button key={l.code} className={`footer__lang-btn ${lang === l.code ? 'footer__lang-btn--active' : ''}`} onClick={() => setLangDirect(l.code)}>
                {l.label}
              </button>
            ))}
          </div>
          <p className="footer__copy">
            © {new Date().getFullYear()} Al-Qumra Cinema — {lang === 'ar' ? 'جميع الحقوق محفوظة' : lang === 'fr' ? 'Tous droits réservés' : 'All rights reserved'}.
            &nbsp;·&nbsp; <Link to="/staff">{t('staffPortal')}</Link>
            &nbsp;·&nbsp; <Link to="/admin">Admin</Link>
          </p>
        </div>
      </div>
    </footer>
  );
}