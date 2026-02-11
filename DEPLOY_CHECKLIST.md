# ✅ Checklist de Déploiement - WC Reservation

## 📦 Fichiers de déploiement créés

Voici tous les fichiers préparés pour le déploiement sur Easypanel :

### Configuration Docker Production
- ✅ `docker-compose.prod.yml` - Configuration Docker Compose pour production
- ✅ `backend/Dockerfile.prod` - Image backend optimisée
- ✅ `frontend/Dockerfile.prod` - Image frontend optimisée avec build
- ✅ `.env.example` - Template des variables d'environnement
- ✅ `.dockerignore` - Fichiers à exclure du build

### Scripts et Outils
- ✅ `deploy.sh` - Script interactif de configuration
- ✅ `start.sh` - Script de lancement rapide (dev)

### Documentation
- ✅ `README.md` - Documentation principale (mise à jour)
- ✅ `DEPLOYMENT_EASYPANEL.md` - Guide complet de déploiement (détaillé)
- ✅ `EASYPANEL_QUICKSTART.md` - Guide rapide 5 minutes
- ✅ `DEPLOY_CHECKLIST.md` - Ce fichier
- ✅ `INSTRUCTIONS.md` - Instructions de lancement
- ✅ `TEST.md` - Guide de test complet
- ✅ `STRUCTURE.md` - Architecture du projet

---

## 🚀 Déploiement Rapide (3 options)

### Option A : Script Automatique (Recommandé pour débuter)

```bash
# 1. Exécuter le script de configuration
./deploy.sh

# 2. Suivre les instructions interactives
# Il va créer un fichier .env avec tes paramètres

# 3. Déployer avec Docker Compose
docker-compose -f docker-compose.prod.yml up -d
```

### Option B : Easypanel avec Git

1. **Push ton code sur Git** :
```bash
git init
git add .
git commit -m "Ready for deployment"
git remote add origin https://github.com/TON_USERNAME/wc-reservation.git
git push -u origin main
```

2. **Dans Easypanel** :
   - Créer un projet `wc-reservation`
   - Ajouter service Backend :
     - Source : Git
     - Dockerfile : `backend/Dockerfile.prod`
     - Context : `backend/`
     - Port : 5000
     - Volume : `/app/database`
   - Ajouter service Frontend :
     - Source : Git
     - Dockerfile : `frontend/Dockerfile.prod`
     - Context : `frontend/`
     - Build Args : `VITE_API_URL=http://TON_IP:5000`
     - Port : 3000

3. **Déployer** !

### Option C : Upload Manuel

1. **Uploader le projet sur le serveur** :
```bash
scp -r /Applications/MAMP/htdocs/void/fun user@serveur:/home/user/wc-app
```

2. **Sur le serveur** :
```bash
cd /home/user/wc-app
./deploy.sh
docker-compose -f docker-compose.prod.yml up -d
```

---

## 📋 Checklist Pré-Déploiement

### Préparation
- [ ] Code testé en local (tout fonctionne ?)
- [ ] Variables d'environnement préparées
- [ ] IP ou domaine du serveur connu
- [ ] Accès au serveur (SSH ou Easypanel)
- [ ] Docker installé sur le serveur
- [ ] Ports disponibles (3000, 5000 ou autres)

### Configuration
- [ ] Fichier `.env` créé (ou variables dans Easypanel)
- [ ] `VITE_API_URL` configuré avec la bonne URL backend
- [ ] Ports configurés dans docker-compose.prod.yml
- [ ] Volume pour la base de données configuré

