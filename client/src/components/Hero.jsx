import { useEffect, useRef, useState } from "react";
import { motion } from "motion/react";

const Hero = ({
  originalUrl,
  setOriginalUrl,
  shortenUrl,
  loading,
}) => {
  const canvasRef = useRef(null);
  const heroRef = useRef(null);

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

  const [firstText, setFirstText] = useState("");
  const [secondText, setSecondText] = useState("");

  const firstLine = "Paste a URL.";
  const secondLine = "Get a link worth sharing.";

  /* ---------------------------------------------------------
     Typing animation
  --------------------------------------------------------- */

  useEffect(() => {
    let firstIndex = 0;
    let secondIndex = 0;
    let secondTimer;

    const firstTimer = setInterval(() => {
      firstIndex++;

      setFirstText(firstLine.slice(0, firstIndex));

      if (firstIndex >= firstLine.length) {
        clearInterval(firstTimer);

        secondTimer = setInterval(() => {
          secondIndex++;

          setSecondText(secondLine.slice(0, secondIndex));

          if (secondIndex >= secondLine.length) {
            clearInterval(secondTimer);
          }
        }, 55);
      }
    }, 70);

    return () => {
      clearInterval(firstTimer);
      clearInterval(secondTimer);
    };
  }, []);

  /* ---------------------------------------------------------
     Interactive Grid
  --------------------------------------------------------- */

  useEffect(() => {
    const canvas = canvasRef.current;
    const hero = heroRef.current;

    if (!canvas || !hero) return;

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
      const rect = hero.getBoundingClientRect();

      width = rect.width;
      height = rect.height;

      dpr = Math.min(window.devicePixelRatio || 1, 2);

      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);

      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;

      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    resize();

    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(hero);

    /* -------------------------------------------------------
       Mouse
    ------------------------------------------------------- */

    const handlePointerMove = (event) => {
      if (isTouch) return;

      const rect = hero.getBoundingClientRect();

      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;

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

      /* Small comet */
      trailRef.current.push({
        x,
        y,
        life: 1,
        size: 1.4 + Math.min(Math.hypot(dx, dy), 20) * 0.04,
      });

      if (trailRef.current.length > 14) {
        trailRef.current.shift();
      }
    };

    const handlePointerLeave = () => {
      pointer.active = false;
    };

    hero.addEventListener(
      "pointermove",
      handlePointerMove
    );

    hero.addEventListener(
      "pointerleave",
      handlePointerLeave
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
        pointer.active ? pointer.targetX : centerX,
        pointer.active ? 0.18 : 0.04
      );

      pointer.y = lerp(
        pointer.y,
        pointer.active ? pointer.targetY : centerY,
        pointer.active ? 0.18 : 0.04
      );

      pointer.velocityX *= 0.88;
      pointer.velocityY *= 0.88;

      /* -----------------------------------------------------
         Grid
      ----------------------------------------------------- */

      const spacing = mobile ? 85 : 105;

      const columns = Math.ceil(width / spacing) + 2;
      const rows = Math.ceil(height / spacing) + 2;

      const offsetX =
        (width - (columns - 1) * spacing) / 2;

      const offsetY =
        (height - (rows - 1) * spacing) / 2;

      const waveRadius = mobile ? 0 : 280;
      const waveStrength = mobile ? 0 : 34;

      ctx.lineWidth = 0.7;
      ctx.strokeStyle = "rgba(255,255,255,0.07)";

      /* -----------------------------------------------------
         Vertical grid lines
      ----------------------------------------------------- */

      for (let column = -1; column < columns; column++) {
        const baseX = offsetX + column * spacing;

        ctx.beginPath();

        for (let y = -20; y <= height + 20; y += 7) {
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

              /*
                 Stronger deformation near cursor.
                 Mouse movement direction controls
                 the direction of the distortion.
              */

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
         Horizontal grid lines
      ----------------------------------------------------- */

      for (let row = -1; row < rows; row++) {
        const baseY = offsetY + row * spacing;

        ctx.beginPath();

        for (let x = -20; x <= width + 20; x += 7) {
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
         Very subtle mouse glow
      ----------------------------------------------------- */

      if (!mobile && pointer.active) {
        const glowRadius = 90;

        const glow = ctx.createRadialGradient(
          pointer.x,
          pointer.y,
          0,
          pointer.x,
          pointer.y,
          glowRadius
        );

        glow.addColorStop(
          0,
          "rgba(255,255,255,0.07)"
        );

        glow.addColorStop(
          0.35,
          "rgba(200,210,255,0.025)"
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
         Small comet trail
      ----------------------------------------------------- */

      if (!mobile && trailRef.current.length > 1) {
        const trail = trailRef.current;

        for (let i = 0; i < trail.length; i++) {
          const particle = trail[i];

          particle.life *= 0.88;

          const progress = i / trail.length;

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
            "rgba(255,255,255,0.14)"
          );

          leadGlow.addColorStop(
            0.3,
            "rgba(210,220,255,0.06)"
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

      resizeObserver.disconnect();

      hero.removeEventListener(
        "pointermove",
        handlePointerMove
      );

      hero.removeEventListener(
        "pointerleave",
        handlePointerLeave
      );
    };
  }, []);

  return (
    <section
      ref={heroRef}
      className="relative w-full overflow-hidden border-b border-white/6"
    >
      {/* Clean background */}
      <div className="pointer-events-none absolute inset-0 bg-[#050505]" />

      {/* Interactive grid */}
      <canvas
        ref={canvasRef}
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 h-full w-full"
      />

      {/* Very subtle atmosphere */}
      <div
        className="pointer-events-none absolute inset-0 opacity-20"
        style={{
          background:
            "radial-gradient(circle at 50% 45%, rgba(255,255,255,0.018), transparent 50%)",
        }}
      />

      {/* Hero content */}
      <div className="relative z-10 w-full px-6 pb-20 pt-20 md:px-10 md:pb-24 md:pt-24 lg:px-12 lg:pb-28 lg:pt-24">
        <div className="max-w-xl lg:max-w-[540px]">
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4 }}
            className="mb-5 text-xs font-medium uppercase tracking-[0.16em] text-zinc-600"
          >
            URL Shortener
          </motion.p>

          <h1 className="text-4xl font-medium leading-[1.05] tracking-[-0.035em] text-zinc-100 md:text-6xl">
            <span>{firstText}</span>

            <span className="text-zinc-600">
              {firstText.length < firstLine.length
                ? "|"
                : ""}
            </span>

            <br />

            <span className="text-zinc-500">
              {secondText}
            </span>

            <span className="text-zinc-600">
              {firstText.length === firstLine.length &&
              secondText.length < secondLine.length
                ? "|"
                : ""}
            </span>
          </h1>

          <motion.p
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.45,
              delay: 1,
            }}
            className="mt-6 max-w-xl text-[15px] leading-7 text-zinc-500"
          >
            Create short, memorable links and keep track
            of every click. No clutter, no unnecessary
            setup.
          </motion.p>
        </div>

        {/* Shorten form */}
        <motion.form
          onSubmit={shortenUrl}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: 0.45,
            delay: 1.1,
          }}
          className="relative mt-12 w-full max-w-5xl"
        >
          <div className="flex flex-col overflow-hidden rounded-xl border border-white/9 bg-[#101012]/95 transition-colors duration-200 focus-within:border-white/18 md:flex-row">
            <input
              type="url"
              value={originalUrl}
              onChange={(e) =>
                setOriginalUrl(e.target.value)
              }
              placeholder="https://example.com/your-long-url"
              className="h-16 min-w-0 flex-1 bg-transparent px-5 text-[15px] text-zinc-100 outline-none placeholder:text-zinc-700"
            />

            <div className="p-2">
              <motion.button
                type="submit"
                disabled={loading}
                whileHover={{ y: -1 }}
                whileTap={{ scale: 0.98 }}
                className="h-12 w-full rounded-lg bg-zinc-100 px-7 text-sm font-medium text-zinc-950 transition-colors hover:bg-white disabled:cursor-not-allowed disabled:opacity-50 md:w-auto"
              >
                {loading ? "Creating..." : "Shorten"}
              </motion.button>
            </div>
          </div>
        </motion.form>

        {/* Small visual cue */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{
            duration: 0.8,
            delay: 1.8,
          }}
          className="mt-14 flex items-center gap-3 text-[10px] uppercase tracking-[0.18em] text-zinc-700"
        >
          <span className="h-px w-8 bg-zinc-800" />
          <span>Move your cursor</span>
        </motion.div>
      </div>

      {/* Bottom fade */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-[#050505] to-transparent" />
    </section>
  );
};

export default Hero;