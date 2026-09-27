import Link from "next/link";

import { SanityImage, type SanityImageValue } from "./SanityImage";

export type ProjectCardData = {
  _id: string;
  title: string | null;
  slug: string | null;
  coverImage: SanityImageValue | null;
  category: string | null;
};

export function ProjectCard({ project }: { project: ProjectCardData }) {
  if (!project.slug) return null;

  return (
    <Link href={`/proyectos/${project.slug}`} className="group block">
      <div className="relative aspect-[4/3] overflow-hidden bg-neutral-100">
        <SanityImage
          image={project.coverImage}
          fill
          sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
          className="object-cover transition-opacity group-hover:opacity-90"
        />
      </div>
      <h3 className="mt-3 font-medium">{project.title}</h3>
      {project.category && (
        <p className="text-sm text-muted">{project.category}</p>
      )}
    </Link>
  );
}
