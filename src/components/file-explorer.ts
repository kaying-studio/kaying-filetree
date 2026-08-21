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
import type { ContextMenuAction, FilePreviewSource } from "./file-preview.js";
import type { AgentFileTree } from "./file-tree.js";
import "./file-tree.js";
import "./file-preview.js";
import "./split-panel.js";

export interface FileExplorerTreeReadyDetail {
  tree: FileNode;
}

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

  /** 是否显示文件预览区顶部的路径面包屑 */
  @property({ type: Boolean })
  showBreadcrumb = true;

  /** 传递给文件预览区的自定义右键菜单操作 */
  @property({ attribute: false })
  extraContextMenuActions: ContextMenuAction[] = [];

  /** 文件树完成渲染后的回调，适合 Agent 面板执行首次展开等初始化操作 */
  @property({ attribute: false })
  onTreeReady?: (detail: FileExplorerTreeReadyDetail) => void;

  /** 是否在文件树首次就绪时自动展开目录并选中第一个文件 */
  @property({ type: Boolean })
  autoOpenFirstFile = false;

  /** 打开时指定要选中的文件路径（或节点 ID），会自动展开其祖先目录并触发 agent-file-open */
  @property()
  initialFilePath: string | null = null;

  /** 分栏比例 (0-1)，左侧为内容预览区 */
  @property({ type: Number })
  splitRatio = 0.5;

  /** 当前选中的文件预览源 */
  @state() private selectedFile: (FilePreviewSource & { name: string; path: string; size: number | null }) | null = null;

  /** file-tree 元素引用 */
  private treeRef: Ref<AgentFileTree> = litRef();
  private autoOpenedTree: FileNode | null = null;

  connectedCallback(): void {
    super.connectedCallback();
    // 在 host 元素上监听 composed 事件（跨 Shadow DOM 边界）
    this.addEventListener("agent-file-select", this.onFileSelectEvent as EventListener);
  }

  disconnectedCallback(): void {
    super.disconnectedCallback();
    this.removeEventListener("agent-file-select", this.onFileSelectEvent as EventListener);
  }

  updated(changedProps: Map<string, unknown>): void {
    // 已挂载后单独变更 initialFilePath 时，直接重新定位目标文件
    if (changedProps.has("initialFilePath") && this.initialFilePath && this.tree) {
      const fileTree = this.getFileTree();
      if (fileTree) {
        void fileTree.selectFileByPath(this.initialFilePath);
      }
    }

    if (!changedProps.has("tree") && !changedProps.has("autoOpenFirstFile")) return;
    if (!this.tree) {
      this.autoOpenedTree = null;
      return;
    }

    const tree = this.tree;
    const fileTree = this.getFileTree();
    if (!fileTree) return;

    void this.notifyTreeReady(tree, fileTree);
  }

  private async notifyTreeReady(tree: FileNode, fileTree: AgentFileTree): Promise<void> {
    await fileTree.updateComplete;
    if (this.tree !== tree) return;

    const detail = { tree };
    try {
      this.onTreeReady?.(detail);
    } catch (error) {
      console.error("[agent-file-explorer] onTreeReady callback failed:", error);
    }
    this.dispatchEvent(
      new CustomEvent<FileExplorerTreeReadyDetail>("agent-file-tree-ready", {
        detail,
        bubbles: true,
        composed: true,
      }),
    );

    if (this.autoOpenedTree === tree) return;
    this.autoOpenedTree = tree;

    if (this.initialFilePath) {
      const found = await fileTree.selectFileByPath(this.initialFilePath);
      if (!found && this.autoOpenFirstFile) {
        await this.openFirstFile();
      }
      return;
    }
    if (this.autoOpenFirstFile) {
      await this.openFirstFile();
    }
  }

  private getFileTree(): AgentFileTree | null {
    return this.shadowRoot?.querySelector("agent-file-tree") as AgentFileTree | null;
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
    this.setPreviewSource({ mode: "content", filename, content, imageUrl, filePath: path, fileSize: size });
  }

  /** 设置任意预览源，包括 OfficeCLI 嵌入预览和不支持类型提示。 */
  public setPreviewSource(source: FilePreviewSource): void {
    this.selectedFile = {
      ...source,
      name: source.filename,
      path: source.filePath ?? "",
      size: source.fileSize ?? null,
      content: source.content ?? "",
      imageUrl: source.imageUrl ?? null,
      previewUrl: source.previewUrl ?? null,
    };
  }

  /** 展开 file-tree 的所有目录 */
  public expandAll() {
    this.getFileTree()?.expandAll();
  }

  /** 折叠 file-tree 的所有目录 */
  public collapseAll() {
    this.getFileTree()?.collapseAll();
  }

  /** 展开文件树并打开第一个文件，适合 Agent 面板首次展示项目时使用 */
  public async openFirstFile(): Promise<void> {
    await this.updateComplete;
    const fileTree = this.getFileTree();
    if (!fileTree) return;
    await fileTree.updateComplete;
    fileTree.expandAll();
    fileTree.selectFirstFile();
  }

  /** 按路径（或节点 ID）打开指定文件：自动展开祖先目录、选中并触发 agent-file-open */
  public async openFile(path: string): Promise<boolean> {
    await this.updateComplete;
    const fileTree = this.getFileTree();
    if (!fileTree) return false;
    return fileTree.selectFileByPath(path);
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
            .previewMode=${this.selectedFile?.mode ?? "content"}
            .previewUrl=${this.selectedFile?.previewUrl ?? null}
            .unsupportedMessage=${this.selectedFile?.unsupportedMessage ?? "此文件类型暂不支持预览。"}
            .theme=${this.theme}
            .shikiTheme=${this.shikiTheme}
            .showBreadcrumb=${this.showBreadcrumb}
            .extraContextMenuActions=${this.extraContextMenuActions}
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
