FROM node:18-alpine

WORKDIR /usr/src/app

# Copier les fichiers de dépendances
COPY package.json yarn.lock ./

# Installer les dépendances
RUN yarn install --frozen-lockfile

# Copier le code source
COPY . .

# Ajouter node_modules/.bin au PATH
ENV PATH="/usr/src/app/node_modules/.bin:$PATH"

# Exposer le port
EXPOSE 3000

# Commande par défaut pour le développement
CMD ["yarn", "dev"]