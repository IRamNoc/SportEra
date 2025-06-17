// Composant de barre de navigation
// Barre de navigation refactorisée avec gestion d'authentification

'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Menu, X, User, LogOut, Settings, Trophy } from 'lucide-react';
import Button from '../ui/Button';
import { useAuthContext } from '../../contexts/AuthContext';

interface NavbarProps {
  className?: string;
}

const Navbar: React.FC<NavbarProps> = ({ className = '' }) => {
  const router = useRouter();
  const { user, isAuthenticated, logout } = useAuthContext();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  // Navigation vers différentes pages
  const navigateTo = (path: string) => {
    router.push(path);
    setIsMobileMenuOpen(false);
    setIsUserMenuOpen(false);
  };

  // Gestion de la déconnexion
  const handleLogout = () => {
    logout();
    setIsUserMenuOpen(false);
    router.push('/');
  };

  // Basculer le menu mobile
  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(prev => !prev);
  };

  // Basculer le menu utilisateur
  const toggleUserMenu = () => {
    setIsUserMenuOpen(prev => !prev);
  };

  return (
    <nav className={`bg-white shadow-lg border-b border-gray-200 ${className}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo et titre */}
          <div className="flex items-center">
            <button
              onClick={() => navigateTo('/')}
              className="flex items-center space-x-2 text-xl font-bold text-blue-600 hover:text-blue-800 transition-colors"
            >
              <Trophy className="h-8 w-8" />
              <span>Sport'Era</span>
            </button>
          </div>

          {/* Navigation desktop */}
          <div className="hidden md:flex items-center space-x-4">
            {isAuthenticated ? (
              <>
                {/* Menu utilisateur connecté */}
                <div className="relative">
                  <button
                    onClick={toggleUserMenu}
                    className="flex items-center space-x-2 text-gray-700 hover:text-gray-900 px-3 py-2 rounded-md transition-colors"
                  >
                    <User className="h-5 w-5" />
                    <span className="font-medium">{user?.name}</span>
                    <span className="text-sm text-gray-500">({user?.points} pts)</span>
                  </button>

                  {/* Dropdown menu utilisateur */}
                  {isUserMenuOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50 border border-gray-200">
                      <button
                        onClick={() => navigateTo('/dashboard')}
                        className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                      >
                        <User className="h-4 w-4 mr-2" />
                        Tableau de bord
                      </button>
                      <button
                        onClick={() => navigateTo('/profile')}
                        className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                      >
                        <Settings className="h-4 w-4 mr-2" />
                        Profil
                      </button>
                      <hr className="my-1" />
                      <button
                        onClick={handleLogout}
                        className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                      >
                        <LogOut className="h-4 w-4 mr-2" />
                        Déconnexion
                      </button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <>
                {/* Boutons pour utilisateur non connecté */}
                <Button
                  variant="outline"
                  onClick={() => navigateTo('/login')}
                >
                  Connexion
                </Button>
                <Button
                  variant="primary"
                  onClick={() => navigateTo('/register')}
                >
                  Inscription
                </Button>
              </>
            )}
          </div>

          {/* Bouton menu mobile */}
          <div className="md:hidden">
            <button
              onClick={toggleMobileMenu}
              className="text-gray-700 hover:text-gray-900 p-2"
            >
              {isMobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>

        {/* Menu mobile */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-gray-200 py-4">
            {isAuthenticated ? (
              <>
                {/* Menu mobile pour utilisateur connecté */}
                <div className="space-y-2">
                  <div className="px-4 py-2 text-sm text-gray-600">
                    Connecté en tant que <span className="font-medium">{user?.name}</span>
                    <br />
                    <span className="text-blue-600">{user?.points} points</span>
                  </div>
                  
                  <button
                    onClick={() => navigateTo('/dashboard')}
                    className="flex items-center w-full px-4 py-2 text-gray-700 hover:bg-gray-100 transition-colors"
                  >
                    <User className="h-4 w-4 mr-2" />
                    Tableau de bord
                  </button>
                  
                  <button
                    onClick={() => navigateTo('/profile')}
                    className="flex items-center w-full px-4 py-2 text-gray-700 hover:bg-gray-100 transition-colors"
                  >
                    <Settings className="h-4 w-4 mr-2" />
                    Profil
                  </button>
                  
                  <button
                    onClick={handleLogout}
                    className="flex items-center w-full px-4 py-2 text-red-600 hover:bg-red-50 transition-colors"
                  >
                    <LogOut className="h-4 w-4 mr-2" />
                    Déconnexion
                  </button>
                </div>
              </>
            ) : (
              <>
                {/* Menu mobile pour utilisateur non connecté */}
                <div className="space-y-2 px-4">
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => navigateTo('/login')}
                  >
                    Connexion
                  </Button>
                  <Button
                    variant="primary"
                    className="w-full"
                    onClick={() => navigateTo('/register')}
                  >
                    Inscription
                  </Button>
                </div>
              </>
            )}
          </div>
        )}
      </div>

      {/* Overlay pour fermer les menus en cliquant à l'extérieur */}
      {(isMobileMenuOpen || isUserMenuOpen) && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => {
            setIsMobileMenuOpen(false);
            setIsUserMenuOpen(false);
          }}
        />
      )}
    </nav>
  );
};

export default Navbar;