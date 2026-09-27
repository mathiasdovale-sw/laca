/**
 * Studio de Sanity embebido en /studio.
 * La configuración está en sanity.config.ts (raíz del proyecto).
 */
import { NextStudio } from "next-sanity/studio";

import config from "../../../../sanity.config";

export const dynamic = "force-static";

export { metadata, viewport } from "next-sanity/studio";

export default function StudioPage() {
  return <NextStudio config={config} />;
}
