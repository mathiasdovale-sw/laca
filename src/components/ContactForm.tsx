"use client";

import { useActionState, useEffect, useState } from "react";

import { getFormToken, sendContactForm } from "@/app/(site)/contacto/actions";
import type {
  ContactField,
  ContactFormState,
} from "@/app/(site)/contacto/schema";

const initialState: ContactFormState = { status: "idle" };

const fields: {
  name: ContactField;
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
  {
    name: "phone",
    label: "Teléfono (opcional)",
    type: "tel",
    autoComplete: "tel",
  },
  { name: "subject", label: "Asunto", required: true },
];

const inputClass =
  "border-border w-full border px-3 py-2 focus:border-neutral-500 focus:outline-none";

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
    return <p role="status">{state.message}</p>;
  }

  return (
    <form action={formAction} className="max-w-xl space-y-5" noValidate>
      {fields.map((field) => (
        <div key={field.name}>
          <label htmlFor={field.name} className="mb-1 block text-sm">
            {field.label}
          </label>
          <input
            id={field.name}
            name={field.name}
            type={field.type ?? "text"}
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

      <div>
        <label htmlFor="message" className="mb-1 block text-sm">
          Mensaje
        </label>
        <textarea
          id="message"
          name="message"
          rows={6}
          required
          defaultValue={state.values?.message}
          aria-invalid={Boolean(state.errors?.message)}
          aria-describedby={state.errors?.message ? "message-error" : undefined}
          className={inputClass}
        />
        <FieldError name="message" errors={state.errors?.message} />
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
        <p role="alert" className="text-sm text-red-700">
          {state.message}
        </p>
      )}

      <button
        type="submit"
        disabled={pending || !token}
        className="bg-foreground px-5 py-2 text-white disabled:opacity-50"
      >
        {pending ? "Enviando…" : "Enviar"}
      </button>
    </form>
  );
}

function FieldError({ name, errors }: { name: string; errors?: string[] }) {
  if (!errors?.length) return null;
  return (
    <p id={`${name}-error`} className="mt-1 text-sm text-red-700">
      {errors[0]}
    </p>
  );
}
