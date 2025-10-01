import React, { useRef, useEffect, useState, useCallback } from 'react';
import { gsap } from 'gsap';
import '../styles/glassCard.css';

// Simplified language color map for fallback
const LANGUAGE_COLORS: Record<string, string> = {
  JavaScript: '#f1e05a',
  TypeScript: '#2b7489',
  Python: '#3572A5',
  Java: '#b07219',
  'C++': '#f34b7d',
  C: '#555555',
  'C#': '#178600',
  Go: '#00ADD8',
  Rust: '#dea584',
  Swift: '#ffac45',
  Kotlin: '#F18E33',
  Ruby: '#701516',
  PHP: '#4F5D95',
  HTML: '#e34c26',
  CSS: '#563d7c',
  SCSS: '#c6538c',
  Vue: '#4FC08D',
  Shell: '#89e051',
  Dockerfile: '#384d54',
  Makefile: '#427819',
  Jupyter: '#DA5B0B',
  'Jupyter Notebook': '#DA5B0B',
  Markdown: '#083fa1',
  YAML: '#cb171e',
  JSON: '#292929',
  XML: '#0060ac',
  SQL: '#e38c00',
  GraphQL: '#e10098',
  R: '#198CE7',
  MATLAB: '#e16737',
  Scala: '#c22d40',
  Perl: '#0298c3',
  Lua: '#000080',
  Dart: '#00B4AB',
  Elixir: '#6e4a7e',
  Clojure: '#db5855',
  Haskell: '#5e5086',
  Objective: '#438eff',
  'Objective-C': '#438eff',
  Assembly: '#6E4C13',
  WebAssembly: '#04133b',
  Solidity: '#AA6746',
  Vim: '#199f4b',
  'Vim script': '#199f4b',
  TeX: '#3D6117',
  LaTeX: '#3D6117',
  Processing: '#0096D8',
  Arduino: '#bd79d1',
  CUDA: '#3A4E3A',
  Fortran: '#4d41b1',
  COBOL: '#0D597F',
  Pascal: '#E3F171',
  Groovy: '#e69f56',
  Erlang: '#B83998',
  Zig: '#ec915c',
  Julia: '#a270ba',
  Nim: '#ffc200',
  Crystal: '#000100',
  OCaml: '#3be133',
  'F#': '#b845fc',
  ReScript: '#e6484f',
  Reason: '#ff5847',
  Elm: '#60B5CC',
  PureScript: '#1D222D',
  CoffeeScript: '#244776',
  LiveScript: '#499886',
  Tcl: '#e4cc98',
  Vala: '#fbe5cd',
  Scheme: '#1e4aec',
  Racket: '#3c5caa',
  CommonLisp: '#3fb68b',
  'Common Lisp': '#3fb68b',
  'Emacs Lisp': '#c065db',
  Prolog: '#74283c',
  Ada: '#02f88c',
  D: '#ba595e',
  Forth: '#341708',
  ActionScript: '#882B0F',
  VBA: '#867db1',
  VBScript: '#15dcdc',
  'Visual Basic': '#945db7',
  Smalltalk: '#596706',
  ABAP: '#E8274B',
  Apex: '#1797c0',
  SAS: '#B34936',
  XSLT: '#EB8CEB',
  Hack: '#878787',
  Nix: '#7e7eff',
  PowerShell: '#012456',
  Batchfile: '#C1F12E',
  CMake: '#DA3434',
  QMake: '#ffffff',
  Meson: '#007800',
  Bazel: '#76d275',
  Puppet: '#302B6D',
  Ansible: '#1A1918',
  Terraform: '#5835CC',
  HCL: '#5835CC',
  Jsonnet: '#0064bd',
  Dhall: '#dfafff',
  TOML: '#9c4221',
  INI: '#fff1f2',
  Properties: '#2A2A2A',
  Protocol: '#c7254e',
  'Protocol Buffer': '#c7254e',
  Thrift: '#c7254e',
  Gherkin: '#5B2063',
  PlantUML: '#88BFF8',
  Mermaid: '#ff3670',
  ASN: '#aeead0',
  'ASN.1': '#aeead0',
  ApacheConf: '#d12127',
  Nginx: '#009639',
  Caddy: '#22b638',
  Redis: '#dc382d',
  MongoDB: '#13aa52',
  PostgreSQL: '#336791',
  MySQL: '#4479A1',
  MariaDB: '#003545',
  SQLite: '#003B57',
  Oracle: '#f80000',
  Cassandra: '#1287B1',
  Elasticsearch: '#005571',
  Neo4j: '#008CC1',
  InfluxDB: '#22ADF6',
  GraphDB: '#2e75b6',
  DynamoDB: '#4053D6',
  CouchDB: '#ea2328',
  Firebase: '#FFCA28',
  Supabase: '#3ECF8E',
  OpenGL: '#5586A4',
  HLSL: '#aace60',
  GLSL: '#5586A4',
  Metal: '#8F14E9',
  Vulkan: '#ac162c',
  DirectX: '#426e5d',
  Unity: '#000000',
  UnrealScript: '#a54c4d',
  GDScript: '#355570',
  GameMaker: '#71b417',
  Pawn: '#dbb284',
  SourcePawn: '#f69e1d',
  AngelScript: '#C7D7DC',
  Squirrel: '#800000',
  MoonScript: '#ff4585',
  V: '#4f87c4',
  Odin: '#60AFFE',
  Carbon: '#222222',
  Mojo: '#ff4c1f',
  Move: '#4a137a',
  Cairo: '#ff6836',
  Clarity: '#5535cc',
  Vyper: '#2980b9',
  Yul: '#794932',
  Circom: '#707070',
  Plutus: '#7B3FF2',
  Michelson: '#2e74dd',
  Chisel: '#a03c32',
  TLA: '#4b0079',
  Alloy: '#64C800',
  Boogie: '#c80fa0',
  SMTLIB: '#1a8cff',
  'SMT-LIB2': '#1a8cff',
  Dafny: '#FFCD00',
  Coq: '#d0b68c',
  Agda: '#315665',
  Idris: '#b30000',
  Lean: '#cc0000',
  Isabelle: '#FEFE00',
  ACL2: '#3d0000',
  ATS: '#1ac620',
  Ur: '#ccccee',
  Kind: '#aa2afe',
  Effekt: '#5948ff',
  Unison: '#5B1C7C',
  Pony: '#8361ce',
  Factor: '#636746',
  Io: '#a9188d',
  Self: '#0579aa',
  Red: '#f37368',
  Rebol: '#358a5b',
  Pike: '#005390',
  Ring: '#2D54CB',
  Chapel: '#8dc63f',
  X10: '#4B6BEF',
  Felix: '#FFCD00',
  ADA: '#02f88c',
  APL: '#5A8164',
  BrightScript: '#662D8A',
  Fantom: '#14253c',
  Gosu: '#82937f',
  Harbour: '#0e60e3',
  J: '#9EEDFF',
  Jolie: '#843179',
  Kitten: '#E37933',
  Lasso: '#999999',
  Mirah: '#c7a938',
  Monkey: '#8D6F3F',
  Nit: '#009917',
  Oxygene: '#cdd0e3',
  PogoScript: '#d80074',
  Shen: '#120F14',
  Slash: '#007eff',
  Wren: '#383838',
  XC: '#99DA07',
  XQuery: '#5232e7',
  Zephir: '#118f9e',
  Frege: '#00cafe',
  AspectJ: '#a957b0',
  AutoHotkey: '#6594b9',
  AutoIt: '#1C3552',
  BlitzMax: '#cd6400',
  Ceylon: '#dfa535',
  DataWeave: '#003a52',
  Golo: '#88562A',
  Gradle: '#02303a',
  Hy: '#7790B2',
  JFlex: '#DBCA00',
  JSONiq: '#40d47e',
  Jsonata: '#333333',
  LSL: '#3d9970',
  MQL4: '#62A8D6',
  MQL5: '#4A76B8',
  Max: '#c4a79c',
  NetLogo: '#ff6375',
  Nu: '#c9df40',
  OpenEdge: '#5ce600',
  Papyrus: '#6600cc',
  PigLatin: '#fcd7de',
  Stan: '#b2011d',
  Turing: '#cf142b',
  VCL: '#148AA8',
  WebIDL: '#1a5490',
  wisp: '#7582D1',
  xBase: '#403a40',
  Xojo: '#81bd41',
  YARA: '#220000',
  Zeek: '#224466',
  ZenScript: '#00BCD1',
  Zimpl: '#d67711',
  q: '#0040cd',
  sed: '#64b970',
  wdl: '#42f1f4',
  jq: '#c7254e',
  Pkl: '#6b9543',
  Smithy: '#c44536',
  Ballerina: '#FF5000',
  Bicep: '#519aba',
  Cadence: '#00ef8b',
  Cue: '#5886E1',
  Grain: '#eed971',
  MDX: '#fcb32c',
  Motoko: '#1a1aa6',
  Nelua: '#001fff',
  Polar: '#ae81ff',
  Quint: '#3333ff',
  Raku: '#0000fb',
  Riot: '#A71E49',
  Stylus: '#ff6347',
  Svelte: '#ff3e00',
  Astro: '#ff5a03',
  TSX: '#2b7489',
  JSX: '#f1e05a'
};

