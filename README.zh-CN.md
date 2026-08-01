# kaying-filetree

[![CI](https://github.com/kaying-studio/kaying-filetree/actions/workflows/ci.yml/badge.svg)](https://github.com/kaying-studio/kaying-filetree/actions/workflows/ci.yml)
[![npm](https://img.shields.io/npm/v/kaying-filetree)](https://www.npmjs.com/package/kaying-filetree)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

[English](README.md) · [简体中文](README.zh-CN.md)

受 ChatGPT Codex 启发的框架无关文件树 + 代码预览 Web Component。

- **仓库地址：** `https://github.com/kaying-studio/kaying-filetree.git`
- **开源协议：** [MIT](LICENSE)

![kaying-filetree 截图](./docs/screenshot.png)

## 特性

- **Web Component / 自定义元素** — 可用于 React、Vue、Angular、Svelte 或原生 HTML。
- **Shadow DOM + CSS 变量** — 样式隔离，主题切换方便。
- **可拖拽分栏** — 默认左侧内容预览，右侧文件树。
- **虚拟滚动** — 大型目录也能流畅渲染。
- **文件类型图标** — 内置 50+ 种常见语言和配置文件图标。
- **语法高亮** — 基于 [Shiki](https://shiki.style/)，支持行号。
- **搜索过滤** — 快速定位文件树中的文件。
- **键盘导航** — 支持方向键和回车键。
- **右键菜单** — 复制、添加到 agent、Google 搜索，并支持扩展更多操作。
- **浅色 / 深色 / 跟随系统主题**。

## 安装

```bash
npm install kaying-filetree
# 或
pnpm add kaying-filetree
# 或
yarn add kaying-filetree
```

## 快速开始

### 原生 HTML

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
    // 从你的后端或文件系统加载文件内容
    const content = `// ${node.name} 的内容`;
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
      // 加载内容
      ref.current.setFileContent(node.name, '// 内容', null, path, 10);
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

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `tree` | `FileNode \| null` | `null` | 文件树根节点。 |
| `theme` | `'light' \| 'dark' \| 'system'` | `'dark'` | 颜色主题。 |
| `shikiTheme` | `string` | `'github-dark'` | Shiki 高亮主题。 |
| `splitRatio` | `number` | `0.5` | 左侧预览区初始占比。 |
| `virtualized` | `boolean` | `true` | 是否启用虚拟滚动。 |
| `showGitStatus` | `boolean` | `true` | 是否显示 Git 状态圆点。 |

| 方法 | 说明 |
|------|------|
| `setFileContent(filename, content, imageUrl?, path?, size?)` | 在预览区显示文件内容。 |
| `expandAll()` | 展开所有目录。 |
| `collapseAll()` | 折叠所有目录。 |

| 事件 | detail | 说明 |
|------|--------|------|
| `agent-file-open` | `{ node: FileNode, path: string }` | 选中文件时触发。 |
| `agent-add-to-context` | `{ text: string, filename: string }` | 右键菜单“添加到 agent”时触发。 |

### `<agent-file-tree>`

可单独使用，仅展示文件树。

### `<agent-file-preview>`

可单独使用，仅展示代码预览。

| 属性 | 类型 | 说明 |
|------|------|------|
| `filename` | `string` | 文件名，用于语言检测。 |
| `content` | `string` | 文件文本内容。 |
| `imageUrl` | `string \| null` | 图片预览 URL。 |
| `filePath` | `string` | 完整路径，用于面包屑。 |
| `fileSize` | `number \| null` | 文件大小（字节）。 |
| `extraContextMenuActions` | `ContextMenuAction[]` | 自定义右键菜单操作。 |

## 主题

组件使用 `--trees-*` CSS 自定义属性。在宿主元素上覆盖即可自定义：

```css
agent-file-explorer {
  --trees-bg: #0d1117;
  --trees-fg: #c9d1d9;
  --trees-accent: #58a6ff;
}
```

## 开发

```bash
# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 类型检查
npm run typecheck

# 构建
npm run build
```

## CI / CD

本仓库使用 GitHub Actions 进行持续集成和自动化 npm 发布：

- **CI**（`.github/workflows/ci.yml`）— 每次 push 和 pull request 时运行类型检查和构建。
- **Release**（`.github/workflows/release.yml`）— 创建 GitHub Release 时自动发布到 npm。

配置自动发布：

1. 在 [npmjs.com](https://www.npmjs.com/) 创建一个具有 **Publish** 权限的访问令牌。
2. 进入 GitHub 仓库 **Settings → Secrets and variables → Actions**。
3. 添加名为 `NPM_TOKEN` 的仓库密钥，值为你的 npm token。
4. 创建新的 GitHub Release（或推送类似 `v0.1.0` 的 git 标签），工作流会自动构建并发布到 npm。

完整操作步骤见 [PUBLISH.md](PUBLISH.md)。

## 贡献

欢迎提交 Issue 和 Pull Request！提交前请确保 `npm run typecheck` 和 `npm run build` 通过。

## 协议

[MIT](LICENSE) © Kaying Studio
