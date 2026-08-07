import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";

export default defineConfig([
  {
    ignores: [
      ".next/**",
      "node_modules/**",
      "dist/**",
      "build/**",
      "coverage/**",
      ".turbo/**",
      ".vercel/**",
      "out/**"
    ]
  },
  ...nextVitals,
  globalIgnores([".next/**", "out/**", "build/**", "lib/generated/**"]),
]);
