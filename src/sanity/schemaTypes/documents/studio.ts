import { UsersIcon } from "@sanity/icons/Users";
import { defineArrayMember, defineField, defineType } from "sanity";

export const studio = defineType({
  name: "studio",
  title: "Estudio",
  type: "document",
  icon: UsersIcon,
  fields: [
    defineField({
      name: "title",
      title: "Título de la página",
      type: "string",
      initialValue: "Estudio",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "body",
      title: "Texto sobre el estudio",
      type: "richText",
    }),
    defineField({
      name: "team",
      title: "Equipo",
      description: "Arrastrá para cambiar el orden.",
      type: "array",
      of: [defineArrayMember({ type: "teamMember" })],
    }),
    defineField({
      name: "seo",
      title: "SEO",
      type: "seo",
    }),
  ],
  preview: {
    prepare: () => ({ title: "Estudio" }),
  },
});
