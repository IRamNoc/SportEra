FROM node:18-alpine

WORKDIR /app

# Copier les fichiers de dépendances
COPY package.json package-lock.json ./

# Définir l'environnement de développement
ENV NODE_ENV=development

# Installer les dépendances
RUN npm ci

# Copier le code source
COPY . .

# Ajouter node_modules/.bin au PATH
ENV PATH="/app/node_modules/.bin:$PATH"

# Exposer le port
EXPOSE 3000

# Commande par défaut pour le développement
CMD ["npm", "run", "dev"]