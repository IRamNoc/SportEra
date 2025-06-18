import { Request, Response } from 'express';
import { GetNearbyPlacesUseCase } from '../../application/usecases/GetNearbyPlacesUseCase';
import { PlaceRepository } from '../../infrastructure/repositories/PlaceRepository';

export class PlacesController {
  private getNearbyPlacesUseCase: GetNearbyPlacesUseCase;

  constructor() {
    const placeRepository = new PlaceRepository();
    this.getNearbyPlacesUseCase = new GetNearbyPlacesUseCase(placeRepository);
  }

  async getNearbyPlaces(req: Request, res: Response): Promise<void> {
    try {
      const { lat, lng, radius } = req.query;

      // Validation des paramètres
      if (!lat || !lng) {
        res.status(400).json({
          success: false,
          message: 'Les paramètres lat et lng sont requis'
        });
        return;
      }

      const latitude = parseFloat(lat as string);
      const longitude = parseFloat(lng as string);
      const searchRadius = radius ? parseInt(radius as string) : 5000; // 5km par défaut

      if (isNaN(latitude) || isNaN(longitude)) {
        res.status(400).json({
          success: false,
          message: 'Les coordonnées doivent être des nombres valides'
        });
        return;
      }

      if (latitude < -90 || latitude > 90 || longitude < -180 || longitude > 180) {
        res.status(400).json({
          success: false,
          message: 'Coordonnées invalides'
        });
        return;
      }

      if (searchRadius <= 0 || searchRadius > 50000) {
        res.status(400).json({
          success: false,
          message: 'Le rayon doit être entre 1 et 50000 mètres'
        });
        return;
      }

      const result = await this.getNearbyPlacesUseCase.execute({
        latitude,
        longitude,
        radius: searchRadius
      });

      if (result.success) {
        res.status(200).json({
          success: true,
          data: result.places?.map(place => place.toJSON()) || [],
          count: result.places?.length || 0,
          radius: searchRadius,
          center: { latitude, longitude }
        });
      } else {
        res.status(500).json({
          success: false,
          message: result.message || 'Erreur lors de la récupération des lieux'
        });
      }
    } catch (error) {
      console.error('Erreur dans PlacesController.getNearbyPlaces:', error);
      res.status(500).json({
        success: false,
        message: 'Erreur interne du serveur'
      });
    }
  }
}