// Fecha fija de la versión de la API de Sanity. Cambiarla solo a propósito:
// https://www.sanity.io/docs/api-versioning
export const apiVersion = "2026-09-27";

// Las variables se leen de forma literal para que Next las incluya también
// en el bundle del Studio (que corre en el navegador).
export const projectId = assertValue(
  process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  "Falta la variable de entorno NEXT_PUBLIC_SANITY_PROJECT_ID",
);

export const dataset = assertValue(
  process.env.NEXT_PUBLIC_SANITY_DATASET,
  "Falta la variable de entorno NEXT_PUBLIC_SANITY_DATASET",
);

function assertValue<T>(value: T | undefined, errorMessage: string): T {
  if (value === undefined || value === "") {
    throw new Error(errorMessage);
  }
  return value;
}
