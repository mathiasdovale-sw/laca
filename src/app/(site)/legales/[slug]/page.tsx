import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { Container } from "@/components/Container";
import { RichText } from "@/components/RichText";
import { Label } from "@/components/ui";
import { buildMetadata } from "@/lib/metadata";
import { client } from "@/sanity/lib/client";
import { sanityFetch } from "@/sanity/lib/fetch";
import { legalPageQuery, legalSlugsQuery } from "@/sanity/lib/queries";

// Igual que los proyectos: se generan en el build y las nuevas en la primera
// visita, y quedan cacheadas hasta que el webhook las revalida.
export async function generateStaticParams() {
  const slugs = await client.fetch(legalSlugsQuery);
  return slugs.map((slug) => ({ slug }));
}

async function getLegalPage(slug: string) {
  return sanityFetch({
    query: legalPageQuery,
    params: { slug },
    tags: ["legalPage"],
  });
}

export async function generateMetadata({
  params,
}: PageProps<"/legales/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const page = await getLegalPage(slug);
  if (!page) return {};

  return buildMetadata({
    seo: page.seo,
    title: page.title,
    description: page.body,
    path: `/legales/${slug}`,
  });
}

export default async function LegalPage({
  params,
}: PageProps<"/legales/[slug]">) {
  const { slug } = await params;
  const page = await getLegalPage(slug);
  if (!page) notFound();

  return (
    <Container className="pt-10 pb-20 md:pt-16 md:pb-28">
      <h1 className="text-4xl tracking-tight md:text-5xl">{page.title}</h1>
      {page.updatedAt && (
        <Label className="mt-4 text-muted">
          Última actualización: {formatDate(page.updatedAt)}
        </Label>
      )}
      <div className="mt-12 max-w-3xl leading-relaxed md:mt-16 md:text-lg">
        <RichText value={page.body} />
      </div>
    </Container>
  );
}

/** "2026-11-22" → "22 de noviembre de 2026". */
function formatDate(value: string) {
  return new Date(`${value}T12:00:00`).toLocaleDateString("es-AR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}
