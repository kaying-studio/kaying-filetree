/**
 * <agent-file-explorer> — 顶层文件浏览器组件
 * 组合 file-tree + split-panel + file-preview
 *
 * 对标 ChatGPT Codex 的完整文件预览面板
 */

import { LitElement, html, css } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { ref as litRef, type Ref } from "lit/directives/ref.js";
import type { FileNode } from "../utils/tree-model.js";
import type { AgentFileTree } from "./file-tree.js";
import "./file-tree.js";
import "./file-preview.js";
import "./split-panel.js";

@customElement("agent-file-explorer")
export class AgentFileExplorer extends LitElement {
  /** 文件树数据 */
  @property({ attribute: false })
  tree: FileNode | null = null;

  /** 主题模式 */
  @property({ type: String })
  theme: "light" | "dark" | "system" = "dark";

  /** Shiki 主题名称 */
  @property({ attribute: false })
  shikiTheme: string = "github-dark";

  /** 是否启用虚拟滚动 */
  @property({ type: Boolean })
  virtualized = true;

  /** 是否显示 Git 状态 */
  @property({ type: Boolean })
  showGitStatus = true;

  /** 分栏比例 (0-1)，左侧为内容预览区 */
  @property({ type: Number })
  splitRatio = 0.5;

  /** 当前选中的文件内容 */
  @state() private selectedFile: { name: string; content: string; imageUrl: string | null; path: string; size: number | null } | null = null;

  /** file-tree 元素引用 */
  private treeRef: Ref<AgentFileTree> = litRef();

  connectedCallback(): void {
    super.connectedCallback();
    // 在 host 元素上监听 composed 事件（跨 Shadow DOM 边界）
    this.addEventListener("agent-file-select", this.onFileSelectEvent as EventListener);
  }

  disconnectedCallback(): void {
    super.disconnectedCallback();
    this.removeEventListener("agent-file-select", this.onFileSelectEvent as EventListener);
  }

  private onFileSelectEvent = (e: CustomEvent<{ node: FileNode; path: string }>) => {
    const { node } = e.detail;
    if (node.isDirectory) return;

    // 派发事件让宿主加载文件内容
    this.dispatchEvent(
      new CustomEvent("agent-file-open", {
        detail: { path: node.path, node },
        bubbles: true,
        composed: true,
      }),
    );
  };

  /**
   * 设置当前预览的文件内容
   */
  public setFileContent(filename: string, content: string, imageUrl: string | null = null, path: string = "", size: number | null = null) {
    this.selectedFile = { name: filename, content, imageUrl, path, size };
  }

  /** 展开 file-tree 的所有目录 */
  public expandAll() {
    this.treeRef.value?.expandAll();
  }

  /** 折叠 file-tree 的所有目录 */
  public collapseAll() {
    this.treeRef.value?.collapseAll();
  }

  static styles = css`
    :host {
      display: flex;
      width: 100%;
      height: 100%;
      overflow: hidden;
      background: var(--trees-bg, #1e1e1e);
    }

    .explorer-container {
      display: flex;
      width: 100%;
      height: 100%;
    }

    agent-file-tree,
    agent-file-preview {
      height: 100%;
    }
  `;

  render(): unknown {
    return html`
      <div class="explorer-container">
        <agent-split-panel
          direction="horizontal"
          .initialRatio=${this.splitRatio}
          .minRatio=${0.2}
          .maxRatio=${0.9}
        >
          <agent-file-preview
            slot="first"
            .filename=${this.selectedFile?.name ?? ""}
            .content=${this.selectedFile?.content ?? ""}
            .imageUrl=${this.selectedFile?.imageUrl ?? null}
            .filePath=${this.selectedFile?.path ?? ""}
            .fileSize=${this.selectedFile?.size ?? null}
            .theme=${this.theme}
            .shikiTheme=${this.shikiTheme}
          ></agent-file-preview>
          <agent-file-tree
            slot="second"
            ${litRef(this.treeRef)}
            .tree=${this.tree}
            .theme=${this.theme}
            ?virtualized=${this.virtualized}
            ?showGitStatus=${this.showGitStatus}
          ></agent-file-tree>
        </agent-split-panel>
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "agent-file-explorer": AgentFileExplorer;
  }
}
