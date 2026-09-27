import type { QueryParams } from "next-sanity";

import { client } from "./client";

/**
 * Tags de caché. Cada uno coincide con el `_type` de un documento de Sanity:
 * el webhook de /api/revalidate llama a revalidateTag(_type) al publicar.
 */
export type CacheTag = "home" | "project" | "category" | "studio" | "settings";

/**
 * Consulta a Sanity cacheada en forma permanente (sin revalidación por tiempo).
 * Solo se invalida cuando el webhook revalida alguno de sus `tags`.
 */
export async function sanityFetch<const QueryString extends string>({
  query,
  params = {},
  tags,
}: {
  query: QueryString;
  params?: QueryParams;
  tags: CacheTag[];
}) {
  return client.fetch(query, params, {
    cache: "force-cache",
    next: { revalidate: false, tags },
  });
}
