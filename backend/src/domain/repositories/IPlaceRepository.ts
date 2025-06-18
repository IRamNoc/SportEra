import { Place } from '../entities/Place';

export interface IPlaceRepository {
  findById(id: string): Promise<Place | null>;
  findAll(): Promise<Place[]>;
  findByPartnerId(partnerId: string): Promise<Place[]>;
  findNearby(latitude: number, longitude: number, radiusInMeters: number): Promise<Place[]>;
  findBySport(sport: string): Promise<Place[]>;
  save(place: Place): Promise<Place>;
  update(id: string, updates: Partial<Place>): Promise<Place | null>;
  delete(id: string): Promise<boolean>;
  findByFilters(filters: {
    sports?: string[];
    partnerId?: string;
    isActive?: boolean;
    latitude?: number;
    longitude?: number;
    radius?: number;
  }): Promise<Place[]>;
}