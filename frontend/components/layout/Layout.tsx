// Composant de layout principal
// Structure de base pour toutes les pages de l'application

'use client';

import React, { ReactNode } from 'react';
import Navbar from './Navbar';

interface LayoutProps {
  children: ReactNode;
  showNavbar?: boolean;
  className?: string;
  containerClassName?: string;
}

const Layout: React.FC<LayoutProps> = ({
  children,
  showNavbar = true,
  className = '',
  containerClassName = ''
}) => {
  return (
    <div className={`min-h-screen bg-gray-50 ${className}`}>
      {/* Barre de navigation */}
      {showNavbar && <Navbar />}
      
      {/* Contenu principal */}
      <main className={`${showNavbar ? 'pt-0' : ''} ${containerClassName}`}>
        {children}
      </main>
    </div>
  );
};

export default Layout;