# Estudio LACA — sitio web

Sitio institucional del estudio. El front es un **template neutro** (tipografía del sistema, grises) pensado para rediseñarse.

- **Next.js 16** (App Router, TypeScript) + **Tailwind CSS 4**
- **Sanity 6** como CMS, con el Studio embebido en `/studio` (vía `next-sanity`)
- Todo el sitio es **estático** y se actualiza **on-demand** con un webhook de Sanity
- Formulario de contacto con **nodemailer** por el SMTP de **Google Workspace**
- Deploy en **Vercel**

---

## Índice

1. [Requisitos](#requisitos)
2. [Correr en local](#correr-en-local)
3. [Variables de entorno](#variables-de-entorno)
4. [Studio (CMS)](#studio-cms)
5. [Webhook de revalidación](#webhook-de-revalidación)
6. [Formulario de contacto (SMTP)](#formulario-de-contacto-smtp)
7. [Imágenes](#imágenes)
8. [Deploy en Vercel](#deploy-en-vercel)
9. [Scripts](#scripts)
10. [Estructura del proyecto](#estructura-del-proyecto)
11. [Notas de versiones](#notas-de-versiones)

---

## Requisitos

- **Node.js 24 LTS** (mínimo 22.12, lo exige Sanity)
- npm 11 o superior
- Acceso al proyecto de Sanity `0s201lcl`

## Correr en local

```bash
npm install
cp .env.example .env.local     # y completar los valores (ver abajo)
npm run dev
```

- Sitio: <http://localhost:3000>
- Studio: <http://localhost:3000/studio>

La primera vez, para que el Studio funcione en `localhost` hay que autorizar ese origen en Sanity (ver [Studio → CORS](#cors)).

### Contenido de ejemplo

```bash
npx sanity login    # una sola vez, abre el navegador
npm run seed
```

Carga 2 categorías, 3 proyectos con imágenes placeholder, la página Estudio, Inicio y Configuración con datos de contacto inventados. Se puede volver a correr: reemplaza los mismos documentos sin duplicarlos. **Ojo**: si ya editaste esos documentos en el Studio, los sobrescribe.

El script escribe directo en el dataset (no pasa por el webhook): si ya habías levantado el sitio antes, borrá `.next/cache` para verlo.

> Ya se corrió una vez en `production` (27/09/2026). No hace falta repetirlo.

## Variables de entorno

Están todas documentadas en [.env.example](.env.example). En local van en `.env.local` (no se sube a git); en Vercel, en _Project Settings → Environment Variables_.

| Variable                        | Para qué                                   | Secreta |
| ------------------------------- | ------------------------------------------ | ------- |
| `NEXT_PUBLIC_SITE_URL`          | URL pública (sitemap, robots, Open Graph)  | No      |
| `NEXT_PUBLIC_SANITY_PROJECT_ID` | ID del proyecto de Sanity (`0s201lcl`)     | No      |
| `NEXT_PUBLIC_SANITY_DATASET`    | Dataset (`production`)                     | No      |
| `SANITY_REVALIDATE_SECRET`      | Secret compartido con el webhook de Sanity | **Sí**  |
| `SMTP_HOST`                     | `smtp.gmail.com`                           | No      |
| `SMTP_PORT`                     | `465` (SSL) o `587` (STARTTLS)             | No      |
| `SMTP_USER`                     | Cuenta que envía: `alamas@estudiolaca.com` | No      |
| `SMTP_PASSWORD`                 | Contraseña de aplicación de esa cuenta     | **Sí**  |
| `CONTACT_FORM_SECRET`           | Firma el token anti-spam del formulario    | **Sí**  |

Para generar un secret:

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

## Studio (CMS)

Se entra en `/studio` (en producción: `https://estudiolaca.com/studio`) con una cuenta de Sanity invitada al proyecto. La interfaz está en español.

| Sección           | Qué es                                                                                                |
| ----------------- | ----------------------------------------------------------------------------------------------------- |
| **Inicio**        | Documento único: texto de presentación y proyectos destacados.                                        |
| **Proyectos**     | Lista ordenable arrastrando. El orden se usa en `/proyectos`.                                         |
| **Categorías**    | Tipologías que se asignan a los proyectos (se pueden crear, renombrar y borrar si no están en uso).   |
| **Estudio**       | Documento único: texto e integrantes del equipo.                                                      |
| **Configuración** | Documento único: nombre del sitio, contacto, redes y el email que recibe los mensajes del formulario. |

Todas las imágenes piden **texto alternativo obligatorio**. Cada documento tiene un bloque **SEO** opcional; si queda vacío se usan el título, el texto y la imagen principal.

> Si en el menú _Proyectos_ el orden aparece vacío la primera vez, usar el menú `⋮` → **Reset Order**.

### Invitar a quien edita

<https://www.sanity.io/manage> → proyecto → **Members** → _Invite_. Para alguien que solo carga contenido alcanza con el rol **Editor**.

### CORS

El Studio corre en el navegador y llama a la API de Sanity, así que cada dominio donde se abre tiene que estar autorizado:

```bash
npx sanity cors add http://localhost:3000 --credentials
npx sanity cors add https://estudiolaca.com --credentials
```

O desde <https://www.sanity.io/manage> → proyecto → **API** → **CORS origins** → _Add CORS origin_, tildando **Allow credentials**. Si usás las URLs de preview de Vercel (`*.vercel.app`) y querés abrir el Studio ahí, agregá también ese dominio.

### Tipos de TypeScript

Los tipos de las consultas se generan desde el esquema. Después de cambiar un esquema o una query en `src/sanity/lib/queries.ts`:

```bash
npm run typegen
```

## Webhook de revalidación

Las páginas se generan en el build y quedan cacheadas **sin vencimiento**. Cuando alguien publica en el Studio, Sanity avisa a `/api/revalidate`, que invalida solo las páginas afectadas (por tipo de documento: `project`, `category`, `home`, `studio`, `settings`). La siguiente visita ya ve el contenido nuevo.

### Configurarlo en Sanity

1. Entrá a <https://www.sanity.io/manage> → proyecto → **API** → **Webhooks** → **Create webhook**.
2. Completá:

   | Campo       | Valor                                                            |
   | ----------- | ---------------------------------------------------------------- |
   | Name        | `Revalidar sitio`                                                |
   | URL         | `https://estudiolaca.com/api/revalidate`                         |
   | Dataset     | `production`                                                     |
   | Trigger on  | ✅ Create ✅ Update ✅ Delete                                    |
   | Filter      | `_type in ["project", "category", "home", "studio", "settings"]` |
   | Projection  | `{_type}`                                                        |
   | Status      | ✅ Enable webhook                                                |
   | HTTP method | `POST`                                                           |
   | API version | la más reciente                                                  |
   | Drafts      | ❌ (sin tildar: solo contenido publicado)                        |
   | Secret      | el mismo valor que `SANITY_REVALIDATE_SECRET`                    |

3. Guardar. Para probarlo: publicá un cambio y mirá la pestaña **Attempts log** del webhook (tiene que responder `200`).

El webhook tiene que apuntar al dominio de producción ya deployado; en local no se puede recibir.

### Si un cambio no aparece en el sitio

La caché de datos **no se borra con un build ni con un deploy nuevo** (Vercel la conserva entre deploys a propósito). Si un cambio publicado no aparece:

1. Revisá el **Attempts log** del webhook en Sanity: tiene que haber un intento con respuesta `200`. Un `401` significa que el secret no coincide con `SANITY_REVALIDATE_SECRET`.
2. Volvé a publicar el documento (cualquier cambio mínimo): dispara el webhook de nuevo.
3. Último recurso, en Vercel: proyecto → **CDN** → **Caches** → _Purge cache_ → **All content** → capa **Runtime and Data Cache** → _Purge_. Ojo: en Hobby y Pro la caché es compartida por todos los proyectos del equipo en ese entorno.

En local pasa lo mismo: si ves datos viejos, borrá la carpeta `.next/cache` y volvé a correr `npm run dev` o `npm run build`.

## Formulario de contacto (SMTP)

El formulario (`/contacto`) envía con un **server action**: no expone un endpoint propio y valida todo del lado del servidor con zod.

- **Campos:** nombre, email, teléfono (opcional), asunto y mensaje.
- **Destinatario:** el email configurado en _Configuración → Formulario_.
- **Remitente:** `SMTP_USER`.
- **Responder:** "Responder" contesta directo a quien escribió (`Reply-To`).

**Anti-spam** (sin servicios externos):

- **Honeypot**: un campo oculto que las personas no ven; si viene completo, se descarta en silencio.
- **Token firmado**: al cargar el formulario se pide un token con la hora firmada con HMAC (`CONTACT_FORM_SECRET`). Se rechazan envíos de menos de 3 segundos o de más de 24 horas. Esto implica que el formulario necesita JavaScript habilitado.
- **Validación en el servidor** de todos los campos y límites de largo.

No hay límite de envíos por IP: hacerlo bien en serverless requiere un almacenamiento externo (Redis, etc.).

### Qué credencial hace falta en Google Workspace

Desde mayo de 2025 Google Workspace ya **no acepta la contraseña normal** de la cuenta en apps de terceros. Para `smtp.gmail.com` la opción documentada es una **contraseña de aplicación**: una clave de 16 caracteres, generada por Google, que solo sirve para esa app y se puede revocar sin tocar la contraseña real.

**Requisitos:**

1. Que el administrador de Workspace permita la verificación en 2 pasos: _Consola de administración_ (<https://admin.google.com>) → **Seguridad** → **Autenticación** → **Verificación en 2 pasos** → _Permitir que los usuarios activen la verificación en 2 pasos_.
2. Que la cuenta `alamas@estudiolaca.com` tenga la **verificación en 2 pasos activada** (<https://myaccount.google.com/signinoptions/twosv>), y no solo con llaves de seguridad.
3. Que la cuenta no tenga la _Protección avanzada_ activada.

**Crear la contraseña:** con la sesión de `alamas@estudiolaca.com` iniciada, ir a <https://myaccount.google.com/apppasswords>, ponerle un nombre (ej. "Web estudiolaca.com") y copiar la clave. Va **sin espacios** en `SMTP_PASSWORD`. Si esa página dice que la opción no está disponible, falta alguno de los requisitos de arriba.

**Límites:** unos 2.000 mensajes por día por cuenta (sobra para un formulario).

**Si cambia la contraseña de la cuenta**, Google revoca las contraseñas de aplicación: hay que generar una nueva y actualizarla en Vercel.

> **Alternativa sin contraseña de aplicación:** OAuth2 con una _cuenta de servicio_ con delegación de dominio (nodemailer lo soporta). Es más robusto (no depende de la contraseña ni del 2FA de una persona) pero requiere configurar Google Cloud y la consola de administración. Se puede migrar después sin tocar el formulario, solo `src/lib/mail.ts`.

### DNS (Squarespace)

El dominio está en Squarespace, pero **para enviar por SMTP no hace falta tocar DNS**: la autenticación es con la cuenta de Google. Lo que sí importa es la **entregabilidad** (que no caiga en spam). Si el dominio ya usa Gmail para su correo, probablemente esto ya esté hecho. Verificá en Squarespace → **Dominios** → `estudiolaca.com` → **Configuración DNS** que existan:

| Tipo | Host                | Valor                                                                                                                                                |
| ---- | ------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------- |
| MX   | `@`                 | los de Google Workspace (normalmente ya están si el correo funciona)                                                                                 |
| TXT  | `@`                 | `v=spf1 include:_spf.google.com ~all` (SPF — un solo registro SPF por dominio)                                                                       |
| TXT  | `google._domainkey` | la clave DKIM que se genera en _Consola de administración_ → **Aplicaciones** → **Google Workspace** → **Gmail** → **Autenticar correo electrónico** |
| TXT  | `_dmarc`            | ej. `v=DMARC1; p=none; rua=mailto:alamas@estudiolaca.com` (DMARC)                                                                                    |

## Imágenes

Las imágenes se suben a Sanity y se muestran con `next/image`, que **las optimiza Vercel** (redimensiona y convierte a WebP). Configuración en [next.config.ts](next.config.ts).

El plan **Hobby** incluye **5.000 transformaciones por mes**. Cada combinación imagen × ancho cuenta una vez y queda cacheada 31 días. Para no pasarse:

- Hay pocos anchos definidos (`deviceSizes: [640, 1080, 1920, 2560]`, `imageSizes: [384]`), un solo formato (WebP) y una sola calidad (75).
- Las imágenes para compartir en redes (Open Graph) salen directo del CDN de Sanity y no cuentan.
- `remotePatterns` solo acepta imágenes de este proyecto de Sanity y con exactamente `?w=2560&fit=max`. Así nadie puede pedir variantes arbitrarias de una imagen para agotar el cupo.

**Recorte y punto de interés:** por la restricción anterior, el **recorte** (crop) que se haga en el Studio **no se aplica**. El **punto de interés** (hotspot) sí: define qué parte de la imagen queda visible en las miniaturas (`object-position`). Si en el futuro se quiere el recorte, hay que permitir cualquier parámetro en `remotePatterns` (quitando `search`), asumiendo el riesgo de abuso del cupo.

Si se supera el límite, las imágenes **nuevas** dejan de optimizarse (las ya cacheadas siguen funcionando) hasta el mes siguiente. Se puede ver el consumo en Vercel → **Usage** → _Image Optimization_.

**No se aloja video** ni en Vercel ni en Sanity. Si en el futuro hace falta, embeberlo desde YouTube o Vimeo.

## Deploy en Vercel

> **Importante:** según los términos de Vercel, el plan **Hobby es solo para uso personal y no comercial**. Un sitio de un estudio de arquitectura es uso comercial, así que en rigor corresponde el plan **Pro**. Conviene confirmarlo antes de publicar.

1. En <https://vercel.com/new> importar el repo `mathiasdovale-sw/laca`. Vercel detecta Next.js solo.
2. En **Environment Variables** cargar todas las de [.env.example](.env.example), con `NEXT_PUBLIC_SITE_URL=https://estudiolaca.com`.
3. **Deploy**.
4. **Dominio:** en el proyecto → **Settings** → **Domains** → agregar `estudiolaca.com` (y `www.estudiolaca.com`, redirigiendo a uno de los dos). Vercel muestra los registros DNS a crear. Se cargan en Squarespace → **Dominios** → **Configuración DNS**. Ojo con no borrar los registros de correo (MX, SPF, DKIM).
5. En Sanity: agregar `https://estudiolaca.com` a **CORS** (ver [CORS](#cors)) y crear el **webhook** (ver [Webhook](#webhook-de-revalidación)).
6. Probar: publicar un cambio en `/studio` y ver que se refleje en el sitio, y enviar un mensaje de prueba desde `/contacto`.

Cada push a `main` genera un deploy nuevo. El contenido **no** depende de los deploys: se actualiza con el webhook (ver [Si un cambio no aparece](#si-un-cambio-no-aparece-en-el-sitio)).

## Scripts

| Comando                | Qué hace                                                    |
| ---------------------- | ----------------------------------------------------------- |
| `npm run dev`          | Servidor de desarrollo                                      |
| `npm run build`        | Build de producción                                         |
| `npm run start`        | Sirve el build de producción                                |
| `npm run lint`         | ESLint                                                      |
| `npm run typecheck`    | Chequeo de tipos                                            |
| `npm run format`       | Formatea todo con Prettier                                  |
| `npm run format:check` | Verifica el formato sin modificar                           |
| `npm run typegen`      | Regenera los tipos de Sanity (`src/sanity/types.ts`)        |
| `npm run seed`         | Carga el contenido de ejemplo (requiere `npx sanity login`) |

## Estructura del proyecto

```
├─ sanity.config.ts          Configuración del Studio (plugins, esquemas, singletons)
├─ sanity.cli.ts             Configuración de la CLI de Sanity y TypeGen
├─ next.config.ts            Imágenes (Vercel)
├─ scripts/seed/             Contenido de ejemplo
└─ src/
   ├─ app/
   │  ├─ layout.tsx          Layout raíz (<html lang="es">)
   │  ├─ (site)/             Sitio público: header, footer y estilos
   │  │  ├─ page.tsx         Inicio
   │  │  ├─ proyectos/       Listado y detalle ([slug])
   │  │  ├─ estudio/
   │  │  └─ contacto/        Página, server action y validación (zod)
   │  ├─ studio/             Studio de Sanity en /studio
   │  ├─ api/revalidate/     Webhook de Sanity
   │  ├─ not-found.tsx       Página 404
   │  ├─ sitemap.ts
   │  ├─ robots.ts
   │  └─ globals.css         Tailwind + colores base
   ├─ components/            Header, Footer, SanityImage, RichText, ProjectCard, ContactForm…
   ├─ lib/                   metadata (SEO), mail (SMTP), form-token (anti-spam), site (URL y navegación)
   └─ sanity/
      ├─ env.ts              projectId, dataset, apiVersion
      ├─ structure.ts        Menú del Studio
      ├─ types.ts            Tipos generados (no editar a mano)
      ├─ lib/                client, fetch (caché con tags), image, queries (GROQ)
      └─ schemaTypes/        Esquemas: documents/ y objects/
```

**Para rediseñar**: los colores base están en `src/app/globals.css` (`@theme`), el layout general en `src/app/(site)/layout.tsx` y los componentes en `src/components/`.

## Notas de versiones

Se usan las últimas versiones estables, salvo:

- **ESLint 9** (no 10): los plugins que usa `eslint-config-next` (react, import, jsx-a11y) todavía no declaran soporte para ESLint 10.
- **TypeScript 6** (no 7): `typescript-eslint` todavía no soporta TypeScript 7 (su API de JavaScript no está disponible).

Cuando esos paquetes se actualicen, se puede subir de versión.
