import React from 'react';
import Card from '../ui/Card';
import { 
  MapPin, 
  QrCode, 
  Trophy, 
  Users, 
  Target, 
  Gift,
  Shield,
  Zap
} from 'lucide-react';

interface Advantage {
  id: string;
  title: string;
  description: string;
  icon: React.ComponentType<any>;
  benefits: string[];
}

const ADVANTAGES: Advantage[] = [
  {
    id: 'interactive-map',
    title: 'Carte interactive',
    description: 'Explorez votre ville sous un nouvel angle sportif.',
    icon: MapPin,
    benefits: [
      'Géolocalisation précise',
      'Filtres avancés',
      'Mise à jour en temps réel',
      'Interface intuitive'
    ]
  },
  {
    id: 'qr-scanner',
    title: 'Scanner QR Code',
    description: 'Validation instantanée et sécurisée de vos sessions.',
    icon: QrCode,
    benefits: [
      'Scan ultra-rapide',
      'Vérification automatique',
      'Historique complet',
      'Sécurité renforcée'
    ]
  },
  {
    id: 'points-system',
    title: 'Système de points',
    description: 'Transformez chaque entraînement en récompense.',
    icon: Trophy,
    benefits: [
      'Points progressifs',
      'Multiplicateurs de bonus',
      'Objectifs personnalisés',
      'Récompenses exclusives'
    ]
  },
  {
    id: 'community',
    title: 'Communauté active',
    description: 'Connectez-vous avec des sportifs passionnés.',
    icon: Users,
    benefits: [
      'Réseau social sportif',
      'Événements réguliers',
      'Groupes par affinités',
      'Mentoring entre membres'
    ]
  },
  {
    id: 'challenges',
    title: 'Défis personnalisés',
    description: 'Repoussez vos limites avec des objectifs adaptés.',
    icon: Target,
    benefits: [
      'IA adaptive',
      'Progression mesurée',
      'Défis collaboratifs',
      'Coaching virtuel'
    ]
  },
  {
    id: 'rewards',
    title: 'Récompenses',
    description: 'Débloquez des avantages exclusifs chez nos partenaires.',
    icon: Gift,
    benefits: [
      'Catalogue varié',
      'Partenaires premium',
      'Offres personnalisées',
      'Livraison gratuite'
    ]
  },
  {
    id: 'security',
    title: 'Sécurité garantie',
    description: 'Vos données sont protégées par les meilleurs standards.',
    icon: Shield,
    benefits: [
      'Chiffrement end-to-end',
      'RGPD compliant',
      'Authentification 2FA',
      'Audit de sécurité'
    ]
  },
  {
    id: 'performance',
    title: 'Performance optimale',
    description: 'Une application rapide et fluide sur tous les appareils.',
    icon: Zap,
    benefits: [
      'Temps de chargement < 2s',
      'Mode hors-ligne',
      'Synchronisation cloud',
      'Interface responsive'
    ]
  }
];

const AdvantagesSection: React.FC = () => {
  return (
    <section id="avantages" className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* En-tête */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-[#2E2E2E] mb-6">
            Pourquoi choisir Sport'Era ?
          </h2>
          <p className="text-xl text-[#2E2E2E]/70 max-w-3xl mx-auto">
            Découvrez tous les avantages qui font de Sport'Era la plateforme 
            de référence pour les sportifs urbains.
          </p>
        </div>

        {/* Grille des avantages */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {ADVANTAGES.map((advantage, index) => {
            const IconComponent = advantage.icon;
            
            return (
              <Card 
                key={advantage.id} 
                className="h-full hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 group"
              >
                <Card.Body className="p-6">
                  {/* Icône */}
                  <div className="flex items-center justify-center w-12 h-12 bg-[#0000FF]/10 rounded-lg mb-4 group-hover:bg-[#0000FF]/20 transition-colors duration-300">
                    <IconComponent className="h-6 w-6 text-[#0000FF]" />
                  </div>

                  {/* Titre */}
                  <h3 className="text-lg font-bold text-[#2E2E2E] mb-3">
                    {advantage.title}
                  </h3>

                  {/* Description */}
                  <p className="text-[#2E2E2E]/70 mb-4 text-sm leading-relaxed">
                    {advantage.description}
                  </p>

                  {/* Bénéfices */}
                  <ul className="space-y-2">
                    {advantage.benefits.map((benefit, benefitIndex) => (
                      <li key={benefitIndex} className="flex items-center text-xs text-[#2E2E2E]/60">
                        <div className="w-1 h-1 bg-[#0000FF] rounded-full mr-2 flex-shrink-0" />
                        {benefit}
                      </li>
                    ))}
                  </ul>
                </Card.Body>
              </Card>
            );
          })}
        </div>

        {/* Section de mise en avant */}
        <div className="mt-16 text-center">
          <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 max-w-4xl mx-auto">
            <div className="flex items-center justify-center w-16 h-16 bg-[#0000FF]/10 rounded-xl mx-auto mb-6">
              <Zap className="h-8 w-8 text-[#0000FF]" />
            </div>
            <h3 className="text-2xl font-bold text-[#2E2E2E] mb-4">
              Une expérience complète et innovante
            </h3>
            <p className="text-[#2E2E2E]/70 leading-relaxed max-w-2xl mx-auto">
              Sport'Era combine technologie de pointe, gamification intelligente et 
              communauté engagée pour créer l'écosystème sportif urbain de demain.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AdvantagesSection;