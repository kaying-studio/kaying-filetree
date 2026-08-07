/**
 * 文件扩展名 → 图标映射
 * 对标 ChatGPT Codex 的 file-tree-builtin-* 图标系统
 * 支持 160+ 种文件扩展名，映射到 54 种图标
 */

import type { FileIconName } from "../icons/file-icons.js";

/** 扩展名 → 图标映射表 */
const extensionMap: Record<string, FileIconName> = {
  // JavaScript
  ".js": "javascript", ".es6": "javascript", ".jsm": "javascript",
  ".mjs": "javascript", ".cjs": "javascript",

  // TypeScript
  ".ts": "typescript", ".cts": "typescript", ".mts": "typescript",

  // React
  ".jsx": "react", ".tsx": "react",

  // Python
  ".py": "python", ".pyw": "python", ".pyi": "python", ".ipynb": "python",

  // Rust
  ".rs": "rust",

  // Go
  ".go": "go",

  // Swift
  ".swift": "swift",

  // Ruby
  ".rb": "ruby", ".ru": "ruby", ".rjs": "ruby", ".rhtml": "ruby",
  ".rbx": "ruby", ".rpy": "ruby", ".gemspec": "ruby",

  // C
  ".c": "c", ".h": "c",

  // C++
  ".cpp": "cpp", ".cc": "cpp", ".cxx": "cpp", ".cppm": "cpp",
  ".cxxm": "cpp", ".hpp": "cpp", ".hh": "cpp", ".hxx": "cpp",
  ".ipp": "cpp", ".inl": "cpp", ".txx": "cpp", ".ixx": "cpp",

  // Zig
  ".zig": "zig",

  // Bash / Shell
  ".sh": "bash", ".bash": "bash", ".bashrc": "bash",
  ".zshrc": "bash", ".zshenv": "bash", ".zprofile": "bash",
  ".zlogin": "bash", ".zlogout": "bash",
  ".profile": "bash", ".bash_profile": "bash",
  ".xprofile": "bash", ".xsession": "bash", ".xsessionrc": "bash",
  ".hushlogin": "bash", ".shrc": "bash",

  // Astro
  ".astro": "astro",

  // Svelte
  ".svelte": "svelte",

  // Vue
  ".vue": "vue",

  // GraphQL
  ".graphql": "graphql", ".gql": "graphql",

  // Sass / SCSS
  ".scss": "sass", ".sass": "sass",

  // Markdown
  ".md": "markdown", ".markdown": "markdown", ".mdown": "markdown",
  ".mdwn": "markdown", ".mdtext": "markdown", ".mdtxt": "markdown",
  ".mkd": "markdown", ".mkdn": "markdown", ".mdoc": "markdown",
  ".markdn": "markdown",

  // HTML
  ".html": "html", ".htm": "html", ".xhtml": "html",
  ".xht": "html", ".shtml": "html", ".aspx": "html",
  ".ejs": "html", ".hbs": "html", ".handlebars": "html",

  // CSS
  ".css": "css",

  // SVG
  ".svg": "svg",

  // Images
  ".png": "image", ".jpg": "image", ".jpeg": "image",
  ".gif": "image", ".webp": "image", ".avif": "image",
  ".ico": "image", ".bmp": "image", ".tiff": "image",

  // JSON
  ".json": "json", ".jsonld": "json", ".ndjson": "json",
  ".webmanifest": "json", ".jsonc": "json", ".json5": "json",

  // YAML / YML
  ".yml": "yml", ".yaml": "yml", ".eyaml": "yml", ".eyml": "yml",

  // Docker
  ".dockerfile": "docker", ".containerfile": "docker",

  // Git
  ".gitignore": "git", ".gitattributes": "git", ".gitmodules": "git",
  ".gitconfig": "git",

  // npm
  ".npmrc": "npm",

  // Yarn
  ".yarn": "yarn", ".yarnrc": "yarn",

  // Vite
  ".vite": "vite",

  // Next.js
  ".next": "nextjs",

  // Tailwind
  ".tailwind": "tailwind",

  // PostCSS
  ".postcssrc": "postcss",

  // Prettier
  ".prettierrc": "prettier", ".prettierignore": "prettier",

  // ESLint
  ".eslintrc": "eslint",

  // Biome
  ".biome": "biome",

  // VS Code
  ".vscode": "vscode", ".devcontainer": "vscode",

  // Bun
  ".bun": "bun",

  // Babel
  ".babelrc": "babel",

  // Bootstrap
  ".bowerrc": "bootstrap",

  // Database
  ".sqlite": "database", ".db": "database", ".sql": "database",
  ".db3": "database", ".sqlite3": "database",

  // Table / CSV
  ".csv": "table", ".tsv": "table",

  // Text
  ".txt": "text", ".log": "text", ".log.txt": "text",

  // Font
  ".ttf": "font", ".otf": "font", ".woff": "font", ".woff2": "font",
  ".eot": "font",

  // WebAssembly
  ".wasm": "wasm",

  // Archive
  ".zip": "zip", ".tar": "zip", ".gz": "zip", ".bz2": "zip",
  ".rar": "zip", ".7z": "zip", ".tgz": "zip",

  // AI / Agent
  ".claude": "claude", ".codex": "codex", ".agents": "mcp",
  ".agent": "mcp", ".mcp": "mcp", ".chatmode": "mcp",
  ".instructions": "mcp", ".prompt": "mcp",

  // Oxidation Compiler
  ".oxc": "oxc",

  // SVGO
  ".svgo": "svgo",

  // Terraform
  ".tf": "terraform", ".tfvars": "terraform", ".tfstate": "terraform",

  // Webpack
  ".webpack": "webpack",

  // Misc config
  ".env": "default", ".editorconfig": "default",
  ".dockerignore": "docker", ".npmignore": "npm",

  // Media
  ".mp3": "default", ".mp4": "default", ".wav": "default", ".mov": "default",
  ".ogg": "default", ".flac": "default", ".webm": "default",

  // Documents
  ".pdf": "default", ".doc": "default", ".docx": "default",
  ".xls": "default", ".xlsx": "default", ".ppt": "default", ".pptx": "default",
  ".epub": "default", ".rtf": "default",

  // Config files
  ".toml": "default", ".ini": "default", ".cfg": "default",
  ".conf": "default", ".properties": "default", ".envrc": "default",

  // Lock files
  ".lock": "lock",
};

