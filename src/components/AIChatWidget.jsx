import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { MOVIES, SESSIONS } from '../data/mockData';
import { useLang } from '../context/LanguageContext';
import './AIChatWidget.css';

// ============================================================
// SIMULATED NLP — intent detection by keyword matching
// ============================================================
const INTENTS = {
  recommend:  ['recommend', 'suggest', 'film', 'movie', 'watch', 'see', 'voir', 'film', 'اقترح', 'فيلم', 'شاهد'],
  family:     ['family', 'kids', 'children', 'group', 'famille', 'enfant', 'عائلة', 'أطفال', 'مجموعة'],
  booking:    ['book', 'ticket', 'seat', 'reserve', 'how to', 'réserver', 'billet', 'احجز', 'تذكرة', 'مقعد'],
  seatadvice: ['seat', 'where sit', 'front', 'back', 'aisle', 'window', 'place', 'مقعد', 'أمام', 'خلف'],
  schedule:   ['schedule', 'session', 'time', 'today', 'horaire', 'séance', 'الجدول', 'توقيت', 'اليوم'],
  pricing:    ['price', 'cost', 'tarif', 'how much', 'ticket price', 'السعر', 'التكلفة', 'ثمن'],
  parking:    ['parking', 'park', 'car', 'voiture', 'parkings', 'وقوف', 'سيارة'],
  refund:     ['refund', 'cancel', 'exchange', 'rembours', 'annul', 'استرداد', 'إلغاء'],
  accessibility: ['accessibility', 'wheelchair', 'disabled', 'handicap', 'accès', 'إعاقة', 'منخفض'],
  complaint:  ['complaint', 'problem', 'issue', 'bad', 'wrong', 'plainte', 'شكوى', 'مشكلة'],
  confirm:    ['my booking', 'my ticket', 'confirmation', 'حجوزاتي', 'تأكيد'],
};

function detectIntent(text) {
  const lower = text.toLowerCase();
  for (const [intent, keywords] of Object.entries(INTENTS)) {
    if (keywords.some(kw => lower.includes(kw))) return intent;
  }
  return 'unknown';
}

