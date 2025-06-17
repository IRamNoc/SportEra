import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { 
  Facebook, 
  Twitter, 
  Instagram, 
  Linkedin
} from 'lucide-react';

interface FooterLink {
  label: string;
  href: string;
}

interface FooterSection {
  title: string;
  links: FooterLink[];
}

const FOOTER_SECTIONS: FooterSection[] = [
  {
    title: 'Produit',
    links: [
      { label: 'Fonctionnalités', href: '#avantages' },
      { label: 'Comment ça marche', href: '#comment-ca-marche' }
    ]
  },
  {
    title: 'Support',
    links: [
      { label: 'Centre d\'aide', href: '/help' },
      { label: 'Contact', href: '/contact' }
    ]
  },
  {
    title: 'Légal',
    links: [
      { label: 'Confidentialité', href: '/privacy' },
      { label: 'Conditions', href: '/terms' }
    ]
  }
];

const SOCIAL_LINKS = [
  { icon: Facebook, href: 'https://facebook.com/sportera', label: 'Facebook' },
  { icon: Twitter, href: 'https://twitter.com/sportera', label: 'Twitter' },
  { icon: Instagram, href: 'https://instagram.com/sportera', label: 'Instagram' },
  { icon: Linkedin, href: 'https://linkedin.com/company/sportera', label: 'LinkedIn' }
];

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[#2E2E2E] text-white">
      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Brand Section */}
          <div className="lg:col-span-2">
            <Link href="/" className="flex items-center space-x-2 mb-4">
              <Image
                src="/assets/images/logo-white.png"
                alt="SportEra"
                width={32}
                height={32}
                className="h-8 w-auto"
              />
              <span className="text-lg font-bold">
                SportEra
              </span>
            </Link>
            
            <p className="text-gray-300 mb-4 max-w-md text-sm leading-relaxed">
              La plateforme qui révolutionne la pratique sportive urbaine.
            </p>
            
            {/* Social Links */}
            <div className="flex space-x-3">
              {SOCIAL_LINKS.map((social) => {
                const IconComponent = social.icon;
                return (
                  <a
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-8 h-8 bg-gray-700 hover:bg-[#0000FF] rounded-lg flex items-center justify-center transition-colors duration-200"
                    aria-label={social.label}
                  >
                    <IconComponent className="h-4 w-4" />
                  </a>
                );
              })}
            </div>
          </div>

          {/* Footer Links */}
          {FOOTER_SECTIONS.map((section) => (
            <div key={section.title}>
              <h4 className="font-semibold text-white mb-3 text-sm">
                {section.title}
              </h4>
              <ul className="space-y-2">
                {section.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-gray-300 hover:text-white transition-colors duration-200 text-sm"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col sm:flex-row justify-between items-center space-y-2 sm:space-y-0">
            <div className="text-gray-400 text-xs">
              © {currentYear} SportEra. Tous droits réservés.
            </div>
            
            <div className="flex items-center space-x-4 text-xs text-gray-400">
              <Link href="/privacy" className="hover:text-white transition-colors duration-200">
                Confidentialité
              </Link>
              <Link href="/terms" className="hover:text-white transition-colors duration-200">
                Conditions
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;