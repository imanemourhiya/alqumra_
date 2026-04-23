"use client";

import { useState } from "react";

const LOGO_SRC    = "/images/logo.jpeg";
const CINEMA_SRC  = "/images/cinema.PNG";
const SKYLINE_SRC = "/images/skyline.PNG";

const FB = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
    <path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z"/>
  </svg>
);
const IG = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <rect x="2" y="2" width="20" height="20" rx="5"/>
    <circle cx="12" cy="12" r="4"/>
    <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none"/>
  </svg>
);
const TW = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
  </svg>
);
const TK = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor">
    <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V9.48a8.24 8.24 0 004.83 1.55V7.57a4.85 4.85 0 01-1.06-.88z"/>
  </svg>
);
const YT = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
    <path d="M22.54 6.42a2.78 2.78 0 00-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46A2.78 2.78 0 001.46 6.42 29 29 0 001 12a29 29 0 00.46 5.58A2.78 2.78 0 003.41 19.6C5.12 20 12 20 12 20s6.88 0 8.59-.46a2.78 2.78 0 001.95-1.95A29 29 0 0023 12a29 29 0 00-.46-5.58z"/>
    <polygon points="9.75,15.02 15.5,12 9.75,8.98" fill="#080400"/>
  </svg>
);

const NAV = [
  { icon: "🏠", label: "Accueil" },
  { icon: "🎬", label: "Films" },
  { icon: "📍", label: "Cinémas" },
  { icon: "🎁", label: "Offres & Événements" },
  { icon: "ℹ️", label: "À propos de nous" },
  { icon: "✉️", label: "Contact" },
];
const SUP = [
  { icon: "❓", label: "Aide & FAQ" },
  { icon: "📄", label: "Conditions générales" },
  { icon: "🔒", label: "Politique de confidentialité" },
  { icon: "↩️", label: "Échanges & Remboursements" },
  { icon: "📞", label: "Nous contacter" },
];

const STARS = Array.from({ length: 26 }, (_, i) => ({
  id: i,
  l: `${(i * 3.83) % 100}%`,
  t: `${(i * 7.97) % 64}%`,
  s: i % 5 === 0 ? 2 : 1.2,
  o: 0.06 + (i % 7) * 0.03,
}));

