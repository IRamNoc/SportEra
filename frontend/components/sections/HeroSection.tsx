import React from 'react';
import Button from '../ui/Button';
import useAuth from '../../hooks/useAuth';
import Link from 'next/link';

const HeroSection: React.FC = () => {
  const { user } = useAuth();

  return (
    <section className="bg-gradient-to-br from-white via-blue-50 to-white py-20 lg:py-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-4xl mx-auto">
          {/* Badge */}
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-[#0000FF]/10 text-[#0000FF] text-sm font-medium mb-8">
            Révolutionnez votre pratique sportive
          </div>

          {/* Titre principal */}
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-[#2E2E2E] mb-6 leading-tight">
            Connectez-vous au
            <span className="text-[#0000FF] block">
              sport urbain
            </span>
          </h1>

          {/* Description */}
          <p className="text-xl md:text-2xl text-[#2E2E2E]/70 mb-12 max-w-3xl mx-auto leading-relaxed">
            Découvrez, explorez et validez vos sessions sportives dans toute la ville. 
            Une expérience gamifiée qui transforme chaque entraînement en aventure.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            {user ? (
              <Link href="/dashboard">
                <Button size="lg" className="px-8 py-4 text-lg">
                  Accéder au Dashboard
                </Button>
              </Link>
            ) : (
              <>
                <Link href="/register">
                  <Button size="lg" className="px-8 py-4 text-lg">
                    Commencer l'aventure
                  </Button>
                </Link>
                <Link href="/login">
                  <Button variant="outline" size="lg" className="px-8 py-4 text-lg">
                    Se connecter
                  </Button>
                </Link>
              </>
            )}
          </div>

          {/* Stats rapides */}
          <div className="mt-16 grid grid-cols-1 md:grid-cols-2 gap-8 max-w-lg mx-auto">
            <div className="text-center">
              <div className="text-3xl font-bold text-[#0000FF] mb-2">50+</div>
              <div className="text-[#2E2E2E]/70">Infrastructures</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-[#0000FF] mb-2">15+</div>
              <div className="text-[#2E2E2E]/70">Partenaires</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;