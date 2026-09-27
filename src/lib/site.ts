/** URL pública del sitio, sin barra final. */
export const siteUrl = (
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://estudiolaca.com"
).replace(/\/$/, "");

/** Nombre de respaldo si todavía no se cargó la Configuración en Sanity. */
export const fallbackSiteTitle = "Estudio LACA";

export const navigation = [
  { href: "/proyectos", label: "Proyectos" },
  { href: "/estudio", label: "Estudio" },
  { href: "/contacto", label: "Contacto" },
] as const;