const css = `
@import url('https://fonts.googleapis.com/css2?family=Cinzel+Decorative:wght@700&family=Cinzel:wght@600;700&family=Bebas+Neue&family=Crimson+Text:ital,wght@0,400;0,600;1,400;1,600&display=swap');
:root{
  --bg:#080400;
  --gold:#C17B1A; --gH:#E09520; --gP:#C9923A; --gD:#7A4E10;
  --btn:#B84010; --btnH:#D04A15;
  --cr:#D8C08A; --crD:#9A7840; --crDk:#6A5028;
  --div:rgba(180,110,15,0.28);
}
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
.aq{font-family:'Crimson Text',serif;background:var(--bg);color:var(--cr);position:relative;overflow:hidden}
.aq-stars{position:absolute;inset:0;pointer-events:none;z-index:0}
.aq-topbar{display:flex;align-items:center;padding:22px 60px 0;gap:14px}
.aq-tline{flex:1;height:1px;background:linear-gradient(to right,transparent,var(--gold),transparent)}
.aq-tstar{color:var(--gH);font-size:.9rem;flex-shrink:0}
.aq-grid{
  max-width:1280px;margin:0 auto;padding:34px 60px 24px;
  display:grid;
  grid-template-columns:1.05fr 0.95fr 0.95fr 1.05fr;
  grid-template-rows:auto auto;
  gap:44px;
  position:relative;z-index:1
}
@media(max-width:960px){.aq-grid{grid-template-columns:1fr 1fr;gap:26px;padding:26px 28px}}
@media(max-width:560px){.aq-grid{grid-template-columns:1fr}}
.aq-lw{display:flex;align-items:center;gap:13px;margin-bottom:10px}
.aq-lc{width:66px;height:66px;border-radius:50%;border:1.5px solid var(--gold);overflow:hidden;flex-shrink:0;background:#160800}
.aq-lc img{width:100%;height:100%;object-fit:cover}
.aq-bn{font-family:'Cinzel Decorative',serif;font-size:1.42rem;font-weight:700;font-style:italic;color:var(--gH);letter-spacing:.03em;line-height:1.1;display:block}
.aq-bs{font-family:'Bebas Neue',sans-serif;letter-spacing:.52em;font-size:.62rem;color:var(--crD);display:flex;align-items:center;gap:5px;margin-top:4px}
.aq-bsd{flex:1;height:1px;background:var(--gD);max-width:20px}
.aq-tg{font-size:.97rem;line-height:1.76;color:var(--crD);margin:13px 0 19px;font-style:italic}
.aq-socs{display:flex;gap:10px}
.aq-soc{width:36px;height:36px;border-radius:50%;border:1px solid rgba(193,123,26,.38);display:flex;align-items:center;justify-content:center;cursor:pointer;background:transparent;color:var(--gH);text-decoration:none;transition:all .2s}
.aq-soc:hover{background:var(--gold);color:var(--bg);transform:translateY(-2px)}
.aq-ch{font-family:'Bebas Neue',sans-serif;font-size:.93rem;letter-spacing:.28em;color:var(--gH);text-transform:uppercase;margin-bottom:6px}
.aq-chr{display:flex;align-items:center;gap:7px;margin-bottom:15px}
.aq-chd{width:6px;height:6px;border-radius:50%;background:var(--gH);flex-shrink:0}
.aq-chl{flex:1;height:1px;background:linear-gradient(to right,var(--gold),transparent)}
.aq-list{list-style:none}
.aq-list li{margin-bottom:8px}
.aq-link{display:flex;align-items:center;gap:9px;font-size:.97rem;color:var(--crD);text-decoration:none;cursor:pointer;transition:color .17s,gap .17s;line-height:1.3}
.aq-link:hover{color:var(--gP);gap:13px}
.aq-li{width:17px;text-align:center;font-size:.78rem;opacity:.68;flex-shrink:0}
.aq-nlt{font-size:.96rem;line-height:1.72;color:var(--crD);margin-bottom:13px;font-style:italic}
.aq-nlr{display:flex;border:1px solid rgba(193,123,26,.35);border-radius:3px;overflow:hidden}
.aq-nli{flex:1;background:rgba(255,255,255,.03);border:none;padding:9px 11px;color:var(--cr);font-family:'Crimson Text',serif;font-size:.97rem;outline:none;min-width:0}
.aq-nli::placeholder{color:rgba(180,145,88,.38)}
.aq-nlb{background:var(--btn);border:none;padding:9px 15px;color:#fff;font-size:1.1rem;cursor:pointer;transition:background .2s;flex-shrink:0;display:flex;align-items:center;justify-content:center}
.aq-nlb:hover{background:var(--btnH)}
.aq-cimg{margin-top:15px;border-radius:5px;overflow:hidden;border:1px solid rgba(193,123,26,.22)}
.aq-cimg img{width:100%;display:block;filter:brightness(1.22) contrast(1.05) saturate(1.08)}
.aq-sep{max-width:1280px;margin:0 auto;padding:0 60px}
.aq-sl{height:1px;background:linear-gradient(to right,transparent,var(--div),var(--div),transparent)}
.aq-sky{width:100%;position:relative;z-index:1;display:block;margin-top:-1px}
.aq-sky img{width:100%;display:block}
.aq-bot{border-top:1px solid rgba(193,123,26,.16);padding:13px 60px;display:flex;align-items:center;justify-content:center;position:relative;z-index:1}
.aq-copy{font-size:.82rem;color:var(--crDk);letter-spacing:.04em;text-align:center}
.aq-toast{position:fixed;bottom:24px;right:24px;background:var(--btn);color:#fff;font-family:'Bebas Neue',sans-serif;font-size:.86rem;letter-spacing:.1em;padding:11px 19px;border-radius:4px;z-index:9999;box-shadow:0 5px 20px rgba(150,40,0,.45);animation:toUp .28s ease}
@keyframes toUp{from{transform:translateY(12px);opacity:0}to{transform:translateY(0);opacity:1}}
`;

