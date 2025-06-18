import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import { MapPin, AlertCircle } from 'lucide-react';

// Fix pour les icônes Leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

interface Place {
  _id: string;
  name: string;
  address?: string;
  location: {
    type: 'Point';
    coordinates: [number, number]; // [longitude, latitude]
  };
  sports: string[];
}

interface InteractiveMapProps {
  onPlacesLoad?: (places: Place[]) => void;
  className?: string;
}

const InteractiveMap: React.FC<InteractiveMapProps> = ({ onPlacesLoad, className = '' }) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const [userLocation, setUserLocation] = useState<[number, number] | null>(null);
  const [places, setPlaces] = useState<Place[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Coordonnées par défaut (Paris)
  const defaultLocation: [number, number] = [48.8566, 2.3522];

  // Obtenir la géolocalisation de l'utilisateur
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setUserLocation([latitude, longitude]);
          setError(null);
        },
        (error) => {
          console.error('Erreur de géolocalisation:', error);
          setError('Impossible d\'obtenir votre position. Carte centrée sur Paris.');
          setUserLocation(defaultLocation);
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 300000 // 5 minutes
        }
      );
    } else {
      setError('Géolocalisation non supportée. Carte centrée sur Paris.');
      setUserLocation(defaultLocation);
    }
  }, []);

  // Récupérer les lieux à proximité
  const fetchNearbyPlaces = async (lat: number, lng: number) => {
    try {
      const baseUrl = `${process.env.NEXT_PUBLIC_API_URL}${process.env.NEXT_PUBLIC_API_PREFIX || ''}`;
      const response = await fetch(`${baseUrl}/places?lat=${lat}&lng=${lng}&radius=5000`);
      
      if (!response.ok) {
        throw new Error('Erreur lors de la récupération des lieux');
      }
      
      const data = await response.json();
      const placesData = data.success ? data.data || [] : [];
      
      setPlaces(placesData);
      onPlacesLoad?.(placesData);
    } catch (error) {
      console.error('Erreur API places:', error);
      // Pour le MVP, utiliser des données de test
      const mockPlaces: Place[] = [
        {
          _id: '1',
          name: 'Stade Jean Bouin',
          address: '26 Avenue du Général Sarrail, 75016 Paris',
          location: {
            type: 'Point',
            coordinates: [2.2530, 48.8415]
          },
          sports: ['football', 'running']
        },
        {
          _id: '2',
          name: 'Piscine Molitor',
          address: '13 Rue Nungesser et Coli, 75016 Paris',
          location: {
            type: 'Point',
            coordinates: [2.2516, 48.8476]
          },
          sports: ['natation', 'aquafitness']
        },
        {
          _id: '3',
          name: 'Tennis Club de Paris',
          address: 'Bois de Boulogne, 75016 Paris',
          location: {
            type: 'Point',
            coordinates: [2.2441, 48.8566]
          },
          sports: ['tennis']
        }
      ];
      setPlaces(mockPlaces);
      onPlacesLoad?.(mockPlaces);
    }
  };

  // Initialiser la carte
  useEffect(() => {
    if (!mapRef.current || !userLocation) return;

    // Nettoyer la carte existante
    if (mapInstanceRef.current) {
      mapInstanceRef.current.remove();
    }

    // Créer la nouvelle carte
    const map = L.map(mapRef.current).setView(userLocation, 13);
    mapInstanceRef.current = map;

    // Ajouter les tuiles
    L.tileLayer('https://tile.stadiamaps.com/tiles/alidade_smooth/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '© <a href="https://stadiamaps.com/">Stadia Maps</a> © <a href="https://openmaptiles.org/">OpenMapTiles</a> © <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    }).addTo(map);

    // Ajouter le marqueur de l'utilisateur
    const userIcon = L.divIcon({
      html: `<div class="bg-blue-500 w-4 h-4 rounded-full border-2 border-white shadow-lg"></div>`,
      className: 'user-location-marker',
      iconSize: [16, 16],
      iconAnchor: [8, 8]
    });

    L.marker(userLocation, { icon: userIcon })
      .addTo(map)
      .bindPopup('Votre position')
      .openPopup();

    // Récupérer et afficher les lieux
    fetchNearbyPlaces(userLocation[0], userLocation[1]);
    setIsLoading(false);

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [userLocation]);

  // Ajouter les marqueurs des lieux
  useEffect(() => {
    if (!mapInstanceRef.current || places.length === 0) return;

    const map = mapInstanceRef.current;

    places.forEach((place) => {
      const [lng, lat] = place.location.coordinates;
      
      // Icône personnalisée pour les lieux
      const placeIcon = L.divIcon({
        html: `<div class="bg-red-500 w-6 h-6 rounded-full border-2 border-white shadow-lg flex items-center justify-center">
                 <svg class="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                   <path fill-rule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clip-rule="evenodd" />
                 </svg>
               </div>`,
        className: 'place-marker',
        iconSize: [24, 24],
        iconAnchor: [12, 24]
      });

      const marker = L.marker([lat, lng], { icon: placeIcon }).addTo(map);

      // Popup avec les informations du lieu
      const popupContent = `
        <div class="p-3 min-w-[200px]">
          <h3 class="font-bold text-lg mb-2">${place.name}</h3>
          ${place.address ? `<p class="text-sm text-gray-600 mb-2">${place.address}</p>` : ''}
          <div class="mb-3">
            <span class="text-sm font-medium text-gray-700">Sports:</span>
            <div class="flex flex-wrap gap-1 mt-1">
              ${place.sports.map(sport => 
                `<span class="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">${sport}</span>`
              ).join('')}
            </div>
          </div>
          <button class="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-sm w-full">
            Voir les détails
          </button>
        </div>
      `;

      marker.bindPopup(popupContent);
    });
  }, [places]);

  if (isLoading) {
    return (
      <div className={`bg-gray-100 rounded-lg flex items-center justify-center ${className}`} style={{ height: '400px' }}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
          <p className="text-gray-600">Chargement de la carte...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={className}>
      {error && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-4 flex items-center">
          <AlertCircle className="h-5 w-5 text-yellow-600 mr-2" />
          <span className="text-yellow-800 text-sm">{error}</span>
        </div>
      )}
      
      <div 
        ref={mapRef} 
        className="w-full rounded-lg shadow-lg"
        style={{ height: '400px' }}
      />
      
      {places.length === 0 && !isLoading && (
        <div className="mt-4 text-center text-gray-600">
          <MapPin className="h-8 w-8 mx-auto mb-2 text-gray-400" />
          <p>Aucune infrastructure à proximité</p>
        </div>
      )}
      
      {places.length > 0 && (
        <div className="mt-4 text-sm text-gray-600">
          <p>{places.length} infrastructure{places.length > 1 ? 's' : ''} trouvée{places.length > 1 ? 's' : ''} dans un rayon de 5 km</p>
        </div>
      )}
    </div>
  );
};

export default InteractiveMap;