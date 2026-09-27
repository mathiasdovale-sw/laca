import { defineField, defineType } from "sanity";

export const imageWithAlt = defineType({
  name: "imageWithAlt",
  title: "Imagen",
  type: "image",
  options: { hotspot: true },
  fields: [
    defineField({
      name: "alt",
      title: "Texto alternativo",
      description:
        "Describí brevemente qué se ve en la imagen (ej.: “Fachada de la casa desde el jardín”). Lo usan los lectores de pantalla y Google.",
      type: "string",
      validation: (rule) =>
        rule.required().error("El texto alternativo es obligatorio."),
    }),
  ],
});
