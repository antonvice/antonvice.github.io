import React, { useRef, useEffect, useState } from 'react';
import { gsap } from 'gsap';

/**
 * PillNavItem type definition
 * Represents a single navigation item in the pill nav
 */
export type PillNavItem = {
  label: string;
  href: string;
  ariaLabel?: string;
};

/**
 * PillNavProps interface
 * Props for the PillNav component
 */
export interface PillNavProps {
  items: PillNavItem[];
  socialLinks?: PillNavItem[];
  currentPath?: string;
  className?: string;
  ease?: string;
  baseColor?: string;
  pillColor?: string;
  hoveredPillTextColor?: string;
  pillTextColor?: string;
  onMobileMenuClick?: () => void;
  initialLoadAnimation?: boolean;
}

/**
 * PillNav Component
 * A pill navigation with smooth GSAP animations
 * Adapted from ReactBits PillNav component
 */
const PillNav: React.FC<PillNavProps> = ({
  items,
  socialLinks = [],
  currentPath,
  className = '',
  ease = 'power3.easeOut',
  baseColor = '#fffdf1',
  pillColor = '#7bdff2',
  hoveredPillTextColor = '#26171f',
  pillTextColor,
  onMobileMenuClick,
  initialLoadAnimation = false // Disabled by default
}) => {
  const resolvedPillTextColor = pillTextColor ?? '#26171f';
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const circleRefs = useRef<Array<HTMLSpanElement | null>>([]);
  const tlRefs = useRef<Array<gsap.core.Timeline | null>>([]);
  const activeTweenRefs = useRef<Array<gsap.core.Tween | null>>([]);
  const logoRef = useRef<HTMLDivElement | null>(null);
  const hamburgerRef = useRef<HTMLButtonElement | null>(null);
  const mobileMenuRef = useRef<HTMLDivElement | null>(null);
  const navItemsRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const layout = () => {
      circleRefs.current.forEach(circle => {
        if (!circle?.parentElement) return;

        const pill = circle.parentElement as HTMLElement;
        const rect = pill.getBoundingClientRect();
        const { width: w, height: h } = rect;
        const R = ((w * w) / 4 + h * h) / (2 * h);
        const D = Math.ceil(2 * R) + 2;
        const delta = Math.ceil(R - Math.sqrt(Math.max(0, R * R - (w * w) / 4))) + 1;
        const originY = D - delta;

        circle.style.width = `${D}px`;
        circle.style.height = `${D}px`;
        circle.style.bottom = `-${delta}px`;

        gsap.set(circle, {
          xPercent: -50,
          scale: 0,
          transformOrigin: `50% ${originY}px`
        });

        const label = pill.querySelector<HTMLElement>('.pill-label');
        const white = pill.querySelector<HTMLElement>('.pill-label-hover');

        if (label) gsap.set(label, { y: 0 });
        if (white) gsap.set(white, { y: h + 12, opacity: 0 });

        const index = circleRefs.current.indexOf(circle);
        if (index === -1) return;

        tlRefs.current[index]?.kill();
        const tl = gsap.timeline({ paused: true });

        tl.to(circle, { scale: 1.2, xPercent: -50, duration: 2, ease, overwrite: 'auto' }, 0);

        if (label) {
          tl.to(label, { y: -(h + 8), duration: 2, ease, overwrite: 'auto' }, 0);
        }

        if (white) {
          gsap.set(white, { y: Math.ceil(h + 100), opacity: 0 });
          tl.to(white, { y: 0, opacity: 1, duration: 2, ease, overwrite: 'auto' }, 0);
        }

        tlRefs.current[index] = tl;
      });
    };

    layout();

    const onResize = () => layout();
    window.addEventListener('resize', onResize);

    if (document.fonts) {
      document.fonts.ready.then(layout).catch(() => {});
    }

    const menu = mobileMenuRef.current;
    if (menu) {
      gsap.set(menu, { visibility: 'hidden', opacity: 0, scaleY: 1, y: 0 });
    }

    if (initialLoadAnimation) {
      const logo = logoRef.current;
      const navItems = navItemsRef.current;

      if (logo) {
        gsap.set(logo, { scale: 0 });
        gsap.to(logo, {
          scale: 1,
          duration: 0.6,
          ease
        });
      }

      if (navItems) {
        gsap.set(navItems, { width: 0, overflow: 'hidden' });
        gsap.to(navItems, {
          width: 'auto',
          duration: 0.6,
          ease
        });
      }
    }

    return () => window.removeEventListener('resize', onResize);
  }, [items, ease, initialLoadAnimation]);


  /**
   * Handle mouse enter for pill navigation items
   * Animates the hover circle and text on hover
   */
  const handleEnter = (i: number) => {
    const tl = tlRefs.current[i];
    if (!tl) return;
    activeTweenRefs.current[i]?.kill();
    activeTweenRefs.current[i] = tl.tweenTo(tl.duration(), {
      duration: 0.3,
      ease,
      overwrite: 'auto'
    });
  };

  /**
   * Handle mouse leave for pill navigation items
   * Reverses the hover animation
   */
  const handleLeave = (i: number) => {
    const tl = tlRefs.current[i];
    if (!tl) return;
    activeTweenRefs.current[i]?.kill();
    activeTweenRefs.current[i] = tl.tweenTo(0, {
      duration: 0.2,
      ease,
      overwrite: 'auto'
    });
  };

  const handleLogoEnter = () => {
    const logo = logoRef.current;
    if (!logo) return;
    gsap.to(logo, {
      rotate: 360,
      scale: 1.05,
      duration: 0.4,
      ease,
      overwrite: 'auto'
    });
  };

  const handleLogoLeave = () => {
    const logo = logoRef.current;
    if (!logo) return;
    gsap.to(logo, {
      rotate: 0,
      scale: 1,
      duration: 0.3,
      ease,
      overwrite: 'auto'
    });
  };

  const toggleMobileMenu = () => {
    const newState = !isMobileMenuOpen;
    setIsMobileMenuOpen(newState);

    const hamburger = hamburgerRef.current;
    const menu = mobileMenuRef.current;

    if (hamburger) {
      const lines = hamburger.querySelectorAll('.hamburger-line');
      if (newState) {
        gsap.to(lines[0], { rotation: 45, y: 3, duration: 0.3, ease });
        gsap.to(lines[1], { rotation: -45, y: -3, duration: 0.3, ease });
      } else {
        gsap.to(lines[0], { rotation: 0, y: 0, duration: 0.3, ease });
        gsap.to(lines[1], { rotation: 0, y: 0, duration: 0.3, ease });
      }
    }

    if (menu) {
      if (newState) {
        gsap.set(menu, { visibility: 'visible' });
        gsap.fromTo(
          menu,
          { opacity: 0, y: 10, scaleY: 1 },
          {
            opacity: 1,
            y: 0,
            scaleY: 1,
            duration: 0.3,
            ease,
            transformOrigin: 'top center'
          }
        );
      } else {
        gsap.to(menu, {
          opacity: 0,
          y: 10,
          scaleY: 1,
          duration: 0.2,
          ease,
          transformOrigin: 'top center',
          onComplete: () => {
            gsap.set(menu, { visibility: 'hidden' });
          }
        });
      }
    }

    onMobileMenuClick?.();
  };

  const cssVars = {
    ['--base']: baseColor,
    ['--pill-bg']: pillColor,
    ['--hover-text']: hoveredPillTextColor,
    ['--pill-text']: resolvedPillTextColor,
    ['--nav-h']: '56px',
    ['--logo-size']: '48px',
    ['--pill-pad-x']: '24px',
    ['--pill-gap']: '6px'
  } as React.CSSProperties;

  return (
    <div className="w-full flex justify-center px-4 md:px-8">
      <nav
        className={`w-full max-w-6xl flex items-center justify-between ${className}`}
        aria-label="Primary"
        style={cssVars}
      >
        {/* Logo - Links to Home */}
        <a
          href="/"
          ref={el => { logoRef.current = el as HTMLDivElement; }}
          onMouseEnter={handleLogoEnter}
          onMouseLeave={handleLogoLeave}
          className="rounded-lg inline-flex items-center justify-center overflow-hidden cursor-pointer transition-all duration-300 hover:-translate-x-1 hover:-translate-y-1"
          style={{
            width: 'var(--nav-h)',
            height: 'var(--nav-h)',
            background: 'var(--neo-yellow)',
            border: '3px solid var(--neo-ink)',
            boxShadow: 'var(--neo-shadow-sm)',
            textDecoration: 'none',
            padding: '2px'
          }}
          aria-label="Home"
        >
          <img 
            src="/navbarlogo.jpg"
            alt="AV Logo"
            className="w-full h-full object-cover rounded-md transition-all duration-300"
            style={{
              filter: 'contrast(1.08) saturate(1.12)',
            }}
            onError={(e) => {
              // Fallback to text if image fails to load
              const target = e.target as HTMLImageElement;
              target.style.display = 'none';
              const fallback = document.createElement('span');
              fallback.className = 'text-2xl font-bold';
              fallback.style.color = 'var(--hover-text)';
              fallback.textContent = 'AV';
              target.parentElement?.appendChild(fallback);
            }}
          />
        </a>

        {/* Desktop Navigation */}
        <div
          ref={navItemsRef}
          className="relative items-center rounded-lg hidden md:flex"
          style={{
            height: 'var(--nav-h)',
            background: 'var(--neo-surface)',
            border: '3px solid var(--neo-ink)',
            boxShadow: 'var(--neo-shadow-sm)'
          }}
        >
          <ul
            role="menubar"
            className="list-none flex items-stretch m-0 p-[4px] h-full"
            style={{ gap: 'var(--pill-gap)' }}
          >
            {items.map((item, i) => {
              const isActive = currentPath === item.href || 
                (item.href !== '/' && currentPath?.startsWith(item.href));

              const pillStyle: React.CSSProperties = {
                background: isActive ? 'var(--pill-bg)' : 'transparent',
                color: 'var(--hover-text)',
                paddingLeft: 'var(--pill-pad-x)',
                paddingRight: 'var(--pill-pad-x)',
                border: isActive ? '2px solid var(--neo-ink)' : '2px solid transparent',
                transition: 'all 0.3s ease'
              };

              const PillContent = (
                <>
                  <span
                    className="hover-circle absolute left-1/2 bottom-0 rounded-full z-[1] block pointer-events-none"
                    style={{
                      background: 'var(--neo-pink)',
                      willChange: 'transform',
                      boxShadow: '0 0 0 2px var(--neo-ink)'
                    }}
                    aria-hidden="true"
                    ref={el => {
                      circleRefs.current[i] = el;
                    }}
                  />
                  <span className="label-stack relative inline-block leading-[1] z-[2]">
                    <span
                      className="pill-label relative z-[2] inline-block leading-[1] font-rajdhani font-semibold"
                      style={{ willChange: 'transform' }}
                    >
                      {item.label}
                    </span>
                    <span
                      className="pill-label-hover absolute left-0 top-0 z-[3] inline-block font-rajdhani font-semibold"
                      style={{
                        color: 'var(--hover-text)',
                        textShadow: '2px 2px 0 rgba(255, 230, 109, 0.55)',
                        willChange: 'transform, opacity'
                      }}
                      aria-hidden="true"
                    >
                      {item.label}
                    </span>
                  </span>
                  {isActive && (
                    <span
                      className="absolute left-1/2 -bottom-[8px] -translate-x-1/2 w-3 h-3 z-[4]"
                      style={{ 
                        background: 'var(--neo-yellow)',
                        border: '2px solid var(--neo-ink)',
                        boxShadow: '2px 2px 0 var(--neo-ink)'
                      }}
                      aria-hidden="true"
                    />
                  )}
                </>
              );

              const basePillClasses =
                'relative overflow-hidden inline-flex items-center justify-center h-full no-underline rounded-md box-border text-[16px] leading-[0] uppercase tracking-normal whitespace-nowrap cursor-pointer px-0 hover:border-dark';

              return (
                <li key={item.href} role="none" className="flex h-full">
                  <a
                    role="menuitem"
                    href={item.href}
                    className={basePillClasses}
                    style={pillStyle}
                    aria-label={item.ariaLabel || item.label}
                    onMouseEnter={() => handleEnter(i)}
                    onMouseLeave={() => handleLeave(i)}
                  >
                    {PillContent}
                  </a>
                </li>
              );
            })}
          </ul>
        </div>
        
        {/* Social Links - Desktop */}
        {socialLinks.length > 0 && (
          <div className="hidden md:flex items-center gap-3 ml-4">
            {socialLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className="w-12 h-12 rounded-lg flex items-center justify-center transition-all duration-300 hover:-translate-x-1 hover:-translate-y-1"
                style={{
                  background: 'var(--neo-surface)',
                  border: '3px solid var(--neo-ink)',
                  boxShadow: 'var(--neo-shadow-sm)',
                  color: 'var(--neo-ink)',
                  padding: '10px'
                }}
                aria-label={link.ariaLabel || link.label}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'var(--neo-pink)';
                  e.currentTarget.style.color = 'var(--neo-ink)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'var(--neo-surface)';
                  e.currentTarget.style.color = 'var(--neo-ink)';
                }}
              >
                <span dangerouslySetInnerHTML={{ __html: link.label }} />
              </a>
            ))}
          </div>
        )}

        {/* Mobile Menu Button */}
        <button
          ref={hamburgerRef}
          onClick={toggleMobileMenu}
          aria-label="Toggle menu"
          aria-expanded={isMobileMenuOpen}
          className="md:hidden rounded-lg flex flex-col items-center justify-center gap-1 cursor-pointer p-0 relative"
          style={{
            width: 'var(--nav-h)',
            height: 'var(--nav-h)',
            background: 'var(--neo-surface)',
            border: '3px solid var(--neo-ink)',
            boxShadow: 'var(--neo-shadow-sm)'
          }}
        >
          <span
            className="hamburger-line w-5 h-0.5 rounded origin-center transition-all duration-300"
            style={{ background: 'var(--pill-bg)' }}
          />
          <span
            className="hamburger-line w-5 h-0.5 rounded origin-center transition-all duration-300"
            style={{ background: 'var(--pill-bg)' }}
          />
        </button>
      </nav>

      {/* Mobile Menu */}
      <div
        ref={mobileMenuRef}
        className="md:hidden absolute top-[4rem] left-4 right-4 rounded-lg z-[998] origin-top"
        style={{
          ...cssVars,
          background: 'var(--neo-surface)',
          border: '3px solid var(--neo-ink)',
          boxShadow: 'var(--neo-shadow)'
        }}
      >
        <ul className="list-none m-0 p-2 flex flex-col gap-1">
          {items.map(item => {
            const isActive = currentPath === item.href || 
              (item.href !== '/' && currentPath?.startsWith(item.href));
            
            const defaultStyle: React.CSSProperties = {
              background: isActive ? 'var(--neo-blue)' : 'transparent',
              color: 'var(--neo-ink)',
              border: '2px solid transparent'
            };
            
            const hoverIn = (e: React.MouseEvent<HTMLAnchorElement>) => {
              if (!isActive) {
                e.currentTarget.style.background = 'var(--neo-yellow)';
                e.currentTarget.style.borderColor = 'var(--neo-ink)';
                e.currentTarget.style.color = 'var(--neo-ink)';
              }
            };
            
            const hoverOut = (e: React.MouseEvent<HTMLAnchorElement>) => {
              if (!isActive) {
                e.currentTarget.style.background = 'transparent';
                e.currentTarget.style.borderColor = 'transparent';
                e.currentTarget.style.color = 'var(--neo-ink)';
              }
            };

            const linkClasses =
              'block py-3 px-5 text-[16px] font-rajdhani font-semibold rounded-md transition-all duration-200 uppercase tracking-normal';

            return (
              <li key={item.href}>
                <a
                  href={item.href}
                  className={linkClasses}
                  style={defaultStyle}
                  onMouseEnter={hoverIn}
                  onMouseLeave={hoverOut}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {item.label}
                </a>
              </li>
            );
          })}
        </ul>
        
        {/* Social Links - Mobile */}
        {socialLinks.length > 0 && (
          <div className="border-t-2 border-dark mt-2 pt-2">
            <div className="flex justify-center gap-4 px-4 py-2">
              {socialLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-md flex items-center justify-center text-lg transition-all duration-200"
                  style={{
                    background: 'var(--neo-blue)',
                    border: '2px solid var(--neo-ink)',
                    color: 'var(--neo-ink)'
                  }}
                  aria-label={link.ariaLabel || link.label}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <span dangerouslySetInnerHTML={{ __html: link.label }} />
                </a>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PillNav;
