"use server";

import { z } from "zod";

import { createFormToken, isValidFormToken } from "@/lib/form-token";
import { sendMail } from "@/lib/mail";
import { fallbackSiteTitle } from "@/lib/site";
import { sanityFetch } from "@/sanity/lib/fetch";
import { contactSettingsQuery } from "@/sanity/lib/queries";

import {
  contactSchema,
  type ContactField,
  type ContactFormState,
} from "./schema";

/** Lo pide el formulario al cargarse (la página es estática). */
export async function getFormToken() {
  return createFormToken();
}

export async function sendContactForm(
  _prevState: ContactFormState,
  formData: FormData,
): Promise<ContactFormState> {
  const raw = {
    name: String(formData.get("name") ?? ""),
    email: String(formData.get("email") ?? ""),
    phone: String(formData.get("phone") ?? ""),
    projectLocation: String(formData.get("projectLocation") ?? ""),
    message: String(formData.get("message") ?? ""),
  } satisfies Record<ContactField, string>;

  // Honeypot: campo oculto que una persona nunca completa. Si viene con
  // datos, es un bot: se responde "éxito" para no darle pistas.
  if (formData.get("website")) {
    return { status: "success", message: "¡Gracias! Recibimos tu mensaje." };
  }

  if (!isValidFormToken(String(formData.get("token") ?? ""))) {
    return {
      status: "error",
      message:
        "No pudimos validar el envío. Recargá la página e intentá de nuevo.",
      values: raw,
    };
  }

  const parsed = contactSchema.safeParse(raw);
  if (!parsed.success) {
    return {
      status: "error",
      message: "Revisá los campos marcados.",
      errors: z.flattenError(parsed.error).fieldErrors,
      values: raw,
    };
  }

  const { name, email, phone, projectLocation, message } = parsed.data;

  try {
    const settings = await sanityFetch({
      query: contactSettingsQuery,
      tags: ["settings"],
    });
    const to = settings?.contactFormRecipient ?? process.env.SMTP_USER;
    if (!to) throw new Error("No hay email destino para el formulario");

    await sendMail({
      to,
      replyTo: { name, address: email },
      subject: `Consulta web de ${name}`,
      fromName: `Web ${settings?.siteTitle ?? fallbackSiteTitle}`,
      text: [
        `Nombre: ${name}`,
        `Email: ${email}`,
        `Teléfono: ${phone || "-"}`,
        `Ubicación del proyecto: ${projectLocation || "-"}`,
        "",
        message,
      ].join("\n"),
    });
  } catch (error) {
    console.error("Error al enviar el formulario de contacto", error);
    return {
      status: "error",
      message:
        "No pudimos enviar el mensaje. Probá de nuevo más tarde o escribinos por email.",
      values: raw,
    };
  }

  return { status: "success", message: "¡Gracias! Recibimos tu mensaje." };
}
