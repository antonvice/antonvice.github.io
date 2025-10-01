import React from 'react';
import { cn } from '../lib/utils';

interface MagicBentoBaseProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  href?: string;
  variant?: 'default' | 'feature' | 'special';
  padding?: 'none' | 'small' | 'normal' | 'large';
}

const MagicBentoBase: React.FC<MagicBentoBaseProps> = ({
  children,
  className,
  onClick,
  href,
  variant = 'default',
  padding = 'normal'
}) => {
  const cardContent = (
    <div
      className={cn(
        // Shared glass style
        "card-glass",
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
          'hover:scale-[1.02] hover:border-accent-cyan/50 cursor-pointer': onClick || href,
        },
        // Variants (keep background consistent, only adjust borders/shadows by variant)
        {
          'hover:shadow-accent-cyan/20': variant === 'default' && (onClick || href),
          'hover:shadow-accent-yellow/20 border-accent-yellow/30 hover:border-accent-yellow/50': variant === 'special',
          'border-accent-coral/30 hover:border-accent-coral/50': variant === 'feature'
        },
        // Custom classes
        className
      )}
      onClick={onClick}
    >
      {/* Holographic Effect */}
      <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-accent-cyan/3 to-transparent animate-pulse pointer-events-none" />

      {/* Optional header bar */}
      <div className="relative bg-gradient-to-r from-accent-cyan/30 via-accent-yellow/30 to-accent-coral/30 h-1" />

      {/* Content */}
      {children}
    </div>
  );

  // Wrap in link if href is provided
  if (href) {
    return (
      <a
        href={href}
        target={href.startsWith('http') ? '_blank' : undefined}
        rel={href.startsWith('http') ? 'noopener noreferrer' : undefined}
        className="block"
      >
        {cardContent}
      </a>
    );
  }

  return cardContent;
};

export default MagicBentoBase;