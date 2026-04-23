'use client';

import { useEffect } from 'react';

export default function Apropos() {
  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add('on');
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0.12 }
    );
    document.querySelectorAll('.reveal').forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  return (
    <>
      <style>{`
        /* ── VARIABLES ── */
        :root {
          --c1: #120b07;
          --c2: #5a1a10;
          --c3: #7a3a1e;
          --c4: #9b2215;
          --c5: #c05a20;
          --c6: #d4742a;
          --c7: #c8973a;
          --c8: #a08228;
          --c9: #7a7020;
          --c10: #4a4a18;
          --cream: #f0ddb0;
          --text: #e8d5b0;
        }

        /* ── RESET ── */
        .aq-about * { box-sizing: border-box; margin: 0; padding: 0; }

        /* ── BASE ── */
        .aq-about {
          background: var(--c1);
          color: var(--text);
          font-family:  sans-serif;
          font-weight: 300;
          overflow-x: hidden;
          position: relative;
          bottom:-1rem;
        }

        /* grain overlay */
        .aq-about::before {
          content: '';
          position: fixed;
          inset: 0;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.04'/%3E%3C/svg%3E");
          opacity: 0.4;
          pointer-events: none;
          z-index: 999;
        }

        /* ── PALETTE STRIP ── */
        .aq-strip {
          display: flex;
          height: 5px;
          width: 100%;
          position: fixed;
          top: 0;
          left: 0;
          z-index: 100;
        }
        .aq-strip div { flex: 1; }

        /* ── NAV ── */
        .aq-nav {
          position: fixed;
          top: 5px;
          width: 100%;
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 1.2rem 3rem;
          z-index: 90;
          background: linear-gradient(to bottom, rgba(18,11,7,0.85), transparent);
        }
        .aq-nav-logo {
          font-family:  serif;
          font-size: 1.4rem;
          color: var(--c7);
          letter-spacing: 0.05em;
        }
        .aq-nav-links {
          display: flex;
          gap: 2.5rem;
          list-style: none;
        }
        .aq-nav-links a {
          font-size: 0.75rem;
          letter-spacing: 0.25em;
          text-transform: uppercase;
          color: rgba(232,213,176,0.55);
          text-decoration: none;
          transition: color 0.3s;
        }
        .aq-nav-links a:hover { color: var(--c7); }

        /* ── HERO ── */
        .aq-hero {
          min-height: 100vh;
          display: grid;
          place-items: center;
          position: relative;
          overflow: hidden;
          background:
            radial-gradient(ellipse at 25% 50%, rgba(192,90,32,0.22) 0%, transparent 55%),
            radial-gradient(ellipse at 75% 30%, rgba(90,26,16,0.32) 0%, transparent 50%),
            var(--c1);
        }

        .aq-ring {
          position: absolute;
          border-radius: 50%;
          border: 1px solid rgba(200,151,58,0.12);
          animation: aq-breathe 8s ease-in-out infinite;
        }
        .aq-ring:nth-child(1) { width: 420px; height: 420px; top: -10%; right: -8%; animation-delay: 0s; }
        .aq-ring:nth-child(2) { width: 650px; height: 650px; bottom: -20%; left: -12%; animation-delay: 3s; border-color: rgba(154,34,21,0.1); }
        .aq-ring:nth-child(3) { width: 280px; height: 280px; top: 55%; right: 15%; animation-delay: 5s; border-color: rgba(200,151,58,0.07); }

        @keyframes aq-breathe {
          0%, 100% { opacity: 0.4; transform: scale(1); }
          50%       { opacity: 0.9; transform: scale(1.04); }
        }

        .aq-hero-inner {
          position: relative;
          z-index: 2;
          text-align: center;
          padding: 2rem;
          animation: aq-rise 1.6s cubic-bezier(.16,1,.3,1) both;
        }

        @keyframes aq-rise {
          from { opacity: 0; transform: translateY(50px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        .aq-eyebrow {
          font-size: 0.72rem;
          letter-spacing: 0.5em;
          text-transform: uppercase;
          color: var(--c6);
          margin-bottom: 1.8rem;
        }

        .aq-hero h1 {
          font-family:  serif;
          font-size: clamp(5rem, 14vw, 11rem);
          font-weight: 700;
          line-height: 0.88;
          color: var(--cream);
          text-shadow: 0 0 120px rgba(200,151,58,0.2), 0 6px 30px rgba(0,0,0,0.9);
        }

        .aq-hero h1 em {
          display: block;
          font-style: italic;
          font-size: 0.42em;
          color: var(--c6);
          letter-spacing: 0.12em;
          margin-top: 0.4em;
        }

        .aq-hero-line {
          width: 100px;
          height: 1px;
          background: linear-gradient(90deg, transparent, var(--c7), transparent);
          margin: 2.5rem auto;
        }

        .aq-hero-sub {
          font-family:  serif;
          font-style: italic;
          font-size: clamp(1.1rem, 2.5vw, 1.45rem);
          color: rgba(232,213,176,0.65);
          max-width: 520px;
          line-height: 1.75;
          margin: 0 auto;
        }

        .aq-scroll-hint {
          position: absolute;
          bottom: -2.5rem;
          left: 50%;
          transform: translateX(-50%);
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.5rem;
          color: rgba(232,213,176,0.3);
          font-size: 0.7rem;
          letter-spacing: 0.3em;
          text-transform: uppercase;
          animation: aq-bob 2.5s ease-in-out infinite;
        }

        @keyframes aq-bob {
          0%, 100% { transform: translateX(-50%) translateY(0); }
          50%       { transform: translateX(-50%) translateY(8px); }
        }

        .aq-scroll-hint::after {
          content: '';
          width: 1px;
          height: 50px;
          background: linear-gradient(to bottom, var(--c6), transparent);
        }

        /* ── SECTIONS ── */
        .aq-container { max-width: 860px; margin: 0 auto; padding: 0 2rem; }
        .aq-section { padding: 8rem 2rem; }

        .aq-num {
          font-family: serif;
          font-size: 7rem;
          font-weight: 300;
          color: var(--c2);
          opacity: 0.3;
          line-height: 1;
          margin-bottom: -1rem;
          display: block;
        }

        .aq-label {
          font-size: 0.72rem;
          letter-spacing: 0.4em;
          text-transform: uppercase;
          color: var(--c6);
          margin-bottom: 1.2rem;
          display: block;
        }

        .aq-about h2 {
          font-family:  serif;
          font-size: clamp(2.2rem, 5vw, 3.4rem);
          font-weight: 400;
          line-height: 1.15;
          color: var(--cream);
          margin-bottom: 2.5rem;
        }

        .aq-about h2 em { font-style: italic; color: var(--c6); }

        .aq-about p {
          font-size: 1.05rem;
          line-height: 1.95;
          color: rgba(232,213,176,0.75);
          margin-bottom: 1.6rem;
          font-weight: 300;
        }

        .aq-quote {
          border-left: 3px solid var(--c5);
          padding: 1.5rem 0 1.5rem 2rem;
          margin: 3rem 0;
          background: linear-gradient(to right, rgba(90,26,16,0.15), transparent);
        }

        .aq-quote p {
          font-family:  serif;
          font-size: 1.5rem;
          font-style: italic;
          color: #e8c888;
          line-height: 1.65;
          margin: 0;
        }

        /* ── BAND ── */
        .aq-band {
          background: linear-gradient(135deg, var(--c4) 0%, var(--c2) 40%, var(--c3) 100%);
          padding: 7rem 2rem;
          position: relative;
          overflow: hidden;
          text-align: center;
        }

        .aq-band::before {
          content: 'AL-QUMRA';
          position: absolute;
          font-family:  serif;
          font-size: 18vw;
          color: rgba(255,255,255,0.03);
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          white-space: nowrap;
          pointer-events: none;
          letter-spacing: 0.1em;
        }

        .aq-band .aq-label { color: rgba(240,221,176,0.55); }
        .aq-band h2 { color: #f5e8c0; }
        .aq-band p { color: rgba(245,232,192,0.75); max-width: 640px; margin: 0 auto 1.4rem; }

        .aq-stats { display: flex; justify-content: center; gap: 5rem; margin-top: 4rem; flex-wrap: wrap; }
        .aq-stat-number {
          display: block;
          font-family:  serif;
          font-size: 3.8rem;
          color: var(--c7);
          line-height: 1;
        }
        .aq-stat-label {
          display: block;
          font-size: 0.72rem;
          letter-spacing: 0.3em;
          text-transform: uppercase;
          color: rgba(232,213,176,0.45);
          margin-top: 0.6rem;
        }

        /* ── GRID ── */
        .aq-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 1.5rem; margin-top: 3.5rem; }

        .aq-card {
          background: linear-gradient(135deg, rgba(90,26,16,0.2), rgba(18,11,7,0.5));
          border: 1px solid rgba(200,151,58,0.12);
          padding: 2.2rem;
          transition: border-color 0.4s, transform 0.4s;
          position: relative;
          overflow: hidden;
        }

        .aq-card::after {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(135deg, rgba(192,90,32,0.07), transparent);
          opacity: 0;
          transition: opacity 0.4s;
        }

        .aq-card:hover { border-color: rgba(200,151,58,0.4); transform: translateY(-4px); }
        .aq-card:hover::after { opacity: 1; }

        .aq-card-icon { font-size: 1.8rem; margin-bottom: 1.1rem; display: block; }

        .aq-card h3 {
          font-family:  serif;
          font-size: 1.15rem;
          color: var(--c7);
          margin-bottom: 0.8rem;
          font-weight: 400;
        }

        .aq-card p { font-size: 0.95rem; margin: 0; color: rgba(232,213,176,0.65); line-height: 1.8; }

        /* ── CTA ── */
        .aq-cta {
          text-align: center;
          padding: 8rem 2rem;
          background: radial-gradient(ellipse at center bottom, rgba(90,26,16,0.35) 0%, transparent 65%);
        }
        .aq-cta h2 { margin: 1.5rem 0 2.5rem; }

        .aq-btn {
          display: inline-block;
          padding: 1.1rem 3.5rem;
          border: 1px solid var(--c7);
          color: var(--c7);
          font-size: 0.78rem;
          letter-spacing: 0.35em;
          text-transform: uppercase;
          text-decoration: none;
          position: relative;
          overflow: hidden;
          transition: color 0.45s;
        }

        .aq-btn::before {
          content: '';
          position: absolute;
          inset: 0;
          background: var(--c7);
          transform: scaleX(0);
          transform-origin: left;
          transition: transform 0.45s cubic-bezier(.16,1,.3,1);
        }

        .aq-btn:hover::before { transform: scaleX(1); }
        .aq-btn:hover { color: var(--c1); }
        .aq-btn span { position: relative; z-index: 1; }

        /* ── REVEAL ── */
        .reveal { opacity: 0; transform: translateY(35px); transition: opacity 1s ease, transform 1s ease; }
        .reveal.on { opacity: 1; transform: none; }

        /* ── RESPONSIVE ── */
        @media (max-width: 640px) {
          .aq-nav { padding: 1rem 1.5rem; }
          .aq-nav-links { display: none; }
          .aq-grid { grid-template-columns: 1fr; }
          .aq-stats { gap: 2.5rem; }
        }
      `}</style>

      {/* Google Fonts — à remplacer par next/font si tu veux optimiser */}
      <link
        href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;1,400&family=Cormorant+Garamond:ital,wght@0,300;0,400;1,300;1,400&family=Jost:wght@300;400;500&display=swap"
        rel="stylesheet"
      />

      <div className="aq-about">

        {/* PALETTE STRIP */}
        <div className="aq-strip">
          {['#120b07','#5a1a10','#7a3a1e','#9b2215','#c05a20','#d4742a','#c8973a','#a08228','#7a7020','#4a4a18'].map((c) => (
            <div key={c} style={{ background: c }} />
          ))}
        </div>

        {/* NAV */}
        <nav className="aq-nav">
          <span className="aq-nav-logo">Al-Qumra</span>
          <ul className="aq-nav-links">
            <li><a href="#">Films</a></li>
            <li><a href="#">Critiques</a></li>
            <li><a href="#">Réalisateurs</a></li>
            <li><a href="#">À propos</a></li>
          </ul>
        </nav>

        {/* HERO */}
        <div className="aq-hero">
          <div className="aq-ring" />
          <div className="aq-ring" />
          <div className="aq-ring" />
          <div className="aq-hero-inner">
            <p className="aq-eyebrow">À propos de nous</p>
            <h1>
              Al-Qumra
              <em>Le cinéma autrement</em>
            </h1>
            <div className="aq-hero-line" />
            <p className="aq-hero-sub">
              Là où la lumière rencontre l'ombre, et où chaque image devient une question sur ce que signifie être humain.
            </p>
          </div>
          <div className="aq-scroll-hint">Défiler</div>
        </div>

        {/* SECTION 01 */}
        <section className="aq-section">
          <div className="aq-container reveal">
            <span className="aq-num">01</span>
            <span className="aq-label">Notre origine</span>
            <h2>Un nom vieux de mille ans,<br />une passion <em>intemporelle</em></h2>
            <p>
              <em>Al-Qumra</em> — ce mot arabe ancestral qui a donné naissance au terme &quot;caméra&quot; dans toutes les langues du monde. C&apos;est Ibn al-Haytham, savant arabe du XIe siècle, qui découvrit qu&apos;en laissant pénétrer un mince filet de lumière dans une chambre obscure, le monde extérieur se dessinait sur le mur opposé, renversé et parfait. De ce principe est né tout ce que nous appelons cinéma.
            </p>
            <div className="aq-quote">
              <p>« Le cinéma ne se regarde pas avec les yeux — il se ressent dans cet endroit secret où le rêve et la mémoire se rejoignent. »</p>
            </div>
            <p>
              Al-Qumra est né de cette conviction : que l&apos;image en mouvement n&apos;est pas un divertissement occidental importé, mais un héritage profondément humain. Notre site porte ce nom comme un manifeste — pour rappeler que la lumière et l&apos;ombre ont toujours été notre façon de raconter le monde.
            </p>
          </div>
        </section>

        {/* BAND */}
        <div className="aq-band">
          <div className="aq-container reveal">
            <span className="aq-label">Ce que nous croyons</span>
            <h2>Le cinéma est une façon<br />de <em>voir</em>, pas seulement de regarder</h2>
            <p>Chaque film est une fenêtre ouverte sur une conscience différente. Chez Al-Qumra, notre mission est d&apos;ouvrir ces fenêtres en grand — et d&apos;inviter ceux qui osent vraiment regarder.</p>
            <div className="aq-stats">
              {[
                { number: '100+', label: 'Films analysés' },
                { number: '15',    label: 'Cinémas ' },
                { number: '8',   label: 'Ans d\'histoire' },
                { number: '∞',     label: 'Questions ouvertes' },
              ].map((s) => (
                <div key={s.label}>
                  <span className="aq-stat-number">{s.number}</span>
                  <span className="aq-stat-label">{s.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* SECTION 02 */}
        <section className="aq-section">
          <div className="aq-container reveal">
            <span className="aq-num">02</span>
            <span className="aq-label">Notre approche</span>
            <h2>Nous écrivons sur les films<br />comme on écrit <em>de la littérature</em></h2>
            <p>
              Al-Qumra n&apos;est pas une base de données, ni un agrégateur de notes. Nous sommes plus proches d&apos;un cercle littéraire qui se réunit à la lueur d&apos;une bougie pour débattre du sens d&apos;une œuvre. Chaque critique publiée ici est un texte à part entière — qui respecte l&apos;intelligence du lecteur, refuse les jugements hâtifs, et creuse là où d&apos;autres s&apos;arrêtent.
            </p>
            <p>
              Nous plongeons dans l&apos;analyse visuelle, nous suivons les cinéastes tout au long de leur carrière, nous découvrons le cinéma mondial dans toute sa diversité — de Tokyo à Téhéran, de Bucarest à Buenos Aires — et nous le présentons à des lecteurs qui traitent le film comme un acte de pensée.
            </p>
            <div className="aq-grid">
              {[
                { icon: '🎞️', title: 'Honnêteté critique',     text: 'Pas de complaisance, pas de pression commerciale. Notre regard est le nôtre, qu\'importe la notoriété du film.' },
                { icon: '🌍', title: 'Diversité géographique', text: 'Cinéma iranien, coréen, africain, maghrébin — chaque peuple a sa signature, nous sommes là pour la lire.' },
                { icon: '✍️', title: 'Écriture littéraire',    text: 'Nous croyons que la critique de cinéma peut être aussi belle qu\'elle est rigoureuse. Chaque mot compte.' },
                { icon: '🕯️', title: 'Mémoire collective',     text: 'Nous sauvons les films de l\'oubli et leur restituons leur place dans la culture contemporaine.' },
              ].map((card) => (
                <div className="aq-card" key={card.title}>
                  <span className="aq-card-icon">{card.icon}</span>
                  <h3>{card.title}</h3>
                  <p>{card.text}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* SECTION 03 */}
        <section className="aq-section">
          <div className="aq-container reveal">
            <span className="aq-num">03</span>
            <span className="aq-label">Notre vision</span>
            <h2>L&apos;avenir est<br /><em>en cours de tournage</em></h2>
            <p>
              Al-Qumra est un projet en perpétuelle évolution — tout comme le cinéma lui-même, qui n&apos;a cessé de se réinventer depuis les frères Lumière jusqu&apos;aux plateformes d&apos;aujourd&apos;hui. Nous rêvons d&apos;une archive vivante qui recense chaque film qui mérite d&apos;être remembré, et d&apos;une communauté de lecteurs qui deviennent des compagnons de route dans cette exploration.
            </p>
            <p>
              Le paysage cinématographique change à toute vitesse, mais les questions fondamentales demeurent : qu&apos;est-ce qui rend un film immortel ? Comment l&apos;âme humaine se traduit-elle en lumière et en ombre ? Pourquoi pleurons-nous devant une fiction en sachant pertinemment que tout est simulacre ? Ce sont ces questions qui nous animent.
            </p>
            <div className="aq-quote">
              <p>« La caméra ne ment pas — mais elle choisit ce qu&apos;elle montre. Et dans ce choix réside toute la philosophie du cinéma. »</p>
            </div>
          </div>
        </section>

        {/* CTA */}
        <div className="aq-cta reveal">
          <div className="aq-container">
            <span className="aq-label" style={{ display: 'block' }}>Rejoignez-nous</span>
            <h2>
              L&apos;obscurité commence.<br />
              Le film commence.<br />
              <em>Vous commencez.</em>
            </h2>
            <a href="#" className="aq-btn"><span>Explorer les films</span></a>
          </div>
        </div>

        {/* BOTTOM STRIP */}
        <div className="aq-strip" style={{ position: 'relative', top: 'auto' }}>
          {['#4a4a18','#7a7020','#a08228','#c8973a','#d4742a','#c05a20','#9b2215','#7a3a1e','#5a1a10','#120b07'].map((c) => (
            <div key={c} style={{ background: c }} />
          ))}
        </div>

      </div>
    </>
  );
}
