import type { Metadata } from "next";
import Link from "next/link";

import { Container } from "@/components/Container";
import { ProjectCard } from "@/components/ProjectCard";
import { buildMetadata } from "@/lib/metadata";
import { sanityFetch } from "@/sanity/lib/fetch";
import { homeQuery } from "@/sanity/lib/queries";

async function getHome() {
  return sanityFetch({
    query: homeQuery,
    tags: ["home", "project", "category"],
  });
}

export async function generateMetadata(): Promise<Metadata> {
  const home = await getHome();
  return buildMetadata({ seo: home?.seo, description: home?.intro, path: "/" });
}

export default async function HomePage() {
  const home = await getHome();
  const projects =
    home?.featuredProjects?.filter((project) => project !== null) ?? [];

  return (
    <Container className="py-12">
      {home?.intro && (
        <p className="max-w-2xl text-lg leading-relaxed whitespace-pre-line">
          {home.intro}
        </p>
      )}

      {projects.length > 0 && (
        <section className="mt-12">
          <h2 className="mb-6 text-sm tracking-wide text-muted uppercase">
            Proyectos destacados
          </h2>
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {projects.map((project) => (
              <ProjectCard key={project._id} project={project} />
            ))}
          </div>
        </section>
      )}

      <p className="mt-12">
        <Link href="/proyectos" className="underline underline-offset-4">
          Ver todos los proyectos
        </Link>
      </p>
    </Container>
  );
}
