import { defineQuery } from "next-sanity";

// Proyección reutilizable para imágenes: alt, hotspot y las dimensiones
// originales para que next/image reserve el espacio correcto.
const image = /* groq */ `{
  _key,
  alt,
  hotspot { x, y },
  asset->{ _id, metadata { dimensions { width, height } } }
}`;

const seo = /* groq */ `seo { title, description, image ${image} }`;

export const settingsQuery = defineQuery(`
  *[_type == "settings" && _id == "settings"][0] {
    siteTitle,
    siteDescription,
    email,
    phone,
    address,
    location,
    mapsUrl,
    instagram,
    linkedin,
    contactTitle,
    contactText
  }
`);

// Solo se usa en el servidor, al enviar el formulario.
export const contactSettingsQuery = defineQuery(`
  *[_type == "settings" && _id == "settings"][0] { siteTitle, contactFormRecipient }
`);

// Datos de un proyecto para las tarjetas (imagen vertical).
const projectCard = /* groq */ `{
  _id,
  title,
  "slug": slug.current,
  coverImage ${image},
  location,
  year
}`;

// Datos de un proyecto para el carrusel (imagen horizontal; si falta, la
// vertical).
const projectSlide = /* groq */ `{
  _id,
  title,
  "slug": slug.current,
  "image": coalesce(bannerImage, coverImage) ${image},
  location
}`;

export const homeQuery = defineQuery(`
  *[_type == "home" && _id == "home"][0] {
    heroProjects[]-> ${projectSlide},
    intro,
    featuredProjects[]-> ${projectCard},
    studioHeading,
    studioText,
    studioImage ${image},
    ${seo}
  }
`);

export const projectsQuery = defineQuery(`
  *[_type == "project" && defined(slug.current)] | order(orderRank) {
    _id,
    title,
    "slug": slug.current,
    coverImage ${image},
    location,
    year
  }
`);

export const projectQuery = defineQuery(`
  *[_type == "project" && slug.current == $slug][0] {
    _id,
    title,
    "slug": slug.current,
    coverImage ${image},
    "bannerImage": coalesce(bannerImage, coverImage) ${image},
    status,
    location,
    year,
    area,
    description,
    gallery[] ${image},
    ${seo}
  }
`);

export const projectSlugsQuery = defineQuery(`
  *[_type == "project" && defined(slug.current)].slug.current
`);

export const studioQuery = defineQuery(`
  *[_type == "studio" && _id == "studio"][0] {
    title,
    body,
    team[] { _key, name, role, bio, photo ${image} },
    processTitle,
    process[] { _key, title, text },
    ${seo}
  }
`);

// Links de la columna “Legal” del footer, en el orden del Studio.
export const legalLinksQuery = defineQuery(`
  *[_type == "legalPage" && defined(slug.current)] | order(orderRank) {
    _id,
    "label": coalesce(footerLabel, title),
    "slug": slug.current
  }
`);

export const legalPageQuery = defineQuery(`
  *[_type == "legalPage" && slug.current == $slug][0] {
    title,
    updatedAt,
    body,
    ${seo}
  }
`);

export const legalSlugsQuery = defineQuery(`
  *[_type == "legalPage" && defined(slug.current)].slug.current
`);

export const legalSitemapQuery = defineQuery(`
  *[_type == "legalPage" && defined(slug.current)] {
    "slug": slug.current,
    _updatedAt
  }
`);

export const sitemapQuery = defineQuery(`
  *[_type == "project" && defined(slug.current)] {
    "slug": slug.current,
    _updatedAt
  }
`);
