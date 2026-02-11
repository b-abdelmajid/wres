#!/bin/bash

# Script de lancement rapide pour WC Reservation App
# Ce script vérifie et lance l'application avec Docker

set -e

echo "🚽 WC Reservation App - Lancement"
echo "================================="
echo ""

# Vérifier si Docker est installé
if ! command -v docker &> /dev/null; then
    echo "❌ Docker n'est pas installé."
    echo "📥 Installe Docker Desktop depuis : https://www.docker.com/products/docker-desktop"
    exit 1
fi

# Vérifier si Docker est en cours d'exécution
if ! docker info &> /dev/null; then
    echo "❌ Docker n'est pas démarré."
    echo "🔄 Démarre Docker Desktop et relance ce script."
    exit 1
fi

echo "✅ Docker est installé et démarré"
echo ""

# Vérifier si docker-compose est installé
if ! command -v docker-compose &> /dev/null; then
    echo "❌ Docker Compose n'est pas installé."
    exit 1
fi

echo "✅ Docker Compose est disponible"
echo ""

# Demander si on veut rebuild
echo "🔨 Veux-tu reconstruire les images ? (recommandé la première fois)"
read -p "   (o/N) : " rebuild
echo ""

if [[ $rebuild =~ ^[OoYy]$ ]]; then
    echo "🔨 Construction des images Docker..."
    docker-compose build
    echo ""
fi

# Lancer les conteneurs
echo "🚀 Démarrage de l'application..."
docker-compose up -d

# Attendre que les services démarrent
echo ""
echo "⏳ Attente du démarrage des services..."
sleep 5

# Vérifier que les conteneurs sont lancés
if docker-compose ps | grep -q "Up"; then
    echo ""
    echo "✅ Application démarrée avec succès !"
    echo ""
    echo "🌐 Accès à l'application :"
    echo "   Frontend : http://localhost:3000"
    echo "   Backend  : http://localhost:5000"
    echo ""
    echo "📊 Voir les logs :"
    echo "   docker-compose logs -f"
    echo ""
    echo "🛑 Arrêter l'application :"
    echo "   docker-compose down"
    echo ""
    
    # Proposer d'ouvrir le navigateur
    read -p "Veux-tu ouvrir l'application dans ton navigateur ? (O/n) : " open_browser
    if [[ ! $open_browser =~ ^[Nn]$ ]]; then
        if [[ "$OSTYPE" == "darwin"* ]]; then
            open http://localhost:3000
        elif [[ "$OSTYPE" == "linux-gnu"* ]]; then
            xdg-open http://localhost:3000
        elif [[ "$OSTYPE" == "msys" ]] || [[ "$OSTYPE" == "cygwin" ]]; then
            start http://localhost:3000
        fi
    fi
else
    echo ""
    echo "❌ Erreur lors du démarrage."
    echo "📋 Affichage des logs :"
    docker-compose logs
    exit 1
fi
