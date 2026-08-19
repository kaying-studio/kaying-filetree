/**
 * <agent-file-tree> — 文件树 Web Component
 * 对标 ChatGPT Codex 的 <file-tree-container> Custom Element
 *
 * 特性：
 * - Shadow DOM 样式隔离
 * - 虚拟滚动（data-file-tree-virtualized）
 * - 搜索过滤（data-file-tree-search-input）
 * - 折叠/展开（aria-expanded + data-item-type='folder'）
 * - 文件类型图标（54 种 file-tree-builtin-*）
 * - Git 状态指示器
 * - --trees-* CSS 变量主题系统
 * - 键盘导航（ArrowUp/Down/Left/Right/Enter）
 */

import { LitElement, html, css, nothing, unsafeCSS } from "lit";
import { unsafeHTML } from "lit/directives/unsafe-html.js";
import { customElement, property, state } from "lit/decorators.js";
import { styleMap } from "lit/directives/style-map.js";
import { ref as litRef, type Ref } from "lit/directives/ref.js";
import {
  type FileNode,
  type FlatNode,
  type GitStatus,
  flattenTree,
  filterTree,
  collectDirectoryIds,
  findNodeByPath,
  getAncestorIds,
} from "../utils/tree-model.js";
import { getFileIconName } from "../utils/file-types.js";
import { getFileIconSvg, getUiIconSvg, fileIconColors, type FileIconName } from "../icons/file-icons.js";
import {
  treesDefaultCSS,
  treesDarkTheme,
  getSystemTheme,
} from "../utils/theme.js";
import { VirtualListManager, type VirtualRange } from "../utils/virtual-list.js";

@customElement("agent-file-tree")
export class AgentFileTree extends LitElement {
  // === Properties ===

  /** 树根节点数据 */
  @property({ attribute: false })
  tree: FileNode | null = null;

  /** 文件选中回调（直接函数调用，替代事件监听） */
  onFileSelect?: (node: FileNode) => void;

  /** 当前选中文件 ID */
  @property({ attribute: false })
  selectedId: string | null = null;

  /** 主题模式 */
  @property({ attribute: false })
  theme: "light" | "dark" | "system" = "dark";

  /** 是否启用虚拟滚动 */
  @property({ type: Boolean })
  virtualized = true;

  /** 是否显示 Git 状态 */
  @property({ type: Boolean })
  showGitStatus = true;

  // === Internal State ===

  @state() private expandedIds = new Set<string>();
  @state() private searchQuery = "";
  @state() private flatNodes: FlatNode[] = [];
  @state() private visibleRange: VirtualRange = {
    startIndex: 0,
    endIndex: 0,
    offsetY: 0,
    totalHeight: 0,
  };
  @state() private focusedIndex = -1;

  private virtualManager: VirtualListManager | null = null;
  private scrollContainer: HTMLElement | null = null;
  private currentTheme: "light" | "dark" = "dark";
  private scrollContainerRef: Ref<HTMLElement> = litRef();

  // === Lifecycle ===

  connectedCallback(): void {
    super.connectedCallback();
    this.updateTheme();
    if (this.theme === "system") {
      window
        .matchMedia("(prefers-color-scheme: dark)")
        .addEventListener("change", this.onSystemThemeChange);
    }
  }

  disconnectedCallback(): void {
    super.disconnectedCallback();
    this.virtualManager?.detach();
    window
      .matchMedia("(prefers-color-scheme: dark)")
      .removeEventListener("change", this.onSystemThemeChange);
  }

  willUpdate(changedProps: Map<string, unknown>): void {
    if (changedProps.has("tree") || changedProps.has("expandedIds") || changedProps.has("searchQuery")) {
      this.computeFlatNodes();
    }
  }

  updated(changedProps: Map<string, unknown>): void {
    if (changedProps.has("theme")) {
      this.updateTheme();
    }
  }

  // === Theme ===

