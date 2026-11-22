import { home } from "./documents/home";
import { legalPage } from "./documents/legalPage";
import { project } from "./documents/project";
import { settings } from "./documents/settings";
import { studio } from "./documents/studio";
import { imageWithAlt } from "./objects/imageWithAlt";
import { processStep } from "./objects/processStep";
import { richText } from "./objects/richText";
import { seo } from "./objects/seo";
import { teamMember } from "./objects/teamMember";

export const schemaTypes = [
  // Documentos
  home,
  project,
  legalPage,
  studio,
  settings,
  // Objetos
  imageWithAlt,
  processStep,
  richText,
  seo,
  teamMember,
];

/** Documentos que existen una sola vez (su _id es igual a su _type). */
export const singletonTypes = new Set(["home", "studio", "settings"]);
