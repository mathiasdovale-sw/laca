import { defineField, defineType } from "sanity";

export const imageWithAlt = defineType({
  name: "imageWithAlt",
  title: "Imagen",
  type: "image",
  description:
    "Con el botón de edición (lápiz) podés marcar el punto de interés (el círculo) para que no se corte en las miniaturas. El recorte (el rectángulo) no se aplica en el sitio.",
  // El sitio solo usa el hotspot; el crop no se aplica (ver SanityImage.tsx).
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