  private updateTheme() {
    this.currentTheme = this.theme === "system" ? getSystemTheme() : this.theme;
    // 通过 data-theme 属性切换主题 CSS
    if (this.currentTheme === "light") {
      this.style.setProperty("--trees-fg", "#1e1e1e");
      this.style.setProperty("--trees-fg-muted", "#6b6b6b");
      this.style.setProperty("--trees-bg", "#ffffff");
      this.style.setProperty("--trees-bg-muted", "#f0f0f0");
      this.style.setProperty("--trees-accent", "#0066cc");
      this.style.setProperty("--trees-border-color", "#e0e0e0");
      this.style.setProperty("--trees-hover-bg", "rgba(0, 0, 0, 0.04)");
      this.style.setProperty("--trees-selected-bg", "rgba(0, 102, 204, 0.08)");
      this.style.setProperty("--trees-scrollbar-thumb", "rgba(0, 0, 0, 0.1)");
    } else {
      this.style.setProperty("--trees-fg", "#d4d4d4");
      this.style.setProperty("--trees-fg-muted", "#8e8e8e");
      this.style.setProperty("--trees-bg", "#1e1e1e");
      this.style.setProperty("--trees-bg-muted", "#2d2d2d");
      this.style.setProperty("--trees-accent", "#4a9eff");
      this.style.setProperty("--trees-border-color", "#3e3e3e");
      this.style.setProperty("--trees-hover-bg", "rgba(255, 255, 255, 0.04)");
      this.style.setProperty("--trees-selected-bg", "rgba(74, 158, 255, 0.15)");
      this.style.setProperty("--trees-scrollbar-thumb", "rgba(255, 255, 255, 0.1)");
    }
  }

  private onSystemThemeChange = () => {
    this.updateTheme();
  };

  // === Tree Operations ===

  private computeFlatNodes() {
    if (!this.tree) {
      this.flatNodes = [];
      return;
    }

    let root = this.tree;

    // 首次加载时自动展开根节点
    if (this.expandedIds.size === 0 && this.tree.children) {
      this.expandedIds = new Set([this.tree.id]);
    }

    // 搜索过滤
    if (this.searchQuery) {
      const filtered = filterTree(this.tree, this.searchQuery);
      if (!filtered) {
        this.flatNodes = [];
        return;
      }
      root = filtered;
      // 搜索时自动展开所有目录
      this.expandedIds = new Set(collectDirectoryIds(filtered));
    }

    this.flatNodes = flattenTree(root, this.expandedIds);

    // 更新虚拟滚动
    if (this.virtualManager) {
      this.virtualManager.setItemCount(this.flatNodes.length);
    }
  }

  private toggleExpand(nodeId: string) {
    const newExpanded = new Set(this.expandedIds);
    if (newExpanded.has(nodeId)) {
      newExpanded.delete(nodeId);
    } else {
      newExpanded.add(nodeId);
    }
    this.expandedIds = newExpanded;
  }

  private selectNode(node: FileNode) {
    this.selectedId = node.id;
    // 直接回调
    this.onFileSelect?.(node);
    // 同时派发事件（兼容外部监听）
    this.dispatchEvent(
      new CustomEvent("agent-file-select", {
        detail: { node, path: node.path },
        bubbles: true,
        composed: true,
      }),
    );
  }

  // === Rendering ===

