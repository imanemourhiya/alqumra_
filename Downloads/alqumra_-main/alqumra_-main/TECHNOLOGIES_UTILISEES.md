# Technologies Utilisées - Al-Qumra Cinema

## 📋 Vue d'ensemble
Ce document détaille toutes les technologies, frameworks et outils utilisés dans le développement de l'application web Al-Qumra Cinema.

---

## 🎨 Frontend

### **React 19.2.5**
- **Description** : Framework JavaScript pour construire l'interface utilisateur avec des composants réutilisables
- **Utilisation** : Base de l'application, gestion des composants UI, rendu dynamique des pages

### **React Router DOM 7.14.2**
- **Description** : Bibliothèque de routage pour la navigation entre les pages
- **Utilisation** : Navigation entre les pages (Accueil, Films, Cinémas, Réservations, Profil, etc.)

### **Vite 8.0.10**
- **Description** : Outil de build et serveur de développement ultra-rapide
- **Utilisation** : Compilation du code, serveur de développement, optimisation de la production

### **Framer Motion 12.38.0**
- **Description** : Bibliothèque d'animations pour React
- **Utilisation** : Animations fluides des transitions de pages, modales, cartes, menus déroulants

### **React Icons 5.6.0**
- **Description** : Bibliothèque d'icônes SVG pour React
- **Utilisation** : Icônes pour les boutons, menus, formulaires (recherche, utilisateur, cœur, etc.)

### **Swiper 12.1.3**
- **Description** : Carousel/slider responsive
- **Utilisation** : Galeries d'images, carrousels de films, affichage des cinémas

### **Recharts 3.8.1**
- **Description** : Bibliothèque de graphiques pour React
- **Utilisation** : Tableaux de bord admin, statistiques de réservations, graphiques analytiques

### **React QR Code 2.0.18**
- **Description** : Génération de codes QR
- **Utilisation** : Génération de codes QR pour les billets de cinéma

### **Leaflet 1.9.4 & React Leaflet 5.0.0**
- **Description** : Bibliothèques de cartographie interactive
- **Utilisation** : Affichage des localisations des cinémas sur une carte interactive

### **Tailwind CSS 4.3.0**
- **Description** : Framework CSS utilitaire pour le styling
- **Utilisation** : Styling responsive, design system, classes utilitaires CSS

### **PostCSS 8.5.14**
- **Description** : Outil de transformation CSS
- **Utilisation** : Traitement des styles, intégration avec Tailwind CSS

### **Autoprefixer 10.5.0**
- **Description** : Plugin PostCSS pour ajouter les préfixes navigateur
- **Utilisation** : Compatibilité CSS cross-browser

---

## 🔌 Backend

### **Express 5.2.1**
- **Description** : Framework Node.js pour créer des serveurs web
- **Utilisation** : Serveur backend, gestion des routes API, middleware

### **Node.js**
- **Description** : Runtime JavaScript côté serveur
- **Utilisation** : Exécution du serveur backend

### **CORS 2.8.6**
- **Description** : Middleware pour gérer les requêtes cross-origin
- **Utilisation** : Autoriser les requêtes du frontend vers le backend

### **Dotenv 17.4.2**
- **Description** : Gestion des variables d'environnement
- **Utilisation** : Stockage sécurisé des clés API et configurations sensibles

---

## 💳 Paiements

### **Stripe 6.2.0 & 9.3.1**
- **Description** : Plateforme de paiement en ligne
- **Utilisation** : Traitement des paiements pour les réservations de billets de cinéma

---

## 🌐 Communication API

### **Axios 1.15.2**
- **Description** : Client HTTP pour effectuer des requêtes
- **Utilisation** : Communication avec le backend, appels API, gestion des données

### **OpenRouter API**
- **Description** : API pour accéder à des modèles d'IA
- **Utilisation** : Recommandations de films basées sur l'IA, chatbot d'assistance