const getLanguageColorFallback = (language: string): string => {
  return LANGUAGE_COLORS[language] || '#6b7280';
};

/**
 * Interface for individual project cards in the bento grid
 */
export interface BentoCardProps {
  id: number;
  name: string;
  description?: string | null;
  language?: string | null;
  stargazers_count?: number;
  forks_count?: number;
  html_url: string;
  topics?: string[];
  languageColor?: string;
  formattedDate?: string;
}

/**
 * Props for the MagicBento component
 */
export interface MagicBentoProps {
  projects: BentoCardProps[];
  textAutoHide?: boolean;
  enableStars?: boolean;
  enableSpotlight?: boolean;
  enableBorderGlow?: boolean;
  disableAnimations?: boolean;
  spotlightRadius?: number;
  particleCount?: number;
  enableTilt?: boolean;
  glowColor?: string;
  clickEffect?: boolean;
  enableMagnetism?: boolean;
  title?: string;
}

const DEFAULT_PARTICLE_COUNT = 8;
const DEFAULT_SPOTLIGHT_RADIUS = 300;
const DEFAULT_GLOW_COLOR = '46, 228, 234'; // Cyan color to match your theme
const MOBILE_BREAKPOINT = 768;

/**
 * Create a particle element for hover effects
 */
const createParticleElement = (x: number, y: number, color: string = DEFAULT_GLOW_COLOR): HTMLDivElement => {
  const el = document.createElement('div');
  el.className = 'particle';
  el.style.cssText = `
    position: absolute;
    width: 4px;
    height: 4px;
    border-radius: 50%;
    background: rgba(${color}, 1);
    box-shadow: 0 0 6px rgba(${color}, 0.6);
    pointer-events: none;
    z-index: 100;
    left: ${x}px;
    top: ${y}px;
  `;
  return el;
};

