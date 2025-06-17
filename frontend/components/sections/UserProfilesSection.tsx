import React, { useState } from 'react';
import Card from '../ui/Card';
import Button from '../ui/Button';
import { Users, Building2, ArrowRight } from 'lucide-react';
import Link from 'next/link';

interface UserProfile {
  id: string;
  title: string;
  description: string;
  icon: React.ComponentType<any>;
  features: string[];
  cta: string;
  href: string;
}

const USER_PROFILES: UserProfile[] = [
  {
    id: 'player',
    title: 'Joueur',
    description: 'Explorez la ville, découvrez de nouveaux spots et validez vos sessions sportives.',
    icon: Users,
    features: [
      'Carte interactive des infrastructures',
      'Validation par QR Code',
      'Système de points et récompenses',
      'Défis personnalisés',
      'Communauté active'
    ],
    cta: 'Commencer à jouer',
    href: '/register?type=player'
  },
  {
    id: 'partner',
    title: 'Partenaire',
    description: 'Rejoignez notre réseau et proposez vos infrastructures à notre communauté.',
    icon: Building2,
    features: [
      'Gestion de vos infrastructures',
      'Analytics détaillées',
      'Promotion auprès des joueurs',
      'Outils de communication',
      'Support dédié'
    ],
    cta: 'Devenir partenaire',
    href: '/register?type=partner'
  }
];

const UserProfilesSection: React.FC = () => {
  const [selectedProfile, setSelectedProfile] = useState<string | null>(null);

  return (
    <section id="profils" className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* En-tête */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-[#2E2E2E] mb-6">
            Choisissez votre parcours
          </h2>
          <p className="text-xl text-[#2E2E2E]/70 max-w-3xl mx-auto">
            Sport'Era s'adapte à vos besoins, que vous soyez un sportif passionné 
            ou un partenaire souhaitant rejoindre notre écosystème.
          </p>
        </div>

        {/* Profils */}
        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {USER_PROFILES.map((profile) => {
            const IconComponent = profile.icon;
            const isSelected = selectedProfile === profile.id;
            
            return (
              <Card
                key={profile.id}
                className={`transition-all duration-300 cursor-pointer transform hover:scale-105 ${
                  isSelected 
                    ? 'ring-2 ring-[#0000FF] shadow-xl' 
                    : 'hover:shadow-lg'
                }`}
                onClick={() => setSelectedProfile(profile.id)}
              >
                <Card.Body className="p-8">
                  {/* Icône */}
                  <div className="flex items-center justify-center w-16 h-16 bg-[#0000FF]/10 rounded-xl mb-6">
                    <IconComponent className="h-8 w-8 text-[#0000FF]" />
                  </div>

                  {/* Titre et description */}
                  <h3 className="text-2xl font-bold text-[#2E2E2E] mb-4">
                    {profile.title}
                  </h3>
                  <p className="text-[#2E2E2E]/70 mb-6 leading-relaxed">
                    {profile.description}
                  </p>

                  {/* Fonctionnalités */}
                  <ul className="space-y-3 mb-8">
                    {profile.features.map((feature, index) => (
                      <li key={index} className="flex items-center text-[#2E2E2E]/80">
                        <div className="w-2 h-2 bg-[#0000FF] rounded-full mr-3 flex-shrink-0" />
                        {feature}
                      </li>
                    ))}
                  </ul>

                  {/* CTA */}
                  <Link href={profile.href}>
                    <Button 
                      className="w-full group"
                      variant={isSelected ? 'primary' : 'outline'}
                    >
                      {profile.cta}
                      <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </Button>
                  </Link>
                </Card.Body>
              </Card>
            );
          })}
        </div>

        {/* Message d'encouragement */}
        <div className="text-center mt-12">
          <p className="text-[#2E2E2E]/60">
            Pas encore sûr ? Découvrez comment Sport'Era fonctionne ci-dessous
          </p>
        </div>
      </div>
    </section>
  );
};

export default UserProfilesSection;