  private renderRow(flatNode: FlatNode): unknown {
    const { node, depth, expanded, hasChildren } = flatNode;
    const isSelected = this.selectedId === node.id;
    const isFocused = this.focusedIndex === flatNode.index;
    const iconName: FileIconName = node.isDirectory ? "default" : getFileIconName(node.name);
    const icon = node.isDirectory
      ? this.getFolderIcon(expanded)
      : getFileIconSvg(iconName);
    const gitColor = this.getGitStatusColor(node.gitStatus);

    return html`
      <div
        class="tree-row"
        data-type="item"
        data-item-type=${node.isDirectory ? "folder" : "file"}
        data-item-section="row"
        aria-expanded=${hasChildren ? String(expanded) : nothing}
        role="treeitem"
        aria-selected=${isSelected ? "true" : "false"}
        ?data-selected=${isSelected}
        ?data-focused=${isFocused}
        style=${styleMap({
          paddingLeft: `${8 + depth * 18}px`,
        })}
        @click=${(e: Event) => {
          e.stopPropagation();
          if (hasChildren) this.toggleExpand(node.id);
          this.selectNode(node);
          this.focusedIndex = flatNode.index;
        }}
      >
        <span class="tree-row__chevron" data-item-section="icon">
          ${hasChildren
            ? html`<span
                class="chevron-icon ${expanded ? "expanded" : ""}"
              >${unsafeHTML(this.getChevronIcon())}</span>`
            : html`<span class="chevron-placeholder"></span>`}
        </span>
        <span class="tree-row__icon" data-item-section="icon" style=${styleMap({ color: icon.color })}>
          ${unsafeHTML(icon.svg)}
        </span>
        <span class="tree-row__label" data-item-section="content">
          ${node.name}
        </span>
        ${gitColor
          ? html`<span
              class="tree-row__git-status"
              data-item-section="decoration"
              style=${styleMap({ color: gitColor })}
            >●</span>`
          : nothing}
      </div>
    `;
  }

  private getFolderIcon(expanded: boolean): ReturnType<typeof getFileIconSvg> {
    const color = expanded ? "var(--trees-accent)" : "#dcb67a";
    const path = expanded
      ? "M1.5 3.5h4l1.5 2H14.5v7.5h-13V3.5z"
      : "M1.5 3.5h4l1.5 2H14.5v7.5h-13V3.5zm0 0v0";
    return {
      svg: `<svg viewBox="0 0 16 16" fill="${color}" xmlns="http://www.w3.org/2000/svg"><path d="${path}"/></svg>`,
      color,
    };
  }

  private getChevronIcon() {
    return getUiIconSvg("chevron");
  }

  private getGitStatusColor(status?: GitStatus): string | null {
    if (!status || !this.showGitStatus) return null;
    const colors: Record<GitStatus, string> = {
      modified: "var(--trees-git-modified)",
      added: "var(--trees-git-added)",
      deleted: "var(--trees-git-deleted)",
      renamed: "var(--trees-git-renamed)",
      untracked: "var(--trees-git-untracked)",
    };
    return colors[status] ?? null;
  }

  // === Virtual Scroll ===

  private setupVirtualScroll() {
    const el = this.scrollContainerRef.value;
    if (!el || el === this.scrollContainer) return;

    this.virtualManager?.detach();
    this.scrollContainer = el;

    if (this.virtualized) {
      this.virtualManager = new VirtualListManager(
        20, // row height
        5,  // overscan
        (range) => {
          this.visibleRange = range;
        },
      );
      this.virtualManager.attach(el);
      this.virtualManager.setItemCount(this.flatNodes.length);
    }
  }

  private renderVirtualized(): unknown {
    // 确保 DOM 更新后设置虚拟滚动
    this.updateComplete.then(() => this.setupVirtualScroll());

    const { startIndex, endIndex, offsetY, totalHeight } = this.visibleRange;
    const visibleNodes = this.flatNodes.slice(startIndex, endIndex);

    return html`
      <div
        class="virtualized-root"
        data-file-tree-virtualized-root="true"
      >
        <div
          class="virtualized-scroll"
          data-file-tree-virtualized-scroll="true"
          ${litRef(this.scrollContainerRef)}
        >
          <div
            class="virtualized-spacer"
            style=${styleMap({ height: `${totalHeight}px`, position: "relative" })}
          >
            <div
              class="virtualized-list"
              data-file-tree-virtualized-list="true"
              style=${styleMap({
                transform: `translateY(${offsetY}px)`,
                position: "absolute",
                top: "0",
                left: "0",
                right: "0",
              })}
            >
              ${visibleNodes.map((n) => this.renderRow(n))}
            </div>
          </div>
        </div>
      </div>
    `;
  }

  private renderNonVirtualized(): unknown {
    return html`
      <div class="non-virtualized-scroll">
        ${this.flatNodes.map((n) => this.renderRow(n))}
      </div>
    `;
  }

  // === Search ===

