import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import './FireParticles.css';

const PARTICLE_COUNT = 60;  // target active particle pool
const ORB_COUNT = 4;

function randomBetween(min, max) {
  return min + Math.random() * (max - min);
}

export default function FireParticles() {
  const canvasRef = useRef(null);
  const location = useLocation();
  const stateRef = useRef({
    particles: [],
    orbs: [],
    raf: null,
    paused: false,
    fadeAlpha: 1,
  });

  // Detect if we're in active gameplay to reduce rendering
  const isPlaying = location.pathname.startsWith('/play/');

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const state = stateRef.current;

    // Resize canvas to fill viewport
    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(document.documentElement);

    // ── Orb data ──
    const initOrbs = () => {
      state.orbs = Array.from({ length: ORB_COUNT }, () => ({
        x: randomBetween(0.05, 0.95),   // normalized 0-1
        y: randomBetween(0.5, 1.0),
        radius: randomBetween(80, 200),
        hue: Math.random() > 0.5 ? 25 : 10,
        phase: Math.random() * Math.PI * 2,
        speed: randomBetween(0.3, 0.6),
      }));
    };
    initOrbs();

    // ── Particle factory ──
    const spawnParticle = () => ({
      x: randomBetween(0, canvas.width),
      y: canvas.height + 10,
      size: randomBetween(2, 7),
      hue: Math.random() > 0.5
        ? randomBetween(15, 45)   // orange-gold
        : randomBetween(0, 15),   // red-orange
      drift: randomBetween(-60, 60),
      speed: randomBetween(60, 180),      // px/s
      life: 0,
      duration: randomBetween(3, 7),      // seconds
      opacity: 0,
    });

    // Pre-fill particle pool
    state.particles = Array.from({ length: PARTICLE_COUNT }, () => {
      const p = spawnParticle();
      // Stagger initial positions
      p.life = randomBetween(0, p.duration);
      p.y = canvas.height - (p.life / p.duration) * canvas.height * 1.1;
      return p;
    });

    let lastTime = performance.now();

    const draw = (now) => {
      state.raf = requestAnimationFrame(draw);
      const dt = Math.min((now - lastTime) / 1000, 0.05); // cap at 50ms
      lastTime = now;

      // Clear
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // ── Draw orbs ──
      const t = now / 1000;
      for (const orb of state.orbs) {
        const cy = orb.y * canvas.height + Math.sin(t * orb.speed + orb.phase) * 30;
        const alpha = 0.06 + 0.06 * Math.sin(t * orb.speed + orb.phase);

        const grd = ctx.createRadialGradient(
          orb.x * canvas.width, cy, 0,
          orb.x * canvas.width, cy, orb.radius,
        );
        grd.addColorStop(0, `hsla(${orb.hue}, 100%, 50%, ${alpha})`);
        grd.addColorStop(1, 'transparent');

        ctx.fillStyle = grd;
        ctx.beginPath();
        ctx.arc(orb.x * canvas.width, cy, orb.radius, 0, Math.PI * 2);
        ctx.fill();
      }

      // When playing, skip new particle spawning (don't render particles at all during gameplay)
      if (state.paused) return;

      // ── Update & draw particles ──
      for (let i = 0; i < state.particles.length; i++) {
        const p = state.particles[i];
        p.life += dt;

        if (p.life >= p.duration) {
          // Respawn
          state.particles[i] = spawnParticle();
          continue;
        }

        const progress = p.life / p.duration;

        // Ease-in/out opacity: fade in quickly, sustain, fade out at end
        if (progress < 0.1) {
          p.opacity = progress / 0.1;
        } else if (progress > 0.75) {
          p.opacity = 1 - (progress - 0.75) / 0.25;
        } else {
          p.opacity = 1;
        }

        // Move upward with horizontal drift
        p.y -= p.speed * dt;
        p.x += (p.drift / p.duration) * dt;

        const size = p.size * (1 - progress * 0.8); // shrink slightly as it rises

        // Draw glow using simple radial gradient (no expensive CSS box-shadow)
        const grd = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, size * 3);
        grd.addColorStop(0, `hsla(${p.hue}, 100%, 65%, ${p.opacity * 0.95})`);
        grd.addColorStop(0.5, `hsla(${p.hue}, 100%, 50%, ${p.opacity * 0.4})`);
        grd.addColorStop(1, 'transparent');

        ctx.fillStyle = grd;
        ctx.beginPath();
        ctx.arc(p.x, p.y, size * 3, 0, Math.PI * 2);
        ctx.fill();
      }
    };

    state.raf = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(state.raf);
      resizeObserver.disconnect();
    };
  }, []); // canvas setup — runs once on mount

  // Pause particles when playing to free GPU compositing budget
  useEffect(() => {
    stateRef.current.paused = isPlaying;
  }, [isPlaying]);

  return (
    <canvas
      ref={canvasRef}
      className="fire-particles-canvas"
      aria-hidden="true"
    />
  );
}
