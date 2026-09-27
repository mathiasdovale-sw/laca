import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { Container } from "@/components/Container";
import { RichText } from "@/components/RichText";
import { SanityImage } from "@/components/SanityImage";
import { Label } from "@/components/ui";
import { buildMetadata } from "@/lib/metadata";
import { client } from "@/sanity/lib/client";
import { sanityFetch } from "@/sanity/lib/fetch";
import { projectQuery, projectSlugsQuery } from "@/sanity/lib/queries";

// Se generan todas en el build. Si se publica un proyecto nuevo, su página se
// genera en la primera visita y queda cacheada como estática.
export async function generateStaticParams() {
  const slugs = await client.fetch(projectSlugsQuery);
  return slugs.map((slug) => ({ slug }));
}

async function getProject(slug: string) {
  return sanityFetch({
    query: projectQuery,
    params: { slug },
    tags: ["project", "category"],
  });
}

export async function generateMetadata({
  params,
}: PageProps<"/proyectos/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const project = await getProject(slug);
  if (!project) return {};

  return buildMetadata({
    seo: project.seo,
    title: project.title,
    description: project.description,
    image: project.coverImage,
    path: `/proyectos/${slug}`,
  });
}

export default async function ProjectPage({
  params,
}: PageProps<"/proyectos/[slug]">) {
  const { slug } = await params;
  const project = await getProject(slug);
  if (!project) notFound();

  const facts = [
    { label: "Categoría", value: project.category },
    { label: "Ubicación", value: project.location },
    { label: "Año", value: project.year },
    {
      label: "Superficie",
      value: project.area ? `${project.area.toLocaleString("es-AR")} m²` : null,
    },
  ].filter((fact) => fact.value);

  return (
    <article>
      <Container className="pt-10 pb-20 md:pt-16 md:pb-28">
        <h1 className="text-4xl tracking-tight md:text-5xl">{project.title}</h1>

        {facts.length > 0 && (
          <dl className="mt-8 grid grid-cols-2 gap-6 border-t border-border pt-6 sm:grid-cols-4">
            {facts.map((fact) => (
              <div key={fact.label}>
                <Label as="dt" className="mb-1 text-muted">
                  {fact.label}
                </Label>
                <dd>{fact.value}</dd>
              </div>
            ))}
          </dl>
        )}

        <SanityImage
          image={project.coverImage}
          sizes="100vw"
          preload
          className="mt-10 h-auto w-full"
        />

        <div className="mt-12 max-w-3xl text-lg leading-relaxed md:mt-16">
          <RichText value={project.description} />
        </div>

        {project.gallery && project.gallery.length > 0 && (
          <div className="mt-12 grid gap-6 sm:grid-cols-2 md:mt-16 md:gap-10">
            {project.gallery.map((image) => (
              <SanityImage
                key={image._key}
                image={image}
                sizes="(min-width: 640px) 50vw, 100vw"
                className="h-auto w-full"
              />
            ))}
          </div>
        )}
      </Container>
    </article>
  );
}