function buildResponse(intent, navigate) {
  const now = new Date();
  const todaySessions = SESSIONS.slice(0, 4);
  const topMovies = MOVIES.filter(m => m.nowShowing).slice(0, 3);

  switch (intent) {
    case 'recommend':
      return {
        text: `🎬 Here are tonight's top picks based on ratings:\n\n${topMovies.map((m,i) => `${i+1}. **${m.title}** — ⭐ ${m.rating} · ${m.genre[0]}`).join('\n')}\n\nWould you like recommendations for a specific genre, mood, or group type?`,
        chips: ['Action films', 'Family friendly', 'Romantic', 'Horror picks'],
      };
    case 'family':
      const familyMovies = MOVIES.filter(m => m.nowShowing && m.genre.some(g => ['Animation','Family','Adventure'].includes(g)));
      const picks = familyMovies.length ? familyMovies : MOVIES.slice(0, 2);
      return {
        text: `👨‍👩‍👧‍👦 For family & groups, we recommend:\n\n${picks.slice(0,3).map((m,i) => `${i+1}. **${m.title}** — ${m.genre.slice(0,2).join(', ')}`).join('\n')}\n\nOur **Family Pack** gives you the 4th ticket free! 🎉`,
        chips: ['Family Pack offer', 'Group discounts', 'Other films'],
      };
    case 'booking':
      return {
        text: `🎫 Here's how to book in 3 easy steps:\n\n1️⃣ Browse **Films** and pick one you like\n2️⃣ Choose your **session date & time**\n3️⃣ Select your **seats** and pay securely\n\nShall I take you to the films page now?`,
        chips: ['Show films', 'View schedules', 'Seat tips'],
        action: () => navigate('/movies'),
        actionLabel: 'Browse Films →',
      };
    case 'seatadvice':
      return {
        text: `🪑 Seat advice:\n\n• **Best view**: Rows F–H, centre columns\n• **Family groups**: Row D–E for easy exit\n• **Quiet spot**: Last 2 rows, sides\n• **VIP experience**: Gold seats, row A–C in VIP zone — extra legroom & recliner\n\nWant me to open the seat selector?`,
        chips: ['Book VIP seats', 'Show schedules', 'Family seating'],
      };
    case 'schedule':
      const sessions = SESSIONS.slice(0, 5);
      return {
        text: `🕐 Today's sessions:\n\n${sessions.map(s => {
          const m = MOVIES.find(mv => mv.id === s.movieId);
          return `• **${m?.title || 'Film'}** — ${s.time} · ${s.format} · ${s.hallId}`;
        }).join('\n')}\n\nAll sessions start on time. Doors open 15 mins before showtime.`,
        chips: ['Book a session', 'More schedules', 'Prices?'],
      };
    case 'pricing':
      return {
        text: `💰 Current ticket prices:\n\n• **IMAX** — 120 MAD\n• **3D** — 90 MAD\n• **Standard** — 65 MAD\n• **VIP Recliner** — 150 MAD\n\n🎓 Student: -30% · 🌅 Early Bird: -25% · 👨‍👩‍👧 Family Pack: 4th ticket free\n\nGo to **Offers** for all current promotions!`,
        chips: ['View offers', 'Book now', 'Student discount'],
      };
    case 'parking':
      return {
        text: `🚗 Parking information:\n\n• Free underground parking for 3 hours with valid cinema ticket\n• Entrance via Rue Al-Qumra, Level P2\n• Capacity: 250 spaces\n• EV charging stations available (Level P1)\n• Valet service: 30 MAD (Fri–Sun)\n\nNeed directions? Ask Google Maps for "Al-Qumra Cinema".`,
        chips: ['More FAQ', 'Book tickets'],
      };
    case 'refund':
      return {
        text: `↩️ Refund & cancellation policy:\n\n• **Up to 2 hours before** showtime: Full refund\n• **1–2 hours before**: 50% refund or free exchange\n• **Less than 1 hour**: No refund, but exchange possible\n• **Exchanges**: Free up to 24h before showtime\n\nTo cancel a booking, go to **My Bookings** in your profile.`,
        chips: ['My bookings', 'File complaint', 'Other questions'],
      };
    case 'accessibility':
      return {
        text: `♿ Accessibility at Al-Qumra:\n\n• Wheelchair-accessible entrance (main & side doors)\n• Reserved wheelchair spaces: Row AA (front, flat floor)\n• Audio description headsets: Ask at the counter\n• Hearing loop available in all halls\n• Braille programmes on request\n• Dedicated parking bays (Level P1)\n\nContact us in advance to arrange assistance.`,
        chips: ['Contact us', 'Parking info', 'Book tickets'],
      };
    case 'complaint':
      const ref = 'CMP-' + Math.random().toString(36).substr(2, 6).toUpperCase();
      return {
        text: `📣 We're sorry to hear that! Your complaint reference is:\n\n**${ref}**\n\nPlease describe your issue and we'll respond within 24 hours.\n\n📧 complaint@alqumra.ma\n📞 +212 5XX-XXXXXX\n\nYou can also use our **Feedback** form for a faster response.`,
        chips: ['Go to feedback', 'Other questions'],
        action: () => navigate('/feedback'),
        actionLabel: 'Open Feedback Form',
      };
    case 'confirm':
      return {
        text: `✅ To view your booking confirmations:\n\n1. Go to your **Profile** (top-right corner)\n2. Click **My Bookings**\n3. Select any booking to see your QR ticket\n\nConfirmations are also sent to your email automatically after purchase.`,
        chips: ['My bookings', 'Questions about refunds'],
      };
    default:
      return {
        text: `👋 Hello! I'm the Al-Qumra AI assistant. I can help you with:\n\n🎬 Film recommendations · 🕐 Schedules · 💰 Prices\n🪑 Seat advice · 🎫 Booking steps · 🚗 Parking\n↩️ Refunds · ♿ Accessibility · 📣 Complaints\n\nWhat would you like help with today?`,
        chips: ['Recommend a film', 'Show schedules', 'Prices & offers', 'Book tickets'],
      };
  }
}

