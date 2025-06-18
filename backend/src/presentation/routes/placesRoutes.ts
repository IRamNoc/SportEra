import { Router } from 'express';
import { PlacesController } from '../controllers/PlacesController';

export function createPlacesRoutes(): Router {
  const router = Router();
  const placesController = new PlacesController();

  // GET /api/v1/places?lat=...&lng=...&radius=...
  router.get('/', placesController.getNearbyPlaces.bind(placesController));

  return router;
}