  private onSearchInput(e: InputEvent) {
    const input = e.target as HTMLInputElement;
    this.searchQuery = input.value;
  }

  private clearSearch() {
    this.searchQuery = "";
  }

  private get selectedNode(): FileNode | null {
    if (!this.selectedId) return null;
    return this.flatNodes.find((f) => f.node.id === this.selectedId)?.node ?? null;
  }

  private renderBreadcrumb(): unknown {
    const node = this.selectedNode;
    if (!node || !this.tree) return nothing;

    const rootName = this.tree.name;
    const relative = node.path.startsWith(this.tree.path)
      ? node.path.slice(this.tree.path.length).replace(/^[/\\]+/, "")
      : node.path;
    const parts = relative ? [rootName, ...relative.split(/[/\\]+/)] : [rootName];

    return html`
      <div class="breadcrumb" data-file-tree-breadcrumb="true">
        ${parts.map((part, i) => html`
          <span class="breadcrumb-part ${i === parts.length - 1 ? "breadcrumb-part--last" : ""}">${part}</span>
          ${i < parts.length - 1 ? html`<span class="breadcrumb-separator">/</span>` : nothing}
        `)}
      </div>
    `;
  }

  // === Keyboard Navigation ===

  private onKeyDown(e: KeyboardEvent) {
    if (this.flatNodes.length === 0) return;

    switch (e.key) {
      case "ArrowDown": {
        e.preventDefault();
        this.focusedIndex = Math.min(
          this.flatNodes.length - 1,
          (this.focusedIndex < 0 ? -1 : this.focusedIndex) + 1,
        );
        const node = this.flatNodes[this.focusedIndex];
        if (node) this.selectNode(node.node);
        break;
      }
      case "ArrowUp": {
        e.preventDefault();
        this.focusedIndex = Math.max(0, this.focusedIndex - 1);
        const node = this.flatNodes[this.focusedIndex];
        if (node) this.selectNode(node.node);
        break;
      }
      case "ArrowRight": {
        e.preventDefault();
        if (this.focusedIndex >= 0) {
          const flat = this.flatNodes[this.focusedIndex];
          if (flat?.hasChildren && !flat.expanded) {
            this.toggleExpand(flat.node.id);
          }
        }
        break;
      }
      case "ArrowLeft": {
        e.preventDefault();
        if (this.focusedIndex >= 0) {
          const flat = this.flatNodes[this.focusedIndex];
          if (flat?.hasChildren && flat.expanded) {
            this.toggleExpand(flat.node.id);
          }
        }
        break;
      }
      case "Enter": {
        e.preventDefault();
        if (this.focusedIndex >= 0) {
          const flat = this.flatNodes[this.focusedIndex];
          if (flat) this.selectNode(flat.node);
        }
        break;
      }
    }
  }

  // === Public API ===

  /** 展开所有目录 */
  public expandAll() {
    if (this.tree) {
      this.expandedIds = new Set(collectDirectoryIds(this.tree));
    }
  }

  /** 折叠所有目录 */
  public collapseAll() {
    this.expandedIds = new Set();
  }

  /** 选中树中按当前顺序排列的第一个文件 */
  public selectFirstFile() {
    const firstFile = findFirstFile(this.tree);
    if (!firstFile) return;
    this.selectNode(firstFile);
  }

  /**
   * 按路径（或 ID）选中指定文件：自动展开其所有祖先目录，并在虚拟滚动中滚动到可见位置。
   * 返回是否找到并选中了目标文件。
   */
  public async selectFileByPath(path: string): Promise<boolean> {
    if (!this.tree) return false;
    const target = findNodeByPath(this.tree, path);
    if (!target || target.isDirectory) return false;

    // 展开目标的所有祖先目录
    const ancestorIds = getAncestorIds(this.tree, target.id);
    if (ancestorIds.length > 0) {
      const newExpanded = new Set(this.expandedIds);
      for (const id of ancestorIds) newExpanded.add(id);
      this.expandedIds = newExpanded;
      await this.updateComplete;
    }

    const flat = this.flatNodes.find((f) => f.node.id === target.id);
    if (!flat) return false;

    this.selectNode(flat.node);
    this.focusedIndex = flat.index;
    this.scrollToIndex(flat.index);
    return true;
  }

