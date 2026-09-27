import type { Metadata } from "next";

import { buildMetadata } from "@/lib/metadata";

export const metadata: Metadata = buildMetadata({
  title: "Contacto",
  description: "Contanos sobre tu proyecto.",
  path: "/contacto",
});

/**
 * El bloque de contacto (formulario y datos) aparece al final de todas las
 * páginas desde el layout, así que esta página no agrega contenido propio.
 * Si más adelante lleva algo (mapa, texto), va acá arriba del bloque.
 */
export default function ContactPage() {
  return <h1 className="sr-only">Contacto</h1>;
}
