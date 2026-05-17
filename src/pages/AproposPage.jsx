import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { FiMapPin, FiPhone, FiMail, FiAward, FiFilm, FiUsers, FiStar } from 'react-icons/fi';
import { useLang } from '../context/LanguageContext';
import './AproposPage.css';
import { useState } from 'react';

const STATS = [
  { icon: <FiFilm />,  value: '250+', labelFr: 'Films diffusés / an',   labelEn: 'Films screened / year', labelAr: 'فيلم سنوياً' },
  { icon: <FiUsers />, value: '180K', labelFr: 'Spectateurs / an',       labelEn: 'Spectators / year',     labelAr: 'مشاهد سنوياً' },
  { icon: <FiMapPin />,value: '6',    labelFr: 'Salles au Maroc',         labelEn: 'Cinemas in Morocco',    labelAr: 'قاعة في المغرب' },
  { icon: <FiStar />,  value: '4.8',  labelFr: 'Note moyenne clients',    labelEn: 'Average client rating', labelAr: 'متوسط تقييم العملاء' },
];

const TIMELINE = [
  { year: '2009', fr: 'Fondation d\'Al-Qumra à Casablanca par la famille Benali, avec une première salle de 120 places.', en: 'Al-Qumra founded in Casablanca by the Benali family, with a first 120-seat hall.', ar: 'تأسيس القُمرة في الدار البيضاء على يد عائلة بنعلي بقاعة أولى تتسع لـ 120 مقعداً.' },
  { year: '2013', fr: 'Ouverture de la deuxième salle à Rabat. Introduction du format IMAX au Maroc.', en: 'Opening of the second hall in Rabat. Introduction of IMAX format in Morocco.', ar: 'افتتاح القاعة الثانية في الرباط. إدخال تقنية IMAX للمرة الأولى في المغرب.' },
  { year: '2017', fr: 'Lancement du programme de fidélité Al-Qumra Gold. Expansion à Marrakech et Fès.', en: 'Launch of Al-Qumra Gold loyalty programme. Expansion to Marrakech and Fès.', ar: 'إطلاق برنامج الولاء القُمرة ذهب. التوسع إلى مراكش وفاس.' },
  { year: '2021', fr: 'Rénovation complète de toutes les salles. Introduction du son Dolby Atmos.', en: 'Complete renovation of all halls. Introduction of Dolby Atmos sound.', ar: 'تجديد شامل لجميع القاعات. إدخال نظام صوت دولبي أتموس.' },
  { year: '2024', fr: 'Lancement de la plateforme digitale Al-Qumra avec réservation en ligne et IA.', en: 'Launch of the Al-Qumra digital platform with online booking and AI.', ar: 'إطلاق المنصة الرقمية للقُمرة مع الحجز الإلكتروني والذكاء الاصطناعي.' },
];

const TEAM = [
  { name: 'Youssef Benali', roleFr: 'Fondateur & Directeur Général', roleEn: 'Founder & CEO', roleAr: 'المؤسس والمدير العام', avatar: 'YB' },
  { name: 'Samira El Fassi', roleFr: 'Directrice des opérations', roleEn: 'Head of Operations', roleAr: 'مديرة العمليات', avatar: 'SE' },
  { name: 'Karim Mouttaki', roleFr: 'Responsable technique', roleEn: 'Technical Director', roleAr: 'المدير التقني', avatar: 'KM' },
  { name: 'Nadia Chraibi', roleFr: 'Directrice marketing', roleEn: 'Marketing Director', roleAr: 'مديرة التسويق', avatar: 'NC' },
];

