import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { Container } from "@/components/Container";
import { RichText } from "@/components/RichText";
import { SanityImage } from "@/components/SanityImage";
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
      <Container className="py-12">
        <h1 className="text-2xl font-semibold">{project.title}</h1>

        {facts.length > 0 && (
          <dl className="mt-6 grid grid-cols-2 gap-4 text-sm sm:grid-cols-4">
            {facts.map((fact) => (
              <div key={fact.label}>
                <dt className="text-muted">{fact.label}</dt>
                <dd>{fact.value}</dd>
              </div>
            ))}
          </dl>
        )}

        <SanityImage
          image={project.coverImage}
          sizes="(min-width: 1152px) 1152px, 100vw"
          preload
          className="mt-8 h-auto w-full"
        />

        <div className="mt-10 max-w-2xl">
          <RichText value={project.description} />
        </div>

        {project.gallery && project.gallery.length > 0 && (
          <div className="mt-12 grid gap-4 sm:grid-cols-2">
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
