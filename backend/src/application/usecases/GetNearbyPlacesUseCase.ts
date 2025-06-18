import { Place } from '../../domain/entities/Place';
import { IPlaceRepository } from '../../domain/repositories/IPlaceRepository';

export interface GetNearbyPlacesRequest {
  latitude: number;
  longitude: number;
  radius: number; // en mètres
}

export interface GetNearbyPlacesResponse {
  success: boolean;
  places?: Place[];
  message?: string;
}

export class GetNearbyPlacesUseCase {
  constructor(private placeRepository: IPlaceRepository) {}

  async execute(request: GetNearbyPlacesRequest): Promise<GetNearbyPlacesResponse> {
    try {
      const { latitude, longitude, radius } = request;

      // Validation des paramètres
      if (latitude < -90 || latitude > 90) {
        return {
          success: false,
          message: 'Latitude invalide (doit être entre -90 et 90)'
        };
      }

      if (longitude < -180 || longitude > 180) {
        return {
          success: false,
          message: 'Longitude invalide (doit être entre -180 et 180)'
        };
      }

      if (radius <= 0 || radius > 50000) { // Max 50km
        return {
          success: false,
          message: 'Rayon invalide (doit être entre 1 et 50000 mètres)'
        };
      }

      // Récupérer les lieux à proximité
      const places = await this.placeRepository.findNearby(latitude, longitude, radius);

      return {
        success: true,
        places
      };
    } catch (error) {
      console.error('Erreur dans GetNearbyPlacesUseCase:', error);
      return {
        success: false,
        message: 'Erreur lors de la récupération des lieux à proximité'
      };
    }
  }
}