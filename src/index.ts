/**
 * Agent File Tree — 框架无关的文件树 + 预览组件
 *
 * 技术架构对标 ChatGPT Codex 的 <file-tree-container>:
 * - Web Components (Custom Elements + Shadow DOM)
 * - Shiki 语法高亮
 * --trees-* CSS 变量主题系统
 * - 虚拟滚动
 * - 54 种文件类型图标
 *
 * 用法（任意框架）:
 *
 * // vanilla HTML
 * <agent-file-explorer></agent-file-explorer>
 * <script>
 *   const el = document.querySelector('agent-file-explorer');
 *   el.tree = { id: 'root', name: 'project', path: '/project', isDirectory: true, children: [...] };
 *   el.addEventListener('agent-file-open', (e) => {
 *     const content = fs.readFileSync(e.detail.path, 'utf-8');
 *     el.setFileContent(e.detail.node.name, content);
 *   });
 * </script>
 *
 * // React
 * <agent-file-explorer ref={el => {
 *   el.tree = treeData;
 *   el.addEventListener('agent-file-open', handler);
 * }} />
 *
 * // Vue
 * <agent-file-explorer :tree="treeData" @agent-file-open="onOpen" />
 */

// Components
export { AgentFileTree } from "./components/file-tree.js";
export { AgentFilePreview } from "./components/file-preview.js";
export { AgentSplitPanel } from "./components/split-panel.js";
export { AgentFileExplorer } from "./components/file-explorer.js";

// Types
export type { FileNode, FlatNode, GitStatus } from "./utils/tree-model.js";
export type { FileIconName, UiIconName } from "./icons/file-icons.js";
export type { TreesThemeMode } from "./utils/theme.js";

// Utilities
export {
  flattenTree,
  filterTree,
  collectDirectoryIds,
  getDisplayName,
} from "./utils/tree-model.js";
export { getFileIconName, getShikiLang, isImageFile } from "./utils/file-types.js";
export { getFileIconSvg, getUiIconSvg } from "./icons/file-icons.js";
export { computeVirtualRange, VirtualListManager } from "./utils/virtual-list.js";
export type { VirtualRange } from "./utils/virtual-list.js";

// Theme
export {
  treesDefaultCSS,
  treesLightTheme,
  treesDarkTheme,
  getSystemTheme,
} from "./utils/theme.js";

// Side-effect: 注册所有 Custom Elements
import "./components/file-tree.js";
import "./components/file-preview.js";
import "./components/split-panel.js";
import "./components/file-explorer.js";
