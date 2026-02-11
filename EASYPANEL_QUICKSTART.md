# 🚀 Déploiement Rapide sur Easypanel

Guide ultra-rapide pour déployer en 5 minutes.

## Option 1 : Via Interface Easypanel (Le plus simple)

### 1. Préparer les variables

Avant de commencer, note ces informations :
- **IP de ton serveur** : `_____._____._____._____ `
- **Port backend** : `5000` (ou celui que tu veux)
- **Port frontend** : `3000` (ou celui que tu veux)

### 2. Backend

1. **Dans Easypanel** :
   - New Project → `wc-reservation`
   - New Service → "Docker Image" ou "Git"

2. **Si Git** :
   - Repository : URL de ton Git
   - Branch : `main`
   - Dockerfile : `backend/Dockerfile.prod`
   - Build context : `backend/`

3. **Si Docker manuel** :
   - Sur ta machine :
   ```bash
   cd backend
   docker build -f Dockerfile.prod -t wc-backend .
   docker save wc-backend | gzip > wc-backend.tar.gz
   ```
   - Upload sur le serveur et load l'image

4. **Configuration** :
   - Port : `5000` → `5000`
   - Volume : `/app/database` → nommer le volume `wc-database`
   - Env : `NODE_ENV=production`

5. **Deploy** ✅

### 3. Frontend

1. **Dans le même projet** :
   - New Service

2. **Configuration** :
   - Dockerfile : `frontend/Dockerfile.prod`
   - Build context : `frontend/`
   - **Build Args** : `VITE_API_URL=http://TON_IP_SERVEUR:5000`

3. **Configuration** :
   - Port : `3000` → `3000`
   - Env : `VITE_API_URL=http://TON_IP_SERVEUR:5000`

4. **Deploy** ✅

### 4. Tester

```bash
# Backend
curl http://TON_IP_SERVEUR:5000/api/health

# Frontend
# Ouvrir dans le navigateur : http://TON_IP_SERVEUR:3000
```

---

## Option 2 : Avec le script automatique

Sur ta machine locale :

```bash
cd /Applications/MAMP/htdocs/void/fun
./deploy.sh
```

Suis les instructions interactives pour générer la configuration.

---

## Option 3 : Docker Compose (Si Easypanel le supporte)

1. **Créer `.env` sur le serveur** :
```bash
BACKEND_PORT=5000
FRONTEND_PORT=3000
VITE_API_URL=http://TON_IP:5000
NODE_ENV=production
```

2. **Uploader le projet** :
```bash
scp -r /Applications/MAMP/htdocs/void/fun user@serveur:/home/user/wc-app
```

3. **Dans Easypanel** :
   - New Service → Docker Compose
   - Coller le contenu de `docker-compose.prod.yml`
   - Configurer les variables d'environnement

---

## ⚡ Checklist Express

- [ ] Backend déployé et accessible sur le port 5000
- [ ] Frontend déployé sur le port 3000
- [ ] `VITE_API_URL` dans le frontend pointe vers le backend
- [ ] Volume configuré pour `/app/database` (persistance)
- [ ] Test : `curl http://serveur:5000/api/health` retourne OK
- [ ] Test : Ouvrir `http://serveur:3000` dans le navigateur
- [ ] Test : Créer un utilisateur et réserver le WC
- [ ] Test : Ouvrir un 2ème onglet, vérifier le temps réel

---

## 🔧 Troubleshooting Express

### "Failed to fetch" dans le frontend

→ Vérifier que `VITE_API_URL` est correct et accessible :
```bash
# Depuis le navigateur, ouvrir la console (F12)
# Vérifier l'URL appelée dans l'onglet Network
```

### Socket.io ne se connecte pas

→ Vérifier que le port 5000 est bien ouvert et accessible

### La base de données se réinitialise

→ Vérifier que le volume `/app/database` est bien configuré comme persistant

---

## 📱 URLs finales

Après déploiement :
- **Frontend** : `http://TON_SERVEUR:3000`
- **Backend API** : `http://TON_SERVEUR:5000`
- **Health Check** : `http://TON_SERVEUR:5000/api/health`

---

## 🎯 Prochaines étapes (optionnel)

1. **Configurer un nom de domaine** :
   - `wc.ton-domaine.com` → Frontend
   - `wc-api.ton-domaine.com` → Backend

2. **Activer SSL** :
   - Dans Easypanel, activer Let's Encrypt
   - Mettre à jour `VITE_API_URL=https://wc-api.ton-domaine.com`

3. **Configurer un reverse proxy** :
   - Nginx ou Caddy pour gérer SSL et les domaines
   - Voir `DEPLOYMENT_EASYPANEL.md` pour les configs

---

Besoin du guide complet ? → **DEPLOYMENT_EASYPANEL.md**

Bon déploiement ! 🚽✨