  private scrollToIndex(index: number): void {
    if (this.virtualized) {
      this.virtualManager?.scrollToIndex(index);
      return;
    }
    const row = this.shadowRoot?.querySelector<HTMLElement>("[data-selected]");
    row?.scrollIntoView({ block: "center" });
  }

  // === Styles ===

  static styles = [
    unsafeCSS(treesDefaultCSS),
    css`
    :host {
      display: flex;
      flex-direction: column;
      height: 100%;
      overflow: hidden;
      font-family: var(--trees-font-family);
      font-size: var(--trees-font-size);
      color: var(--trees-fg);
      background: var(--trees-bg);
    }

    /* === Tree Header (sticky) === */
    .tree-header {
      background: var(--trees-bg);
      flex-shrink: 0;
    }

    .tree-body {
      flex: 1;
      display: flex;
      flex-direction: column;
      min-height: 0;
      outline: none;
    }

    /* === Search Bar === */
    .search-container {
      display: flex;
      align-items: center;
      gap: 6px;
      padding: 6px 10px;
      margin: 8px 10px;
      border: 1px solid var(--trees-border-color);
      border-radius: 6px;
      background: var(--trees-bg-muted);
      transition: border-color 0.15s ease, box-shadow 0.15s ease;
    }

    .search-container:focus-within {
      border-color: var(--trees-accent);
      box-shadow: 0 0 0 1px var(--trees-accent);
    }

    .search-icon,
    .search-clear {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 14px;
      height: 14px;
      flex-shrink: 0;
      color: var(--trees-fg-muted);
    }

    .search-icon svg,
    .search-clear svg {
      width: 13px;
      height: 13px;
    }

    .search-clear {
      cursor: pointer;
      border-radius: 3px;
      transition: color 0.12s ease, background 0.12s ease;
    }

    .search-clear:hover {
      color: var(--trees-fg);
      background: var(--trees-hover-bg);
    }

    .search-input {
      flex: 1;
      min-width: 0;
      padding: 3px 0;
      border: none;
      border-radius: 0;
      background: transparent;
      color: var(--trees-fg);
      font-family: var(--trees-font-family);
      font-size: var(--trees-font-size);
      outline: none;
      box-sizing: border-box;
    }

    .search-input::placeholder {
      color: var(--trees-fg-muted);
      opacity: 0.8;
    }

    .search-container:focus-within .search-icon {
      color: var(--trees-accent);
    }

    /* === Breadcrumb === */
    .breadcrumb {
      display: flex;
      align-items: center;
      gap: 4px;
      padding: 6px 10px;
      font-size: 12px;
      color: var(--trees-fg-muted);
      overflow: hidden;
      white-space: nowrap;
      border-top: 1px solid var(--trees-border-color);
    }

    .breadcrumb-part {
      overflow: hidden;
      text-overflow: ellipsis;
      max-width: 120px;
    }

    .breadcrumb-part--last {
      color: var(--trees-fg);
      font-weight: var(--trees-font-weight-medium);
    }

    .breadcrumb-separator {
      opacity: 0.5;
      padding: 0 2px;
    }

    /* === Virtualized Scroll === */
    .virtualized-root {
      flex: 1;
      overflow: hidden;
      position: relative;
    }

    .virtualized-scroll {
      height: 100%;
      overflow-y: auto;
      scrollbar-gutter: stable;
    }

    .virtualized-scroll::-webkit-scrollbar {
      width: var(--trees-scrollbar-gutter);
      height: var(--trees-scrollbar-gutter);
    }

    .virtualized-scroll::-webkit-scrollbar-track {
      background: transparent;
    }

    .virtualized-scroll::-webkit-scrollbar-thumb {
      background: var(--trees-scrollbar-thumb);
      border-radius: calc(var(--trees-scrollbar-gutter) / 2);
    }

    /* === Non-Virtualized Scroll === */
    .non-virtualized-scroll {
      flex: 1;
      overflow-y: auto;
      scrollbar-gutter: stable;
    }

    /* === Tree Row === */
    .tree-row {
      display: flex;
      align-items: center;
      height: var(--trees-row-height);
      cursor: pointer;
      user-select: none;
      white-space: nowrap;
      padding-right: var(--trees-padding-right);
      border-left: 2px solid transparent;
      border-radius: 0 3px 3px 0;
      margin: 0 4px;
      transition: background 0.08s ease;
    }

    .tree-row:hover {
      background: var(--trees-hover-bg);
    }

    .tree-row[data-selected] {
      background: var(--trees-selected-bg);
      border-left-color: var(--trees-selected-border);
    }

    .tree-row[data-selected] .tree-row__label {
      color: var(--trees-selected-fg);
      font-weight: var(--trees-font-weight-medium);
    }

    .tree-row[data-focused] {
      outline: none;
      box-shadow: inset 0 0 0 1px var(--trees-selected-focused-border-color);
    }

    .tree-row__chevron {
      display: flex;
      align-items: center;
      justify-content: center;
      width: var(--trees-chevron-size);
      height: var(--trees-chevron-size);
      flex-shrink: 0;
    }

    .chevron-icon {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 100%;
      height: 100%;
      color: var(--trees-fg-muted);
      transform: rotate(0deg);
      transition: transform 0.15s ease;
    }

    .chevron-icon.expanded {
      transform: rotate(90deg);
    }

    .chevron-icon svg {
      width: 12px;
      height: 12px;
    }

    .chevron-placeholder {
      width: var(--trees-chevron-size);
      height: var(--trees-chevron-size);
    }

    .tree-row__icon {
      display: flex;
      align-items: center;
      justify-content: center;
      width: var(--trees-icon-size);
      height: var(--trees-icon-size);
      margin: 0 4px;
      flex-shrink: 0;
    }

    .file-icon {
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .file-icon svg {
      width: var(--trees-icon-size);
      height: var(--trees-icon-size);
    }

    .tree-row__label {
      flex: 1;
      overflow: hidden;
      text-overflow: ellipsis;
      font-weight: var(--trees-font-weight-regular);
    }

    .tree-row[data-selected] .tree-row__label {
      font-weight: var(--trees-font-weight-medium);
    }

    .tree-row__git-status {
      flex-shrink: 0;
      font-size: 8px;
      margin-left: 4px;
    }
    `,
    unsafeCSS(treesDarkTheme),
  ];

