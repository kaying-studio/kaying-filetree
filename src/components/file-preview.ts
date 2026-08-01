/**
 * <agent-file-preview> — 文件内容预览 Web Component
 * 对标 ChatGPT Codex 的文件内容区
 *
 * 使用 Shiki 进行语法高亮，支持 VS Code 主题
 * 支持图片预览
 */

import { LitElement, html, css, nothing, unsafeCSS } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import {
  createHighlighter,
  type Highlighter,
  type ThemeRegistration,
} from "shiki";
import { getShikiLang, isImageFile } from "../utils/file-types.js";
import { treesDefaultCSS, treesDarkTheme, treesLightTheme } from "../utils/theme.js";

export interface ContextMenuAction {
  id: string;
  label: string;
  shortcut?: string;
  /** 是否显示该操作；未指定则始终显示 */
  visible?: (selection: string) => boolean;
  /** 点击后的处理 */
  handler: (selection: string, fullContent: string, filename: string) => void;
}

@customElement("agent-file-preview")
export class AgentFilePreview extends LitElement {
  /** 文件名（用于语法高亮语言推断） */
  @property({ attribute: false })
  filename: string = "";

  /** 文件内容（文本） */
  @property({ attribute: false })
  content: string = "";

  /** 图片 URL（二进制文件时使用） */
  @property({ attribute: false })
  imageUrl: string | null = null;

  /** 文件完整路径（用于面包屑） */
  @property({ attribute: false })
  filePath: string = "";

  /** 文件大小（字节） */
  @property({ attribute: false })
  fileSize: number | null = null;

  /** 主题模式 */
  @property({ attribute: false })
  theme: "light" | "dark" | "system" = "dark";

  /** Shiki 主题名称 */
  @property({ attribute: false })
  shikiTheme: string = "github-dark";

  /** 右键菜单额外操作（可扩展） */
  @property({ attribute: false })
  extraContextMenuActions: ContextMenuAction[] = [];

  @state() private highlightedHtml: string = "";
  @state() private loading = false;
  @state() private error: string | null = null;
  @state() private contextMenu: { x: number; y: number; selection: string } | null = null;

  private highlighter: Highlighter | null = null;
  private currentTheme: "light" | "dark" = "dark";

  async connectedCallback(): Promise<void> {
    super.connectedCallback();
    this.updateTheme();
    await this.initHighlighter();
    this.highlightContent();
  }

  disconnectedCallback(): void {
    super.disconnectedCallback();
    // Shiki highlighter 不需要显式销毁
  }

  updated(changedProps: Map<string, unknown>): void {
    if (
      changedProps.has("content") ||
      changedProps.has("filename") ||
      changedProps.has("shikiTheme")
    ) {
      this.highlightContent();
    }
    if (changedProps.has("theme")) {
      this.updateTheme();
      this.highlightContent();
    }
  }

  private updateTheme() {
    this.currentTheme = this.theme === "system"
      ? (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light")
      : this.theme;
  }

  private async initHighlighter() {
    if (this.highlighter) return;
    try {
      this.loading = true;
      this.highlighter = await createHighlighter({
        themes: [this.shikiTheme],
        langs: ["javascript", "typescript", "jsx", "tsx", "python", "rust",
          "go", "json", "yaml", "bash", "html", "css", "scss", "markdown",
          "sql", "xml", "diff", "dockerfile", "toml", "ini", "text"],
      });
    } catch (e) {
      console.error("[agent-file-preview] Failed to init Shiki:", e);
      this.error = "Failed to initialize syntax highlighter";
    } finally {
      this.loading = false;
    }
  }

  private async highlightContent() {
    if (!this.content) {
      this.highlightedHtml = "";
      return;
    }

    // 等待 highlighter 初始化完成
    if (!this.highlighter) {
      await this.initHighlighter();
    }

    // 如果仍然没有 highlighter，回退到纯文本
    if (!this.highlighter) {
      this.highlightedHtml = `<pre class="shiki-fallback"><code>${this.escapeHtml(this.content)}</code></pre>`;
      return;
    }

    const lang = getShikiLang(this.filename);

    try {
      // 确保语言已加载
      if (!this.highlighter.getLoadedLanguages().includes(lang as never)) {
        await this.highlighter.loadLanguage(lang as never);
      }

      const rawHtml = this.highlighter.codeToHtml(this.content, {
        lang,
        theme: this.shikiTheme,
      });
      // 移除 Shiki 在 <span class="line"> 之间插入的格式化换行符，避免 <pre> 中渲染出额外空行
      this.highlightedHtml = rawHtml.replace(/\n/g, "");
    } catch {
      // 回退到纯文本
      this.highlightedHtml = `<pre class="shiki-fallback"><code>${this.escapeHtml(this.content)}</code></pre>`;
    }
  }

  private escapeHtml(text: string): string {
    const div = document.createElement("div");
    div.textContent = text;
    return div.innerHTML;
  }

  private getDefaultContextMenuActions(): ContextMenuAction[] {
    return [
      {
        id: "copy",
        label: "复制",
        shortcut: "Ctrl+C",
        handler: (selection, fullContent) => {
          const text = selection || fullContent;
          if (!text) return;
          this.copyText(text);
        },
      },
      {
        id: "add-to-agent",
        label: "添加到 agent",
        visible: (selection) => Boolean(selection),
        handler: (selection) => {
          if (!selection) return;
          this.dispatchEvent(
            new CustomEvent("agent-add-to-context", {
              detail: { text: selection, filename: this.filename },
              bubbles: true,
              composed: true,
            }),
          );
        },
      },
      {
        id: "google-search",
        label: "Google 搜索",
        visible: (selection) => Boolean(selection),
        handler: (selection) => {
          if (!selection) return;
          window.open(
            `https://www.google.com/search?q=${encodeURIComponent(selection)}`,
            "_blank",
            "noopener,noreferrer",
          );
        },
      },
    ];
  }

  private getAllContextMenuActions(): ContextMenuAction[] {
    return [...this.getDefaultContextMenuActions(), ...this.extraContextMenuActions];
  }

  private onContextMenu(e: MouseEvent) {
    // 只在代码/文本区域显示自定义右键菜单
    const target = e.composedPath()[0] as HTMLElement;
    if (!target) return;
    const isInCode =
      target.closest(".shiki-container") ||
      target.closest(".shiki-fallback") ||
      target.classList.contains("preview-content");
    if (!isInCode) return;

    e.preventDefault();
    const rect = this.getBoundingClientRect();
    this.contextMenu = {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
      selection: window.getSelection()?.toString() ?? "",
    };
  }

  private closeContextMenu() {
    this.contextMenu = null;
  }

  private async copyText(text: string) {
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      // 降级方案
      const textarea = document.createElement("textarea");
      textarea.value = text;
      textarea.style.position = "fixed";
      textarea.style.opacity = "0";
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand("copy");
      document.body.removeChild(textarea);
    }
  }

