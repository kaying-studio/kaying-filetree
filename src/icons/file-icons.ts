/**
 * 文件图标系统 — 对标 ChatGPT Codex 的 file-tree-builtin-* SVG icons
 * 每个图标都是 16x16 viewBox 的 SVG path，使用 currentColor
 */

export type FileIconName =
  | "astro" | "babel" | "bash" | "biome" | "bootstrap" | "browserslist"
  | "bun" | "c" | "claude" | "codex" | "cpp" | "css" | "database" | "default"
  | "docker" | "eslint" | "font" | "git" | "go" | "graphql" | "html"
  | "image" | "javascript" | "json" | "lock" | "markdown" | "mcp" | "nextjs"
  | "npm" | "oxc" | "postcss" | "prettier" | "python" | "react"
  | "ruby" | "rust" | "sass" | "stylelint" | "svelte" | "svg" | "svgo"
  | "swift" | "table" | "tailwind" | "terraform" | "text" | "typescript"
  | "vite" | "vscode" | "vue" | "wasm" | "webpack" | "yarn" | "yml" | "zig" | "zip";

export type UiIconName =
  | "chevron" | "close" | "dot" | "ellipsis" | "file" | "lock" | "search";

/** 文件类型 SVG path 数据 (16x16 viewBox) */
export const fileIconPaths: Record<FileIconName, string> = {
  astro: "M8 1.5L5.5 14h1.2l.5-2.5h3.6L11.3 14h1.2L10 1.5H8zm.8 2.2l1.2 6.3H7.6l1.2-6.3h0z",
  babel: "M2 3v10h1.5V9h2.5l2 4H9.5l-2.1-4.2C8.3 8.4 9 7.5 9 6.3S8 4 6.5 4H2zm1.5 1.3h2.2c.8 0 1.3.5 1.3 1.2s-.5 1.2-1.3 1.2H3.5V4.3zM10 3v10h1.5V3H10zm3 0v10h1.5V3H13z",
  bash: "M1.5 2.5h13c.3 0 .5.2.5.5v10c0 .3-.2.5-.5.5h-13c-.3 0-.5-.2-.5-.5v-10c0-.3.2-.5.5-.5zM3 5v1h4V5H3zm5 0v1h5V5H8zM3 7v1h4V7H3zm5 0v1h5V7H8zM3 9v1h4V9H3zm5 0v1h5V9H8zM3 11v1h4v-1H3z",
  biome: "M8 1a7 7 0 100 14A7 7 0 008 1zm0 2a5 5 0 110 10A5 5 0 018 3zm0 2a3 3 0 100 6 3 3 0 000-6z",
  bootstrap: "M2 2v12h12V2H2zm6.5 2.5c1.5 0 2.5.8 2.5 2.1 0 .8-.4 1.4-1.1 1.7.9.3 1.4 1 1.4 2 0 1.4-1 2.2-2.8 2.2H5.5v-8h3zm-.3 1.2v1.8h.5c.6 0 1-.3 1-.9s-.4-.9-1-.9h-.5zm0 3v2h.6c.7 0 1.1-.3 1.1-.9 0-.7-.4-1.1-1.1-1.1h-.6z",
  browserslist: "M8 1a7 7 0 100 14A7 7 0 008 1zm0 2l1.5 4.5L14 8l-4.5 1.5L8 14l-1.5-4.5L2 8l4.5-1.5L8 3z",
  bun: "M8 1.5c-2 0-3.5.8-3.5 2v9c0 1.2 1.5 2 3.5 2s3.5-.8 3.5-2v-9c0-1.2-1.5-2-3.5-2zm0 1.5c1 0 2 .3 2 .8s-1 .7-2 .7-2-.3-2-.7 1-.8 2-.8zm0 8c1 0 2 .3 2 .7s-1 .8-2 .8-2-.3-2-.8 1-.7 2-.7z",
  c: "M9.5 4.5L8 6c-.5-.3-1-.5-1.5-.5-1.4 0-2.5 1.1-2.5 2.5S5.1 10.5 6.5 10.5c.5 0 1-.2 1.5-.5l1.5 1.5c-.9.6-1.9 1-3 1-2.8 0-5-2.2-5-5s2.2-5 5-5c1.1 0 2.1.4 3 1z",
  claude: "M8 2L4 5v6l4 3 4-3V5L8 2zm0 1.8L10.5 5 8 6.2 5.5 5 8 3.8zM4.5 6l3 1.2v4L4.5 10V6zm7 0v4l-3 1.2v-4L11.5 6z",
  codex: "M8 1.5L2 5v6l6 3.5L14 11V5L8 1.5zm0 1.7l4.5 2.6v5.4L8 13.3 3.5 9.7V4.3L8 3.2zM6 6l2 1 2-1-2-1-2 1z",
  cpp: "M9.5 4.5L8 6c-.5-.3-1-.5-1.5-.5-1.4 0-2.5 1.1-2.5 2.5S5.1 10.5 6.5 10.5c.5 0 1-.2 1.5-.5l1.5 1.5c-.9.6-1.9 1-3 1-2.8 0-5-2.2-5-5s2.2-5 5-5c1.1 0 2.1.4 3 1zm3-1l-1 1 .5.5-.5.5 1 1 .5-.5.5.5 1-1-.5-.5.5-.5-1-1-.5.5-.5-.5z",
  css: "M2 2l1 11 5 1.5L13 13l1-11H2zm9.5 3l-.2 2H5.5l.2 2h5.3l-.5 5-3 .8-3-.8-.2-2.5h1.5l.1 1 1.6.4 1.6-.4.2-2H4.7L4 2h8l-.5 3z",
  database: "M8 2C4.5 2 2 3 2 4.5v7C2 13 4.5 14 8 14s6-1 6-2.5v-7C14 3 11.5 2 8 2zm0 1.5c2.5 0 4.5.5 4.5 1S10.5 5.5 8 5.5s-4.5-.5-4.5-1S5.5 3.5 8 3.5zM3.5 6C4.7 6.6 6.3 7 8 7s3.3-.4 4.5-1v2c0 .5-2 1.5-4.5 1.5S3.5 8.5 3.5 8V6zm0 4c1.2.6 2.8 1 4.5 1s3.3-.4 4.5-1v1.5c0 .5-2 1.5-4.5 1.5S3.5 12 3.5 11.5V10z",
  default: "M3 1.5h6L13 5.5v9c0 .3-.2.5-.5.5h-9c-.3 0-.5-.2-.5-.5v-13zM9 2v3.5h3.5L9 2z",
  docker: "M2 9h2v2H2V9zm3 0h2v2H5V9zm3 0h2v2H8V9zm3 0h.5c1 0 1.5.5 1.5 1.5V11h-2V9zM5 6h2v2H5V6zm3 0h2v2H8V6zm-1.5-2L7 5v.5h.5V4zM3.5 5.5C3.5 4.7 4.2 4 5 4v1c-.3 0-.5.2-.5.5s.2.5.5.5v1c-.8 0-1.5-.7-1.5-1.5z M10 8.5c2.5 0 4-1 4-1l-.5-1s-1.5.5-3.5.5-3.5-.5-3.5-.5L6 7.5s1.5 1 4 1z",
  eslint: "M8 1L2 4.5v7L8 15l6-3.5v-7L8 1zm0 1.7l4.5 2.6v5.4L8 13.3 3.5 9.7V4.3L8 2.7zM8 5L5.5 6.5v3L8 11l2.5-1.5v-3L8 5z",
  font: "M2 3v2h1V4h4v8H5v1h6v-1H9V5h4v1h1V3H2zm6 1h0v8H8V4z",
  git: "M14.5 7.5L8.5 1.5c-.3-.3-.7-.3-1 0L6 3l1.5 1.5c.3-.1.6 0 .8.2.2.2.3.5.2.8l1.5 1.5c.3-.1.6 0 .8.2.3.3.3.8 0 1.1-.3.3-.8.3-1.1 0-.2-.2-.3-.5-.2-.8L7.5 6v3.8c.2.1.4.2.5.4.3.3.3.8 0 1.1-.3.3-.8.3-1.1 0-.3-.3-.3-.8 0-1.1.1-.1.3-.2.5-.2V6L6 4.5 2.5 8c-.3.3-.3.7 0 1l6 6c.3.3.7.3 1 0l5-5c.3-.3.3-.7 0-1z",
  go: "M5 4l-3 2 3 2v3l3-1.5L11 11V8l3-2-3-2v3L8 4.5 5 4zm3 4l-3 1.5L5 8l3-1.5L11 8l-3 1.5V8z M2 11h2v2H2v-2zm4 0h2v2H6v-2zm4 0h2v2h-2v-2zm4 0h0v2h-0v-2z",
  graphql: "M8 1L2 4.5v7L8 15l6-3.5v-7L8 1zm0 1.5l4.5 2.6v5.4L8 13.3 3.5 9.7V4.3L8 2.5zM8 5L4 7.2v2.6L8 12l4-2.2V7.2L8 5zm0 2c.6 0 1 .4 1 1s-.4 1-1 1-1-.4-1-1 .4-1 1-1zM4.5 7.5L6 8.4v1.8L4.5 9.3V7.5zm7 0v1.8L10 10.2V8.4l1.5-.9z",
  html: "M2 2l1 12 5 1.5L13 14l1-12H2zm10 3l-.2 2H5.5l.1 1.5h6l-.3 4-3 .8-3-.8-.2-2h1.5l.1 1 1.6.4 1.6-.4.2-2H4.7L4 2h8l-.5 3z",
  image: "M2 2.5h12c.3 0 .5.2.5.5v10c0 .3-.2.5-.5.5H2c-.3 0-.5-.2-.5-.5v-10c0-.3.2-.5.5-.5zM3.5 4v6l2-2 1.5 1.5L9.5 7l3 3V4h-9zm1 1.5a1 1 0 100 2 1 1 0 000-2z",
  javascript: "M2 2h12v12H2V2zm6.5 6.5c0-1-.5-1.5-1.5-1.5s-1.5.5-1.5 1.5.5 1.5 1.5 1.5 1.5-.5 1.5-1.5zm4 0c0-1-.5-1.5-1.5-1.5s-1.5.5-1.5 1.5.5 1.5 1.5 1.5 1.5-.5 1.5-1.5z M8 10v2c0 .5.3 1 1 1h1",
  json: "M4 2c-1 0-2 1-2 2v1c0 .5-.5 1-1 1v1c.5 0 1 .5 1 1v1c0 1 1 2 2 2h.5v-1.5H4c-.3 0-.5-.2-.5-.5V8c0-.5-.3-1-.8-1.5.5-.5.8-1 .8-1.5V3.5c0-.3.2-.5.5-.5H4.5V2H4zm8 0c1 0 2 1 2 2v1c0 .5.5 1 1 1v1c-.5 0-1 .5-1 1v1c0 1-1 2-2 2h-.5v-1.5h.5c.3 0 .5-.2.5-.5V8c0-.5.3-1 .8-1.5-.5-.5-.8-1-.8-1.5V3.5c0-.3-.2-.5-.5-.5h-.5V2h.5z M6 5h4v6H6V5zm0 0h4v1H6V5zm0 2h4v1H6V7zm0 2h4v1H6V9z",
  lock: "M4 7V5a4 4 0 018 0v2h1v7H3V7h1zm1 0h6V5a3 3 0 00-6 0v2z",
  markdown: "M2 3v10h12V3H2zm2 2h1.5v4L7 7l1.5 2V5H10v6H8.5L7 9l-1.5 2H4V5zm7 0h1.5l1 1.5L15.5 5H17v6h-1.5V7L14 8.5 12.5 7v4H11V5z",
  mcp: "M8 1.5L3 4.5v7L8 14.5l5-3v-7L8 1.5zm0 1.7l3.5 2v5.6L8 12.8 4.5 10.8V5.2L8 3.2zM6 6h4v4H6V6zm0 0h1v4H6V6zm3 0h1v4H9V6z",
  nextjs: "M8 1a7 7 0 100 14A7 7 0 008 1zm0 1.5a5.5 5.5 0 110 11 5.5 5.5 0 010-11zM5 5v6h1V7l4 4h1V5h-1v4L6 5H5z",
  npm: "M2 4v8h12V4H2zm1 1h10v6h-3V6h-1v5H8V6H7v5H5V6H4v5H3V5z",
  oxc: "M8 2L3 5v6l5 3 5-3V5L8 2zm0 1.5l3.5 2v5L8 12.5l-3.5-2v-5L8 3.5zM6 6l2 1 2-1-2-1-2 1z",
  postcss: "M8 2C5 2 3 4 3 7c0 2 1 3 2 4 .5.5 1 1 1 1.5 0 .5-.5 1-1 1s-1-.5-1-1H3c0 1.5 1 2.5 2.5 2.5S8 14 8 12.5 7 10 6 9C5 8 4 7.5 4 6.5 4 5 5 4 7 4s3 1 3 2.5c0 1-.5 1.5-1 2 0 0 1.5 0 2 0 .5-1 1-1.5 1-2.5C12 3 10 2 8 2z",
  prettier: "M3 2v12h2V2H3zm3 0v2h2V2H6zm3 0v2h2V2H9zm3 0v12h2V2h-2zM6 5v2h2V5H6zm0 3v2h2V8H6zm0 3v2h2v-2H6z",
  python: "M8 2C6 2 5 3 5 4v2h3V5H5c0-1 1-1.5 3-1.5S11 4 11 5v2c0 1-1 1.5-3 1.5S5 9 5 10v2c0 1 1 2 3 2s3-1 3-2v-2H8v1h3c0 1-1 1.5-3 1.5S5 12 5 11V9c0-1 1-1.5 3-1.5S11 7 11 6V4c0-1-1-2-3-2z",
  react: "M8 6a2 2 0 100 4 2 2 0 000-4zm0 1a1 1 0 110 2 1 1 0 010-2z M3.5 3C2 4 1.5 6 2 8c.5 2 2 4 4 5 0-1 0-2 .5-3-1-.5-2-1.5-2.5-3-.5-1.5 0-3 .5-4z M12.5 3c1.5 1 2 3 1.5 5-.5 2-2 4-4 5 0-1 0-2-.5-3 1-.5 2-1.5 2.5-3 .5-1.5 0-3-.5-4z M3.5 13c1.5 1 3.5 1 4.5 0-1 0-2-.5-2.5-1.5-.5.5-1.5 1-2 1.5z M12.5 13c-1.5 1-3.5 1-4.5 0 1 0 2-.5 2.5-1.5.5.5 1.5 1 2 1.5z",
  ruby: "M3 3l5 10L13 3H3zm5 2l2 4H6l2-4z M2 11h12l-1 2H3l-1-2z",
  rust: "M8 2L3 5v6l5 3 5-3V5L8 2zm0 1.5l3.5 2v5L8 12.5l-3.5-2v-5L8 3.5zM6 6h4v4H6V6zm1 1v2h2V7H7z",
  sass: "M2 8c0-2 2-4 4-4 1 0 2 .5 2.5 1.5C9 4.5 10 4 11 4c2 0 3 2 3 4s-2 4-4 4c-1 0-2-.5-2.5-1.5C7 11.5 6 12 5 12c-2 0-3-2-3-4zm5-2c-1 0-2 1-2 2s1 2 2 2 2-1 2-2-1-2-2-2zm4 0c-1 0-2 1-2 2s1 2 2 2 2-1 2-2-1-2-2-2z",
  stylelint: "M8 1L3 4v5c0 3 2 5 5 6 3-1 5-3 5-6V4L8 1zm0 1.7l3.5 2.1v4.2c0 2-1.5 3.5-3.5 4.2-2-.7-3.5-2.2-3.5-4.2V4.8L8 2.7zM8 5L6 6v2l2 1 2-1V6L8 5z",
  svelte: "M5 3C3.5 4 3 6 4 7.5 3 8 2 9.5 2 11c0 1.5 1 3 3 3h2c0-1-.5-2-1.5-2.5-.5-.3-1-.5-1-1s.5-1.5 1.5-2c1 .5 2 .5 3 0L8 7C6.5 7.5 5 7 5 6S6 4 7.5 4s3 .5 4 1.5L13 4C11.5 2.5 9 2 7 2.5 6.5 2.5 6 2.5 5 3zm6 10c1.5-1 2-3 1-4.5 1-.5 2-2 2-3.5 0-1.5-1-3-3-3h-2c0 1 .5 2 1.5 2.5.5.3 1 .5 1 1s-.5 1.5-1.5 2c-1-.5-2-.5-3 0L8 9c1.5-.5 3 0 3 1s-1 2-2.5 2-3-.5-4-1.5L3 12c1.5 1.5 4 2 6 1.5.5 0 1 0 2-.5z",
  svg: "M2 3v10h12V3H2zm6 2l4 6H4l4-6zm0 2L6.5 9h3L8 7z",
  svgo: "M8 2L4 5v6l4 3 4-3V5L8 2zm0 1.5l3 2v5l-3 2-3-2v-5l3-2zM6 6l2 1 2-1-2-1-2 1z",
  swift: "M8 1C5 1 3 3 3 6c0 2 1 3 1 4 0 .5-.5 1-1 1.5C2 12 1.5 13 1.5 14c2 0 3-.5 4-1 .5-.5 1-1 1.5-1.5.5.5 1 1 2 1 3 0 5-2 5-5 0-4-3-7-7-6.5zm2 3c.5 0 1 .5 1 1s-.5 1-1 1-1-.5-1-1 .5-1 1-1z",
  table: "M2 3v10h12V3H2zm1 1h10v2H3V4zm0 3h4v5H3V7zm5 0h5v5H8V7z",
  tailwind: "M3 7c1-2 2.5-3 5-3s4 1 5 3c-1-1-2.5-1.5-5-1.5S4 6 3 7zm0 3c1-2 2.5-3 5-3s4 1 5 3c-1-1-2.5-1.5-5-1.5S4 9 3 10z",
  terraform: "M2 4v3l3 1.5V5L2 4zm4 2v3l3 1.5V7L6 6zm4 2v3l3 1.5V9L10 8zm-4 4v3l3 1.5v-3L6 12z",
  text: "M3 1.5h6L13 5.5v9c0 .3-.2.5-.5.5h-9c-.3 0-.5-.2-.5-.5v-13zM9 2v3.5h3.5L9 2zM5 7h6v1H5V7zm0 2h6v1H5V9zm0 2h4v1H5v-1z",
  typescript: "M2 2h12v12H2V2zm6 3.5v1c-.3-.2-.7-.3-1-.3-.5 0-.8.2-.8.5 0 .3.2.4.8.6 1 .3 1.5.7 1.5 1.5 0 1-.8 1.5-2 1.5-.5 0-1-.1-1.3-.4V8.5c.4.3.8.4 1.3.4.5 0 .8-.2.8-.5 0-.3-.2-.4-.9-.6-.9-.3-1.4-.7-1.4-1.5 0-.9.8-1.5 1.9-1.5.5 0 .9.1 1.2.2zm5 0v1c-.3-.2-.7-.3-1-.3-.5 0-.8.2-.8.5 0 .3.2.4.8.6 1 .3 1.5.7 1.5 1.5 0 1-.8 1.5-2 1.5-.5 0-1-.1-1.3-.4V8.5c.4.3.8.4 1.3.4.5 0 .8-.2.8-.5 0-.3-.2-.4-.9-.6-.9-.3-1.4-.7-1.4-1.5 0-.9.8-1.5 1.9-1.5.5 0 .9.1 1.2.2z",
  vite: "M8 1L2 4l6 3 6-3L8 1zm0 2l3 1.5L8 6 5 4.5 8 3zm-6 2v6l6 3 6-3V5l-6 3L2 5z",
  vscode: "M2 3l4-1 4 4 4-4 2 1v10l-2 1-4-4-4 4-4-1V3zm2 1.5v7l3-3.5L4 4.5zm8 0L9 8l3 3.5v-7z",
  vue: "M2 3l6 10L14 3h-2L8 8 4 3H2zm3 0l3 5 3-5H9L8 5 7 3H5z",
  wasm: "M3 2l1 12 4 1.5V2H3zm5 0v13.5l4-1.5L13 2H8zm2 2h1v2h-1V4zM4 5h1v2H4V5z",
  webpack: "M8 1L2 4.5v7L8 15l6-3.5v-7L8 1zm0 1.7l4.5 2.6v5.4L8 13.3 3.5 9.7V4.3L8 2.7zM8 5L4.5 7v2L8 11l3.5-2V7L8 5z",
  yarn: "M4 2c-.5 0-1 .3-1 1 0 .5.5 1 1 1s1-.5 1-1-.5-1-1-1zm4 0c-.5 0-1 .3-1 1 0 .5.5 1 1 1s1-.5 1-1-.5-1-1-1zm4 0c-.5 0-1 .3-1 1 0 .5.5 1 1 1s1-.5 1-1-.5-1-1-1zM3 5l1.5 4.5L3 14h2l1-3 1 3h2L8 9.5 9 14h2L9.5 9.5 11 14h2L11.5 5 10 9.5 9 5 8 9.5 7 5 6 9.5 5 5H3z",
  yml: "M3 2v12h1V8l2 2 2-2v6h1V2H8v4L6 8 4 6V2H3zm9 0v8h-2l3 4 3-4h-2V2h-2z",
  zig: "M2 3l4 5-4 5h2l3-4 3 4h2L8 8l4-5h-2L7 4 4 3H2zm9 9v1h2v-1h-2z",
  zip: "M3 1.5h6L13 5.5v9c0 .3-.2.5-.5.5h-9c-.3 0-.5-.2-.5-.5v-13zM9 2v3.5h3.5L9 2zm-3 4v1h2V6H6zm0 2v1h2V8H6zm0 2v1h2v-1H6z",
};

