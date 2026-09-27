import type { Metadata } from "next";

import { Container } from "@/components/Container";
import { ProjectCard } from "@/components/ProjectCard";
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
    tags: ["project", "category"],
  });

  return (
    <Container className="py-12">
      <h1 className="mb-8 text-2xl font-semibold">Proyectos</h1>
      {projects.length > 0 ? (
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {projects.map((project) => (
            <ProjectCard key={project._id} project={project} />
          ))}
        </div>
      ) : (
        <p className="text-muted">Todavía no hay proyectos publicados.</p>
      )}
    </Container>
  );
}
