import React, { useEffect } from 'react';
import { useRouter } from 'next/router';
import { Building2, User as UserIcon, Mail, Calendar, Award, Plus, Settings, BarChart3, Users, MapPin, Clock } from 'lucide-react';
import Layout from '../../components/layout/Layout';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import { useAuthContext } from '../../contexts/AuthContext';

export default function PartnerDashboard() {
  const { user, isAuthenticated, isLoading, logout } = useAuthContext();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, isLoading, router]);

  // Vérifier que l'utilisateur est bien un partenaire
  useEffect(() => {
    if (!isLoading && isAuthenticated && user && user.userType !== 'provider') {
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

  if (!isAuthenticated || !user || user.userType !== 'provider') {
    return null;
  }

  return (
    <Layout>
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        {/* En-tête de bienvenue partenaire */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Bienvenue, {user.name}! 
          </h1>
          <p className="text-gray-600">
            Gérez votre infrastructure sportive et vos services
          </p>
          
          {/* Informations de l'entreprise */}
          <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                  <Building2 className="h-5 w-5 text-blue-600" />
                </div>
              </div>
              <div className="ml-3">
                <h3 className="text-lg font-medium text-blue-800">
                  {user.companyName}
                </h3>
                <p className="text-sm text-blue-600">
                  {user.description || 'Infrastructure sportive professionnelle'}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Statistiques du partenaire */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Services actifs */}
          <Card className="text-center">
            <Card.Body>
              <div className="flex items-center justify-center w-12 h-12 bg-green-100 rounded-full mx-auto mb-4">
                <Settings className="h-6 w-6 text-green-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Services</h3>
              <p className="text-3xl font-bold text-green-600">5</p>
              <p className="text-sm text-gray-500 mt-1">Services actifs</p>
            </Card.Body>
          </Card>

          {/* Réservations ce mois */}
          <Card className="text-center">
            <Card.Body>
              <div className="flex items-center justify-center w-12 h-12 bg-blue-100 rounded-full mx-auto mb-4">
                <Calendar className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Ce mois</h3>
              <p className="text-3xl font-bold text-blue-600">127</p>
              <p className="text-sm text-gray-500 mt-1">Réservations</p>
            </Card.Body>
          </Card>

          {/* Clients actifs */}
          <Card className="text-center">
            <Card.Body>
              <div className="flex items-center justify-center w-12 h-12 bg-purple-100 rounded-full mx-auto mb-4">
                <Users className="h-6 w-6 text-purple-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Clients</h3>
              <p className="text-3xl font-bold text-purple-600">89</p>
              <p className="text-sm text-gray-500 mt-1">Clients actifs</p>
            </Card.Body>
          </Card>

          {/* Note moyenne */}
          <Card className="text-center">
            <Card.Body>
              <div className="flex items-center justify-center w-12 h-12 bg-yellow-100 rounded-full mx-auto mb-4">
                <Award className="h-6 w-6 text-yellow-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Satisfaction</h3>
              <p className="text-3xl font-bold text-yellow-600">4.9</p>
              <p className="text-sm text-gray-500 mt-1">Note moyenne</p>
            </Card.Body>
          </Card>
        </div>

        {/* Gestion des services */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Gestion des services */}
          <Card>
            <Card.Header>
              <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                <Settings className="h-5 w-5 mr-2" />
                Gestion des services
              </h3>
            </Card.Header>
            <Card.Body>
              <p className="text-gray-600 mb-4">
                Créez et gérez vos services sportifs
              </p>
              <div className="space-y-3">
                <Button
                  variant="primary"
                  className="w-full"
                  onClick={() => router.push('/services/create')}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Créer un nouveau service
                </Button>
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => router.push('/services/manage')}
                >
                  <Settings className="h-4 w-4 mr-2" />
                  Gérer mes services
                </Button>
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => router.push('/services/schedule')}
                >
                  <Clock className="h-4 w-4 mr-2" />
                  Planification
                </Button>
              </div>
            </Card.Body>
          </Card>

          {/* Réservations et clients */}
          <Card>
            <Card.Header>
              <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                <Users className="h-5 w-5 mr-2" />
                Réservations & Clients
              </h3>
            </Card.Header>
            <Card.Body>
              <p className="text-gray-600 mb-4">
                Suivez vos réservations et gérez vos clients
              </p>
              <div className="space-y-3">
                <Button
                  variant="primary"
                  className="w-full"
                  onClick={() => router.push('/bookings/manage')}
                >
                  <Calendar className="h-4 w-4 mr-2" />
                  Gérer les réservations
                </Button>
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => router.push('/clients')}
                >
                  <Users className="h-4 w-4 mr-2" />
                  Base clients
                </Button>
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => router.push('/reviews')}
                >
                  <Award className="h-4 w-4 mr-2" />
                  Avis et évaluations
                </Button>
              </div>
            </Card.Body>
          </Card>
        </div>

        {/* Analytiques et infrastructure */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Analytiques */}
          <Card>
            <Card.Header>
              <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                <BarChart3 className="h-5 w-5 mr-2" />
                Analytiques
              </h3>
            </Card.Header>
            <Card.Body>
              <p className="text-gray-600 mb-4">
                Analysez les performances de votre infrastructure
              </p>
              <div className="space-y-3">
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => router.push('/analytics/revenue')}
                >
                  <BarChart3 className="h-4 w-4 mr-2" />
                  Revenus et statistiques
                </Button>
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => router.push('/analytics/usage')}
                >
                  <Clock className="h-4 w-4 mr-2" />
                  Utilisation des services
                </Button>
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => router.push('/analytics/trends')}
                >
                  <BarChart3 className="h-4 w-4 mr-2" />
                  Tendances
                </Button>
              </div>
            </Card.Body>
          </Card>

          {/* Infrastructure */}
          <Card>
            <Card.Header>
              <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                <Building2 className="h-5 w-5 mr-2" />
                Infrastructure
              </h3>
            </Card.Header>
            <Card.Body>
              <p className="text-gray-600 mb-4">
                Gérez votre infrastructure sportive
              </p>
              <div className="space-y-3">
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => router.push('/infrastructure/facilities')}
                >
                  <Building2 className="h-4 w-4 mr-2" />
                  Installations
                </Button>
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => router.push('/infrastructure/equipment')}
                >
                  <Settings className="h-4 w-4 mr-2" />
                  Équipements
                </Button>
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => router.push('/infrastructure/maintenance')}
                >
                  <Clock className="h-4 w-4 mr-2" />
                  Maintenance
                </Button>
              </div>
            </Card.Body>
          </Card>
        </div>

        {/* Profil partenaire */}
        <Card>
          <Card.Header>
            <h3 className="text-lg font-semibold text-gray-900 flex items-center">
              <UserIcon className="h-5 w-5 mr-2" />
              Profil partenaire
            </h3>
          </Card.Header>
          <Card.Body>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Informations de l'entreprise */}
              <div className="space-y-3">
                <h4 className="font-medium text-gray-900">Informations de l'entreprise</h4>
                <div className="space-y-2">
                  <div className="flex items-center">
                    <Building2 className="h-4 w-4 text-gray-400 mr-2" />
                    <span className="text-sm text-gray-600">Entreprise:</span>
                    <span className="ml-2 font-medium">{user.companyName}</span>
                  </div>
                  <div className="flex items-center">
                    <UserIcon className="h-4 w-4 text-gray-400 mr-2" />
                    <span className="text-sm text-gray-600">Contact:</span>
                    <span className="ml-2 font-medium">{user.name}</span>
                  </div>
                  <div className="flex items-center">
                    <Mail className="h-4 w-4 text-gray-400 mr-2" />
                    <span className="text-sm text-gray-600">Email:</span>
                    <span className="ml-2 font-medium">{user.email}</span>
                  </div>
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 text-gray-400 mr-2" />
                    <span className="text-sm text-gray-600">Partenaire depuis:</span>
                    <span className="ml-2 font-medium">
                      {new Date(user.createdAt).toLocaleDateString('fr-FR')}
                    </span>
                  </div>
                </div>
              </div>

              {/* Actions du profil */}
              <div className="space-y-3">
                <h4 className="font-medium text-gray-900">Gestion du compte</h4>
                <div className="space-y-2">
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => router.push('/profile/partner/edit')}
                  >
                    Modifier le profil
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => router.push('/profile/partner/settings')}
                  >
                    Paramètres
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => router.push('/support')}
                  >
                    Support partenaire
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