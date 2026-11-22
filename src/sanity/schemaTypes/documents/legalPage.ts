import {
  orderRankField,
  orderRankOrdering,
} from "@sanity/orderable-document-list";
import { DocumentTextIcon } from "@sanity/icons/DocumentText";
import { defineField, defineType } from "sanity";

/**
 * Página legal: privacidad, cookies, términos, aviso legal… Cada una se
 * publica en /legales/<slug> y aparece en la columna “Legal” del footer, en
 * el orden de la lista del Studio.
 */
export const legalPage = defineType({
  name: "legalPage",
  title: "Página legal",
  type: "document",
  icon: DocumentTextIcon,
  orderings: [orderRankOrdering],
  fields: [
    orderRankField({ type: "legalPage" }),
    defineField({
      name: "title",
      title: "Título",
      description: "Ej.: Política de privacidad, Política de cookies.",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "slug",
      title: "Dirección web (slug)",
      description:
        "La página queda en /legales/… Tocá “Generate” para crearla a partir del título.",
      type: "slug",
      options: { source: "title", maxLength: 96 },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "footerLabel",
      title: "Texto del link en el footer",
      description:
        "Opcional, para un texto más corto que el título. Ej.: “privacidad”.",
      type: "string",
    }),
    defineField({
      name: "updatedAt",
      title: "Última actualización",
      description: "Se muestra debajo del título.",
      type: "date",
      options: { dateFormat: "DD/MM/YYYY" },
    }),
    defineField({
      name: "body",
      title: "Texto",
      type: "richText",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "seo",
      title: "SEO",
      type: "seo",
    }),
  ],
  preview: {
    select: { title: "title", slug: "slug.current" },
    prepare: ({ title, slug }) => ({
      title,
      subtitle: slug ? `/legales/${slug}` : undefined,
    }),
  },
});
