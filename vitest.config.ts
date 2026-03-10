import * as path from "node:path";
import { defineConfig } from "vitest/config";

export default defineConfig({
  resolve: {
    alias: [
      {
        find: /^@t3tools\/contracts$/,
        replacement: path.resolve(
          import.meta.dirname,
          "./packages/contracts/src/index.ts",
        ),
      },
    ],
  },
  server: {
    host: "0.0.0.0",
    port: 5733,
  },
});

