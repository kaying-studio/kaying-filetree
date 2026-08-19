/**
 * Demo 入口 — 展示 <agent-file-explorer> 的完整用法
 */

import "./index.js";
import { demoTree, demoFileContents } from "./demo-data.js";

const app = document.getElementById("app")!;

// 等待自定义元素注册完成
await customElements.whenDefined("agent-file-explorer");

const explorer = document.createElement("agent-file-explorer");

// 设置属性
explorer.tree = demoTree;
explorer.theme = "dark";
explorer.shikiTheme = "github-dark";
explorer.virtualized = true;
explorer.showGitStatus = true;
explorer.splitRatio = 0.5;
// 打开时指定选中的文件：自动展开祖先目录并触发 agent-file-open
explorer.initialFilePath = "/project/README.md";

// 监听文件打开事件
explorer.addEventListener("agent-file-open", (e) => {
  const event = e as CustomEvent<{ path: string; node: { name: string; size?: number } }>;
  const { node, path } = event.detail;
  const content = demoFileContents[node.name] ?? `// ${node.name}\n// No content available`;
  const size = node.size ?? new Blob([content]).size;
  explorer.setFileContent(node.name, content, null, path, size);
});

app.appendChild(explorer);

// 等待渲染完成后展开所有目录
await explorer.updateComplete;
explorer.expandAll();
