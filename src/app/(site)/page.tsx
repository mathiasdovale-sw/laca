import type { Metadata } from "next";
import { PortableText } from "next-sanity";

import { Container } from "@/components/Container";
import { HeroCarousel } from "@/components/HeroCarousel";
import { ProjectGrid } from "@/components/ProjectCard";
import { toBlocks } from "@/components/RichText";
import { SanityImage } from "@/components/SanityImage";
import { Label, PillLink } from "@/components/ui";
import { buildMetadata } from "@/lib/metadata";
import { fallbackSiteTitle } from "@/lib/site";
import { sanityFetch } from "@/sanity/lib/fetch";
import { homeQuery } from "@/sanity/lib/queries";

async function getHome() {
  return sanityFetch({ query: homeQuery, tags: ["home", "project"] });
}

export async function generateMetadata(): Promise<Metadata> {
  const home = await getHome();
  return buildMetadata({ seo: home?.seo, description: home?.intro, path: "/" });
}

export default async function HomePage() {
  const home = await getHome();
  const heroProjects =
    home?.heroProjects?.filter((project) => project !== null) ?? [];
  const featuredProjects =
    home?.featuredProjects?.filter((project) => project !== null) ?? [];

  return (
    <>
      <h1 className="sr-only">{fallbackSiteTitle}</h1>

      <HeroCarousel slides={heroProjects} />

      {home?.intro && home.intro.length > 0 && (
        <Container className="py-16 md:py-24">
          <div className="max-w-5xl text-lg leading-snug md:text-xl lg:text-[1.375rem] [&_strong]:font-semibold">
            <PortableText value={toBlocks(home.intro)} />
          </div>
        </Container>
      )}

      {featuredProjects.length > 0 && (
        <Container className="pb-20 md:pb-28">
          <h2 className="sr-only">Proyectos destacados</h2>
          <ProjectGrid projects={featuredProjects} />
        </Container>
      )}

      {(home?.studioHeading || home?.studioText || home?.studioImage) && (
        <Container className="pb-20 md:pb-28">
          <section
            aria-labelledby="home-studio"
            className="border-t border-border pt-6"
          >
            <Label as="h2" id="home-studio" className="text-muted">
              (El estudio)
            </Label>

            <p className="mt-4 max-w-4xl text-2xl leading-tight tracking-tight md:text-[2rem]">
              {home.studioHeading}{" "}
              <span className="text-muted">{home.studioText}</span>
            </p>

            <div className="mt-12 grid items-center gap-10 md:mt-16 md:grid-cols-[4fr_3fr]">
              {home.studioImage && (
                <div className="relative aspect-[4/3] overflow-hidden bg-neutral-100">
                  <SanityImage
                    image={home.studioImage}
                    fill
                    sizes="(min-width: 768px) 57vw, 100vw"
                    className="object-cover"
                  />
                </div>
              )}
              <div className="md:flex md:justify-center">
                <PillLink href="/estudio">Conocé el estudio</PillLink>
              </div>
            </div>
          </section>
        </Container>
      )}
    </>
  );
}