const QUICK_ACTIONS = [
  { label: '🎬 Recommend', text: 'Recommend me a film' },
  { label: '🕐 Schedules', text: 'Show me today schedules' },
  { label: '💰 Prices', text: 'What are the ticket prices?' },
  { label: '🎫 Book', text: 'How do I book tickets?' },
];

const WELCOME = {
  id: 0,
  role: 'ai',
  text: `👋 Bienvenue chez **Al-Qumra**! I'm your AI cinema assistant.\n\nI can help with film picks, schedules, booking, seats, parking, refunds, and more. How can I help you today?`,
  chips: ['Recommend a film', 'Show schedules', 'Prices & offers', 'Parking info'],
};

export default function AIChatWidget() {
  const navigate = useNavigate();
  const { lang } = useLang();
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([WELCOME]);
  const [input, setInput] = useState('');
  const [typing, setTyping] = useState(false);
  const [unread, setUnread] = useState(0);
  const bottomRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    if (open) {
      setUnread(0);
      setTimeout(() => inputRef.current?.focus(), 200);
    }
  }, [open]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, typing]);

  const sendMessage = (text) => {
    if (!text.trim()) return;
    const userMsg = { id: Date.now(), role: 'user', text: text.trim() };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setTyping(true);

    const delay = 900 + Math.random() * 600;
    setTimeout(() => {
      const intent = detectIntent(text);
      const response = buildResponse(intent, navigate);
      const aiMsg = { id: Date.now() + 1, role: 'ai', ...response };
      setMessages(prev => [...prev, aiMsg]);
      setTyping(false);
      if (!open) setUnread(u => u + 1);
    }, delay);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    sendMessage(input);
  };

  const formatText = (text) => {
    return text.split('\n').map((line, i) => {
      const formatted = line
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
        .replace(/⭐|🎬|🕐|💰|🪑|🎫|🚗|↩️|♿|📣|✅|👋|🎉|1️⃣|2️⃣|3️⃣/g, m => `<span>${m}</span>`);
      return <p key={i} dangerouslySetInnerHTML={{ __html: formatted }} />;
    });
  };

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
        {!open && unread > 0 && (
          <span className="ai-unread-badge">{unread}</span>
        )}
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
                  <div className="ai-panel-sub">Cinema Assistant · Online</div>
                </div>
              </div>
              <button className="ai-close-btn" onClick={() => setOpen(false)}>✕</button>
            </div>

            {/* Quick actions */}
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
                  {msg.role === 'ai' && (
                    <div className="ai-msg-avatar">✦</div>
                  )}
                  <div className="ai-msg-bubble">
                    <div className="ai-msg-text">{formatText(msg.text)}</div>
                    {msg.chips && (
                      <div className="ai-chips">
                        {msg.chips.map(chip => (
                          <button key={chip} className="ai-chip" onClick={() => sendMessage(chip)}>
                            {chip}
                          </button>
                        ))}
                      </div>
                    )}
                    {msg.action && (
                      <button
                        className="btn btn-primary"
                        style={{ fontSize: '0.72rem', padding: '8px 16px', marginTop: '10px' }}
                        onClick={() => { msg.action(); setOpen(false); }}
                      >
                        {msg.actionLabel}
                      </button>
                    )}
                  </div>
                </div>
              ))}

              {/* Typing indicator */}
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
                placeholder={lang === 'ar' ? 'اكتب رسالتك...' : 'Ask me anything…'}
                disabled={typing}
              />
              <button
                type="submit"
                className="ai-send-btn"
                disabled={typing || !input.trim()}
                aria-label="Send"
              >
                ➤
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
