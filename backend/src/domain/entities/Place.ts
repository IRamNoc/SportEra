import { randomUUID } from 'crypto';

export interface PlaceLocation {
  type: 'Point';
  coordinates: [number, number]; // [longitude, latitude]
}

export interface PlaceProps {
  id?: string;
  name: string;
  address?: string;
  description?: string;
  location: PlaceLocation;
  sports: string[];
  partnerId?: string; // ID du partenaire propriétaire
  isActive?: boolean;
  amenities?: string[]; // équipements disponibles
  openingHours?: {
    [day: string]: {
      open: string;
      close: string;
    };
  };
  contactInfo?: {
    phone?: string;
    email?: string;
    website?: string;
  };
  createdAt?: Date;
  updatedAt?: Date;
}

export class Place {
  public readonly id: string;
  public readonly name: string;
  public readonly address?: string;
  public readonly description?: string;
  public readonly location: PlaceLocation;
  public readonly sports: string[];
  public readonly partnerId?: string;
  public readonly isActive: boolean;
  public readonly amenities: string[];
  public readonly openingHours?: PlaceProps['openingHours'];
  public readonly contactInfo?: PlaceProps['contactInfo'];
  public readonly createdAt: Date;
  public readonly updatedAt: Date;

  constructor(props: PlaceProps) {
    this.id = props.id || randomUUID();
    this.name = props.name;
    this.address = props.address;
    this.description = props.description;
    this.location = props.location;
    this.sports = props.sports || [];
    this.partnerId = props.partnerId;
    this.isActive = props.isActive ?? true;
    this.amenities = props.amenities || [];
    this.openingHours = props.openingHours;
    this.contactInfo = props.contactInfo;
    this.createdAt = props.createdAt || new Date();
    this.updatedAt = props.updatedAt || new Date();
  }

  static create(props: Omit<PlaceProps, 'id' | 'createdAt' | 'updatedAt'>): Place {
    // Validation
    if (!props.name || props.name.trim().length === 0) {
      throw new Error('Le nom du lieu est requis');
    }

    if (props.name.length > 100) {
      throw new Error('Le nom du lieu ne peut pas dépasser 100 caractères');
    }

    if (!props.location || !props.location.coordinates) {
      throw new Error('La localisation est requise');
    }

    const [longitude, latitude] = props.location.coordinates;
    if (latitude < -90 || latitude > 90 || longitude < -180 || longitude > 180) {
      throw new Error('Coordonnées géographiques invalides');
    }

    if (!props.sports || props.sports.length === 0) {
      throw new Error('Au moins un sport doit être spécifié');
    }

    // Validation des sports
    const validSports = [
      'football', 'basketball', 'tennis', 'volleyball', 'handball',
      'rugby', 'natation', 'running', 'cyclisme', 'fitness',
      'musculation', 'yoga', 'pilates', 'danse', 'escalade',
      'badminton', 'squash', 'ping-pong', 'boxe', 'arts-martiaux',
      'aquafitness', 'crossfit', 'athlétisme', 'judo', 'karaté', 
      'aikido', 'plongée', 'autre'
    ];

    const invalidSports = props.sports.filter(sport => !validSports.includes(sport.toLowerCase()));
    if (invalidSports.length > 0) {
      throw new Error(`Sports invalides: ${invalidSports.join(', ')}`);
    }

    return new Place({
      ...props,
      sports: props.sports.map(sport => sport.toLowerCase()),
      createdAt: new Date(),
      updatedAt: new Date()
    });
  }

  // Calculer la distance depuis un point donné (en mètres)
  distanceFrom(latitude: number, longitude: number): number {
    const [placeLng, placeLat] = this.location.coordinates;
    
    const R = 6371000; // Rayon de la Terre en mètres
    const φ1 = latitude * Math.PI / 180;
    const φ2 = placeLat * Math.PI / 180;
    const Δφ = (placeLat - latitude) * Math.PI / 180;
    const Δλ = (placeLng - longitude) * Math.PI / 180;

    const a = Math.sin(Δφ/2) * Math.sin(Δφ/2) +
              Math.cos(φ1) * Math.cos(φ2) *
              Math.sin(Δλ/2) * Math.sin(Δλ/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));

    return R * c;
  }

  // Vérifier si le lieu est ouvert à une heure donnée
  isOpenAt(date: Date = new Date()): boolean {
    if (!this.openingHours) return true; // Pas d'horaires = toujours ouvert
    
    const dayNames = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
    const dayName = dayNames[date.getDay()];
    const daySchedule = this.openingHours[dayName];
    
    if (!daySchedule) return false; // Fermé ce jour
    
    const currentTime = date.getHours() * 60 + date.getMinutes();
    const [openHour, openMin] = daySchedule.open.split(':').map(Number);
    const [closeHour, closeMin] = daySchedule.close.split(':').map(Number);
    const openTime = openHour * 60 + openMin;
    const closeTime = closeHour * 60 + closeMin;
    
    return currentTime >= openTime && currentTime <= closeTime;
  }

  toJSON() {
    return {
      _id: this.id,
      name: this.name,
      address: this.address,
      description: this.description,
      location: this.location,
      sports: this.sports,
      partnerId: this.partnerId,
      isActive: this.isActive,
      amenities: this.amenities,
      openingHours: this.openingHours,
      contactInfo: this.contactInfo,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt
    };
  }
}