### Sécurité (optionnel mais recommandé)
- [ ] Firewall configuré (ports nécessaires ouverts)
- [ ] CORS configuré si domaines différents
- [ ] SSL/HTTPS configuré (Let's Encrypt via Easypanel)
- [ ] Backup de la base de données prévu

---

## 🔧 Variables d'Environnement Requises

### Backend
```bash
NODE_ENV=production
PORT=5000
CORS_ORIGIN=http://ton-frontend.com  # Optionnel
```

### Frontend
```bash
VITE_API_URL=http://ton-serveur:5000
# OU
VITE_API_URL=https://wc-api.ton-domaine.com
```

### Docker Compose
```bash
BACKEND_PORT=5000
FRONTEND_PORT=3000
VITE_API_URL=http://ton-serveur:5000
NODE_ENV=production
```

---

## 🧪 Checklist Post-Déploiement

### Vérifications Techniques
- [ ] Backend démarré sans erreur
  ```bash
  docker logs wc-backend
  ```
- [ ] Frontend démarré sans erreur
  ```bash
  docker logs wc-frontend
  ```
- [ ] Backend répond au health check
  ```bash
  curl http://SERVEUR:5000/api/health
  # Doit retourner : {"status":"ok",...}
  ```
- [ ] Frontend accessible dans le navigateur
  ```bash
  open http://SERVEUR:3000
  ```
- [ ] Volume de la base de données monté
  ```bash
  docker volume ls | grep wc-database
  ```

### Tests Fonctionnels
- [ ] Page de création de profil s'affiche
- [ ] Possibilité de créer un utilisateur
- [ ] Statut du WC s'affiche (disponible)
- [ ] Possibilité de réserver le WC
- [ ] Timer fonctionne (compte à rebours)
- [ ] Possibilité de libérer le WC
- [ ] Confettis apparaissent à la libération
- [ ] Historique s'affiche
- [ ] Console du navigateur sans erreurs (F12)

### Tests Temps Réel
- [ ] Ouvrir 2 onglets/navigateurs
- [ ] Créer 2 utilisateurs différents
- [ ] Réserver avec utilisateur 1
- [ ] Vérifier que utilisateur 2 voit l'occupation en temps réel
- [ ] Libérer avec utilisateur 1
- [ ] Vérifier que utilisateur 2 voit la libération instantanément
- [ ] Vérifier les confettis sur les 2 écrans

### Tests de Persistance
- [ ] Redémarrer les conteneurs
  ```bash
  docker-compose -f docker-compose.prod.yml restart
  ```
- [ ] Vérifier que les utilisateurs sont toujours là
- [ ] Vérifier que l'historique est conservé
- [ ] Vérifier que le statut du WC est correct

---

## 📊 Monitoring Post-Déploiement

### Voir les logs en temps réel
```bash
# Tous les logs
docker-compose -f docker-compose.prod.yml logs -f

# Seulement backend
docker logs -f wc-backend

# Seulement frontend
docker logs -f wc-frontend
```

### Vérifier l'état des conteneurs
```bash
docker-compose -f docker-compose.prod.yml ps
```

### Vérifier les ressources
```bash
docker stats wc-backend wc-frontend
```

---

## 🐛 Troubleshooting Rapide

### Problème : "Failed to fetch"
**Cause** : Frontend ne peut pas joindre le backend

**Solutions** :
1. Vérifier que `VITE_API_URL` est correct
2. Tester : `curl http://BACKEND_URL/api/health`
3. Vérifier CORS dans backend
4. Redéployer le frontend après modification

### Problème : WebSocket ne se connecte pas
**Cause** : Socket.io bloqué

**Solutions** :
1. Vérifier que le port backend est accessible
2. Si derrière reverse proxy, configurer WebSocket
3. Vérifier les logs : `docker logs wc-backend`

### Problème : Base de données vide après redémarrage
**Cause** : Volume non persistant

**Solutions** :
1. Vérifier le volume : `docker volume ls`
2. S'assurer que le volume est bien configuré dans docker-compose.prod.yml
3. Ne pas supprimer le volume lors des redéploiements

### Problème : Erreur de build
**Cause** : Dépendances ou configuration incorrecte

**Solutions** :
1. Vérifier les logs de build
2. Rebuild sans cache : `docker-compose build --no-cache`
3. Vérifier que les Dockerfile.prod sont utilisés

---

## 🎯 URLs Finales

Après un déploiement réussi :

### Avec IP
- Frontend : `http://IP_SERVEUR:3000`
- Backend : `http://IP_SERVEUR:5000`
- Health Check : `http://IP_SERVEUR:5000/api/health`

### Avec Domaine (si configuré)
- Frontend : `https://wc.ton-domaine.com`
- Backend : `https://wc-api.ton-domaine.com`
- Health Check : `https://wc-api.ton-domaine.com/api/health`

---

## 📚 Documentation Disponible

Selon tes besoins, consulte :

1. **EASYPANEL_QUICKSTART.md** - Démarrage ultra-rapide (5 min)
2. **DEPLOYMENT_EASYPANEL.md** - Guide complet et détaillé
3. **TEST.md** - Guide de test complet de l'application
4. **README.md** - Documentation générale du projet
5. **INSTRUCTIONS.md** - Instructions de lancement en dev
6. **STRUCTURE.md** - Architecture et structure du code

---

## ✨ Optimisations Post-Déploiement (Optionnel)

### Performance
- [ ] Configurer un CDN pour les assets statiques
- [ ] Activer la compression Gzip/Brotli
- [ ] Configurer le cache navigateur

### Sécurité
- [ ] Configurer HTTPS avec Let's Encrypt
- [ ] Limiter les origins CORS
- [ ] Configurer rate limiting sur l'API
- [ ] Mettre en place des backups automatiques

### Monitoring
- [ ] Configurer des alertes (uptime monitoring)
- [ ] Logger les erreurs (Sentry, LogRocket, etc.)
- [ ] Monitorer les performances

---

## 🎉 Félicitations !

Si toutes les cases sont cochées, ton application WC Reservation est déployée avec succès ! 🚽✨

**Besoin d'aide ?**
- Consulte les guides détaillés
- Vérifie les logs : `docker-compose logs -f`
- Teste avec : `TEST.md`

---

**Version** : 1.0.0  
**Dernière mise à jour** : Février 2026
