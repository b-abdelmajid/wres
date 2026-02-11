# Changelog

## Version 1.0.0 (Février 2026)

### Fonctionnalités initiales

- ✅ Système d'utilisateurs avec pseudo et avatar emoji
- ✅ Statut du WC en temps réel (disponible/occupé)
- ✅ Réservation et libération du WC
- ✅ Timeout automatique de 10 minutes
- ✅ Messages fun aléatoires pendant l'occupation
- ✅ Historique des 5 dernières utilisations
- ✅ Timer avec compte à rebours
- ✅ Mise à jour instantanée via Socket.io
- ✅ Confettis lors de la libération
- ✅ Interface moderne et fun avec Tailwind CSS
- ✅ Dockerisation complète de l'application

### Stack technique

- Frontend : React 18 + Vite + Tailwind CSS
- Backend : Node.js + Express + Socket.io
- Base de données : SQLite avec better-sqlite3
- Containerisation : Docker + Docker Compose

### Animations et UX

- Animations fluides et transitions
- Interface responsive
- Indicateur de connexion en temps réel
- Notifications toast
- Effets confettis

---

## Idées pour versions futures (TODO)

### v1.1.0 - Améliorations UX
- [ ] Son de notification discret quand le WC se libère
- [ ] Mode sombre
- [ ] Statistiques personnelles étendues
- [ ] Badges et achievements fun

### v1.2.0 - Multi-WC
- [ ] Support de plusieurs WC
- [ ] Système de réservation par WC
- [ ] Vue d'ensemble de tous les WC

### v1.3.0 - Fonctionnalités sociales
- [ ] Commentaires/notes après utilisation
- [ ] Système de notation
- [ ] Classement mensuel (qui passe le plus de temps, etc.)

### v1.4.0 - Administration
- [ ] Panel admin pour gérer les utilisateurs
- [ ] Statistiques globales
- [ ] Configuration du timeout via interface

### v2.0.0 - Version Pro
- [ ] Authentification sécurisée
- [ ] Multi-sites (différents bureaux)
- [ ] Application mobile
- [ ] Notifications push
