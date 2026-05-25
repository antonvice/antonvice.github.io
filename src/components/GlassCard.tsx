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
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
        style={{
          background:
            'repeating-linear-gradient(135deg, transparent 0 18px, rgba(255, 95, 162, 0.1) 18px 22px, transparent 22px 42px)'
        }}
      />

      <div
        className="absolute top-0 left-0 right-0 h-[7px]"
        style={{
          background:
            'linear-gradient(90deg, var(--neo-pink), var(--neo-yellow), var(--neo-blue))'
        }}
      />

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
