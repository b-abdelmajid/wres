FROM node:18-alpine AS base

WORKDIR /app

# Copier les fichiers de dépendances
COPY package*.json ./

# Installer les dépendances
RUN npm install

# Copier le reste des fichiers
COPY . .

# Exposer le port
EXPOSE 3000

# Démarrer l'application en mode dev
CMD ["npm", "run", "dev"]
