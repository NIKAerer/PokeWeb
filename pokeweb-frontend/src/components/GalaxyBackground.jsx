import React, { useRef, useEffect } from "react";

const GalaxyBackground = () => {

  const STAR_COUNT = 250; // nombre d’étoiles
  const STAR_COLORS = ["#ffffff", "#cbd5e1", "#a5f3fc"]; // teintes subtiles
  const BACKGROUND_COLOR = "#01030a"; // bleu-noir spatial
  const STAR_SPEED = 0.05; // intensité du drift (vitesse globale)
  const STAR_MIN_RADIUS = 0.5; // taille min d’une étoile
  const STAR_MAX_RADIUS = 2.1; // taille max d’une étoile
  const MIN_OPACITY = 0.3; // opacité minimale pour le scintillement

  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");

    // Taille initiale
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    // === 🪐 GÉNÉRATION DES ÉTOILES ===
    const stars = [];
    for (let i = 0; i < STAR_COUNT; i++) {
      const x = Math.random() * canvas.width;
      const y = Math.random() * canvas.height;
      const color = STAR_COLORS[Math.floor(Math.random() * STAR_COLORS.length)];
      const radius = Math.random() * (STAR_MAX_RADIUS - STAR_MIN_RADIUS) + STAR_MIN_RADIUS;
      const vx = (Math.random() - 0.5) * STAR_SPEED; // drift horizontal
      const vy = (Math.random() - 0.5) * STAR_SPEED; // drift vertical

      stars.push({
        x,
        y,
        radius,
        color,
        opacity: Math.random(),
        change: (Math.random() * 0.02) - 0.01, // variation d’opacité
        vx,
        vy,
      });
    }

    let animationId;

    const draw = () => {
      // fond spatial
      context.fillStyle = BACKGROUND_COLOR;
      context.fillRect(0, 0, canvas.width, canvas.height);

      // pour chaque étoile
      for (let star of stars) {
        // Déplacement (drift)
        star.x += star.vx;
        star.y += star.vy;

        // rebouclage sur les bords de l’écran
        if (star.x < 0) star.x = canvas.width;
        if (star.x > canvas.width) star.x = 0;
        if (star.y < 0) star.y = canvas.height;
        if (star.y > canvas.height) star.y = 0;

        // Scintillement
        star.opacity += star.change;
        if (star.opacity <= MIN_OPACITY || star.opacity >= 1) star.change *= -1;

        // Dessin de l’étoile
        context.globalAlpha = star.opacity;
        context.beginPath();
        context.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
        context.fillStyle = star.color;
        context.fill();
      }

      // Réinitialiser la transparence
      context.globalAlpha = 1;

      // Boucle infinie fluide
      animationId = requestAnimationFrame(draw);
    };

    draw();

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animationId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 -z-[1]"
    />
  );
};

export default GalaxyBackground;
