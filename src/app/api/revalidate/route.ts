import { revalidateTag } from "next/cache";
import type { NextRequest } from "next/server";
import { parseBody } from "next-sanity/webhook";

import type { CacheTag } from "@/sanity/lib/fetch";

/**
 * Webhook de Sanity: se llama cada vez que se publica, modifica o borra un
 * documento. Invalida la caché de las páginas que usan ese tipo de documento.
 * Configuración del webhook: ver README → "Webhook de revalidación".
 */
const cacheTags = new Set<string>([
  "home",
  "project",
  "category",
  "studio",
  "settings",
] satisfies CacheTag[]);

export async function POST(request: NextRequest) {
  const secret = process.env.SANITY_REVALIDATE_SECRET;
  if (!secret) {
    return Response.json(
      { message: "Falta SANITY_REVALIDATE_SECRET" },
      { status: 500 },
    );
  }

  // Valida la firma del webhook y espera a que el contenido nuevo esté
  // disponible en la API antes de seguir.
  const { isValidSignature, body } = await parseBody<{ _type?: string }>(
    request,
    secret,
    true,
  );

  if (!isValidSignature) {
    return Response.json({ message: "Firma inválida" }, { status: 401 });
  }

  const tag = body?._type;
  if (!tag || !cacheTags.has(tag)) {
    return Response.json(
      { message: `Tipo no reconocido: ${tag}` },
      { status: 400 },
    );
  }

  // expire: 0 → la próxima visita ya ve el contenido nuevo (en vez de servir
  // la versión vieja una vez más mientras se regenera).
  revalidateTag(tag, { expire: 0 });

  return Response.json({ revalidated: true, tag });
}
