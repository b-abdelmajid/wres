# 🚽 WC Reservation - Instructions de lancement

## Prérequis

- Docker Desktop installé et démarré
- OU Node.js 18+ (si lancement sans Docker)

---

## 🐳 Option 1 : Lancement avec Docker (RECOMMANDÉ)

### Première utilisation

1. Ouvrir un terminal dans le dossier `fun/`

2. Construire et lancer les conteneurs :
```bash
docker-compose up --build
```

3. Attendre que les conteneurs démarrent (environ 1-2 minutes)

4. Accéder à l'application :
   - **Frontend** : http://localhost:3000
   - **Backend API** : http://localhost:5001
   
   > **Note** : Le port 5001 est utilisé car le port 5000 est déjà utilisé par AirPlay sur macOS.

### Utilisations suivantes

```bash
# Démarrer les conteneurs existants
docker-compose up

# Ou en arrière-plan
docker-compose up -d
```

### Arrêter l'application

```bash
# Avec Ctrl+C si en mode normal
# OU
docker-compose down
```

### Voir les logs

```bash
# Tous les services
docker-compose logs -f

# Seulement le backend
docker-compose logs -f backend

# Seulement le frontend
docker-compose logs -f frontend
```

### Nettoyer complètement

```bash
# Supprimer les conteneurs, images et volumes
docker-compose down -v --rmi all
```

---

## 💻 Option 2 : Lancement sans Docker

### Backend

1. Aller dans le dossier backend :
```bash
cd backend
```

2. Installer les dépendances :
```bash
npm install
```

3. Lancer le serveur en mode développement :
```bash
npm run dev
```

Le backend sera accessible sur http://localhost:5000

### Frontend

1. Ouvrir un **nouveau terminal**

2. Aller dans le dossier frontend :
```bash
cd frontend
```

3. Installer les dépendances :
```bash
npm install
```

4. Lancer l'application React :
```bash
npm run dev
```

Le frontend sera accessible sur http://localhost:3000

---

## 🎮 Utilisation de l'application

### Première connexion

1. Ouvrir http://localhost:3000 dans ton navigateur
2. Créer ton profil :
   - Choisir un pseudo (ex: "SuperDev")
   - Sélectionner un avatar emoji
   - Cliquer sur "C'est parti !"

### Réserver le WC

1. Si le WC est disponible (vert), cliquer sur "🚽 Réserver"
2. Le WC devient occupé pour tous les autres utilisateurs
3. Un timer de 10 minutes démarre

### Libérer le WC

1. Quand tu as terminé, cliquer sur "✅ Libérer"
2. Le WC redevient disponible pour tout le monde
3. Des confettis apparaissent pour célébrer ! 🎉

### Libération automatique

- Si tu oublies de libérer, le WC se libère automatiquement après 10 minutes
- Un message s'affiche pour informer tous les utilisateurs

---

## 📊 Fonctionnalités

- ✅ Voir le statut du WC en temps réel
- ✅ Messages fun aléatoires quand occupé
- ✅ Timer avec compte à rebours
- ✅ Historique des 5 dernières utilisations
- ✅ Confettis à la libération
- ✅ Mise à jour instantanée pour tous les utilisateurs connectés

---

## 🔧 Configuration

### Modifier le timeout (durée de réservation)

Éditer `backend/src/socket.js` :
```javascript
// Ligne 18 - Modifier la valeur (en millisecondes)
const AUTO_RELEASE_TIMEOUT = 10 * 60 * 1000; // 10 minutes
```

### Ajouter des messages fun

Éditer `backend/src/socket.js` :
```javascript
// Lignes 8-17 - Ajouter des messages dans le tableau
const FUN_MESSAGES = [
  "Ton nouveau message ici 🎉",
  // ... autres messages
];
```

### Ajouter des avatars

Éditer `frontend/src/components/UserSetup.jsx` :
```javascript
// Ligne 4 - Ajouter des emojis
const AVATARS = [
  '😀', '😎', 'ton_emoji', // ...
];
```

---

## 🐛 Dépannage

### Port déjà utilisé

Si les ports 3000 ou 5000 sont déjà utilisés :

**Avec Docker :**
Éditer `docker-compose.yml` et changer les ports :
```yaml
ports:
  - "3001:3000"  # Frontend
  - "5001:5000"  # Backend
```

**Sans Docker :**
- Backend : `PORT=5001 npm run dev`
- Frontend : Éditer `vite.config.js` et changer le port

### Base de données corrompue

Supprimer le fichier de base de données :
```bash
rm backend/database/wc-reservation.db
```

La base se recréera au prochain lancement.

### Problèmes de connexion Socket.io

1. Vérifier que le backend est bien démarré
2. Vérifier les logs : `docker-compose logs backend`
3. Rafraîchir la page du navigateur

---

## 📝 Notes importantes

- Les données sont stockées localement dans SQLite
- Pas de synchronisation entre différentes bases
- Parfait pour usage en réseau local du bureau
- Pas d'authentification sécurisée (usage interne uniquement)

---

## ❤️ Support

En cas de problème :
1. Vérifier les logs : `docker-compose logs -f`
2. Redémarrer les conteneurs : `docker-compose restart`
3. Reconstruction complète : `docker-compose up --build --force-recreate`

Bon amusement ! 🚽✨
