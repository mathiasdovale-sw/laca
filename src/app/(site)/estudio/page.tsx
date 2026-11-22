import type { Metadata } from "next";

import { Container } from "@/components/Container";
import { Reveal } from "@/components/Reveal";
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
  const team = studio?.team ?? [];
  // Con descripción: foto y texto lado a lado. Sin descripción: en grilla.
  const featured = team.filter((member) => member.bio);
  const others = team.filter((member) => !member.bio);
  const process = studio?.process ?? [];

  return (
    <Container className="pt-10 pb-20 md:pt-16 md:pb-28">
      <h1 className="mb-12 text-4xl tracking-tight md:mb-16 md:text-5xl">
        {studio?.title ?? "Estudio"}
      </h1>

      <div className="max-w-3xl text-lg leading-relaxed">
        <RichText value={studio?.body} />
      </div>

      {team.length > 0 && (
        <section
          aria-labelledby="team-title"
          className="mt-20 border-t border-border pt-6 md:mt-28"
        >
          <Label as="h2" id="team-title" className="mb-10 text-muted">
            (Equipo)
          </Label>

          {featured.length > 0 && (
            <ul className="space-y-16 md:space-y-24">
              {featured.map((member) => (
                <li
                  key={member._key}
                  className="grid gap-8 md:grid-cols-[5fr_7fr] md:items-center md:gap-16"
                >
                  <div className="relative aspect-[4/5] overflow-hidden bg-neutral-100">
                    <SanityImage
                      image={member.photo}
                      fill
                      sizes="(min-width: 768px) 40vw, 100vw"
                      className="object-cover"
                    />
                  </div>
                  <div className="max-w-xl">
                    <p className="text-2xl tracking-tight md:text-3xl">
                      {member.name}
                    </p>
                    {member.role && (
                      <Label className="mt-2 text-muted">{member.role}</Label>
                    )}
                    <div className="mt-8 space-y-4 text-lg leading-relaxed">
                      {paragraphs(member.bio).map((text, i) => (
                        <p key={i}>{text}</p>
                      ))}
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}

          {others.length > 0 && (
            <ul
              className={`grid gap-x-6 gap-y-12 sm:grid-cols-2 md:gap-x-10 lg:grid-cols-4 ${
                featured.length > 0 ? "mt-16 md:mt-24" : ""
              }`}
            >
              {others.map((member) => (
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
          )}
        </section>
      )}

      {process.length > 0 && (
        <section
          aria-labelledby="process-title"
          className="mt-20 border-t border-border pt-6 md:mt-28"
        >
          <Label as="h2" id="process-title" className="mb-4 text-muted">
            ({studio?.processTitle ?? "Cómo trabajamos"})
          </Label>

          <ol>
            {process.map((step, i) => (
              <li
                key={step._key}
                className="grid gap-4 border-b border-border py-10 last:border-b-0 md:grid-cols-[5fr_7fr] md:gap-16 md:py-14"
              >
                <Reveal>
                  <h3 className="text-2xl tracking-tight md:text-3xl">
                    <span className="text-muted tabular-nums">
                      {String(i + 1).padStart(2, "0")} —
                    </span>{" "}
                    {step.title}
                  </h3>
                </Reveal>
                <Reveal delay={120} className="max-w-xl">
                  <div className="space-y-4 leading-relaxed text-foreground/80 md:text-lg">
                    {paragraphs(step.text).map((text, j) => (
                      <p key={j}>{text}</p>
                    ))}
                  </div>
                </Reveal>
              </li>
            ))}
          </ol>
        </section>
      )}
    </Container>
  );
}

/** Separa un texto plano en párrafos por las líneas en blanco. */
function paragraphs(text: string | null | undefined) {
  return (text ?? "")
    .split(/\n\s*\n/)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean);
}
