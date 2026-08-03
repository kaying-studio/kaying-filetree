import { defineConfig } from "vite";
import tailwindcss from "@tailwindcss/vite";

/**
 * Demo 站点配置 — 用于构建 GitHub Pages 在线预览
 */
export default defineConfig({
  plugins: [tailwindcss()],
  base: "/kaying-filetree/",
  build: {
    outDir: "dist-demo",
    target: "es2022",
  },
});
