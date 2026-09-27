import type { Metadata } from "next";

import { Container } from "@/components/Container";
import { RichText } from "@/components/RichText";
import { SanityImage } from "@/components/SanityImage";
import { Label } from "@/components/ui";
import { buildMetadata } from "@/lib/metadata";
import { sanityFetch } from "@/sanity/lib/fetch";
import { studioQuery } from "@/sanity/lib/queries";

async function getStudio() {
  return sanityFetch({ query: studioQuery, tags: ["studio"] });
}

export async function generateMetadata(): Promise<Metadata> {
  const studio = await getStudio();
  return buildMetadata({
    seo: studio?.seo,
    title: studio?.title ?? "Estudio",
    description: studio?.body,
    path: "/estudio",
  });
}

export default async function StudioPage() {
  const studio = await getStudio();

  return (
    <Container className="pt-10 pb-20 md:pt-16 md:pb-28">
      <h1 className="mb-12 text-4xl tracking-tight md:mb-16 md:text-5xl">
        {studio?.title ?? "Estudio"}
      </h1>

      <div className="max-w-3xl text-lg leading-relaxed">
        <RichText value={studio?.body} />
      </div>

      {studio?.team && studio.team.length > 0 && (
        <section
          aria-labelledby="team-title"
          className="mt-20 border-t border-border pt-6 md:mt-28"
        >
          <Label as="h2" id="team-title" className="mb-10 text-muted">
            (Equipo)
          </Label>
          <ul className="grid gap-x-6 gap-y-12 sm:grid-cols-2 md:gap-x-10 lg:grid-cols-4">
            {studio.team.map((member) => (
              <li key={member._key}>
                <div className="relative aspect-[4/5] overflow-hidden bg-neutral-100">
                  <SanityImage
                    image={member.photo}
                    fill
                    sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
                    className="object-cover"
                  />
                </div>
                <p className="mt-4 text-base">{member.name}</p>
                {member.role && (
                  <Label className="mt-1 text-muted">{member.role}</Label>
                )}
              </li>
            ))}
          </ul>
        </section>
      )}
    </Container>
  );
}
