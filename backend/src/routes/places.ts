import { Router } from 'express';
import { PlacesController } from '../controllers/PlacesController';

const router = Router();
const placesController = new PlacesController();

// GET /api/v1/places?lat=...&lng=...&radius=...
router.get('/', placesController.getNearbyPlaces.bind(placesController));

export default router;