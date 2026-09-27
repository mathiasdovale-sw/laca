import type { Metadata } from "next";

import { Container } from "@/components/Container";
import { RichText } from "@/components/RichText";
import { SanityImage } from "@/components/SanityImage";
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
    <Container className="py-12">
      <h1 className="mb-8 text-2xl font-semibold">
        {studio?.title ?? "Estudio"}
      </h1>

      <div className="max-w-2xl">
        <RichText value={studio?.body} />
      </div>

      {studio?.team && studio.team.length > 0 && (
        <section className="mt-16">
          <h2 className="mb-6 text-sm tracking-wide text-muted uppercase">
            Equipo
          </h2>
          <ul className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {studio.team.map((member) => (
              <li key={member._key}>
                <div className="relative aspect-[3/4] overflow-hidden bg-neutral-100">
                  <SanityImage
                    image={member.photo}
                    fill
                    sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
                    className="object-cover"
                  />
                </div>
                <p className="mt-3 font-medium">{member.name}</p>
                {member.role && (
                  <p className="text-sm text-muted">{member.role}</p>
                )}
              </li>
            ))}
          </ul>
        </section>
      )}
    </Container>
  );
}