  private formatFileSize(bytes: number | null): string {
    if (bytes === null || bytes === undefined) return "";
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  }

  private renderBreadcrumb(): unknown {
    if (!this.filePath) return nothing;
    const parts = this.filePath.split(/[/\\]+/).filter(Boolean);
    return html`
      <div class="preview-breadcrumb">
        ${parts.map((part, i) => html`
          <span class="preview-breadcrumb-part ${i === parts.length - 1 ? "preview-breadcrumb-part--last" : ""}">${part}</span>
          ${i < parts.length - 1 ? html`<span class="preview-breadcrumb-separator">/</span>` : nothing}
        `)}
      </div>
    `;
  }

  private renderMeta(): unknown {
    const lines = this.content ? this.content.split(/\r?\n/).length : 0;
    const sizeText = this.formatFileSize(this.fileSize);
    const items = [
      lines > 0 ? `${lines} lines` : null,
      sizeText,
    ].filter(Boolean);
    if (items.length === 0) return nothing;
    return html`<span class="preview-meta">${items.join(" · ")}</span>`;
  }

  static styles = [
    unsafeCSS(treesDefaultCSS),
    css`
    :host {
      display: flex;
      flex-direction: column;
      height: 100%;
      overflow: hidden;
      background: var(--trees-bg);
      color: var(--trees-fg);
      font-family: var(--trees-font-family);
      font-size: var(--trees-font-size);
    }

    .preview-header {
      display: flex;
      flex-direction: column;
      gap: 2px;
      padding: 8px 12px;
      border-bottom: 1px solid var(--trees-border-color);
      flex-shrink: 0;
      background: var(--trees-bg);
    }

    .preview-breadcrumb {
      display: flex;
      align-items: center;
      gap: 4px;
      font-size: 12px;
      color: var(--trees-fg-muted);
      overflow: hidden;
      white-space: nowrap;
    }

    .preview-breadcrumb-part {
      overflow: hidden;
      text-overflow: ellipsis;
      max-width: 160px;
    }

    .preview-breadcrumb-part--last {
      color: var(--trees-fg);
      font-weight: var(--trees-font-weight-medium);
    }

    .preview-breadcrumb-separator {
      opacity: 0.5;
      padding: 0 2px;
    }

    .preview-filename-row {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 12px;
      min-height: 20px;
    }

    .preview-filename {
      font-size: var(--trees-font-size);
      font-weight: var(--trees-font-weight-medium);
      color: var(--trees-fg);
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .preview-meta {
      flex-shrink: 0;
      font-size: 11px;
      color: var(--trees-fg-muted);
    }

    .preview-content {
      flex: 1;
      overflow: auto;
      scrollbar-gutter: stable;
      user-select: text;
      position: relative;
    }

    .preview-content::-webkit-scrollbar {
      width: var(--trees-scrollbar-gutter);
      height: var(--trees-scrollbar-gutter);
    }

    .preview-content::-webkit-scrollbar-track {
      background: transparent;
    }

    .preview-content::-webkit-scrollbar-thumb {
      background: var(--trees-scrollbar-thumb);
      border-radius: calc(var(--trees-scrollbar-gutter) / 2);
    }

    /* Shiki 输出覆盖 */
    .shiki-container {
      padding: 0;
    }

    .shiki-container pre {
      margin: 0;
      padding: 0;
      background: transparent !important;
      font-family: ui-monospace, "SF Mono", "Cascadia Code", "JetBrains Mono", Menlo, Monaco, Consolas, monospace !important;
      font-size: 12.5px !important;
      line-height: 16px !important;
      white-space: pre !important;
      user-select: text;
      tab-size: 2;
    }

    .shiki-container pre code {
      font-family: inherit !important;
      counter-reset: line;
      display: block;
      padding: 6px 0;
    }

    /* 行号 */
    .shiki-container .line {
      display: block;
      padding: 0 16px 0 0;
      min-height: 16px;
      height: auto;
    }

    .shiki-container .line::before {
      counter-increment: line;
      content: counter(line);
      display: inline-block;
      width: 3em;
      margin-right: 12px;
      text-align: right;
      color: var(--trees-fg-muted);
      user-select: none;
    }

    .shiki-fallback {
      margin: 0;
      padding: 12px 16px;
      white-space: pre-wrap;
      word-break: break-all;
    }

    .image-container {
      display: flex;
      align-items: center;
      justify-content: center;
      height: 100%;
      padding: 16px;
    }

    .image-container img {
      max-width: 100%;
      max-height: 100%;
      object-fit: contain;
      border-radius: 4px;
    }

    .empty-state {
      display: flex;
      align-items: center;
      justify-content: center;
      height: 100%;
      color: var(--trees-fg-muted);
      font-size: 14px;
    }

    .loading {
      display: flex;
      align-items: center;
      justify-content: center;
      height: 100%;
      color: var(--trees-fg-muted);
    }

    .context-menu {
      position: absolute;
      min-width: 140px;
      background: var(--trees-bg-muted);
      border: 1px solid var(--trees-border-color);
      border-radius: 6px;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.25);
      padding: 4px 0;
      z-index: 100;
      font-size: 13px;
      user-select: none;
    }

    .context-menu-item {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 6px 12px;
      color: var(--trees-fg);
      cursor: pointer;
      transition: background 0.1s ease;
    }

    .context-menu-item:hover {
      background: var(--trees-hover-bg);
    }

    .context-menu-shortcut {
      margin-left: auto;
      color: var(--trees-fg-muted);
      font-size: 11px;
    }
    `,
  ];

