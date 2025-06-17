import React, { useState, useEffect } from 'react';

interface Partner {
  id: string;
  name: string;
  logo: string;
  category: string;
}

const PARTNERS: Partner[] = [
  {
    id: '1',
    name: 'Stade de France',
    logo: '/logos/stade-france.svg',
    category: 'Stade national'
  },
  {
    id: '2',
    name: 'Parc des Princes',
    logo: '/logos/parc-princes.svg',
    category: 'Stade de football'
  },
  {
    id: '3',
    name: 'AccorHotels Arena',
    logo: '/logos/accor-arena.svg',
    category: 'Salle omnisports'
  },
  {
    id: '5',
    name: 'Palais des Sports',
    logo: '/logos/palais-sports.svg',
    category: 'Complexe sportif'
  },
  {
    id: '6',
    name: 'Centre Aquatique',
    logo: '/logos/centre-aquatique.svg',
    category: 'Piscine olympique'
  },
  {
    id: '7',
    name: 'Tennis Club',
    logo: '/logos/tennis-club.svg',
    category: 'Courts de tennis'
  },
  {
    id: '8',
    name: 'Gymnase Municipal',
    logo: '/logos/gymnase.svg',
    category: 'Salle de sport'
  }
];

const PartnersSection: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const itemsPerView = 4;
  const maxIndex = PARTNERS.length - itemsPerView;

  // Auto-play du carrousel avec défilement infini
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => {
        // Si on est à la fin, on revient au début
        if (prev >= maxIndex) {
          return 0;
        }
        return prev + 1;
      });
    }, 4000);

    return () => clearInterval(interval);
  }, [maxIndex]);

  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* En-tête */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-[#2E2E2E] mb-6">
            Nos partenaires de confiance
          </h2>
          <p className="text-xl text-[#2E2E2E]/70 max-w-2xl mx-auto">
            Nous collaborons avec les plus grandes infrastructures sportives.
          </p>
        </div>

        {/* Carrousel de partenaires */}
        <div className="overflow-hidden relative">
          <div 
            className="flex transition-transform duration-1000 ease-in-out"
            style={{ 
              transform: `translateX(-${currentIndex * (100 / itemsPerView)}%)`,
              width: '100%'
            }}
          >
            {PARTNERS.map((partner, index) => (
              <div 
                key={partner.id} 
                className="flex-shrink-0 px-4"
                style={{ width: `${100 / itemsPerView}%` }}
              >
                <div className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col items-center justify-center min-h-[140px] group">
                  <img 
                    src={partner.logo} 
                    alt={partner.name}
                    className="h-12 w-auto object-contain transition-all duration-300 filter brightness-75 group-hover:brightness-100"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = `data:image/svg+xml;base64,${btoa(`<svg xmlns="http://www.w3.org/2000/svg" width="100" height="50" viewBox="0 0 100 50"><rect width="100" height="50" fill="#f3f4f6"/><text x="50" y="30" text-anchor="middle" font-family="Arial" font-size="12" fill="#6b7280">${partner.name}</text></svg>`)}`;
                    }}
                  />
                  <div className="text-sm font-medium text-[#2E2E2E] mt-3 text-center">
                    {partner.name}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default PartnersSection;