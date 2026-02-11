# 📁 Structure du Projet WC Reservation

```
fun/
│
├── 📄 README.md                    # Documentation principale
├── 📄 INSTRUCTIONS.md              # Instructions détaillées de lancement
├── 📄 CHANGELOG.md                 # Historique des versions
├── 📄 STRUCTURE.md                 # Ce fichier - arborescence du projet
├── 📄 .gitignore                   # Fichiers à ignorer par Git
├── 🐳 docker-compose.yml           # Configuration Docker Compose
├── 🚀 start.sh                     # Script de lancement rapide
│
├── 📂 backend/                     # Serveur Node.js
│   ├── 📄 package.json             # Dépendances backend
│   ├── 🐳 Dockerfile               # Image Docker backend
│   ├── 📄 .dockerignore            # Fichiers Docker à ignorer
│   │
│   ├── 📂 src/                     # Code source backend
│   │   ├── 📄 server.js            # Point d'entrée - Serveur Express
│   │   ├── 📄 database.js          # Gestion SQLite et CRUD
│   │   └── 📄 socket.js            # Logique Socket.io et événements
│   │
│   └── 📂 database/                # Base de données (créé au runtime)
│       └── 🗄️ wc-reservation.db    # Base SQLite (généré automatiquement)
│
└── 📂 frontend/                    # Application React
    ├── 📄 package.json             # Dépendances frontend
    ├── 🐳 Dockerfile               # Image Docker frontend
    ├── 📄 .dockerignore            # Fichiers Docker à ignorer
    ├── 📄 index.html               # Page HTML principale
    ├── 📄 vite.config.js           # Configuration Vite
    ├── 📄 tailwind.config.js       # Configuration Tailwind CSS
    ├── 📄 postcss.config.js        # Configuration PostCSS
    │
    └── 📂 src/                     # Code source frontend
        ├── 📄 main.jsx             # Point d'entrée React
        ├── 📄 App.jsx              # Composant principal
        ├── 📄 index.css            # Styles globaux Tailwind
        │
        ├── 📂 components/          # Composants React
        │   ├── 📄 UserSetup.jsx    # Création de profil utilisateur
        │   ├── 📄 UserInfo.jsx     # Affichage info utilisateur
        │   ├── 📄 WCStatus.jsx     # Statut et actions du WC
        │   └── 📄 History.jsx      # Historique des utilisations
        │
        └── 📂 utils/               # Utilitaires
            ├── 📄 socket.js        # Configuration Socket.io client
            └── 📄 confetti.js      # Effets confettis
```

---

## 📊 Détails des fichiers principaux

### Backend

#### `server.js`
- Serveur Express principal
- Routes API REST
- Configuration Socket.io
- Initialisation de la base de données

#### `database.js`
- Gestion de SQLite avec better-sqlite3
- Fonctions CRUD pour :
  - Utilisateurs (création, récupération)
  - Statut du WC (réservation, libération)
  - Historique des réservations
- Schéma de base de données

#### `socket.js`
- Gestion des événements temps réel
- Messages fun aléatoires
- Timeout automatique (10 minutes)
- Émission des changements de statut

### Frontend

#### `App.jsx`
- Composant racine
- Gestion de l'état global
- Connexion Socket.io
- Orchestration des composants

#### `UserSetup.jsx`
- Formulaire de création de profil
- Choix du pseudo et de l'avatar
- Validation et enregistrement

#### `WCStatus.jsx`
- Affichage du statut actuel
- Boutons de réservation/libération
- Timer et compte à rebours
- Messages fun

#### `History.jsx`
- Affichage des 5 dernières utilisations
- Formatage des durées et dates
- Indicateurs de libération auto

---

## 🔌 Flux de données

```
┌─────────────┐
│  Navigateur │
└──────┬──────┘
       │
       │ HTTP + WebSocket
       ▼
┌─────────────────┐         ┌──────────────┐
│  Frontend React │◄───────►│  Socket.io   │
│   (Port 3000)   │         │   Client     │
└─────────────────┘         └──────┬───────┘
                                   │
                                   │ WebSocket
                                   ▼
┌─────────────────┐         ┌──────────────┐
│ Backend Express │◄───────►│  Socket.io   │
│   (Port 5000)   │         │   Server     │
└────────┬────────┘         └──────────────┘
         │
         │ SQL Queries
         ▼
┌─────────────────┐
│  SQLite DB      │
│ wc-reservation  │
└─────────────────┘
```

---

## 🗄️ Schéma de base de données

### Table `users`
- `id` : INTEGER PRIMARY KEY
- `pseudo` : TEXT UNIQUE
- `avatar` : TEXT
- `created_at` : DATETIME

### Table `wc_status`
- `id` : INTEGER (toujours 1)
- `is_occupied` : BOOLEAN
- `current_user_id` : INTEGER
- `occupied_since` : DATETIME
- `fun_message` : TEXT

### Table `reservations`
- `id` : INTEGER PRIMARY KEY
- `user_id` : INTEGER
- `started_at` : DATETIME
- `ended_at` : DATETIME
- `duration_minutes` : INTEGER
- `auto_released` : BOOLEAN

---

## 🌐 API Routes

### GET `/api/health`
Vérifier que le serveur fonctionne

### POST `/api/users`
Créer un nouvel utilisateur
```json
{
  "pseudo": "SuperDev",
  "avatar": "😎"
}
```

### GET `/api/users/:pseudo`
Récupérer un utilisateur par pseudo

### GET `/api/users`
Récupérer tous les utilisateurs

### GET `/api/wc/status`
Récupérer le statut actuel du WC

### GET `/api/history`
Récupérer l'historique des réservations

---

## 🔌 Événements Socket.io

### Client → Serveur

- `wc:get-status` : Demander le statut actuel
- `wc:reserve` : Réserver le WC
- `wc:release` : Libérer le WC

### Serveur → Client

- `wc:status` : Nouveau statut du WC
- `wc:error` : Erreur
- `wc:reserved` : Confirmation de réservation
- `wc:released` : WC libéré
- `wc:auto-released` : Libération automatique
- `wc:released-success` : Confirmation de libération

---

## 🐳 Conteneurs Docker

### Backend
- Image : `node:18-alpine`
- Port : 5000
- Volume : `./backend/src` et `./backend/database`

### Frontend
- Image : `node:18-alpine`
- Port : 3000
- Volume : `./frontend/src`

### Réseau
- Réseau Docker : `wc-network`
- Communication inter-conteneurs

---

## 📦 Dépendances principales

### Backend
- `express` : Framework web
- `socket.io` : WebSocket temps réel
- `better-sqlite3` : Base de données SQLite
- `cors` : Cross-Origin Resource Sharing

### Frontend
- `react` : Bibliothèque UI
- `socket.io-client` : Client WebSocket
- `canvas-confetti` : Effets confettis
- `tailwindcss` : Framework CSS
- `vite` : Build tool

---

Ce projet est conçu pour être simple, maintenable et fun ! 🚽✨
