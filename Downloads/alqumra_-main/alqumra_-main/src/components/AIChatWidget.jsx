import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLang } from '../context/LanguageContext';
import './AIChatWidget.css';

/* ─── System prompt with Al-Qumra context ─── */
const SYSTEM = `Tu es l'agent IA officiel du cinéma Al-Qumra, un cinéma moderne et premium au Maroc. Tu réponds en français, de façon chaleureuse et naturelle — comme un vrai conseiller cinéma.

FILMS À L'AFFICHE :
- Dune: Part Two (SF/Action, 2h46, VF & VOST) — séances : 14h00, 16h30, 19h00, 21h30
- Oppenheimer (Drame/Histoire, 3h00, VF) — séances : 15h00, 18h30
- Inside Out 2 (Animation, 1h40, VF) — séances : 11h00, 13h30, 16h00
- The Boy and the Heron (Animation, 2h04, VF/VOST) — séances : 12h00, 14h30
- Twisters (Action, 2h02, VF) — séances : 17h30, 20h00, 22h00

TARIFS :
- Standard : 50 MAD | IMAX : 60 MAD | VIP : 80 MAD
- Réduit (étudiants, seniors, -12 ans) : 45 MAD
- Séance premium (siège + snack) : 95 MAD

RÉSERVATION : En ligne, guichet 30 min avant, tél 0522-123-456. CB/espèces.
ANNULATION : Gratuite jusqu'à 2h avant. Après : avoir cinéma 30 jours. Échange gratuit sous 24h.
PRATIQUE : Parking gratuit 200 places, accès PMR, Dolby Atmos, Wi-Fi gratuit.
FIDÉLITÉ : Programme Gold, Silver, Platinum — points à chaque réservation.
REVENTE : Tickets revendables via le profil au prix original. Commission plateforme : 50%.

Réponds en 3-4 lignes max, de façon chaleureuse. Si hors cinéma : réponds brièvement puis ramène vers le cinéma. Pour les films, commence par "Voici nos films à l'affiche :"`;

/* ─── Quick chips ─── */
const QUICK_ACTIONS = [
  { label: '🎬 Films',       text: "Quels films sont à l'affiche cette semaine ?" },
  { label: '🕐 Horaires',    text: 'Quels sont les horaires des séances ?' },
  { label: '💰 Tarifs',      text: 'Quels sont vos tarifs ?' },
  { label: '🎫 Réservation', text: 'Comment réserver des places en ligne ?' },
  { label: '📞 Support',     text: 'Comment annuler ma réservation ?' },
];

const WELCOME = {
  id: 0,
  role: 'ai',
  text: "Bienvenue chez Al-Qumra ! 🎬 Je suis votre assistant cinéma personnel. Posez-moi n'importe quelle question sur nos films, séances, réservations ou tarifs — je suis là pour vous aider !",
};

/* ─── OpenRouter API call (direct from browser) ─── */
const API_KEY = import.meta.env.VITE_OPENROUTER_API_KEY;

async function callOpenRouter(history) {
  if (!API_KEY) throw new Error('Clé API manquante dans .env (VITE_OPENROUTER_API_KEY)');

  const res = await fetch('https://openrouter.ai/api/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${API_KEY}`,
      'HTTP-Referer': window.location.origin,
      'X-Title': 'Al-Qumra Cinema Agent',
    },
    body: JSON.stringify({
      model: 'openrouter/auto',
      messages: [{ role: 'system', content: SYSTEM }, ...history],
      max_tokens: 500,
      temperature: 0.75,
    }),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error?.message || `Erreur API (${res.status})`);
  }

  const data = await res.json();
  return data.choices?.[0]?.message?.content || "Je n'ai pas pu générer une réponse.";
}