/** 特殊文件名 → 图标映射（优先级高于扩展名） */
const filenameMap: Record<string, FileIconName> = {
  "package.json": "npm",
  "package-lock.json": "npm",
  "yarn.lock": "yarn",
  "pnpm-lock.yaml": "npm",
  "bun.lockb": "bun",
  "bunfig.toml": "bun",
  "vite.config.ts": "vite",
  "vite.config.js": "vite",
  "vite.config.mts": "vite",
  "webpack.config.js": "webpack",
  "webpack.config.ts": "webpack",
  "next.config.js": "nextjs",
  "next.config.mjs": "nextjs",
  "next.config.ts": "nextjs",
  "tailwind.config.js": "tailwind",
  "tailwind.config.ts": "tailwind",
  "tailwind.config.mjs": "tailwind",
  "postcss.config.js": "postcss",
  "postcss.config.ts": "postcss",
  "postcss.config.mjs": "postcss",
  ".prettierrc": "prettier",
  ".prettierrc.json": "prettier",
  ".prettierrc.js": "prettier",
  ".prettierrc.ts": "prettier",
  ".eslintrc": "eslint",
  ".eslintrc.json": "eslint",
  ".eslintrc.js": "eslint",
  ".eslintrc.ts": "eslint",
  "biome.json": "biome",
  "biome.jsonc": "biome",
  ".babelrc": "babel",
  ".babelrc.json": "babel",
  "Dockerfile": "docker",
  "dockerfile": "docker",
  "docker-compose.yml": "docker",
  "docker-compose.yaml": "docker",
  ".gitignore": "git",
  ".gitattributes": "git",
  ".gitmodules": "git",
  ".env": "default",
  ".env.local": "default",
  ".env.example": "default",
  ".env.development": "default",
  ".env.production": "default",
  "Makefile": "default",
  "CMakeLists.txt": "default",
  "LICENSE": "text",
  "README.md": "markdown",
  "CHANGELOG.md": "markdown",
  "CONTRIBUTING.md": "markdown",
  ".npmrc": "npm",
  ".yarnrc": "yarn",
  ".editorconfig": "default",
  "tsconfig.json": "typescript",
  "tsconfig.base.json": "typescript",
  "jsconfig.json": "javascript",
  ".swcrc": "default",
  ".node-version": "default",
  ".nvmrc": "default",
  ".tool-versions": "default",
  ".prettierrc.toml": "prettier",
  ".eslintrc.yml": "eslint",
  "Cargo.toml": "rust",
  "Cargo.lock": "rust",
  "go.mod": "go",
  "go.sum": "go",
  "Gemfile": "ruby",
  "Gemfile.lock": "ruby",
  "requirements.txt": "python",
  "pyproject.toml": "python",
  "setup.py": "python",
  "Pipfile": "python",
  "Pipfile.lock": "python",
  "poetry.lock": "python",
};

