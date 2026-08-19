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
import { marked } from "marked";
import { getShikiLang, isImageFile, isMarkdownFile } from "../utils/file-types.js";
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

  /** 是否显示文件路径面包屑 */
  @property({ type: Boolean })
  showBreadcrumb = true;

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
  @state() private markdownHtml: string = "";
  @state() private markdownView: "rendered" | "source" = "rendered";
  @state() private loading = false;
  @state() private error: string | null = null;
  @state() private contextMenu: { x: number; y: number; selection: string } | null = null;

  private highlighter: Highlighter | null = null;
  private highlighterPromise: Promise<void> | null = null;
  private currentTheme: "light" | "dark" = "dark";

  private get isMarkdown(): boolean {
    return isMarkdownFile(this.filename);
  }

  async connectedCallback(): Promise<void> {
    super.connectedCallback();
    this.updateTheme();
    await this.initHighlighter();
    this.renderFileContent();
  }

  disconnectedCallback(): void {
    super.disconnectedCallback();
    // Shiki highlighter 不需要显式销毁
  }

  updated(changedProps: Map<string, unknown>): void {
    if (
      changedProps.has("content") ||
      changedProps.has("filename") ||
      changedProps.has("shikiTheme") ||
      changedProps.has("markdownView")
    ) {
      this.renderFileContent();
    }
    if (changedProps.has("theme")) {
      this.updateTheme();
      this.renderFileContent();
    }
  }

  private renderFileContent(): void {
    if (this.isMarkdown && this.markdownView === "rendered") {
      void this.renderMarkdown();
    } else {
      void this.highlightContent();
    }
  }

  private updateTheme() {
    this.currentTheme = this.theme === "system"
      ? (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light")
      : this.theme;
  }

  private async initHighlighter(): Promise<void> {
    const theme = this.shikiTheme;
    if (this.highlighter?.getLoadedThemes().includes(theme)) return;

    if (!this.highlighterPromise) {
      this.highlighterPromise = this.loadHighlighterTheme(theme);
    }
    await this.highlighterPromise;
    this.highlighterPromise = null;

    // The theme can change while Shiki is loading. Ensure the latest theme is
    // available before the caller tries to render with it.
    if (this.shikiTheme !== theme && !this.highlighter?.getLoadedThemes().includes(this.shikiTheme)) {
      await this.initHighlighter();
    }
  }

  private async loadHighlighterTheme(theme: string): Promise<void> {
    try {
      this.loading = true;
      if (!this.highlighter) {
        this.highlighter = await createHighlighter({
          themes: [theme],
          langs: [
            "javascript", "typescript", "jsx", "tsx", "python", "rust", "lua",
            "go", "json", "yaml", "bash", "html", "css", "scss", "markdown",
            "sql", "xml", "diff", "dockerfile", "toml", "ini", "text",
          ],
        });
      } else if (!this.highlighter.getLoadedThemes().includes(theme)) {
        // Consumers may provide any registered Shiki theme name at runtime.
        await this.highlighter.loadTheme(theme as never);
      }
      this.error = null;
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

    // 等待 highlighter 初始化完成，并确保当前主题已经加载
    await this.initHighlighter();

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

  /** Markdown 内容渲染为 HTML，并用 Shiki 高亮其中的代码块 */
  private async renderMarkdown(): Promise<void> {
    if (!this.content) {
      this.markdownHtml = "";
      return;
    }

    try {
      const rawHtml = marked.parse(this.content, { async: false, gfm: true }) as string;
      this.markdownHtml = await this.highlightMarkdownCode(rawHtml);
    } catch (e) {
      console.error("[agent-file-preview] Failed to render markdown:", e);
      this.markdownHtml = `<pre class="shiki-fallback"><code>${this.escapeHtml(this.content)}</code></pre>`;
    }
  }

  private async highlightMarkdownCode(htmlContent: string): Promise<string> {
    const doc = new DOMParser().parseFromString(htmlContent, "text/html");
    const codeBlocks = doc.querySelectorAll("pre > code");
    if (codeBlocks.length === 0) return htmlContent;

    await this.initHighlighter();
    if (!this.highlighter) return doc.body.innerHTML;

    for (const block of Array.from(codeBlocks)) {
      let lang = (block.className.match(/language-([\w+-]+)/)?.[1] ?? "text").toLowerCase();
      if (!this.highlighter.getLoadedLanguages().includes(lang as never)) {
        try {
          await this.highlighter.loadLanguage(lang as never);
        } catch {
          lang = "text";
        }
      }
      try {
        const highlighted = this.highlighter.codeToHtml(block.textContent ?? "", {
          lang,
          theme: this.shikiTheme,
        });
        const template = document.createElement("template");
        template.innerHTML = highlighted;
        block.parentElement?.replaceWith(template.content);
      } catch {
        // 保留原始代码块
      }
    }
    return doc.body.innerHTML;
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
    if (!this.showBreadcrumb || !this.filePath) return nothing;
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

  private renderMarkdownToggle(): unknown {
    if (!this.isMarkdown) return nothing;
    return html`
      <div class="md-toggle" data-markdown-toggle="true">
        <button
          class="md-toggle-btn ${this.markdownView === "rendered" ? "active" : ""}"
          @click=${(e: Event) => {
            e.stopPropagation();
            this.markdownView = "rendered";
          }}
        >预览</button>
        <button
          class="md-toggle-btn ${this.markdownView === "source" ? "active" : ""}"
          @click=${(e: Event) => {
            e.stopPropagation();
            this.markdownView = "source";
          }}
        >源码</button>
      </div>
    `;
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

    .preview-header-right {
      display: flex;
      align-items: center;
      gap: 10px;
      flex-shrink: 0;
    }

    .preview-meta {
      flex-shrink: 0;
      font-size: 11px;
      color: var(--trees-fg-muted);
    }

    /* === Markdown 预览/源码切换 === */
    .md-toggle {
      display: flex;
      align-items: center;
      flex-shrink: 0;
      gap: 2px;
      padding: 2px;
      border: 1px solid var(--trees-border-color);
      border-radius: 5px;
      background: var(--trees-bg-muted);
      user-select: none;
    }

    .md-toggle-btn {
      border: none;
      background: transparent;
      color: var(--trees-fg-muted);
      font-size: 11px;
      line-height: 1;
      padding: 4px 8px;
      border-radius: 3px;
      cursor: pointer;
      transition: background 0.12s ease, color 0.12s ease;
    }

    .md-toggle-btn:hover {
      color: var(--trees-fg);
    }

    .md-toggle-btn.active {
      background: var(--trees-selected-bg);
      color: var(--trees-accent);
      font-weight: var(--trees-font-weight-medium);
    }

    /* === Markdown 渲染 === */
    .markdown-container {
      padding: 16px 20px;
    }

    .markdown-body {
      font-size: 13px;
      line-height: 1.6;
      color: var(--trees-fg);
      word-wrap: break-word;
    }

    .markdown-body > :first-child {
      margin-top: 0;
    }

    .markdown-body h1,
    .markdown-body h2,
    .markdown-body h3,
    .markdown-body h4,
    .markdown-body h5,
    .markdown-body h6 {
      margin: 1.2em 0 0.5em;
      line-height: 1.25;
      font-weight: var(--trees-font-weight-medium);
    }

    .markdown-body h1 {
      font-size: 1.6em;
      border-bottom: 1px solid var(--trees-border-color);
      padding-bottom: 0.3em;
    }

    .markdown-body h2 {
      font-size: 1.35em;
      border-bottom: 1px solid var(--trees-border-color);
      padding-bottom: 0.3em;
    }

    .markdown-body h3 {
      font-size: 1.15em;
    }

    .markdown-body h4,
    .markdown-body h5,
    .markdown-body h6 {
      font-size: 1em;
    }

    .markdown-body p {
      margin: 0.6em 0;
    }

    .markdown-body a {
      color: var(--trees-accent);
      text-decoration: none;
    }

    .markdown-body a:hover {
      text-decoration: underline;
    }

    .markdown-body ul,
    .markdown-body ol {
      padding-left: 1.6em;
      margin: 0.6em 0;
    }

    .markdown-body li {
      margin: 0.25em 0;
    }

    .markdown-body blockquote {
      margin: 0.6em 0;
      padding: 0.25em 1em;
      border-left: 3px solid var(--trees-accent);
      background: var(--trees-bg-muted);
      color: var(--trees-fg-muted);
      border-radius: 0 4px 4px 0;
    }

    .markdown-body pre {
      overflow: auto;
      border-radius: 6px;
      margin: 0.8em 0;
    }

    .markdown-body pre.shiki {
      background: var(--trees-bg-muted) !important;
      padding: 12px;
      font-family: ui-monospace, "SF Mono", "Cascadia Code", "JetBrains Mono", Menlo, Monaco, Consolas, monospace !important;
      font-size: 12.5px !important;
      line-height: 16px !important;
      overflow-x: auto;
    }

    .markdown-body pre.shiki code {
      font-family: inherit !important;
    }

    .markdown-body code {
      font-family: ui-monospace, "SF Mono", "Cascadia Code", "JetBrains Mono", Menlo, Monaco, Consolas, monospace !important;
    }

    .markdown-body :not(pre) > code {
      background: var(--trees-bg-muted);
      border: 1px solid var(--trees-border-color);
      border-radius: 4px;
      padding: 1px 5px;
      font-size: 12px;
    }

    .markdown-body table {
      border-collapse: collapse;
      margin: 0.8em 0;
      display: block;
      overflow-x: auto;
      max-width: 100%;
    }

    .markdown-body th,
    .markdown-body td {
      border: 1px solid var(--trees-border-color);
      padding: 6px 12px;
    }

    .markdown-body th {
      background: var(--trees-bg-muted);
      font-weight: var(--trees-font-weight-medium);
    }

    .markdown-body img {
      max-width: 100%;
      border-radius: 4px;
    }

    .markdown-body hr {
      border: none;
      border-top: 1px solid var(--trees-border-color);
      margin: 1.5em 0;
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
    const showMarkdown = this.isMarkdown && this.markdownView === "rendered";

    return html`
      ${this.filename
        ? html`
            <div class="preview-header">
              ${this.renderBreadcrumb()}
              <div class="preview-filename-row">
                <span class="preview-filename">${this.filename}</span>
                <div class="preview-header-right">
                  ${this.renderMarkdownToggle()}
                  ${this.renderMeta()}
                </div>
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
              : showMarkdown
                ? this.markdownHtml
                  ? html`<div class="markdown-container markdown-body" data-markdown-preview="true" .innerHTML=${this.markdownHtml}></div>`
                  : html`<div class="empty-state">Select a file to preview</div>`
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
