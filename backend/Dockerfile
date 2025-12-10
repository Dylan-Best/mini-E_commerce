FROM node:18-alpine

WORKDIR /app

# Installer outils nécessaires pour better-sqlite3
RUN apk add --no-cache python3 make g++

COPY package*.json ./
RUN npm install

COPY . .

EXPOSE 8000
CMD ["node", "server.js"]
