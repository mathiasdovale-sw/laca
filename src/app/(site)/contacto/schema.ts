import { z } from "zod";

// Quita saltos de línea: estos campos van en encabezados del mail.
const singleLine = (value: string) => value.replace(/[\r\n]+/g, " ").trim();

export const contactSchema = z.object({
  name: z
    .string()
    .transform(singleLine)
    .pipe(
      z
        .string()
        .min(2, "Ingresá tu nombre.")
        .max(100, "El nombre es demasiado largo."),
    ),
  email: z.string().trim().pipe(z.email("Ingresá un email válido.")),
  phone: z
    .string()
    .trim()
    .max(40, "El teléfono es demasiado largo.")
    .regex(
      /^[\d\s+()-]*$/,
      "El teléfono solo puede tener números, espacios y + ( ) -.",
    ),
  projectLocation: z
    .string()
    .transform(singleLine)
    .pipe(z.string().max(150, "La ubicación es demasiado larga.")),
  message: z
    .string()
    .trim()
    .min(10, "El mensaje es demasiado corto.")
    .max(5000, "El mensaje es demasiado largo."),
});

export type ContactField = keyof z.infer<typeof contactSchema>;

export type ContactFormState = {
  status: "idle" | "success" | "error";
  message?: string;
  errors?: Partial<Record<ContactField, string[]>>;
  values?: Partial<Record<ContactField, string>>;
};
