'use client';

import React from 'react';
import { useRouter } from 'next/router';
import { Trophy, MapPin, QrCode, Users, Target, Award, Zap, Star } from 'lucide-react';
import Layout from '../components/layout/Layout';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import { useAuthContext } from '../contexts/AuthContext';

export default function Home() {
  const router = useRouter();
  const { isAuthenticated, user } = useAuthContext();

  const handleGetStarted = () => {
    if (isAuthenticated) {
      router.push('/dashboard');
    } else {
      router.push('/register');
    }
  };

  const handleLogin = () => {
    router.push('/login');
  };

  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <div className="flex justify-center mb-8">
              <div className="p-4 bg-blue-100 rounded-full">
                <Trophy className="h-16 w-16 text-blue-600" />
              </div>
            </div>
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
              Bienvenue sur <span className="text-blue-600">SportEra</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Découvrez et explorez les infrastructures sportives autour de vous. 
              Gagnez des points, relevez des défis et partagez vos expériences sportives.
            </p>
            
            {isAuthenticated ? (
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  variant="primary"
                  size="lg"
                  onClick={() => router.push('/dashboard')}
                  className="px-8 py-4 text-lg"
                >
                  Accéder au tableau de bord
                </Button>
                <div className="text-center">
                  <p className="text-gray-600">Connecté en tant que <span className="font-medium">{user?.name}</span></p>
                  <p className="text-blue-600 font-medium">{user?.points} points</p>
                </div>
              </div>
            ) : (
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  variant="primary"
                  size="lg"
                  onClick={handleGetStarted}
                  className="px-8 py-4 text-lg"
                >
                  Commencer l'aventure
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  onClick={handleLogin}
                  className="px-8 py-4 text-lg"
                >
                  Se connecter
                </Button>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Pourquoi choisir SportEra ?
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Une plateforme complète pour découvrir, explorer et profiter des infrastructures sportives
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="hover:shadow-xl transition-all duration-300 hover:scale-105 bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
              <Card.Body className="text-center">
                <div className="flex justify-center mb-4">
                  <div className="p-3 bg-blue-600 rounded-xl">
                    <MapPin className="h-8 w-8 text-white" />
                  </div>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">Carte interactive</h3>
                <p className="text-gray-600">
                  Explorez une carte détaillée des infrastructures sportives près de chez vous avec des informations en temps réel.
                </p>
              </Card.Body>
            </Card>
            
            <Card className="hover:shadow-xl transition-all duration-300 hover:scale-105 bg-gradient-to-br from-green-50 to-green-100 border-green-200">
              <Card.Body className="text-center">
                <div className="flex justify-center mb-4">
                  <div className="p-3 bg-green-600 rounded-xl">
                    <QrCode className="h-8 w-8 text-white" />
                  </div>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">QR Code Scanner</h3>
                <p className="text-gray-600">
                  Scannez les QR codes sur site pour valider vos sessions et gagner des points de fidélité.
                </p>
              </Card.Body>
            </Card>
            
            <Card className="hover:shadow-xl transition-all duration-300 hover:scale-105 bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
              <Card.Body className="text-center">
                <div className="flex justify-center mb-4">
                  <div className="p-3 bg-purple-600 rounded-xl">
                    <Trophy className="h-8 w-8 text-white" />
                  </div>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">Système de points</h3>
                <p className="text-gray-600">
                  Accumulez des points à chaque visite et débloquez des récompenses exclusives.
                </p>
              </Card.Body>
            </Card>
            
            <Card className="hover:shadow-xl transition-all duration-300 hover:scale-105 bg-gradient-to-br from-yellow-50 to-yellow-100 border-yellow-200">
              <Card.Body className="text-center">
                <div className="flex justify-center mb-4">
                  <div className="p-3 bg-yellow-600 rounded-xl">
                    <Users className="h-8 w-8 text-white" />
                  </div>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">Communauté</h3>
                <p className="text-gray-600">
                  Rejoignez une communauté active de sportifs et partagez vos expériences.
                </p>
              </Card.Body>
            </Card>
            
            <Card className="hover:shadow-xl transition-all duration-300 hover:scale-105 bg-gradient-to-br from-red-50 to-red-100 border-red-200">
              <Card.Body className="text-center">
                <div className="flex justify-center mb-4">
                  <div className="p-3 bg-red-600 rounded-xl">
                    <Target className="h-8 w-8 text-white" />
                  </div>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">Défis personnalisés</h3>
                <p className="text-gray-600">
                  Relevez des défis adaptés à votre niveau et à vos préférences sportives.
                </p>
              </Card.Body>
            </Card>
            
            <Card className="hover:shadow-xl transition-all duration-300 hover:scale-105 bg-gradient-to-br from-indigo-50 to-indigo-100 border-indigo-200">
              <Card.Body className="text-center">
                <div className="flex justify-center mb-4">
                  <div className="p-3 bg-indigo-600 rounded-xl">
                    <Award className="h-8 w-8 text-white" />
                  </div>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">Récompenses</h3>
                <p className="text-gray-600">
                  Débloquez des badges, des titres et des avantages exclusifs en progressant.
                </p>
              </Card.Body>
            </Card>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">
              SportEra en chiffres
            </h2>
            <p className="text-xl text-blue-100 max-w-2xl mx-auto">
              Rejoignez des milliers d'utilisateurs qui font déjà confiance à SportEra
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-4xl font-bold text-white mb-2">10K+</div>
              <div className="text-blue-100">Utilisateurs actifs</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-white mb-2">500+</div>
              <div className="text-blue-100">Infrastructures</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-white mb-2">50K+</div>
              <div className="text-blue-100">Sessions validées</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-white mb-2">25+</div>
              <div className="text-blue-100">Villes couvertes</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-gray-900 mb-6">
            Prêt à commencer votre aventure sportive ?
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            Rejoignez SportEra dès aujourd'hui et découvrez un nouveau monde d'opportunités sportives.
          </p>
          <Button
            variant="primary"
            size="lg"
            onClick={handleGetStarted}
            icon={Zap}
            iconPosition="left"
            className="px-8 py-4 text-lg"
          >
            {isAuthenticated ? 'Accéder au tableau de bord' : 'Commencer maintenant'}
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="flex items-center justify-center space-x-2 mb-4">
              <Trophy className="h-8 w-8 text-blue-400" />
              <span className="text-xl font-bold">SportEra</span>
            </div>
            <p className="text-gray-400 mb-4">
              Votre compagnon pour découvrir et explorer les infrastructures sportives.
            </p>
            <div className="flex justify-center space-x-6">
              <button className="text-gray-400 hover:text-white transition-colors">
                À propos
              </button>
              <button className="text-gray-400 hover:text-white transition-colors">
                Contact
              </button>
              <button className="text-gray-400 hover:text-white transition-colors">
                Confidentialité
              </button>
            </div>
            <div className="mt-8 pt-8 border-t border-gray-800 text-gray-400">
              <p>&copy; 2024 SportEra. Tous droits réservés.</p>
            </div>
          </div>
        </div>
      </footer>
    </Layout>
  );
}
