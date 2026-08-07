# kaying-filetree

[![CI](https://github.com/kaying-studio/kaying-filetree/actions/workflows/ci.yml/badge.svg)](https://github.com/kaying-studio/kaying-filetree/actions/workflows/ci.yml)
[![npm](https://img.shields.io/npm/v/@kayingai/kaying-filetree)](https://www.npmjs.com/package/@kayingai/kaying-filetree)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

[English](README.md) · [简体中文](README.zh-CN.md)

面向**自定义 AI Agent 界面**的文件树 + 代码预览 Web Component，功能和设计全面对标 **ChatGPT Codex** 右侧的文件预览面板。

围绕 Agent 工作流设计：一侧展示可浏览的项目结构，另一侧展示富文件预览，让 Agent 可以在对话中直接展示、解释并让用户检查代码、配置、图片等内容。

**[在线预览](https://kaying-studio.github.io/kaying-filetree/)**

![kaying-filetree 截图](./docs/screenshot.png)

## 为 Agent 场景打造

- **Codex 风格侧栏** — 可拖拽分栏，左侧内容预览、右侧文件树，与 ChatGPT Codex 一致。
- **Agent 原生交互** — 复制选中内容、**添加到 agent**、Google 搜索，并支持扩展更多自定义右键菜单操作。
- **无框架绑定** — 标准 Web Component + Shadow DOM，可在 React、Vue、Svelte、Angular 或原生 HTML 中直接使用。
- **丰富的文件预览** — 基于 [Shiki](https://shiki.style/) 的语法高亮、行号、面包屑、图片预览和文件元信息。
- **生产级文件树** — 虚拟滚动、搜索过滤、键盘导航、50+ 文件类型图标、Git 状态指示。
- **主题自适应** — 支持浅色、深色、跟随系统，通过 `--trees-*` CSS 变量自定义。

## 安装

```bash
npm install @kayingai/kaying-filetree
# 或
pnpm add @kayingai/kaying-filetree
# 或
yarn add @kayingai/kaying-filetree
```

## 快速开始

### 原生 HTML

```html
<script type="module">
  import '@kayingai/kaying-filetree';
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
import '@kayingai/kaying-filetree';
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

### 自定义 Agent 文件面板

在 Agent 场景中，可以让右侧文件树负责展示当前位置，左侧预览区只显示当前文件名：

```ts
explorer.showBreadcrumb = false;
explorer.tree = projectTree;

explorer.addEventListener('agent-file-open', async (event) => {
  const { node, path } = event.detail;
  const content = await loadFileFromAgentBackend(path);
  explorer.setFileContent(node.name, content, null, path, content.length);
});

// 展开文件树，并触发第一个文件的 agent-file-open 事件。
await explorer.openFirstFile();
```

`openFirstFile()` 适合项目刚被识别时调用：用户会立即看到有意义的文件内容，文件内容如何读取仍由宿主 Agent 应用控制。

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
| `showBreadcrumb` | `boolean` | `true` | 是否显示预览区顶部的路径面包屑。 |
| `extraContextMenuActions` | `ContextMenuAction[]` | `[]` | 注入文件预览区的自定义右键菜单操作。 |

| 方法 | 说明 |
|------|------|
| `setFileContent(filename, content, imageUrl?, path?, size?)` | 在预览区显示文件内容。 |
| `expandAll()` | 展开所有目录。 |
| `collapseAll()` | 折叠所有目录。 |
| `openFirstFile()` | 展开文件树并请求打开第一个文件。 |

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
| `showBreadcrumb` | `boolean` | 是否显示路径面包屑。 |
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

## 贡献

欢迎提交 Issue 和 Pull Request！提交前请确保 `npm run typecheck` 和 `npm run build` 通过。

## 协议

[MIT](LICENSE) © Kaying Studio
