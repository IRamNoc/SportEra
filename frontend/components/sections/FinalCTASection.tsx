import React from 'react';
import Button from '../ui/Button';
import { ArrowRight, Download, Smartphone } from 'lucide-react';
import useAuth from '../../hooks/useAuth';
import Link from 'next/link';

const FinalCTASection: React.FC = () => {
  const { user } = useAuth();

  return (
    <section className="py-20 bg-gradient-to-br from-gray-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          {/* En-tête */}
          <div className="mb-12">
            <h2 className="text-3xl md:text-5xl font-bold text-[#2E2E2E] mb-6">
              Prêt à révolutionner
              <span className="text-[#0000FF] block">
                votre pratique sportive ?
              </span>
            </h2>
            <p className="text-xl text-[#2E2E2E]/70 max-w-2xl mx-auto leading-relaxed">
              Rejoignez la communauté Sport'Era dès aujourd'hui et découvrez 
              une nouvelle façon de faire du sport en ville.
            </p>
          </div>

          {/* Actions principales */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
            {user ? (
              <Link href="/dashboard">
                <Button size="lg" className="px-8 py-4 text-lg group">
                  Accéder au Dashboard
                  <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                </Button>
              </Link>
            ) : (
              <>
                <Link href="/register">
                  <Button size="lg" className="px-8 py-4 text-lg group">
                    Commencer gratuitement
                    <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
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

          {/* Avantages rapides */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <div className="flex items-center justify-center space-x-3 p-4 bg-white rounded-lg shadow-sm">
              <div className="w-10 h-10 bg-[#0000FF]/10 rounded-lg flex items-center justify-center">
                <Smartphone className="h-5 w-5 text-[#0000FF]" />
              </div>
              <div className="text-left">
                <div className="font-semibold text-[#2E2E2E]">100% Gratuit</div>
                <div className="text-sm text-[#2E2E2E]/70">Aucun frais caché</div>
              </div>
            </div>
            
            <div className="flex items-center justify-center space-x-3 p-4 bg-white rounded-lg shadow-sm">
              <div className="w-10 h-10 bg-[#0000FF]/10 rounded-lg flex items-center justify-center">
                <Download className="h-5 w-5 text-[#0000FF]" />
              </div>
              <div className="text-left">
                <div className="font-semibold text-[#2E2E2E]">Installation rapide</div>
                <div className="text-sm text-[#2E2E2E]/70">Prêt en 2 minutes</div>
              </div>
            </div>
            
            <div className="flex items-center justify-center space-x-3 p-4 bg-white rounded-lg shadow-sm">
              <div className="w-10 h-10 bg-[#0000FF]/10 rounded-lg flex items-center justify-center">
                <ArrowRight className="h-5 w-5 text-[#0000FF]" />
              </div>
              <div className="text-left">
                <div className="font-semibold text-[#2E2E2E]">Résultats immédiats</div>
                <div className="text-sm text-[#2E2E2E]/70">Dès la première session</div>
              </div>
            </div>
          </div>



          {/* Note de confiance */}
          <div className="mt-8 text-center">
            <p className="text-[#2E2E2E]/60 text-sm">
              Rejoignez plus de 15 000 sportifs qui nous font confiance • 
              Données sécurisées • Support 24/7
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FinalCTASection;