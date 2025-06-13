FROM node:18-alpine

WORKDIR /usr/src/app

# Copier les fichiers de dépendances
COPY package.json package-lock.json ./

# Installer les dépendances
RUN npm ci

# Copier le code source
COPY . .

# Ajouter node_modules/.bin au PATH
ENV PATH="/usr/src/app/node_modules/.bin:$PATH"

# Exposer le port
EXPOSE 3000

# Commande par défaut pour le développement
CMD ["yarn", "dev"]