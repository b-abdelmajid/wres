#!/bin/bash

# Script de déploiement pour WC Reservation App
# Facilite la configuration pour Easypanel ou autre plateforme Docker

set -e

echo "🚽 WC Reservation - Configuration pour déploiement"
echo "=================================================="
echo ""

# Vérifier si .env existe
if [ -f .env ]; then
    echo "⚠️  Un fichier .env existe déjà."
    read -p "Voulez-vous le remplacer ? (o/N) : " replace
    if [[ ! $replace =~ ^[OoYy]$ ]]; then
        echo "❌ Déploiement annulé. Utilisez le fichier .env existant."
        exit 0
    fi
fi

echo "📝 Configuration des variables d'environnement"
echo ""

# Demander l'URL du backend
read -p "URL du backend (ex: http://192.168.1.100:5000 ou https://wc-api.domaine.com) : " backend_url
if [ -z "$backend_url" ]; then
    echo "❌ URL du backend requise"
    exit 1
fi

# Demander le port du backend (optionnel)
read -p "Port du backend (défaut: 5000) : " backend_port
backend_port=${backend_port:-5000}

# Demander le port du frontend (optionnel)
read -p "Port du frontend (défaut: 3000) : " frontend_port
frontend_port=${frontend_port:-3000}

# Demander l'environnement
read -p "Environnement (production/development, défaut: production) : " node_env
node_env=${node_env:-production}

# Créer le fichier .env
cat > .env << EOF
# Configuration générée le $(date)

# Backend
PORT=5000
NODE_ENV=${node_env}
BACKEND_PORT=${backend_port}

# Frontend
FRONTEND_PORT=${frontend_port}
VITE_API_URL=${backend_url}

# CORS (si nécessaire, ajustez l'origine du frontend)
# CORS_ORIGIN=http://votre-frontend.com

# Base de données
DATABASE_PATH=/app/database/wc-reservation.db
EOF

echo ""
echo "✅ Fichier .env créé avec succès !"
echo ""
echo "📋 Configuration :"
echo "   - Backend URL : ${backend_url}"
echo "   - Backend Port : ${backend_port}"
echo "   - Frontend Port : ${frontend_port}"
echo "   - Environnement : ${node_env}"
echo ""

# Proposer de builder les images
read -p "Voulez-vous builder les images Docker pour la production ? (o/N) : " build_images

if [[ $build_images =~ ^[OoYy]$ ]]; then
    echo ""
    echo "🔨 Building des images Docker..."
    echo ""
    
    # Backend
    echo "📦 Building backend..."
    cd backend
    docker build -f Dockerfile.prod -t wc-backend:latest .
    cd ..
    echo "✅ Backend image créée : wc-backend:latest"
    echo ""
    
    # Frontend
    echo "📦 Building frontend..."
    cd frontend
    docker build -f Dockerfile.prod --build-arg VITE_API_URL=${backend_url} -t wc-frontend:latest .
    cd ..
    echo "✅ Frontend image créée : wc-frontend:latest"
    echo ""
fi

echo "🎯 Prochaines étapes :"
echo ""
echo "1. Pour déployer avec Docker Compose (en production) :"
echo "   docker-compose -f docker-compose.prod.yml --env-file .env up -d"
echo ""
echo "2. Pour déployer sur Easypanel :"
echo "   - Consultez le guide : DEPLOYMENT_EASYPANEL.md"
echo "   - Utilisez les images : wc-backend:latest et wc-frontend:latest"
echo "   - Ou utilisez le docker-compose.prod.yml directement"
echo ""
echo "3. Tester le déploiement :"
echo "   Backend : curl ${backend_url}/api/health"
echo "   Frontend : Ouvrir http://VOTRE_SERVEUR:${frontend_port} dans le navigateur"
echo ""
echo "📚 Documentation complète : DEPLOYMENT_EASYPANEL.md"
echo ""
echo "Bon déploiement ! 🚀"
