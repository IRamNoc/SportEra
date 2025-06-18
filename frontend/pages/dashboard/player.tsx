import React, { useEffect } from 'react';
import { useRouter } from 'next/router';
import { Trophy, User as UserIcon, Mail, Calendar, Award, Search, MapPin, Clock, Star } from 'lucide-react';
import Layout from '../../components/layout/Layout';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import { useAuthContext } from '../../contexts/AuthContext';

export default function PlayerDashboard() {
  const { user, isAuthenticated, isLoading, logout } = useAuthContext();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, isLoading, router]);

  // Vérifier que l'utilisateur est bien un joueur
  useEffect(() => {
    if (!isLoading && isAuthenticated && user && user.userType !== 'user') {
      router.push('/dashboard');
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

  if (!isAuthenticated || !user || user.userType !== 'user') {
    return null;
  }

  return (
    <Layout>
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        {/* En-tête de bienvenue */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Bienvenue, {user.name}! 🏃‍♂️
          </h1>
          <p className="text-gray-600">
            Découvrez et réservez des activités sportives près de chez vous
          </p>
        </div>

        {/* Statistiques du joueur */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Points */}
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

          {/* Niveau */}
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

          {/* Activités cette semaine */}
          <Card className="text-center">
            <Card.Body>
              <div className="flex items-center justify-center w-12 h-12 bg-purple-100 rounded-full mx-auto mb-4">
                <Clock className="h-6 w-6 text-purple-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Cette semaine</h3>
              <p className="text-3xl font-bold text-purple-600">3</p>
              <p className="text-sm text-gray-500 mt-1">Activités réservées</p>
            </Card.Body>
          </Card>

          {/* Note moyenne */}
          <Card className="text-center">
            <Card.Body>
              <div className="flex items-center justify-center w-12 h-12 bg-yellow-100 rounded-full mx-auto mb-4">
                <Star className="h-6 w-6 text-yellow-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Satisfaction</h3>
              <p className="text-3xl font-bold text-yellow-600">4.8</p>
              <p className="text-sm text-gray-500 mt-1">Note moyenne</p>
            </Card.Body>
          </Card>
        </div>

        {/* Actions rapides pour joueurs */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Recherche d'activités */}
          <Card>
            <Card.Header>
              <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                <Search className="h-5 w-5 mr-2" />
                Trouver une activité
              </h3>
            </Card.Header>
            <Card.Body>
              <p className="text-gray-600 mb-4">
                Découvrez des activités sportives près de chez vous
              </p>
              <div className="space-y-3">
                <Button
                  variant="primary"
                  className="w-full"
                  onClick={() => router.push('/services/search')}
                >
                  <Search className="h-4 w-4 mr-2" />
                  Rechercher des activités
                </Button>
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => router.push('/services/nearby')}
                >
                  <MapPin className="h-4 w-4 mr-2" />
                  Activités à proximité
                </Button>
              </div>
            </Card.Body>
          </Card>

          {/* Mes réservations */}
          <Card>
            <Card.Header>
              <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                <Calendar className="h-5 w-5 mr-2" />
                Mes réservations
              </h3>
            </Card.Header>
            <Card.Body>
              <p className="text-gray-600 mb-4">
                Gérez vos activités réservées et votre historique
              </p>
              <div className="space-y-3">
                <Button
                  variant="primary"
                  className="w-full"
                  onClick={() => router.push('/bookings/current')}
                >
                  <Calendar className="h-4 w-4 mr-2" />
                  Réservations en cours
                </Button>
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => router.push('/bookings/history')}
                >
                  <Clock className="h-4 w-4 mr-2" />
                  Historique
                </Button>
              </div>
            </Card.Body>
          </Card>
        </div>

        {/* Profil et paramètres */}
        <Card>
          <Card.Header>
            <h3 className="text-lg font-semibold text-gray-900 flex items-center">
              <UserIcon className="h-5 w-5 mr-2" />
              Mon profil
            </h3>
          </Card.Header>
          <Card.Body>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Informations personnelles */}
              <div className="space-y-3">
                <h4 className="font-medium text-gray-900">Informations personnelles</h4>
                <div className="space-y-2">
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
                </div>
              </div>

              {/* Actions du profil */}
              <div className="space-y-3">
                <h4 className="font-medium text-gray-900">Actions</h4>
                <div className="space-y-2">
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => router.push('/profile/edit')}
                  >
                    Modifier le profil
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => router.push('/leaderboard')}
                  >
                    Voir le classement
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => router.push('/achievements')}
                  >
                    Mes récompenses
                  </Button>
                </div>
              </div>
            </div>

            {/* Bouton de déconnexion */}
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