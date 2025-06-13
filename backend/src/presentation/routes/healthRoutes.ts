// Presentation Layer - Routes de santé
// Configure les routes HTTP pour les vérifications de santé

import { Router } from 'express';
import { HealthController } from '../controllers/HealthController';

// Factory function pour créer les routes de santé
export function createHealthRoutes(): Router {
  const router = Router();

  // Instanciation du contrôleur
  const healthController = new HealthController();

  // Configuration des routes
  router.get('/', (req, res) => healthController.ping(req, res));
  router.get('/ping', (req, res) => healthController.ping(req, res));
  router.get('/health', (req, res) => healthController.health(req, res));

  return router;
}