/** 根据文件名获取对应的图标名称 */
export function getFileIconName(filename: string): FileIconName {
  // 1. 先匹配完整文件名（大小写不敏感）
  const lowerFilename = filename.toLowerCase();
  if (filenameMap[lowerFilename]) {
    return filenameMap[lowerFilename];
  }

  // 2. 匹配扩展名
  const lastDot = filename.lastIndexOf(".");
  if (lastDot > 0) {
    const ext = filename.slice(lastDot).toLowerCase();

    // 2a. 尝试复合扩展名（如 .css.map, .ts.map 等）
    const secondLastDot = filename.lastIndexOf(".", lastDot - 1);
    if (secondLastDot > 0) {
      const compoundExt = filename.slice(secondLastDot).toLowerCase();
      if (extensionMap[compoundExt]) {
        return extensionMap[compoundExt];
      }
    }

    if (extensionMap[ext]) {
      return extensionMap[ext];
    }
  }

  // 3. 返回默认图标
  return "default";
}

/** 判断是否为常见图片格式 */
export function isImageFile(filename: string): boolean {
  const ext = filename.slice(filename.lastIndexOf(".") + 1).toLowerCase();
  return ["png", "jpg", "jpeg", "gif", "webp", "avif", "ico", "bmp", "svg"].includes(ext);
}

/** 根据文件名推断 Shiki 语言 ID */
export function getShikiLang(filename: string): string {
  const ext = filename.slice(filename.lastIndexOf(".") + 1).toLowerCase();
  const langMap: Record<string, string> = {
    js: "javascript", mjs: "javascript", cjs: "javascript",
    ts: "typescript", cts: "typescript", mts: "typescript",
    jsx: "jsx", tsx: "tsx",
    py: "python", pyw: "python",
    lua: "lua",
    rs: "rust",
    go: "go",
    swift: "swift",
    rb: "ruby",
    c: "c", h: "c",
    cpp: "cpp", cc: "cpp", hpp: "cpp", hxx: "cpp",
    zig: "zig",
    sh: "bash", bash: "bash", zsh: "bash",
    astro: "astro",
    svelte: "svelte",
    vue: "vue",
    graphql: "graphql", gql: "graphql",
    scss: "scss", sass: "sass",
    css: "css",
    less: "less",
    html: "html", htm: "html",
    md: "markdown", markdown: "markdown",
    json: "json", jsonc: "json", json5: "json",
    yml: "yaml", yaml: "yaml",
    toml: "toml",
    xml: "xml",
    dockerfile: "dockerfile",
    sql: "sql",
    wasm: "wasm",
    ini: "ini", cfg: "ini", conf: "ini",
    diff: "diff",
    patch: "diff",
    env: "bash",
    txt: "text",
    log: "text",
  };
  return langMap[ext] ?? "text";
}