/** UI 功能图标 SVG path (16x16 viewBox) */
export const uiIconPaths: Record<UiIconName, string> = {
  chevron: "M6 4l4 4-4 4",
  close: "M4 4l8 8M12 4l-8 8",
  dot: "M8 5a3 3 0 100 6 3 3 0 000-6z",
  ellipsis: "M3 8a1 1 0 110-2 1 1 0 010 2zm5 0a1 1 0 110-2 1 1 0 010 2zm5 0a1 1 0 110-2 1 1 0 010 2z",
  file: "M3 1.5h6L13 5.5v9c0 .3-.2.5-.5.5h-9c-.3 0-.5-.2-.5-.5v-13zM9 2v3.5h3.5L9 2z",
  lock: "M4 7V5a4 4 0 018 0v2h1v7H3V7h1zm1 0h6V5a3 3 0 00-6 0v2z",
  search: "M7 3a4 4 0 100 8 4 4 0 000-8zm5 9l-2.5-2.5",
};

/** 文件图标颜色（与 VS Code 文件图标主题近似） */
export const fileIconColors: Record<FileIconName, string> = {
  astro: "#ff5d01",
  babel: "#f9dc3e",
  bash: "#89e051",
  biome: "#60a5fa",
  bootstrap: "#7952b3",
  browserslist: "#ffd539",
  bun: "#fbf0df",
  c: "#519aba",
  claude: "#d97757",
  codex: "#10a37f",
  cpp: "#519aba",
  css: "#42a5f5",
  database: "#c4c4c4",
  default: "var(--trees-fg-muted)",
  docker: "#2496ed",
  eslint: "#4b32c3",
  font: "#c4c4c4",
  git: "#f05032",
  go: "#00add8",
  graphql: "#e535ab",
  html: "#e44d26",
  image: "#b4b4b4",
  javascript: "#f7df1e",
  json: "#cbcb41",
  lock: "#c4c4c4",
  markdown: "#519aba",
  mcp: "#10a37f",
  nextjs: "#ffffff",
  npm: "#cb3837",
  oxc: "#ff4d4d",
  postcss: "#dd3a0a",
  prettier: "#f7b93e",
  python: "#ffd845",
  react: "#61dafb",
  ruby: "#cc342d",
  rust: "#dea584",
  sass: "#cf649a",
  stylelint: "#ffffff",
  svelte: "#ff3e00",
  svg: "#ffb13b",
  svgo: "#3e7fc1",
  swift: "#f05138",
  table: "#8bc34a",
  tailwind: "#38bdf8",
  terraform: "#7b42bc",
  text: "#b4b4b4",
  typescript: "#3178c6",
  vite: "#646cff",
  vscode: "#007acc",
  vue: "#42b883",
  wasm: "#654ff0",
  webpack: "#8dd6f9",
  yarn: "#2c8ebb",
  yml: "#cb171e",
  zig: "#f7a41d",
  zip: "#b4b4b4",
};

/** 文件图标 SVG 数据 */
export interface FileIconSvg {
  /** SVG 标记字符串（需要用 unsafeHTML/unsafeStatic 渲染） */
  svg: string;
  /** 图标颜色 */
  color: string;
}

/** 获取文件图标的 SVG 标记（lit 信任的 HTML） */
export function getFileIconSvg(name: FileIconName): FileIconSvg {
  const path = fileIconPaths[name] ?? fileIconPaths.default;
  const color = fileIconColors[name] ?? fileIconColors.default;
  return {
    svg: `<svg viewBox="0 0 16 16" fill="${color}" xmlns="http://www.w3.org/2000/svg"><path d="${path}"/></svg>`,
    color,
  };
}

/** 获取 UI 图标的 SVG 标记（lit 信任的 HTML） */
export function getUiIconSvg(name: UiIconName): string {
  const path = uiIconPaths[name];
  return `<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5" xmlns="http://www.w3.org/2000/svg"><path d="${path}"/></svg>`;
}

/** 所有文件类型图标名称列表 */
export const allFileIconNames = Object.keys(fileIconPaths) as FileIconName[];
