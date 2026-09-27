"use client";

import Link from "next/link";
import { useEffect, useRef, useState, useSyncExternalStore } from "react";

import type { ProjectCardData } from "./ProjectCard";
import { SanityImage } from "./SanityImage";
import { Label, PillLink } from "./ui";

const INTERVAL_MS = 5000;

/**
 * Carrusel a pantalla completa del inicio. Avanza cada 5 segundos con un
 * fundido; en celular también se puede deslizar. Se pausa mientras el mouse
 * o el foco del teclado están encima, y no avanza solo si el sistema tiene
 * activada la opción de reducir movimiento.
 */
export function HeroCarousel({ slides }: { slides: ProjectCardData[] }) {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const reducedMotion = usePrefersReducedMotion();
  const touchStartX = useRef<number | null>(null);
  const count = slides.length;

  useEffect(() => {
    if (count < 2 || paused || reducedMotion) return;
    const timeout = setTimeout(
      () => setIndex((current) => (current + 1) % count),
      INTERVAL_MS,
    );
    return () => clearTimeout(timeout);
  }, [index, count, paused, reducedMotion]);

  const go = (step: number) =>
    setIndex((current) => (current + step + count) % count);

  const current = slides[index];

  return (
    <section
      aria-roledescription="carrusel"
      aria-label="Proyectos"
      className="relative h-[85svh] min-h-[28rem] overflow-hidden bg-neutral-800 text-white md:h-svh"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
      onTouchStart={(event) => {
        touchStartX.current = event.touches[0].clientX;
      }}
      onTouchEnd={(event) => {
        if (touchStartX.current === null) return;
        const delta = event.changedTouches[0].clientX - touchStartX.current;
        if (Math.abs(delta) > 50) go(delta < 0 ? 1 : -1);
        touchStartX.current = null;
      }}
    >
      {slides.map((slide, i) => (
        <div
          key={slide._id}
          aria-roledescription="diapositiva"
          aria-label={`${i + 1} de ${count}`}
          aria-hidden={i !== index}
          className={`absolute inset-0 transition-opacity duration-1000 motion-reduce:transition-none ${
            i === index ? "opacity-100" : "opacity-0"
          }`}
        >
          <SanityImage
            image={slide.coverImage}
            fill
            sizes="100vw"
            preload={i === 0}
            className="object-cover"
          />
        </div>
      ))}

      {/* Degradés suaves para que el texto blanco se lea sobre fotos claras. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_bottom,rgb(0_0_0/0.35),transparent_25%,transparent_70%,rgb(0_0_0/0.35))]"
      />

      <div className="absolute inset-x-0 bottom-0 flex flex-wrap items-end justify-between gap-6 px-5 pb-8 md:px-10 md:pb-10">
        {current && (
          <Link
            href={current.slug ? `/proyectos/${current.slug}` : "/proyectos"}
            className="hover:underline hover:underline-offset-4"
          >
            <Label as="span">
              {[current.title, current.location].filter(Boolean).join(" — ")}
            </Label>
          </Link>
        )}

        <div className="flex items-center gap-8">
          {count > 1 && (
            <Label as="span" className="tabular-nums">
              {pad(index + 1)} / {pad(count)}
            </Label>
          )}
          <PillLink href="/proyectos" variant="light">
            Ver proyectos
          </PillLink>
        </div>
      </div>
    </section>
  );
}

const pad = (value: number) => String(value).padStart(2, "0");

function usePrefersReducedMotion() {
  return useSyncExternalStore(
    (onChange) => {
      const query = window.matchMedia("(prefers-reduced-motion: reduce)");
      query.addEventListener("change", onChange);
      return () => query.removeEventListener("change", onChange);
    },
    () => window.matchMedia("(prefers-reduced-motion: reduce)").matches,
    () => false,
  );
}
