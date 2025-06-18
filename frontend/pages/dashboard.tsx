'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/router';
import { Trophy, User as UserIcon, Mail, Calendar, Award } from 'lucide-react';
import Layout from '../components/layout/Layout';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import { useAuthContext } from '../contexts/AuthContext';

export default function Dashboard() {
  const { user, isAuthenticated, isLoading, logout } = useAuthContext();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, isLoading, router]);

  // Redirection automatique basée sur le type d'utilisateur
  useEffect(() => {
    if (!isLoading && isAuthenticated && user) {
      // Rediriger les partenaires vers leur dashboard spécialisé
      if (user.userType === 'provider' && router.pathname === '/dashboard') {
        router.push('/dashboard/partner');
        return;
      }
      // Rediriger les joueurs vers leur dashboard spécialisé
      if (user.userType === 'user' && router.pathname === '/dashboard') {
        router.push('/dashboard/player');
        return;
      }
    }
  }, [isAuthenticated, isLoading, user, router]);

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  if (isLoading) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-[calc(100vh-4rem)]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Chargement...</p>
          </div>
        </div>
      </Layout>
    );
  }

  if (!isAuthenticated || !user) {
    return null;
  }

  return (
    <Layout>
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        {/* En-tête de bienvenue */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Bienvenue, {user.name}! 
          </h1>
          <p className="text-gray-600">
            {user.userType === 'provider' 
              ? 'Gérez vos services sportifs et suivez votre activité'
              : 'Voici un aperçu de votre compte SportEra'
            }
          </p>
          {user.userType === 'provider' && (
            <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <span className="text-blue-600 font-semibold text-sm">P</span>
                  </div>
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-blue-800">
                    Compte Partenaire - {user.companyName}
                  </h3>
                  <p className="text-sm text-blue-600">
                    {user.description}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Grille de cartes */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {/* Carte Points */}
          <Card className="text-center">
            <Card.Body>
              <div className="flex items-center justify-center w-12 h-12 bg-blue-100 rounded-full mx-auto mb-4">
                <Trophy className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Points</h3>
              <p className="text-3xl font-bold text-blue-600">{user.points}</p>
              <p className="text-sm text-gray-500 mt-1">Points accumulés</p>
            </Card.Body>
          </Card>

          {/* Carte Profil */}
          <Card>
            <Card.Header>
              <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                <UserIcon className="h-5 w-5 mr-2" />
                Informations du profil
              </h3>
            </Card.Header>
            <Card.Body className="space-y-3">
              <div className="flex items-center">
                <UserIcon className="h-4 w-4 text-gray-400 mr-2" />
                <span className="text-sm text-gray-600">Nom:</span>
                <span className="ml-2 font-medium">{user.name}</span>
              </div>
              <div className="flex items-center">
                <Mail className="h-4 w-4 text-gray-400 mr-2" />
                <span className="text-sm text-gray-600">Email:</span>
                <span className="ml-2 font-medium">{user.email}</span>
              </div>
              <div className="flex items-center">
                <Calendar className="h-4 w-4 text-gray-400 mr-2" />
                <span className="text-sm text-gray-600">Membre depuis:</span>
                <span className="ml-2 font-medium">
                  {new Date(user.createdAt).toLocaleDateString('fr-FR')}
                </span>
              </div>
            </Card.Body>
          </Card>

          {/* Carte Statistiques */}
          <Card className="text-center">
            <Card.Body>
              <div className="flex items-center justify-center w-12 h-12 bg-green-100 rounded-full mx-auto mb-4">
                <Award className="h-6 w-6 text-green-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Niveau</h3>
              <p className="text-2xl font-bold text-green-600">
                {user.points >= 1000 ? 'Expert' : user.points >= 500 ? 'Avancé' : 'Débutant'}
              </p>
              <p className="text-sm text-gray-500 mt-1">
                {user.points >= 1000 ? 'Félicitations!' : `${1000 - user.points} points pour Expert`}
              </p>
            </Card.Body>
          </Card>
        </div>

        {/* Actions rapides */}
        <Card>
          <Card.Header>
            <h3 className="text-lg font-semibold text-gray-900">
              {user.userType === 'provider' ? 'Gestion partenaire' : 'Actions rapides'}
            </h3>
          </Card.Header>
          <Card.Body>
            {user.userType === 'provider' ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <Button
                  variant="primary"
                  className="w-full"
                  onClick={() => router.push('/services/create')}
                >
                  Créer un service
                </Button>
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => router.push('/services/manage')}
                >
                  Gérer mes services
                </Button>
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => router.push('/bookings')}
                >
                  Réservations
                </Button>
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => router.push('/profile')}
                >
                  Profil partenaire
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <Button
                  variant="primary"
                  className="w-full"
                  onClick={() => router.push('/services/search')}
                >
                  Rechercher services
                </Button>
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => router.push('/profile')}
                >
                  Modifier le profil
                </Button>
                <Button
                   variant="outline"
                   className="w-full"
                   onClick={() => router.push('/activities')}
                 >
                   Mes activités
                 </Button>
                 <Button
                   variant="outline"
                   className="w-full"
                   onClick={() => router.push('/leaderboard')}
                 >
                   Classement
                 </Button>
               </div>
             )}
             
             {/* Bouton de déconnexion pour tous les types d'utilisateurs */}
             <div className="mt-6 pt-6 border-t border-gray-200">
               <Button
                 variant="danger"
                 className="w-full"
                 onClick={handleLogout}
               >
                 Se déconnecter
               </Button>
             </div>
          </Card.Body>
        </Card>
      </div>
    </Layout>
  );
}