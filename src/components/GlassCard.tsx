import React from 'react';
import { cn } from '../lib/utils';

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  href?: string;
  variant?: 'default' | 'feature' | 'special';
  padding?: 'none' | 'small' | 'normal' | 'large';
}

const GlassCard: React.FC<GlassCardProps> = ({
  children,
  className,
  onClick,
  href,
  variant = 'default',
  padding = 'normal'
}) => {
  return (
    <>
      {href ? (
        <a
          href={href}
          target={href.startsWith('http') ? '_blank' : undefined}
          rel={href.startsWith('http') ? 'noopener noreferrer' : undefined}
          className="block"
        >
          <div
            className={cn(
              // Base styles - more transparent glass
              "bg-gradient-to-br from-gray-900/5 via-gray-800/2 to-gray-900/5",
              "backdrop-blur-[6px]",
              "border border-accent-cyan/10",
              "rounded-2xl",
              "shadow-2xl",
              "relative overflow-hidden",
              "transition-all duration-300",
              // Padding variants
              {
                'p-0': padding === 'none',
                'p-2': padding === 'small',
                'p-4': padding === 'normal',
                'p-6': padding === 'large',
              },
              // Interactive states
              'hover:scale-[1.02] hover:border-accent-cyan/50',
              // Variants (keep background consistent, only adjust borders/shadows by variant)
              {
                'hover:shadow-accent-cyan/20': variant === 'default',
                'hover:shadow-accent-yellow/20 border-accent-yellow/30 hover:border-accent-yellow/50': variant === 'special',
                'border-accent-coral/30 hover:border-accent-coral/50': variant === 'feature'
              },
              // Custom classes
              className
            )}
            onClick={onClick}
          >
            {/* Holographic Effect (match LanyardCard) */}
            <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-accent-cyan/3 to-transparent animate-pulse pointer-events-none" />

            {/* Circuit Pattern Background (match LanyardCard) */}
            <div className="absolute inset-0 opacity-1 pointer-events-none">
              <svg className="w-full h-full">
                <pattern id="circuit-glass" x="0" y="0" width="100" height="100" patternUnits="userSpaceOnUse">
                  <path d="M10 10h80v80h-80z" stroke="#2be4ea" strokeWidth="0.5" fill="none" />
                  <circle cx="10" cy="10" r="2" fill="#2be4ea" />
                  <circle cx="90" cy="10" r="2" fill="#2be4ea" />
                  <circle cx="10" cy="90" r="2" fill="#2be4ea" />
                  <circle cx="90" cy="90" r="2" fill="#2be4ea" />
                </pattern>
                <rect width="100%" height="100%" fill="url(#circuit-glass)" />
              </svg>
            </div>

            {/* Optional header bar like LanyardCard */}
            <div className="relative bg-gradient-to-r from-accent-cyan/30 via-accent-yellow/30 to-accent-coral/30 h-1" />

            {/* Content */}
            {children}
          </div>
        </a>
      ) : (
        <div
          className={cn(
            // Base styles - more transparent glass
            "bg-gradient-to-br from-gray-900/5 via-gray-800/2 to-gray-900/5",
            "backdrop-blur-[2px]",
            "border border-accent-cyan/10",
            "rounded-2xl",
            "shadow-2xl",
            "relative overflow-hidden",
            "transition-all duration-300",
            // Padding variants
            {
              'p-0': padding === 'none',
              'p-2': padding === 'small',
              'p-4': padding === 'normal',
              'p-6': padding === 'large',
            },
            // Interactive states
            {
              'hover:scale-[1.02] hover:border-accent-cyan/50 cursor-pointer': onClick,
            },
            // Variants (keep background consistent, only adjust borders/shadows by variant)
            {
              'hover:shadow-accent-cyan/20': variant === 'default' && onClick,
              'hover:shadow-accent-yellow/20 border-accent-yellow/30 hover:border-accent-yellow/50': variant === 'special',
              'border-accent-coral/30 hover:border-accent-coral/50': variant === 'feature'
            },
            // Custom classes
            className
          )}
          onClick={onClick}
        >
          {/* Holographic Effect (match LanyardCard) */}
          <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-accent-cyan/3 to-transparent animate-pulse pointer-events-none" />

          {/* Optional header bar like LanyardCard */}
          <div className="relative bg-gradient-to-r from-accent-cyan/30 via-accent-yellow/30 to-accent-coral/30 h-1" />

          {/* Content */}
          {children}
        </div>
      )}
    </>
  );
};

export default GlassCard;