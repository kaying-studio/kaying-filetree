/**
 * --trees-* CSS 变量主题系统
 * 对标 ChatGPT Codex 的三层优先级：
 *   1. --trees-*-override  (显式覆盖)
 *   2. --trees-theme-*     (Shiki/VS Code 主题 token)
 *   3. defaults
 *
 * Theme variable names mirror Shiki/VS Code theme file JSON tokens.
 */

/** 注入到 Shadow DOM 内的 :host 上的默认 CSS 变量 */
export const treesDefaultCSS = `
:host {
  /* === 颜色 === */
  --trees-fg: var(--trees-fg-override, var(--trees-theme-foreground, #d4d4d4));
  --trees-fg-muted: var(--trees-fg-muted-override, var(--trees-theme-foreground-muted, #8e8e8e));
  --trees-bg: var(--trees-bg-override, var(--trees-theme-background, #1e1e1e));
  --trees-bg-muted: var(--trees-bg-muted-override, var(--trees-theme-background-muted, #2d2d2d));
  --trees-accent: var(--trees-accent-override, var(--trees-theme-accent, #4a9eff));
  --trees-border-color: var(--trees-border-color-override, var(--trees-theme-border, #3e3e3e));

  /* === 焦点环 === */
  --trees-focus-ring-color: var(--trees-focus-ring-color-override, var(--trees-focus-ring-color, #4a9eff));
  --trees-focus-ring-width: var(--trees-focus-ring-width-override, 2px);
  --trees-focus-ring-offset: var(--trees-focus-ring-offset-override, 1px);

  /* === 搜索 === */
  --trees-search-fg: var(--trees-search-fg-override, #ffffff);
  --trees-search-font-weight: var(--trees-search-font-weight-override, 600);
  --trees-search-bg: var(--trees-search-bg-override, rgba(74, 158, 255, 0.2));

  /* === 选中 === */
  --trees-selected-fg: var(--trees-selected-fg-override, #ffffff);
  --trees-selected-bg: var(--trees-selected-bg-override, rgba(74, 158, 255, 0.15));
  --trees-selected-border: var(--trees-selected-border-override, rgba(74, 158, 255, 0.55));
  --trees-selected-focused-border-color: var(--trees-selected-focused-border-color-override, #4a9eff);

  /* === 悬停 === */
  --trees-hover-bg: var(--trees-hover-bg-override, rgba(255, 255, 255, 0.06));

  /* === Git 状态 === */
  --trees-git-modified: var(--trees-git-modified-override, #e2c08d);
  --trees-git-added: var(--trees-git-added-override, #81b88b);
  --trees-git-deleted: var(--trees-git-deleted-override, #c74e39);
  --trees-git-renamed: var(--trees-git-renamed-override, #73a4ff);
  --trees-git-untracked: var(--trees-git-untracked-override, #73a4ff);

  /* === 布局 === */
  --trees-row-height: 20px;
  --trees-row-indent: 14px;
  --trees-icon-size: 14px;
  --trees-chevron-size: 14px;
  --trees-font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
  --trees-font-size: 12px;
  --trees-font-weight-regular: 400;
  --trees-font-weight-medium: 500;

  /* === 滚动条 === */
  --trees-scrollbar-gutter: 6px;
  --trees-scrollbar-thumb: rgba(255, 255, 255, 0.1);

  /* === 间距 === */
  --trees-icon-nudge: 1px;
  --trees-padding-left: 8px;
  --trees-padding-right: 8px;
}
`;

/** 亮色主题变量 */
export const treesLightTheme = `
:host {
  --trees-theme-foreground: #1e1e1e;
  --trees-theme-foreground-muted: #6b6b6b;
  --trees-theme-background: #ffffff;
  --trees-theme-background-muted: #f0f0f0;
  --trees-theme-accent: #0066cc;
  --trees-theme-border: #e0e0e0;
  --trees-hover-bg: rgba(0, 0, 0, 0.04);
  --trees-selected-bg: rgba(0, 102, 204, 0.08);
  --trees-scrollbar-thumb: rgba(0, 0, 0, 0.1);
}
`;

/** 暗色主题变量 */
export const treesDarkTheme = `
:host {
  --trees-theme-foreground: #d4d4d4;
  --trees-theme-foreground-muted: #8e8e8e;
  --trees-theme-background: #1e1e1e;
  --trees-theme-background-muted: #2d2d2d;
  --trees-theme-accent: #4a9eff;
  --trees-theme-border: #3e3e3e;
  --trees-hover-bg: rgba(255, 255, 255, 0.04);
  --trees-selected-bg: rgba(74, 158, 255, 0.15);
  --trees-scrollbar-thumb: rgba(255, 255, 255, 0.1);
}
`;

/** 主题模式 */
export type TreesThemeMode = "light" | "dark" | "system";

/** 根据系统偏好自动切换主题 */
export function getSystemTheme(): "light" | "dark" {
  if (typeof window === "undefined") return "dark";
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}
