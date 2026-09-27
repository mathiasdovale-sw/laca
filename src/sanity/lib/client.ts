import { createClient } from "next-sanity";

import { apiVersion, dataset, projectId } from "../env";

export const client = createClient({
  projectId,
  dataset,
  apiVersion,
  // Sin CDN: después de publicar, el webhook revalida y la consulta tiene que
  // traer el contenido nuevo. Next cachea el resultado, así que casi no hay
  // consultas reales a Sanity.
  useCdn: false,
  perspective: "published",
});