export default function AIChatWidget() {
  const { lang } = useLang();
  const [open, setOpen]         = useState(false);
  const [messages, setMessages] = useState([WELCOME]);
  const [history, setHistory]   = useState([]); // conversation history sent to API
  const [input, setInput]       = useState('');
  const [typing, setTyping]     = useState(false);
  const [unread, setUnread]     = useState(0);
  const bottomRef = useRef(null);
  const inputRef  = useRef(null);

  useEffect(() => {
    if (open) { setUnread(0); setTimeout(() => inputRef.current?.focus(), 200); }
  }, [open]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, typing]);

  const sendMessage = async (text) => {
    if (!text.trim() || typing) return;

    const userMsg = { id: Date.now(), role: 'user', text: text.trim() };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setTyping(true);

    const newHistory = [...history, { role: 'user', content: text.trim() }];
    setHistory(newHistory);

    try {
      const reply = await callOpenRouter(newHistory);
      setHistory(prev => [...prev, { role: 'assistant', content: reply }]);
      setMessages(prev => [...prev, { id: Date.now() + 1, role: 'ai', text: reply }]);
      if (!open) setUnread(u => u + 1);
    } catch (e) {
      setMessages(prev => [...prev, { id: Date.now() + 1, role: 'ai', text: '⚠️ ' + e.message }]);
    } finally {
      setTyping(false);
    }
  };

  const handleSubmit = (e) => { e.preventDefault(); sendMessage(input); };

  const formatText = (text) =>
    text.split('\n').map((line, i) => {
      const html = line
        .replace(/&/g, '&amp;').replace(/</g, '&lt;')
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
        .replace(/\*(.*?)\*/g, '<em>$1</em>');
      return <p key={i} dangerouslySetInnerHTML={{ __html: html }} />;
    });

  return (
    <>
      {/* Floating bubble */}
      <motion.button
        className="ai-chat-bubble"
        onClick={() => setOpen(v => !v)}
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.94 }}
        aria-label="Open AI Assistant"
      >
        <span className="ai-bubble-icon">{open ? '✕' : '✦'}</span>
        {!open && <span className="ai-bubble-label">AI</span>}
        {!open && unread > 0 && <span className="ai-unread-badge">{unread}</span>}
      </motion.button>

      {/* Chat panel */}
      <AnimatePresence>
        {open && (
          <motion.div
            className="ai-chat-panel"
            initial={{ opacity: 0, scale: 0.92, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: 20 }}
            transition={{ duration: 0.22 }}
          >
            {/* Header */}
            <div className="ai-panel-header">
              <div className="ai-panel-info">
                <div className="ai-avatar-wrap">
                  <span className="ai-avatar-icon">✦</span>
                  <span className="ai-status-dot" />
                </div>
                <div>
                  <div className="ai-panel-name">Al-Qumra AI</div>
                  <div className="ai-panel-sub">Assistant cinéma · En ligne</div>
                </div>
              </div>
              <button className="ai-close-btn" onClick={() => setOpen(false)}>✕</button>
            </div>

            {/* Quick chips */}
            <div className="ai-quick-actions">
              {QUICK_ACTIONS.map(qa => (
                <button key={qa.label} className="ai-quick-btn" onClick={() => sendMessage(qa.text)}>
                  {qa.label}
                </button>
              ))}
            </div>

            {/* Messages */}
            <div className="ai-messages">
              {messages.map(msg => (
                <div key={msg.id} className={`ai-msg ai-msg--${msg.role}`}>
                  {msg.role === 'ai' && <div className="ai-msg-avatar">✦</div>}
                  <div className="ai-msg-bubble">
                    <div className="ai-msg-text">{formatText(msg.text)}</div>
                  </div>
                </div>
              ))}
              {typing && (
                <div className="ai-msg ai-msg--ai">
                  <div className="ai-msg-avatar">✦</div>
                  <div className="ai-msg-bubble ai-typing">
                    <span /><span /><span />
                  </div>
                </div>
              )}
              <div ref={bottomRef} />
            </div>

            {/* Input */}
            <form className="ai-input-row" onSubmit={handleSubmit}>
              <input
                ref={inputRef}
                type="text"
                className="ai-input"
                value={input}
                onChange={e => setInput(e.target.value)}
                placeholder={lang === 'ar' ? 'اكتب رسالتك...' : 'Posez votre question…'}
                disabled={typing}
              />
              <button type="submit" className="ai-send-btn" disabled={typing || !input.trim()} aria-label="Envoyer">
                ➤
              </button>
            </form>

            <p style={{ textAlign: 'center', fontSize: '0.62rem', color: 'var(--text-muted)', padding: '6px 0 10px', flexShrink: 0 }}>
              Propulsé par Claude AI · Al-Qumra Cinéma
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
