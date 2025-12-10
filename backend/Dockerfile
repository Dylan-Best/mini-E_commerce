FROM node:18-slim

# Installer les dépendances nécessaires pour compiler better-sqlite3
RUN apt-get update && apt-get install -y \
    python3 \
    g++ \
    make \
  && rm -rf /var/lib/apt/lists/*

# Créer le dossier de travail
WORKDIR /app

# Copier package.json et package-lock.json
COPY package*.json ./

# Installer les dépendances **dans le conteneur** pour compiler correctement better-sqlite3
RUN npm install

# Copier le reste du code
COPY . .

# Créer dossier pour la DB et images
RUN mkdir -p /app/data /app/frontend/images

# Exposer le port backend
EXPOSE 8000

# Démarrer le serveur
CMD ["node", "server.js"]
