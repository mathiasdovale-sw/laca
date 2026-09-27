import { defineQuery } from "next-sanity";

// Proyección reutilizable para imágenes: mantiene alt, crop y hotspot, y trae
// las dimensiones originales para que next/image reserve el espacio correcto.
const image = /* groq */ `{
  ...,
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
    mapsUrl,
    instagram,
    linkedin,
    facebook
  }
`);

// Solo se usa en el servidor, al enviar el formulario.
export const contactSettingsQuery = defineQuery(`
  *[_type == "settings" && _id == "settings"][0] { siteTitle, contactFormRecipient }
`);

export const homeQuery = defineQuery(`
  *[_type == "home" && _id == "home"][0] {
    intro,
    featuredProjects[]-> {
      _id,
      title,
      "slug": slug.current,
      coverImage ${image},
      "category": category->title
    },
    ${seo}
  }
`);

export const projectsQuery = defineQuery(`
  *[_type == "project" && defined(slug.current)] | order(orderRank) {
    _id,
    title,
    "slug": slug.current,
    coverImage ${image},
    "category": category->title,
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
    "category": category->title,
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
    team[] { _key, name, role, photo ${image} },
    ${seo}
  }
`);

export const sitemapQuery = defineQuery(`
  *[_type == "project" && defined(slug.current)] {
    "slug": slug.current,
    _updatedAt
  }
`);
