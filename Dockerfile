FROM node:20-alpine

WORKDIR /app

# Copier les fichiers de dépendances
COPY package.json package-lock.json* ./

# Installer toutes les dépendances (y compris les devDependencies pour le build)
RUN npm install

# Copier tout le code source
COPY . .

# Générer le client Prisma
RUN npx prisma generate

# Construire l'application pour la production
RUN npm run build

# Exposer le port 3000
EXPOSE 3000

# Démarrer l'application
CMD ["npm", "start"]
