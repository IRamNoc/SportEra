// Composant de layout principal
// Structure de base pour toutes les pages de l'application

'use client';

import React, { ReactNode } from 'react';
import Header from './Header';
import Footer from './Footer';

interface LayoutProps {
  children: ReactNode;
  showHeader?: boolean;
  showFooter?: boolean;
  className?: string;
  containerClassName?: string;
}

const Layout: React.FC<LayoutProps> = ({
  children,
  showHeader = true,
  showFooter = true,
  className = '',
  containerClassName = ''
}) => {
  return (
    <div className={`min-h-screen bg-white ${className}`}>
      {/* Header */}
      {showHeader && <Header />}
      
      {/* Contenu principal */}
      <main className={`${containerClassName}`}>
        {children}
      </main>
      
      {/* Footer */}
      {showFooter && <Footer />}
    </div>
  );
};

export default Layout;