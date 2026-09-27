import { defineField, defineType } from "sanity";

export const seo = defineType({
  name: "seo",
  title: "SEO",
  description:
    "Opcional. Cómo se ve esta página en Google y al compartirla en redes. Si lo dejás vacío se usan el título, el texto y la imagen principal.",
  type: "object",
  options: { collapsible: true, collapsed: true },
  fields: [
    defineField({
      name: "title",
      title: "Título para buscadores",
      type: "string",
      validation: (rule) =>
        rule.max(60).warning("Conviene que no pase de 60 caracteres."),
    }),
    defineField({
      name: "description",
      title: "Descripción para buscadores",
      type: "text",
      rows: 3,
      validation: (rule) =>
        rule.max(160).warning("Conviene que no pase de 160 caracteres."),
    }),
    defineField({
      name: "image",
      title: "Imagen para compartir",
      description: "Se muestra al compartir el enlace en redes o WhatsApp.",
      type: "imageWithAlt",
    }),
  ],
});
