import { HomeIcon } from "@sanity/icons/Home";
import { defineArrayMember, defineField, defineType } from "sanity";

export const home = defineType({
  name: "home",
  title: "Inicio",
  type: "document",
  icon: HomeIcon,
  groups: [
    { name: "hero", title: "Carrusel", default: true },
    { name: "content", title: "Presentación y proyectos" },
    { name: "studio", title: "Bloque Estudio" },
    { name: "seo", title: "SEO" },
  ],
  fields: [
    defineField({
      name: "heroProjects",
      title: "Proyectos del carrusel",
      description:
        "Se muestran a pantalla completa arriba de todo, uno cada 5 segundos, con su imagen de portada, nombre y ubicación.",
      type: "array",
      group: "hero",
      of: [defineArrayMember({ type: "reference", to: [{ type: "project" }] })],
      validation: (rule) => rule.unique(),
    }),
    defineField({
      name: "intro",
      title: "Texto de presentación",
      description:
        "Párrafo breve debajo del carrusel. Podés marcar palabras en negrita.",
      type: "array",
      group: "content",
      of: [
        defineArrayMember({
          type: "block",
          styles: [{ title: "Normal", value: "normal" }],
          lists: [],
          marks: {
            decorators: [{ title: "Negrita", value: "strong" }],
            annotations: [],
          },
        }),
      ],
    }),
    defineField({
      name: "featuredProjects",
      title: "Proyectos destacados",
      description:
        "Elegí qué proyectos se muestran en la grilla del inicio y en qué orden.",
      type: "array",
      group: "content",
      of: [defineArrayMember({ type: "reference", to: [{ type: "project" }] })],
      validation: (rule) => rule.unique(),
    }),
    defineField({
      name: "studioHeading",
      title: "Frase destacada",
      description:
        "Primera parte de la frase, en color oscuro. Ej.: “Cada proyecto comienza escuchando.”",
      type: "string",
      group: "studio",
    }),
    defineField({
      name: "studioText",
      title: "Continuación de la frase",
      description: "Sigue a la frase destacada, en gris.",
      type: "text",
      rows: 3,
      group: "studio",
    }),
    defineField({
      name: "studioImage",
      title: "Imagen",
      type: "imageWithAlt",
      group: "studio",
    }),
    defineField({
      name: "seo",
      title: "SEO",
      type: "seo",
      group: "seo",
    }),
  ],
  preview: {
    prepare: () => ({ title: "Inicio" }),
  },
});