const calculateSpotlightValues = (radius: number) => ({
  proximity: radius * 0.5,
  fadeDistance: radius * 0.75
});

const updateCardGlowProperties = (card: HTMLElement, mouseX: number, mouseY: number, glow: number, radius: number) => {
  const rect = card.getBoundingClientRect();
  const relativeX = ((mouseX - rect.left) / rect.width) * 100;
  const relativeY = ((mouseY - rect.top) / rect.height) * 100;

  card.style.setProperty('--glow-x', `${relativeX}%`);
  card.style.setProperty('--glow-y', `${relativeY}%`);
  card.style.setProperty('--glow-intensity', glow.toString());
  card.style.setProperty('--glow-radius', `${radius}px`);
};

/**
 * ParticleCard component - Individual card with particle effects
 */
const ParticleCard: React.FC<{
  children: React.ReactNode;
  className?: string;
  disableAnimations?: boolean;
  style?: React.CSSProperties;
  particleCount?: number;
  glowColor?: string;
  enableTilt?: boolean;
  clickEffect?: boolean;
  enableMagnetism?: boolean;
  onClick?: () => void;
}> = ({
  children,
  className = '',
  disableAnimations = false,
  style,
  particleCount = DEFAULT_PARTICLE_COUNT,
  glowColor = DEFAULT_GLOW_COLOR,
  enableTilt = true,
  clickEffect = false,
  enableMagnetism = false,
  onClick
}) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const particlesRef = useRef<HTMLDivElement[]>([]);
  const timeoutsRef = useRef<NodeJS.Timeout[]>([]);
  const isHoveredRef = useRef(false);
  const memoizedParticles = useRef<HTMLDivElement[]>([]);
  const particlesInitialized = useRef(false);
  const magnetismAnimationRef = useRef<gsap.core.Tween | null>(null);

  const initializeParticles = useCallback(() => {
    if (particlesInitialized.current || !cardRef.current) return;

    const { width, height } = cardRef.current.getBoundingClientRect();
    memoizedParticles.current = Array.from({ length: particleCount }, () =>
      createParticleElement(Math.random() * width, Math.random() * height, glowColor)
    );
    particlesInitialized.current = true;
  }, [particleCount, glowColor]);

  const clearAllParticles = useCallback(() => {
    timeoutsRef.current.forEach(clearTimeout);
    timeoutsRef.current = [];
    magnetismAnimationRef.current?.kill();

    particlesRef.current.forEach(particle => {
      gsap.to(particle, {
        scale: 0,
        opacity: 0,
        duration: 0.3,
        ease: 'back.in(1.7)',
        onComplete: () => {
          particle.parentNode?.removeChild(particle);
        }
      });
    });
    particlesRef.current = [];
  }, []);

  const animateParticles = useCallback(() => {
    if (!cardRef.current || !isHoveredRef.current) return;

    if (!particlesInitialized.current) {
      initializeParticles();
    }

    memoizedParticles.current.forEach((particle, index) => {
      const timeoutId = setTimeout(() => {
        if (!isHoveredRef.current || !cardRef.current) return;

        const clone = particle.cloneNode(true) as HTMLDivElement;
        cardRef.current.appendChild(clone);
        particlesRef.current.push(clone);

        gsap.fromTo(clone, { scale: 0, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.3, ease: 'back.out(1.7)' });

        gsap.to(clone, {
          x: (Math.random() - 0.5) * 100,
          y: (Math.random() - 0.5) * 100,
          rotation: Math.random() * 360,
          duration: 2 + Math.random() * 2,
          ease: 'none',
          repeat: -1,
          yoyo: true
        });

        gsap.to(clone, {
          opacity: 0.3,
          duration: 1.5,
          ease: 'power2.inOut',
          repeat: -1,
          yoyo: true
        });
      }, index * 100);

      timeoutsRef.current.push(timeoutId);
    });
  }, [initializeParticles]);

  useEffect(() => {
    if (disableAnimations || !cardRef.current) return;

    const element = cardRef.current;

    const handleMouseEnter = () => {
      isHoveredRef.current = true;
      animateParticles();

      if (enableTilt) {
        gsap.to(element, {
          rotateX: 5,
          rotateY: 5,
          duration: 0.3,
          ease: 'power2.out',
          transformPerspective: 1000
        });
      }
    };

    const handleMouseLeave = () => {
      isHoveredRef.current = false;
      clearAllParticles();

      if (enableTilt) {
        gsap.to(element, {
          rotateX: 0,
          rotateY: 0,
          duration: 0.3,
          ease: 'power2.out'
        });
      }

      if (enableMagnetism) {
        gsap.to(element, {
          x: 0,
          y: 0,
          duration: 0.3,
          ease: 'power2.out'
        });
      }
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (!enableTilt && !enableMagnetism) return;

      const rect = element.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      if (enableTilt) {
        const rotateX = ((y - centerY) / centerY) * -10;
        const rotateY = ((x - centerX) / centerX) * 10;

        gsap.to(element, {
          rotateX,
          rotateY,
          duration: 0.1,
          ease: 'power2.out',
          transformPerspective: 1000
        });
      }

      if (enableMagnetism) {
        const magnetX = (x - centerX) * 0.05;
        const magnetY = (y - centerY) * 0.05;

        magnetismAnimationRef.current = gsap.to(element, {
          x: magnetX,
          y: magnetY,
          duration: 0.3,
          ease: 'power2.out'
        });
      }
    };

    const handleClick = (e: MouseEvent) => {
      if (onClick) {
        onClick();
      }

      if (!clickEffect) return;

      const rect = element.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const maxDistance = Math.max(
        Math.hypot(x, y),
        Math.hypot(x - rect.width, y),
        Math.hypot(x, y - rect.height),
        Math.hypot(x - rect.width, y - rect.height)
      );

      const ripple = document.createElement('div');
      ripple.style.cssText = `
        position: absolute;
        width: ${maxDistance * 2}px;
        height: ${maxDistance * 2}px;
        border-radius: 50%;
        background: radial-gradient(circle, rgba(${glowColor}, 0.4) 0%, rgba(${glowColor}, 0.2) 30%, transparent 70%);
        left: ${x - maxDistance}px;
        top: ${y - maxDistance}px;
        pointer-events: none;
        z-index: 1000;
      `;

      element.appendChild(ripple);

      gsap.fromTo(
        ripple,
        {
          scale: 0,
          opacity: 1
        },
        {
          scale: 1,
          opacity: 0,
          duration: 0.8,
          ease: 'power2.out',
          onComplete: () => ripple.remove()
        }
      );
    };

    element.addEventListener('mouseenter', handleMouseEnter);
    element.addEventListener('mouseleave', handleMouseLeave);
    element.addEventListener('mousemove', handleMouseMove);
    element.addEventListener('click', handleClick);

    return () => {
      isHoveredRef.current = false;
      element.removeEventListener('mouseenter', handleMouseEnter);
      element.removeEventListener('mouseleave', handleMouseLeave);
      element.removeEventListener('mousemove', handleMouseMove);
      element.removeEventListener('click', handleClick);
      clearAllParticles();
    };
  }, [animateParticles, clearAllParticles, disableAnimations, enableTilt, enableMagnetism, clickEffect, glowColor, onClick]);

  return (
    <div
      ref={cardRef}
      className={`${className} relative overflow-hidden`}
      style={{ ...style, position: 'relative', overflow: 'hidden' }}
    >
      {children}
    </div>
  );
};

