# Infrastructure SportEra

Ce dossier contient la configuration d'infrastructure pour les différents environnements de SportEra.

## Structure des Environnements

### 🏠 Local (Développement)
- **Fichier**: `docker-compose.yml` (racine)
- **Ports**: Frontend (3001), Backend (3000), MongoDB (27017)
- **Utilisation**: Développement local avec hot reload
- **Commande**: `docker-compose up --build`

### 🔧 Dev (Développement partagé)
- **Fichier**: `docker-compose.dev.yml`
- **Ports**: Frontend (3001), Backend (3000), MongoDB (27017)
- **Utilisation**: Environnement de développement partagé
- **Commande**: `docker-compose -f docker-compose.dev.yml up --build`

### 🧪 Test (Tests)
- **Fichier**: `docker-compose.test.yml`
- **Ports**: Frontend (3003), Backend (3002), MongoDB (27018)
- **Utilisation**: Tests automatisés et manuels
- **Commande**: `docker-compose -f docker-compose.test.yml up --build`

### 🚀 Production
- **Fichier**: `docker-compose.prod.yml`
- **Ports**: HTTP (80), HTTPS (443)
- **Utilisation**: Environnement de production avec Nginx
- **Commande**: `docker-compose -f docker-compose.prod.yml up --build`

## Configuration des Variables d'Environnement

### Backend
- `.env.dev` - Variables de développement
- `.env.test` - Variables de test
- `.env.prod` - Variables de production

### Frontend
- `.env.dev` - Variables de développement
- `.env.test` - Variables de test
- `.env.prod` - Variables de production

## Dockerfiles Spécialisés

### Backend
- `Dockerfile.dev` - Image de développement avec hot reload
- `Dockerfile.test` - Image de test avec build optimisé
- `Dockerfile.prod` - Image de production multi-stage avec sécurité

### Frontend
- `Dockerfile.dev` - Image de développement avec hot reload
- `Dockerfile.test` - Image de test avec build optimisé
- `Dockerfile.prod` - Image de production multi-stage avec sécurité

## Script de Déploiement

Utilisez le script `scripts/deploy.sh` pour déployer facilement :

```bash
# Déploiement local (par défaut)
./scripts/deploy.sh

# Déploiement en développement
./scripts/deploy.sh dev

# Déploiement en test
./scripts/deploy.sh test

# Déploiement en production
./scripts/deploy.sh prod
```

## Configuration Nginx (Production)

Le fichier `nginx/conf.d/default.conf` configure :
- Reverse proxy vers le backend et frontend
- SSL/TLS avec redirection HTTP → HTTPS
- Headers de sécurité
- Compression Gzip
- Cache des fichiers statiques

### Certificats SSL

Pour la production, placez vos certificats SSL dans :
- `infra/nginx/ssl/cert.pem`
- `infra/nginx/ssl/key.pem`

## Variables d'Environnement de Production

Créez un fichier `.env.production` à la racine avec :

```bash
# Database
MONGO_USER=admin
MONGO_PASSWORD=your-secure-password
MONGO_DB=sportera

# Security
JWT_SECRET=your-jwt-secret-key

# Frontend
NEXT_PUBLIC_API_URL=https://your-domain.com
FRONTEND_URL=https://your-domain.com

# Analytics
GA_TRACKING_ID=GA-XXXXXXXXX
SENTRY_DSN=https://your-sentry-dsn

# Social
FACEBOOK_APP_ID=your-facebook-app-id
TWITTER_HANDLE=@your-twitter

# CDN
CDN_URL=https://cdn.your-domain.com

# App
APP_VERSION=1.0.0
```

## Monitoring et Logs

### Production
- Les logs sont limités à 10MB par fichier, 3 fichiers maximum
- Ressources limitées par service
- Health checks configurés

### Commandes Utiles

```bash
# Voir les logs d'un environnement
docker-compose -f docker-compose.prod.yml logs -f

# Voir les logs d'un service spécifique
docker-compose -f docker-compose.prod.yml logs -f backend

# Redémarrer un service
docker-compose -f docker-compose.prod.yml restart backend

# Mise à jour sans downtime
docker-compose -f docker-compose.prod.yml up --build --no-deps backend
```

## Sécurité

### Développement
- Mots de passe en dur (acceptable)
- Debug activé
- CORS permissif

### Test
- Mots de passe de test
- Logs d'erreur activés
- Monitoring des performances

### Production
- Variables d'environnement sécurisées
- Utilisateurs non-root dans les conteneurs
- Headers de sécurité
- SSL/TLS obligatoire
- Rate limiting
- Health checks