  // === Render ===

  render(): unknown {
    return html`
      <div class="tree-header" data-file-tree-header="true">
        <div class="search-container" data-file-tree-search-container="true">
          <span class="search-icon">${unsafeHTML(getUiIconSvg("search"))}</span>
          <input
            class="search-input"
            data-file-tree-search-input="true"
            type="text"
            placeholder="Search files..."
            .value=${this.searchQuery}
            @input=${this.onSearchInput}
            @keydown=${(e: KeyboardEvent) => e.stopPropagation()}
          />
          ${this.searchQuery
            ? html`<span class="search-clear" @click=${this.clearSearch}>${unsafeHTML(getUiIconSvg("close"))}</span>`
            : nothing}
        </div>
        ${this.renderBreadcrumb()}
      </div>
      <div
        class="tree-body"
        role="tree"
        @keydown=${this.onKeyDown}
        tabindex="0"
      >
        ${this.flatNodes.length === 0
          ? html`<div class="empty-state">No files found</div>`
          : this.virtualized
            ? this.renderVirtualized()
            : this.renderNonVirtualized()}
      </div>
    `;
  }
}

function findFirstFile(node: FileNode | null): FileNode | null {
  if (!node) return null;
  if (!node.isDirectory) return node;
  for (const child of node.children ?? []) {
    const file = findFirstFile(child);
    if (file) return file;
  }
  return null;
}

declare global {
  interface HTMLElementTagNameMap {
    "agent-file-tree": AgentFileTree;
  }
}
