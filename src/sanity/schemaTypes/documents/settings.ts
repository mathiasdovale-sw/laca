import { CogIcon } from "@sanity/icons/Cog";
import { defineField, defineType } from "sanity";

export const settings = defineType({
  name: "settings",
  title: "Configuración",
  type: "document",
  icon: CogIcon,
  groups: [
    { name: "general", title: "General", default: true },
    { name: "contact", title: "Contacto" },
    { name: "social", title: "Redes sociales" },
    { name: "form", title: "Formulario" },
  ],
  fields: [
    defineField({
      name: "siteTitle",
      title: "Nombre del sitio",
      description: "Aparece en la pestaña del navegador y en Google.",
      type: "string",
      group: "general",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "siteDescription",
      title: "Descripción del sitio",
      description:
        "Texto que muestra Google cuando una página no tiene su propia descripción.",
      type: "text",
      rows: 3,
      group: "general",
      validation: (rule) =>
        rule.max(160).warning("Conviene que no pase de 160 caracteres."),
    }),
    defineField({
      name: "email",
      title: "Email de contacto",
      description: "Email público que se muestra en el sitio.",
      type: "string",
      group: "contact",
      validation: (rule) => rule.email(),
    }),
    defineField({
      name: "phone",
      title: "Teléfono",
      type: "string",
      group: "contact",
    }),
    defineField({
      name: "address",
      title: "Dirección",
      type: "text",
      rows: 2,
      group: "contact",
    }),
    defineField({
      name: "mapsUrl",
      title: "Enlace a Google Maps",
      type: "url",
      group: "contact",
    }),
    defineField({
      name: "instagram",
      title: "Instagram",
      description:
        "Enlace completo, ej.: https://www.instagram.com/estudiolaca",
      type: "url",
      group: "social",
    }),
    defineField({
      name: "linkedin",
      title: "LinkedIn",
      description: "Enlace completo a la página de LinkedIn.",
      type: "url",
      group: "social",
    }),
    defineField({
      name: "facebook",
      title: "Facebook",
      description: "Enlace completo a la página de Facebook.",
      type: "url",
      group: "social",
    }),
    defineField({
      name: "contactFormRecipient",
      title: "Email que recibe los mensajes del formulario",
      description:
        "Los mensajes del formulario de contacto llegan a esta dirección. No se muestra en el sitio.",
      type: "string",
      group: "form",
      validation: (rule) => rule.required().email(),
    }),
  ],
  preview: {
    prepare: () => ({ title: "Configuración" }),
  },
});
