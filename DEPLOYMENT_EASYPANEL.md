# 🚀 Déploiement sur Easypanel

Guide complet pour déployer l'application WC Reservation sur Easypanel.

## 📋 Prérequis

- Un serveur avec Easypanel installé
- Accès SSH au serveur
- Git installé (ou possibilité d'uploader les fichiers)
- Domaine ou sous-domaine configuré (optionnel mais recommandé)

---

## 🔧 Méthode 1 : Déploiement via Git (Recommandé)

### Étape 1 : Préparer le dépôt Git

1. **Initialiser Git dans le projet** (si pas déjà fait) :
```bash
cd /Applications/MAMP/htdocs/void/fun
git init
git add .
git commit -m "Initial commit - WC Reservation App"
```

2. **Pousser vers un dépôt Git** (GitHub, GitLab, Gitea, etc.) :
```bash
git remote add origin https://github.com/TON_USERNAME/wc-reservation.git
git push -u origin main
```

### Étape 2 : Créer l'application dans Easypanel

1. **Se connecter à Easypanel** : `http://TON_SERVEUR:3000`

2. **Créer un nouveau projet** :
   - Cliquer sur "New Project"
   - Nom : `wc-reservation`
   - Cliquer sur "Create"

3. **Ajouter l'application** :
   - Dans le projet, cliquer sur "New Service"
   - Choisir "App" (pas "Database")
   - Source : "Git"
   - URL du dépôt : `https://github.com/TON_USERNAME/wc-reservation.git`
   - Branche : `main`

### Étape 3 : Configurer le service Backend

1. **Configuration générale** :
   - Name : `wc-backend`
   - Source : Git repository
   - Build : Docker
   - Dockerfile Path : `backend/Dockerfile.prod`
   - Context Path : `backend`

2. **Variables d'environnement** :
```
NODE_ENV=production
PORT=5000
```

3. **Ports** :
   - Internal Port : `5000`
   - External Port : `5000` (ou laissez Easypanel choisir)
   - Cocher "Enable Public Access"

4. **Volumes** :
   - Path in container : `/app/database`
   - Mount path : `wc-database`

5. **Sauvegarder et déployer**

### Étape 4 : Configurer le service Frontend

1. **Créer un nouveau service dans le même projet** :
   - Cliquer sur "New Service" dans le projet `wc-reservation`
   - Name : `wc-frontend`

2. **Configuration générale** :
   - Source : Git repository (même dépôt)
   - Build : Docker
   - Dockerfile Path : `frontend/Dockerfile.prod`
   - Context Path : `frontend`

3. **Build arguments** :
```
VITE_API_URL=http://TON_SERVEUR:5000
# OU si tu as un domaine pour le backend :
VITE_API_URL=https://wc-api.ton-domaine.com
```

4. **Variables d'environnement** :
```
VITE_API_URL=http://TON_SERVEUR:5000
```

5. **Ports** :
   - Internal Port : `3000`
   - External Port : `80` ou `3000`
   - Cocher "Enable Public Access"

6. **Sauvegarder et déployer**

### Étape 5 : Configuration du domaine (Optionnel)

Si tu veux utiliser des domaines :

1. **Pour le frontend** :
   - Dans le service `wc-frontend`
   - Aller dans "Domains"
   - Ajouter : `wc.ton-domaine.com`
   - Activer SSL (Let's Encrypt)

2. **Pour le backend** :
   - Dans le service `wc-backend`
   - Aller dans "Domains"
   - Ajouter : `wc-api.ton-domaine.com`
   - Activer SSL (Let's Encrypt)

3. **Mettre à jour VITE_API_URL** :
   - Dans le frontend, changer la variable :
   ```
   VITE_API_URL=https://wc-api.ton-domaine.com
   ```
   - Redéployer le frontend

---

## 🔧 Méthode 2 : Déploiement avec Docker Compose

Easypanel supporte aussi le déploiement via Docker Compose.

### Étape 1 : Créer le fichier de configuration

Créer un fichier `.env` pour la production :

```bash
# .env.production
BACKEND_PORT=5000
FRONTEND_PORT=3000
VITE_API_URL=http://TON_SERVEUR_IP:5000
NODE_ENV=production
```

### Étape 2 : Utiliser docker-compose.prod.yml

1. **Uploader le projet sur le serveur** :
```bash
scp -r /Applications/MAMP/htdocs/void/fun user@serveur:/home/user/wc-reservation
```

2. **Se connecter au serveur** :
```bash
ssh user@serveur
cd /home/user/wc-reservation
```

3. **Créer le fichier .env** :
```bash
cp .env.example .env
nano .env  # Modifier les valeurs
```

4. **Créer l'application dans Easypanel** :
   - New Project → `wc-reservation`
   - New Service → "Docker Compose"
   - Coller le contenu de `docker-compose.prod.yml`
   - Ajouter les variables d'environnement

5. **Déployer**

---

## 🔧 Méthode 3 : Build manuel (sans Git)

Si tu n'utilises pas Git :

### Backend

1. **Builder l'image localement** :
```bash
cd backend
docker build -f Dockerfile.prod -t wc-backend:latest .
```

2. **Sauvegarder et transférer** :
```bash
docker save wc-backend:latest | gzip > wc-backend.tar.gz
scp wc-backend.tar.gz user@serveur:/tmp/
```

3. **Sur le serveur** :
```bash
docker load < /tmp/wc-backend.tar.gz
```

4. **Dans Easypanel** :
   - New Service → "Docker Image"
   - Image : `wc-backend:latest`
   - Configuration des ports et volumes comme ci-dessus

### Frontend

Même processus que pour le backend.

---

## ⚙️ Configuration des variables d'environnement

### Variables importantes

#### Backend
```bash
NODE_ENV=production
PORT=5000
CORS_ORIGIN=http://wc.ton-domaine.com  # URL du frontend
```

#### Frontend
```bash
VITE_API_URL=http://wc-api.ton-domaine.com  # URL du backend
# OU
VITE_API_URL=http://IP_SERVEUR:5000
```

### Astuce pour les URLs dynamiques

Si ton serveur est accessible sur différentes IPs ou domaines, tu peux utiliser :

```bash
# Si backend et frontend sur le même serveur
VITE_API_URL=http://$(hostname -I | awk '{print $1}'):5000
```

---

## 🔍 Vérification du déploiement

### 1. Vérifier les services

Dans Easypanel :
- Les deux services doivent être "Running" (vert)
- Pas d'erreurs dans les logs

### 2. Tester le backend

```bash
curl http://TON_SERVEUR:5000/api/health
# Doit retourner : {"status":"ok","message":"Le serveur fonctionne correctement"}
```

### 3. Tester le frontend

Ouvrir dans un navigateur :
```
http://TON_SERVEUR:3000
```

Tu devrais voir l'écran de création de profil.

### 4. Tester le temps réel

1. Créer un utilisateur
2. Réserver le WC
3. Ouvrir un autre onglet/navigateur
4. Vérifier que le statut se met à jour en temps réel

---

## 🐛 Dépannage

### Le frontend ne se connecte pas au backend

**Problème** : "Failed to fetch" ou erreurs CORS

**Solution** :
1. Vérifier que `VITE_API_URL` pointe vers la bonne URL
2. Vérifier que le backend est accessible : `curl http://BACKEND_URL/api/health`
3. Vérifier CORS dans le backend (variable `CORS_ORIGIN`)
4. Redéployer le frontend après modification de `VITE_API_URL`

### Socket.io ne se connecte pas

**Problème** : "WebSocket connection failed"

**Solution** :
1. Vérifier que le port 5000 est ouvert sur le serveur
2. Si derrière un reverse proxy (Nginx), configurer WebSocket :
```nginx
location / {
    proxy_http_version 1.1;
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection "upgrade";
}
```

### Base de données vide après redéploiement

**Problème** : L'historique et les utilisateurs disparaissent

**Solution** :
- S'assurer que le volume `/app/database` est bien configuré
- Dans Easypanel, vérifier que le volume est persistant
- Ne pas supprimer le volume lors des redéploiements

### Erreur de build

**Problème** : Le build échoue avec des erreurs npm

**Solution** :
1. Vérifier les logs de build dans Easypanel
2. S'assurer que les Dockerfile.prod sont utilisés
3. Nettoyer le cache : Dans Easypanel, option "Rebuild without cache"

---

## 📊 Configuration recommandée pour production

### Reverse Proxy (Nginx)

Si tu veux mettre un Nginx devant :

```nginx
# Frontend
server {
    listen 80;
    server_name wc.ton-domaine.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}

# Backend + WebSocket
server {
    listen 80;
    server_name wc-api.ton-domaine.com;

    location / {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

### SSL/HTTPS

Easypanel gère automatiquement SSL avec Let's Encrypt si tu utilises un domaine.

---

## 🔐 Sécurité

### Recommandations

1. **Firewall** : N'exposer que les ports nécessaires
2. **CORS** : Configurer correctement les origines autorisées
3. **HTTPS** : Toujours utiliser SSL en production
4. **Variables d'environnement** : Ne jamais commiter les .env dans Git
5. **Backups** : Sauvegarder régulièrement le volume de la base de données

### Backup de la base de données

```bash
# Copier la base depuis le conteneur
docker cp wc-backend:/app/database/wc-reservation.db ./backup-$(date +%Y%m%d).db

# Ou avec Easypanel, télécharger le volume
```

---

## 📝 Checklist de déploiement

- [ ] Code poussé sur Git (si méthode Git)
- [ ] Variables d'environnement configurées
- [ ] `VITE_API_URL` pointe vers le bon backend
- [ ] Ports ouverts sur le firewall (3000, 5000)
- [ ] Services backend et frontend créés dans Easypanel
- [ ] Volume configuré pour la base de données
- [ ] Domaines configurés (optionnel)
- [ ] SSL activé (optionnel)
- [ ] Backend accessible : `curl http://serveur:5000/api/health`
- [ ] Frontend accessible dans le navigateur
- [ ] Test complet de l'application (création utilisateur, réservation, temps réel)
- [ ] Vérification des logs (pas d'erreurs)

---

## 🎯 Exemple complet de déploiement rapide

```bash
# 1. Sur ta machine locale
cd /Applications/MAMP/htdocs/void/fun
git init
git add .
git commit -m "Deploy to Easypanel"
git remote add origin https://github.com/TON_USERNAME/wc-reservation.git
git push -u origin main

# 2. Dans Easypanel
# - Créer un projet "wc-reservation"
# - Ajouter service "wc-backend" (Git, backend/Dockerfile.prod)
#   - Port : 5000
#   - Volume : /app/database
# - Ajouter service "wc-frontend" (Git, frontend/Dockerfile.prod)
#   - Port : 3000
#   - Build arg : VITE_API_URL=http://IP_SERVEUR:5000

# 3. Tester
curl http://IP_SERVEUR:5000/api/health
# Ouvrir http://IP_SERVEUR:3000 dans le navigateur
```

---

Besoin d'aide ? Vérifie les logs dans Easypanel ou contacte le support ! 🚀
