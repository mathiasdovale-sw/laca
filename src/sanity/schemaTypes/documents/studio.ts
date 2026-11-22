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
      name: "processTitle",
      title: "Título de “Cómo trabajamos”",
      type: "string",
      initialValue: "Cómo trabajamos",
    }),
    defineField({
      name: "process",
      title: "Etapas de “Cómo trabajamos”",
      description:
        "Se numeran solas (01, 02…) en el orden de la lista. Arrastrá para cambiar el orden.",
      type: "array",
      of: [defineArrayMember({ type: "processStep" })],
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
