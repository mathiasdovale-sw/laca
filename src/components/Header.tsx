"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

import { navigation } from "@/lib/site";

import { Container } from "./Container";
import { Logo } from "./Logo";

/**
 * En el inicio va encima del carrusel (transparente, texto blanco); en el
 * resto de las páginas, sobre fondo blanco. No queda fijo al hacer scroll.
 * En pantallas chicas los links se muestran con el botón “Menú”.
 */
export function Header() {
  const pathname = usePathname();
  const overlay = pathname === "/";
  const [open, setOpen] = useState(false);

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
      className={
        overlay ? "absolute inset-x-0 top-0 z-20 text-white" : "relative"
      }
    >
      <Container className="flex items-center justify-between py-6">
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
          className="text-[0.9375rem] md:hidden"
          aria-expanded={open}
          aria-controls="mobile-menu"
          onClick={() => setOpen(true)}
        >
          Menú
        </button>
      </Container>

      {open && (
        <div
          id="mobile-menu"
          role="dialog"
          aria-modal="true"
          aria-label="Menú"
          className="fixed inset-0 z-30 flex flex-col bg-background text-foreground md:hidden"
        >
          <Container className="flex items-center justify-between py-6">
            <Logo className="text-2xl" />
            <button
              type="button"
              className="text-[0.9375rem]"
              onClick={() => setOpen(false)}
              autoFocus
            >
              Cerrar
            </button>
          </Container>
          <nav aria-label="Principal" className="flex-1">
            <Container>
              <ul className="mt-10 space-y-4 text-4xl">
                {navigation.map((item) => (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      aria-current={pathname === item.href ? "page" : undefined}
                      onClick={() => setOpen(false)}
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </Container>
          </nav>
        </div>
      )}
    </header>
  );
}
