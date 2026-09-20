import { useEffect, useRef } from "react";

const MouseGrid = () => {
  const canvasRef = useRef(null);

  const pointerRef = useRef({
    x: 0,
    y: 0,
    targetX: 0,
    targetY: 0,
    velocityX: 0,
    velocityY: 0,
    active: false,
  });

  const trailRef = useRef([]);

  useEffect(() => {
    const canvas = canvasRef.current;

    if (!canvas) return;

    const ctx = canvas.getContext("2d");

    if (!ctx) return;

    let animationFrame;
    let width = 0;
    let height = 0;
    let dpr = 1;
    let time = 0;

    const pointer = pointerRef.current;

    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    const isTouch =
      window.matchMedia("(pointer: coarse)").matches ||
      "ontouchstart" in window;

    const lerp = (a, b, amount) =>
      a + (b - a) * amount;

    /* -------------------------------------------------------
       Resize
    ------------------------------------------------------- */

    const resize = () => {
      width = window.innerWidth;
      height = window.innerHeight;

      dpr = Math.min(window.devicePixelRatio || 1, 2);

      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);

      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;

      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    resize();

    window.addEventListener("resize", resize);

    /* -------------------------------------------------------
       Mouse
    ------------------------------------------------------- */

    const handlePointerMove = (event) => {
      if (isTouch) return;

      const x = event.clientX;
      const y = event.clientY;

      const dx = x - pointer.targetX;
      const dy = y - pointer.targetY;

      pointer.velocityX = lerp(
        pointer.velocityX,
        dx,
        0.45
      );

      pointer.velocityY = lerp(
        pointer.velocityY,
        dy,
        0.45
      );

      pointer.targetX = x;
      pointer.targetY = y;
      pointer.active = true;

      trailRef.current.push({
        x,
        y,
        life: 1,
        size:
          1.2 +
          Math.min(Math.hypot(dx, dy), 20) *
            0.035,
      });

      if (trailRef.current.length > 14) {
        trailRef.current.shift();
      }
    };

    const handlePointerLeave = () => {
      pointer.active = false;
    };

    window.addEventListener(
      "pointermove",
      handlePointerMove
    );

    window.addEventListener(
      "pointerout",
      (event) => {
        if (!event.relatedTarget) {
          handlePointerLeave();
        }
      }
    );

    /* -------------------------------------------------------
       Draw
    ------------------------------------------------------- */

    const draw = () => {
      ctx.clearRect(0, 0, width, height);

      const mobile = width < 768;

      time += reducedMotion ? 0.0003 : 0.001;

      /* Smooth mouse */
      const centerX = width / 2;
      const centerY = height / 2;

      pointer.x = lerp(
        pointer.x,
        pointer.active
          ? pointer.targetX
          : centerX,
        pointer.active ? 0.18 : 0.035
      );

      pointer.y = lerp(
        pointer.y,
        pointer.active
          ? pointer.targetY
          : centerY,
        pointer.active ? 0.18 : 0.035
      );

      pointer.velocityX *= 0.88;
      pointer.velocityY *= 0.88;

      /* -----------------------------------------------------
         Grid configuration
      ----------------------------------------------------- */

      const spacing = mobile ? 85 : 105;

      const columns =
        Math.ceil(width / spacing) + 2;

      const rows =
        Math.ceil(height / spacing) + 2;

      const offsetX =
        (width - (columns - 1) * spacing) / 2;

      const offsetY =
        (height - (rows - 1) * spacing) / 2;

      const waveRadius = mobile ? 0 : 280;
      const waveStrength = mobile ? 0 : 34;

      ctx.lineWidth = 0.7;
      ctx.strokeStyle =
        "rgba(255,255,255,0.065)";

      /* -----------------------------------------------------
         Vertical lines
      ----------------------------------------------------- */

      for (
        let column = -1;
        column < columns;
        column++
      ) {
        const baseX =
          offsetX + column * spacing;

        ctx.beginPath();

        for (
          let y = -20;
          y <= height + 20;
          y += 7
        ) {
          let drawX = baseX;

          if (!mobile && pointer.active) {
            const dx = baseX - pointer.x;
            const dy = y - pointer.y;

            const distance = Math.sqrt(
              dx * dx + dy * dy
            );

            if (distance < waveRadius) {
              const influence =
                1 - distance / waveRadius;

              const wave =
                Math.sin(
                  distance * 0.075 -
                    time * 5
                ) *
                influence *
                influence *
                waveStrength;

              const direction =
                pointer.velocityX *
                influence *
                0.9;

              drawX += wave + direction;
            }
          }

          if (y === -20) {
            ctx.moveTo(drawX, y);
          } else {
            ctx.lineTo(drawX, y);
          }
        }

        ctx.stroke();
      }

      /* -----------------------------------------------------
         Horizontal lines
      ----------------------------------------------------- */

      for (
        let row = -1;
        row < rows;
        row++
      ) {
        const baseY =
          offsetY + row * spacing;

        ctx.beginPath();

        for (
          let x = -20;
          x <= width + 20;
          x += 7
        ) {
          let drawY = baseY;

          if (!mobile && pointer.active) {
            const dx = x - pointer.x;
            const dy = baseY - pointer.y;

            const distance = Math.sqrt(
              dx * dx + dy * dy
            );

            if (distance < waveRadius) {
              const influence =
                1 - distance / waveRadius;

              const wave =
                Math.sin(
                  distance * 0.075 -
                    time * 5
                ) *
                influence *
                influence *
                waveStrength;

              const direction =
                pointer.velocityY *
                influence *
                0.9;

              drawY += wave + direction;
            }
          }

          if (x === -20) {
            ctx.moveTo(x, drawY);
          } else {
            ctx.lineTo(x, drawY);
          }
        }

        ctx.stroke();
      }

      /* -----------------------------------------------------
         Subtle cursor glow
      ----------------------------------------------------- */

      if (!mobile && pointer.active) {
        const glowRadius = 90;

        const glow =
          ctx.createRadialGradient(
            pointer.x,
            pointer.y,
            0,
            pointer.x,
            pointer.y,
            glowRadius
          );

        glow.addColorStop(
          0,
          "rgba(255,255,255,0.06)"
        );

        glow.addColorStop(
          0.35,
          "rgba(200,210,255,0.02)"
        );

        glow.addColorStop(
          1,
          "rgba(0,0,0,0)"
        );

        ctx.fillStyle = glow;

        ctx.beginPath();

        ctx.arc(
          pointer.x,
          pointer.y,
          glowRadius,
          0,
          Math.PI * 2
        );

        ctx.fill();
      }

      /* -----------------------------------------------------
         Small comet
      ----------------------------------------------------- */

      if (
        !mobile &&
        trailRef.current.length > 1
      ) {
        const trail = trailRef.current;

        for (
          let i = 0;
          i < trail.length;
          i++
        ) {
          const particle = trail[i];

          particle.life *= 0.88;

          const progress =
            i / trail.length;

          const alpha =
            particle.life *
            progress *
            0.18;

          if (alpha < 0.002) continue;

          ctx.fillStyle = `rgba(225,230,255,${alpha})`;

          ctx.beginPath();

          ctx.arc(
            particle.x,
            particle.y,
            particle.size *
              (0.5 + progress * 0.65),
            0,
            Math.PI * 2
          );

          ctx.fill();
        }

        const lead =
          trail[trail.length - 1];

        if (lead) {
          const leadGlow =
            ctx.createRadialGradient(
              lead.x,
              lead.y,
              0,
              lead.x,
              lead.y,
              12
            );

          leadGlow.addColorStop(
            0,
            "rgba(255,255,255,0.13)"
          );

          leadGlow.addColorStop(
            0.3,
            "rgba(210,220,255,0.05)"
          );

          leadGlow.addColorStop(
            1,
            "rgba(0,0,0,0)"
          );

          ctx.fillStyle = leadGlow;

          ctx.beginPath();

          ctx.arc(
            lead.x,
            lead.y,
            12,
            0,
            Math.PI * 2
          );

          ctx.fill();
        }
      }

      animationFrame =
        requestAnimationFrame(draw);
    };

    draw();

    return () => {
      cancelAnimationFrame(animationFrame);

      window.removeEventListener(
        "resize",
        resize
      );

      window.removeEventListener(
        "pointermove",
        handlePointerMove
      );
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-0 h-full w-full opacity-70"
    />
  );
};

export default MouseGrid;