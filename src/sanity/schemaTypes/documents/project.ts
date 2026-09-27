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
      name: "category",
      title: "Categoría",
      description: "Las categorías se administran en la sección “Categorías”.",
      type: "reference",
      to: [{ type: "category" }],
      group: "content",
      validation: (rule) => rule.required(),
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
      title: "Imagen de portada",
      description:
        "Se usa en los listados y al principio de la página del proyecto.",
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
      category: "category.title",
      year: "year",
      media: "coverImage",
    },
    prepare({ title, category, year, media }) {
      return {
        title,
        subtitle: [category, year].filter(Boolean).join(" · "),
        media,
      };
    },
  },
});
