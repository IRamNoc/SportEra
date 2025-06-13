# Sport'Era Backend

Backend Node.js / Express / TypeScript pour Sport'Era.

## Prérequis
- Docker & Docker Compose
- .env configuré (cf. .env.example)

## Lancement

```bash
git clone <repo_url>
cd sportera-backend
yarn install
docker compose up -d
```

Le backend sera accessible sur http://localhost:3000/api/ping

## Scripts

- `yarn dev` : development (ts-node-dev)
- `yarn build` : compilation TS
- `yarn start` : lancer le build compilé
