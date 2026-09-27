/**
 * Carga contenido de ejemplo en el dataset configurado en .env.local.
 *
 *   npx sanity login   (una sola vez)
 *   npm run seed
 *
 * Es idempotente: usa IDs fijos, así que correrlo de nuevo reemplaza los
 * mismos documentos en vez de duplicarlos. Las imágenes son placeholders
 * grises generados acá mismo.
 */
import { deflateSync, crc32 } from "node:zlib";

import { LexoRank } from "lexorank";
import type { IdentifiedSanityDocumentStub as SanityDocumentStub } from "next-sanity";
import { getCliClient } from "sanity/cli";

const client = getCliClient({ apiVersion: "2026-09-27" });

// ─── Placeholder PNG (gris liso con un marco más oscuro) ────────────────
function placeholderPng(width: number, height: number, shade: number) {
  const border = Math.round(Math.min(width, height) * 0.06);
  const row = Buffer.alloc(1 + width * 3);
  const rows: Buffer[] = [];
  for (let y = 0; y < height; y++) {
    row[0] = 0; // sin filtro
    for (let x = 0; x < width; x++) {
      const edge =
        x < border || y < border || x >= width - border || y >= height - border;
      const value = edge ? shade - 30 : shade;
      row.fill(value, 1 + x * 3, 4 + x * 3);
    }
    rows.push(Buffer.from(row));
  }

  const chunk = (type: string, data: Buffer) => {
    const length = Buffer.alloc(4);
    length.writeUInt32BE(data.length);
    const body = Buffer.concat([Buffer.from(type, "ascii"), data]);
    const crc = Buffer.alloc(4);
    crc.writeUInt32BE(crc32(body));
    return Buffer.concat([length, body, crc]);
  };

  const header = Buffer.alloc(13);
  header.writeUInt32BE(width, 0);
  header.writeUInt32BE(height, 4);
  header[8] = 8; // bits por canal
  header[9] = 2; // RGB

  return Buffer.concat([
    Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
    chunk("IHDR", header),
    chunk("IDAT", deflateSync(Buffer.concat(rows))),
    chunk("IEND", Buffer.alloc(0)),
  ]);
}

async function uploadImage(
  name: string,
  shade: number,
  alt: string,
  w = 1600,
  h = 1200,
) {
  const asset = await client.assets.upload(
    "image",
    placeholderPng(w, h, shade),
    {
      filename: `${name}.png`,
    },
  );
  return {
    _type: "imageWithAlt" as const,
    alt,
    asset: { _type: "reference" as const, _ref: asset._id },
  };
}

const block = (key: string, text: string, style = "normal") => ({
  _type: "block",
  _key: key,
  style,
  markDefs: [],
  children: [{ _type: "span", _key: `${key}s`, text, marks: [] }],
});

