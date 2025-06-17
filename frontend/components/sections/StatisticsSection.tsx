import React, { useState, useEffect, useRef } from 'react';
import { Users, MapPin, Trophy, Building2 } from 'lucide-react';

interface Statistic {
  id: string;
  label: string;
  value: number;
  suffix: string;
  icon: React.ComponentType<any>;
  description: string;
}

const STATISTICS: Statistic[] = [
  {
    id: 'users',
    label: 'Utilisateurs actifs',
    value: 15000,
    suffix: '+',
    icon: Users,
    description: 'Sportifs connectés chaque mois'
  },
  {
    id: 'infrastructures',
    label: 'Infrastructures',
    value: 500,
    suffix: '+',
    icon: MapPin,
    description: 'Spots sportifs référencés'
  },
  {
    id: 'sessions',
    label: 'Sessions validées',
    value: 75000,
    suffix: '+',
    icon: Trophy,
    description: 'Entraînements comptabilisés'
  },
  {
    id: 'cities',
    label: 'Villes couvertes',
    value: 25,
    suffix: '+',
    icon: Building2,
    description: 'Métropoles françaises'
  }
];

const StatisticsSection: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [animatedValues, setAnimatedValues] = useState<Record<string, number>>({});
  const sectionRef = useRef<HTMLElement>(null);

  // Observer pour détecter quand la section est visible
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !isVisible) {
          setIsVisible(true);
        }
      },
      { threshold: 0.3 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, [isVisible]);

  // Animation des compteurs
  useEffect(() => {
    if (!isVisible) return;

    const duration = 2000; // 2 secondes
    const steps = 60; // 60 FPS
    const stepDuration = duration / steps;

    STATISTICS.forEach((stat) => {
      let currentStep = 0;
      const increment = stat.value / steps;

      const timer = setInterval(() => {
        currentStep++;
        const currentValue = Math.min(Math.floor(increment * currentStep), stat.value);
        
        setAnimatedValues(prev => ({
          ...prev,
          [stat.id]: currentValue
        }));

        if (currentStep >= steps) {
          clearInterval(timer);
        }
      }, stepDuration);
    });
  }, [isVisible]);

  const formatNumber = (num: number): string => {
    if (num >= 1000) {
      return (num / 1000).toFixed(num % 1000 === 0 ? 0 : 1) + 'K';
    }
    return num.toString();
  };

  return (
    <section 
      ref={sectionRef}
      id="statistiques" 
      className="py-20 bg-gradient-to-br from-[#0000FF] to-[#0000FF]/90 text-white"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* En-tête */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Sport'Era en chiffres
          </h2>
          <p className="text-xl text-white/80 max-w-3xl mx-auto">
            Une croissance constante qui témoigne de la confiance 
            de notre communauté sportive.
          </p>
        </div>

        {/* Statistiques */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {STATISTICS.map((stat, index) => {
            const IconComponent = stat.icon;
            const animatedValue = animatedValues[stat.id] || 0;
            
            return (
              <div 
                key={stat.id}
                className="text-center group"
                style={{
                  animationDelay: `${index * 200}ms`
                }}
              >
                {/* Icône */}
                <div className="flex items-center justify-center w-16 h-16 bg-white/10 rounded-xl mx-auto mb-4 group-hover:bg-white/20 transition-colors duration-300">
                  <IconComponent className="h-8 w-8 text-white" />
                </div>

                {/* Valeur */}
                <div className="mb-2">
                  <span className="text-4xl md:text-5xl font-bold">
                    {isVisible ? formatNumber(animatedValue) : '0'}
                  </span>
                  <span className="text-2xl md:text-3xl font-bold text-white/80">
                    {stat.suffix}
                  </span>
                </div>

                {/* Label */}
                <h3 className="text-lg font-semibold mb-2">
                  {stat.label}
                </h3>

                {/* Description */}
                <p className="text-white/70 text-sm">
                  {stat.description}
                </p>
              </div>
            );
          })}
        </div>

        {/* Section de croissance */}
        <div className="mt-16 text-center">
          <div className="bg-white/10 rounded-2xl p-8 backdrop-blur-sm">
            <h3 className="text-2xl font-bold mb-4">
              Une croissance exceptionnelle
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl mx-auto">
              <div>
                <div className="text-2xl font-bold text-white mb-1">+150%</div>
                <div className="text-white/80 text-sm">Croissance mensuelle</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-white mb-1">4.9/5</div>
                <div className="text-white/80 text-sm">Satisfaction utilisateur</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-white mb-1">24/7</div>
                <div className="text-white/80 text-sm">Support disponible</div>
              </div>
            </div>
          </div>
        </div>

        {/* Message d'encouragement */}
        <div className="mt-12 text-center">
          <p className="text-white/80 text-lg">
            Rejoignez des milliers de sportifs qui ont déjà transformé 
            leur pratique avec Sport'Era
          </p>
        </div>
      </div>
    </section>
  );
};

export default StatisticsSection;