export default function AboutPage() {
  const { lang } = useLang();

  const label = (fr, en, ar) => lang === 'ar' ? ar : lang === 'en' ? en : fr;

  return (
    <div className="about page-enter">

      {/* Hero */}
      <div className="about-hero">
        <div className="about-hero__overlay" />
        <motion.div className="about-hero__content container" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
          <p className="about-hero__sub">
            {label('Depuis 2009', 'Since 2009', 'منذ 2009')}
          </p>
          <h1 className="about-hero__title">Al-Qumra Cinema</h1>
          <p className="about-hero__tagline font-garamond">
            {label(
              '"Nous faisons de l\'ombre un refuge de lumière."',
              '"We turn darkness into a refuge of light."',
              '"نحن نجعل من الظلام ملاذاً للنور."'
            )}
          </p>
        </motion.div>
      </div>

      <div className="container">

        {/* Stats */}
        <div className="about-stats">
          {STATS.map((s, i) => (
            <motion.div key={i} className="about-stat card" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
              <div className="about-stat__icon">{s.icon}</div>
              <div className="about-stat__value">{s.value}</div>
              <div className="about-stat__label">{label(s.labelFr, s.labelEn, s.labelAr)}</div>
            </motion.div>
          ))}
        </div>

        {/* Mission */}
        <section className="about-section">
          <h2 className="about-section__title">
            {label('Notre mission', 'Our Mission', 'مهمتنا')}
          </h2>
          <p className="about-section__text font-garamond">
            {label(
              'Al-Qumra Cinema est né d\'une passion simple : offrir au public marocain une expérience cinématographique exceptionnelle, accessible et mémorable. Depuis notre première salle à Casablanca en 2009, nous croyons que le cinéma est bien plus qu\'un divertissement — c\'est un espace de rencontre, d\'émotion et de culture partagée.',
              'Al-Qumra Cinema was born from a simple passion: to offer Moroccan audiences an exceptional, accessible and memorable cinema experience. Since our first hall in Casablanca in 2009, we believe cinema is more than entertainment — it\'s a space for encounter, emotion and shared culture.',
              'وُلدت القُمرة من شغف بسيط: تقديم تجربة سينمائية استثنائية وميسورة لا تُنسى للجمهور المغربي. منذ قاعتنا الأولى في الدار البيضاء عام 2009، نؤمن بأن السينما أكثر من مجرد ترفيه — إنها فضاء للقاء والمشاعر والثقافة المشتركة.'
            )}
          </p>
        </section>

        {/* Timeline */}
        <section className="about-section">
          <h2 className="about-section__title">
            {label('Notre histoire', 'Our Story', 'قصتنا')}
          </h2>
          <div className="timeline">
            {TIMELINE.map((item, i) => (
              <motion.div key={i} className="timeline-item" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.1 }}>
                <div className="timeline-year">{item.year}</div>
                <div className="timeline-dot" />
                <div className="timeline-text font-garamond">{label(item.fr, item.en, item.ar)}</div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Team */}
        <section className="about-section">
          <h2 className="about-section__title">
            {label('Notre équipe', 'Our Team', 'فريقنا')}
          </h2>
          <div className="about-team">
            {TEAM.map((m, i) => (
              <motion.div key={i} className="team-card card" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.1 }}>
                <div className="team-avatar">{m.avatar}</div>
                <div className="team-name">{m.name}</div>
                <div className="team-role">{label(m.roleFr, m.roleEn, m.roleAr)}</div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Contact */}
        <section className="about-section">
          <h2 className="about-section__title">
            {label('Nous contacter', 'Contact Us', 'اتصل بنا')}
          </h2>
          <div className="about-contact">
            <div className="contact-item"><FiMapPin /> <span>Maarif, Casablanca 20100, Maroc</span></div>
            <div className="contact-item"><FiPhone /> <span>+212 522 123 456</span></div>
            <div className="contact-item"><FiMail /> <span>contact@alqumra.ma</span></div>
          </div>
          <Link to="/cinemas" className="btn btn-primary" style={{ marginTop: 24, display: 'inline-flex' }}>
            {label('Voir nos cinémas', 'View our cinemas', 'عرض سينماتنا')}
          </Link>
        </section>

      </div>
    </div>
  );
}