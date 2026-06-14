import { useEffect, useRef } from 'react';
import './FireParticles.css';

export default function FireParticles() {
  const containerRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Create large ambient glow orbs (static, slow-pulsing)
    const createOrb = () => {
      const orb = document.createElement('div');
      orb.classList.add('fire-orb');
      const size = Math.random() * 200 + 120;
      const left = Math.random() * 100;
      const bottom = Math.random() * 40;
      const duration = Math.random() * 8 + 10;
      const delay = Math.random() * 6;
      const hue = Math.random() > 0.5 ? 25 : 10;
      orb.style.cssText = `
        width: ${size}px;
        height: ${size}px;
        left: ${left}%;
        bottom: ${bottom}%;
        background: radial-gradient(circle, hsl(${hue}, 100%, 50%) 0%, transparent 70%);
        animation-duration: ${duration}s;
        animation-delay: -${delay}s;
      `;
      container.appendChild(orb);
    };

    // Create standard fire particles (small, fast)
    const createParticle = () => {
      const particle = document.createElement('div');
      particle.classList.add('fire-particle');

      const size = Math.random() * 5 + 2;
      const left = Math.random() * 100;
      const duration = Math.random() * 4 + 3;
      const delay = Math.random() * 0.5;
      const drift = (Math.random() - 0.5) * 80;
      const hue = Math.random() > 0.5
        ? Math.floor(Math.random() * 30 + 15)   // orange-gold
        : Math.floor(Math.random() * 15);        // red-orange

      particle.style.cssText = `
        width: ${size}px;
        height: ${size}px;
        left: ${left}%;
        bottom: -10px;
        animation-duration: ${duration}s;
        animation-delay: ${delay}s;
        --drift: ${drift}px;
        background: hsl(${hue}, 100%, ${55 + Math.random() * 20}%);
        box-shadow: 0 0 ${size * 2}px hsl(${hue}, 100%, 55%),
                    0 0 ${size * 5}px hsl(${hue}, 100%, 45%);
      `;
      container.appendChild(particle);
      setTimeout(() => {
        if (particle.parentNode) particle.parentNode.removeChild(particle);
      }, (duration + delay + 0.5) * 1000);
    };

    // Create depth particles (large, slow, blurry — background layer)
    const createDepthParticle = () => {
      const particle = document.createElement('div');
      particle.classList.add('fire-particle-depth');

      const size = Math.random() * 20 + 8;
      const left = Math.random() * 100;
      const duration = Math.random() * 8 + 7;
      const delay = Math.random() * 1;
      const hue = Math.random() > 0.6 ? 25 : 12;
      const opacity = Math.random() * 0.18 + 0.04;

      particle.style.cssText = `
        width: ${size}px;
        height: ${size}px;
        left: ${left}%;
        bottom: -20px;
        animation-duration: ${duration}s;
        animation-delay: ${delay}s;
        background: hsl(${hue}, 100%, 50%);
        box-shadow: 0 0 ${size * 3}px hsl(${hue}, 100%, 50%);
        opacity: ${opacity};
      `;
      container.appendChild(particle);
      setTimeout(() => {
        if (particle.parentNode) particle.parentNode.removeChild(particle);
      }, (duration + delay + 1) * 1000);
    };

    // Spawn initial orbs
    for (let i = 0; i < 5; i++) createOrb();

    // Initial particle burst
    for (let i = 0; i < 20; i++) {
      setTimeout(createParticle, i * 150);
    }
    for (let i = 0; i < 8; i++) {
      setTimeout(createDepthParticle, i * 400);
    }

    // Continuous spawning
    const particleInterval = setInterval(createParticle, 280);
    const depthInterval = setInterval(createDepthParticle, 700);

    return () => {
      clearInterval(particleInterval);
      clearInterval(depthInterval);
      if (container) container.innerHTML = '';
    };
  }, []);

  return <div className="fire-particles-container" ref={containerRef} aria-hidden="true" />;
}
