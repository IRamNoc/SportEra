import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { User, LogOut, Menu, X } from 'lucide-react';

interface NavbarProps {
  user?: {
    name: string;
    email: string;
  } | null;
  onLogout?: () => void;
}

export default function Navbar({ user, onLogout }: NavbarProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 bg-white/95 backdrop-blur-sm shadow-lg z-50 border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-3 hover:opacity-80 transition-opacity">
            <Image 
              src="/logo-white.svg" 
              alt="Sport'Era Logo" 
              width={40} 
              height={40}
              className="animate-pulse-glow"
            />
            <span className="text-xl font-bold text-gray-900">Sport'Era</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            {user ? (
              <>
                <Link
                  href="/dashboard"
                  className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-lg text-sm font-medium transition-colors hover:bg-blue-50"
                >
                  Tableau de bord
                </Link>
                <div className="flex items-center space-x-3 px-3 py-2 bg-gray-50 rounded-lg">
                  <User className="h-4 w-4 text-gray-600" />
                  <span className="text-sm text-gray-700 font-medium">{user.name}</span>
                </div>
                <button
                  onClick={onLogout}
                  className="flex items-center space-x-2 text-gray-700 hover:text-red-600 px-3 py-2 rounded-lg text-sm font-medium transition-colors hover:bg-red-50"
                >
                  <LogOut className="h-4 w-4" />
                  <span>Déconnexion</span>
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className="text-gray-700 hover:text-blue-600 px-4 py-2 rounded-lg text-sm font-medium transition-colors hover:bg-blue-50"
                >
                  Se connecter
                </Link>
                <Link
                  href="/signup"
                  className="gradient-primary text-white px-4 py-2 rounded-lg text-sm font-medium hover:scale-105 transition-all duration-300 shadow-md"
                >
                  S'inscrire
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-700 hover:text-blue-600 p-2 rounded-lg transition-colors"
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-200">
            {user ? (
              <div className="space-y-3">
                <div className="flex items-center space-x-3 px-3 py-2 bg-gray-50 rounded-lg">
                  <User className="h-4 w-4 text-gray-600" />
                  <span className="text-sm text-gray-700 font-medium">{user.name}</span>
                </div>
                <Link
                  href="/dashboard"
                  className="block text-gray-700 hover:text-blue-600 px-3 py-2 rounded-lg text-sm font-medium transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Tableau de bord
                </Link>
                <button
                  onClick={() => {
                    onLogout?.();
                    setIsMenuOpen(false);
                  }}
                  className="flex items-center space-x-2 text-gray-700 hover:text-red-600 px-3 py-2 rounded-lg text-sm font-medium transition-colors w-full"
                >
                  <LogOut className="h-4 w-4" />
                  <span>Déconnexion</span>
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                <Link
                  href="/login"
                  className="block text-gray-700 hover:text-blue-600 px-3 py-2 rounded-lg text-sm font-medium transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Se connecter
                </Link>
                <Link
                  href="/signup"
                  className="block gradient-primary text-white px-3 py-2 rounded-lg text-sm font-medium text-center"
                  onClick={() => setIsMenuOpen(false)}
                >
                  S'inscrire
                </Link>
              </div>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}