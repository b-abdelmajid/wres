FROM node:18-alpine

# Install Python and build dependencies for better-sqlite3
RUN apk add --no-cache python3 make g++

WORKDIR /app

# Copier les fichiers de dépendances
COPY package*.json ./

# Installer les dépendances
RUN npm install

# Copier le reste des fichiers
COPY . .

# Créer le dossier pour la base de données
RUN mkdir -p /app/database

# Exposer le port
EXPOSE 5000

# Démarrer l'application
CMD ["npm", "start"]
