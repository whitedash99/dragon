import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  {
    ignores: [
      ".next/**",
      "node_modules/**",
      "dist/**",
      "build/**",
      "coverage/**",
      ".turbo/**",
      ".vercel/**",
      "out/**",
      "tests/**",
      "scripts/**",
      "*.d.ts",
      "next-env.d.ts",
      "*.js",
      "*.mjs"
    ]
  },
  ...compat.extends("next/core-web-vitals"),
];

export default eslintConfig;
