import { TagIcon } from "@sanity/icons/Tag";
import { defineField, defineType } from "sanity";

export const category = defineType({
  name: "category",
  title: "Categoría",
  type: "document",
  icon: TagIcon,
  fields: [
    defineField({
      name: "title",
      title: "Nombre",
      description: "Ej.: Vivienda, Comercial, Interiorismo.",
      type: "string",
      validation: (rule) => rule.required(),
    }),
  ],
  orderings: [
    {
      title: "Nombre",
      name: "titleAsc",
      by: [{ field: "title", direction: "asc" }],
    },
  ],
});
