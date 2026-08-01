# kaying-filetree

[![CI](https://github.com/kaying-studio/kaying-filetree/actions/workflows/ci.yml/badge.svg)](https://github.com/kaying-studio/kaying-filetree/actions/workflows/ci.yml)
[![npm](https://img.shields.io/npm/v/kaying-filetree)](https://www.npmjs.com/package/kaying-filetree)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

[English](README.md) · [简体中文](README.zh-CN.md)

A framework-agnostic file tree + code preview Web Component inspired by ChatGPT Codex.

- **Repository:** `https://github.com/kaying-studio/kaying-filetree.git`
- **License:** [MIT](LICENSE)

![kaying-filetree screenshot](./docs/screenshot.png)

## Features

- **Web Component / Custom Element** — works with React, Vue, Angular, Svelte, or vanilla HTML.
- **Shadow DOM + CSS variables** — isolated styles and easy theming.
- **Draggable split panel** — preview on the left, file tree on the right by default.
- **Virtual scrolling** — handles large directories smoothly.
- **File type icons** — 50+ built-in icons for common languages and config files.
- **Syntax highlighting** — powered by [Shiki](https://shiki.style/) with line numbers.
- **Search & filter** — quickly find files in the tree.
- **Keyboard navigation** — ArrowUp/Down/Left/Right, Enter.
- **Context menu** — copy selection, add to agent, Google search, and extensible actions.
- **Light / dark / system themes**.

## Installation

```bash
npm install kaying-filetree
# or
pnpm add kaying-filetree
# or
yarn add kaying-filetree
```

## Quick Start

### Vanilla HTML

```html
<script type="module">
  import 'kaying-filetree';
</script>

<agent-file-explorer
  id="explorer"
  theme="dark"
  shiki-theme="github-dark"
  style="width: 100%; height: 100vh;"
></agent-file-explorer>

<script type="module">
  const explorer = document.getElementById('explorer');

  explorer.tree = {
    id: 'root',
    name: 'project',
    path: '/project',
    isDirectory: true,
    children: [
      {
        id: 'src/index.ts',
        name: 'index.ts',
        path: '/project/src/index.ts',
        isDirectory: false,
      },
    ],
  };

  explorer.addEventListener('agent-file-open', (e) => {
    const { path, node } = e.detail;
    // load file content from your backend / filesystem
    const content = `// content of ${node.name}`;
    explorer.setFileContent(node.name, content, null, path, content.length);
  });
</script>
```

### React

```tsx
import 'kaying-filetree';
import { useRef, useEffect } from 'react';

function FileExplorer({ tree }) {
  const ref = useRef(null);

  useEffect(() => {
    if (!ref.current) return;
    ref.current.tree = tree;
    ref.current.addEventListener('agent-file-open', (e) => {
      const { node, path } = e.detail;
      // load content
      ref.current.setFileContent(node.name, '// content', null, path, 10);
    });
  }, [tree]);

  return (
    <agent-file-explorer
      ref={ref}
      theme="dark"
      shiki-theme="github-dark"
      style={{ width: '100%', height: '100vh' }}
    />
  );
}
```

## API

### `<agent-file-explorer>`

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `tree` | `FileNode \| null` | `null` | Root node of the file tree. |
| `theme` | `'light' \| 'dark' \| 'system'` | `'dark'` | Color theme. |
| `shikiTheme` | `string` | `'github-dark'` | Shiki highlighting theme. |
| `splitRatio` | `number` | `0.5` | Initial ratio of the left (preview) panel. |
| `virtualized` | `boolean` | `true` | Enable virtual scrolling. |
| `showGitStatus` | `boolean` | `true` | Show Git status dots. |

| Method | Description |
|--------|-------------|
| `setFileContent(filename, content, imageUrl?, path?, size?)` | Display a file in the preview panel. |
| `expandAll()` | Expand all directories. |
| `collapseAll()` | Collapse all directories. |

| Event | Detail | Description |
|-------|--------|-------------|
| `agent-file-open` | `{ node: FileNode, path: string }` | Fired when a file is selected. |
| `agent-add-to-context` | `{ text: string, filename: string }` | Fired from the context menu "Add to agent". |

### `<agent-file-tree>`

Can be used standalone for just the file tree.

### `<agent-file-preview>`

Can be used standalone for just the code preview.

| Property | Type | Description |
|----------|------|-------------|
| `filename` | `string` | File name for language detection. |
| `content` | `string` | File text content. |
| `imageUrl` | `string \| null` | URL for image preview. |
| `filePath` | `string` | Full path for breadcrumb. |
| `fileSize` | `number \| null` | File size in bytes. |
| `extraContextMenuActions` | `ContextMenuAction[]` | Custom context-menu actions. |

## Themes

The component uses `--trees-*` CSS custom properties. Override them on the host element to customize:

```css
agent-file-explorer {
  --trees-bg: #0d1117;
  --trees-fg: #c9d1d9;
  --trees-accent: #58a6ff;
}
```

## Development

```bash
# install dependencies
npm install

# start dev server
npm run dev

# type check
npm run typecheck

# build
npm run build
```

## CI / CD

This repository uses GitHub Actions for continuous integration and automated npm publishing:

- **CI** (`.github/workflows/ci.yml`) — runs `typecheck` and `build` on every push and pull request.
- **Release** (`.github/workflows/release.yml`) — publishes the package to npm when a new GitHub Release is created.

To set up automated publishing:

1. Create an npm access token with **Publish** permission at [npmjs.com](https://www.npmjs.com/).
2. In your GitHub repository, go to **Settings → Secrets and variables → Actions**.
3. Add a repository secret named `NPM_TOKEN` with your npm token.
4. Create a new GitHub Release (or push a new git tag like `v0.1.0`). The workflow will automatically build and publish to npm.

See [PUBLISH.md](PUBLISH.md) for the full step-by-step guide.

## Contributing

Contributions are welcome! Please open an issue or submit a pull request. Make sure `npm run typecheck` and `npm run build` pass before submitting.

## License

[MIT](LICENSE) © Kaying Studio
