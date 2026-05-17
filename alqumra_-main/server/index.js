import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { fileURLToPath } from 'url';
import path from 'path';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();

app.use(cors());
app.use(express.json());

const SYSTEM = `Tu es l'agent IA officiel du cinéma Al-Qumra, un cinéma moderne et premium au Maroc. Tu réponds en français, de façon chaleureuse et naturelle — comme un vrai conseiller cinéma.

FILMS À L'AFFICHE :
- Dune: Part Two (SF/Action, 2h46, VF & VOST) — séances : 14h00, 16h30, 19h00, 21h30
- Oppenheimer (Drame/Histoire, 3h00, VF) — séances : 15h00, 18h30
- Inside Out 2 (Animation, 1h40, VF) — séances : 11h00, 13h30, 16h00
- The Boy and the Heron (Animation, 2h04, VF/VOST) — séances : 12h00, 14h30
- Twisters (Action, 2h02, VF) — séances : 17h30, 20h00, 22h00

TARIFS :
- Standard : 50 MAD
- IMAX : 60 MAD
- VIP (siège inclinable) : 80 MAD
- Réduit (étudiants, seniors, -12 ans) : 45 MAD
- Séance premium (siège inclinable + snack) : 95 MAD

RÉSERVATION : En ligne sur alqumra.ma, guichet 30 min avant, tél 0522-123-456. CB/espèces.
ANNULATION : Gratuite jusqu'à 2h avant. Après : avoir cinéma 30 jours. Échange gratuit sous 24h.
PRATIQUE : Parking gratuit 200 places, accès PMR, bar 1h avant, Dolby Atmos, Wi-Fi gratuit.
FIDÉLITÉ : Programme Gold, Silver et Platinum. Points accumulés à chaque réservation.
REVENTE : Les tickets peuvent être revendus via votre espace profil au prix original. La plateforme prend 50% de commission.

Quand tu mentionnes les films dispo, commence par "Voici nos films à l'affiche :"
Réponds de façon courte et naturelle (max 4-5 lignes). Si hors cinéma : réponds brièvement puis ramène vers le cinéma.`;

app.post('/api/chat', async (req, res) => {
  const { messages } = req.body;
  if (!messages || !Array.isArray(messages))
    return res.status(400).json({ error: 'messages requis' });

  const apiKey = process.env.OPENROUTER_API_KEY;
  if (!apiKey)
    return res.status(500).json({ error: 'OPENROUTER_API_KEY manquante dans .env' });

  try {
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
        'HTTP-Referer': 'http://localhost:5173',
        'X-Title': 'Al-Qumra Cinema Agent',
      },
      body: JSON.stringify({
        model: 'openrouter/auto',
        messages: [{ role: 'system', content: SYSTEM }, ...messages],
        max_tokens: 600,
        temperature: 0.75,
      }),
    });

    if (!response.ok) {
      const err = await response.json();
      return res.status(response.status).json({ error: err.error?.message || 'Erreur API' });
    }

    const data = await response.json();
    const reply = data.choices?.[0]?.message?.content || "Je n'ai pas pu générer de réponse.";
    res.json({ reply });

  } catch (err) {
    console.error('Erreur:', err);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`✅ Al-Qumra AI Agent démarré → http://localhost:${PORT}`));
