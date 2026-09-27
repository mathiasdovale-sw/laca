import { category } from "./documents/category";
import { home } from "./documents/home";
import { project } from "./documents/project";
import { settings } from "./documents/settings";
import { studio } from "./documents/studio";
import { imageWithAlt } from "./objects/imageWithAlt";
import { richText } from "./objects/richText";
import { seo } from "./objects/seo";
import { teamMember } from "./objects/teamMember";

export const schemaTypes = [
  // Documentos
  home,
  project,
  category,
  studio,
  settings,
  // Objetos
  imageWithAlt,
  richText,
  seo,
  teamMember,
];

/** Documentos que existen una sola vez (su _id es igual a su _type). */
export const singletonTypes = new Set(["home", "studio", "settings"]);
