import "server-only";

import { createHmac, timingSafeEqual } from "node:crypto";

/**
 * Token anti-spam del formulario: guarda cuándo se cargó el formulario,
 * firmado con HMAC para que no se pueda falsificar. Un envío demasiado
 * rápido (bot) o demasiado viejo se rechaza.
 */
const MIN_AGE_MS = 3_000;
const MAX_AGE_MS = 24 * 60 * 60 * 1_000;

function getSecret() {
  const secret = process.env.CONTACT_FORM_SECRET;
  if (!secret) throw new Error("Falta la variable CONTACT_FORM_SECRET");
  return secret;
}

function sign(value: string) {
  return createHmac("sha256", getSecret()).update(value).digest("hex");
}

export function createFormToken() {
  const issuedAt = Date.now().toString();
  return `${issuedAt}.${sign(issuedAt)}`;
}

export function isValidFormToken(token: string) {
  const [issuedAt, signature] = token.split(".");
  if (!issuedAt || !signature) return false;

  const expected = Buffer.from(sign(issuedAt), "hex");
  const received = Buffer.from(signature, "hex");
  if (
    expected.length !== received.length ||
    !timingSafeEqual(expected, received)
  ) {
    return false;
  }

  const age = Date.now() - Number(issuedAt);
  return age >= MIN_AGE_MS && age <= MAX_AGE_MS;
}
