import { orderableDocumentListDeskItem } from "@sanity/orderable-document-list";
import { CogIcon } from "@sanity/icons/Cog";
import { DocumentTextIcon } from "@sanity/icons/DocumentText";
import { HomeIcon } from "@sanity/icons/Home";
import { ProjectsIcon } from "@sanity/icons/Projects";
import { UsersIcon } from "@sanity/icons/Users";
import type { StructureResolver } from "sanity/structure";

/** Menú lateral del Studio. */
export const structure: StructureResolver = (S, context) =>
  S.list()
    .title("Contenido")
    .items([
      S.listItem()
        .title("Inicio")
        .id("home")
        .icon(HomeIcon)
        .child(
          S.document().schemaType("home").documentId("home").title("Inicio"),
        ),

      orderableDocumentListDeskItem({
        type: "project",
        title: "Proyectos",
        icon: ProjectsIcon,
        S,
        context,
      }),

      S.divider(),

      S.listItem()
        .title("Estudio")
        .id("studio")
        .icon(UsersIcon)
        .child(
          S.document()
            .schemaType("studio")
            .documentId("studio")
            .title("Estudio"),
        ),

      S.listItem()
        .title("Configuración")
        .id("settings")
        .icon(CogIcon)
        .child(
          S.document()
            .schemaType("settings")
            .documentId("settings")
            .title("Configuración"),
        ),

      orderableDocumentListDeskItem({
        type: "legalPage",
        title: "Legales",
        icon: DocumentTextIcon,
        S,
        context,
      }),
    ]);
