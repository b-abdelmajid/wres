# 🧪 Guide de Test - WC Reservation

## ✅ Vérification rapide

L'application est maintenant lancée ! Voici comment tester toutes les fonctionnalités :

### 1. Accès à l'application

Ouvre ton navigateur et va sur : **http://localhost:3000**

Tu devrais voir l'écran de création de profil avec :
- Un gros emoji WC qui flotte
- Un champ pour ton pseudo
- Une grille de 20 avatars emoji à choisir

### 2. Créer ton profil

1. Entre un pseudo (ex: "SuperDev")
2. Clique sur un emoji pour le sélectionner (il va s'agrandir et avoir un fond bleu)
3. Clique sur "✨ C'est parti !"

→ Tu devrais être redirigé vers l'écran principal

### 3. Tester la réservation

#### Écran principal :
- Tu vois ton profil en haut (avatar + pseudo)
- Le statut du WC (disponible en vert avec un gros emoji qui flotte)
- Un bouton "🚽 Réserver maintenant"
- Un historique vide

#### Réserver le WC :
1. Clique sur "🚽 Réserver maintenant"
2. L'écran change instantanément :
   - Le WC devient occupé (animé)
   - Un message fun apparaît (ex: "Réunion stratégique en cours 🚀")
   - Un timer démarre avec deux compteurs :
     - Temps écoulé
     - Temps restant (10 minutes)
   - Une barre de progression se remplit
   - Le bouton devient "✅ Libérer le WC"

### 4. Tester le temps réel

Ouvre un **nouvel onglet** (ou une fenêtre de navigation privée) :

1. Va sur http://localhost:3000
2. Crée un **autre utilisateur** (pseudo différent, autre avatar)
3. Tu devrais voir que le WC est occupé par ton premier utilisateur
4. Tu vois :
   - L'avatar et le pseudo du premier utilisateur
   - Le message fun
   - Le temps écoulé
   - Le compte à rebours pour la libération automatique
   - Pas de bouton "Libérer" (car ce n'est pas toi qui as réservé)

**Retourne dans le premier onglet** et libère le WC :
- Clique sur "✅ Libérer"
- 🎉 Des confettis apparaissent !
- Le WC redevient disponible

**Dans le deuxième onglet** :
- L'écran se met à jour automatiquement (temps réel !)
- Le WC est maintenant disponible
- Une notification apparaît en haut

### 5. Tester l'historique

Après avoir libéré le WC :
- Regarde en bas de la page
- Tu vois l'historique avec :
  - Ton avatar et pseudo
  - L'heure de la visite ("À l'instant" ou "Il y a X min")
  - La durée de l'occupation
- Fais plusieurs réservations/libérations
- L'historique garde les 5 dernières utilisations

### 6. Tester le timeout automatique

1. Réserve le WC
2. Attends 10 minutes (ou modifie le timeout dans le code)
3. Le WC se libère automatiquement
4. Une notification spéciale apparaît : "Le WC a été libéré automatiquement (timeout) ⏰"
5. Dans l'historique, tu verras "⏰ Auto" à côté de la durée

### 7. Tester la persistance

1. Rafraîchis la page (F5)
2. Tu es toujours connecté avec ton profil (stocké dans localStorage)
3. Le statut du WC est toujours correct (temps réel via Socket.io)

### 8. Se déconnecter

1. Clique sur "Se déconnecter" en haut à droite
2. Tu retournes à l'écran de création de profil
3. Tu peux créer un nouveau profil ou recréer l'ancien

---

## 🎨 Éléments visuels à vérifier

- [ ] Animations fluides (emoji qui flotte, pulsation du WC occupé)
- [ ] Barre de progression qui se remplit progressivement
- [ ] Transitions smooth entre les états
- [ ] Confettis à la libération (canon de confettis des deux côtés)
- [ ] Notifications toast en haut de l'écran
- [ ] Indicateur de connexion temps réel (petit point vert/rouge)
- [ ] Responsive design (teste en réduisant la fenêtre)

---

## 🐛 Vérifications techniques

### Backend (http://localhost:5001)

Teste l'API directement :

```bash
# Vérifier que le serveur fonctionne
curl http://localhost:5001/api/health

# Récupérer le statut du WC
curl http://localhost:5001/api/wc/status

# Voir l'historique
curl http://localhost:5001/api/history

# Lister les utilisateurs
curl http://localhost:5001/api/users
```

### Frontend

Ouvre la console du navigateur (F12) :
- Tu devrais voir : "✅ Connecté au serveur Socket.io"
- Pas d'erreur rouge
- Les requêtes réseau fonctionnent (onglet Network)

### Docker

Vérifie que les conteneurs tournent :

```bash
docker-compose ps
```

Tu devrais voir :
- `fun-backend-1` sur le port 5001
- `fun-frontend-1` sur le port 3000
- Les deux avec le statut "Up"

Voir les logs en temps réel :

```bash
# Tous les logs
docker-compose logs -f

# Seulement le backend
docker-compose logs -f backend

# Seulement le frontend
docker-compose logs -f frontend
```

---

## 🎉 Fonctionnalités bonus testées

- ✅ Messages fun aléatoires (différents à chaque réservation)
- ✅ Confettis à la libération
- ✅ Mise à jour en temps réel pour tous les utilisateurs
- ✅ Timer avec compte à rebours
- ✅ Libération automatique après 10 minutes
- ✅ Historique des 5 dernières utilisations
- ✅ Persistance de l'utilisateur dans localStorage
- ✅ Interface cartoon/startup fun
- ✅ Responsive design

---

## 🚨 En cas de problème

### "Failed to fetch" ou erreur de connexion

1. Vérifie que les deux conteneurs sont UP : `docker-compose ps`
2. Teste le backend : `curl http://localhost:5001/api/health`
3. Redémarre tout : `docker-compose restart`

### Le WC ne se met pas à jour en temps réel

1. Vérifie la console du navigateur (F12)
2. Tu devrais voir "✅ Connecté au serveur Socket.io"
3. Si tu vois des erreurs WebSocket, redémarre : `docker-compose restart`

### L'historique ne s'affiche pas

1. Libère au moins une fois le WC
2. Rafraîchis la page
3. Vérifie les logs : `docker-compose logs backend`

### Les confettis n'apparaissent pas

1. Vérifie la console du navigateur (pas d'erreur JavaScript)
2. Assure-toi que la bibliothèque canvas-confetti est bien chargée
3. Essaie dans un autre navigateur

---

## 📊 Résultats attendus

Après ces tests, tu devrais avoir :
- ✅ Une application qui fonctionne en temps réel
- ✅ Plusieurs utilisateurs dans la base de données
- ✅ Un historique de plusieurs utilisations
- ✅ Une expérience utilisateur fluide et fun

Bon test ! 🚽✨