---

## 🛠️ Outils de Développement

### **ESLint 10.2.1**
- **Description** : Outil de linting pour JavaScript
- **Utilisation** : Vérification de la qualité du code, respect des conventions

### **ESLint Plugins**
- **@eslint/js** : Règles ESLint recommandées
- **eslint-plugin-react-hooks** : Vérification des hooks React
- **eslint-plugin-react-refresh** : Support du Fast Refresh de Vite

### **Vite Plugin React 6.0.1**
- **Description** : Plugin Vite pour React
- **Utilisation** : Support JSX, Fast Refresh, optimisation React

### **Globals 17.5.0**
- **Description** : Définition des variables globales pour ESLint
- **Utilisation** : Configuration ESLint pour les environnements navigateur

### **gh-pages 6.3.0**
- **Description** : Outil de déploiement sur GitHub Pages
- **Utilisation** : Déploiement de la version de production

---

## 📁 Structure du Projet

```
cinema_/
├── src/
│   ├── components/        # Composants réutilisables (Navbar, Footer, etc.)
│   ├── pages/            # Pages principales (Accueil, Films, Réservations, etc.)
│   ├── context/          # Contextes React (Auth, Theme, Language)
│   ├── data/             # Données mock
│   ├── assets/           # Images et ressources
│   ├── App.jsx           # Composant principal
│   ├── main.jsx          # Point d'entrée
│   └── index.css         # Styles globaux
├── server/               # Code backend Express
├── public/               # Fichiers statiques
├── vite.config.js        # Configuration Vite
├── eslint.config.js      # Configuration ESLint
├── postcss.config.js     # Configuration PostCSS
├── package.json          # Dépendances du projet
└── .env                  # Variables d'environnement
```

---

## 🎯 Fonctionnalités Principales Supportées par les Technologies

| Fonctionnalité | Technologies |
|---|---|
| **Interface Utilisateur** | React, Framer Motion, Tailwind CSS, React Icons |
| **Navigation** | React Router DOM |
| **Animations** | Framer Motion, Swiper |
| **Réservations** | React, Axios, Express, Stripe |
| **Paiements** | Stripe |
| **Recommandations IA** | OpenRouter API, Axios |
| **Codes QR** | React QR Code |
| **Localisation Cinémas** | Leaflet, React Leaflet |
| **Tableaux de Bord** | Recharts, React |
| **Thème & Langue** | React Context API |
| **Qualité Code** | ESLint |
| **Build & Deploy** | Vite, gh-pages |

---

## 📊 Versions des Dépendances Principales

| Technologie | Version |
|---|---|
| React | 19.2.5 |
| React Router DOM | 7.14.2 |
| Vite | 8.0.10 |
| Express | 5.2.1 |
| Tailwind CSS | 4.3.0 |
| Framer Motion | 12.38.0 |
| Stripe | 6.2.0 / 9.3.1 |
| Axios | 1.15.2 |

---

## 🚀 Scripts de Développement

```bash
npm run dev          # Lancer le serveur de développement
npm run server       # Lancer le serveur backend
npm run build        # Compiler pour la production
npm run lint         # Vérifier la qualité du code
npm run preview      # Prévisualiser la build de production
```

---

## 📝 Notes Importantes

- **Frontend** : Utilise React avec Vite pour un développement rapide
- **Backend** : Serveur Express simple pour les API
- **Styling** : Combinaison de Tailwind CSS et CSS personnalisé
- **Animations** : Framer Motion pour les transitions fluides
- **Paiements** : Intégration Stripe pour les transactions sécurisées
- **IA** : OpenRouter API pour les recommandations intelligentes
- **Cartographie** : Leaflet pour l'affichage des cinémas
- **Qualité** : ESLint pour maintenir la qualité du code

---

**Dernière mise à jour** : 2026
**Projet** : Al-Qumra Cinema - Application de Réservation de Billets de Cinéma
