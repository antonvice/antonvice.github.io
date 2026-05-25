import React, { useEffect, useRef } from "react";
import "../styles/lanyard-card.css";

interface LanyardCardProps {
  name: string;
  title: string;
  subtitle?: string;
  xlabUrl?: string;
  description?: string[];
  avatar?: string;
  socials?: Array<{
    icon: string;
    href: string;
    label: string;
  }>;
}

type Point = {
  x: number;
  y: number;
  oldX: number;
  oldY: number;
};

const BADGES = ["AI", "Robotics", "Writing"];

const LanyardCard: React.FC<LanyardCardProps> = ({
  name,
  title,
  subtitle,
  xlabUrl,
  description = [],
  socials = [],
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const badgeRef = useRef<HTMLDivElement>(null);
  const pointerRef = useRef({ x: 0, y: 0, active: false });

  useEffect(() => {
    let cancelled = false;
    let cleanup: () => void = () => {};

    const initLanyard = async () => {
      const [
        { WebGLRenderer },
        { Scene },
        { OrthographicCamera },
        { LineBasicMaterial },
        { MeshBasicMaterial },
        { BufferGeometry },
        { BufferAttribute },
        { Line },
        { Mesh },
        { RingGeometry },
      ] = await Promise.all([
        import("three/src/renderers/WebGLRenderer.js"),
        import("three/src/scenes/Scene.js"),
        import("three/src/cameras/OrthographicCamera.js"),
        import("three/src/materials/LineBasicMaterial.js"),
        import("three/src/materials/MeshBasicMaterial.js"),
        import("three/src/core/BufferGeometry.js"),
        import("three/src/core/BufferAttribute.js"),
        import("three/src/objects/Line.js"),
        import("three/src/objects/Mesh.js"),
        import("three/src/geometries/RingGeometry.js"),
      ]);
      if (cancelled) return;

      const container = containerRef.current;
      const canvas = canvasRef.current;
      const badge = badgeRef.current;
      if (!container || !canvas || !badge) return;

      const reducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      ).matches;
      const renderer = new WebGLRenderer({
        canvas,
        alpha: true,
        antialias: true,
      });
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));

      const scene = new Scene();
      const camera = new OrthographicCamera(0, 1, 1, 0, -10, 10);
      camera.position.z = 5;

      const strapMaterial = new LineBasicMaterial({
        color: 0x1894c7,
        transparent: true,
        opacity: 0.82,
      });
      const ghostMaterial = new LineBasicMaterial({
        color: 0xff5fa2,
        transparent: true,
        opacity: 0.32,
      });
      const ringMaterial = new MeshBasicMaterial({
        color: 0x26171f,
        transparent: true,
        opacity: 0.88,
      });

      const strapGeometry = new BufferGeometry();
      const ghostGeometry = new BufferGeometry();
      const strap = new Line(strapGeometry, strapMaterial);
      const ghostStrap = new Line(ghostGeometry, ghostMaterial);
      const anchorRing = new Mesh(new RingGeometry(9, 13, 36), ringMaterial);
      const clip = new Mesh(new RingGeometry(8, 12, 36), ringMaterial);
      scene.add(ghostStrap, strap, anchorRing, clip);

      let width = 1;
      let height = 1;
      let anchorX = 0;
      let attachY = 168;
      let segmentLength = 22;
      let points: Point[] = [];
      let frameId = 0;
      let lastTime = performance.now();

      const createPoints = () => {
        anchorX = width / 2;
        attachY = Math.min(178, Math.max(150, height * 0.27));
        segmentLength = attachY / 8;
        points = Array.from({ length: 9 }, (_, index) => {
          const y = 18 + index * segmentLength;
          return { x: anchorX, y, oldX: anchorX, oldY: y };
        });
      };

      const resize = () => {
        const rect = container.getBoundingClientRect();
        width = Math.max(320, rect.width);
        height = Math.max(560, rect.height);

        renderer.setSize(width, height, false);
        camera.left = 0;
        camera.right = width;
        camera.top = 0;
        camera.bottom = height;
        camera.updateProjectionMatrix();
        createPoints();
      };

      const satisfyConstraints = () => {
        points[0].x = anchorX;
        points[0].y = 18;

        for (let iteration = 0; iteration < 7; iteration += 1) {
          points[0].x = anchorX;
          points[0].y = 18;

          for (let index = 0; index < points.length - 1; index += 1) {
            const current = points[index];
            const next = points[index + 1];
            const dx = next.x - current.x;
            const dy = next.y - current.y;
            const distance = Math.hypot(dx, dy) || 1;
            const difference = (distance - segmentLength) / distance;
            const offsetX = dx * difference * 0.5;
            const offsetY = dy * difference * 0.5;

            if (index !== 0) {
              current.x += offsetX;
              current.y += offsetY;
            }

            next.x -= offsetX;
            next.y -= offsetY;
          }
        }
      };

      const updateGeometry = () => {
        const strapPositions = new Float32Array(points.length * 3);
        const ghostPositions = new Float32Array(points.length * 3);

        points.forEach((point, index) => {
          strapPositions[index * 3] = point.x;
          strapPositions[index * 3 + 1] = point.y;
          strapPositions[index * 3 + 2] = 0;

          ghostPositions[index * 3] = point.x - 12;
          ghostPositions[index * 3 + 1] = point.y + 3;
          ghostPositions[index * 3 + 2] = 0;
        });

        strapGeometry.setAttribute(
          "position",
          new BufferAttribute(strapPositions, 3),
        );
        ghostGeometry.setAttribute(
          "position",
          new BufferAttribute(ghostPositions, 3),
        );

        const last = points[points.length - 1];
        anchorRing.position.set(anchorX, 18, 0);
        clip.position.set(last.x, last.y + 8, 0);
      };

      const animate = (now: number) => {
        const delta = Math.min((now - lastTime) / 16.67, 2);
        lastTime = now;
        const time = now * 0.001;
        const pointer = pointerRef.current;

        anchorX = width / 2 + Math.sin(time * 0.75) * (reducedMotion ? 2 : 9);

        points.forEach((point, index) => {
          if (index === 0) return;

          const velocityX = (point.x - point.oldX) * 0.965;
          const velocityY = (point.y - point.oldY) * 0.965;
          point.oldX = point.x;
          point.oldY = point.y;

          const wind = Math.sin(time * 1.2 + index * 0.45) * 0.035;
          point.x += velocityX + wind * delta;
          point.y += velocityY + 0.24 * delta;

          if (pointer.active && index > points.length - 4) {
            point.x += (pointer.x - point.x) * 0.0025 * delta;
          }
        });

        satisfyConstraints();
        updateGeometry();

        const last = points[points.length - 1];
        const previous = points[points.length - 2];
        const angle = Math.atan2(last.x - previous.x, last.y - previous.y);
        const swayX = last.x - width / 2;
        const swayY = last.y - attachY;
        const tilt = reducedMotion ? 0 : Math.max(-8, Math.min(8, angle * 18));

        badge.style.transform = `translate3d(${swayX}px, ${swayY}px, 0) rotateZ(${angle * 0.58}rad) rotateX(${tilt * 0.15}deg)`;
        renderer.render(scene, camera);
        frameId = requestAnimationFrame(animate);
      };

      resize();
      window.addEventListener("resize", resize);
      frameId = requestAnimationFrame(animate);

      cleanup = () => {
        cancelAnimationFrame(frameId);
        window.removeEventListener("resize", resize);
        strapGeometry.dispose();
        ghostGeometry.dispose();
        strapMaterial.dispose();
        ghostMaterial.dispose();
        ringMaterial.dispose();
        renderer.dispose();
      };
    };

    initLanyard();

    return () => {
      cancelled = true;
      cleanup();
    };
  }, []);

  const handlePointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;

    pointerRef.current = {
      x: event.clientX - rect.left,
      y: event.clientY - rect.top,
      active: true,
    };
  };

  const clearPointer = () => {
    pointerRef.current.active = false;
  };

  return (
    <div
      ref={containerRef}
      className="lanyard-stage relative w-full h-[620px] flex items-start justify-center"
      onPointerMove={handlePointerMove}
      onPointerLeave={clearPointer}
    >
      <canvas
        ref={canvasRef}
        className="absolute inset-0 z-0 h-full w-full pointer-events-none"
        aria-hidden="true"
      />

      <div
        ref={badgeRef}
        className="lanyard-badge relative z-10 mt-[168px] w-[min(380px,92vw)] origin-top transform-gpu"
      >
        <div className="relative h-[480px] overflow-hidden rounded-lg border-[3px] border-dark bg-[var(--neo-surface)] shadow-[10px_10px_0_var(--neo-ink)]">
          <div className="absolute inset-x-0 top-0 h-2 bg-[linear-gradient(90deg,var(--neo-pink),var(--neo-yellow),var(--neo-blue))]" />
          <div className="absolute inset-0 bg-[repeating-linear-gradient(135deg,transparent_0_22px,rgba(38,23,31,0.035)_22px_25px,transparent_25px_44px)]" />

          <div className="relative z-10 flex h-full flex-col justify-between p-5">
            <div>
              <div className="mb-4 flex items-center justify-between gap-3">
                <span className="rounded-md border-2 border-dark bg-accent-yellow px-2 py-1 text-[11px] font-bold uppercase text-dark shadow-[3px_3px_0_var(--neo-ink)]">
                  Builder Badge
                </span>
                <span className="rounded-md border-2 border-dark bg-accent-cyan px-2 py-1 text-[11px] font-bold text-dark shadow-[3px_3px_0_var(--neo-ink)]">Austin, TX</span>
              </div>

              <div className="mb-5 flex justify-center">
                <div className="rounded-lg border-[3px] border-dark bg-white p-2 shadow-[6px_6px_0_var(--neo-pink)]">
                  <img
                    src="/qr.png"
                    alt="QR code"
                    className="h-24 w-24 object-contain"
                  />
                </div>
              </div>

              <div className="text-center">
                <h3 className="mb-1 text-2xl font-bold leading-tight text-dark">
                  {name}
                </h3>
                <div className="text-base font-bold text-accent-coral">
                  {title}
                </div>
                {subtitle && (
                  <div className="mt-1 text-xs font-semibold leading-tight text-dark/80">
                    {xlabUrl ? (
                      <a
                        href={xlabUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:text-accent-coral transition-colors"
                        onClick={(event) => event.stopPropagation()}
                      >
                        {subtitle}
                      </a>
                    ) : (
                      subtitle
                    )}
                  </div>
                )}
              </div>

              <div className="mt-4 flex flex-wrap justify-center gap-2">
                {BADGES.map((badge) => (
                  <span
                    key={badge}
                    className="rounded-md border-2 border-dark bg-accent-cyan px-2 py-1 text-xs font-bold text-dark shadow-[3px_3px_0_var(--neo-ink)]"
                  >
                    {badge}
                  </span>
                ))}
              </div>

              {description.length > 0 && (
                <div className="mx-auto mt-5 max-w-[280px] space-y-1 text-center">
                  {description.map((text) => (
                    <p
                      key={text}
                      className="text-sm font-medium leading-snug text-dark"
                    >
                      {text}
                    </p>
                  ))}
                </div>
              )}
            </div>

            {socials.length > 0 && (
              <div className="relative z-50 mt-5 flex justify-center gap-3">
                {socials.map((social) => (
                  <a
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="social-link flex h-10 w-10 items-center justify-center rounded-md border-2 border-dark bg-accent-yellow text-dark shadow-[3px_3px_0_var(--neo-ink)] transition-all duration-300 hover:-translate-x-0.5 hover:-translate-y-0.5 hover:bg-accent-coral"
                    onClick={(event) => event.stopPropagation()}
                    aria-label={social.label}
                  >
                    <span dangerouslySetInnerHTML={{ __html: social.icon }} />
                  </a>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LanyardCard;
