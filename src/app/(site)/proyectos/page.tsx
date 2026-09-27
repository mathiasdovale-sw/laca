import type { Metadata } from "next";

import { Container } from "@/components/Container";
import { ProjectGrid } from "@/components/ProjectCard";
import { buildMetadata } from "@/lib/metadata";
import { sanityFetch } from "@/sanity/lib/fetch";
import { projectsQuery } from "@/sanity/lib/queries";

export const metadata: Metadata = buildMetadata({
  title: "Proyectos",
  path: "/proyectos",
});

export default async function ProjectsPage() {
  const projects = await sanityFetch({
    query: projectsQuery,
    tags: ["project"],
  });

  return (
    <Container className="pt-10 pb-20 md:pt-16 md:pb-28">
      <h1 className="mb-12 text-4xl tracking-tight md:mb-16 md:text-5xl">
        Proyectos
      </h1>
      {projects.length > 0 ? (
        <ProjectGrid projects={projects} />
      ) : (
        <p className="text-muted">Todavía no hay proyectos publicados.</p>
      )}
    </Container>
  );
}
