import { HomeIcon } from "@sanity/icons/Home";
import { defineArrayMember, defineField, defineType } from "sanity";

export const home = defineType({
  name: "home",
  title: "Inicio",
  type: "document",
  icon: HomeIcon,
  fields: [
    defineField({
      name: "intro",
      title: "Texto de presentación",
      description:
        "Párrafo breve que aparece arriba de todo en la página de inicio.",
      type: "text",
      rows: 4,
    }),
    defineField({
      name: "featuredProjects",
      title: "Proyectos destacados",
      description:
        "Elegí qué proyectos se muestran en el inicio y en qué orden.",
      type: "array",
      of: [defineArrayMember({ type: "reference", to: [{ type: "project" }] })],
      validation: (rule) => rule.unique(),
    }),
    defineField({
      name: "seo",
      title: "SEO",
      type: "seo",
    }),
  ],
  preview: {
    prepare: () => ({ title: "Inicio" }),
  },
});
