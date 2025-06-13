import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import Image from 'next/image';
import { Activity, MapPin, QrCode, Trophy, User, LogOut, Star, Calendar, Target, Zap } from 'lucide-react';
import Navbar from '../components/Navbar';

interface UserData {
  id: string;
  name: string;
  email: string;
  points?: number;
}

export default function Dashboard() {
  const [user, setUser] = useState<UserData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Check if user is authenticated
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');

    if (!token || !userData) {
      router.push('/login');
      return;
    }

    try {
      const parsedUser = JSON.parse(userData);
      setUser(parsedUser);
    } catch (error) {
      console.error('Error parsing user data:', error);
      router.push('/login');
    } finally {
      setIsLoading(false);
    }
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    router.push('/');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white flex items-center justify-center">
        <div className="text-center">
          <Activity className="h-12 w-12 text-blue-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Chargement...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <Navbar />

      {/* Main Content */}
      <main className="pt-16 max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          {/* Header */}
          <div className="mb-8 text-center">
            <div className="flex justify-center mb-4">
              <Image 
                src="/logo-blue.svg" 
                alt="Sport'Era Logo" 
                width={60} 
                height={60}
                className="animate-float"
              />
            </div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">Bienvenue, {user?.name} !</h1>
            <p className="text-xl text-gray-600">Votre espace Sport'Era vous attend</p>
          </div>
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-white overflow-hidden shadow-xl rounded-2xl border border-gray-100 hover:shadow-2xl transition-all duration-300 hover:scale-105">
              <div className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-semibold text-gray-600 uppercase tracking-wide">
                      Points fidélité
                    </p>
                    <p className="text-3xl font-bold text-gray-900 mt-2">
                      {user?.points || 0}
                    </p>
                  </div>
                  <div className="p-3 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-xl">
                    <Trophy className="h-8 w-8 text-white" />
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white overflow-hidden shadow-xl rounded-2xl border border-gray-100 hover:shadow-2xl transition-all duration-300 hover:scale-105">
              <div className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-semibold text-gray-600 uppercase tracking-wide">
                      Sessions
                    </p>
                    <p className="text-3xl font-bold text-gray-900 mt-2">
                      {user?.sessionsCount || 0}
                    </p>
                  </div>
                  <div className="p-3 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl">
                    <QrCode className="h-8 w-8 text-white" />
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white overflow-hidden shadow-xl rounded-2xl border border-gray-100 hover:shadow-2xl transition-all duration-300 hover:scale-105">
              <div className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-semibold text-gray-600 uppercase tracking-wide">
                      Lieux visités
                    </p>
                    <p className="text-3xl font-bold text-gray-900 mt-2">
                      {user?.placesVisited || 0}
                    </p>
                  </div>
                  <div className="p-3 bg-gradient-to-br from-green-500 to-teal-600 rounded-xl">
                    <MapPin className="h-8 w-8 text-white" />
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white overflow-hidden shadow-xl rounded-2xl border border-gray-100 hover:shadow-2xl transition-all duration-300 hover:scale-105">
              <div className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-semibold text-gray-600 uppercase tracking-wide">
                      Niveau
                    </p>
                    <p className="text-3xl font-bold text-gray-900 mt-2">
                      {Math.floor((user?.points || 0) / 100) + 1}
                    </p>
                  </div>
                  <div className="p-3 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl">
                    <Star className="h-8 w-8 text-white" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="bg-white overflow-hidden shadow-xl rounded-2xl border border-gray-100">
              <div className="p-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                  <Zap className="h-6 w-6 text-blue-500 mr-2" />
                  Actions rapides
                </h3>
                <div className="space-y-4">
                  <Link
                    href="/map"
                    className="flex items-center p-4 border-2 border-gray-200 rounded-xl hover:border-blue-500 hover:bg-blue-50 transition-all duration-300 group"
                  >
                    <div className="p-3 bg-blue-100 rounded-xl group-hover:bg-blue-200 transition-colors">
                      <MapPin className="h-6 w-6 text-blue-600" />
                    </div>
                    <div className="ml-4">
                      <p className="font-semibold text-gray-900">Explorer la carte</p>
                      <p className="text-sm text-gray-500">Découvrez les infrastructures près de vous</p>
                    </div>
                  </Link>
                  <Link
                    href="/scan"
                    className="flex items-center p-4 border-2 border-gray-200 rounded-xl hover:border-green-500 hover:bg-green-50 transition-all duration-300 group"
                  >
                    <div className="p-3 bg-green-100 rounded-xl group-hover:bg-green-200 transition-colors">
                      <QrCode className="h-6 w-6 text-green-600" />
                    </div>
                    <div className="ml-4">
                      <p className="font-semibold text-gray-900">Scanner un QR code</p>
                      <p className="text-sm text-gray-500">Gagnez des points en validant votre session</p>
                    </div>
                  </Link>
                  <Link
                    href="/profile"
                    className="flex items-center p-4 border-2 border-gray-200 rounded-xl hover:border-purple-500 hover:bg-purple-50 transition-all duration-300 group"
                  >
                    <div className="p-3 bg-purple-100 rounded-xl group-hover:bg-purple-200 transition-colors">
                      <User className="h-6 w-6 text-purple-600" />
                    </div>
                    <div className="ml-4">
                      <p className="font-semibold text-gray-900">Mon profil</p>
                      <p className="text-sm text-gray-500">Gérez vos informations personnelles</p>
                    </div>
                  </Link>
                </div>
              </div>
            </div>

            <div className="bg-white overflow-hidden shadow-xl rounded-2xl border border-gray-100">
              <div className="p-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                  <Calendar className="h-6 w-6 text-purple-500 mr-2" />
                  Activité récente
                </h3>
                <div className="text-center py-12">
                  <div className="p-4 bg-gray-100 rounded-full w-20 h-20 mx-auto mb-4 flex items-center justify-center">
                    <Activity className="h-10 w-10 text-gray-400" />
                  </div>
                  <h4 className="text-lg font-semibold text-gray-900 mb-2">Aucune activité récente</h4>
                  <p className="text-gray-500 mb-4">Commencez votre aventure Sport'Era dès maintenant !</p>
                  <Link
                    href="/scan"
                    className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors"
                  >
                    <QrCode className="h-4 w-4 mr-2" />
                    Scanner mon premier QR code
                  </Link>
                </div>
              </div>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}