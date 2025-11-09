import React, { useRef, useEffect } from "react";

const GalaxyBackground = () => {
    const canvasRef = useRef(null);

    const STAR_COUNT = 180;

    useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");

    // Taille du canvas = taille de la fenêtre
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    // Fond bleu-noir spatial
    context.fillStyle = "#01030a";
    context.fillRect(0, 0, canvas.width, canvas.height);

    // Etoiles
    const stars = [];

    for (let i = 0; i <STAR_COUNT; i++){
        const x = Math.random() * canvas.width;
        const y = Math.random() * canvas.height;

        const colors = ["#ffffff", "#cbd5e1", "#a5f3fc"];
        const color = colors[Math.floor(Math.random() * colors.length)];

        const radius = Math.random() * 1.5 + 0.5;

        let tooClose = false;
        for (let s of stars){
            const dx = s.x -x;
            const dy = s.y -y;
            if (Math.sqrt(dx * dx + dy * dy) < 8){
                tooClose = true;
                break;
            }
        }

        if (!tooClose) stars.push({x, y, radius, color});
    }

    stars.forEach(star => {
        context.beginPath();
        context.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
        context.fillStyle = star.color;
        context.fill();
    })

    }, []);

    return (
    <canvas ref={canvasRef} className="fixed inset-0 -z-[1]"/>
    );
};

export default GalaxyBackground;
