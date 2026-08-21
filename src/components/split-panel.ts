/**
 * <agent-split-panel> — 可拖拽分栏面板
 * 对标 ChatGPT Codex 的自研拖拽分隔条 (data-resizer-name + pointerdown)
 *
 * 支持左右、上下两种布局
 */

import { LitElement, html, css } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { styleMap } from "lit/directives/style-map.js";
import { ref as litRef, type Ref } from "lit/directives/ref.js";

@customElement("agent-split-panel")
export class AgentSplitPanel extends LitElement {
  /** 布局方向 */
  @property({ type: String })
  direction: "horizontal" | "vertical" = "horizontal";

  /** 左/上面板初始大小比例 (0-1) */
  @property({ type: Number })
  initialRatio = 0.3;

  /** 最小比例 */
  @property({ type: Number })
  minRatio = 0.1;

  /** 最大比例 */
  @property({ type: Number })
  maxRatio = 0.9;

  /** 分隔条大小 (px) */
  @property({ type: Number })
  dividerSize = 4;

  @state() private ratio = 0.3;
  @state() private isDragging = false;

  private hostRef: Ref<HTMLElement> = litRef();

  willUpdate(changedProps: Map<string, unknown>): void {
    if (changedProps.has("initialRatio")) {
      this.ratio = this.initialRatio;
    }
  }

  private onDividerPointerDown(e: PointerEvent) {
    e.preventDefault();
    this.isDragging = true;

    const target = e.currentTarget as HTMLElement;
    target.setPointerCapture(e.pointerId);

    const host = this.hostRef.value;
    if (!host) return;

    const rect = host.getBoundingClientRect();
    const isHorizontal = this.direction === "horizontal";

    const onPointerMove = (ev: PointerEvent) => {
      if (!this.isDragging) return;

      const offset = isHorizontal
        ? ev.clientX - rect.left
        : ev.clientY - rect.top;
      const total = isHorizontal ? rect.width : rect.height;
      let newRatio = offset / total;

      // 限制范围
      newRatio = Math.max(this.minRatio, Math.min(this.maxRatio, newRatio));
      this.ratio = newRatio;

      // 派发事件
      this.dispatchEvent(
        new CustomEvent("agent-split-resize", {
          detail: { ratio: this.ratio },
          bubbles: true,
          composed: true,
        }),
      );
    };

    const onPointerUp = (ev: PointerEvent) => {
      this.isDragging = false;
      target.releasePointerCapture(ev.pointerId);
      target.removeEventListener("pointermove", onPointerMove);
      target.removeEventListener("pointerup", onPointerUp);
    };

    target.addEventListener("pointermove", onPointerMove);
    target.addEventListener("pointerup", onPointerUp);
  }

  static styles = css`
    :host {
      display: flex;
      width: 100%;
      height: 100%;
      overflow: hidden;
    }

    :host([direction="vertical"]) {
      flex-direction: column;
    }

    .split-root {
      display: flex;
      width: 100%;
      height: 100%;
      overflow: hidden;
    }

    .split-root[direction="vertical"] {
      flex-direction: column;
    }

    .panel {
      overflow: hidden;
      flex-shrink: 0;
    }

    .panel--second {
      flex: 1;
      flex-grow: 1;
    }

    .divider {
      flex-shrink: 0;
      background: var(--trees-border-color, #3e3e3e);
      cursor: col-resize;
      user-select: none;
      transition: background 0.15s ease;
      position: relative;
      z-index: 1;
    }

    :host([direction="vertical"]) .divider {
      cursor: row-resize;
    }

    .divider:hover,
    .divider[data-dragging="true"] {
      background: var(--trees-accent, #4a9eff);
    }

    .divider::after {
      content: "";
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      width: 2px;
      height: 24px;
      background: var(--trees-fg-muted, #8e8e8e);
      border-radius: 1px;
      opacity: 0.3;
    }

    :host([direction="vertical"]) .divider::after {
      width: 24px;
      height: 2px;
    }
  `;

  render(): unknown {
    const isHorizontal = this.direction === "horizontal";
    const firstSize = `calc(${this.ratio * 100}% - ${this.dividerSize / 2}px)`;
    const secondSize = `calc(${(1 - this.ratio) * 100}% - ${this.dividerSize / 2}px)`;

    return html`
      <div
        class="split-root"
        direction=${this.direction}
        ${litRef(this.hostRef)}
      >
        <div
          class="panel panel--first"
          style=${styleMap({
            width: isHorizontal ? firstSize : "100%",
            height: isHorizontal ? "100%" : firstSize,
          })}
        >
          <slot name="first"></slot>
        </div>
        <div
          class="divider"
          data-resizer-name="split-panel-divider"
          role="separator"
          aria-orientation=${isHorizontal ? "vertical" : "horizontal"}
          data-dragging=${this.isDragging ? "true" : "false"}
          style=${styleMap({
            width: isHorizontal ? `${this.dividerSize}px` : "100%",
            height: isHorizontal ? "100%" : `${this.dividerSize}px`,
          })}
          @pointerdown=${this.onDividerPointerDown}
        ></div>
        <div
          class="panel panel--second"
          style=${styleMap({
            width: isHorizontal ? secondSize : "100%",
            height: isHorizontal ? "100%" : secondSize,
          })}
        >
          <slot name="second"></slot>
        </div>
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "agent-split-panel": AgentSplitPanel;
  }
}
