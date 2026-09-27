/** URL pública del sitio, sin barra final. */
export const siteUrl = (
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://estudiolaca.com"
).replace(/\/$/, "");

/** Nombre del estudio: logo y respaldo si no se cargó la Configuración. */
export const fallbackSiteTitle = "laca.estudio";

export const navigation = [
  { href: "/estudio", label: "Estudio" },
  { href: "/proyectos", label: "Proyectos" },
  { href: "/contacto", label: "Contacto" },
] as const;

/** Páginas legales: todavía no existen, los links quedan preparados. */
export const legalLinks = [
  { href: "/cookies", label: "cookies" },
  { href: "/privacidad", label: "privacidad" },
] as const;
