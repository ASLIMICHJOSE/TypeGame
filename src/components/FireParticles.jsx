import { useEffect, useRef } from 'react';
import './FireParticles.css';

export default function FireParticles() {
  const containerRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const createParticle = () => {
      const particle = document.createElement('div');
      particle.classList.add('fire-particle');

      // Randomize position, size, and animation
      const size = Math.random() * 6 + 2;
      const left = Math.random() * 100;
      const duration = Math.random() * 4 + 3;
      const delay = Math.random() * 2;
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
        background: hsl(${hue}, 100%, ${50 + Math.random() * 20}%);
        box-shadow: 0 0 ${size * 2}px hsl(${hue}, 100%, 50%),
                    0 0 ${size * 4}px hsl(${hue}, 100%, 40%);
      `;

      container.appendChild(particle);

      // Remove particle after animation
      setTimeout(() => {
        if (particle.parentNode) {
          particle.parentNode.removeChild(particle);
        }
      }, (duration + delay) * 1000);
    };

    // Create initial batch
    for (let i = 0; i < 15; i++) {
      setTimeout(createParticle, i * 200);
    }

    // Continuously spawn particles
    const interval = setInterval(createParticle, 300);

    return () => {
      clearInterval(interval);
      if (container) container.innerHTML = '';
    };
  }, []);

  return <div className="fire-particles-container" ref={containerRef} aria-hidden="true" />;
}
