import React, { useEffect, useRef, useState } from 'react';
import DecryptedText from './DecryptedText';
import '../styles/lanyard-card.css';

interface LanyardCardProps {
  name: string;
  title: string;
  subtitle?: string;
  description?: string[];
  avatar?: string;
  socials?: Array<{
    icon: string;
    href: string;
    label: string;
  }>;
}

/**
 * LanyardCard Component
 * 
 * A cyberpunk-themed animated ID card that swings like a lanyard.
 * Features physics-based animations and glitch effects.
 */
const LanyardCard: React.FC<LanyardCardProps> = ({
  name,
  title,
  subtitle,
  description = [],
  avatar,
  socials = []
}) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [rotation, setRotation] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);
  const animationFrameRef = useRef<number>();
  
  useEffect(() => {
    if (!cardRef.current) return;
    
    let time = 0;
    const animate = () => {
      if (!isHovered) {
        time += 0.01;
        // Natural swaying motion
        const swayX = Math.sin(time) * 2;
        const swayY = Math.cos(time * 0.8) * 1;
        setRotation({ x: swayY, y: swayX });
      }
      animationFrameRef.current = requestAnimationFrame(animate);
    };
    
    animate();
    
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [isHovered]);
  
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    
    const rect = cardRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    const angleX = ((e.clientY - centerY) / rect.height) * 20;
    const angleY = ((e.clientX - centerX) / rect.width) * -20;
    
    setRotation({ x: angleX, y: angleY });
  };
  
  const handleMouseLeave = () => {
    setIsHovered(false);
    setRotation({ x: 0, y: 0 });
  };

  return (
    <div className="relative w-full h-[600px] flex items-center justify-center perspective-[1000px]">
      {/* Lanyard String */}
      <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-[2px] h-[150px] bg-gradient-to-b from-transparent via-accent-cyan/50 to-accent-cyan z-10">
        <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-4 h-4 rounded-full bg-accent-cyan shadow-[0_0_20px_rgba(46,228,234,0.8)]" />
      </div>
      
      {/* Card Container */}
      <div
        ref={cardRef}
        className="relative mt-32 transform-style-preserve-3d"
        onMouseEnter={() => setIsHovered(true)}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{
          transform: `rotateX(${rotation.x}deg) rotateY(${rotation.y}deg)`,
          transformStyle: 'preserve-3d',
          transition: isHovered ? 'none' : 'transform 0.3s ease-out'
        }}
      >
        {/* Card */}
        <div className="relative w-[380px] h-[540px] bg-gradient-to-br from-gray-900/40 via-gray-800/40 to-gray-900/40 rounded-2xl shadow-2xl border border-accent-cyan/30 overflow-hidden">
          {/* Holographic Effect */}
          <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-accent-cyan/10 to-transparent animate-pulse" />
          
          {/* Circuit Pattern Background */}
          <div className="absolute inset-0 opacity-10">
            <svg className="w-full h-full">
              <pattern id="circuit" x="0" y="0" width="100" height="100" patternUnits="userSpaceOnUse">
                <path d="M10 10h80v80h-80z" stroke="#2be4ea" strokeWidth="0.5" fill="none" />
                <circle cx="10" cy="10" r="2" fill="#2be4ea" />
                <circle cx="90" cy="10" r="2" fill="#2be4ea" />
                <circle cx="10" cy="90" r="2" fill="#2be4ea" />
                <circle cx="90" cy="90" r="2" fill="#2be4ea" />
              </pattern>
              <rect width="100%" height="100%" fill="url(#circuit)" />
            </svg>
          </div>
          
          {/* Header Bar */}
          <div className="relative bg-gradient-to-r from-accent-cyan via-accent-yellow to-accent-coral h-2" />
          
          {/* Content */}
          <div className="relative z-10 p-4 flex flex-col h-full justify-between">
            {/* ID Badge Header */}
            <div className="text-center mb-3">
              <div className="text-xs text-accent-cyan tracking-[0.3em] uppercase mb-2 font-mono">
                Security Clearance
              </div>
            </div>
            
            {/* QR Code Avatar */}
            <div className="flex justify-center mb-3">
              <div className="relative">
                <div className="w-24 h-24 bg-gradient-to-br from-accent-cyan/70 to-accent-coral/70 p-[2px] rounded-lg">
                  <div className="w-full h-full bg-white flex items-center justify-center rounded-lg p-2">
                    <img 
                      src="/qr.png" 
                      alt="QR Code" 
                      className="w-full h-full object-contain"
                    />
                  </div>
                </div>
                {/* Scanning Animation */}
                <div className="absolute inset-0 rounded-lg">
                  <div className="absolute inset-0 rounded-lg border-2 border-accent-cyan animate-pulse opacity-50" />
                  <div className="absolute w-full h-0.5 bg-gradient-to-r from-transparent via-accent-cyan to-transparent top-0 animate-scan" />
                </div>
              </div>
            </div>
            
            {/* Name */}
            <div className="text-center mb-3">
              <h3 className="text-lg font-bold text-white mb-1 leading-tight">
                <DecryptedText 
                  text={name}
                  speed={40}
                  maxIterations={15}
                  animateOn="view"
                  className="text-white"
                  encryptedClassName="text-accent-cyan"
                />
              </h3>
              <div className="text-accent-yellow font-rajdhani text-sm leading-tight">
                {title}
              </div>
              {subtitle && (
                <div className="text-gray-400 text-[11px] mt-0.5 leading-tight">
                  {subtitle}
                </div>
              )}
            </div>
            
            {/* Barcode */}
            <div className="flex justify-center mb-2">
              <svg width="150" height="18" className="opacity-60">
                {/* Using fixed pattern instead of random for SSR compatibility */}
                {[
                  3,1,3,1,3,1,1,3,3,1,3,3,1,1,3,1,3,1,1,
                  3,1,1,3,1,3,1,3,1,3,1,1,3,1,3,1,1,3,3,1
                ].map((width, i) => (
                  <rect
                    key={i}
                    x={i * 4}
                    y="0"
                    width={width}
                    height="22"
                    fill="#2be4ea"
                  />
                ))}
              </svg>
            </div>
            
            {/* Description */}
            {description.length > 0 && (
              <div className="space-y-1 mb-2 mt-1 max-h-[60px] overflow-hidden">
                {description.map((text, index) => (
                  <p key={index} className="text-[10px] text-gray-300 leading-snug text-center break-words" style={{ display: '-webkit-box', WebkitBoxOrient: 'vertical', WebkitLineClamp: 1, overflow: 'hidden' }}>
                    {text}
                  </p>
                ))}
              </div>
            )}
            
            {/* Social Links */}
            {socials.length > 0 && (
<div className="flex justify-center gap-4 mt-2 pt-2 relative z-50">
                {socials.map((social, index) => (
                  <a
                    key={index}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 rounded-full bg-gray-800 border border-accent-cyan/30 flex items-center justify-center text-accent-cyan hover:bg-accent-cyan hover:text-dark transition-all duration-300 hover:scale-110 relative z-50 cursor-pointer social-link"
                    onClick={(e) => e.stopPropagation()}
                    aria-label={social.label}
                  >
                    <span dangerouslySetInnerHTML={{ __html: social.icon }} />
                  </a>
                ))}
              </div>
            )}
            
            {/* QR Code Corner */}
            <div className="absolute bottom-4 right-4 w-12 h-12 opacity-30">
              <svg viewBox="0 0 100 100" className="w-full h-full">
                <rect x="0" y="0" width="30" height="30" fill="#2be4ea" />
                <rect x="35" y="0" width="30" height="30" fill="#2be4ea" />
                <rect x="70" y="0" width="30" height="30" fill="#2be4ea" />
                <rect x="0" y="35" width="30" height="30" fill="#2be4ea" />
                <rect x="70" y="35" width="30" height="30" fill="#2be4ea" />
                <rect x="0" y="70" width="30" height="30" fill="#2be4ea" />
                <rect x="35" y="70" width="30" height="30" fill="#2be4ea" />
                <rect x="70" y="70" width="30" height="30" fill="#2be4ea" />
              </svg>
            </div>
          </div>
        </div>
        
        {/* Card Shadow */}
        <div 
          className="absolute inset-0 bg-black/50 blur-xl transform translate-y-8 -z-10 rounded-2xl"
          style={{
            transform: `translateZ(-50px) translateY(20px)`
          }}
        />
      </div>
    </div>
  );
};

export default LanyardCard;