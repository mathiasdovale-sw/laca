import { defineField, defineType } from "sanity";

/** Una etapa de “Cómo trabajamos” (página Estudio). */
export const processStep = defineType({
  name: "processStep",
  title: "Etapa",
  type: "object",
  fields: [
    defineField({
      name: "title",
      title: "Título",
      description: "Ej.: Reunión y visita. El número se agrega solo.",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "text",
      title: "Texto",
      description: "Dejá una línea en blanco para separar párrafos.",
      type: "text",
      rows: 8,
    }),
  ],
  preview: {
    select: { title: "title", subtitle: "text" },
  },
});
