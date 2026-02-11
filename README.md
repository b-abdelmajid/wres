# 🚽 WC Reservation App - Réservation de Toilettes Fun

Application web interne pour réserver le WC du bureau et éviter les déplacements inutiles !

## 🎯 Fonctionnalités

- ✅ Système d'utilisateurs avec pseudo et avatar (emoji)
- 🚽 Statut du WC en temps réel (disponible/occupé)
- ⏱️ Timeout automatique de 10 minutes
- 💬 Messages fun aléatoires quand le WC est occupé
- 📊 Historique des 5 dernières utilisations
- 🎉 Interface cartoon/startup fun avec animations
- 🔄 Mise à jour instantanée avec Socket.io

## 🛠️ Stack Technique

- **Frontend**: React + Vite + Tailwind CSS
- **Backend**: Node.js + Express + Socket.io
- **Base de données**: SQLite
- **Containerisation**: Docker + Docker Compose

## 🚀 Installation et Lancement

### En développement local

#### Avec Docker (recommandé)

1. Assurez-vous d'avoir Docker et Docker Compose installés

2. Lancez l'application :
```bash
docker-compose up --build
```

3. Accédez à l'application :
- Frontend : http://localhost:3000
- Backend : http://localhost:5001

### Sans Docker

#### Backend
```bash
cd backend
npm install
npm run dev
```

#### Frontend
```bash
cd frontend
npm install
npm run dev
```

## 📁 Structure du Projet

```
fun/
├── backend/          # API Node.js + Express + Socket.io
│   ├── src/
│   │   ├── server.js    # Point d'entrée
│   │   ├── database.js  # Gestion SQLite
│   │   └── socket.js    # Logique Socket.io
│   ├── package.json
│   └── Dockerfile
├── frontend/         # Application React
│   ├── src/
│   │   ├── components/  # Composants React
│   │   ├── App.jsx      # Composant principal
│   │   └── main.jsx     # Point d'entrée
│   ├── package.json
│   ├── Dockerfile
│   └── tailwind.config.js
├── docker-compose.yml
└── README.md
```

## 🎮 Utilisation

1. **Première visite** : Créez votre profil avec un pseudo et choisissez un emoji avatar
2. **Réserver le WC** : Cliquez sur "🚽 Réserver" si disponible
3. **Libérer le WC** : Cliquez sur "✅ Libérer" quand vous avez terminé
4. **Timeout** : Le WC se libère automatiquement après 10 minutes

## 🎨 Messages Fun

L'application affiche des messages aléatoires quand le WC est occupé :
- "Fais comme chez toi 🧻"
- "Réunion stratégique en cours 🚀"
- "Moment de réflexion intense 🤔"
- "Ça médite sévère là-dedans 🧘"
- "Patience est mère de toutes les vertus 😌"

## 🔧 Configuration

- **Timeout WC** : 10 minutes (configurable dans `backend/src/socket.js`)
- **Port Backend** : 5001 (mappé depuis le port interne 5000 du conteneur)
- **Port Frontend** : 3000

**Note :** Le port 5000 est utilisé par AirPlay sur macOS, c'est pourquoi nous utilisons le port 5001.

## 🌐 Déploiement en production

### Déploiement sur Easypanel

L'application est prête pour être déployée sur Easypanel ou tout autre serveur Docker.

**Guide rapide** :

1. **Configuration automatique** :
```bash
./deploy.sh
```

2. **Déploiement avec Docker Compose** :
```bash
docker-compose -f docker-compose.prod.yml up -d
```

3. **Sur Easypanel** :
   - Utiliser les Dockerfile.prod pour chaque service
   - Configurer les variables d'environnement
   - Voir le guide détaillé : [DEPLOYMENT_EASYPANEL.md](DEPLOYMENT_EASYPANEL.md)

**Fichiers de configuration** :
- `docker-compose.prod.yml` - Configuration production
- `backend/Dockerfile.prod` - Image backend optimisée
- `frontend/Dockerfile.prod` - Image frontend optimisée avec build
- `.env.example` - Template des variables d'environnement
- `DEPLOYMENT_EASYPANEL.md` - Guide complet de déploiement

### Variables d'environnement importantes

```bash
# Backend
PORT=5000
NODE_ENV=production

# Frontend
VITE_API_URL=http://votre-serveur:5000  # URL du backend
```

## 📝 Notes

- Application simple et légère
- Pas d'authentification complexe (parfait pour usage interne)
- Base de données locale SQLite
- Mise à jour en temps réel pour tous les utilisateurs
- Prêt pour la production avec Docker

---

Fait avec ❤️ pour éviter les déplacements inutiles ! 🚽
