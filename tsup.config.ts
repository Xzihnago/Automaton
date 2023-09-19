import { defineConfig } from "tsup";

export default defineConfig({
  format: "esm",
  entry: ["src/index.ts"],
  outDir: "build",
  clean: true,
  sourcemap: false,
  minify: true,
  treeshake: true,
});
