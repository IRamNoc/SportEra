import React from 'react';
import Card from '../ui/Card';
import { MapPin, QrCode, Trophy, Users } from 'lucide-react';

interface FeatureStep {
  id: number;
  title: string;
  description: string;
  icon: React.ComponentType<any>;
  details: string[];
}

const FEATURE_STEPS: FeatureStep[] = [
  {
    id: 1,
    title: 'Trouvez',
    description: 'Découvrez les infrastructures sportives près de chez vous grâce à notre carte interactive.',
    icon: MapPin,
    details: [
      'Géolocalisation en temps réel',
      'Filtres par sport et équipements',
      'Informations détaillées sur chaque spot',
      'Avis et photos de la communauté'
    ]
  },
  {
    id: 2,
    title: 'Scannez',
    description: 'Validez votre présence sur le terrain en scannant le QR Code de l\'infrastructure.',
    icon: QrCode,
    details: [
      'Scan instantané et sécurisé',
      'Vérification automatique de la localisation',
      'Enregistrement de votre session',
      'Début du chronomètre d\'activité'
    ]
  },
  {
    id: 3,
    title: 'Gagnez',
    description: 'Accumulez des points, débloquez des récompenses et grimpez dans les classements.',
    icon: Trophy,
    details: [
      'Points basés sur la durée et l\'intensité',
      'Badges et achievements à débloquer',
      'Classements hebdomadaires et mensuels',
      'Récompenses exclusives des partenaires'
    ]
  },
  {
    id: 4,
    title: 'Partagez',
    description: 'Rejoignez une communauté active et participez à des défis collectifs.',
    icon: Users,
    details: [
      'Défis entre amis et équipes',
      'Événements communautaires',
      'Partage de vos performances',
      'Découverte de nouveaux partenaires d\'entraînement'
    ]
  }
];

const HowItWorksSection: React.FC = () => {
  return (
    <section id="comment-ca-marche" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* En-tête */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-[#2E2E2E] mb-6">
            Comment ça marche ?
          </h2>
          <p className="text-xl text-[#2E2E2E]/70 max-w-3xl mx-auto">
            Quatre étapes simples pour transformer votre pratique sportive 
            en une expérience gamifiée et sociale.
          </p>
        </div>

        {/* Étapes */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {FEATURE_STEPS.map((step, index) => {
            const IconComponent = step.icon;
            
            return (
              <div key={step.id} className="relative">
                {/* Ligne de connexion (desktop uniquement) */}
                {index < FEATURE_STEPS.length - 1 && (
                  <div className="hidden lg:block absolute top-12 left-full w-full h-0.5 bg-gradient-to-r from-[#0000FF] to-[#0000FF]/30 transform translate-x-4 z-0" />
                )}
                
                <Card className="relative z-10 h-full hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
                  <Card.Body className="p-6 text-center">
                    {/* Numéro d'étape */}
                    <div className="inline-flex items-center justify-center w-12 h-12 bg-[#0000FF] text-white rounded-full text-lg font-bold mb-4">
                      {step.id}
                    </div>

                    {/* Icône */}
                    <div className="flex items-center justify-center w-16 h-16 bg-[#0000FF]/10 rounded-xl mx-auto mb-4">
                      <IconComponent className="h-8 w-8 text-[#0000FF]" />
                    </div>

                    {/* Titre */}
                    <h3 className="text-xl font-bold text-[#2E2E2E] mb-3">
                      {step.title}
                    </h3>

                    {/* Description */}
                    <p className="text-[#2E2E2E]/70 mb-4 leading-relaxed">
                      {step.description}
                    </p>

                    {/* Détails */}
                    <ul className="text-sm text-[#2E2E2E]/60 space-y-1">
                      {step.details.map((detail, detailIndex) => (
                        <li key={detailIndex} className="flex items-center justify-center">
                          <div className="w-1 h-1 bg-[#0000FF] rounded-full mr-2 flex-shrink-0" />
                          {detail}
                        </li>
                      ))}
                    </ul>
                  </Card.Body>
                </Card>
              </div>
            );
          })}
        </div>

        {/* Message de conclusion */}
        <div className="text-center mt-16">
          <div className="inline-flex items-center px-6 py-3 bg-[#0000FF]/10 rounded-full">
            <Trophy className="h-5 w-5 text-[#0000FF] mr-2" />
            <span className="text-[#0000FF] font-medium">
              Prêt à commencer votre aventure sportive ?
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;