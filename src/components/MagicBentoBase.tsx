import React from 'react';
import GlassCard from './GlassCard';
import { cn } from '../lib/utils';

interface MagicBentoBaseProps {
  children: React.ReactNode;
  className?: string;
  variant?: 'default' | 'feature' | 'special';
  padding?: 'none' | 'small' | 'normal' | 'large';
  href?: string;
}

/**
 * MagicBentoBase
 * 
 * A standardized wrapper for bento-grid cards.
 * Now acts as a thin wrapper around the shared card component
 * to ensure visual consistency across the entire application.
 */
const MagicBentoBase: React.FC<MagicBentoBaseProps> = ({ 
  children, 
  className, 
  variant = 'default',
  padding = 'normal',
  href
}) => {
  return (
    <GlassCard 
      variant={variant}
      padding={padding}
      href={href}
      className={cn("bento-card h-full w-full", className)}
    >
      {children}
    </GlassCard>
  );
};

export default MagicBentoBase;
