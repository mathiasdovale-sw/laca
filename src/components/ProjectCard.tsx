import Link from "next/link";

import { Reveal } from "./Reveal";
import { SanityImage, type SanityImageValue } from "./SanityImage";
import { Label } from "./ui";

export type ProjectCardData = {
  _id: string;
  title: string | null;
  slug: string | null;
  coverImage: SanityImageValue | null;
  location: string | null;
  year: number | null;
};

export function ProjectCard({ project }: { project: ProjectCardData }) {
  if (!project.slug) return null;

  return (
    <Link href={`/proyectos/${project.slug}`} className="group block">
      <div className="relative aspect-[4/5] overflow-hidden bg-neutral-100">
        <SanityImage
          image={project.coverImage}
          fill
          sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
          className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03] motion-reduce:transition-none"
        />
      </div>
      <div className="mt-4 flex items-start justify-between gap-4">
        <h3 className="text-base">{project.title}</h3>
        <Label as="span" className="mt-1 text-right text-muted">
          {[project.location, project.year].filter(Boolean).join(" · ")}
        </Label>
      </div>
    </Link>
  );
}

/**
 * Grilla de proyectos: 1 columna en celular, 2 en tablet, 3 en desktop.
 * Las tarjetas aparecen al hacer scroll, escalonadas dentro de cada fila.
 */
export function ProjectGrid({ projects }: { projects: ProjectCardData[] }) {
  return (
    <div className="grid gap-x-6 gap-y-12 sm:grid-cols-2 md:gap-x-10 lg:grid-cols-3 lg:gap-x-16">
      {projects.map((project, i) => (
        <Reveal key={project._id} delay={(i % 3) * 100}>
          <ProjectCard project={project} />
        </Reveal>
      ))}
    </div>
  );
}