export default function Footer() {
  const [email, setEmail] = useState("");
  const [toast, setToast] = useState(null);
  const fire = msg => { setToast(msg); setTimeout(() => setToast(null), 3000); };

  return (
    <>
      <style>{css}</style>
      <footer className="aq">

        {/* étoiles en arrière-plan */}
        <div className="aq-stars" aria-hidden>
          {STARS.map(s => (
            <div key={s.id} style={{
              position: "absolute", left: s.l, top: s.t,
              width: s.s, height: s.s, borderRadius: "50%",
              background: "#C9923A", opacity: s.o,
            }} />
          ))}
        </div>

        {/* ligne décorative en haut */}
        <div className="aq-topbar" aria-hidden>
          <div className="aq-tline" />
          <span className="aq-tstar">✦</span>
          <div className="aq-tline" />
        </div>

        {/* ── GRILLE 4 COLONNES ── */}
        <div className="aq-grid">

          {/* ROW 1 – COL 1 : Marque */}
          <div style={{ gridColumn: '1', gridRow: '1' }}>
            <div className="aq-lw">
              <div className="aq-lc">
                <img src={LOGO_SRC} alt="Al-Qumra logo" />
              </div>
              <div>
                <span className="aq-bn">Al-Qumra</span>
                <div className="aq-bs">
                  <span className="aq-bsd" />
                  CINÉMA
                  <span className="aq-bsd" />
                </div>
              </div>
            </div>
            <p className="aq-tg">
              Vivez la magie du cinéma.<br />
              Réservez vos films préférés,<br />
              vos sièges idéaux, et laissez<br />
              chaque histoire vous emporter.
            </p>
            <div className="aq-socs">
              {[FB, IG, TW, TK, YT].map((Icon, i) => (
                <a key={i} className="aq-soc" href="#" onClick={e => e.preventDefault()}>
                  <Icon />
                </a>
              ))}
            </div>

            {/* Citation – dans l'espace vide sous les icônes */}
            <div style={{
              marginTop: '32px',
              paddingTop: '20px',
              borderTop: '1px solid rgba(193,123,26,.18)',
            }}>
              <p style={{
                fontFamily: "'Crimson Text', serif",
                fontSize: '1.2rem',
                fontStyle: 'italic',
                color: 'var(--crD)',
                lineHeight: '1.4',
                opacity: 0.85,
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis'
              }}>
                "À Al-Qumra, nous sculptons le vide avec de la lumière <br />
                pour que naisse l'étincelle de vos plus grandes réflexions."
              </p>
              <div style={{
                width: '36px',
                height: '1px',
                background: 'linear-gradient(to right, var(--gold), transparent)',
                marginTop: '12px',
                opacity: 0.5
              }} />
            </div>
          </div>

          {/* ROW 1 – COL 2 : Navigation */}
          <div style={{ gridColumn: '2', gridRow: '1' }}>
            <h3 className="aq-ch">Navigation</h3>
            <div className="aq-chr"><div className="aq-chd" /><div className="aq-chl" /></div>
            <ul className="aq-list">
              {NAV.map(n => (
                <li key={n.label}>
                  <a className="aq-link" href="#" onClick={e => e.preventDefault()}>
                    <span className="aq-li">{n.icon}</span>{n.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* ROW 1 – COL 3 : Support */}
          <div style={{ gridColumn: '3', gridRow: '1' }}>
            <h3 className="aq-ch">Support</h3>
            <div className="aq-chr"><div className="aq-chd" /><div className="aq-chl" /></div>
            <ul className="aq-list">
              {SUP.map(s => (
                <li key={s.label}>
                  <a className="aq-link" href="#" onClick={e => e.preventDefault()}>
                    <span className="aq-li">{s.icon}</span>{s.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* ROW 1 – COL 4 : Newsletter */}
          <div style={{ gridColumn: '4', gridRow: '1' }}>
            <h3 className="aq-ch">Newsletter</h3>
            <div className="aq-chr"><div className="aq-chd" /><div className="aq-chl" /></div>
            <p className="aq-nlt">
              Abonnez-vous pour recevoir nos dernières nouveautés,
              offres exclusives et avant-premières.
            </p>
            <div className="aq-nlr">
              <input
                className="aq-nli" type="email" placeholder="Votre email"
                value={email} onChange={e => setEmail(e.target.value)}
              />
              <button className="aq-nlb" type="button" onClick={() => {
                if (!email || !email.includes("@")) { fire("⚠️ Email invalide"); return; }
                fire("🎟️ Inscription confirmée !"); setEmail("");
              }}>→</button>
            </div>
            <div className="aq-cimg">
              <img src={CINEMA_SRC} alt="Al-Qumra cinéma popcorn" />
            </div>
          </div>

        </div>{/* ← fin aq-grid */}
        {/* séparateur */}
        <div className="aq-sep"><div className="aq-sl" /></div>
        <div className="aq-topbar" aria-hidden>
          <div className="aq-tline" />
          <span className="aq-tstar">✦</span>
          <div className="aq-tline" />
        </div>
        {/* skyline marocaine */}
        <div className="aq-sky">
          <img src={SKYLINE_SRC} alt="" aria-hidden />
        </div>

        {/* barre du bas */}
        <div className="aq-bot">
          <span className="aq-copy">© 2024 Al-Qumra CINÉMA. Tous droits réservés.</span>
        </div>

      </footer>

      {toast && <div className="aq-toast">{toast}</div>}
    </>
  );
}