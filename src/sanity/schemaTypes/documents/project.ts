import {
  orderRankField,
  orderRankOrdering,
} from "@sanity/orderable-document-list";
import { ProjectsIcon } from "@sanity/icons/Projects";
import { defineArrayMember, defineField, defineType } from "sanity";

export const project = defineType({
  name: "project",
  title: "Proyecto",
  type: "document",
  icon: ProjectsIcon,
  orderings: [orderRankOrdering],
  groups: [
    { name: "content", title: "Contenido", default: true },
    { name: "images", title: "Imágenes" },
    { name: "seo", title: "SEO" },
  ],
  fields: [
    orderRankField({ type: "project" }),
    defineField({
      name: "title",
      title: "Título",
      type: "string",
      group: "content",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "slug",
      title: "Dirección web (slug)",
      description:
        "Es la parte final de la URL del proyecto. Tocá “Generate” para crearla a partir del título.",
      type: "slug",
      group: "content",
      options: { source: "title", maxLength: 96 },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "status",
      title: "Estado",
      description: "Texto libre. Ej.: Construido, En obra, En proyecto.",
      type: "string",
      group: "content",
    }),
    defineField({
      name: "location",
      title: "Ubicación",
      description: "Ej.: Palermo, Buenos Aires.",
      type: "string",
      group: "content",
    }),
    defineField({
      name: "year",
      title: "Año",
      type: "number",
      group: "content",
      validation: (rule) => rule.integer().min(1900).max(2100),
    }),
    defineField({
      name: "area",
      title: "Superficie (m²)",
      description: "Solo el número, sin “m²”.",
      type: "number",
      group: "content",
      validation: (rule) => rule.positive(),
    }),
    defineField({
      name: "description",
      title: "Descripción",
      type: "richText",
      group: "content",
    }),
    defineField({
      name: "coverImage",
      title: "Imagen de portada (vertical)",
      description:
        "Se muestra en la grilla de proyectos del inicio y en /proyectos. Vertical 4:5, ideal 1920 × 2400 px.",
      type: "imageWithAlt",
      group: "images",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "bannerImage",
      title: "Imagen de banner (horizontal)",
      description:
        "Se muestra a pantalla completa en el carrusel del inicio y arriba de todo en la página del proyecto. Horizontal, ideal 2560 × 1440 px (16:9).",
      type: "imageWithAlt",
      group: "images",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "gallery",
      title: "Galería",
      description: "Arrastrá las imágenes para cambiar el orden.",
      type: "array",
      group: "images",
      of: [defineArrayMember({ type: "imageWithAlt" })],
      options: { layout: "grid" },
    }),
    defineField({
      name: "seo",
      title: "SEO",
      type: "seo",
      group: "seo",
    }),
  ],
  preview: {
    select: {
      title: "title",
      status: "status",
      year: "year",
      media: "coverImage",
    },
    prepare({ title, status, year, media }) {
      return {
        title,
        subtitle: [status, year].filter(Boolean).join(" · "),
        media,
      };
    },
  },
});
