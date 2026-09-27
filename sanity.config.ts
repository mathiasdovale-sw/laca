"use client";

/**
 * Configuración del Studio de Sanity, montado en /studio
 * (src/app/studio/[[...tool]]/page.tsx).
 */
import { esESLocale } from "@sanity/locale-es-es";
import { visionTool } from "@sanity/vision";
import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";

import { apiVersion, dataset, projectId } from "./src/sanity/env";
import { schemaTypes, singletonTypes } from "./src/sanity/schemaTypes";
import { structure } from "./src/sanity/structure";

// En los singletons solo se permite publicar, descartar cambios y restaurar:
// no se pueden duplicar ni borrar.
const singletonActions = new Set(["publish", "discardChanges", "restore"]);

export default defineConfig({
  name: "default",
  title: "Estudio LACA",
  basePath: "/studio",
  projectId,
  dataset,

  plugins: [
    structureTool({ structure }),
    // Consola para probar consultas GROQ (pestaña "Vision").
    visionTool({ defaultApiVersion: apiVersion }),
    esESLocale(),
  ],

  schema: {
    types: schemaTypes,
    // Oculta los singletons del botón "Crear nuevo documento".
    templates: (templates) =>
      templates.filter(({ schemaType }) => !singletonTypes.has(schemaType)),
  },

  document: {
    actions: (input, context) =>
      singletonTypes.has(context.schemaType)
        ? input.filter(({ action }) => action && singletonActions.has(action))
        : input,
  },
});
