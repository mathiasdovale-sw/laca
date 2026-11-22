"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

import { navigation } from "@/lib/site";

import { Container } from "./Container";
import { Logo } from "./Logo";

/**
 * Header fijo arriba en todas las páginas.
 *
 * No tiene un fondo sólido ni un borde: es un degradé que va de arriba hacia
 * abajo hasta quedar transparente, así se funde con lo que pasa por debajo.
 * Sobre secciones oscuras (las marcadas con `data-header-dark`: el carrusel y
 * el bloque de contacto) el degradé es negro y el texto blanco; sobre el resto,
 * el degradé es blanco y el texto negro. Al hacer scroll se achica un poco.
 *
 * En pantallas chicas los links se muestran con el botón hamburguesa: las dos
 * líneas se cruzan en una X, el panel aparece con un fundido y los links
 * suben uno detrás del otro.
 */
export function Header() {
  const pathname = usePathname();
  const fixed = pathname === "/";
  const [open, setOpen] = useState(false);
  const { scrolled, overDark } = useHeaderState(pathname);

  const dark = overDark && !open;

  // Cerrar con Escape y bloquear el scroll de fondo mientras está abierto.
  useEffect(() => {
    if (!open) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKeyDown);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <header
      className={`${fixed ? "fixed" : "sticky"} inset-x-0 top-0 z-40 transition-colors duration-500 ${
        dark ? "text-white" : "text-foreground"
      }`}
    >
      {/* Degradés de fondo: se cruzan con un fundido (un background-image no
          se puede animar). Ocupan exactamente la altura de la barra: arriba
          son más opacos y en el borde inferior ya son transparentes. */}
      <div
        aria-hidden="true"
        className={`pointer-events-none absolute inset-0 -z-10 bg-[linear-gradient(to_bottom,rgb(0_0_0/0.55),transparent)] transition-opacity duration-500 ${
          dark ? "opacity-100" : "opacity-0"
        }`}
      />
      <div
        aria-hidden="true"
        className={`pointer-events-none absolute inset-0 -z-10 bg-[linear-gradient(to_bottom,rgb(255_255_255/0.85),rgb(255_255_255/0.55)_50%,transparent)] transition-opacity duration-500 ${
          dark || open ? "opacity-0" : "opacity-100"
        }`}
      />

      <Container
        className={`relative z-50 flex items-center justify-between transition-[padding] duration-300 ${
          scrolled ? "py-4" : "py-5"
        }`}
      >
        <Logo className="text-2xl" />

        <nav aria-label="Principal" className="hidden md:block">
          <ul className="flex gap-6 text-[0.9375rem]">
            {navigation.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  aria-current={pathname === item.href ? "page" : undefined}
                  className="hover:underline hover:underline-offset-4"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <button
          type="button"
          className="-mr-2 flex size-10 items-center justify-center md:hidden"
          aria-expanded={open}
          aria-controls="mobile-menu"
          aria-label={open ? "Cerrar menú" : "Abrir menú"}
          onClick={() => setOpen((current) => !current)}
        >
          <span aria-hidden="true" className="relative block h-[13px] w-6">
            <span
              className={`absolute top-0 left-0 h-[1.5px] w-full bg-current transition-transform duration-300 ease-out motion-reduce:transition-none ${
                open ? "translate-y-[5.75px] rotate-45" : ""
              }`}
            />
            <span
              className={`absolute bottom-0 left-0 h-[1.5px] w-full bg-current transition-transform duration-300 ease-out motion-reduce:transition-none ${
                open ? "-translate-y-[5.75px] -rotate-45" : ""
              }`}
            />
          </span>
        </button>
      </Container>

      <nav
        id="mobile-menu"
        aria-label="Principal"
        inert={!open}
        className={`fixed inset-0 z-40 bg-background pt-24 text-foreground transition-[opacity,visibility] duration-300 motion-reduce:transition-none md:hidden ${
          open ? "visible opacity-100" : "invisible opacity-0"
        }`}
      >
        <Container>
          <ul className="mt-6 space-y-3 border-t border-border pt-8 text-4xl tracking-tight">
            {navigation.map((item, i) => (
              <li
                key={item.href}
                style={{ transitionDelay: open ? `${120 + i * 70}ms` : "0ms" }}
                className={`transition duration-500 ease-out motion-reduce:transition-none ${
                  open ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
                }`}
              >
                <Link
                  href={item.href}
                  aria-current={pathname === item.href ? "page" : undefined}
                  onClick={() => setOpen(false)}
                  className="block py-1 aria-[current=page]:text-muted"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </Container>
      </nav>
    </header>
  );
}

/** Altura (px) a la que se mira qué sección pasa por debajo del header. */
const PROBE_Y = 36;

/**
 * `scrolled`: la página se desplazó unos píxeles.
 * `overDark`: el header está encima de una sección marcada con
 * `data-header-dark` (el carrusel del inicio o el bloque negro de contacto).
 * En el inicio arranca en `true` para que el primer render ya sea el correcto.
 */
function useHeaderState(pathname: string) {
  const [state, setState] = useState({
    scrolled: false,
    overDark: pathname === "/",
  });

  useEffect(() => {
    let frame = 0;
    const update = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const overDark = Array.from(
          document.querySelectorAll("[data-header-dark]"),
        ).some((element) => {
          const rect = element.getBoundingClientRect();
          return rect.top <= PROBE_Y && rect.bottom >= PROBE_Y;
        });
        const scrolled = window.scrollY > 8;
        setState((current) =>
          current.overDark === overDark && current.scrolled === scrolled
            ? current
            : { overDark, scrolled },
        );
      });
    };
    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, [pathname]);

  return state;
}