// ─── Contenido ──────────────────────────────────────────────────────────
async function main() {
  const { projectId, dataset } = client.config();
  console.log(`Cargando contenido de ejemplo en ${projectId}/${dataset}…`);

  const categories = [
    { _id: "category-vivienda", _type: "category", title: "Vivienda" },
    { _id: "category-comercial", _type: "category", title: "Comercial" },
  ];

  const projectsData = [
    {
      id: "project-casa-del-bosque",
      title: "Casa del Bosque",
      slug: "casa-del-bosque",
      category: "category-vivienda",
      location: "Pilar, Buenos Aires",
      year: 2023,
      area: 320,
      shade: 200,
    },
    {
      id: "project-local-palermo",
      title: "Local Palermo",
      slug: "local-palermo",
      category: "category-comercial",
      location: "Palermo, CABA",
      year: 2022,
      area: 85,
      shade: 180,
    },
    {
      id: "project-departamento-nunez",
      title: "Departamento Núñez",
      slug: "departamento-nunez",
      category: "category-vivienda",
      location: "Núñez, CABA",
      year: 2021,
      area: 110,
      shade: 160,
    },
  ];

  let rank = LexoRank.min();
  const projects = [];
  for (const p of projectsData) {
    rank = rank.genNext().genNext();
    const cover = await uploadImage(
      `${p.slug}-portada`,
      p.shade,
      `Portada de ${p.title}`,
    );
    const gallery = await Promise.all(
      [1, 2].map(async (n) => ({
        ...(await uploadImage(
          `${p.slug}-${n}`,
          p.shade - 20 * n,
          `${p.title}, imagen ${n}`,
        )),
        _key: `img${n}`,
      })),
    );
    projects.push({
      _id: p.id,
      _type: "project",
      orderRank: rank.toString(),
      title: p.title,
      slug: { _type: "slug", current: p.slug },
      category: { _type: "reference", _ref: p.category },
      location: p.location,
      year: p.year,
      area: p.area,
      coverImage: cover,
      gallery,
      description: [
        block(
          "d1",
          "Texto de ejemplo. Acá va la descripción del proyecto: el encargo, el terreno, las decisiones principales y los materiales.",
        ),
        block(
          "d2",
          "Segundo párrafo de ejemplo para ver cómo se comporta el texto largo en la página.",
        ),
      ],
    });
  }

  const teamPhotos = await Promise.all(
    [1, 2, 3].map((n) =>
      uploadImage(`equipo-${n}`, 190, `Retrato del integrante ${n}`, 900, 1200),
    ),
  );

  const studio = {
    _id: "studio",
    _type: "studio",
    title: "Estudio",
    body: [
      block(
        "s1",
        "Texto de ejemplo sobre el estudio: quiénes somos, cómo trabajamos y qué tipo de proyectos hacemos.",
      ),
      block("s2", "Otro párrafo de ejemplo para completar la página."),
    ],
    team: [
      { name: "Nombre Apellido", role: "Socio fundador" },
      { name: "Nombre Apellido", role: "Arquitecta" },
      { name: "Nombre Apellido", role: "Colaborador" },
    ].map((member, i) => ({
      _type: "teamMember",
      _key: `member${i + 1}`,
      ...member,
      photo: teamPhotos[i],
    })),
  };

  const projectRefs = projects.map((p) => ({
    _type: "reference",
    _ref: p._id,
    _key: p._id,
  }));

  const home = {
    _id: "home",
    _type: "home",
    heroProjects: projectRefs,
    intro: [
      {
        _type: "block",
        _key: "i1",
        style: "normal",
        markDefs: [],
        children: [
          { _type: "span", _key: "i1a", text: "En ", marks: [] },
          {
            _type: "span",
            _key: "i1b",
            text: "laca.estudio",
            marks: ["strong"],
          },
          {
            _type: "span",
            _key: "i1c",
            text: " concebimos la arquitectura como un proceso compartido que acompaña a nuestros clientes desde la concepción de una idea hasta su materialización final.",
            marks: [],
          },
        ],
      },
    ],
    featuredProjects: projectRefs,
    studioHeading: "Cada proyecto comienza escuchando.",
    studioText:
      "Interpretamos lo que necesitás y lo transformamos en espacios pensados para ser vividos, donde la arquitectura responde tanto a las personas como al lugar.",
    studioImage: await uploadImage(
      "estudio",
      175,
      "Interior de un proyecto del estudio",
    ),
  };

  // Datos de contacto inventados: reemplazarlos desde el Studio.
  const settings = {
    _id: "settings",
    _type: "settings",
    siteTitle: "laca.estudio",
    siteDescription: "Estudio de arquitectura en Buenos Aires.",
    email: "hola@estudiolaca.com",
    phone: "+54 11 5555-0000",
    address: "Av. Ejemplo 1234, Piso 5\nCABA, Buenos Aires",
    location: "Buenos Aires, Argentina",
    mapsUrl: "https://maps.google.com/?q=Buenos+Aires",
    instagram: "https://www.instagram.com/estudiolaca",
    linkedin: "https://www.linkedin.com/company/estudiolaca",
    contactTitle: "¿Tenés un proyecto en mente?",
    contactText:
      "Dejanos tus datos y nos pondremos en contacto con vos para conocer tu idea y acompañarte en todo el proceso.",
    contactFormRecipient: "alamas@estudiolaca.com",
  };

  const tx = client.transaction();
  const docs: SanityDocumentStub[] = [
    ...categories,
    ...projects,
    studio,
    home,
    settings,
  ];
  for (const doc of docs) {
    tx.createOrReplace(doc);
  }
  await tx.commit();

  console.log(
    "Listo: 2 categorías, 3 proyectos, Estudio, Inicio y Configuración.",
  );
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
