import React, { useState } from 'react';
import { Menu, X, Github, Linkedin, Twitter } from 'lucide-react';
import { cn } from '../lib/utils';

interface NavigationProps {
  currentPath?: string;
}

const navigation = [
  { name: 'Home', href: '/' },
  { name: 'Projects', href: '/projects' },
  { name: 'Blog', href: '/blog' },
];

const socialLinks = [
  { name: 'GitHub', href: 'https://github.com/antonvice', icon: Github },
  { name: 'LinkedIn', href: 'https://linkedin.com/in/antonvice', icon: Linkedin },
  { name: 'Twitter', href: 'https://x.com/la_haine_d_arte', icon: Twitter },
];

export default function Navigation({ currentPath = '/' }: NavigationProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo/Brand */}
          <div className="flex-shrink-0">
            <a 
              href="/" 
              className="text-nav-link font-cyberpunk text-3xl hover:animate-glitch transition-all duration-300"
              style={{ textShadow: '0 0 8px rgba(43,228,234,0.5)', letterSpacing: '0.5px' }}
            >
              Anton Vice
            </a>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-8">
              {navigation.map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  className={cn(
                    "px-4 py-2 text-xl font-medium transition-all duration-300 relative group",
                    currentPath === item.href
                      ? "text-nav-active"
                      : "text-nav-link hover:text-nav-active"
                  )}
                  style={currentPath === item.href ? { textShadow: '0 0 8px rgba(254,211,63,0.5)' } : {}}
                >
                  {item.name}
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-accent-cyan to-accent-coral transition-all duration-300 group-hover:w-full"></span>
                </a>
              ))}
            </div>
          </div>

          {/* Social Links - Desktop */}
          <div className="hidden md:flex items-center space-x-4">
            {socialLinks.map((link) => {
              const Icon = link.icon;
              return (
                <a
                  key={link.name}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-nav-link hover:text-nav-active transition-all duration-300 hover:scale-110"
                >
                  <Icon size={24} />
                  <span className="sr-only">{link.name}</span>
                </a>
              );
            })}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-white hover:text-accent-cyan transition-colors duration-300"
              aria-expanded="false"
            >
              <span className="sr-only">Open main menu</span>
              {isOpen ? (
                <X className="block h-6 w-6" aria-hidden="true" />
              ) : (
                <Menu className="block h-6 w-6" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <div className={cn(
        "md:hidden transition-all duration-300 ease-in-out",
        isOpen ? "max-h-64 opacity-100" : "max-h-0 opacity-0 overflow-hidden"
      )}>
        <div className="glass border-t border-glass-border">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {navigation.map((item) => (
              <a
                key={item.name}
                href={item.href}
                className={cn(
                  "block px-4 py-3 text-xl font-medium transition-all duration-300",
                  currentPath === item.href
                    ? "text-nav-active"
                    : "text-nav-link hover:text-nav-active hover:bg-white/5"
                )}
                style={currentPath === item.href ? { textShadow: '0 0 8px rgba(254,211,63,0.5)' } : {}}
                onClick={() => setIsOpen(false)}
              >
                {item.name}
              </a>
            ))}
            
            {/* Mobile social links */}
            <div className="flex items-center justify-center space-x-6 pt-4 pb-2">
              {socialLinks.map((link) => {
                const Icon = link.icon;
                return (
                  <a
                    key={link.name}
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-nav-link hover:text-nav-active transition-all duration-300"
                  >
                    <Icon size={24} />
                    <span className="sr-only">{link.name}</span>
                  </a>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}