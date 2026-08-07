import { defineConfig } from "vite";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [tailwindcss()],
  build: {
    lib: {
      entry: "src/index.ts",
      formats: ["es"],
      fileName: "index",
    },
    rollupOptions: {
      // Keep Lit and all of its subpath imports external. The components use
      // directives such as `lit/directives/ref.js` and `style-map.js`; if Vite
      // bundles those files while leaving only `lit` external, the published
      // package contains two incompatible Lit runtimes and fails with
      // `currentDirective._$initialize is not a function` in consuming apps.
      external: [/^lit(?:\/.*)?$/, "shiki"],
    },
    // `tsc` runs before Vite and writes the public declaration files to dist.
    // Keep them when Vite writes the library bundle so the published package
    // remains usable from TypeScript and React projects.
    emptyOutDir: false,
  },
});
