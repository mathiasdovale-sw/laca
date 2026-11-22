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
 * En el inicio arranca transparente con texto blanco, encima del carrusel; en
 * cuanto se hace scroll (y en el resto de las páginas siempre) pasa a fondo
 * blanco con texto negro, así se lee sobre cualquier foto o sobre el bloque
 * negro de contacto. Al bajar se achica un poco.
 *
 * En pantallas chicas los links se muestran con el botón hamburguesa: las dos
 * líneas se cruzan en una X, el panel aparece con un fundido y los links
 * suben uno detrás del otro.
 */
export function Header() {
  const pathname = usePathname();
  const overlay = pathname === "/";
  const [open, setOpen] = useState(false);
  const scrolled = useScrolled();

  const solid = !overlay || scrolled || open;

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
      className={`${overlay ? "fixed" : "sticky"} inset-x-0 top-0 z-40 border-b transition-colors duration-300 ${
        solid ? "bg-background text-foreground" : "bg-transparent text-white"
      } ${scrolled && !open ? "border-border" : "border-transparent"}`}
    >
      <Container
        className={`relative z-50 flex items-center justify-between transition-[padding] duration-300 ${
          scrolled ? "py-4" : "py-6"
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

/** `true` en cuanto la página se desplazó unos píxeles hacia abajo. */
function useScrolled() {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const update = () => setScrolled(window.scrollY > 8);
    update();
    window.addEventListener("scroll", update, { passive: true });
    return () => window.removeEventListener("scroll", update);
  }, []);
  return scrolled;
}