  render(): unknown {
    const isSvgFile = this.filename.toLowerCase().endsWith(".svg") && this.content.trim().startsWith("<svg");
    const isImage = this.filename && isImageFile(this.filename) && !isSvgFile && (this.imageUrl ?? this.content.startsWith("data:"));

    return html`
      ${this.filename
        ? html`
            <div class="preview-header">
              ${this.renderBreadcrumb()}
              <div class="preview-filename-row">
                <span class="preview-filename">${this.filename}</span>
                ${this.renderMeta()}
              </div>
            </div>
          `
        : nothing}
      <div
        class="preview-content"
        @contextmenu=${this.onContextMenu}
        @click=${this.closeContextMenu}
        @keydown=${(e: KeyboardEvent) => e.key === "Escape" && this.closeContextMenu()}
      >
        ${this.loading
          ? html`<div class="loading">Loading...</div>`
          : isSvgFile
            ? html`
                <div class="image-container">
                  <img src=${`data:image/svg+xml;utf8,${encodeURIComponent(this.content)}`} alt=${this.filename} />
                </div>
              `
            : isImage
              ? html`
                  <div class="image-container">
                    <img
                      src=${this.imageUrl ?? this.content}
                      alt=${this.filename}
                    />
                  </div>
                `
              : this.highlightedHtml
                ? html`<div class="shiki-container" .innerHTML=${this.highlightedHtml}></div>`
                : html`<div class="empty-state">Select a file to preview</div>`}
        ${this.contextMenu
          ? html`
              <div
                class="context-menu"
                style=${`left:${this.contextMenu.x}px;top:${this.contextMenu.y}px`}
                @click=${(e: Event) => e.stopPropagation()}
              >
                ${this.getAllContextMenuActions()
                  .filter((action) => !action.visible || action.visible(this.contextMenu!.selection))
                  .map(
                    (action) => html`
                      <div
                        class="context-menu-item"
                        data-action-id=${action.id}
                        @click=${() =>
                          action.handler(this.contextMenu!.selection, this.content, this.filename)}
                      >
                        <span>${action.label}</span>
                        ${action.shortcut
                          ? html`<span class="context-menu-shortcut">${action.shortcut}</span>`
                          : nothing}
                      </div>
                    `,
                  )}
              </div>
            `
          : nothing}
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "agent-file-preview": AgentFilePreview;
  }
}
