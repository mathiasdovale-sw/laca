"use client";

import { useActionState, useEffect, useState } from "react";

import { getFormToken, sendContactForm } from "@/app/(site)/contacto/actions";
import type {
  ContactField,
  ContactFormState,
} from "@/app/(site)/contacto/schema";

import { PillButton } from "./ui";

const initialState: ContactFormState = { status: "idle" };

const fields: {
  name: Exclude<ContactField, "message">;
  label: string;
  type?: string;
  required?: boolean;
  autoComplete?: string;
}[] = [
  { name: "name", label: "Nombre", required: true, autoComplete: "name" },
  {
    name: "email",
    label: "Email",
    type: "email",
    required: true,
    autoComplete: "email",
  },
  { name: "phone", label: "Teléfono", type: "tel", autoComplete: "tel" },
  { name: "projectLocation", label: "Ubicación del proyecto" },
];

// Campos con línea inferior y el texto de ayuda como placeholder; la
// etiqueta queda disponible para lectores de pantalla.
const inputClass =
  "w-full border-b border-white/40 bg-transparent py-3 text-base text-white placeholder:text-white/50 focus:border-white focus:outline-none aria-[invalid=true]:border-red-400";

export function ContactForm() {
  const [state, formAction, pending] = useActionState(
    sendContactForm,
    initialState,
  );
  const [token, setToken] = useState("");

  // Token anti-spam: se pide al cargar y se renueva después de cada envío.
  useEffect(() => {
    getFormToken().then(setToken);
  }, [state]);

  if (state.status === "success") {
    return (
      <p role="status" className="text-lg">
        {state.message}
      </p>
    );
  }

  return (
    <form action={formAction} noValidate>
      <div className="grid gap-x-6 gap-y-6 sm:grid-cols-2">
        {fields.map((field) => (
          <div key={field.name}>
            <label htmlFor={field.name} className="sr-only">
              {field.label}
              {field.required ? "" : " (opcional)"}
            </label>
            <input
              id={field.name}
              name={field.name}
              type={field.type ?? "text"}
              placeholder={field.label}
              required={field.required}
              autoComplete={field.autoComplete}
              defaultValue={state.values?.[field.name]}
              aria-invalid={Boolean(state.errors?.[field.name])}
              aria-describedby={
                state.errors?.[field.name] ? `${field.name}-error` : undefined
              }
              className={inputClass}
            />
            <FieldError name={field.name} errors={state.errors?.[field.name]} />
          </div>
        ))}

        <div className="sm:col-span-2">
          <label htmlFor="message" className="sr-only">
            Contanos sobre tu proyecto
          </label>
          <textarea
            id="message"
            name="message"
            rows={6}
            placeholder="Contanos sobre tu proyecto"
            required
            defaultValue={state.values?.message}
            aria-invalid={Boolean(state.errors?.message)}
            aria-describedby={
              state.errors?.message ? "message-error" : undefined
            }
            className={`${inputClass} resize-none`}
          />
          <FieldError name="message" errors={state.errors?.message} />
        </div>
      </div>

      {/* Honeypot: oculto para personas, los bots lo completan. */}
      <div aria-hidden="true" className="absolute -left-[9999px]">
        <label htmlFor="website">No completar</label>
        <input
          id="website"
          name="website"
          type="text"
          tabIndex={-1}
          autoComplete="off"
        />
      </div>

      <input type="hidden" name="token" value={token} />

      {state.status === "error" && state.message && (
        <p role="alert" className="mt-6 text-sm text-red-300">
          {state.message}
        </p>
      )}

      <PillButton
        type="submit"
        variant="light"
        disabled={pending || !token}
        className="mt-10"
      >
        {pending ? "Enviando…" : "Enviar"}
      </PillButton>
    </form>
  );
}

function FieldError({ name, errors }: { name: string; errors?: string[] }) {
  if (!errors?.length) return null;
  return (
    <p id={`${name}-error`} className="mt-2 text-sm text-red-300">
      {errors[0]}
    </p>
  );
}
