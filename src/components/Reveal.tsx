"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Hace aparecer su contenido con un fundido y un leve desplazamiento hacia
 * arriba cuando entra en pantalla (una sola vez). `delay` en milisegundos
 * sirve para escalonar varios elementos seguidos.
 *
 * Los estilos están en globals.css (`.reveal`): sin JavaScript o con
 * “reducir movimiento” activado, el contenido se ve directamente.
 */
export function Reveal({
  children,
  delay = 0,
  className = "",
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { rootMargin: "0px 0px -10% 0px" },
    );
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      data-visible={visible || undefined}
      style={{ "--reveal-delay": `${delay}ms` } as React.CSSProperties}
      className={`reveal ${className}`}
    >
      {children}
    </div>
  );
}
