import { loadEnvConfig } from "@next/env";
import { defineCliConfig } from "sanity/cli";

// La CLI de Sanity no lee .env.local por su cuenta: se cargan igual que en Next.
loadEnvConfig(process.cwd());

export default defineCliConfig({
  api: {
    projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
    dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  },
  schemaExtraction: {
    enforceRequiredFields: true,
  },
  typegen: {
    path: "./src/**/*.{ts,tsx}",
    schema: "schema.json",
    generates: "./src/sanity/types.ts",
  },
});
