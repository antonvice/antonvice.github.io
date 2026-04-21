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
  const cardContent = (
    <div
      className={cn(
        "card-glass group",
        {
          'card-glass--special': variant === 'special',
          'card-glass--feature': variant === 'feature',
          'special': variant === 'special',
          'feature': variant === 'feature',
        },
        {
          'p-0': padding === 'none',
          'p-2': padding === 'small',
          'p-4': padding === 'normal',
          'p-6': padding === 'large',
        },
        {
          'cursor-pointer': onClick || href,
        },
        className
      )}
      onClick={onClick}
    >
      {/* Holographic Reflection (static, mouse move handled via CSS variables and script) */}
      <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-accent-cyan/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

      {/* Decorative top bar */}
      <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-accent-cyan/40 via-accent-yellow/40 to-accent-coral/40 opacity-50" />

      {/* Content */}
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );

  if (href) {
    return (
      <a
        href={href}
        target={href.startsWith('http') ? '_blank' : undefined}
        rel={href.startsWith('http') ? 'noopener noreferrer' : undefined}
        className="block no-underline"
      >
        {cardContent}
      </a>
    );
  }

  return cardContent;
};

export default GlassCard;