/**
 * GlobalSpotlight component - Creates a spotlight effect following the mouse
 */
const GlobalSpotlight: React.FC<{
  gridRef: React.RefObject<HTMLDivElement | null>;
  disableAnimations?: boolean;
  enabled?: boolean;
  spotlightRadius?: number;
  glowColor?: string;
}> = ({
  gridRef,
  disableAnimations = false,
  enabled = true,
  spotlightRadius = DEFAULT_SPOTLIGHT_RADIUS,
  glowColor = DEFAULT_GLOW_COLOR
}) => {
  const spotlightRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (disableAnimations || !gridRef?.current || !enabled) return;

    const spotlight = document.createElement('div');
    spotlight.className = 'global-spotlight';
    spotlight.style.cssText = `
      position: fixed;
      width: 800px;
      height: 800px;
      border-radius: 50%;
      pointer-events: none;
      background: radial-gradient(circle,
        rgba(${glowColor}, 0.15) 0%,
        rgba(${glowColor}, 0.08) 15%,
        rgba(${glowColor}, 0.04) 25%,
        rgba(${glowColor}, 0.02) 40%,
        rgba(${glowColor}, 0.01) 65%,
        transparent 70%
      );
      z-index: 200;
      opacity: 0;
      transform: translate(-50%, -50%);
      mix-blend-mode: screen;
    `;
    document.body.appendChild(spotlight);
    spotlightRef.current = spotlight;

    const handleMouseMove = (e: MouseEvent) => {
      if (!spotlightRef.current || !gridRef.current) return;

      const section = gridRef.current.closest('.bento-section');
      const rect = section?.getBoundingClientRect();
      const mouseInside =
        rect && e.clientX >= rect.left && e.clientX <= rect.right && e.clientY >= rect.top && e.clientY <= rect.bottom;

      const cards = gridRef.current.querySelectorAll('.bento-card');

      if (!mouseInside) {
        gsap.to(spotlightRef.current, {
          opacity: 0,
          duration: 0.3,
          ease: 'power2.out'
        });
        cards.forEach(card => {
          (card as HTMLElement).style.setProperty('--glow-intensity', '0');
        });
        return;
      }

      const { proximity, fadeDistance } = calculateSpotlightValues(spotlightRadius);
      let minDistance = Infinity;

      cards.forEach(card => {
        const cardElement = card as HTMLElement;
        const cardRect = cardElement.getBoundingClientRect();
        const centerX = cardRect.left + cardRect.width / 2;
        const centerY = cardRect.top + cardRect.height / 2;
        const distance =
          Math.hypot(e.clientX - centerX, e.clientY - centerY) - Math.max(cardRect.width, cardRect.height) / 2;
        const effectiveDistance = Math.max(0, distance);

        minDistance = Math.min(minDistance, effectiveDistance);

        let glowIntensity = 0;
        if (effectiveDistance <= proximity) {
          glowIntensity = 1;
        } else if (effectiveDistance <= fadeDistance) {
          glowIntensity = (fadeDistance - effectiveDistance) / (fadeDistance - proximity);
        }

        updateCardGlowProperties(cardElement, e.clientX, e.clientY, glowIntensity, spotlightRadius);
      });

      gsap.to(spotlightRef.current, {
        left: e.clientX,
        top: e.clientY,
        duration: 0.1,
        ease: 'power2.out'
      });

      const targetOpacity =
        minDistance <= proximity
          ? 0.8
          : minDistance <= fadeDistance
            ? ((fadeDistance - minDistance) / (fadeDistance - proximity)) * 0.8
            : 0;

      gsap.to(spotlightRef.current, {
        opacity: targetOpacity,
        duration: targetOpacity > 0 ? 0.2 : 0.5,
        ease: 'power2.out'
      });
    };

    const handleMouseLeave = () => {
      gridRef.current?.querySelectorAll('.bento-card').forEach(card => {
        (card as HTMLElement).style.setProperty('--glow-intensity', '0');
      });
      if (spotlightRef.current) {
        gsap.to(spotlightRef.current, {
          opacity: 0,
          duration: 0.3,
          ease: 'power2.out'
        });
      }
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
      spotlightRef.current?.parentNode?.removeChild(spotlightRef.current);
    };
  }, [gridRef, disableAnimations, enabled, spotlightRadius, glowColor]);

  return null;
};

