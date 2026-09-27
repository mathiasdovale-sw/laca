import { UserIcon } from "@sanity/icons/User";
import { defineField, defineType } from "sanity";

export const teamMember = defineType({
  name: "teamMember",
  title: "Integrante",
  type: "object",
  icon: UserIcon,
  fields: [
    defineField({
      name: "name",
      title: "Nombre",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "role",
      title: "Cargo",
      description: "Ej.: Socio fundador, Arquitecta, Colaborador.",
      type: "string",
    }),
    defineField({
      name: "photo",
      title: "Foto",
      type: "imageWithAlt",
    }),
  ],
  preview: {
    select: { title: "name", subtitle: "role", media: "photo" },
  },
});
