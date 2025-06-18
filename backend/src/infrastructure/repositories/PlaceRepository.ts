import { Place } from '../../domain/entities/Place';
import { IPlaceRepository } from '../../domain/repositories/IPlaceRepository';

export class PlaceRepository implements IPlaceRepository {
  // Pour le MVP, utilisation de données en mémoire
  // En production, ceci serait remplacé par une base de données
  private places: Place[] = [];

  constructor() {
    // Initialiser avec des données de test
    this.initializeTestData();
  }

  private initializeTestData(): void {
    const testPlaces = [
      {
        name: 'Stade Jean Bouin',
        address: '26 Avenue du Général Sarrail, 75016 Paris',
        description: 'Stade municipal avec piste d\'athlétisme et terrain de football',
        location: {
          type: 'Point' as const,
          coordinates: [2.2530, 48.8415] as [number, number]
        },
        sports: ['football', 'running', 'athlétisme'],
        amenities: ['vestiaires', 'parking', 'éclairage'],
        contactInfo: {
          phone: '01 42 88 02 76'
        }
      },
      {
        name: 'Piscine Molitor',
        address: '13 Rue Nungesser et Coli, 75016 Paris',
        description: 'Piscine historique avec bassin olympique et bassin d\'hiver',
        location: {
          type: 'Point' as const,
          coordinates: [2.2516, 48.8476] as [number, number]
        },
        sports: ['natation', 'aquafitness'],
        amenities: ['vestiaires', 'sauna', 'parking'],
        contactInfo: {
          phone: '01 56 07 08 80',
          website: 'https://www.molitor.fr'
        }
      },
      {
        name: 'Tennis Club de Paris',
        address: 'Bois de Boulogne, 75016 Paris',
        description: 'Club de tennis avec courts couverts et extérieurs',
        location: {
          type: 'Point' as const,
          coordinates: [2.2441, 48.8566] as [number, number]
        },
        sports: ['tennis'],
        amenities: ['vestiaires', 'pro-shop', 'restaurant'],
        contactInfo: {
          phone: '01 45 27 79 12'
        }
      },
      {
        name: 'Gymnase Charras',
        address: '7 Rue Charras, 92200 Neuilly-sur-Seine',
        description: 'Gymnase municipal polyvalent',
        location: {
          type: 'Point' as const,
          coordinates: [2.2689, 48.8814] as [number, number]
        },
        sports: ['basketball', 'volleyball', 'handball', 'badminton'],
        amenities: ['vestiaires', 'parking']
      },
      {
        name: 'Fitness Park Levallois',
        address: '85 Rue Anatole France, 92300 Levallois-Perret',
        description: 'Salle de fitness moderne avec équipements dernière génération',
        location: {
          type: 'Point' as const,
          coordinates: [2.2875, 48.8947] as [number, number]
        },
        sports: ['fitness', 'musculation', 'crossfit'],
        amenities: ['vestiaires', 'parking', 'sauna'],
        contactInfo: {
          phone: '01 47 57 63 00',
          website: 'https://www.fitnesspark.fr'
        }
      },
      {
        name: 'Dojo Vincennes',
        address: '12 Avenue de la République, 94300 Vincennes',
        description: 'Dojo traditionnel pour arts martiaux',
        location: {
          type: 'Point' as const,
          coordinates: [2.4364, 48.8466] as [number, number]
        },
        sports: ['judo', 'karaté', 'aikido', 'arts-martiaux'],
        amenities: ['vestiaires', 'tatamis']
      },
      {
        name: 'Piscine Georges Vallerey',
        address: '148 Avenue Gambetta, 75020 Paris',
        description: 'Centre aquatique avec piscine olympique et bassin ludique',
        location: {
          type: 'Point' as const,
          coordinates: [2.4039, 48.8714] as [number, number]
        },
        sports: ['natation', 'aquafitness', 'plongée'],
        amenities: ['vestiaires', 'parking', 'cafétéria']
      },
      {
        name: 'Stade Charléty',
        address: '99 Boulevard Kellermann, 75013 Paris',
        description: 'Stade d\'athlétisme avec piste et aires de saut',
        location: {
          type: 'Point' as const,
          coordinates: [2.3461, 48.8186] as [number, number]
        },
        sports: ['athlétisme', 'running', 'football'],
        amenities: ['vestiaires', 'parking', 'tribune']
      }
    ];

    this.places = testPlaces.map(placeData => Place.create(placeData));
  }

  async findById(id: string): Promise<Place | null> {
    const place = this.places.find(p => p.id === id);
    return place || null;
  }

  async findAll(): Promise<Place[]> {
    return [...this.places];
  }

  async findByPartnerId(partnerId: string): Promise<Place[]> {
    return this.places.filter(place => place.partnerId === partnerId);
  }

  async findNearby(latitude: number, longitude: number, radiusInMeters: number): Promise<Place[]> {
    return this.places
      .filter(place => {
        const distance = place.distanceFrom(latitude, longitude);
        return distance <= radiusInMeters && place.isActive;
      })
      .sort((a, b) => {
        const distanceA = a.distanceFrom(latitude, longitude);
        const distanceB = b.distanceFrom(latitude, longitude);
        return distanceA - distanceB;
      });
  }

  async findBySport(sport: string): Promise<Place[]> {
    return this.places.filter(place => 
      place.sports.includes(sport.toLowerCase()) && place.isActive
    );
  }

  async save(place: Place): Promise<Place> {
    this.places.push(place);
    return place;
  }

  async update(id: string, updates: Partial<Place>): Promise<Place | null> {
    const index = this.places.findIndex(p => p.id === id);
    if (index === -1) return null;

    // Créer une nouvelle instance avec les mises à jour
    const currentPlace = this.places[index];
    const updatedPlace = new Place({
      ...currentPlace,
      ...updates,
      updatedAt: new Date()
    });

    this.places[index] = updatedPlace;
    return updatedPlace;
  }

  async delete(id: string): Promise<boolean> {
    const index = this.places.findIndex(p => p.id === id);
    if (index === -1) return false;

    this.places.splice(index, 1);
    return true;
  }

  async findByFilters(filters: {
    sports?: string[];
    partnerId?: string;
    isActive?: boolean;
    latitude?: number;
    longitude?: number;
    radius?: number;
  }): Promise<Place[]> {
    let filteredPlaces = [...this.places];

    if (filters.sports && filters.sports.length > 0) {
      filteredPlaces = filteredPlaces.filter(place =>
        filters.sports!.some(sport => place.sports.includes(sport.toLowerCase()))
      );
    }

    if (filters.partnerId) {
      filteredPlaces = filteredPlaces.filter(place => place.partnerId === filters.partnerId);
    }

    if (filters.isActive !== undefined) {
      filteredPlaces = filteredPlaces.filter(place => place.isActive === filters.isActive);
    }

    if (filters.latitude && filters.longitude && filters.radius) {
      filteredPlaces = filteredPlaces.filter(place => {
        const distance = place.distanceFrom(filters.latitude!, filters.longitude!);
        return distance <= filters.radius!;
      });
    }

    return filteredPlaces;
  }
}