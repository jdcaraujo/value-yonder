"use client";

import { useEffect, useRef } from "react";

interface Star {
  x: number;
  y: number;
  radius: number;
  opacity: number;
  twinkleSpeed: number;
  twinkleOffset: number;
}

interface Meteor {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  length: number;
  opacity: number;
}

export function SpaceBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationId: number;
    let stars: Star[] = [];
    let meteors: Meteor[] = [];
    let nextMeteorAt = 0;

    function resize() {
      if (!canvas) return;
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      initStars();
    }

    function initStars() {
      if (!canvas) return;
      const count = Math.floor((canvas.width * canvas.height) / 5000);
      stars = Array.from({ length: count }, () => ({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        radius: Math.random() * 1.1 + 0.2,
        opacity: Math.random() * 0.65 + 0.1,
        twinkleSpeed: Math.random() * 0.012 + 0.003,
        twinkleOffset: Math.random() * Math.PI * 2,
      }));
    }

    function spawnMeteor() {
      if (!canvas) return;
      // Start from top-right quadrant, fly toward bottom-left
      const startX = canvas.width * (0.4 + Math.random() * 0.7);
      const startY = canvas.height * (Math.random() * 0.4);
      const angle = Math.PI * (0.6 + Math.random() * 0.2); // roughly 108–144 deg
      const speed = 6 + Math.random() * 6;
      meteors.push({
        x: startX,
        y: startY,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        life: 0,
        maxLife: 50 + Math.random() * 40,
        length: 80 + Math.random() * 120,
        opacity: 0.6 + Math.random() * 0.4,
      });
    }

    function draw(t: number) {
      if (!canvas || !ctx) return;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Deep space background
      const bg = ctx.createLinearGradient(0, 0, 0, canvas.height);
      bg.addColorStop(0, "#07080e");
      bg.addColorStop(0.5, "#0a0b14");
      bg.addColorStop(1, "#070810");
      ctx.fillStyle = bg;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Cyan top-right bloom
      const bloom = ctx.createRadialGradient(
        canvas.width * 0.82, canvas.height * 0.04, 0,
        canvas.width * 0.82, canvas.height * 0.04, canvas.width * 0.45
      );
      bloom.addColorStop(0, "rgba(6,182,212,0.08)");
      bloom.addColorStop(1, "rgba(6,182,212,0)");
      ctx.fillStyle = bloom;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Stars
      for (const star of stars) {
        const twinkle = Math.sin(t * star.twinkleSpeed + star.twinkleOffset);
        const opacity = star.opacity * (0.7 + 0.3 * twinkle);
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255,255,255,${opacity})`;
        ctx.fill();
      }

      // Spawn meteors on a schedule with randomness
      if (t > nextMeteorAt) {
        spawnMeteor();
        nextMeteorAt = t + 1200 + Math.random() * 1800; // every ~20–50s at 60fps
      }

      // Draw & update meteors
      meteors = meteors.filter((m) => m.life < m.maxLife);
      for (const m of meteors) {
        const progress = m.life / m.maxLife;
        // Fade in quickly, then fade out
        const fade = progress < 0.15
          ? progress / 0.15
          : 1 - (progress - 0.15) / 0.85;
        const alpha = m.opacity * fade;

        const tailX = m.x - (m.vx / Math.hypot(m.vx, m.vy)) * m.length;
        const tailY = m.y - (m.vy / Math.hypot(m.vx, m.vy)) * m.length;

        const grad = ctx.createLinearGradient(tailX, tailY, m.x, m.y);
        grad.addColorStop(0, `rgba(255,255,255,0)`);
        grad.addColorStop(0.6, `rgba(200,240,255,${alpha * 0.4})`);
        grad.addColorStop(1, `rgba(255,255,255,${alpha})`);

        ctx.beginPath();
        ctx.moveTo(tailX, tailY);
        ctx.lineTo(m.x, m.y);
        ctx.strokeStyle = grad;
        ctx.lineWidth = 1.5;
        ctx.lineCap = "round";
        ctx.stroke();

        // Bright head dot
        ctx.beginPath();
        ctx.arc(m.x, m.y, 1.5, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255,255,255,${alpha})`;
        ctx.fill();

        m.x += m.vx;
        m.y += m.vy;
        m.life++;
      }

      animationId = requestAnimationFrame(draw);
    }

    resize();
    window.addEventListener("resize", resize);
    animationId = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 -z-10 pointer-events-none"
      aria-hidden="true"
    />
  );
}
