import React, { useRef, useEffect, useState } from 'react';

interface GooeyNavItem {
  label: string;
  href: string;
}

export interface GooeyNavProps {
  items: GooeyNavItem[];
  animationTime?: number;
  particleCount?: number;
  particleDistances?: [number, number];
  particleR?: number;
  timeVariance?: number;
  colors?: number[];
  initialActiveIndex?: number;
  currentPath?: string;
}

/**
 * GooeyNav Component
 * 
 * Creates a liquid/gooey effect navigation with morphing background
 * that follows the active nav item. Perfect for cyberpunk themes.
 */
const GooeyNav: React.FC<GooeyNavProps> = ({
  items,
  animationTime = 600,
  particleCount = 15,
  particleDistances = [90, 10],
  particleR = 100,
  timeVariance = 300,
  colors = [1, 2, 3, 1, 2, 3, 1, 4],
  initialActiveIndex = 0,
  currentPath
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const navRef = useRef<HTMLUListElement>(null);
  const filterRef = useRef<HTMLSpanElement>(null);
  const textRef = useRef<HTMLSpanElement>(null);
  
  // Determine active index based on current path
  const getActiveIndex = () => {
    if (!currentPath) return initialActiveIndex;
    const index = items.findIndex(item => {
      if (item.href === '/') {
        return currentPath === '/';
      }
      return currentPath?.startsWith(item.href);
    });
    return index >= 0 ? index : initialActiveIndex;
  };
  
  const [activeIndex, setActiveIndex] = useState<number>(getActiveIndex());

  const noise = (n = 1) => n / 2 - Math.random() * n;
  
  const getXY = (distance: number, pointIndex: number, totalPoints: number): [number, number] => {
    const angle = ((360 + noise(8)) / totalPoints) * pointIndex * (Math.PI / 180);
    return [distance * Math.cos(angle), distance * Math.sin(angle)];
  };
  
  const createParticle = (i: number, t: number, d: [number, number], r: number) => {
    let rotate = noise(r / 10);
    return {
      start: getXY(d[0], particleCount - i, particleCount),
      end: getXY(d[1] + noise(7), particleCount - i, particleCount),
      time: t,
      scale: 1 + noise(0.2),
      color: colors[Math.floor(Math.random() * colors.length)],
      rotate: rotate > 0 ? (rotate + r / 20) * 10 : (rotate - r / 20) * 10
    };
  };
  
  const makeParticles = (element: HTMLElement) => {
    const d: [number, number] = particleDistances;
    const r = particleR;
    const bubbleTime = animationTime * 2 + timeVariance;
    element.style.setProperty('--time', `${bubbleTime}ms`);
    
    for (let i = 0; i < particleCount; i++) {
      const t = animationTime * 2 + noise(timeVariance * 2);
      const p = createParticle(i, t, d, r);
      element.classList.remove('active');
      
      setTimeout(() => {
        const particle = document.createElement('span');
        const point = document.createElement('span');
        particle.classList.add('particle');
        particle.style.setProperty('--start-x', `${p.start[0]}px`);
        particle.style.setProperty('--start-y', `${p.start[1]}px`);
        particle.style.setProperty('--end-x', `${p.end[0]}px`);
        particle.style.setProperty('--end-y', `${p.end[1]}px`);
        particle.style.setProperty('--time', `${p.time}ms`);
        particle.style.setProperty('--scale', `${p.scale}`);
        particle.style.setProperty('--color', `var(--color-${p.color}, white)`);
        particle.style.setProperty('--rotate', `${p.rotate}deg`);
        point.classList.add('point');
        particle.appendChild(point);
        element.appendChild(particle);
        
        requestAnimationFrame(() => {
          element.classList.add('active');
        });
        
        setTimeout(() => {
          try {
            element.removeChild(particle);
          } catch {}
        }, t);
      }, 30);
    }
  };
  
  const updateEffectPosition = (element: HTMLElement) => {
    if (!containerRef.current || !filterRef.current || !textRef.current) return;
    
    const containerRect = containerRef.current.getBoundingClientRect();
    const pos = element.getBoundingClientRect();
    const styles = {
      left: `${pos.x - containerRect.x}px`,
      top: `${pos.y - containerRect.y}px`,
      width: `${pos.width}px`,
      height: `${pos.height}px`
    };
    
    Object.assign(filterRef.current.style, styles);
    Object.assign(textRef.current.style, styles);
    textRef.current.innerText = element.innerText;
  };
  
  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>, index: number) => {
    e.preventDefault();
    if (activeIndex === index) return;
    
    const liEl = e.currentTarget.parentElement;
    if (!liEl) return;
    
    setActiveIndex(index);
    updateEffectPosition(liEl);
    
    if (filterRef.current) {
      const particles = filterRef.current.querySelectorAll('.particle');
      particles.forEach(p => filterRef.current!.removeChild(p));
    }
    
    if (textRef.current) {
      textRef.current.classList.remove('active');
      void textRef.current.offsetWidth;
      textRef.current.classList.add('active');
    }
    
    if (filterRef.current) {
      makeParticles(filterRef.current);
    }
    
    // Navigate to the URL
    setTimeout(() => {
      window.location.href = items[index].href;
    }, 300);
  };
  
  useEffect(() => {
    setActiveIndex(getActiveIndex());
  }, [currentPath]);
  
  useEffect(() => {
    if (!navRef.current || !containerRef.current) return;
    
    const activeLi = navRef.current.querySelectorAll('li')[activeIndex] as HTMLElement;
    if (activeLi) {
      updateEffectPosition(activeLi);
      textRef.current?.classList.add('active');
    }
    
    const resizeObserver = new ResizeObserver(() => {
      const currentActiveLi = navRef.current?.querySelectorAll('li')[activeIndex] as HTMLElement;
      if (currentActiveLi) {
        updateEffectPosition(currentActiveLi);
      }
    });
    
    resizeObserver.observe(containerRef.current);
    return () => resizeObserver.disconnect();
  }, [activeIndex]);

  return (
    <>
      <style>
        {`
          :root {
            --color-1: #2be4ea;
            --color-2: #fed33f;
            --color-3: #e8615a;
            --color-4: #00ffff;
          }
          
          .gooey-nav-container {
            position: relative;
            transform: translate3d(0,0,0.01px);
          }
          
          .gooey-effect {
            position: absolute;
            opacity: 1;
            pointer-events: none;
            display: grid;
            place-items: center;
            z-index: 1;
            border-radius: 9999px;
          }
          
          .gooey-effect.text {
            color: #0f1216;
            transition: color 0.3s ease;
            font-weight: 600;
            text-transform: uppercase;
            font-size: 16px;
          }
          
          .gooey-effect.text.active {
            color: #0f1216;
          }
          
          .gooey-effect.filter {
            filter: blur(10px) contrast(20);
            mix-blend-mode: lighten;
          }
          
          .gooey-effect.filter::before {
            content: "";
            position: absolute;
            inset: -100px;
            z-index: -2;
            background: transparent;
          }
          
          .gooey-effect.filter::after {
            content: "";
            position: absolute;
            inset: 0;
            background: #2be4ea;
            transform: scale(0);
            opacity: 0;
            z-index: -1;
            border-radius: 9999px;
          }
          
          .gooey-effect.active::after {
            animation: gooey-pill 0.3s ease both;
          }
          
          @keyframes gooey-pill {
            to {
              transform: scale(1);
              opacity: 1;
            }
          }
          
          .particle,
          .point {
            display: block;
            opacity: 0;
            width: 20px;
            height: 20px;
            border-radius: 9999px;
            transform-origin: center;
          }
          
          .particle {
            --time: 5s;
            position: absolute;
            top: calc(50% - 10px);
            left: calc(50% - 10px);
            animation: particle calc(var(--time)) ease 1 -350ms;
          }
          
          .point {
            background: var(--color);
            opacity: 1;
            animation: point calc(var(--time)) ease 1 -350ms;
          }
          
          @keyframes particle {
            0% {
              transform: rotate(0deg) translate(calc(var(--start-x)), calc(var(--start-y)));
              opacity: 1;
              animation-timing-function: cubic-bezier(0.55, 0, 1, 0.45);
            }
            70% {
              transform: rotate(calc(var(--rotate) * 0.5)) translate(calc(var(--end-x) * 1.2), calc(var(--end-y) * 1.2));
              opacity: 1;
              animation-timing-function: ease;
            }
            85% {
              transform: rotate(calc(var(--rotate) * 0.66)) translate(calc(var(--end-x)), calc(var(--end-y)));
              opacity: 1;
            }
            100% {
              transform: rotate(calc(var(--rotate) * 1.2)) translate(calc(var(--end-x) * 0.5), calc(var(--end-y) * 0.5));
              opacity: 1;
            }
          }
          
          @keyframes point {
            0% {
              transform: scale(0);
              opacity: 0;
              animation-timing-function: cubic-bezier(0.55, 0, 1, 0.45);
            }
            25% {
              transform: scale(calc(var(--scale) * 0.25));
            }
            38% {
              opacity: 1;
            }
            65% {
              transform: scale(var(--scale));
              opacity: 1;
              animation-timing-function: ease;
            }
            85% {
              transform: scale(var(--scale));
              opacity: 1;
            }
            100% {
              transform: scale(0);
              opacity: 0;
            }
          }
          
          .gooey-nav-item {
            position: relative;
            cursor: pointer;
            transition: all 0.3s ease;
            color: #f4908b;
          }
          
          .gooey-nav-item.active {
            color: #0f1216 !important;
          }
          
          .gooey-nav-item.active::after {
            opacity: 1;
            transform: scale(1);
          }
          
          .gooey-nav-item::after {
            content: "";
            position: absolute;
            inset: 0;
            border-radius: 9999px;
            background: transparent;
            opacity: 0;
            transform: scale(0);
            transition: all 0.3s ease;
            z-index: -1;
          }
        `}
      </style>
      
      <div className="gooey-nav-container" ref={containerRef}>
        <nav className="flex relative">
          <ul
            ref={navRef}
            className="flex gap-1 list-none p-[3px] m-0 relative z-[3] bg-gray-900/50 rounded-full backdrop-blur-sm border border-gray-700/30"
          >
            {items.map((item, index) => (
              <li
                key={index}
                className={`gooey-nav-item rounded-full relative ${
                  activeIndex === index ? 'active' : ''
                }`}
              >
                <a
                  href={item.href}
                  onClick={e => handleClick(e, index)}
                  className="outline-none py-[12px] px-[24px] inline-block text-[16px] font-semibold uppercase tracking-[0.5px] no-underline"
                  style={{
                    color: activeIndex === index ? '#0f1216' : 'inherit'
                  }}
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
        <span className="gooey-effect filter" ref={filterRef} />
        <span className="gooey-effect text" ref={textRef} />
      </div>
    </>
  );
};

export default GooeyNav;