/**
 * Hook to detect mobile devices
 */
const useMobileDetection = () => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth <= MOBILE_BREAKPOINT);

    checkMobile();
    window.addEventListener('resize', checkMobile);

    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  return isMobile;
};

/**
 * MagicBento Component
 * Interactive bento grid for displaying GitHub projects with various effects
 */
const MagicBento: React.FC<MagicBentoProps> = ({
  projects,
  textAutoHide = true,
  enableStars = true,
  enableSpotlight = true,
  enableBorderGlow = true,
  disableAnimations = false,
  spotlightRadius = DEFAULT_SPOTLIGHT_RADIUS,
  particleCount = DEFAULT_PARTICLE_COUNT,
  enableTilt = true,
  glowColor = DEFAULT_GLOW_COLOR,
  clickEffect = true,
  enableMagnetism = true,
  title
}) => {
  const gridRef = useRef<HTMLDivElement>(null);
  const isMobile = useMobileDetection();
  const shouldDisableAnimations = disableAnimations || isMobile;

  // Display all projects in bento grid
  const displayProjects = projects;

  return (
    <>
      <style>
        {`
          .bento-section {
            --glow-x: 50%;
            --glow-y: 50%;
            --glow-intensity: 0;
            --glow-radius: 200px;
            --glow-color: ${glowColor};
          }
          
          .bento-grid {
            display: grid;
            gap: 1.5rem;
            width: 100%;
            grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
            margin: 0 auto;
            position: relative;
          }
          
          @media (max-width: 768px) {
            .bento-grid {
              gap: 1rem;
              grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
            }
          }
          
          @media (max-width: 640px) {
            .bento-grid {
              gap: 1rem;
              grid-template-columns: 1fr;
            }
          }
          
          .bento-card:nth-child(6n+1) {
            grid-row: span 2;
          }
          
          @media (min-width: 1280px) {
            .bento-card:nth-child(8n+1),
            .bento-card:nth-child(8n+4) {
              grid-column: span 2;
            }
          }
          
          .bento-card--border-glow::after {
            content: '';
            position: absolute;
            inset: 0;
            padding: 2px;
            background: radial-gradient(var(--glow-radius) circle at var(--glow-x) var(--glow-y),
                rgba(${glowColor}, calc(var(--glow-intensity) * 0.8)) 0%,
                rgba(${glowColor}, calc(var(--glow-intensity) * 0.4)) 30%,
                transparent 60%);
            border-radius: inherit;
            mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
            mask-composite: subtract;
            -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
            -webkit-mask-composite: xor;
            pointer-events: none;
            transition: opacity 0.3s ease;
            z-index: 1;
          }
          
          .bento-card--border-glow:hover::after {
            opacity: 1;
          }
          
          .bento-card--border-glow:hover {
            box-shadow: 0 4px 20px rgba(46, 228, 234, 0.2), 0 0 30px rgba(${glowColor}, 0.2);
          }
          
          .text-clamp-1 {
            display: -webkit-box;
            -webkit-box-orient: vertical;
            -webkit-line-clamp: 1;
            line-clamp: 1;
            overflow: hidden;
            text-overflow: ellipsis;
          }
          
          .text-clamp-2 {
            display: -webkit-box;
            -webkit-box-orient: vertical;
            -webkit-line-clamp: 2;
            line-clamp: 2;
            overflow: hidden;
            text-overflow: ellipsis;
          }
        `}
      </style>

      {enableSpotlight && (
        <GlobalSpotlight
          gridRef={gridRef}
          disableAnimations={shouldDisableAnimations}
          enabled={enableSpotlight}
          spotlightRadius={spotlightRadius}
          glowColor={glowColor}
        />
      )}

      <div className="bento-section w-full">
        {title && (
          <h2 className="text-2xl md:text-3xl font-bold text-accent-yellow mb-6 font-cyberpunk text-center">
            {title}
          </h2>
        )}
        
        <div className="bento-grid" ref={gridRef}>
          {displayProjects.map((project, index) => {

            const baseClassName = `bento-card card-glass group flex flex-col justify-between relative min-h-[200px] p-6 overflow-hidden transition-all duration-300 hover:-translate-y-1 cursor-pointer ${
              enableBorderGlow ? 'bento-card--border-glow' : ''
            }`;

            const cardStyle = {
              '--glow-x': '50%',
              '--glow-y': '50%',
              '--glow-intensity': '0',
              '--glow-radius': '200px'
            } as React.CSSProperties;

            const handleCardClick = () => {
              window.open(project.html_url, '_blank', 'noopener,noreferrer');
            };

            const CardContent = (
              <>
                <div className="flex justify-between items-start mb-3">
                  <div className="flex items-center gap-2">
                    {project.language && (
                      <>
                        <div
                          className="w-3 h-3 rounded-full flex-shrink-0"
                          style={{ 
                            backgroundColor: project.languageColor || getLanguageColorFallback(project.language),
                            boxShadow: `0 0 6px ${project.languageColor || getLanguageColorFallback(project.language)}40`
                          }}
                        />
                        <span className="text-xs text-gray-400">{project.language}</span>
                      </>
                    )}
                  </div>
                  <div className="flex items-center gap-3 text-xs text-gray-400">
                    {project.stargazers_count > 0 && (
                      <span className="flex items-center gap-1">
                        <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                        {project.stargazers_count}
                      </span>
                    )}
                    {project.forks_count > 0 && (
                      <span className="flex items-center gap-1">
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                        </svg>
                        {project.forks_count}
                      </span>
                    )}
                  </div>
                </div>
                
                <div className="flex-grow">
                  <h3 className={`text-lg font-semibold text-white mb-2 group-hover:text-accent-cyan transition-colors ${textAutoHide ? 'text-clamp-1' : ''}`}>
                    {project.name}
                  </h3>
                  <p className={`text-sm text-gray-300 mb-3 ${textAutoHide ? 'text-clamp-2' : ''}`}>
                    {project.description || 'No description available'}
                  </p>
                </div>
                
                {project.topics && project.topics.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-auto">
                    {project.topics.slice(0, 3).map((topic, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-1 text-xs rounded-full bg-gray-800 text-gray-400"
                      >
                        {topic}
                      </span>
                    ))}
                  </div>
                )}
              </>
            );

            if (enableStars) {
              return (
                <ParticleCard
                  key={project.id}
                  className={baseClassName}
                  style={cardStyle}
                  disableAnimations={shouldDisableAnimations}
                  particleCount={particleCount}
                  glowColor={glowColor}
                  enableTilt={enableTilt}
                  clickEffect={clickEffect}
                  enableMagnetism={enableMagnetism}
                  onClick={handleCardClick}
                >
                  {CardContent}
                </ParticleCard>
              );
            }

            return (
              <div
                key={project.id}
                className={baseClassName}
                style={cardStyle}
                onClick={handleCardClick}
              >
                {CardContent}
              </div>
            );
          })}
        </div>
        
      </div>
    </>
  );
};

export default MagicBento;